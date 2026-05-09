# Author brief: Topic 7 Radioactivity, v2 rewrite

**Date:** 2026-05-03
**Schema target:** v0.5 (`SCHEMA_v0_5_NEW_TYPES.md` plus the v0.4 base in the project's existing schema doc).
**Status:** active commission for a fresh authoring chat. Supersedes the Pass 1 and Pass 2 work in the existing `topic7_radioactivity.js`.

---

## 1. The commission

Produce a clean, syllabus-anchored Topic 7 question bank in v0.5 schema. The current file (`topic7_radioactivity.js`) has 218 base questions accumulated over Pass 1 and Pass 2; many are too long, too hard, or off-syllabus. The free-text marker has hit its ceiling. v0.5 adds six deterministic-marking question types and the bank should be rewritten around them.

Output a single `topic7_radioactivity.js` file that replaces the existing one entirely. Plus a short decisions log explaining why the headline calls were made.

This is **not** a tweak. Treat it as a rewrite, anchored to the syllabus rather than to the existing question list. Past-paper material informs, the syllabus binds.

---

## 2. Read these before starting

### Primary sources (anchor everything to these)

These are the three sources of truth. The bank must be defensible against all three.

1. **The Edexcel International GCSE Single Award (4SS0) specification PDF, Topic 7 section.** Defines the scope. The bank must not exceed it. 4PH1-only material is out; the full physics spec PDF can be consulted to confirm boundaries.
2. **The past papers and their mark schemes** for 4SS0 (and pertinent 4PH1 papers, where the question is in 4SS0 scope). Past papers calibrate difficulty, phrasing conventions, and what examiners actually ask. They carry as much weight as the spec for shaping individual questions; they show the spec in action.
3. **The teacher's syllabus notes CSV** (Topic 7 rows). The teacher's notes are derived largely from past mark schemes, plus additional content the spec implies could be asked. They're the authoritative phrasing source for marking and the canonical statement of what's "in" or "out" of scope.

If a question can be derived from any one of these, it has a place. If a question goes beyond all three, it's out of scope. If you find a tension between the three (e.g. a past paper tests something the syllabus notes don't mention), flag it in the decisions log; default to the spec.

### Reference docs

