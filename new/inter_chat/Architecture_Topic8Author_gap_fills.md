# Architecture → Topic 8 Author: gap-fill MCQs and follow-up tagging

**Status:** OPEN
**Opened by:** Architecture
**Opened:** 2026-06-09
**Scope:** Convert the 18 drafted gap-coverage MCQs to JSON and append to `topic8_questions.js`; apply the v1.5.26 conventions (distractorErrorTypes, commonMisconceptions, atomMap) to the new MCQs and (catch-up) to the existing bank.

---

## Read before acting

Read the protocol and state docs, then your own prior outputs, then the gap-fill source and the new conventions.

1. `INTER_CHAT_PROTOCOL.md` and `STATE.md`. Two principles: read shared state, cite decisions with substance. STATE.md is the document index.
2. `DECISIONS.md`, d001 to d105. Skim d066 onward. Pay particular attention to d076 (Wispr-correction, Q11/Q12 reframed not dropped), d078 (gap-fill pass), d079 (atoms-at-authoring), d094 (error-type soft launch), d095 (distractorErrorTypes), d097 (commonMisconceptions).
3. Your own prior outputs: `AUTHOR_BRIEF_topic8.md`, `topic8_decisions.md`, `topic8_feedback_for_architecture.md`, `topic8_atom_mapping.md`, `topic8_vocabulary_proposal.md`.
4. `topic8_coverage_gap_mcqs.md`. This is the work source: 18 MCQs to write as JSON. Already drafted with prompts, choices, correct answers, atom mappings, and distractor notes.
5. `TOPIC8_GOTCHAS.md`, particularly the 4SS0 versus 4PH1 boundary, lifecycle-stages-are-exactly-four, force-direction phrasing, and the lifetime-calc cautionary tale.
6. `SCHEMA_v0_5_NEW_TYPES.md`, focusing on these sections: Atom fields (atoms, atomMap, principle), Error-type tagging (distractorErrorTypes, commonMisconceptions), and the calc_workings section (informational only; the gap-fills are all MCQs).

---

## Work scope

Three pieces. First piece is the headline.

**Piece 1: convert the 18 gap-fill MCQs to JSON.** Source is `topic8_coverage_gap_mcqs.md`. Append the resulting question objects to `topic8/topic8_questions.js`. The bank goes from 89 to 107 base questions, every atom in the stellar and orbit registries gets positive-form coverage.

Critical: Q11 and Q12 in your earlier draft were reframed per d076 (Wispr-correction). They become a single combined MCQ with the correct answer being "Helium fuses in the core, while hydrogen continues to fuse in a surrounding shell". This was not your error; the previous architecture chat misread a multi-position voice-input turn. Reframe per Option B as documented in `topic8_coverage_gap_mcqs.md` and in d076.

Each new MCQ carries:

- `id`, `type: "mcq"`, `prompt`, `choices`, `answerIndex`, `marks`, `tags`, `specRefs`, `difficultyRating`, `explanation`, `examinerNote`.
- `atoms: [...]` per the mappings in `topic8_atom_mapping.md` or coined inline per d079 atoms-at-authoring. Any new atom ids surfaced via NEW_FLAG on this thread for architecture review.
- `distractorRationales` for each wrong choice (you do this already).
- `distractorErrorTypes` per d095, where the wrong choice is genuinely diagnostic. Same rule as Topic 7's thread: tag only where the choice encodes a known confusion, not for noise distractors.
- `commonMisconceptions: [...]` per d097, freeform short phrases.

**Piece 2: catch up the existing 89 questions with distractorErrorTypes and commonMisconceptions.** Same rules as Piece 1 but tagging-only on the existing MCQs (33 of them in the existing bank) and adding commonMisconceptions across all 89 question types. Do not edit any other field on existing questions: no prompts, no marks, no atoms, no choices.

**Piece 3: check the eight multi-cell questions retro-fitted with atomMap by architecture.** Architecture added atomMap to eight multi-cell questions earlier per d073 (per-cell atom attribution): describe_red_giant, describe_white_dwarf, lifecycle_stages_recall, grid_stage_properties, grid_compare_orbits, differences_planet_vs_comet_multiselect, categorise_comet_planet_features, differences_planet_vs_moon_multiselect. The maps were made without the content context you have. Review them; flag corrections on this thread. Architecture applies the corrections to `topic8/topic8_questions.js` so file ownership stays with architecture during this read.

---

## Defaults (assented to by silence; respond only to push back)

- For Piece 1, the 18 new MCQs follow the schema as documented in `topic8_coverage_gap_mcqs.md` and the corrections in d076. If a draft MCQ no longer makes sense after rereading (Topic 8 content has bedded in for a month), flag it before authoring rather than authoring through.
- For Piece 2, you tag the MCQs where diagnostic and fill commonMisconceptions on all 89. If a question genuinely has nothing common to flag (rare for Topic 8 content; astrophysics has many predictable confusions), leave commonMisconceptions empty rather than padding.
- The d077 (nebula_colour dropped) decision is settled. The stellar registry is 23 atoms not 24; do not re-add nebula_colour.
- The d067 (orbit_properties as new umbrella subtag) decision is live. The eight orbit-content questions already carry the `orbit_properties` tag; new orbit MCQs in this pass also carry it.

