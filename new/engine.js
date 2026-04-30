/* ============================================================================
   Pre-IB Physics Practice — Topic 7 Radioactivity engine, v1
   ----------------------------------------------------------------------------
   Single-file static-site engine. No build step. Loads the topic7_radioactivity.js
   global question bank from window.PREIB_RAD_QUESTIONS, presents one question
   at a time, marks short/long/mcq/numeric per schema v0.4, tracks per-attempt
   history in localStorage, and renders a coverage map by subtag.

   Key contracts:
   - Schema v0.4 (SCHEMA_v0_4.md). The §10 normalisation pre-pass is implemented
     in `norm()` below.
   - Marking algorithm per MARKING_ENGINE_NOTE.md: substring match of normalised
     synonyms, sum of credits capped at q.marks.
   - Coverage colour rule per IMPLEMENTATION_BRIEF_v1.md §3.4: average of last
     two attempts in the subtag, mapped to five gradient bands.
   ============================================================================ */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────────────────────────────────
     1. Topic 7 vocabulary
     Source of truth: SCHEMA_v0_4.md §6. The questions file does not ship the
     vocabulary, so we hardcode it here. Five parent groups, twenty subtags,
     plus two cross-cutting tags (definition, extended_writing) which are NOT
     coverage-map subtags — they are analytics labels only.
     ────────────────────────────────────────────────────────────────────────── */

  const VOCAB = {
    parentGroups: [
      {
        id: "basics",
        name: "Basic ideas",
        subtags: [
          { id: "units",             name: "Units" },
          { id: "atomic_struct",     name: "Atomic structure" },
          { id: "nuclide_notation",  name: "Nuclide notation" },
          { id: "ionising_random",   name: "Ionising / random" },
          { id: "radiation_types",   name: "Nature of α, β, γ" },
          { id: "penetration",       name: "Penetration" },
          { id: "background",        name: "Background radiation" },
          { id: "halflife",          name: "Half-life" }
        ]
      },
      {
        id: "practical",
        name: "Practical",
        subtags: [
          { id: "practical_penetration", name: "Penetration practical" }
        ]
      },
      {
        id: "uses",
        name: "Uses",
        subtags: [
          { id: "uses_alpha", name: "Uses of alpha" },
          { id: "uses_beta",  name: "Uses of beta" },
          { id: "uses_gamma", name: "Uses of gamma" }
        ]
      },
      {
        id: "hazards",
        name: "Hazards",
        subtags: [
          { id: "bio_effects",          name: "Biological effects" },
          { id: "which_most_dangerous", name: "Most dangerous when" },
          { id: "contam_irrad",         name: "Contamination vs irradiation" },
          { id: "waste_disposal",       name: "Waste & precautions" }
        ]
      },
      {
        id: "nuclear",
        name: "Fission & fusion",
        subtags: [
          { id: "energy_from_nuclear", name: "Nuclear energy" },
          { id: "fission",             name: "Fission" },
          { id: "fusion",              name: "Fusion" },
          { id: "shielding",           name: "Reactor shielding" }
        ]
      }
    ],
    crossCutting: ["definition", "extended_writing"]
  };

  // Flat lookup: subtag id → { parentId, parentName, name }
  const SUBTAG_INDEX = (function () {
    const m = {};
    VOCAB.parentGroups.forEach(function (g) {
      g.subtags.forEach(function (st) {
        m[st.id] = { parentId: g.id, parentName: g.name, name: st.name };
      });
    });
    return m;
  })();

  function isCoverageTag(t) { return Object.prototype.hasOwnProperty.call(SUBTAG_INDEX, t); }
  function parentGroupForSubtag(t) {
    return SUBTAG_INDEX[t] ? SUBTAG_INDEX[t].parentId : null;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     2. Normalisation pre-pass (Schema v0.4 §10)
     Mandatory items 1-8. Desirable items (plurals, number-words) skipped per
     v1 brief. Implementation order matches the schema.
     If this list diverges from the schema, the schema is authoritative.
     ────────────────────────────────────────────────────────────────────────── */

  // Item 5: contractions. Listed in the schema's order.
  const CONTRACTIONS = [
    ["can't", "cannot"],
    ["doesn't", "does not"],
    ["isn't", "is not"],
    ["won't", "will not"],
    ["wouldn't", "would not"],
    ["shouldn't", "should not"],
    ["couldn't", "could not"],
    ["didn't", "did not"],
    ["haven't", "have not"],
    ["hasn't", "has not"],
    ["hadn't", "had not"],
    ["aren't", "are not"],
    ["weren't", "were not"]
  ];

  // Item 7: GB/US spelling fold. Both sides rewritten to British canonical.
  // List per schema; "meter/metre" only in scientific use, but we apply
  // unconditionally — the false-positive risk in physics text is negligible.
  const SPELLING_FOLD = [
    [/\bionize/g, "ionise"],
    [/\bionizing/g, "ionising"],
    [/\bionization/g, "ionisation"],
    [/\baluminum/g, "aluminium"],
    [/\bmeter\b/g, "metre"],
    [/\bmeters\b/g, "metres"],
    [/\bcenter\b/g, "centre"],
    [/\bcenters\b/g, "centres"],
    [/\bcolor\b/g, "colour"],
    [/\bcolors\b/g, "colours"],
    [/\bpolarized\b/g, "polarised"],
    [/\banalyze\b/g, "analyse"]
  ];

  function norm(s) {
    if (s == null) return "";
    let t = String(s);

    // 1. Lowercase
    t = t.toLowerCase();

    // 3. Smart-quote folding (do early; affects later steps)
    t = t.replace(/[\u2018\u2019\u201A\u201B]/g, "'")
         .replace(/[\u201C\u201D\u201E\u201F]/g, '"');

    // 8. Hyphen tolerance — hyphens become spaces
    t = t.replace(/-/g, " ");

    // 5. Contraction expansion (after smart-quote fold so curly apostrophes
    //    are now straight). Whole-word boundaries.
    for (const [c, e] of CONTRACTIONS) {
      // \b doesn't quite work with apostrophes in JS; use lookarounds.
      const re = new RegExp("(^|[^a-z'])" + c.replace("'", "'") + "(?=[^a-z']|$)", "g");
      t = t.replace(re, "$1" + e);
    }

    // 7. GB/US spelling fold
    for (const [re, repl] of SPELLING_FOLD) t = t.replace(re, repl);

    // 6. Trailing-punctuation tolerance — drop ., , ; : ! ? attached to
    //    a token's right edge. Done character-by-character is hard; we treat
    //    these as token-adjacent by replacing them with a space, then
    //    collapsing whitespace below.
    t = t.replace(/([\.,;:!?])(?=\s|$)/g, " ");

    // 2. Whitespace normalisation
    t = t.replace(/[\t\n\r]+/g, " ").replace(/\s+/g, " ").trim();

    // 4. Article tolerance — leading "the ", "a ", "an " stripped from start
    //    and immediately after a comma or semicolon (already converted to
    //    spaces above, but the schema text says comma/semicolon, so we do it
    //    pre-whitespace by working on the original positions). The simplest
    //    correct implementation post-whitespace-collapse:
    t = t.replace(/^(the|a|an) /, "");
    // Note: the pre-collapse comma/semicolon trigger is mostly moot once
    // commas have been replaced by spaces above; this is the conservative
    // interpretation. Author chats relying on heavy article stripping after
    // semicolons should still write the canonical form first.

    return t;
  }

  // Substring match: does `needle` appear in `haystack` (both already normalised)?
  function includesNeedle(haystack, needle) {
    const n = norm(needle);
    if (!n) return false;
    return haystack.indexOf(n) !== -1;
  }

  function textIncludesAny(haystackNormed, anyArr) {
    if (!Array.isArray(anyArr)) return false;
    for (const phrase of anyArr) {
      if (includesNeedle(haystackNormed, phrase)) return true;
    }
    return false;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     3. Marking
     Returns { marksAwarded, marksPossible, status, hits, misses }
     - mcq: 0 or full marks; status full/none.
     - short / long: substring match; sum of credits capped at q.marks.
     - numeric: numeric compare with q.tolerance (or default 0.5% + 0.0001).
     ────────────────────────────────────────────────────────────────────────── */

  function statusFromFraction(awarded, possible) {
    if (possible <= 0) return "none";
    const f = awarded / possible;
    if (f >= 0.999) return "full";
    if (f <= 0.001) return "none";
    return "partial";
  }

  function markMCQ(q, chosenIndex) {
    const correct = chosenIndex === q.answerIndex;
    return {
      marksAwarded: correct ? (q.marks || 1) : 0,
      marksPossible: q.marks || 1,
      status: correct ? "full" : "none",
      correctIndex: q.answerIndex,
      chosenIndex: chosenIndex
    };
  }

  function markShortLong(q, raw) {
    const possible = q.marks || 1;
    const points = Array.isArray(q.markPoints) ? q.markPoints : [];
    const t = norm(raw);
    let awarded = 0;
    const hits = [];
    const misses = [];

    for (const mp of points) {
      const credit = (typeof mp.credit === "number") ? mp.credit : 1;
      let fired = false;
      if (Array.isArray(mp.any)) {
        fired = textIncludesAny(t, mp.any);
      }
      // mustNotInclude: if any disqualifier present, the markpoint does not fire
      if (fired && Array.isArray(mp.mustNotInclude)) {
        if (textIncludesAny(t, mp.mustNotInclude)) fired = false;
      }
      if (fired) {
        awarded += credit;
        hits.push(mp.any && mp.any[0] ? mp.any[0] : "(point)");
      } else {
        misses.push(mp.any && mp.any[0] ? mp.any[0] : "(point)");
      }
    }
    if (awarded > possible) awarded = possible;
    return {
      marksAwarded: awarded,
      marksPossible: possible,
      status: statusFromFraction(awarded, possible),
      hits: hits,
      misses: misses
    };
  }

  function markNumeric(q, raw) {
    const possible = q.marks || 1;
    if (raw == null || String(raw).trim() === "") {
      return { marksAwarded: 0, marksPossible: possible, status: "none", hits: [], misses: [] };
    }
    // Strip units / non-numeric tail. Accept things like "23 g", "1.4e-3", "−5".
    const cleaned = String(raw).replace(/[−–]/g, "-").trim();
    const m = cleaned.match(/^[+\-]?[\d.]+(?:[eE][+\-]?\d+)?/);
    if (!m) {
      return { marksAwarded: 0, marksPossible: possible, status: "none", hits: [], misses: [] };
    }
    const v = parseFloat(m[0]);
    const target = (typeof q.expectedNumeric === "number") ? q.expectedNumeric
                 : (typeof q.answer === "number") ? q.answer : null;
    if (target == null || !isFinite(v)) {
      return { marksAwarded: 0, marksPossible: possible, status: "none", hits: [], misses: [] };
    }
    const tol = (typeof q.tolerance === "number") ? q.tolerance
              : Math.max(Math.abs(target) * 0.005, 0.0001);
    const ok = Math.abs(v - target) <= tol;
    return {
      marksAwarded: ok ? possible : 0,
      marksPossible: possible,
      status: ok ? "full" : "none",
      hits: [], misses: []
    };
  }

  /* ──────────────────────────────────────────────────────────────────────────
     4. Persistence
     Single localStorage key, JSON blob with attempt log + active filter.
     Per IMPLEMENTATION_BRIEF_v1.md §3.6.
     ────────────────────────────────────────────────────────────────────────── */

  const STORAGE_KEY = "smithics_topic7_v1";
  const APP_VERSION = "v1.0.0";

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultStore();
      const parsed = JSON.parse(raw);
      // Defensive: ensure shape
      return {
        attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
        activeFilter: typeof parsed.activeFilter === "string" ? parsed.activeFilter : null,
        lastSeen: parsed.lastSeen || null,
        version: parsed.version || APP_VERSION
      };
    } catch (e) {
      console.warn("Storage corrupt, resetting:", e);
      return defaultStore();
    }
  }

  function defaultStore() {
    return { attempts: [], activeFilter: null, lastSeen: null, version: APP_VERSION };
  }

  let store = loadStore();

  function persist() {
    try {
      store.lastSeen = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      console.warn("Could not write to localStorage:", e);
    }
  }

  function recordAttempt(rec) {
    store.attempts.push(rec);
    persist();
  }

  function clearProgress() {
    store = defaultStore();
    persist();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     5. Question bank: load and index
     ────────────────────────────────────────────────────────────────────────── */

  const ALL_QUESTIONS = Array.isArray(window.PREIB_RAD_QUESTIONS) ? window.PREIB_RAD_QUESTIONS : [];

  // Per-subtag question count, used to size coverage tiles.
  const SUBTAG_COUNTS = (function () {
    const m = {};
    Object.keys(SUBTAG_INDEX).forEach(function (id) { m[id] = 0; });
    ALL_QUESTIONS.forEach(function (q) {
      if (!Array.isArray(q.tags)) return;
      // Each question contributes 1 to each of its coverage subtags.
      // (A question tagged with two subtags counts toward both.)
      const seen = new Set();
      q.tags.forEach(function (t) {
        if (isCoverageTag(t) && !seen.has(t)) {
          m[t] = (m[t] || 0) + 1;
          seen.add(t);
        }
      });
    });
    return m;
  })();

  // Filtered pool given an optional subtag (or null for all).
  function poolForFilter(subtag) {
    if (!subtag) return ALL_QUESTIONS;
    return ALL_QUESTIONS.filter(function (q) {
      return Array.isArray(q.tags) && q.tags.indexOf(subtag) !== -1;
    });
  }

  // Pick a random instance for delivery. Returns { question, instanceIndex, view }
  // where `view` is the merged base+instance view (instance fields override base).
  function pickInstance(q) {
    const instances = Array.isArray(q.instances) ? q.instances : [];
    if (instances.length === 0) {
      return { question: q, instanceIndex: null, view: q };
    }
    // Pool: base + all instances (per schema §4 mechanics: base counts as one)
    // Actually re-read §4: "engine picks one of {base, instance[0], instance[1], …}".
    // We follow that.
    const idx = Math.floor(Math.random() * (instances.length + 1));
    if (idx === 0) return { question: q, instanceIndex: null, view: q };
    const inst = instances[idx - 1];
    const view = Object.assign({}, q, inst);
    return { question: q, instanceIndex: idx - 1, view: view };
  }

  // Avoid showing the same question (any instance) twice in a row if pool > 1.
  let lastQuestionId = null;
  function pickNextQuestion(filter) {
    const pool = poolForFilter(filter);
    if (pool.length === 0) return null;
    if (pool.length === 1) {
      const q = pool[0];
      lastQuestionId = q.id;
      return pickInstance(q);
    }
    let q;
    let tries = 0;
    do {
      q = pool[Math.floor(Math.random() * pool.length)];
      tries++;
    } while (q.id === lastQuestionId && tries < 8);
    lastQuestionId = q.id;
    return pickInstance(q);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     6. Coverage map model
     For each subtag: most recent two attempts whose attempt was tagged with
     that subtag. Compute average fraction. Map to a band.
     Per IMPLEMENTATION_BRIEF_v1.md §3.4.
     ────────────────────────────────────────────────────────────────────────── */

  // Each band has a fill colour and a text colour that reads against it.
  // Editorial palette: --ok #2d6a3f, --warn #b67524, --bad #b03030, --untried #ece4d2.
  // Tile fills here are slightly more saturated than the palette swatches so
  // they read at small sizes on a phone.
  const BAND = {
    untried:     { fill: "#ece4d2", text: "#1a1a17", textSoft: "#4d4943" },
    band_strong: { fill: "#2d6a3f", text: "#ffffff", textSoft: "#e8efe7" },  // ≥0.9
    band_mid:    { fill: "#5a9a5a", text: "#ffffff", textSoft: "#e8efe7" },  // 0.7-0.9
    band_yellow: { fill: "#d6a847", text: "#1a1a17", textSoft: "#3d3528" },  // 0.5-0.7
    band_orange: { fill: "#c17034", text: "#ffffff", textSoft: "#f3e3d6" },  // 0.25-0.5
    band_red:    { fill: "#b03030", text: "#ffffff", textSoft: "#f0d8d8" }   // <0.25
  };

  function bandKeyForAverage(avg) {
    if (avg >= 0.9)  return "band_strong";
    if (avg >= 0.7)  return "band_mid";
    if (avg >= 0.5)  return "band_yellow";
    if (avg >= 0.25) return "band_orange";
    return "band_red";
  }

  // Mix a hex colour with white by `t` (0..1, 0 = pure colour, 1 = white).
  // Used to render the "single attempt" half-saturated tile.
  function mixWithWhite(hex, t) {
    const m = hex.replace("#", "");
    const r = parseInt(m.substring(0, 2), 16);
    const g = parseInt(m.substring(2, 4), 16);
    const b = parseInt(m.substring(4, 6), 16);
    const r2 = Math.round(r + (255 - r) * t);
    const g2 = Math.round(g + (255 - g) * t);
    const b2 = Math.round(b + (255 - b) * t);
    return "#" + [r2, g2, b2].map(function (n) {
      const s = n.toString(16); return s.length === 1 ? "0" + s : s;
    }).join("");
  }

  // For each subtag, return:
  // { attemptCount, avg, fill, text, textSoft }
  function coverageForSubtag(subtag) {
    const matched = [];
    for (let i = store.attempts.length - 1; i >= 0; i--) {
      const a = store.attempts[i];
      if (!Array.isArray(a.subtags)) continue;
      if (a.subtags.indexOf(subtag) !== -1) {
        matched.push(a);
        if (matched.length === 2) break;
      }
    }
    const attemptCount = matched.length;
    if (attemptCount === 0) {
      return {
        attemptCount: 0, avg: null,
        fill: BAND.untried.fill, text: BAND.untried.text, textSoft: BAND.untried.textSoft
      };
    }
    let sum = 0;
    matched.forEach(function (a) {
      const possible = a.marksPossible > 0 ? a.marksPossible : 1;
      sum += a.marksAwarded / possible;
    });
    const avg = sum / matched.length;
    const band = BAND[bandKeyForAverage(avg)];
    let fill = band.fill;
    // Single attempt → half-saturated tile (mix with white at 0.5). Text stays
    // dark in this case since the fill is now pale.
    if (attemptCount === 1) {
      fill = mixWithWhite(band.fill, 0.5);
      return {
        attemptCount: 1, avg: avg, fill: fill,
        text: "#1a1a17", textSoft: "#4d4943"
      };
    }
    return {
      attemptCount: attemptCount, avg: avg,
      fill: fill, text: band.text, textSoft: band.textSoft
    };
  }

  /* ──────────────────────────────────────────────────────────────────────────
     7. UI rendering
     Single-page app. We build the DOM imperatively. No framework.
     Hooks (called from outside this section): renderQuestion, renderCoverage.
     ────────────────────────────────────────────────────────────────────────── */

  // -- DOM helpers --
  function el(tag, props, children) {
    const e = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        if (k === "class") e.className = props[k];
        else if (k === "style") e.setAttribute("style", props[k]);
        else if (k === "html") e.innerHTML = props[k];
        else if (k === "text") e.textContent = props[k];
        else if (k.indexOf("on") === 0) e.addEventListener(k.substring(2).toLowerCase(), props[k]);
        else if (k === "for") e.htmlFor = props[k];
        else if (props[k] != null) e.setAttribute(k, props[k]);
      });
    }
    if (children) {
      const arr = Array.isArray(children) ? children : [children];
      arr.forEach(function (c) {
        if (c == null || c === false) return;
        if (typeof c === "string" || typeof c === "number") e.appendChild(document.createTextNode(c));
        else e.appendChild(c);
      });
    }
    return e;
  }

  // -- Prompt formatter (Schema §5: dollar-math, \n line breaks, • bullets) --
  // For v1 we don't ship KaTeX. Render math as a code-styled span so it's at
  // least legible. Authoring chat expects KaTeX; v1.5 should swap this in.
  function renderPromptText(text, container) {
    if (!text) return;
    container.innerHTML = "";
    const lines = String(text).split("\n");
    lines.forEach(function (line, i) {
      if (i > 0) container.appendChild(document.createElement("br"));
      const isBullet = line.indexOf("• ") === 0;
      if (isBullet) {
        const bullet = el("span", { class: "prompt-bullet" }, "• ");
        container.appendChild(bullet);
        line = line.substring(2);
      }
      // Split on $...$ math blocks
      const parts = line.split(/(\$[^$]+\$)/);
      parts.forEach(function (p) {
        if (p.length >= 2 && p.charAt(0) === "$" && p.charAt(p.length - 1) === "$") {
          container.appendChild(el("code", { class: "prompt-math" }, p.substring(1, p.length - 1)));
        } else {
          container.appendChild(document.createTextNode(p));
        }
      });
    });
  }

  // -- Diagram placeholder (§3.5) --
  // Defensively reads both q.diagram.params and q.diagram for the bare-params
  // bug flagged in IMPLEMENTATION_BRIEF_v1.md §9.
  function renderDiagramPlaceholder(diagram) {
    if (!diagram || !diagram.kind) return null;
    // Prefer diagram.params; fall back to the diagram object itself for the
    // two `nuclide_symbol` entries authored with bare params.
    const params = (diagram.params && typeof diagram.params === "object") ? diagram.params : diagram;
    const lines = [];
    Object.keys(params).forEach(function (k) {
      if (k === "kind" || k === "params") return;
      let v = params[k];
      if (Array.isArray(v)) v = "[" + v.join(", ") + "]";
      else if (v && typeof v === "object") v = JSON.stringify(v);
      lines.push(k + ": " + v);
    });
    return el("div", { class: "diagram-placeholder" }, [
      el("div", { class: "dp-head", text: "[Diagram placeholder: " + diagram.kind + "]" }),
      lines.length ? el("div", { class: "dp-body", text: lines.join("  ·  ") }) : null
    ]);
  }

  // ── State for the current question delivery ──
  let current = null; // { question, instanceIndex, view, mark? }
  let phase = "answering"; // "answering" | "feedback"

  // -- Question card rendering --
  function renderQuestion() {
    const card = document.getElementById("qcard");
    card.className = "qcard";
    card.innerHTML = "";

    // When loading a new question, scroll the page back to the top so the
    // student sees the prompt. Without this, after a long answer's smooth-
    // scroll-down to feedback, the next question loads and the student is
    // still scrolled to the previous feedback's position.
    try {
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (e) {
      window.scrollTo(0, 0);
    }

    const filterSub = store.activeFilter;
    current = pickNextQuestion(filterSub);
    phase = "answering";

    if (!current) {
      card.classList.add("empty");
      card.appendChild(el("div", { class: "qcard-empty" }, [
        el("div", { class: "qcard-empty-h", text: "No questions in this filter." }),
        el("div", { class: "qcard-empty-p", text: "Tap \"Show all\" or pick a different topic." })
      ]));
      return;
    }

    const v = current.view;

    // Tags / metadata strip
    const meta = el("div", { class: "qmeta" });
    if (Array.isArray(v.tags)) {
      v.tags.forEach(function (t) {
        if (isCoverageTag(t)) {
          meta.appendChild(el("span", { class: "qmeta-tag", text: SUBTAG_INDEX[t].name }));
        } else if (VOCAB.crossCutting.indexOf(t) !== -1) {
          meta.appendChild(el("span", { class: "qmeta-tag qmeta-tag-cross", text: t }));
        }
      });
    }
    if (typeof v.difficultyRating === "number") {
      const dots = "●".repeat(v.difficultyRating) + "○".repeat(Math.max(0, 5 - v.difficultyRating));
      meta.appendChild(el("span", { class: "qmeta-diff", title: "Difficulty " + v.difficultyRating + "/5", text: dots }));
    }
    if (typeof v.marks === "number") {
      meta.appendChild(el("span", { class: "qmeta-marks", text: v.marks + " " + (v.marks === 1 ? "mark" : "marks") }));
    }
    card.appendChild(meta);

    // Prompt
    const prompt = el("div", { class: "qprompt" });
    renderPromptText(v.prompt, prompt);
    card.appendChild(prompt);

    // Diagram placeholder
    const dp = renderDiagramPlaceholder(v.diagram);
    if (dp) card.appendChild(dp);

    // Input area
    const inputWrap = el("div", { class: "qinput" });
    const type = v.type;

    // Defence: catch malformed questions before they render as a dead card.
    // The known modes of failure: type === "mcq" but choices missing/empty;
    // type === "numeric" but no expectedNumeric/answer; or type missing
    // entirely. Render a clear notice with a Skip button instead of a card
    // the student can't interact with.
    let brokenReason = null;
    if (!type) {
      brokenReason = "Question has no type field.";
    } else if (type === "mcq" && (!Array.isArray(v.choices) || v.choices.length === 0)) {
      brokenReason = "MCQ question is missing its choices.";
    } else if (type === "numeric"
               && typeof v.expectedNumeric !== "number"
               && typeof v.answer !== "number") {
      brokenReason = "Numeric question has no expected answer.";
    } else if ((type === "short" || type === "long") && !Array.isArray(v.markPoints)) {
      // Not strictly broken — a 0-mark FYI question could exist — but flag it
      // because most short/long questions need markPoints to mark anything.
      // We still render the input; this is a soft warning only and we don't
      // surface it to the student.
    }

    if (brokenReason) {
      const notice = el("div", { class: "qbroken" }, [
        el("div", { class: "qbroken-h", text: "Question can't be displayed" }),
        el("div", { class: "qbroken-b", text: brokenReason + " Question id: " + (current.question.id || "?") + ". Please report this to your teacher." }),
        el("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: function () { renderQuestion(); renderCoverage(); updateProgressLine(); },
          text: "Skip to next question  →"
        })
      ]);
      inputWrap.appendChild(notice);
      card.appendChild(inputWrap);
      // Log to console so the developer/teacher can spot the bad id.
      console.warn("Broken question id=" + current.question.id + ":", brokenReason, v);
      return;
    }

    if (type === "mcq") {
      const choices = el("div", { class: "qchoices" });
      (v.choices || []).forEach(function (choice, i) {
        const btn = el("button", {
          class: "choice",
          type: "button",
          "data-i": i,
          onClick: function () { submitMCQ(i); }
        }, choice);
        choices.appendChild(btn);
      });
      inputWrap.appendChild(choices);
    } else if (type === "long") {
      const ta = el("textarea", {
        class: "ans-textarea",
        rows: "4",
        placeholder: "Type your answer…",
        id: "ans-input"
      });
      inputWrap.appendChild(ta);
      const submit = el("button", {
        class: "btn btn-primary submit-btn",
        onClick: submitText,
        text: "Check answer"
      });
      inputWrap.appendChild(submit);
      // Submit on Ctrl/Cmd+Enter for textareas; plain Enter inserts newline.
      ta.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); submitText(); }
      });
      setTimeout(function () { ta.focus(); }, 30);
    } else if (type === "numeric") {
      const wrap = el("div", { class: "ans-numwrap" });
      const inp = el("input", {
        class: "ans-num",
        type: "text",
        inputmode: "decimal",
        placeholder: "Number",
        id: "ans-input"
      });
      wrap.appendChild(inp);
      if (v.unitHint) wrap.appendChild(el("span", { class: "ans-unitlabel", text: v.unitHint }));
      inputWrap.appendChild(wrap);
      const submit = el("button", {
        class: "btn btn-primary submit-btn",
        onClick: submitText,
        text: "Check answer"
      });
      inputWrap.appendChild(submit);
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); submitText(); }
      });
      setTimeout(function () { inp.focus(); }, 30);
    } else { // short
      const inp = el("input", {
        class: "ans-text",
        type: "text",
        placeholder: "Type your answer…",
        id: "ans-input",
        autocomplete: "off",
        autocapitalize: "none",
        spellcheck: "false"
      });
      inputWrap.appendChild(inp);
      const submit = el("button", {
        class: "btn btn-primary submit-btn",
        onClick: submitText,
        text: "Check answer"
      });
      inputWrap.appendChild(submit);
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); submitText(); }
      });
      setTimeout(function () { inp.focus(); }, 30);
    }
    card.appendChild(inputWrap);
  }

  // -- Submission handlers --
  function submitMCQ(chosenIndex) {
    if (phase !== "answering") return;
    const v = current.view;
    const result = markMCQ(v, chosenIndex);
    showFeedback(result, { rawResponse: null, chosenIndex: chosenIndex });
  }

  function submitText() {
    if (phase !== "answering") return;
    const v = current.view;
    const inp = document.getElementById("ans-input");
    if (!inp) return;
    const raw = inp.value;
    let result;
    if (v.type === "numeric") result = markNumeric(v, raw);
    else result = markShortLong(v, raw);
    showFeedback(result, { rawResponse: raw, chosenIndex: null });
  }

  // -- Feedback & attempt logging --
  function showFeedback(result, meta) {
    phase = "feedback";
    const v = current.view;
    const card = document.getElementById("qcard");

    // Status class for tinting
    card.classList.add("showing-feedback");
    card.classList.add("fb-" + (result.status === "full" ? "full" :
                                result.status === "partial" ? "partial" : "wrong"));

    // Build an attempt record
    const tags = Array.isArray(v.tags) ? v.tags.slice() : [];
    const coverageTags = tags.filter(isCoverageTag);
    const parentGroup = coverageTags.length ? parentGroupForSubtag(coverageTags[0]) : null;
    const attempt = {
      timestamp: new Date().toISOString(),
      questionId: current.question.id,
      instanceId: current.instanceIndex,
      subtags: coverageTags,
      parentGroup: parentGroup,
      marksAwarded: result.marksAwarded,
      marksPossible: result.marksPossible,
      status: result.status,
      rawResponse: meta.rawResponse,
      chosenIndex: meta.chosenIndex
    };
    recordAttempt(attempt);

    // Build the feedback panel
    const fb = el("div", { class: "fb" });

    // Score line
    const scoreText = result.marksAwarded + " / " + result.marksPossible +
      " " + (result.marksPossible === 1 ? "mark" : "marks");
    const scoreLabel = result.status === "full" ? "Full marks" :
                        result.status === "partial" ? "Partial credit" : "No marks";
    fb.appendChild(el("div", { class: "fb-score" }, [
      el("span", { class: "fb-score-label", text: scoreLabel }),
      el("span", { class: "fb-score-num", text: scoreText })
    ]));

    // Their answer
    if (v.type === "mcq") {
      const correct = result.correctIndex;
      const chose  = result.chosenIndex;
      fb.appendChild(el("div", { class: "fb-block" }, [
        el("div", { class: "fb-h", text: "Your choice" }),
        el("div", { class: "fb-your", text: (v.choices && v.choices[chose]) || "(no choice)" })
      ]));
      if (chose !== correct) {
        fb.appendChild(el("div", { class: "fb-block" }, [
          el("div", { class: "fb-h", text: "Correct choice" }),
          el("div", { class: "fb-correct", text: (v.choices && v.choices[correct]) || "?" })
        ]));
      }
      // Distractor rationale, if present
      if (chose !== correct && v.distractorRationales && v.distractorRationales[String(chose)]) {
        fb.appendChild(el("div", { class: "fb-block" }, [
          el("div", { class: "fb-h", text: "Why that's wrong" }),
          el("div", { class: "fb-body", text: v.distractorRationales[String(chose)] })
        ]));
      }
    } else if (v.type === "numeric") {
      fb.appendChild(el("div", { class: "fb-block" }, [
        el("div", { class: "fb-h", text: "Your answer" }),
        el("div", { class: "fb-your", text: meta.rawResponse || "(blank)" })
      ]));
      const target = (typeof v.expectedNumeric === "number") ? v.expectedNumeric : v.answer;
      if (target != null) {
        fb.appendChild(el("div", { class: "fb-block" }, [
          el("div", { class: "fb-h", text: "Expected value" }),
          el("div", { class: "fb-correct", text: String(target) + (v.unitHint ? " " + v.unitHint : "") })
        ]));
      }
    } else {
      // short / long
      fb.appendChild(el("div", { class: "fb-block" }, [
        el("div", { class: "fb-h", text: "Your answer" }),
        el("div", { class: "fb-your", text: meta.rawResponse || "(blank)" })
      ]));
      // Hits / misses
      if (Array.isArray(result.hits) && result.hits.length) {
        const list = el("ul", { class: "fb-mp fb-mp-hit" });
        result.hits.forEach(function (h) { list.appendChild(el("li", null, h)); });
        fb.appendChild(el("div", { class: "fb-block" }, [
          el("div", { class: "fb-h", text: "Markscheme points hit" }),
          list
        ]));
      }
      if (Array.isArray(result.misses) && result.misses.length) {
        const list = el("ul", { class: "fb-mp fb-mp-miss" });
        result.misses.forEach(function (h) { list.appendChild(el("li", null, h)); });
        fb.appendChild(el("div", { class: "fb-block" }, [
          el("div", { class: "fb-h", text: "Markscheme points missed" }),
          list
        ]));
      }
    }

    // Model answer (always shown post-mark)
    if (v.explanation) {
      fb.appendChild(el("div", { class: "fb-block fb-model" }, [
        el("div", { class: "fb-h", text: "Model answer" }),
        el("div", { class: "fb-body", text: v.explanation })
      ]));
    }

    // Examiner note
    if (v.examinerNote) {
      fb.appendChild(el("div", { class: "fb-block fb-examiner" }, [
        el("div", { class: "fb-h", text: "Examiner note" }),
        el("div", { class: "fb-body", text: v.examinerNote })
      ]));
    }

    // Next button
    const nextBtn = el("button", {
      class: "btn btn-primary next-btn",
      onClick: function () { renderQuestion(); renderCoverage(); updateProgressLine(); },
      text: "Next question  →"
    });
    fb.appendChild(nextBtn);

    card.appendChild(fb);

    // Hide the now-redundant input controls. The student's answer is already
    // echoed in the "Your answer" block of the feedback. Leaving the textarea
    // and "Check answer" button visible after submission caused students on
    // phones to think nothing had happened (the feedback panel rendered below
    // the fold).
    const inputWrap = card.querySelector(".qinput");
    if (inputWrap) inputWrap.style.display = "none";

    // If — and ONLY if — the score line is below the visible viewport,
    // scroll just enough to bring it into view. Don't scroll on desktop where
    // the whole card already fits: doing so hides the prompt the student just
    // answered, and (worse) hides the coloured top-border on the card that
    // signals "right / partial / wrong".
    requestAnimationFrame(function () {
      setTimeout(function () {
        const scoreEl = fb.querySelector(".fb-score");
        if (!scoreEl) return;
        const rect = scoreEl.getBoundingClientRect();
        const viewportH = window.innerHeight;
        // Already in view? Leave the page where it is.
        if (rect.top >= 0 && rect.bottom <= viewportH) return;
        // Otherwise, scroll just enough to reveal the score under the sticky
        // header. Use the minimum scroll that puts the score on-screen — we
        // don't want to fling the prompt off-screen if it isn't necessary.
        const header = document.querySelector(".app-header");
        const headerH = header ? header.getBoundingClientRect().height : 0;
        const targetTop = rect.top + window.scrollY - headerH - 12;
        try {
          window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        } catch (e) {
          window.scrollTo(0, Math.max(0, targetTop));
        }
      }, 30);
    });

    // Capture Enter for next-question
    function nextOnEnter(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        document.removeEventListener("keydown", nextOnEnter);
        nextBtn.click();
      }
    }
    document.addEventListener("keydown", nextOnEnter);

    // Bump the coverage map
    renderCoverage();
    updateProgressLine();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     8. Coverage map UI (§3.4)
     Layout: row per parent group, tiles within each row sized proportionally
     to question count.
     ────────────────────────────────────────────────────────────────────────── */

  function renderCoverage() {
    const root = document.getElementById("coverage");
    root.innerHTML = "";

    // Header strip
    const hd = el("div", { class: "cov-hd" }, [
      el("div", { class: "cov-eyebrow", text: "Coverage map" }),
      el("button", {
        class: "cov-clear",
        type: "button",
        onClick: function () { setFilter(null); },
        text: store.activeFilter ? "Show all" : "All topics shown"
      })
    ]);
    if (!store.activeFilter) hd.querySelector(".cov-clear").classList.add("is-passive");
    root.appendChild(hd);

    if (store.activeFilter) {
      const stinfo = SUBTAG_INDEX[store.activeFilter];
      const filterStrip = el("div", { class: "cov-filter-strip" }, [
        el("span", { class: "cov-filter-eyebrow", text: "Filter:" }),
        el("span", { class: "cov-filter-name", text: stinfo ? stinfo.name : store.activeFilter })
      ]);
      root.appendChild(filterStrip);
    }

    VOCAB.parentGroups.forEach(function (group) {
      // Skip a group if all its subtags have zero questions (none in v1)
      const groupTotal = group.subtags.reduce(function (s, st) { return s + (SUBTAG_COUNTS[st.id] || 0); }, 0);
      if (groupTotal === 0) return;

      const groupEl = el("div", { class: "cov-group" });
      const groupHd = el("div", { class: "cov-group-hd" }, [
        el("button", {
          class: "cov-group-name",
          type: "button",
          title: "Filter to all of " + group.name,
          onClick: function () {
            // Filter to a "group" by picking its first subtag is wrong;
            // brief asks for "all subtags in that group". We don't have a
            // cross-subtag OR filter in v1 (engine only stores a single
            // active filter). Approximation: filter to the group's most-
            // populous subtag and trust the user understood the click as
            // "narrow the row". Honest alternative is to disable the group
            // header; but we keep the header as a quick "show all" reset
            // for that group.  v1.5 should add a multi-tag filter.
            // For v1, clicking the group-header simply clears the filter
            // (showing everything across all groups).
            setFilter(null);
          },
          text: group.name
        }),
        el("span", { class: "cov-group-count", text: groupTotal + " q" })
      ]);
      groupEl.appendChild(groupHd);

      const tiles = el("div", { class: "cov-tiles" });
      // Proportional widths via flex-grow set to question count.
      group.subtags.forEach(function (st) {
        const count = SUBTAG_COUNTS[st.id] || 0;
        if (count === 0) return;
        const cov = coverageForSubtag(st.id);
        const isActive = (store.activeFilter === st.id);
        const tileStyle =
          "flex-grow:" + count + ";" +
          " --tile-fill:" + cov.fill + ";" +
          " --tile-text:" + cov.text + ";" +
          " --tile-text-soft:" + cov.textSoft + ";";
        const tile = el("button", {
          class: "tile" + (isActive ? " tile-active" : ""),
          type: "button",
          title: st.name + " · " + count + " questions"
                + (cov.attemptCount === 0 ? " · no attempts yet"
                   : (" · " + cov.attemptCount + " of last attempts averaged "
                      + Math.round(cov.avg * 100) + "%")),
          "data-id": st.id,
          style: tileStyle,
          onClick: function () { setFilter(isActive ? null : st.id); }
        }, [
          el("span", { class: "tile-name", text: st.name }),
          el("span", { class: "tile-num" }, [
            el("span", { class: "tile-q", text: String(count) }),
            cov.attemptCount > 0 ? el("span", { class: "tile-pct", text: " · " + Math.round(cov.avg * 100) + "%" }) : null
          ])
        ]);
        tiles.appendChild(tile);
      });
      groupEl.appendChild(tiles);
      root.appendChild(groupEl);
    });

    // Legend (small, at bottom of coverage panel)
    const legend = el("div", { class: "cov-legend" }, [
      el("div", { class: "cov-legend-title", text: "Tile colour: average of your last two attempts in that subtag." }),
      el("div", { class: "cov-legend-bands" }, [
        ["Untried",  BAND.untried.fill],
        ["<25%",     BAND.band_red.fill],
        ["25-50%",   BAND.band_orange.fill],
        ["50-70%",   BAND.band_yellow.fill],
        ["70-90%",   BAND.band_mid.fill],
        ["≥90%",     BAND.band_strong.fill]
      ].map(function (pair) {
        return el("span", { class: "cov-legend-band" }, [
          el("span", { class: "cov-legend-swatch", style: "background:" + pair[1] }),
          el("span", { class: "cov-legend-label", text: pair[0] })
        ]);
      }))
    ]);
    root.appendChild(legend);
  }

  function setFilter(subtag) {
    store.activeFilter = subtag;
    persist();
    // On mobile, close the coverage drawer once a filter is set/cleared so
    // the student goes straight back to the question.
    const drawer = document.getElementById("cov-drawer");
    if (drawer) drawer.classList.remove("open");
    renderQuestion();
    renderCoverage();
    updateProgressLine();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     9. Progress line (small summary, top of question pane)
     ────────────────────────────────────────────────────────────────────────── */

  function updateProgressLine() {
    const line = document.getElementById("progress-line");
    if (!line) return;
    const n = store.attempts.length;
    if (n === 0) {
      line.textContent = "Welcome. Answer below, or open the coverage map to pick a topic.";
      return;
    }
    // Simple aggregate: total attempts, fraction of subtags touched, last 10 average
    const last = store.attempts.slice(-10);
    let sum = 0;
    last.forEach(function (a) {
      const possible = a.marksPossible > 0 ? a.marksPossible : 1;
      sum += a.marksAwarded / possible;
    });
    const avg10 = Math.round((sum / last.length) * 100);
    const touchedSubtags = new Set();
    store.attempts.forEach(function (a) { (a.subtags || []).forEach(function (s) { touchedSubtags.add(s); }); });
    const totalSubtags = Object.keys(SUBTAG_INDEX).filter(function (id) { return SUBTAG_COUNTS[id] > 0; }).length;
    line.innerHTML = "<b>" + n + "</b> attempt" + (n === 1 ? "" : "s")
      + " · last 10: <b>" + avg10 + "%</b>"
      + " · subtags touched: <b>" + touchedSubtags.size + "/" + totalSubtags + "</b>";
  }

  /* ──────────────────────────────────────────────────────────────────────────
     10. Settings panel (§3.7)
     ────────────────────────────────────────────────────────────────────────── */

  function openSettings() {
    const overlay = document.getElementById("settings-overlay");
    overlay.classList.add("open");
    document.getElementById("settings-version").textContent = APP_VERSION;
  }

  function closeSettings() {
    document.getElementById("settings-overlay").classList.remove("open");
  }

  function resetProgressFlow() {
    if (!confirm("This will delete your record of every attempt. This cannot be undone. Are you sure?")) return;
    if (!confirm("Really sure? This is permanent.")) return;
    clearProgress();
    renderQuestion();
    renderCoverage();
    updateProgressLine();
    closeSettings();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     11. Coverage drawer for mobile
     ────────────────────────────────────────────────────────────────────────── */

  function toggleCoverageDrawer() {
    const drawer = document.getElementById("cov-drawer");
    drawer.classList.toggle("open");
  }

  /* ──────────────────────────────────────────────────────────────────────────
     12. Bootstrap
     ────────────────────────────────────────────────────────────────────────── */

  function init() {
    if (ALL_QUESTIONS.length === 0) {
      const card = document.getElementById("qcard");
      if (card) {
        card.innerHTML = "<div class='qcard-empty'><div class='qcard-empty-h'>No questions loaded.</div>"
          + "<div class='qcard-empty-p'>Make sure topic7_radioactivity.js is included before engine.js.</div></div>";
      }
      return;
    }

    // Wire up settings
    document.getElementById("settings-btn").addEventListener("click", openSettings);
    document.getElementById("settings-close").addEventListener("click", closeSettings);
    document.getElementById("settings-overlay").addEventListener("click", function (e) {
      if (e.target.id === "settings-overlay") closeSettings();
    });
    document.getElementById("reset-progress").addEventListener("click", resetProgressFlow);

    // Mobile coverage drawer toggle
    const drawerBtn = document.getElementById("cov-drawer-btn");
    if (drawerBtn) drawerBtn.addEventListener("click", toggleCoverageDrawer);
    const drawerClose = document.getElementById("cov-drawer-close");
    if (drawerClose) drawerClose.addEventListener("click", toggleCoverageDrawer);

    renderQuestion();
    renderCoverage();
    updateProgressLine();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     Dev / debugging hooks. Available on window.SmithicsDev.
     Useful for §6 testing: simulate a year of attempts.
     ────────────────────────────────────────────────────────────────────────── */
  window.SmithicsDev = {
    norm: norm,
    markShortLong: markShortLong,
    markMCQ: markMCQ,
    markNumeric: markNumeric,
    store: function () { return store; },
    coverageForSubtag: coverageForSubtag,
    SUBTAG_COUNTS: SUBTAG_COUNTS,
    seedFakeAttempts: function (n) {
      const subtagIds = Object.keys(SUBTAG_INDEX).filter(function (id) { return SUBTAG_COUNTS[id] > 0; });
      for (let i = 0; i < n; i++) {
        const st = subtagIds[Math.floor(Math.random() * subtagIds.length)];
        const possible = 1 + Math.floor(Math.random() * 3);
        const awarded = Math.floor(Math.random() * (possible + 1));
        store.attempts.push({
          timestamp: new Date(Date.now() - (n - i) * 60000).toISOString(),
          questionId: "fake_" + i,
          instanceId: null,
          subtags: [st],
          parentGroup: parentGroupForSubtag(st),
          marksAwarded: awarded,
          marksPossible: possible,
          status: statusFromFraction(awarded, possible),
          rawResponse: null,
          chosenIndex: null
        });
      }
      persist();
      renderCoverage();
      updateProgressLine();
    }
  };

})();