4. `SCHEMA_v0_5_NEW_TYPES.md` in this folder. Defines the six question types: matching, multiselect, ordering, categorise, fillblank, grid.
5. `SCHEMA_v0_4.md` (in the older project docs). The v0.4 base contract: question shape, subtopic vocabulary, instances mechanism, normalisation pre-pass for written answers, parking convention.
6. The current `topic7_radioactivity.js` to see what you're replacing. Look at it for past-paper-informed phrasing and as a starting point for the audit.

   **The teacher has done a partial parking pass via the editor.** Some questions carry `parked: true`; many haven't been touched yet. Don't assume an unparked question has been blessed; it may simply not have been reviewed. Some questions have also been deleted outright in earlier editor sessions and don't appear in the current file at all; you have what's in the file, that's the input.

   Where a `parkedFor: "..."` note exists, it sometimes captures the reason (off-syllabus, too hard, replaced by atomic mcqs, etc) and sometimes doesn't or is terse. Treat parkedFor notes as a hint, not a verdict. When the note is informative, use it; when it isn't, audit the question fresh.

   In rough terms two flavours of parking are in play:

   - **Parked for content** (off-syllabus, factually wrong, unfixably ambiguous, irrelevant to 4SS0). The teacher doesn't want this question in the bank in any form. Don't convert it. Either delete from the new file entirely, or keep it parked with a clear parkedFor if it might come back later (e.g. for a future 4PH1 commission).
   - **Parked for format** (the underlying question is fine but the format is wrong, e.g. it's a long-answer that should be a matching or grid; a multi-mark short that should be multi-select). These are conversion candidates. Read the question, identify what it actually tests, pick the right v0.5 type, write a fresh version, unparked.

   You will often have to infer which flavour applies. The parkedFor note may help; the spec scope and the question's content always do.

   Don't treat the existing file as an outline. Treat it as one input among several. The spec, the past papers, and the syllabus notes are the primary inputs.

You do **not** need to read the engine code, the editor code, or the schema design doc for v0.6 (autocomplete-from-vocabulary). Those are not your job.

---

## 3. What you are building

A new `topic7_radioactivity.js` file, JavaScript, declaring `window.PREIB_RAD_QUESTIONS` as an array of question objects. Same overall file shape as the existing one. The test of correctness is that the v1.5+ engine in this project loads and runs it without complaint.

Roughly 60–100 base questions, each with 2–4 instances where genuine variety exists. Instances are not paraphrases (see schema §4); use them only for genuine alternative angles on the same skill.

**Hard rules:**

- No questions of `type: "long"`. The long-answer type is parked at the engine level for v2 and should not appear in the bank.
- No `type: "short"` for anything beyond one-word or one-phrase recall (e.g. "name a use of gamma" answered in one or two words). Anything longer becomes one of the new deterministic types.
- Distractor rationales on every MCQ wrong-choice. No exceptions.
- Every question carries a `specRefs` array referencing the 4SS0 spec point(s) it tests. Off-syllabus questions get parked or deleted.
- Mark allocations must match the spec's normal allocation for that idea (typically 1 mark per markable point; not inflated).

**Authoring principle: atomise.** Prefer many small, focused questions to few large, multi-part ones. A 4-mark question testing four ideas is almost always better expressed as a 4-row matching, a 4-row grid, or a multi-select with four correct items. Beyond making marking deterministic, atomising lets the coverage map and atom mosaic give the student finer-grained feedback about what they actually know and don't know. When a question can be split into independent pieces, split it.

**Soft targets:**

- Type distribution roughly: 30% MCQ, 15% matching, 15% fillblank, 10% grid, 10% multiselect, 5% ordering, 5% categorise, 10% single-phrase short. Don't enforce these as quotas; pick the type that best fits each question. The mix should fall out naturally if you do.
- Difficulty distribution: 50% at d1, 35% at d2, 15% at d3. Almost no d4. d5 reserved for genuine stretch questions and should be rare.

---

## 4. The decision tree for question type

For each idea in the syllabus, work through this decision tree:

**Is the answer a single specific item (charge, name, count, definition)?**
- If the answer is genuinely one of N options that can be enumerated cleanly, use **mcq**.
- If the answer is a number, use **numeric**.
- If the answer is a single-word recall fitting into a sentence, use **fillblank** with one blank.
- If the answer is a single phrase that doesn't fit into a sentence frame, use **short** with `allowAdjust: false` (precise vocabulary required).

**Is the question asking the student to pair, sort, rank, or classify?**
- Pair-up of A↔B (radiation→charge, isotope→use): use **matching**.
- Rank by some ordered property (penetration, ionising power): use **ordering**.
- Sort items into 2–4 named groups (alpha use / beta use / gamma use): use **categorise**.
- Multiple correct from a list of options: use **multiselect**.
- Items × purposes matrix where each item belongs to one or more categories with possible neutrals: use **grid**.

**Is the question asking for a list of reasons or applications?**
- 1–2 items with strong recall: **fillblank** (one blank per item).
- 3+ items where order doesn't matter: **multiselect** with the correct items in `answerIndices`, plus 3–5 plausible distractors.
- 3+ items with cause-effect pairing: **matching** or **grid**.

**Does the question require multi-sentence reasoning?**
- Try to reframe as a sequence of smaller questions, each fitting one of the above types.
- If genuinely irreducible (rare in 4SS0), park it with a note. Do not write it as long-answer.

If you find yourself reaching for `type: "short"` with a markPoints array longer than five entries, stop. The question almost certainly fits one of the new types better.

---

## 5. Working in chunks

Process Topic 7 in five passes, one per parent group. Within each pass:

1. **Audit pass.** List every existing question in this group (including parked ones). For each, note: id, spec point, what it tests, current type, current marks, parking status (`parked: true` or not), the parkedFor reason if any, and the disposition.

   Disposition is one of:
   - **keep**: question is fine as-is, type is appropriate, content is sound. Carry forward unchanged.
   - **convert**: content is sound but the type is wrong. Pick the right v0.5 type and rewrite. (This is what most parked-for-format questions become.)
   - **park**: keep the question in the file but parked. Use this if it might come back later (4PH1 stretch, future tutorials) but isn't right for the v2 bank. Set or carry through `parked: true` and a clear `parkedFor`.
   - **delete**: drop entirely from the new file. Use this if the content is genuinely wrong, off-syllabus with no future, or redundant with a better version of the same idea.

   Output this audit as a markdown table at the start of the chunk's work.
2. **Coverage check.** Compare the syllabus notes for this group against the audit. Where is the bank thin? Where is it bloated? Note each gap or surplus.
3. **Write.** Produce the new question objects for this group, including any new questions to fill gaps. Convert kept-but-converted questions to their new type. Park anything genuinely off-syllabus with a `parked: true` and `parkedFor: "off-syllabus, beyond 4SS0"` note. Delete (don't include) anything that's redundant or clearly broken.
4. **Sanity.** Read the chunk's questions back. Are there obvious duplicates? Are any spec points still uncovered?

Suggested order: basics → practical → uses → hazards → nuclear. Basics is the densest and contains the foundation atoms; nailing it well makes the rest faster.

---

## 6. Per-group guidance

### Basics (8 subtags)

Subtags: `units`, `atomic_struct`, `nuclide_notation`, `ionising_random`, `radiation_types`, `penetration`, `background`, `halflife`.

- `radiation_types` is the heaviest. The atom registry for it (in the engine) has 12 atoms across α/β/γ × composition/charge/penetration/ionising. Tag `radiation_types` questions with the relevant atoms (see the engine's ATOMS object for the canonical list). Use **matching** and **grid** heavily here; they're a natural fit.
- `halflife` should be qualitative only. The 4SS0 spec excludes half-life calculations (point 7.13 is 4PH1-only). Park or delete any "after N half-lives, what fraction" question that requires calculation; if you keep one, make it qualitative ("after one half-life, the activity halves").
- `nuclide_notation` lends itself to **fillblank** (write the missing A or Z) and **mcq**.
- `ionising_random` is a small subtag; one or two questions covering "decay is random / cannot predict when" plus "ionisation means electron stripping" is enough.
- `background` should cover natural sources, artificial sources, and the idea of subtracting background from a count. **categorise** (sources by natural / artificial), **multiselect** (which of these are background sources), and **mcq** are the right shapes.

### Practical (1 subtag)

Subtag: `practical_penetration`.

- The required-practical investigation of penetrating power is a short procedural sequence: source, absorber, detector, count rate, repeat with different absorbers, control the distance.
- The right type for this is mostly **grid** (safety measures × hazard) and **ordering** (steps in the right order). Optionally one **matching** for absorber↔radiation-stopped.
- Do NOT write a long-answer "describe the experiment" question. Decompose it.

### Uses (3 subtags)

Subtags: `uses_alpha`, `uses_beta`, `uses_gamma`.

- The 4SS0 specifies smoke detectors (α), thickness gauges (β for paper, γ for steel), sterilisation (γ), tracers (γ), static eliminators (α), and a few others. Stick to these.
- **matching** (use → radiation), **categorise** (sort uses by radiation type), **mcq** (which radiation for X) cover most of this.
- One or two short single-phrase recall questions ("State a use of beta") with `allowAdjust: false` and a tight synonym list.
- Avoid the ambiguous ones (e.g. "irradiation of food" can be done with multiple radiations; pick one and stick with it, or skip).

### Hazards (4 subtags)

Subtags: `bio_effects`, `which_most_dangerous`, `contam_irrad`, `waste_disposal`.

- `contam_irrad` is the headline: the contamination-vs-irradiation distinction. **categorise** (situations into one or the other), **grid** (safety measures × hazard, like the demo question already in the bank), **mcq** for definitions.
- `which_most_dangerous` is a "depends on context" question. **matching** (context → most-dangerous radiation: alpha if inhaled, gamma if external) works well. Avoid "which is most dangerous" without a context, since that's genuinely ambiguous.
- `bio_effects` should cover ionisation damages cells / DNA, possible mutation, possible cancer. Keep **mcq** and **fillblank**; avoid extended writing.
- `waste_disposal` covers long half-lives, deep storage, sealed containers, marking. **mcq** and **multiselect**; one **grid** for storage-feature-vs-purpose.

### Nuclear (fission and fusion) (4 subtags)

Subtags: `energy_from_nuclear`, `fission`, `fusion`, `shielding`.

- 4SS0 explicitly excludes chain reaction (per point 7.19 in the existing parking notes). Park any chain-reaction question.
- Cover: fission (heavy nucleus splits, energy released, neutrons released), fusion (light nuclei combine, energy released, happens in the Sun and stars), shielding around a reactor, basic comparison.
- **mcq** and **matching** carry most of this. **multiselect** for "which of these are products of fission". **fillblank** for the simplest recall.

---

## 7. Atoms (radiation_types subtag only, for now)

The engine has an atom registry for `radiation_types`. Twelve atoms: α/β/γ × composition/charge/penetration/ionising. Their canonical ids are `alpha_composition`, `alpha_charge`, `alpha_penetration`, `alpha_ionising`, and the same for `beta_*` and `gamma_*`.

- Every `radiation_types` question should declare an `atoms: [...]` array listing which atoms it tests.
- A 1-mark MCQ on alpha's charge: `["alpha_charge"]`.
- A 3-mark matching of α/β/γ to charge: `["alpha_charge", "beta_charge", "gamma_charge"]`.
- A grid testing penetration of all three: `["alpha_penetration", "beta_penetration", "gamma_penetration"]`.

Other subtags don't yet have an atom registry. Don't invent atoms for them.

---

## 8. The instances mechanism

(Recap from v0.4, still in force.) A question can have multiple instances. Each instance can override any base field. The engine picks one per delivery. Instances must be **genuinely different angles**, not paraphrases (see v0.4 schema §4 for examples).

For the new types, instances are particularly powerful because they let you reuse the structure with different content. E.g. a base **matching** question "match radiation to charge" can have an instance "match radiation to typical use" and another "match radiation to range in air". The engine treats this as one question with three real variants.

Don't pad instances with weak content. If a question only has one good angle, give it no instances. Better to have 60 questions with one good angle each than 80 questions with two-and-a-half-good angles each.

---

## 9. Output format

Single file `topic7_radioactivity.js`, JavaScript, defining `window.PREIB_RAD_QUESTIONS` as an array. Match the existing file's outer shape. JSON-style quoted keys are fine (the engine accepts both quoted and unquoted).

Plus a separate `topic7_v2_decisions.md` markdown file recording:
- The audit table per chunk (existing question id → disposition)
- The headline trade-offs you made (e.g. "I picked matching over grid for the radiation-charge question because grid would have been only 2 columns and felt too sparse")
- Any spec points you flagged as ambiguous or missing notes
- A short summary at the top: total active questions, total parked, type mix, difficulty mix.

---

## 10. What's deliberately out of scope

- Engine changes. Don't propose them. If the engine doesn't support what you want, use the schema's existing types or flag it back with a one-line note rather than working around.
- New question types beyond v0.5. The grid is the latest type; nothing newer.
- The autocomplete-from-vocabulary type (v0.6 candidate). Don't try to use it; it's not implemented.
- The atomization of subtags other than `radiation_types`. Don't invent atom ids for half-life, hazards, etc; the engine doesn't know about them.
- Diagrams. The engine renders placeholders for diagrams. You may use `diagram: { kind: "...", params: {...} }` references for the four registered kinds (`nuclide_symbol`, `penetration_setup`, `decay_chain_simple`, `count_vs_time_table`) but understand that no real diagrams will render until the graphics chat ships them. Use diagrams only when the question genuinely needs one; most don't.
- The editor. You're not editing in the editor. You're outputting a file directly.

---

## 11. Style and conventions

- Editorial palette: keep prose simple. The teacher prefers full clear sentences over jargon-dense ones.
- British spelling throughout (the engine handles US/GB normalisation but author canonical British).
- IDs in `lowercase_snake_case`, no version suffixes (variants live inside `instances`).
- Tags use the subtopic vocabulary in v0.4 §6.
- Spec refs in the form `7.5`, `7.13P` (P-suffix for 4PH1-only points; 4SS0 uses bare numbers).
- Mark integers, no half-marks.
- Examiner notes are pupil-facing and short. One or two sentences. Optional.
- Explanations are pupil-facing and full. Multi-sentence is fine. Required.

---

## 12. When to flag back

- A spec point isn't represented in the syllabus notes and you're unsure how the teacher wants it pitched.
- The 4SS0 vs 4PH1 boundary is unclear for a particular sub-idea.
- A markscheme convention from past papers can't be expressed in any of the v0.5 types.
- The atom registry seems wrong for `radiation_types` (e.g. you find a question that tests something none of the 12 atoms covers).

Put these in `topic7_v2_decisions.md` as flags. The architecture chat reviews and acts.

---

## 13. Definition of done

The new `topic7_radioactivity.js` loads in the engine. Every question type validates and renders. No `long` type appears. Spec coverage matches the syllabus notes. The decisions log explains the major calls. The teacher reads through the bank, plays through 20 random questions, and feels each one is a question worth a student's time.

When you hand back, also produce: the type mix counts, the difficulty mix counts, the active-vs-parked count, and the spec-point coverage list. The teacher uses these to sanity-check before deploying.
