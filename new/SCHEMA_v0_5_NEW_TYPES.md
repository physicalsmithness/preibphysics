# Schema v0.5 — five new interaction types

**Status:** drafted 2026-05-03. Last updated 2026-05-08 with v0.4 base-type clarifications, fillblank verb/descriptor callout, and matching by-value confirmation. Adds matching, multiselect, ordering, categorise, fillblank. Does not change v0.4 contracts; existing types (`mcq`, `short`, `long`, `numeric`) keep their behaviour.

> **⚠ Authors: work from the live engine, not a reference copy.**
>
> If your commission gives you a "reference engine" or "engine_reference" file as a snapshot, treat it as out-of-date. The live engine lives at `G:\My Drive\github local files\preibphysics\new\engine.js` and accumulates fixes that may invalidate earlier reference snapshots. Topic 8's authoring chat hit two false trails (matching marker thought to compare indices not values; KaTeX thought to be unwired) by working from a stale reference. Both had been fixed in the live engine. Always grep the live file before designing around an apparent engine limitation.

**Why:** keyword-based marking of free-text short-answers is a dead end for anything past one-phrase recall. Rewriting weak short-answers into structured-interaction questions gives deterministic marking, faster student feedback, and no AI dependency. See architecture chat 2026-05-03.

**Common fields.** Every new type still carries the v0.4 base fields: `id`, `tags`, `specRefs`, `difficultyRating`, `type`, `prompt`, `marks`, `explanation`, `examinerNote`, optional `diagram`, `instances`, `parked`/`parkedFor`, `atoms`. The differences below are the type-specific fields and marker.

---

## 1. matching

```jsonc
{
  "type": "matching",
  "prompt": "Match each radiation type with its charge.",
  "pairs": [
    { "left": "Alpha (α)", "right": "+2" },
    { "left": "Beta (β)",  "right": "−1" },
    { "left": "Gamma (γ)", "right": "0"  }
  ],
  "rightExtras": [],   // optional distractor right-side items
  "shuffleRight": true,
  "marks": 3
}
```

**UI.** Two columns. Left items in canonical order. Right items shuffled (plus any `rightExtras`). Tap a left item to select it, tap a right item to pair. Tap an existing pair to break it. Pairs are colour-coded so the matching is visible. Submit when all left items are paired (or with a "submit anyway" fallback).

**Marker.** For each `pairs[i]`, the student has paired left `i` with some right tile (which may be a canonical pair tile or a `rightExtras` distractor). The student earns +1 if the **text** of the chosen right tile equals `pairs[i].right` exactly. Compared by value rather than canonical index, so non-injective matchings work: two pairs that legitimately share the same right text (e.g. "Planet → a star" and "Comet → a star") both score when the student pairs either left with any tile bearing that text. Total awarded is capped at `marks`. Default `marks = pairs.length`.

**Schema notes.** `pairs[i].right` is the correct right value for `pairs[i].left`. Distractor right items live in `rightExtras`. `shuffleRight` defaults to `true`; set `false` if the question needs a fixed display order.

> **Note on non-injective matching.** Earlier engine versions (pre-v1.5.3) compared by canonical right index, which broke many-to-one matchings: a student who legitimately paired Planet→"a star" and Comet→"a star" had no way to choose between the two visually identical tiles. The current engine (v1.5.3 onward) compares by right *value*, so legitimate many-to-one matchings score correctly. **However**, `categorise` is usually a better fit for "sort items into bins" tasks than non-injective matching, because the bin structure makes the cognitive shape explicit and gives wrong beliefs a place to fail visibly (a student who thinks everything orbits a star puts everything in the "Orbits a star" bin and scores zero, instead of getting partial credit by accident).

**Authoring tip:** if multiple pairs share the same right value, the engine renders one tile per pair entry (one "a star" tile per pair pointing to it). To make a non-injective matching genuinely discriminating against a "everything matches the same thing" wrong belief, either (a) prefer `categorise` (recommended), or (b) add an extra "a star" tile via `rightExtras` so a student who wrongly thinks ALL items match "a star" can place all of them there and be wrong about most of them. Without that extra, the student is forced to spread their answers and accidentally gets some right.

---

## 2. multiselect

