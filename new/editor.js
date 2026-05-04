/* ============================================================================
   Question bank editor — v1
   ----------------------------------------------------------------------------
   Loads window.PREIB_RAD_QUESTIONS, lets the teacher view, filter and edit
   questions, persists edits to localStorage as a working draft, and exports
   a fresh topic7_radioactivity.js file for download.

   Architecture:
   - baseline: deep clone of window.PREIB_RAD_QUESTIONS, immutable.
   - working : deep clone, mutated by the user's edits.
   - draft   : working serialised to localStorage. Reloaded on page open.

   Editable in v1: prompt, marks, difficultyRating, explanation, examinerNote,
   markPoints (synonyms), choices, answerIndex, distractorRationales, parked.

   NOT editable in v1 (read-only): tags, specRefs, instances, type. These will
   be added in a later iteration.
   ============================================================================ */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────────────────────────────────
     1. Topic 7 vocabulary (mirrors engine.js)
     ────────────────────────────────────────────────────────────────────────── */

  const VOCAB = {
    parentGroups: [
      { id: "basics",    name: "Basic ideas", subtags: [
        { id: "units",             name: "Units" },
        { id: "atomic_struct",     name: "Atomic structure" },
        { id: "nuclide_notation",  name: "Nuclide notation" },
        { id: "ionising_random",   name: "Ionising / random" },
        { id: "radiation_types",   name: "Nature of α, β, γ" },
        { id: "penetration",       name: "Penetration" },
        { id: "background",        name: "Background radiation" },
        { id: "halflife",          name: "Half-life" }
      ]},
      { id: "practical", name: "Practical", subtags: [
        { id: "practical_penetration", name: "Penetration practical" }
      ]},
      { id: "uses",      name: "Uses", subtags: [
        { id: "uses_alpha", name: "Uses of alpha" },
        { id: "uses_beta",  name: "Uses of beta" },
        { id: "uses_gamma", name: "Uses of gamma" }
      ]},
      { id: "hazards",   name: "Hazards", subtags: [
        { id: "bio_effects",          name: "Biological effects" },
        { id: "which_most_dangerous", name: "Most dangerous when" },
        { id: "contam_irrad",         name: "Contamination vs irradiation" },
        { id: "waste_disposal",       name: "Waste & precautions" }
      ]},
      { id: "nuclear",   name: "Fission & fusion", subtags: [
        { id: "energy_from_nuclear", name: "Nuclear energy" },
        { id: "fission",             name: "Fission" },
        { id: "fusion",              name: "Fusion" },
        { id: "shielding",           name: "Reactor shielding" }
      ]}
    ],
    crossCutting: ["definition", "extended_writing"]
  };

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

  /* ──────────────────────────────────────────────────────────────────────────
     2. State
     ────────────────────────────────────────────────────────────────────────── */

  const DRAFT_KEY = "smithics_topic7_editor_draft_v1";
  let baseline = [];      // canonical from file, immutable
  let working = [];       // editable copy
  let selectedId = null;  // currently selected question id
  let filterState = {
    search: "",
    subtag: "",
    type: "",
    difficulty: "",
    // Default "all" so toggling park doesn't hide the question — you couldn't
    // un-park it then. The user can switch to "Active only" to focus.
    status: "all",
    sort: "position"
  };

  function deepClone(v) { return JSON.parse(JSON.stringify(v)); }

  function questionByIdInWorking(id) {
    return working.find(function (q) { return q && q.id === id; }) || null;
  }
  function indexInWorking(id) {
    return working.findIndex(function (q) { return q && q.id === id; });
  }
  function questionByIdInBaseline(id) {
    return baseline.find(function (q) { return q && q.id === id; }) || null;
  }

  function isDirty(qid) {
    const w = questionByIdInWorking(qid);
    const b = questionByIdInBaseline(qid);
    if (!w || !b) return !!w !== !!b;
    return JSON.stringify(w) !== JSON.stringify(b);
  }

  function dirtyCount() {
    let n = 0;
    working.forEach(function (q) { if (q && isDirty(q.id)) n++; });
    // Count deletions too: baseline ids no longer present in working.
    baseline.forEach(function (b) {
      if (b && !questionByIdInWorking(b.id)) n++;
    });
    return n;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     3. localStorage draft
     ────────────────────────────────────────────────────────────────────────── */

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        savedAt: new Date().toISOString(),
        questions: working
      }));
    } catch (e) {
      console.warn("Could not save editor draft:", e);
    }
  }
  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.questions)) return null;
      return parsed.questions;
    } catch (e) {
      return null;
    }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
  }

  /* ──────────────────────────────────────────────────────────────────────────
     4. DOM helper
     ────────────────────────────────────────────────────────────────────────── */

  function el(tag, props, children) {
    const e = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        const v = props[k];
        if (v == null) return;
        if (k === "class") e.className = v;
        else if (k === "style") e.setAttribute("style", v);
        else if (k === "html") e.innerHTML = v;
        else if (k === "text") e.textContent = v;
        else if (k === "for") e.htmlFor = v;
        else if (k.indexOf("on") === 0) e.addEventListener(k.substring(2).toLowerCase(), v);
        else e.setAttribute(k, v);
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
  function $(sel) { return document.querySelector(sel); }

  /* ──────────────────────────────────────────────────────────────────────────
     5. Filtering and sorting
     ────────────────────────────────────────────────────────────────────────── */

  function primarySubtag(q) {
    if (!Array.isArray(q.tags)) return "";
    for (const t of q.tags) if (isCoverageTag(t)) return t;
    return "";
  }

  function applyFilters() {
    let pool = working.map(function (q, i) { return { q: q, position: i }; });

    if (filterState.search) {
      const needle = filterState.search.toLowerCase();
      pool = pool.filter(function (item) {
        const q = item.q;
        if (!q) return false;
        if (q.id && q.id.toLowerCase().indexOf(needle) !== -1) return true;
        if (q.prompt && q.prompt.toLowerCase().indexOf(needle) !== -1) return true;
        return false;
      });
    }
    if (filterState.subtag) {
      pool = pool.filter(function (item) {
        return Array.isArray(item.q.tags) && item.q.tags.indexOf(filterState.subtag) !== -1;
      });
    }
    if (filterState.type) {
      pool = pool.filter(function (item) { return item.q.type === filterState.type; });
    }
    if (filterState.difficulty) {
      const d = parseInt(filterState.difficulty, 10);
      pool = pool.filter(function (item) { return item.q.difficultyRating === d; });
    }
    if (filterState.status === "active") {
      pool = pool.filter(function (item) { return item.q.parked !== true; });
    } else if (filterState.status === "parked") {
      pool = pool.filter(function (item) { return item.q.parked === true; });
    }

    const sortFn = {
      position:   function (a, b) { return a.position - b.position; },
      id:         function (a, b) { return (a.q.id || "").localeCompare(b.q.id || ""); },
      type:       function (a, b) { return (a.q.type || "").localeCompare(b.q.type || ""); },
      difficulty: function (a, b) { return (a.q.difficultyRating || 0) - (b.q.difficultyRating || 0); },
      marks:      function (a, b) { return (a.q.marks || 0) - (b.q.marks || 0); },
      subtag:     function (a, b) { return primarySubtag(a.q).localeCompare(primarySubtag(b.q)); }
    }[filterState.sort] || sortFn.position;
    pool.sort(sortFn);

    return pool.map(function (item) { return item.q; });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     6. List rendering
     ────────────────────────────────────────────────────────────────────────── */

  function renderList() {
    const list = $("#ed-list");
    list.innerHTML = "";
    const filtered = applyFilters();

    const counts = $("#ed-counts");
    const totalAll = working.length;
    const dCount = dirtyCount();
    counts.textContent =
      filtered.length + " of " + totalAll + " shown" +
      (dCount > 0 ? " · " + dCount + " modified" : "");

    filtered.forEach(function (q) {
      list.appendChild(renderListRow(q));
    });

    if (filtered.length === 0) {
      list.appendChild(el("li", { class: "ed-row" }, [
        el("div", { class: "ed-row-prompt", text: "No questions match the current filters." })
      ]));
    }
  }

  function renderListRow(q) {
    const subtag = primarySubtag(q);
    const subtagName = (SUBTAG_INDEX[subtag] && SUBTAG_INDEX[subtag].name) || subtag || "(no subtag)";
    const isActive = (q.id === selectedId);
    const isDirtyQ = isDirty(q.id);
    const className =
      "ed-row" +
      (isActive ? " is-active" : "") +
      (q.parked === true ? " is-parked" : "") +
      (isDirtyQ ? " is-dirty" : "");

    const meta = el("div", { class: "ed-row-meta" }, [
      el("span", { class: "ed-row-id", text: q.id || "(no id)" }),
      el("span", { class: "ed-row-tag ed-row-tag-type-" + (q.type || "x"), text: q.type || "?" }),
      q.parked === true ? el("span", { class: "ed-row-tag ed-row-tag-parked", text: "parked" }) : null
    ]);

    const prompt = el("div", { class: "ed-row-prompt", text: q.prompt || "(no prompt)" });

    const foot = el("div", { class: "ed-row-foot" }, [
      el("span", { class: "ed-row-foot-item", text: subtagName }),
      el("span", { class: "ed-row-foot-item", text: (q.marks || 0) + (q.marks === 1 ? "m" : "m") }),
      el("span", { class: "ed-row-foot-item", text: "d" + (q.difficultyRating || "?") }),
      Array.isArray(q.instances) && q.instances.length > 0
        ? el("span", { class: "ed-row-foot-item", text: q.instances.length + " var" })
        : null
    ]);

    return el("li", {
      class: className,
      "data-id": q.id,
      onClick: function () { selectQuestion(q.id); }
    }, [meta, prompt, foot]);
  }

  function selectQuestion(qid) {
    selectedId = qid;
    renderList();
    renderDetail();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     7. Detail rendering with editable fields
     ────────────────────────────────────────────────────────────────────────── */

  function renderDetail() {
    const root = $("#ed-detail");
    root.innerHTML = "";
    if (!selectedId) {
      root.appendChild(el("div", { class: "ed-detail-empty", text: "Select a question on the left to edit." }));
      return;
    }
    const q = questionByIdInWorking(selectedId);
    if (!q) {
      root.appendChild(el("div", { class: "ed-detail-empty", text: "Question not found." }));
      return;
    }

    // Header: id badge + park toggle
    const tagsLine = (Array.isArray(q.tags) ? q.tags : []).map(function (t) {
      return SUBTAG_INDEX[t] ? SUBTAG_INDEX[t].name : t;
    }).join(" · ");

    const parkCheckbox = el("input", {
      type: "checkbox",
      id: "ed-park-checkbox",
      onChange: function (e) { onParkToggle(q.id, !!e.target.checked); }
    });
    parkCheckbox.checked = (q.parked === true);

    const hd = el("div", { class: "ed-detail-hd" }, [
      el("div", null, [
        el("h2", { text: "Question" }),
        el("div", { class: "ed-detail-hd-meta" }, [
          el("span", { class: "ed-detail-id", text: q.id || "(no id)" }),
          el("span", { class: "ed-row-tag ed-row-tag-type-" + (q.type || "x"), text: q.type || "?" }),
          el("span", { class: "ed-row-foot-item", text: tagsLine || "(no tags)" }),
          isDirty(q.id) ? el("span", { class: "ed-row-tag", style: "background:#fdf5da;color:#b67524;", text: "modified" }) : null
        ])
      ]),
      el("label", { class: "ed-detail-park", for: "ed-park-checkbox" }, [
        parkCheckbox,
        el("span", { text: "Parked (excluded from delivery)" })
      ])
    ]);
    root.appendChild(hd);

    // Parking reason: editable when parked, hidden when not.
    // The reason persists if the user unparks-then-reparks, so you don't have
    // to retype it. If you want to forget the reason, clear the field.
    if (q.parked === true) {
      const reasonField = renderTextareaField(
        "Parking reason (why this question is excluded)",
        q.parkedFor || "",
        function (v) { onFieldChange(q.id, "parkedFor", v); },
        2
      );
      reasonField.classList.add("ed-park-reason");
      root.appendChild(reasonField);
    }

    // Prompt
    root.appendChild(renderTextareaField("Prompt", q.prompt || "", function (v) { onFieldChange(q.id, "prompt", v); }, 3));

    // Marks / difficulty / allowAdjust row
    const fieldRow = el("div", { class: "ed-field-row" }, [
      renderNumberField("Marks", q.marks, 0, 20, function (v) { onFieldChange(q.id, "marks", v); }),
      renderNumberField("Difficulty (1-5)", q.difficultyRating, 1, 5, function (v) { onFieldChange(q.id, "difficultyRating", v); })
    ]);
    if (q.type === "short" || q.type === "long") {
      fieldRow.appendChild(renderAllowAdjustField(q));
    }
    root.appendChild(fieldRow);

    // Type-specific editors
    if (q.type === "mcq") {
      root.appendChild(renderMCQEditor(q));
    } else if (q.type === "short" || q.type === "long") {
      root.appendChild(renderMarkPointsEditor(q));
    } else if (q.type === "numeric") {
      root.appendChild(renderNumericEditor(q));
    }

    // Explanation
    root.appendChild(el("h3", { text: "Model answer (explanation)" }));
    root.appendChild(renderTextareaField(null, q.explanation || "", function (v) { onFieldChange(q.id, "explanation", v); }, 3));

    // Examiner note
    root.appendChild(el("h3", { text: "Examiner note (optional)" }));
    root.appendChild(renderTextareaField(null, q.examinerNote || "", function (v) { onFieldChange(q.id, "examinerNote", v); }, 2));

    // Read-only sections: tags, specRefs, instances
    root.appendChild(el("h3", { text: "Tags & spec refs (read-only in v1)" }));
    root.appendChild(el("div", { class: "ed-readonly", text:
      "tags: [" + (q.tags || []).map(function (t) { return '"' + t + '"'; }).join(", ") + "]" }));
    root.appendChild(el("div", { class: "ed-readonly", text:
      "specRefs: [" + (q.specRefs || []).map(function (t) { return '"' + t + '"'; }).join(", ") + "]" }));

    if (Array.isArray(q.instances) && q.instances.length) {
      root.appendChild(el("h3", { text: "Instances (variants — read-only in v1)" }));
      q.instances.forEach(function (inst, i) {
        root.appendChild(renderInstanceReadonly(inst, i));
      });
    }

    // Footer toolbar: revert / delete
    const foot = el("div", { class: "ed-detail-foot" }, [
      el("button", {
        class: "ed-btn",
        type: "button",
        onClick: function () { revertQuestion(q.id); },
        text: "Revert this question"
      }),
      el("button", {
        class: "ed-btn ed-btn-danger",
        type: "button",
        onClick: function () { deleteQuestion(q.id); },
        title: "Permanently remove from the bank. Use Park if you might want it back.",
        text: "Delete from bank"
      }),
      isDirty(q.id) ? el("span", { class: "ed-helptext", text: "(this question has unsaved edits)" }) : null
    ]);
    root.appendChild(foot);
  }

  function renderTextareaField(label, value, onCommit, rows) {
    const ta = el("textarea", {
      class: "ed-field-textarea",
      rows: String(rows || 3),
      onChange: function (e) { onCommit(e.target.value); }
    });
    ta.value = value;
    if (label) {
      return el("div", { class: "ed-field" }, [
        el("label", { class: "ed-field-label", text: label }),
        ta
      ]);
    }
    return el("div", { class: "ed-field" }, [ta]);
  }
  function renderNumberField(label, value, min, max, onCommit) {
    const inp = el("input", {
      type: "number",
      class: "ed-field-input",
      min: String(min),
      max: String(max),
      value: String(value == null ? "" : value),
      onChange: function (e) {
        const v = parseInt(e.target.value, 10);
        if (isNaN(v)) return;
        onCommit(v);
      }
    });
    return el("div", { class: "ed-field" }, [
      el("label", { class: "ed-field-label", text: label }),
      inp
    ]);
  }
  function renderAllowAdjustField(q) {
    const cb = el("input", {
      type: "checkbox",
      onChange: function (e) { onFieldChange(q.id, "allowAdjust", e.target.checked); }
    });
    cb.checked = (q.allowAdjust !== false);
    return el("div", { class: "ed-field" }, [
      el("label", { class: "ed-field-label", text: "allowAdjust (let student override mark)" }),
      el("label", { class: "ed-detail-park" }, [cb, el("span", { text: q.allowAdjust === false ? "Off (auto-mark final)" : "On (student can adjust)" })])
    ]);
  }

  /* ── Markpoints editor (short / long) ───────────────────────────────────── */

  function renderMarkPointsEditor(q) {
    const wrap = el("div", null);
    wrap.appendChild(el("h3", { text: "Markpoints (each entry = 1 mark by default; capped at total marks)" }));
    const list = el("div", null);
    const points = Array.isArray(q.markPoints) ? q.markPoints : [];
    points.forEach(function (mp, idx) {
      list.appendChild(renderMarkPoint(q, mp, idx));
    });
    wrap.appendChild(list);
    wrap.appendChild(el("button", {
      class: "ed-add-btn",
      type: "button",
      onClick: function () {
        if (!Array.isArray(q.markPoints)) q.markPoints = [];
        q.markPoints.push({ any: [""] });
        commitChange(q.id);
      },
      text: "+ Add markpoint"
    }));
    return wrap;
  }

  function renderMarkPoint(q, mp, idx) {
    const synList = el("ul", { class: "ed-syn-list" });
    const syns = Array.isArray(mp.any) ? mp.any : [];
    syns.forEach(function (syn, sidx) {
      synList.appendChild(renderSynonym(q, idx, sidx, syn));
    });

    const creditInput = el("input", {
      type: "number",
      min: "1", max: "5", step: "1",
      value: String(mp.credit == null ? 1 : mp.credit),
      onChange: function (e) {
        const v = parseInt(e.target.value, 10);
        q.markPoints[idx].credit = isNaN(v) ? 1 : v;
        commitChange(q.id);
      }
    });

    const removeBtn = el("button", {
      class: "ed-icon-btn ed-icon-btn-danger",
      type: "button",
      title: "Remove this markpoint",
      onClick: function () {
        q.markPoints.splice(idx, 1);
        commitChange(q.id);
      },
      text: "×"
    });

    return el("div", { class: "ed-mp" }, [
      el("div", { class: "ed-mp-hd" }, [
        el("span", { class: "ed-mp-num", text: "Markpoint " + (idx + 1) }),
        el("span", { class: "ed-mp-credit" }, [
          el("span", { text: "credit:" }),
          creditInput
        ]),
        removeBtn
      ]),
      synList,
      el("button", {
        class: "ed-add-btn",
        type: "button",
        onClick: function () {
          if (!Array.isArray(q.markPoints[idx].any)) q.markPoints[idx].any = [];
          q.markPoints[idx].any.push("");
          commitChange(q.id);
        },
        text: "+ Add synonym"
      })
    ]);
  }

  function renderSynonym(q, mpIdx, sIdx, val) {
    const inp = el("input", {
      type: "text",
      value: val,
      placeholder: "synonym phrase…",
      onChange: function (e) {
        q.markPoints[mpIdx].any[sIdx] = e.target.value;
        commitChange(q.id);
      }
    });
    const rm = el("button", {
      class: "ed-icon-btn ed-icon-btn-danger",
      type: "button",
      title: "Remove this synonym",
      onClick: function () {
        q.markPoints[mpIdx].any.splice(sIdx, 1);
        commitChange(q.id);
      },
      text: "×"
    });
    return el("li", { class: "ed-syn-item" }, [inp, rm]);
  }

  /* ── MCQ editor ─────────────────────────────────────────────────────────── */

  function renderMCQEditor(q) {
    const wrap = el("div", null);
    wrap.appendChild(el("h3", { text: "Choices (click the radio to mark the correct answer)" }));
    const choices = Array.isArray(q.choices) ? q.choices : [];
    choices.forEach(function (choice, i) {
      wrap.appendChild(renderChoice(q, i, choice));
    });
    wrap.appendChild(el("button", {
      class: "ed-add-btn",
      type: "button",
      onClick: function () {
        if (!Array.isArray(q.choices)) q.choices = [];
        q.choices.push("");
        commitChange(q.id);
      },
      text: "+ Add choice"
    }));
    return wrap;
  }

  function renderChoice(q, i, choice) {
    const isCorrect = (q.answerIndex === i);
    const radio = el("input", {
      type: "radio",
      name: "ed-mcq-answer-" + q.id,
      onChange: function () {
        q.answerIndex = i;
        commitChange(q.id);
      }
    });
    radio.checked = isCorrect;

    const textInp = el("input", {
      class: "ed-choice-text",
      type: "text",
      value: choice || "",
      onChange: function (e) {
        q.choices[i] = e.target.value;
        commitChange(q.id);
      }
    });

    const rationale = (q.distractorRationales && q.distractorRationales[String(i)]) || "";
    const rationaleArea = el("textarea", {
      class: "ed-choice-rationale",
      placeholder: isCorrect ? "(no rationale needed for the correct choice)" : "Why is this distractor wrong? (shown if student picks it)",
      rows: "2",
      onChange: function (e) {
        if (!q.distractorRationales) q.distractorRationales = {};
        q.distractorRationales[String(i)] = e.target.value;
        commitChange(q.id);
      }
    });
    rationaleArea.value = rationale;

    const removeBtn = el("button", {
      class: "ed-icon-btn ed-icon-btn-danger",
      type: "button",
      title: "Remove this choice",
      onClick: function () {
        q.choices.splice(i, 1);
        // Adjust answerIndex if needed
        if (q.answerIndex === i) q.answerIndex = 0;
        else if (q.answerIndex > i) q.answerIndex -= 1;
        // Drop matching distractor rationale
        if (q.distractorRationales) {
          const newDR = {};
          Object.keys(q.distractorRationales).forEach(function (k) {
            const ki = parseInt(k, 10);
            if (ki === i) return;
            const newKey = ki > i ? String(ki - 1) : String(ki);
            newDR[newKey] = q.distractorRationales[k];
          });
          q.distractorRationales = newDR;
        }
        commitChange(q.id);
      },
      text: "×"
    });

    return el("div", { class: "ed-choice" + (isCorrect ? " is-correct" : "") }, [
      el("div", { class: "ed-choice-hd" }, [
        el("label", { class: "ed-choice-radio" }, [radio, el("span", { text: isCorrect ? "Correct" : "Distractor" })]),
        el("span", { class: "ed-choice-num", text: "Choice " + (i + 1) }),
        removeBtn
      ]),
      textInp,
      rationaleArea
    ]);
  }

  /* ── Numeric editor ─────────────────────────────────────────────────────── */

  function renderNumericEditor(q) {
    const wrap = el("div", null);
    wrap.appendChild(el("h3", { text: "Expected numeric answer" }));
    wrap.appendChild(el("div", { class: "ed-field-row" }, [
      renderNumberField("Answer (number)", q.answer == null ? q.expectedNumeric : q.answer, -1e12, 1e12, function (v) { onFieldChange(q.id, "answer", v); }),
      el("div", { class: "ed-field" }, [
        el("label", { class: "ed-field-label", text: "Unit hint" }),
        (function () {
          const inp = el("input", {
            class: "ed-field-input",
            type: "text",
            value: q.unitHint || "",
            onChange: function (e) { onFieldChange(q.id, "unitHint", e.target.value); }
          });
          return inp;
        })()
      ])
    ]));
    return wrap;
  }

  /* ── Instances (read-only display) ──────────────────────────────────────── */

  function renderInstanceReadonly(inst, i) {
    const bits = [];
    if (inst.prompt) bits.push(el("div", { class: "ed-inst-prompt", text: inst.prompt }));
    const otherFields = [];
    Object.keys(inst).forEach(function (k) {
      if (k === "prompt") return;
      let v = inst[k];
      if (typeof v === "object") v = JSON.stringify(v);
      otherFields.push(k + ": " + v);
    });
    if (otherFields.length) bits.push(el("div", { class: "ed-inst-fields", text: otherFields.join(" · ") }));
    return el("div", { class: "ed-inst" }, [
      el("div", { class: "ed-inst-hd", text: "Variant " + (i + 1) }),
      ...bits
    ]);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     8. Edit handlers
     ────────────────────────────────────────────────────────────────────────── */

  function onFieldChange(qid, field, value) {
    const q = questionByIdInWorking(qid);
    if (!q) return;
    q[field] = value;
    commitChange(qid);
  }

  function onParkToggle(qid, parked) {
    const q = questionByIdInWorking(qid);
    if (!q) return;
    if (parked) {
      q.parked = true;
      // Don't auto-fill parkedFor — leave the reason field empty so the user
      // sees an obvious "needs a reason" prompt. They can fill it in or leave
      // it blank if they don't want to record one.
    } else {
      delete q.parked;
      // We deliberately keep parkedFor so a user can unpark + repark without
      // re-typing the reason. Empty it if you want to clear it.
    }
    commitChange(qid);
  }

  function commitChange(qid) {
    saveDraft();
    updateStatus();
    renderList();
    renderDetail();
  }

  function revertQuestion(qid) {
    const idx = indexInWorking(qid);
    if (idx === -1) return;
    const baselineQ = questionByIdInBaseline(qid);
    if (!baselineQ) return;
    if (!confirm("Revert this question to the original file version? Your edits to it will be lost.")) return;
    working[idx] = deepClone(baselineQ);
    commitChange(qid);
  }

  // v1.1: delete a question from the working bank entirely. Two confirms
  // because it's irreversible after download. Park is the safer alternative
  // for "I might want it back."
  function deleteQuestion(qid) {
    const idx = indexInWorking(qid);
    if (idx === -1) return;
    const q = working[idx];
    if (!confirm(
      "Permanently DELETE this question from the bank?\n\n" +
      "id: " + q.id + "\n\n" +
      "Use Park instead if you might want it back. After you download the file, this is irreversible."
    )) return;
    if (!confirm("Really? This cannot be undone after the next download.")) return;
    working.splice(idx, 1);
    selectedId = null;
    saveDraft();
    updateStatus();
    renderList();
    renderDetail();
  }

  function revertAll() {
    if (dirtyCount() === 0) return;
    if (!confirm("Discard all unsaved edits and reload from the file? " + dirtyCount() + " modified question(s) will be reset.")) return;
    working = baseline.map(deepClone);
    clearDraft();
    updateStatus();
    renderList();
    renderDetail();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     9. Status indicator
     ────────────────────────────────────────────────────────────────────────── */

  function updateStatus() {
    const status = $("#ed-status");
    const n = dirtyCount();
    if (n === 0) {
      status.textContent = "No changes";
      status.className = "ed-status";
    } else {
      status.textContent = n + " question" + (n === 1 ? "" : "s") + " modified";
      status.className = "ed-status is-dirty";
    }
  }

  /* ──────────────────────────────────────────────────────────────────────────
     10. Download — serialise working copy to a JS file
     ────────────────────────────────────────────────────────────────────────── */

  function serialiseQuestion(q, indent) {
    // Stringify with 2-space indent. Quoted keys (still valid JS).
    const json = JSON.stringify(q, null, 2);
    // Re-indent so the question sits inside the array nicely.
    const lines = json.split("\n");
    return lines.map(function (line, i) {
      return (i === 0 ? indent : indent) + line;
    }).join("\n");
  }

  function serialiseFile() {
    // Build a fresh topic7_radioactivity.js. Drops original commentary and
    // the chunk slice references; the user can regenerate those if needed.
    const dt = new Date().toISOString();
    const lines = [];
    lines.push("// ============================================================================");
    lines.push("// Topic 7: Radioactivity — Pre-IB question bank");
    lines.push("// Edexcel 4SS0 alignment (schema v0.4)");
    lines.push("// Generated by editor on " + dt);
    lines.push("// " + working.length + " base questions");
    const typeMix = working.reduce(function (m, q) { m[q.type] = (m[q.type] || 0) + 1; return m; }, {});
    lines.push("// Type mix: " + Object.keys(typeMix).map(function (k) { return k + " " + typeMix[k]; }).join(", "));
    const parkedN = working.filter(function (q) { return q.parked === true; }).length;
    lines.push("// Active: " + (working.length - parkedN) + ", Parked: " + parkedN);
    lines.push("// ============================================================================");
    lines.push("");
    lines.push("window.PREIB_RAD_QUESTIONS = [");
    working.forEach(function (q, i) {
      lines.push(serialiseQuestion(q, "  ") + (i === working.length - 1 ? "" : ","));
    });
    lines.push("];");
    lines.push("");
    return lines.join("\n");
  }

  function downloadFile() {
    const content = serialiseFile();
    const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "topic7_radioactivity.js";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
      a.remove();
    }, 100);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     11. Filter wiring
     ────────────────────────────────────────────────────────────────────────── */

  function populateSubtagFilter() {
    const sel = $("#ed-subtag");
    VOCAB.parentGroups.forEach(function (g) {
      const og = el("optgroup", { label: g.name });
      g.subtags.forEach(function (st) {
        og.appendChild(el("option", { value: st.id, text: st.name }));
      });
      sel.appendChild(og);
    });
  }

  function wireFilters() {
    $("#ed-search").addEventListener("input", function (e) {
      filterState.search = e.target.value;
      renderList();
    });
    $("#ed-subtag").addEventListener("change", function (e) { filterState.subtag = e.target.value; renderList(); });
    $("#ed-type").addEventListener("change", function (e) { filterState.type = e.target.value; renderList(); });
    $("#ed-difficulty").addEventListener("change", function (e) { filterState.difficulty = e.target.value; renderList(); });
    $("#ed-status-filter").addEventListener("change", function (e) { filterState.status = e.target.value; renderList(); });
    $("#ed-sort").addEventListener("change", function (e) { filterState.sort = e.target.value; renderList(); });
  }

  function wireActions() {
    $("#ed-revert-btn").addEventListener("click", revertAll);
    $("#ed-download-btn").addEventListener("click", downloadFile);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     12. Bootstrap
     ────────────────────────────────────────────────────────────────────────── */

  function init() {
    if (!Array.isArray(window.PREIB_RAD_QUESTIONS) || window.PREIB_RAD_QUESTIONS.length === 0) {
      $("#ed-detail").innerHTML = "<div class='ed-detail-empty'>No questions loaded. Make sure topic7_radioactivity.js is on disk and listed in editor.html.</div>";
      return;
    }
    baseline = window.PREIB_RAD_QUESTIONS.map(deepClone);

    const draft = loadDraft();
    if (draft && draft.length === baseline.length) {
      // Sanity check: same number of questions, same id set. If yes, restore.
      const baselineIds = baseline.map(function (q) { return q.id; }).sort().join("|");
      const draftIds = draft.map(function (q) { return q.id; }).sort().join("|");
      if (draftIds === baselineIds) {
        working = draft;
      } else {
        if (confirm("There is a saved editor draft from a previous session, but its question list does not match the current file. Discard the draft and start fresh?")) {
          working = baseline.map(deepClone);
          clearDraft();
        } else {
          working = draft;
        }
      }
    } else if (draft) {
      if (confirm("There is a saved editor draft with " + draft.length + " questions, but the file now has " + baseline.length + ". Discard the draft and start fresh?")) {
        working = baseline.map(deepClone);
        clearDraft();
      } else {
        working = draft;
      }
    } else {
      working = baseline.map(deepClone);
    }

    populateSubtagFilter();
    wireFilters();
    wireActions();
    renderList();
    renderDetail();
    updateStatus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