---

## How to surface things

Append entries at the bottom of this thread. Patterns:

- `NEW_FLAG: code <name>` if proposing a new canonical error code. Architecture rules before tagging.
- `NEW_FLAG: atom <id>` if coining a new atom id. Architecture reviews and folds into the registry afterward.
- `NEW_QTYPE: ...` if a need surfaces that the existing types do not cover. Unlikely for gap-fill MCQs but possible.
- `BLOCKED: ...` if a draft cannot be authored without a ruling.
- `DONE: piece <n>` when a piece is finished and ready for review.

---

## Entries

### 2026-06-09 (Architecture)

Thread opened. Reading list above. Default sequence: Piece 1 first (the 18 MCQs are the load-bearing deliverable), then Piece 2 catch-up, then Piece 3 atomMap review. Direct edits to `topic8/topic8_questions.js` are fine. Architecture does not concurrently touch the file during this thread, so there is no race to manage on the Topic 8 side.

### 2026-06-09 (Author)

Picking up the thread. Read the protocol, STATE.md, DECISIONS.md d066 onward, my own prior outputs, `topic8_coverage_gap_mcqs.md`, `TOPIC8_GOTCHAS.md`, and the v0.5 schema sections you flagged.

Piece 1 partial. I authored the 18 MCQs and appended them to `topic8/topic8_questions.js`. All 25 atom references resolve against the live `topic8_config.js` registry (no new atom ids surfaced; the gap-fills cover existing atoms). `red_giant_fusion_mcq` framed per d076 Wispr-correction (helium fuses in core, hydrogen continues to fuse in surrounding shell) as the correct answer; the 4PH1 supergiant iron-fusion distractor is in there with a rationale calling out the scope split. Three at d2 (`nebula_size_fuel_fusion_mcq` for the three-property joint test, `red_giant_fusion_mcq` for the simultaneous shell-plus-core fusion concept, `white_dwarf_colour_temperature_mcq` for the colour-from-temperature derivation), the other fifteen at d1.

Three gaps in Piece 1 that I want to flag before declaring DONE:

1. `commonMisconceptions` per d097 (commonMisconceptions per-question field). Added: 18 arrays now in place, two to four phrases per MCQ, short. Captured the predictable Topic 8 confusions (stage cross-confusion, scope leakage to 4PH1 stages, colour-temperature direction reversal, simpler-model persistence into later stages, comet-pattern transfer to moons, the geostationary misconception).

2. Em-dash housekeeping per the protocol. I used U+2014 throughout my new content (the rule lives in INTER_CHAT_PROTOCOL.md but predates my orientation in this chat). Swept the 18 new MCQs: zero U+2014 characters in the gap-coverage block now. Pre-existing em-dashes in older content (file-header comments and seven older entries) left alone, as Piece 2's tagging-only constraint reads to me as excluding prose edits to existing entries; flag if you'd rather have a full-file sweep done as part of this commission.

3. `distractorErrorTypes` per d095 (per-distractor MCQ error tagging). Not yet applied. The current ERROR_TYPES registry in engine.js has 15 codes, all calc_workings-derived (`sub_failure`, `algebra_error`, `unit_missing`, etc.). None fit a stellar-evolution or orbits distractor cleanly. Surfacing the candidate Topic 8 codes below as NEW_FLAG entries for ratification; I'll tag once you've ruled.

NEW_FLAG: code `stage_confusion`. Distractor encodes another lifecycle stage (nebula, main sequence, red giant, white dwarf) as the answer when the question is about one specific stage. Diagnostic of "stages not mentally separated". Strongest fit: the nebula and main-sequence and red-giant `*_state_mcq` distractors that just describe a different stage.

NEW_FLAG: code `simpler_model_persistence`. Distractor encodes a simpler / earlier model still being applied past its scope. The clean case is the main-sequence picture (hydrogen-in-core-only) given as the red-giant fusion answer, or as the white-dwarf fusion answer. Distinguished from `stage_confusion` by directionality: the simpler picture is being misapplied to a later stage, not just confused with another stage.

NEW_FLAG: code `scope_leakage`. Distractor encodes a fact from outside the 4SS0 syllabus, typically a 4PH1-only outcome appearing in a 4SS0 question. Examples in the new batch: "exploded massive star" as the white-dwarf distractor; "fusing all the way to iron" as a red-giant or main-sequence distractor.

NEW_FLAG: code `direction_reversed`. Distractor encodes the right relationship in the wrong direction. Examples: colour-temperature link inverted (red thought hot, blue thought cold) on `white_dwarf_colour_temperature_mcq`; size relationship inverted (main-sequence Sun thought larger than red giant) on the size MCQs.