```jsonc
{
  "type": "multiselect",
  "prompt": "Tick all the radiations that are deflected by a magnetic field.",
  "choices": ["Alpha", "Beta", "Gamma"],
  "answerIndices": [0, 1],
  "distractorRationales": {
    "2": "Gamma has no charge, so a magnetic field has no effect on it."
  },
  "markingMode": "penalty",
  "marks": 2
}
```

**UI.** Checkbox list. Submit button. Distractor rationales (if present) shown after marking, keyed by choice index, for each wrongly-ticked or wrongly-untouched choice.

**Marker.** Three modes:
- `"penalty"` (default): +1 per correctly-ticked, −1 per wrongly-ticked, floored at 0, capped at `marks`. Discourages "tick everything."
- `"no_penalty"`: +1 per correctly-ticked only. Easier; risks blanket-tick gaming.
- `"all_or_nothing"`: full `marks` only if the ticked set exactly matches `answerIndices`; else 0.

Default `marks = answerIndices.length`. Default `markingMode = "penalty"`.

**Schema notes.** `answerIndices` is an array of integer indices into `choices`. Distractor rationales optional, same shape as MCQ but include all wrong choices the student selected, not just the single chosen one.

---

## 3. ordering

```jsonc
{
  "type": "ordering",
  "prompt": "Put α, β, γ in order of penetrating power, weakest first.",
  "items": ["Alpha", "Beta", "Gamma"],
  "shuffleStart": true,
  "marks": 3,
  "markingMode": "per_position"
}
```

**UI.** A vertical list of items. Each item has an up-arrow and a down-arrow (or a drag handle on touch devices). Tap arrows to move. Submit reads the current sequence.

**Marker.** Two modes:
- `"per_position"` (default): +1 per item in its correct position. Capped at `marks`. Default `marks = items.length`.
- `"all_or_nothing"`: full `marks` only if the entire sequence matches.

**Schema notes.** `items[]` is the canonical correct order. `shuffleStart` defaults to `true`; the engine shuffles for the initial display so students don't see the answer.

---

## 4. categorise

```jsonc
{
  "type": "categorise",
  "prompt": "Sort each example into the right radiation type.",
  "bins": ["Alpha", "Beta", "Gamma"],
  "items": [
    { "text": "Smoke alarm",                "bin": "Alpha" },
    { "text": "Thickness gauge for paper",  "bin": "Beta"  },
    { "text": "Sterilising medical kit",    "bin": "Gamma" },
    { "text": "Static eliminator",          "bin": "Alpha" }
  ],
  "marks": 4
}
```

**UI.** Items appear in an unsorted strip at the top. Bins below, each labelled. Tap an item to select, tap a bin to place it. Tap an item already placed in a bin to remove it back to the strip. Submit when all items are placed (or partial submit allowed).

**Marker.** +1 per item placed in its declared bin. Capped at `marks`. Default `marks = items.length`.

**Schema notes.** Each item declares its correct bin via the `bin` field, which must match one of the strings in `bins`. Multiple items per bin is fine. An item left unplaced is wrong (counts 0 toward the score).

---

## 5. fillblank

```jsonc
{
  "type": "fillblank",
  "prompt": "An alpha particle is a {} nucleus.",
  "blanks": [
    { "expected": ["helium", "He"] }
  ],
  "marks": 1
}
```

Multi-blank example:

```jsonc
{
  "type": "fillblank",
  "prompt": "An alpha particle has {} protons and {} neutrons.",
  "blanks": [
    { "expected": ["2", "two"] },
    { "expected": ["2", "two"] }
  ],
  "marks": 2
}
```

**UI.** The prompt is rendered inline with each `{}` replaced by a small text input. Submit reads each input.

**Marker.** Per blank: normalise both sides (v0.4 §10 normalisation: case, whitespace, articles, contractions, punctuation, GB/US, hyphens) and check the user's value matches any of `expected`. +1 per matching blank, capped at `marks`. Default `marks = blanks.length`.

**Schema notes.** The number of `{}` placeholders in `prompt` must match `blanks.length`. The engine fails gracefully if they don't, by rendering whatever blanks it has and flagging a console warning. Each `expected[]` must contain at least one string; the first is treated as the canonical answer for display purposes.

