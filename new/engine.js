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
     1b. Atom registry (v1.4 prototype, radiation_types only)
     An atom is a finer-grained idea inside a subtag. A question can declare
     atoms: ["alpha_charge", "alpha_composition"] to say "this question tests
     these specific atoms." When the engine renders a subtag tile that has
     atoms defined here, it draws a mosaic of atom cells instead of a single
     coloured block, each cell coloured by the most-recent attempts on
     questions that declared that atom.
     Subtags not in ATOMS render the original single-block tile.
     ────────────────────────────────────────────────────────────────────────── */

  const ATOMS = {
    radiation_types: [
      // Composition: what the radiation is made of
      { id: "alpha_composition", name: "α composition (2p + 2n / He nucleus)", group: "alpha", attr: "composition" },
      { id: "beta_composition",  name: "β composition (fast electron from nucleus)", group: "beta",  attr: "composition" },
      { id: "gamma_composition", name: "γ composition (high-frequency EM wave)", group: "gamma", attr: "composition" },
      // Charge
      { id: "alpha_charge", name: "α charge (+2)", group: "alpha", attr: "charge" },
      { id: "beta_charge",  name: "β charge (−1)", group: "beta",  attr: "charge" },
      { id: "gamma_charge", name: "γ charge (0)",  group: "gamma", attr: "charge" },
      // Penetration (combines absorber + range in air for v0; can split later)
      { id: "alpha_penetration", name: "α penetration (paper / few cm air)", group: "alpha", attr: "penetration" },
      { id: "beta_penetration",  name: "β penetration (Al / ~1 m air)",      group: "beta",  attr: "penetration" },
      { id: "gamma_penetration", name: "γ penetration (lead/concrete / very long range)", group: "gamma", attr: "penetration" },
      // Ionising power (relative)
      { id: "alpha_ionising", name: "α ionising power (most)",    group: "alpha", attr: "ionising" },
      { id: "beta_ionising",  name: "β ionising power (medium)",  group: "beta",  attr: "ionising" },
      { id: "gamma_ionising", name: "γ ionising power (least)",   group: "gamma", attr: "ionising" }
    ]
  };

  // Flat lookup: atom id → { subtag, ...atom-object }
  const ATOM_INDEX = (function () {
    const m = {};
    Object.keys(ATOMS).forEach(function (subtag) {
      ATOMS[subtag].forEach(function (atom) {
        m[atom.id] = Object.assign({ subtag: subtag }, atom);
      });
    });
    return m;
  })();

  function subtagIsAtomised(subtag) {
    return Array.isArray(ATOMS[subtag]) && ATOMS[subtag].length > 0;
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
     3b. v1.5 markers for the new interaction types.
     All return the same { marksAwarded, marksPossible, status, ... } shape
     as the existing markers so showFeedback can dispatch uniformly.
     ────────────────────────────────────────────────────────────────────────── */

  function markMatching(q, pairings) {
    // pairings is { leftIdx: canonicalRightIdx } where leftIdx and the canonical
    // rightIdx both index into q.pairs. A correct pair is leftIdx === rightIdx.
    const pairs = Array.isArray(q.pairs) ? q.pairs : [];
    const possible = q.marks || pairs.length || 1;
    let awarded = 0;
    if (pairings && typeof pairings === "object") {
      pairs.forEach(function (_, i) {
        if (pairings[i] === i) awarded++;
      });
    }
    if (awarded > possible) awarded = possible;
    return {
      marksAwarded: awarded,
      marksPossible: possible,
      status: statusFromFraction(awarded, possible),
      pairings: pairings || {}
    };
  }

  function markMultiselect(q, checkedIndices) {
    const choices = Array.isArray(q.choices) ? q.choices : [];
    const correctSet = new Set(Array.isArray(q.answerIndices) ? q.answerIndices : []);
    const checkedSet = new Set(Array.isArray(checkedIndices) ? checkedIndices : []);
    const possible = q.marks || correctSet.size || 1;
    const mode = q.markingMode || "penalty";

    if (mode === "all_or_nothing") {
      // exact match needed
      let exact = (correctSet.size === checkedSet.size);
      if (exact) {
        correctSet.forEach(function (i) { if (!checkedSet.has(i)) exact = false; });
      }
      return {
        marksAwarded: exact ? possible : 0,
        marksPossible: possible,
        status: exact ? "full" : "none",
        chosenIndices: Array.from(checkedSet),
        correctIndices: Array.from(correctSet)
      };
    }

    let awarded = 0;
    choices.forEach(function (_, i) {
      const isCorrect = correctSet.has(i);
      const isChecked = checkedSet.has(i);
      if (isCorrect && isChecked) awarded += 1;
      else if (!isCorrect && isChecked && mode !== "no_penalty") awarded -= 1;
    });
    if (awarded < 0) awarded = 0;
    if (awarded > possible) awarded = possible;
    return {
      marksAwarded: awarded,
      marksPossible: possible,
      status: statusFromFraction(awarded, possible),
      chosenIndices: Array.from(checkedSet),
      correctIndices: Array.from(correctSet)
    };
  }

  function markOrdering(q, currentOrder) {
    // currentOrder is an array of indices into q.items, representing the
    // user's positioning. e.g. [2, 0, 1] means the user put items[2] first,
    // items[0] second, items[1] third.
    const items = Array.isArray(q.items) ? q.items : [];
    const possible = q.marks || items.length || 1;
    const mode = q.markingMode || "per_position";
    const order = Array.isArray(currentOrder) ? currentOrder : [];

    if (mode === "all_or_nothing") {
      let exact = (order.length === items.length);
      if (exact) {
        for (let k = 0; k < items.length; k++) {
          if (order[k] !== k) { exact = false; break; }
        }
      }
      return {
        marksAwarded: exact ? possible : 0,
        marksPossible: possible,
        status: exact ? "full" : "none",
        userOrder: order.slice()
      };
    }

    let awarded = 0;
    order.forEach(function (originalIdx, position) {
      if (originalIdx === position) awarded++;
    });
    if (awarded > possible) awarded = possible;
    return {
      marksAwarded: awarded,
      marksPossible: possible,
      status: statusFromFraction(awarded, possible),
      userOrder: order.slice()
    };
  }

  function markCategorise(q, placements) {
    // placements: { itemIdx: binId or null }
    const items = Array.isArray(q.items) ? q.items : [];
    const possible = q.marks || items.length || 1;
    let awarded = 0;
    items.forEach(function (item, i) {
      if (placements && placements[i] === item.bin) awarded++;
    });
    if (awarded > possible) awarded = possible;
    return {
      marksAwarded: awarded,
      marksPossible: possible,
      status: statusFromFraction(awarded, possible),
      placements: placements || {}
    };
  }

  function markFillblank(q, userInputs) {
    const blanks = Array.isArray(q.blanks) ? q.blanks : [];
    const possible = q.marks || blanks.length || 1;
    let awarded = 0;
    const perBlank = blanks.map(function (blank, i) {
      const raw = (userInputs && userInputs[i] != null) ? String(userInputs[i]) : "";
      const userVal = norm(raw);
      const expected = Array.isArray(blank.expected) ? blank.expected : [];
      const ok = userVal !== "" && expected.some(function (e) { return norm(e) === userVal; });
      if (ok) awarded++;
      return { ok: ok, raw: raw, expected: expected };
    });
    if (awarded > possible) awarded = possible;
    return {
      marksAwarded: awarded,
      marksPossible: possible,
      status: statusFromFraction(awarded, possible),
      perBlank: perBlank
    };
  }

  // v1.5.1: grid marker. Three per-cell states per row:
  //   correct (in q.correct[rowIdx]) — must be ticked for full row credit
  //   neutral (in q.neutral[rowIdx]) — tick or untick is fine, no score either way
  //   wrong (everything else)        — tick disqualifies the row in per-row,
  //                                    or costs 1 in per-cell mode
  function markGrid(q, userTicks) {
    const rows = Array.isArray(q.rows) ? q.rows : [];
    const cols = Array.isArray(q.columns) ? q.columns : [];
    const possible = q.marks || rows.length || 1;
    const mode = q.markingMode || "per_row";
    const correctMap = (q.correct && typeof q.correct === "object") ? q.correct : {};
    const neutralMap = (q.neutral && typeof q.neutral === "object") ? q.neutral : {};
    const userMap = (userTicks && typeof userTicks === "object") ? userTicks : {};

    function setFromMap(map, i) {
      const v = map[String(i)];
      return new Set(Array.isArray(v) ? v : []);
    }

    if (mode === "per_row") {
      let awarded = 0;
      const rowResults = [];
      rows.forEach(function (_, i) {
        const correct = setFromMap(correctMap, i);
        const neutral = setFromMap(neutralMap, i);
        const ticked = new Set(Array.isArray(userMap[i]) ? userMap[i] : []);
        let ok = true;
        correct.forEach(function (c) { if (!ticked.has(c)) ok = false; });
        ticked.forEach(function (t) {
          if (!correct.has(t) && !neutral.has(t)) ok = false;
        });
        if (ok) awarded++;
        rowResults.push({
          rowIdx: i, ok: ok,
          ticked: Array.from(ticked),
          correct: Array.from(correct),
          neutral: Array.from(neutral)
        });
      });
      if (awarded > possible) awarded = possible;
      return {
        marksAwarded: awarded,
        marksPossible: possible,
        status: statusFromFraction(awarded, possible),
        userTicks: userMap,
        rowResults: rowResults,
        mode: "per_row"
      };
    }

    // per_cell
    let awarded = 0;
    const cellResults = [];
    rows.forEach(function (_, i) {
      const correct = setFromMap(correctMap, i);
      const neutral = setFromMap(neutralMap, i);
      const ticked = new Set(Array.isArray(userMap[i]) ? userMap[i] : []);
      cols.forEach(function (_, j) {
        const tickedThis = ticked.has(j);
        const isCorrect = correct.has(j);
        const isNeutral = neutral.has(j);
        let cellScore = 0;
        let state = "off";
        if (isCorrect && tickedThis) { cellScore = 1; state = "hit"; }
        else if (isCorrect && !tickedThis) { state = "miss"; }
        else if (!isCorrect && !isNeutral && tickedThis) { cellScore = -1; state = "wrong"; }
        else if (isNeutral && tickedThis) { state = "neutral_ticked"; }
        else if (isNeutral) { state = "neutral"; }
        awarded += cellScore;
        cellResults.push({ row: i, col: j, state: state, score: cellScore, ticked: tickedThis });
      });
    });
    if (awarded < 0) awarded = 0;
    if (awarded > possible) awarded = possible;
    return {
      marksAwarded: awarded,
      marksPossible: possible,
      status: statusFromFraction(awarded, possible),
      userTicks: userMap,
      cellResults: cellResults,
      mode: "per_cell"
    };
  }

  /* ──────────────────────────────────────────────────────────────────────────
     4. Persistence
     Single localStorage key, JSON blob with attempt log + active filter.
     Per IMPLEMENTATION_BRIEF_v1.md §3.6.
     ────────────────────────────────────────────────────────────────────────── */

  const STORAGE_KEY = "smithics_topic7_v1";
  const APP_VERSION = "v1.5.1";

  // v1.2: per-type include/exclude filtering. excludedTypes is an array of
  // type strings to hide from delivery: e.g. ["long", "short"].
  // v1.5: structured-interaction types added (matching, multiselect, etc.).
  // v1.5.1: grid type added for matrix multi-select (practical safety etc.).
  const TYPES = ["mcq", "short", "long", "numeric", "matching", "multiselect", "ordering", "categorise", "fillblank", "grid"];

  const TYPE_LABELS = {
    mcq: "MCQ",
    short: "Short",
    long: "Long",
    numeric: "Numeric",
    matching: "Matching",
    multiselect: "Multi-select",
    ordering: "Ordering",
    categorise: "Categorise",
    fillblank: "Fill blank",
    grid: "Grid"
  };

  // v1.3: how many recent attempts the coverage tile colour averages over.
  // 2 was the v1 default. Larger windows are slower-moving but more stable.
  // The drilldown UI lets the user pick.
  const COVERAGE_WINDOW_OPTIONS = [2, 5, 10, 100]; // 100 stands in for "all"

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultStore();
      const parsed = JSON.parse(raw);
      // Migration: v1.1 used a boolean excludeLong; v1.2 uses excludedTypes.
      let excludedTypes;
      if (Array.isArray(parsed.excludedTypes)) {
        excludedTypes = parsed.excludedTypes.filter(function (t) { return TYPES.indexOf(t) !== -1; });
      } else if (parsed.excludeLong === false) {
        excludedTypes = [];
      } else if (parsed.excludeLong === true) {
        excludedTypes = ["long"];
      } else {
        // No value in storage at all: fall back to default (long hidden).
        excludedTypes = ["long"];
      }
      // coverageWindow: validate against allowed options; default 2.
      let coverageWindow = parseInt(parsed.coverageWindow, 10);
      if (COVERAGE_WINDOW_OPTIONS.indexOf(coverageWindow) === -1) coverageWindow = 2;
      return {
        attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
        activeFilter: typeof parsed.activeFilter === "string" ? parsed.activeFilter : null,
        lastSeen: parsed.lastSeen || null,
        version: parsed.version || APP_VERSION,
        excludedTypes: excludedTypes,
        coverageWindow: coverageWindow
      };
    } catch (e) {
      console.warn("Storage corrupt, resetting:", e);
      return defaultStore();
    }
  }

  function defaultStore() {
    return {
      attempts: [],
      activeFilter: null,
      lastSeen: null,
      version: APP_VERSION,
      // Long-answer hidden by default; everything else visible.
      excludedTypes: ["long"],
      coverageWindow: 2
    };
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
  // Counts only ACTIVE questions: parked excluded, and types in
  // store.excludedTypes excluded too. Recomputed on every settings change so
  // the coverage visual stays consistent with what the student actually sees.
  let SUBTAG_COUNTS = {};
  function computeSubtagCounts() {
    const m = {};
    Object.keys(SUBTAG_INDEX).forEach(function (id) { m[id] = 0; });
    const excluded = Array.isArray(store.excludedTypes) ? store.excludedTypes : [];
    ALL_QUESTIONS.forEach(function (q) {
      if (q.parked === true) return;
      if (excluded.indexOf(q.type) !== -1) return;
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
    SUBTAG_COUNTS = m;
    return m;
  }
  computeSubtagCounts();

  // Filtered pool given an optional subtag (or null for all).
  // v1.2: drops parked questions; drops any question whose base type is in
  // store.excludedTypes. Conservative rule for type filtering: filter by base
  // type only; if a "short" base happens to have a "long" instance, that's
  // rare enough to ignore for now. The editor will own this properly later.
  function poolForFilter(subtag) {
    // Always drop parked questions. The author marks a question parked with
    // an attached parkedFor note explaining why; the engine must respect it.
    let pool = ALL_QUESTIONS.filter(function (q) { return q.parked !== true; });
    if (subtag) {
      pool = pool.filter(function (q) {
        return Array.isArray(q.tags) && q.tags.indexOf(subtag) !== -1;
      });
    }
    const excluded = Array.isArray(store.excludedTypes) ? store.excludedTypes : [];
    if (excluded.length) {
      pool = pool.filter(function (q) { return excluded.indexOf(q.type) === -1; });
    }
    return pool;
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
  // v1.3: window size is store.coverageWindow (was hardcoded 2). 100 stands in
  // for "all" since no realistic student hits 100 attempts in one subtag.
  function coverageForSubtag(subtag) {
    const matched = [];
    const win = (typeof store.coverageWindow === "number" && store.coverageWindow > 0) ? store.coverageWindow : 2;
    for (let i = store.attempts.length - 1; i >= 0; i--) {
      const a = store.attempts[i];
      if (!Array.isArray(a.subtags)) continue;
      if (a.subtags.indexOf(subtag) !== -1) {
        matched.push(a);
        if (matched.length === win) break;
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
    // v1.3: when attemptCount is below the configured window, fade the tile
    // proportionally so partial-data tiles read paler than full-data ones.
    // Old v1 behaviour was a hard "1 attempt → half saturate"; we generalise
    // by mixing with white at (win - attemptCount) / win. So 1 of 2 attempts
    // stays at 0.5, but 1 of 5 attempts is paler than that.
    if (attemptCount < win) {
      const fade = (win - attemptCount) / win;
      fill = mixWithWhite(band.fill, Math.min(0.7, fade));
      return {
        attemptCount: attemptCount, avg: avg, fill: fill,
        text: "#1a1a17", textSoft: "#4d4943"
      };
    }
    return {
      attemptCount: attemptCount, avg: avg,
      fill: fill, text: band.text, textSoft: band.textSoft
    };
  }

  // v1.4 prototype: same idea as coverageForSubtag but at the atom level.
  // Filters store.attempts for ones whose .atoms array contains atomId.
  function coverageForAtom(atomId) {
    const matched = [];
    const win = (typeof store.coverageWindow === "number" && store.coverageWindow > 0) ? store.coverageWindow : 2;
    for (let i = store.attempts.length - 1; i >= 0; i--) {
      const a = store.attempts[i];
      if (!Array.isArray(a.atoms)) continue;
      if (a.atoms.indexOf(atomId) !== -1) {
        matched.push(a);
        if (matched.length === win) break;
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
    if (attemptCount < win) {
      const fade = (win - attemptCount) / win;
      fill = mixWithWhite(band.fill, Math.min(0.7, fade));
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

  /* ──────────────────────────────────────────────────────────────────────────
     v1.5 renderers for the five new interaction types. Each one builds its
     own UI inside `inputWrap`, holds state in a closure, and wires a
     "Check answer" button that calls the matching marker then showFeedback.
     ────────────────────────────────────────────────────────────────────────── */

  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  // Pair-colour palette for matching and categorise — muted swatches that
  // read OK on the Editorial paper background.
  const PAIR_COLOURS = ["#a3b48a", "#b0828a", "#8a98b4", "#b4a18a", "#8ab4a8", "#b48aaa"];

  function renderMatchingInput(v, inputWrap) {
    const pairs = Array.isArray(v.pairs) ? v.pairs : [];
    const extras = Array.isArray(v.rightExtras) ? v.rightExtras : [];
    // Right-side display: canonical indices 0..pairs.length-1 plus extras at
    // pairs.length..pairs.length+extras.length-1. Shuffled by default.
    const rightOrder = pairs.map(function (_, i) { return i; });
    for (let e = 0; e < extras.length; e++) rightOrder.push(pairs.length + e);
    if (v.shuffleRight !== false) shuffleInPlace(rightOrder);

    const state = { selectedLeft: null, pairings: {} };

    const matchEl = el("div", { class: "match" });
    const cols = el("div", { class: "match-cols" });
    const leftCol = el("ul", { class: "match-col match-left" });
    const rightCol = el("ul", { class: "match-col match-right" });

    const leftItems = [];
    const rightItems = {};

    function refresh() {
      leftItems.forEach(function (item) {
        item.className = "match-item match-left-item";
        item.style.backgroundColor = "";
      });
      Object.keys(rightItems).forEach(function (k) {
        const item = rightItems[k];
        item.className = "match-item match-right-item";
        item.style.backgroundColor = "";
      });
      if (state.selectedLeft != null) {
        leftItems[state.selectedLeft].classList.add("is-selected");
      }
      let colourIdx = 0;
      Object.keys(state.pairings).forEach(function (k) {
        const li = parseInt(k, 10);
        const ri = state.pairings[li];
        const c = PAIR_COLOURS[colourIdx % PAIR_COLOURS.length];
        colourIdx++;
        leftItems[li].style.backgroundColor = c;
        leftItems[li].classList.add("is-paired");
        if (rightItems[ri]) {
          rightItems[ri].style.backgroundColor = c;
          rightItems[ri].classList.add("is-paired");
        }
      });
    }

    pairs.forEach(function (p, i) {
      const item = el("li", {
        class: "match-item match-left-item",
        "data-idx": String(i),
        onClick: function () {
          // Tap on a paired left clears its pairing.
          if (state.pairings[i] != null) {
            delete state.pairings[i];
            state.selectedLeft = null;
          } else if (state.selectedLeft === i) {
            state.selectedLeft = null;
          } else {
            state.selectedLeft = i;
          }
          refresh();
        }
      }, p.left);
      leftCol.appendChild(item);
      leftItems.push(item);
    });

    rightOrder.forEach(function (canIdx) {
      const text = (canIdx < pairs.length) ? pairs[canIdx].right : extras[canIdx - pairs.length];
      const item = el("li", {
        class: "match-item match-right-item",
        "data-canonical": String(canIdx),
        onClick: function () {
          if (state.selectedLeft != null) {
            // Pair with selected left; break any prior use of this right.
            Object.keys(state.pairings).forEach(function (k) {
              if (state.pairings[k] === canIdx) delete state.pairings[k];
            });
            state.pairings[state.selectedLeft] = canIdx;
            state.selectedLeft = null;
          } else {
            // No left selected: tap on a paired right unbinds it.
            Object.keys(state.pairings).forEach(function (k) {
              if (state.pairings[k] === canIdx) delete state.pairings[k];
            });
          }
          refresh();
        }
      }, text);
      rightCol.appendChild(item);
      rightItems[canIdx] = item;
    });

    cols.appendChild(leftCol);
    cols.appendChild(rightCol);
    matchEl.appendChild(cols);
    inputWrap.appendChild(matchEl);

    inputWrap.appendChild(el("button", {
      class: "btn btn-primary submit-btn",
      type: "button",
      onClick: function () {
        const result = markMatching(v, state.pairings);
        showFeedback(result, { rawResponse: null, chosenIndex: null, pairings: state.pairings });
      },
      text: "Check answer"
    }));
  }

  function renderMultiselectInput(v, inputWrap) {
    const choices = Array.isArray(v.choices) ? v.choices : [];
    const list = el("div", { class: "multiselect" });
    const inputs = [];
    choices.forEach(function (text, i) {
      const cb = el("input", {
        type: "checkbox",
        class: "ms-cb",
        id: "ms-cb-" + i,
        "data-idx": String(i)
      });
      const row = el("label", { class: "ms-row", for: "ms-cb-" + i }, [
        cb,
        el("span", { class: "ms-text", text: text })
      ]);
      list.appendChild(row);
      inputs.push(cb);
    });
    inputWrap.appendChild(list);

    inputWrap.appendChild(el("button", {
      class: "btn btn-primary submit-btn",
      type: "button",
      onClick: function () {
        const checked = [];
        inputs.forEach(function (cb, i) { if (cb.checked) checked.push(i); });
        const result = markMultiselect(v, checked);
        showFeedback(result, { rawResponse: null, chosenIndex: null, chosenIndices: checked });
      },
      text: "Check answer"
    }));
  }

  function renderOrderingInput(v, inputWrap) {
    const items = Array.isArray(v.items) ? v.items : [];
    // currentOrder[k] = original-index of item now at position k.
    const currentOrder = items.map(function (_, i) { return i; });
    if (v.shuffleStart !== false) shuffleInPlace(currentOrder);

    const list = el("ol", { class: "ordering" });
    const rows = [];

    function refresh() {
      // Clear and rebuild row contents in current order.
      list.innerHTML = "";
      rows.length = 0;
      currentOrder.forEach(function (originalIdx, position) {
        const upBtn = el("button", {
          class: "ord-btn ord-up",
          type: "button",
          "aria-label": "Move up",
          onClick: function () {
            if (position === 0) return;
            const tmp = currentOrder[position - 1];
            currentOrder[position - 1] = currentOrder[position];
            currentOrder[position] = tmp;
            refresh();
          },
          text: "▲"
        });
        upBtn.disabled = (position === 0);
        const downBtn = el("button", {
          class: "ord-btn ord-down",
          type: "button",
          "aria-label": "Move down",
          onClick: function () {
            if (position === currentOrder.length - 1) return;
            const tmp = currentOrder[position + 1];
            currentOrder[position + 1] = currentOrder[position];
            currentOrder[position] = tmp;
            refresh();
          },
          text: "▼"
        });
        downBtn.disabled = (position === currentOrder.length - 1);
        const row = el("li", { class: "ord-row" }, [
          el("span", { class: "ord-num", text: String(position + 1) }),
          el("span", { class: "ord-text", text: items[originalIdx] }),
          el("span", { class: "ord-controls" }, [upBtn, downBtn])
        ]);
        list.appendChild(row);
        rows.push(row);
      });
    }
    refresh();
    inputWrap.appendChild(list);

    inputWrap.appendChild(el("button", {
      class: "btn btn-primary submit-btn",
      type: "button",
      onClick: function () {
        const result = markOrdering(v, currentOrder);
        showFeedback(result, { rawResponse: null, chosenIndex: null, userOrder: currentOrder.slice() });
      },
      text: "Check answer"
    }));
  }

  function renderCategoriseInput(v, inputWrap) {
    const bins = Array.isArray(v.bins) ? v.bins : [];
    const items = Array.isArray(v.items) ? v.items : [];

    const state = { selectedItem: null, placements: {} }; // itemIdx → binId

    const wrap = el("div", { class: "categorise" });
    const strip = el("div", { class: "cat-strip" });
    const itemEls = {};
    const binEls = {};

    function refresh() {
      // Strip shows unplaced items.
      strip.innerHTML = "";
      items.forEach(function (item, i) {
        if (state.placements[i]) return; // placed in a bin
        const it = el("button", {
          type: "button",
          class: "cat-item" + (state.selectedItem === i ? " is-selected" : ""),
          "data-idx": String(i),
          onClick: function () {
            state.selectedItem = (state.selectedItem === i) ? null : i;
            refresh();
          },
          text: item.text
        });
        itemEls[i] = it;
        strip.appendChild(it);
      });
      // Each bin: show its label + placed items.
      bins.forEach(function (binId) {
        const binWrap = binEls[binId];
        if (!binWrap) return;
        binWrap.innerHTML = "";
        binWrap.appendChild(el("div", { class: "cat-bin-label", text: binId }));
        const placedList = el("div", { class: "cat-bin-items" });
        items.forEach(function (item, i) {
          if (state.placements[i] !== binId) return;
          const it = el("button", {
            type: "button",
            class: "cat-item is-placed",
            "data-idx": String(i),
            onClick: function () {
              delete state.placements[i];
              refresh();
            },
            text: item.text
          });
          placedList.appendChild(it);
        });
        binWrap.appendChild(placedList);
      });
    }

    wrap.appendChild(strip);
    const binsWrap = el("div", { class: "cat-bins" });
    bins.forEach(function (binId) {
      const binWrap = el("div", {
        class: "cat-bin",
        "data-bin": binId,
        onClick: function () {
          if (state.selectedItem != null) {
            state.placements[state.selectedItem] = binId;
            state.selectedItem = null;
            refresh();
          }
        }
      });
      binEls[binId] = binWrap;
      binsWrap.appendChild(binWrap);
    });
    wrap.appendChild(binsWrap);
    inputWrap.appendChild(wrap);
    refresh();

    inputWrap.appendChild(el("button", {
      class: "btn btn-primary submit-btn",
      type: "button",
      onClick: function () {
        const result = markCategorise(v, state.placements);
        showFeedback(result, { rawResponse: null, chosenIndex: null, placements: state.placements });
      },
      text: "Check answer"
    }));
  }

  function renderFillblankInput(v, inputWrap) {
    const blanks = Array.isArray(v.blanks) ? v.blanks : [];
    const promptText = String(v.prompt || "");
    const parts = promptText.split("{}");
    if (parts.length - 1 !== blanks.length) {
      console.warn("fillblank: number of {} placeholders (" + (parts.length - 1) + ") does not match blanks.length (" + blanks.length + ") for question " + (current.question.id || "?"));
    }
    const wrap = el("div", { class: "fillblank" });
    const inputs = [];
    parts.forEach(function (chunk, i) {
      if (chunk) wrap.appendChild(document.createTextNode(chunk));
      if (i < parts.length - 1 && i < blanks.length) {
        const inp = el("input", {
          type: "text",
          class: "fb-input",
          autocomplete: "off",
          autocapitalize: "none",
          spellcheck: "false",
          "data-blank": String(i)
        });
        wrap.appendChild(inp);
        inputs.push(inp);
      }
    });
    inputWrap.appendChild(wrap);

    // Enter on any blank submits.
    inputs.forEach(function (inp) {
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); doSubmit(); }
      });
    });
    if (inputs[0]) setTimeout(function () { inputs[0].focus(); }, 30);

    function doSubmit() {
      const userInputs = inputs.map(function (inp) { return inp.value; });
      const result = markFillblank(v, userInputs);
      showFeedback(result, { rawResponse: userInputs.join(" | "), chosenIndex: null, perBlank: result.perBlank });
    }

    inputWrap.appendChild(el("button", {
      class: "btn btn-primary submit-btn",
      type: "button",
      onClick: doSubmit,
      text: "Check answer"
    }));
  }

  function renderGridInput(v, inputWrap) {
    const rows = Array.isArray(v.rows) ? v.rows : [];
    const cols = Array.isArray(v.columns) ? v.columns : [];
    const state = {}; // { rowIdx: [colIdx, ...] }

    const wrap = el("div", { class: "grid-wrap" });
    const table = el("table", { class: "grid-q" });

    const thead = el("thead");
    const headRow = el("tr");
    headRow.appendChild(el("th", { class: "grid-corner", text: "" }));
    cols.forEach(function (col) {
      headRow.appendChild(el("th", { class: "grid-col", text: col }));
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = el("tbody");
    rows.forEach(function (rowText, i) {
      const tr = el("tr");
      tr.appendChild(el("th", { class: "grid-row-label", text: rowText }));
      cols.forEach(function (_, j) {
        const cb = el("input", {
          type: "checkbox",
          class: "grid-cb",
          "data-row": String(i),
          "data-col": String(j),
          onChange: function (e) {
            if (!Array.isArray(state[i])) state[i] = [];
            const checked = !!e.target.checked;
            const idx = state[i].indexOf(j);
            if (checked && idx === -1) state[i].push(j);
            if (!checked && idx !== -1) state[i].splice(idx, 1);
          }
        });
        const cell = el("td", { class: "grid-cell" }, [
          el("label", { class: "grid-cell-label" }, [cb])
        ]);
        tr.appendChild(cell);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    inputWrap.appendChild(wrap);

    inputWrap.appendChild(el("button", {
      class: "btn btn-primary submit-btn",
      type: "button",
      onClick: function () {
        const result = markGrid(v, state);
        showFeedback(result, { rawResponse: null, chosenIndex: null, userTicks: state });
      },
      text: "Check answer"
    }));
  }


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
    } else if (type === "matching" && (!Array.isArray(v.pairs) || v.pairs.length === 0)) {
      brokenReason = "Matching question is missing its pairs.";
    } else if (type === "multiselect" && (!Array.isArray(v.choices) || !Array.isArray(v.answerIndices))) {
      brokenReason = "Multi-select question is missing choices or answerIndices.";
    } else if (type === "ordering" && (!Array.isArray(v.items) || v.items.length === 0)) {
      brokenReason = "Ordering question is missing items.";
    } else if (type === "categorise" && (!Array.isArray(v.bins) || !Array.isArray(v.items))) {
      brokenReason = "Categorise question is missing bins or items.";
    } else if (type === "fillblank" && (!Array.isArray(v.blanks) || v.blanks.length === 0)) {
      brokenReason = "Fill-in-the-blank question is missing blanks.";
    } else if (type === "grid" && (!Array.isArray(v.rows) || !Array.isArray(v.columns) || v.rows.length === 0 || v.columns.length === 0)) {
      brokenReason = "Grid question is missing rows or columns.";
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
    } else if (type === "matching") {
      renderMatchingInput(v, inputWrap);
    } else if (type === "multiselect") {
      renderMultiselectInput(v, inputWrap);
    } else if (type === "ordering") {
      renderOrderingInput(v, inputWrap);
    } else if (type === "categorise") {
      renderCategoriseInput(v, inputWrap);
    } else if (type === "fillblank") {
      renderFillblankInput(v, inputWrap);
    } else if (type === "grid") {
      renderGridInput(v, inputWrap);
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

  // v1.4.2: Adjust the mark on the most recent attempt. Mutates the attempt
  // in place (it's already a reference inside store.attempts), recomputes
  // status, persists, and re-renders the score line + card status class +
  // coverage. Called from the per-mark buttons in the feedback panel.
  function adjustMark(attempt, newMarks) {
    const possible = attempt.marksPossible || 1;
    const clamped = Math.max(0, Math.min(possible, newMarks | 0));
    attempt.marksAwarded = clamped;
    const f = clamped / possible;
    if (f >= 0.999) attempt.status = "full";
    else if (f <= 0.001) attempt.status = "none";
    else attempt.status = "partial";
    persist();

    // Update the visible score line + status colour without a full re-render.
    const card = document.getElementById("qcard");
    if (card) {
      card.classList.remove("fb-full", "fb-partial", "fb-wrong");
      card.classList.add("fb-" + (attempt.status === "full" ? "full" : attempt.status === "partial" ? "partial" : "wrong"));
    }
    const labelEl = document.querySelector(".fb-score .fb-score-label");
    const numEl   = document.querySelector(".fb-score .fb-score-num");
    if (labelEl) labelEl.textContent = attempt.status === "full" ? "Full marks" : attempt.status === "partial" ? "Partial credit" : "No marks";
    if (numEl)   numEl.textContent = clamped + " / " + possible + " " + (possible === 1 ? "mark" : "marks");

    // Reflect the new "current" button.
    const btns = document.querySelectorAll(".fb-adjust-btn");
    btns.forEach(function (b) {
      const m = parseInt(b.getAttribute("data-marks"), 10);
      if (m === clamped) b.classList.add("is-current");
      else b.classList.remove("is-current");
    });

    // The mark contributed to the coverage colour and the progress aggregate;
    // both need to refresh.
    renderCoverage();
    updateProgressLine();
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
    // v1.4: also capture atoms (if the question declared any) so atom-level
    // coverage can be computed later. Atoms are filtered to those known in
    // ATOM_INDEX so unknown ids don't pollute the store.
    const attemptAtoms = Array.isArray(v.atoms)
      ? v.atoms.filter(function (a) { return Object.prototype.hasOwnProperty.call(ATOM_INDEX, a); })
      : [];
    const attempt = {
      timestamp: new Date().toISOString(),
      questionId: current.question.id,
      instanceId: current.instanceIndex,
      subtags: coverageTags,
      parentGroup: parentGroup,
      atoms: attemptAtoms,
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
    } else if (v.type === "matching") {
      // Show each canonical pair, marking user's pairing as ✓ or ✗.
      const pairs = Array.isArray(v.pairs) ? v.pairs : [];
      const userPairings = (meta && meta.pairings) || result.pairings || {};
      const list = el("ul", { class: "fb-mp" });
      pairs.forEach(function (p, i) {
        const userRightIdx = userPairings[i];
        const userText = (userRightIdx == null)
          ? "(unpaired)"
          : (userRightIdx < pairs.length ? pairs[userRightIdx].right
             : (Array.isArray(v.rightExtras) ? v.rightExtras[userRightIdx - pairs.length] : "?"));
        const correct = (userRightIdx === i);
        const item = el("li", { class: "fb-mp-pair " + (correct ? "fb-mp-hit" : "fb-mp-miss") }, [
          el("span", { class: "fb-pair-left", text: p.left }),
          el("span", { class: "fb-pair-arrow", text: " → " }),
          el("span", { class: "fb-pair-user", text: userText }),
          correct ? null : el("span", { class: "fb-pair-correct", text: " (correct: " + p.right + ")" })
        ]);
        list.appendChild(item);
      });
      fb.appendChild(el("div", { class: "fb-block" }, [
        el("div", { class: "fb-h", text: "Your pairings" }),
        list
      ]));
    } else if (v.type === "multiselect") {
      const choices = Array.isArray(v.choices) ? v.choices : [];
      const userSet = new Set(result.chosenIndices || []);
      const correctSet = new Set(result.correctIndices || []);
      const list = el("ul", { class: "fb-mp" });
      choices.forEach(function (text, i) {
        const wasChecked = userSet.has(i);
        const isCorrect = correctSet.has(i);
        let cls = "fb-mp-neutral";
        let mark = "·";
        if (isCorrect && wasChecked) { cls = "fb-mp-hit"; mark = "✓"; }
        else if (isCorrect && !wasChecked) { cls = "fb-mp-miss"; mark = "(missed)"; }
        else if (!isCorrect && wasChecked) { cls = "fb-mp-miss"; mark = "(wrong tick)"; }
        list.appendChild(el("li", { class: cls }, [
          el("span", { class: "fb-mp-mark", text: mark }),
          el("span", { class: "fb-mp-text", text: " " + text })
        ]));
      });
      fb.appendChild(el("div", { class: "fb-block" }, [
        el("div", { class: "fb-h", text: "Your selection" }),
        list
      ]));
      // Distractor rationales for any wrongly-ticked choice.
      if (v.distractorRationales) {
        userSet.forEach(function (i) {
          if (correctSet.has(i)) return;
          const reason = v.distractorRationales[String(i)];
          if (reason) {
            fb.appendChild(el("div", { class: "fb-block" }, [
              el("div", { class: "fb-h", text: "Why \"" + (choices[i] || "?") + "\" is wrong" }),
              el("div", { class: "fb-body", text: reason })
            ]));
          }
        });
      }
    } else if (v.type === "ordering") {
      const items = Array.isArray(v.items) ? v.items : [];
      const userOrder = result.userOrder || (meta && meta.userOrder) || [];
      const list = el("ol", { class: "fb-ord" });
      userOrder.forEach(function (originalIdx, position) {
        const correct = (originalIdx === position);
        list.appendChild(el("li", { class: correct ? "fb-mp-hit" : "fb-mp-miss" }, [
          el("span", { class: "fb-mp-text", text: items[originalIdx] || "?" }),
          correct ? null : el("span", { class: "fb-mp-correct", text: " (should be: " + (items[position] || "?") + ")" })
        ]));
      });
      fb.appendChild(el("div", { class: "fb-block" }, [
        el("div", { class: "fb-h", text: "Your ordering" }),
        list
      ]));
    } else if (v.type === "categorise") {
      const items = Array.isArray(v.items) ? v.items : [];
      const placements = result.placements || (meta && meta.placements) || {};
      const list = el("ul", { class: "fb-mp" });
      items.forEach(function (item, i) {
        const userBin = placements[i] || "(unplaced)";
        const correct = (placements[i] === item.bin);
        list.appendChild(el("li", { class: correct ? "fb-mp-hit" : "fb-mp-miss" }, [
          el("span", { class: "fb-mp-text", text: item.text + " → " + userBin }),
          correct ? null : el("span", { class: "fb-mp-correct", text: " (correct: " + item.bin + ")" })
        ]));
      });
      fb.appendChild(el("div", { class: "fb-block" }, [
        el("div", { class: "fb-h", text: "Your placements" }),
        list
      ]));
    } else if (v.type === "fillblank") {
      const perBlank = result.perBlank || [];
      const list = el("ul", { class: "fb-mp" });
      perBlank.forEach(function (b, i) {
        const userText = b.raw === "" ? "(blank)" : b.raw;
        const expectedFirst = Array.isArray(b.expected) && b.expected.length ? b.expected[0] : "?";
        list.appendChild(el("li", { class: b.ok ? "fb-mp-hit" : "fb-mp-miss" }, [
          el("span", { class: "fb-mp-text", text: "Blank " + (i + 1) + ": \"" + userText + "\"" }),
          b.ok ? null : el("span", { class: "fb-mp-correct", text: " (expected: " + expectedFirst + ")" })
        ]));
      });
      fb.appendChild(el("div", { class: "fb-block" }, [
        el("div", { class: "fb-h", text: "Your answers" }),
        list
      ]));
    } else if (v.type === "grid") {
      // Re-render the grid with each cell tagged hit / miss / wrong / neutral.
      const rows = Array.isArray(v.rows) ? v.rows : [];
      const cols = Array.isArray(v.columns) ? v.columns : [];
      const userTicks = result.userTicks || (meta && meta.userTicks) || {};
      const correctMap = (v.correct && typeof v.correct === "object") ? v.correct : {};
      const neutralMap = (v.neutral && typeof v.neutral === "object") ? v.neutral : {};

      const fbWrap = el("div", { class: "grid-wrap" });
      const table = el("table", { class: "grid-q grid-feedback" });

      const thead = el("thead");
      const headRow = el("tr");
      headRow.appendChild(el("th", { class: "grid-corner", text: "" }));
      cols.forEach(function (col) {
        headRow.appendChild(el("th", { class: "grid-col", text: col }));
      });
      thead.appendChild(headRow);
      table.appendChild(thead);

      const tbody = el("tbody");
      rows.forEach(function (rowText, i) {
        const tr = el("tr");
        const correct = new Set(Array.isArray(correctMap[String(i)]) ? correctMap[String(i)] : []);
        const neutral = new Set(Array.isArray(neutralMap[String(i)]) ? neutralMap[String(i)] : []);
        const ticked = new Set(Array.isArray(userTicks[i]) ? userTicks[i] : []);
        // Row label, plus a row-level pass/fail indicator if per_row mode
        let rowOk = null;
        if (result.mode === "per_row" && Array.isArray(result.rowResults)) {
          const rr = result.rowResults.find(function (r) { return r.rowIdx === i; });
          if (rr) rowOk = rr.ok;
        }
        const labelCell = el("th", { class: "grid-row-label" + (rowOk === true ? " grid-row-hit" : rowOk === false ? " grid-row-miss" : "") }, rowText);
        tr.appendChild(labelCell);
        cols.forEach(function (_, j) {
          const tickedThis = ticked.has(j);
          const isCorrect = correct.has(j);
          const isNeutral = neutral.has(j);
          let cls = "grid-fb-cell";
          let glyph = "";
          if (isCorrect && tickedThis) { cls += " grid-fb-hit"; glyph = "✓"; }
          else if (isCorrect && !tickedThis) { cls += " grid-fb-miss"; glyph = "·"; }
          else if (!isCorrect && !isNeutral && tickedThis) { cls += " grid-fb-wrong"; glyph = "✗"; }
          else if (isNeutral && tickedThis) { cls += " grid-fb-neutral-ticked"; glyph = "○"; }
          else if (isNeutral) { cls += " grid-fb-neutral"; glyph = "·"; }
          else { cls += " grid-fb-empty"; glyph = ""; }
          tr.appendChild(el("td", { class: cls, text: glyph }));
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      fbWrap.appendChild(table);

      const legendBits = [
        el("span", { class: "grid-fb-legend-bit grid-fb-hit", text: "✓ correct" }),
        el("span", { class: "grid-fb-legend-bit grid-fb-miss", text: "· missed" }),
        el("span", { class: "grid-fb-legend-bit grid-fb-wrong", text: "✗ wrong tick" })
      ];
      // Only show the neutral legend bit if the question actually uses neutral cells.
      const usesNeutral = Object.keys(neutralMap).some(function (k) {
        return Array.isArray(neutralMap[k]) && neutralMap[k].length > 0;
      });
      if (usesNeutral) {
        legendBits.push(el("span", { class: "grid-fb-legend-bit grid-fb-neutral-ticked", text: "○ neither right nor wrong" }));
      }

      fb.appendChild(el("div", { class: "fb-block" }, [
        el("div", { class: "fb-h", text: "Your grid" }),
        fbWrap,
        el("div", { class: "grid-fb-legend" }, legendBits)
      ]));
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

    // v1.4.2: Adjust-mark UI for written answers. The keyword matcher is
    // imperfect; the schema's allowAdjust flag (default true) is meant to let
    // the student override when they think they got the marks but the matcher
    // missed it (or when they were generous and it gave too many). We honour
    // it here, finally. Skipped for MCQ (no ambiguity) and numeric (also a
    // single-criterion auto-mark).
    if ((v.type === "short" || v.type === "long") && v.allowAdjust !== false) {
      const possible = result.marksPossible;
      const adjBlock = el("div", { class: "fb-block fb-adjust" }, [
        el("div", { class: "fb-h", text: "Disagree with the mark? Set it yourself." }),
        el("div", { class: "fb-adjust-help", text: "The keyword matcher misses sometimes. If you got it right and it didn't notice, give yourself the marks." })
      ]);
      const btnRow = el("div", { class: "fb-adjust-btns" });
      for (let m = 0; m <= possible; m++) {
        const isCurrent = (attempt.marksAwarded === m);
        const btn = el("button", {
          class: "fb-adjust-btn" + (isCurrent ? " is-current" : ""),
          type: "button",
          "data-marks": String(m),
          onClick: (function (newMarks) {
            return function () { adjustMark(attempt, newMarks); };
          })(m),
          text: m + "/" + possible
        });
        btnRow.appendChild(btn);
      }
      adjBlock.appendChild(btnRow);
      fb.appendChild(adjBlock);
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

    // Capture Enter for next-question.
    // History: in v1.1 we deferred listener attach by setTimeout(0) so the
    // same Enter that submitted didn't also advance. That handles a single
    // press cleanly. In v1.4.3 we add two more guards because the bug came
    // back on questions where the user momentarily HELD Enter:
    //   1. Ignore e.repeat. Auto-repeat keydowns from a held key shouldn't
    //      count as a deliberate "advance now" press.
    //   2. A 200ms grace window after the listener attaches. If anything
    //      sneaks through in that window (focus shifting to a button while
    //      Enter is still down, browser quirks), it's ignored.
    let listenerArmedAt = 0;
    function nextOnEnter(e) {
      if (e.key !== "Enter") return;
      if (e.repeat) return;
      if (Date.now() - listenerArmedAt < 200) return;
      e.preventDefault();
      document.removeEventListener("keydown", nextOnEnter);
      nextBtn.click();
    }
    setTimeout(function () {
      listenerArmedAt = Date.now();
      document.addEventListener("keydown", nextOnEnter);
    }, 0);

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
        const isActive = (store.activeFilter === st.id);
        const atomised = subtagIsAtomised(st.id);
        // Atomised tiles need a bit more visual room so the atom mosaic reads.
        // Boost their flex-grow proportionally to atom count.
        const growBoost = atomised ? Math.max(count, ATOMS[st.id].length * 1.2) : count;

        // Atomised tiles: no overall coverage colour, no visible name on the
        // tile face. The atom cells carry the colour; the subtag name lives
        // in the tile-button title (hover) and in the drill-down. This keeps
        // tile names from giving away atom answers when atoms get specific.
        // Non-atomised tiles use the existing single-block presentation.
        let tileStyle, titleText, children;
        if (atomised) {
          tileStyle = "flex-grow:" + growBoost + ";";
          titleText = st.name + " · " + count + " questions · click for stats";
          children = [renderAtomMosaic(st.id)];
        } else {
          const cov = coverageForSubtag(st.id);
          tileStyle =
            "flex-grow:" + count + ";" +
            " --tile-fill:" + cov.fill + ";" +
            " --tile-text:" + cov.text + ";" +
            " --tile-text-soft:" + cov.textSoft + ";";
          titleText = st.name + " · " + count + " questions"
            + (cov.attemptCount === 0 ? " · no attempts yet"
               : (" · " + cov.attemptCount + " of last attempts averaged "
                  + Math.round(cov.avg * 100) + "%"));
          children = [
            el("span", { class: "tile-name", text: st.name }),
            el("span", { class: "tile-num" }, [
              el("span", { class: "tile-q", text: String(count) }),
              cov.attemptCount > 0 ? el("span", { class: "tile-pct", text: " · " + Math.round(cov.avg * 100) + "%" }) : null
            ])
          ];
        }
        const tile = el("button", {
          class: "tile" + (isActive ? " tile-active" : "") + (atomised ? " tile-atomised" : ""),
          type: "button",
          title: titleText,
          "data-id": st.id,
          style: tileStyle,
          onClick: function () { openDrilldown(st.id); }
        }, children);
        tiles.appendChild(tile);
      });
      groupEl.appendChild(tiles);
      root.appendChild(groupEl);
    });

    // Legend (small, at bottom of coverage panel)
    const winLabel = (store.coverageWindow === 100) ? "across all attempts"
                    : ("over your last " + (store.coverageWindow || 2) + " attempts");
    const legend = el("div", { class: "cov-legend" }, [
      el("div", { class: "cov-legend-title", text: "Tile colour: average " + winLabel + " in that subtag. Mosaic tiles split into atoms; hover for the atom name." }),
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
     8b. Subtag drill-down (v1.3)
     Click a tile, see a modal with stats: total questions, attempts, accuracy
     within the configured window and overall, type breakdown, recent attempts.
     "Filter practice to this subtag" button replaces the old click-to-filter.
     ────────────────────────────────────────────────────────────────────────── */

  function openDrilldown(subtagId) {
    const overlay = document.getElementById("drilldown-overlay");
    if (!overlay) return;
    const content = document.getElementById("drilldown-content");
    content.innerHTML = "";
    content.appendChild(buildDrilldownContent(subtagId));
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    // Mark body so the main app layout can shift over to make room (desktop).
    document.body.classList.add("drilldown-open");
  }

  function closeDrilldown() {
    const overlay = document.getElementById("drilldown-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drilldown-open");
  }

  // v1.4 prototype: render the atom mosaic inside an atomised tile.
  // The radiation_types atoms are arranged attribute-major in the registry
  // (composition for α, β, γ; then charge for α, β, γ; etc), so a
  // grid-template-columns: 3 lays them out as a tidy attribute × type matrix
  // with α / β / γ in the columns, attributes in the rows. Hover reveals the
  // atom name. Clicks bubble up to the tile (which opens the drilldown).
  // v1.4.1: add tiny α / β / γ column markers so the matrix is legible.
  // We don't add row labels (composition/charge/etc) because some of those
  // names would hint at answers; users see them on hover and in drill-down.
  function renderAtomMosaic(subtagId) {
    const atomList = ATOMS[subtagId];
    if (!atomList) return el("span");

    const wrap = el("span", { class: "atom-mosaic-wrap" });

    // Column markers: derive distinct groups in registry order.
    const groupsSeen = [];
    atomList.forEach(function (atom) {
      if (groupsSeen.indexOf(atom.group) === -1) groupsSeen.push(atom.group);
    });
    const groupGlyph = { alpha: "α", beta: "β", gamma: "γ" };
    const headerRow = el("span", { class: "atom-mosaic-head" },
      groupsSeen.map(function (g) {
        return el("span", { class: "atom-mosaic-col-label", text: groupGlyph[g] || g });
      })
    );
    wrap.appendChild(headerRow);

    const mosaic = el("span", { class: "atom-mosaic" });
    atomList.forEach(function (atom) {
      const cov = coverageForAtom(atom.id);
      const titleParts = [atom.name];
      if (cov.attemptCount === 0) titleParts.push("untried");
      else titleParts.push(cov.attemptCount + " recent · avg " + Math.round(cov.avg * 100) + "%");
      const cell = el("span", {
        class: "atom-cell atom-cell-" + (atom.group || "x") + (cov.attemptCount === 0 ? " is-untried" : ""),
        title: titleParts.join(" · "),
        style: "background:" + cov.fill + ";",
        "data-atom": atom.id
      });
      mosaic.appendChild(cell);
    });
    wrap.appendChild(mosaic);
    return wrap;
  }

  function buildDrilldownContent(subtagId) {
    const info = SUBTAG_INDEX[subtagId];
    const subtagName = info ? info.name : subtagId;
    const groupName = info ? info.parentName : "";
    const totalActive = SUBTAG_COUNTS[subtagId] || 0;

    // Filter attempts to this subtag.
    const subAttempts = store.attempts.filter(function (a) {
      return Array.isArray(a.subtags) && a.subtags.indexOf(subtagId) !== -1;
    });
    const totalAttempts = subAttempts.length;

    // Accuracy in window vs all-time.
    const win = (typeof store.coverageWindow === "number" && store.coverageWindow > 0) ? store.coverageWindow : 2;
    const recent = subAttempts.slice(-win);
    function avgFraction(arr) {
      if (!arr.length) return null;
      let s = 0;
      arr.forEach(function (a) {
        const possible = a.marksPossible > 0 ? a.marksPossible : 1;
        s += a.marksAwarded / possible;
      });
      return s / arr.length;
    }
    const recentAvg = avgFraction(recent);
    const allTimeAvg = avgFraction(subAttempts);

    // Status counts (full / partial / none) within all attempts.
    const statusCounts = { full: 0, partial: 0, none: 0 };
    subAttempts.forEach(function (a) {
      if (a.status === "full") statusCounts.full++;
      else if (a.status === "partial") statusCounts.partial++;
      else statusCounts.none++;
    });

    // Active questions per type WITHIN this subtag.
    const typeCounts = { mcq: 0, short: 0, long: 0, numeric: 0 };
    ALL_QUESTIONS.forEach(function (q) {
      if (q.parked === true) return;
      if (!Array.isArray(q.tags) || q.tags.indexOf(subtagId) === -1) return;
      if (typeCounts[q.type] != null) typeCounts[q.type]++;
    });

    // Header row
    const closeBtn = el("button", {
      class: "dd-close",
      type: "button",
      "aria-label": "Close",
      onClick: closeDrilldown,
      text: "×"
    });
    const head = el("div", { class: "dd-head" }, [
      el("div", null, [
        el("div", { class: "dd-eyebrow", text: groupName + " · subtag" }),
        el("h2", { class: "dd-title", text: subtagName })
      ]),
      closeBtn
    ]);

    // Top stats row
    function statBox(label, value, sub) {
      return el("div", { class: "dd-stat" }, [
        el("div", { class: "dd-stat-label", text: label }),
        el("div", { class: "dd-stat-value", text: value }),
        sub ? el("div", { class: "dd-stat-sub", text: sub }) : null
      ]);
    }
    function pct(v) { return v == null ? "—" : Math.round(v * 100) + "%"; }
    const stats = el("div", { class: "dd-stats" }, [
      statBox("Active questions", String(totalActive), totalActive === 1 ? "question in pool" : "questions in pool"),
      statBox("Your attempts", String(totalAttempts), totalAttempts === 1 ? "attempt logged" : "attempts logged"),
      statBox("Last " + win + " avg", pct(recentAvg), recent.length + (recent.length === 1 ? " attempt" : " attempts") + " counted"),
      statBox("All-time avg", pct(allTimeAvg), totalAttempts === 0 ? "no attempts yet" : "across all attempts")
    ]);

    // Type breakdown
    const typeBreakdown = el("div", { class: "dd-types" }, [
      el("h3", { text: "Question types in this subtag (active)" }),
      el("div", { class: "dd-types-row" }, ["mcq", "short", "long", "numeric"].map(function (t) {
        if ((typeCounts[t] || 0) === 0) return null;
        return el("div", { class: "dd-type-item" }, [
          el("span", { class: "dd-type-label", text: t }),
          el("span", { class: "dd-type-count", text: String(typeCounts[t]) })
        ]);
      }).filter(Boolean))
    ]);

    // Status breakdown (only if there are attempts)
    let statusBreakdown = null;
    if (totalAttempts > 0) {
      statusBreakdown = el("div", { class: "dd-status-breakdown" }, [
        el("h3", { text: "Mark distribution" }),
        el("div", { class: "dd-status-row" }, [
          el("div", { class: "dd-status-pill dd-status-full", text: "Full · " + statusCounts.full }),
          el("div", { class: "dd-status-pill dd-status-partial", text: "Partial · " + statusCounts.partial }),
          el("div", { class: "dd-status-pill dd-status-wrong", text: "None · " + statusCounts.none })
        ])
      ]);
    }

    // v1.4.1: per-atom breakdown for atomised subtags. Each row shows the
    // atom's current colour swatch, its name, recent count and average,
    // and an all-time count. Untried atoms show as a muted row.
    let atomBreakdown = null;
    if (subtagIsAtomised(subtagId)) {
      const atomList = ATOMS[subtagId];
      atomBreakdown = el("div", { class: "dd-atoms" }, [
        el("h3", { text: "Atom breakdown (last " + win + " in window)" }),
        el("ul", { class: "dd-atom-list" }, atomList.map(function (atom) {
          const cov = coverageForAtom(atom.id);
          const allCount = subAttempts.filter(function (a) {
            return Array.isArray(a.atoms) && a.atoms.indexOf(atom.id) !== -1;
          }).length;
          const stat = (cov.attemptCount === 0)
            ? "untried"
            : (cov.attemptCount + " in window · " + Math.round(cov.avg * 100) + "% · " + allCount + " all-time");
          return el("li", {
            class: "dd-atom-row" + (cov.attemptCount === 0 ? " is-untried" : "")
          }, [
            el("span", { class: "dd-atom-swatch", style: "background:" + cov.fill + ";" }),
            el("span", { class: "dd-atom-name", text: atom.name }),
            el("span", { class: "dd-atom-stat", text: stat })
          ]);
        }))
      ]);
    }

    // Recent attempts list (last 10, newest first)
    let recentList = null;
    if (totalAttempts > 0) {
      const lastTen = subAttempts.slice(-10).reverse();
      recentList = el("div", { class: "dd-recent" }, [
        el("h3", { text: "Recent attempts (newest first)" }),
        el("ul", { class: "dd-recent-list" }, lastTen.map(function (a) {
          const dt = new Date(a.timestamp);
          const when = isNaN(dt) ? "" : dt.toLocaleString();
          const fraction = a.marksAwarded + "/" + a.marksPossible;
          return el("li", { class: "dd-recent-item dd-recent-" + a.status }, [
            el("span", { class: "dd-recent-when", text: when }),
            el("span", { class: "dd-recent-id", text: a.questionId || "?" }),
            el("span", { class: "dd-recent-mark", text: fraction })
          ]);
        }))
      ]);
    }

    // Footer actions
    const isCurrent = (store.activeFilter === subtagId);
    const filterBtn = el("button", {
      class: "btn btn-primary dd-filter-btn",
      type: "button",
      onClick: function () {
        setFilter(isCurrent ? null : subtagId);
        closeDrilldown();
      },
      text: isCurrent ? "Stop filtering, show all subtags" : "Filter practice to this subtag"
    });
    const closeFootBtn = el("button", {
      class: "btn dd-close-foot-btn",
      type: "button",
      onClick: closeDrilldown,
      text: "Close"
    });
    const foot = el("div", { class: "dd-foot" }, [filterBtn, closeFootBtn]);

    return el("div", null, [head, stats, atomBreakdown, typeBreakdown, statusBreakdown, recentList, foot]);
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

  // v1.3: render the per-type filter chips into the always-visible #type-strip
  // at the top of the page (replaces the Settings-panel injection from v1.2).
  // Counts shown next to each label reflect ACTIVE (non-parked) questions of
  // that type; they don't change as you toggle, so the user can see "you're
  // hiding 12 long-answer questions" while choosing.
  function renderTypeStrip() {
    const root = document.getElementById("type-strip");
    if (!root) return;
    root.innerHTML = "";

    const counts = {};
    TYPES.forEach(function (t) { counts[t] = 0; });
    ALL_QUESTIONS.forEach(function (q) {
      if (q.parked === true) return;
      if (counts[q.type] != null) counts[q.type]++;
    });

    root.appendChild(el("span", { class: "type-strip-eyebrow", text: "Show types:" }));

    TYPES.forEach(function (type) {
      if ((counts[type] || 0) === 0) return; // hide chips for types with no active questions
      const label = TYPE_LABELS[type] || type;
      const isExcluded = (Array.isArray(store.excludedTypes) && store.excludedTypes.indexOf(type) !== -1);
      const chip = el("button", {
        type: "button",
        class: "type-chip" + (isExcluded ? " is-off" : " is-on"),
        "aria-pressed": isExcluded ? "false" : "true",
        title: isExcluded ? "Click to include " + label + " in the practice pool"
                          : "Click to hide " + label + " from the practice pool",
        onClick: function () {
          if (!Array.isArray(store.excludedTypes)) store.excludedTypes = [];
          const idx = store.excludedTypes.indexOf(type);
          if (idx === -1) store.excludedTypes.push(type);
          else store.excludedTypes.splice(idx, 1);
          persist();
          computeSubtagCounts();
          renderTypeStrip();
          renderQuestion();
          renderCoverage();
          updateProgressLine();
        }
      }, [
        el("span", { class: "type-chip-label", text: label }),
        el("span", { class: "type-chip-count", text: String(counts[type]) })
      ]);
      root.appendChild(chip);
    });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     10b. Coverage window setting injected into Settings panel
     ────────────────────────────────────────────────────────────────────────── */

  function injectCoverageWindowSetting() {
    const panel = document.querySelector(".settings-panel");
    if (!panel) return;
    const firstSection = panel.querySelector(".settings-section");

    const select = el("select", {
      id: "coverage-window-select",
      class: "settings-select",
      onChange: function (e) {
        const v = parseInt(e.target.value, 10);
        if (COVERAGE_WINDOW_OPTIONS.indexOf(v) === -1) return;
        store.coverageWindow = v;
        persist();
        renderCoverage();
        updateProgressLine();
      }
    }, COVERAGE_WINDOW_OPTIONS.map(function (n) {
      const label = (n === 100) ? "All attempts" : "Last " + n + " attempts";
      const opt = el("option", { value: String(n), text: label });
      if (store.coverageWindow === n) opt.selected = true;
      return opt;
    }));

    const section = el("div", { class: "settings-section" }, [
      el("h3", null, "Coverage colour window"),
      el("p", null, "How many recent attempts in a subtag the tile colour averages over. Smaller windows react faster to recent answers; larger windows are steadier."),
      select
    ]);
    if (firstSection) panel.insertBefore(section, firstSection);
    else panel.appendChild(section);
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

    // v1.3: settings panel gets a coverage-window selector instead of the
    // type-toggles (which now live in the always-visible top strip).
    injectCoverageWindowSetting();

    // v1.3: render the per-type chip strip into #type-strip in the main view.
    renderTypeStrip();

    // v1.3: subtag drill-down modal wiring (close on overlay-click and Esc).
    const ddOverlay = document.getElementById("drilldown-overlay");
    if (ddOverlay) {
      ddOverlay.addEventListener("click", function (e) {
        if (e.target.id === "drilldown-overlay") closeDrilldown();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (ddOverlay && ddOverlay.classList.contains("open")) closeDrilldown();
        else if (document.getElementById("settings-overlay").classList.contains("open")) closeSettings();
      }
    });

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