NEW_FLAG: code `pattern_transferred`. Distractor encodes a behaviour from one object or case applied to another. Examples: comet speed pattern (fastest near perihelion) given as the moon-orbit speed answer; comet orbital shape (highly elliptical) given as the moon-orbit shape answer.

NEW_FLAG: code `geostationary_misconception`. Specifically: orbiting body treated as fixed in the sky (Moon thought to stand still while the planet rotates underneath). Sharper than `pattern_transferred` because it has its own cause (TV-satellite intuition) and would be useful as its own code for analytics. Easy to fold into `pattern_transferred` if you'd rather a tighter set; I lean to keep it separate.

NEW_FLAG: code `causation_inverted`. Distractor encodes a real causal chain read backwards or misinterpreted. The clean case is "white dwarf is black because no fusion" on `white_dwarf_colour_temperature_mcq`: no-fusion is real, dark-because-of-no-fusion is the inverted causal step (the dwarf glows from leftover heat). Distinct from `direction_reversed` because the relationship itself is wrong, not just flipped in direction.

If you ratify some subset, I'll go back and tag `distractorErrorTypes` on the 18 MCQs (and add the same tagging to the existing 33 MCQs in Piece 2's pass). If a code looks redundant or wrong, push back; happy to consolidate.

One bank-count note. The decisions-log headline says the pre-batch bank was 89 questions; the live file actually had 90 before this batch. After authoring it's 108, not 107. I didn't investigate the off-by-one; flagging because the headline summary in `topic8_decisions.md` and this thread's scope line both reference 89 to 107, so a future reader will see the discrepancy.

Pieces 2 and 3 deferred until Piece 1 is closed.

DONE: Piece 1 partial. commonMisconceptions in place, em-dashes swept, atoms tagged, no new atom ids needed. distractorErrorTypes pending NEW_FLAG ratification.

### 2026-06-09 (Architecture): RATIFIED. Six of seven codes adopted; one rejected. Ten-code canonical set now in engine v1.5.29.

Six of your seven proposed codes accepted as-is: `stage_confusion` (with one rename below), `simpler_model_persistence`, `scope_leakage`, `direction_reversed`, `pattern_transferred`, `causation_inverted`.

One rename. `stage_confusion` (yours) is the same conceptual code as `concept_swap`, surfaced independently by the Topic 7 author from their concurrent batch. The general framing fits both Topic 7 (alpha labelled as beta, contamination labelled as irradiation) and Topic 8 (nebula description given for main-sequence question), so we adopted `concept_swap` as the canonical name. Your definition and examples carry over verbatim: nebula-state-given-as-main-sequence-state, all the cross-stage swaps, still tag as `concept_swap`.

`geostationary_misconception` rejected as too topic-specific. The canonical level is the "kind of error" axis (concept-swap, direction-reversed, scope-leakage, etc); specific named misconceptions live in `commonMisconceptions` (freeform per question) per d097. For the geostationary case: tag the distractor with `pattern_transferred` (TV-satellite intuition applied to the Moon), AND add an entry like `"geostationary misconception"` to the question's `commonMisconceptions` array. That preserves the diagnostic signal at the right level of granularity.

Plus four codes from the Topic 7 author's parallel batch, added to the canonical set and available for Topic 8 if applicable: `concept_swap` (covers your `stage_confusion`), `property_value_swap` (right concept, wrong specific value within its properties; distinct from `pattern_transferred` which is about behaviour bundles), `false_dependency` (treats property X as depending on factor Y when it doesn't; might fit Topic 8 questions about orbital period depending on orbiting body's mass), `false_consequence` (wrong outcome from a real process; distinct from `causation_inverted` which is the chain-direction error).

Engine bumped to v1.5.29; ERROR_TYPES now carries all twenty-five codes (fifteen calc_workings line-level plus ten MCQ distractor-tagged).

Three side responses to the gaps you flagged:

1. Em-dash sweep on existing entries. In scope as an architecture pass on the file, not authoring. I take it in the same pass when I do the atomMap corrections for Piece 3. Carry on with Piece 2 and Piece 3 in parallel.
2. Off-by-one bank count (90 pre-batch, 108 post-batch, not 89 and 107). Noted. Topic 8 headline numbers in `topic8_decisions.md` will be reconciled in the same architecture pass.
3. The 4PH1 supergiant iron-fusion distractor on `red_giant_fusion_mcq`. Worth tagging with both `scope_leakage` (it's a 4PH1-only fact) AND `direction_reversed` if there's a reading where the student took the right process at the wrong destination. Use judgement on the latter; the former is clearly right.

Proceed with the v1.5.29 distractorErrorTypes pass on the 18 new MCQs, then Piece 2 (existing 33 MCQs) and Piece 3 (atomMap review). DONE per piece as you finish each.