> **⚠ Read this before authoring fillblanks.**
>
> Fillblank is **exact match after normalisation**. NOT substring. NOT semantic. NOT stem-based. "decreases" does not match "cools". "gravity" does not match "gravitational field strength". Every form a student might plausibly write must appear explicitly in `expected[]`.
>
> This means fillblank is the **wrong type for verb-shaped, direction-shaped, or comparative-descriptor slots.** The synonym explosion for "the temperature {decreases / cools / falls / drops / goes down / reduces / is lower}" is unbounded. The next author who tries to enumerate it will fail at least one student.
>
> **Use fillblank when:** the slot tests recall of a specific named physics term (e.g. "galaxy", "fusion", "elliptical", "core", "nebula"). Synonym list covers typographical variants (case, abbreviations, the term vs its symbol, apostrophe/article variants) but NOT conceptual variants.
>
> **Use mcq when:** the slot is a verb (action: "decreases", "expands"), a direction (towards / away from), or a comparative descriptor (lower / cooler / faster / smaller). MCQ choices can include the related-but-wrong terms as named distractors, which actually tests the discrimination better than fillblank can.
>
> **NEVER include in `expected[]`:**
> - Colloquial near-synonyms ("gravity" for "gravitational field strength")
> - Generalised forms ("field strength" for "gravitational field strength")
> - Descriptive paraphrases when the slot asks for a named stage ("cloud of gas" for "nebula")
>
> **DO include:**
> - The symbol form alongside the word form (g, m, W)
> - GB/US spelling variants where the engine doesn't auto-handle them
> - Synonyms that are themselves valid physics terms at the same level of specificity (e.g. "nebula" and "protostar" are both named stages; both are fine for "stage before main sequence")
> - Apostrophe and article variants for nouns ("sun's centre", "centre of the sun")
>
> When in doubt, **prefer mcq.** Discrimination is the same; marking is robust.
>
> *Heuristic distilled from Topic 8's fillblank synonym audit, 2026-05-06.*

---

## Cross-cutting

**Type filter strip.** All five new types appear as chips in the practice page's type strip (with their active-question count) and respect `excludedTypes` like the original four. Default state: visible.

**`allowAdjust`.** Not applicable to these types because their auto-marker is unambiguous. The schema field is silently ignored.

**Instances.** All five new types support `instances`, same mechanism as the existing types: each instance overrides any base field, including `pairs`, `choices`, `answerIndices`, `items`, `bins`, `blanks`, etc. So one base "match α/β/γ to charge" question can have variant instances "match to penetration", "match to ionising power", etc.

**Atoms.** Each question can declare an `atoms: [...]` array as before. For multi-mark new-type questions, the atoms apply to the question as a whole; per-pair or per-blank atom granularity is out of scope for v0.5.

**Validation.** Each type adds its own well-formedness rules (e.g. matching's `pairs` non-empty, multiselect's `answerIndices` in range, etc). The engine's existing "broken question notice" path renders a clear message rather than a stack trace if a question can't be displayed.

---

## 6. grid

Added 2026-05-03 alongside the other five. A matrix of rows × columns with a checkbox in every cell. Each row has a set of "correct" columns, optionally a set of "neutral" columns where ticking is neither rewarded nor penalised, and the rest are "wrong" (penalised in per-cell mode, disqualifying in per-row mode). Useful for "for each safety measure, tick the hazards it protects against" style questions where there's a clear primary purpose plus defensible secondary purposes.

```jsonc
{
  "type": "grid",
  "prompt": "For each safety measure, tick the hazard(s) it protects against.",
  "rows": ["Use gloves", "Use tongs", "Lead apron", "Increase distance", "Reduce time"],
  "columns": ["Contamination", "Irradiation"],
  "correct": {
    "0": [0],         // gloves: contamination only
    "1": [0, 1],      // tongs: both (no contact + distance)
    "2": [1],         // apron: irradiation only
    "3": [1],         // distance: irradiation (inverse-square)
    "4": [1]          // time: irradiation (dose = rate × time)
  },
  "neutral": {
    "0": [1]          // gloves vs irradiation: defensible but not primary; don't penalise
  },
  "marks": 5,
  "markingMode": "per_row"
}
```

**UI.** A table with column headers across the top and row labels down the left. Each cell is a checkbox. Submit reads each row's tick-set. Mobile gets a horizontally-scrollable table (acceptable compromise; full layout reflow on phones is out of scope).

**Marker.** Two modes:
- `"per_row"` (default): for each row, score 1 if the user ticked exactly the correct set (neutrals tolerated either way, wrongs disqualify the row). Default `marks = rows.length`.
- `"per_cell"`: +1 per correctly-ticked cell, −1 per wrongly-ticked cell (cells in neither correct nor neutral). Neutrals score 0 either way. Floor at 0, cap at `marks`.

**Schema notes.** `correct[i]` is an array of column indices for row `i`. `neutral[i]` is optional and lists column indices that don't count. Anything not in either is wrong. A row with no `correct` entry is treated as "no expected ticks" (so any tick on that row is wrong in per-row, costs in per-cell).

---

## v0.4 base-type clarifications (added 2026-05-08)

The Topic 7 authoring chat surfaced gaps where v0.4 base-type behaviour was under-documented and authors had to guess. Recording the actual engine semantics here so the next chat doesn't have to.

### `numeric`

```jsonc
{
  "type": "numeric",
  "prompt": "Convert 4 minutes to seconds.",
  "answer": 240,
  "unitHint": "seconds",
  "marks": 1
}
```

**Tolerance.** If `q.tolerance` is set (absolute number), uses that. Otherwise default is `max(|answer| × 0.005, 0.0001)` — so ±0.5% with a tiny absolute floor. For `answer: 240` that's ±1.2 (so 238.8 to 241.2 all pass). For `answer: 0.0001` the floor kicks in.

**Override pattern.** If a problem's natural rounding produces a wider acceptable range (e.g. "give your answer to 2 sig figs" for an answer that's actually 7.84), set `tolerance` explicitly to cover both 7.8 and 7.9. Default 0.5% tolerance is too tight for sig-fig-rounded answers.

**Unit handling.** The marker regex-strips non-numeric tail before parsing, so "240", "240 s", "240 seconds", "240sec", "2.4e2" all parse to 240 and pass. The unit is never validated. Authors should name the unit in the prompt; `unitHint` is purely decorative (appears as a small label next to the input field, and shown next to the correct answer in feedback). Don't worry about students having to remember the canonical unit form.

**Field aliases.** Both `q.answer` and `q.expectedNumeric` are accepted. Use `answer` for new questions; `expectedNumeric` is legacy.

**What numeric is NOT for.** Anything where the unit choice is itself the test (e.g. "what unit is activity measured in?"). For those, use `mcq` or `fillblank`. Numeric is for quantitative answers where the unit is given by the prompt.

### `short`

**Marker pre-pass.** Every input goes through normalisation (case, whitespace, articles, contractions, GB/US, hyphens, punctuation) before any matching. Authors don't need to list every permutation.

**Match rules.** A response matches if every entry in `q.markPoints` has at least one of its `any` synonyms appearing in the (normalised) response. Default match style is **substring**: typing "the helium nucleus" matches a synonym of "helium". With `q.matchStyle: "exact"` or per-`markPoint` `style: "exact"`, the response (or the relevant token) must equal the synonym whole.

**`mustNotInclude`.** Per-`markPoint` array of phrases that, if present in the response, void that mark point even if the `any` synonyms also matched. Useful for "don't say X" answers (e.g. testing "name two effects of beta radiation" without accepting an answer that also names a wrong effect). **Authoring note:** unused across 200+ Topic 7 questions. If you reach for it, you may be reaching for the wrong type — consider `multiselect` or `grid` instead, where wrong picks are scored explicitly.

**Multi-mark-point shorts: don't.** If your answer requires the student to articulate more than one independent thing, atomise into separate single-MP shorts, or rewrite as `multiselect`, `categorise`, `matching`, or `grid`. The marker can score multi-MP shorts but the experience is poor: the student types one fluent answer and gets back partial credit with no clear feedback on which MP they missed. This was the single biggest rot pattern in Topic 7 (43 multi-MP shorts had to be atomised).

### `mcq`

**Distractor rationales.** Required on every wrong choice. Shown to the student after marking, alongside the choice they picked and the correct one. The rationale is what makes MCQs pedagogically valuable beyond "you guessed right". An MCQ without distractor rationales is a parking lot.

**Choice shuffling.** The engine shuffles the displayed choice order on every delivery (v1.5.11). Authors don't need to randomise; just put them in any order.

### `long`

Parked at the engine level. Don't author. If a question seems to need a long-form answer, it almost certainly needs to be reframed as a sequence of structured-type questions, or omitted entirely.

### File-level structure (cross-cutting)

A topic question file declares one global: `window.PREIB_<TOPIC>_QUESTIONS = [...]`. Topic 7 uses `PREIB_RAD_QUESTIONS`, Topic 8 uses `PREIB_TOPIC8_QUESTIONS`. The TOPIC_CONFIG in each topic's deployment `topic<N>_config.js` points at this variable name.

Earlier schema generations referenced `META` and `REPORT_FORM` blocks alongside the questions array. **These are deprecated.** The engine doesn't read them. Don't author them in new topic files. If you encounter a brief that asks for them, that's a stale reference.

### Cross-cutting tags

- `definition` — questions where the answer is a definition of a term.
- `extended_writing` — questions reframed from the kind of multi-sentence response that pre-schema would have been a `long`. Marker is the natural type's marker (usually `ordering`); the tag exists for analytics.
- `practical_skill` — questions about experimental design, data interpretation, or method.
- `calc` — questions that involve a calculation step. **Engine treats `q.type === "numeric"` as auto-calc, so don't add `calc` tag to numeric questions; it would be redundant.** Use `calc` only for non-numeric questions that test calculation reasoning (e.g. an MCQ where the choices are different numeric answers, or an ordering of arithmetic steps).

---

## Decisions deferred

- **Numeric unit synonyms / required-unit mode.** Considered, rejected for now. The lenient regex-strip is the right balance for IGCSE — the prompt names the unit, the student types or doesn't type it, both are accepted. Re-evaluate only if a real failure mode shows up.
- **`mustNotInclude` deprecation.** Pending Topic 8 audit. If Topic 8 also produces zero uses, deprecate from the brief and document as legacy.
- **Multi-MP short marker improvements.** Engine could in principle return per-MP feedback ("you got MP1 and MP3, missed MP2"), but the better fix is structural — atomise. Not implementing.

---

## What this does NOT cover

- Drag-and-drop with mouse/touch dragging. The interaction is tap-based throughout for accessibility, simplicity, and to avoid drag-handler libraries.
- Hand-drawn answer matching (where the student literally draws lines). The visual could be added later as a presentation polish on top of the matching type.
- Free-form sketching, graph-plotting, equation entry. These are different kinds of interaction with their own architecture.
- AI-marked free-text. Still a possible future path for questions that genuinely need it (see chat 2026-05-03).

---

## v0.6 candidate: autocomplete-from-vocabulary

**Status:** noted 2026-05-03, not yet implemented. Intended as the path for questions of the form "give five reasons gamma is dangerous" where the answer is a list of physics-shaped sentences and free-text marking falls down.

**Shape.** A shared statement-vocabulary file accumulates physics-shaped sentences as questions are authored. Each statement has a stable id and a single canonical-text field. Statements are NOT classified globally; classification is per-question. A question references which statements count for it and assigns each a status. A student types into a search box; autocomplete narrows the visible options from the question's reference set; they tap to add to their answer; they can pick multiple. Marking is deterministic per pick.

**Per-statement status (per question):**
- `correct` — directly answers the question.
- `wrong_plausible` — physics-shaped, looks like an answer, but the substance is wrong (e.g. "gamma is heavily ionising"). Acts as a distractor; picking it costs.
- `right_spirit_poorly` — the student has the right idea but the wording is technically wrong, vague, or contains a clear physics error inside an otherwise-defensible sentence (e.g. "wire makes an electromagnetic field" instead of "magnetic field", "force has a resultant in"). Catches the student who knows-but-can't-quite-say. Whether this scores or not is an authoring choice (default: half credit, or clear feedback explaining the precise nuance).
- `off_topic` — true but not relevant to this question. Pulled from the shared bank to populate autocomplete with realistic distractors. Picking it costs nothing or costs a little, authoring choice.

**Marking.** +1 per `correct` pick. 0 or −1 per `wrong_plausible` pick (configurable). Optional half-credit for `right_spirit_poorly`. Cap at marks. Floor at 0.

**Open design questions before building:**
- Where does the vocabulary live? Separate `vocabulary.js` shared across all topic banks? Per-topic? In the question file?
- How is curation managed? Human-only seed; AI-assisted variants ("for each correct statement, generate three plausible-but-wrong rephrasings"); or full AI generation with human review?
- Editor UX: how do you tag a statement as right_spirit_poorly for question A but correct for question B without losing your mind?
- How does the autocomplete UI handle very small screens?

This is a meaningful piece of design and authoring infrastructure, not a quick build. Worth doing carefully when the bank's worth it. v0.5's grid type (above) covers the practical-safety case in the meantime.
