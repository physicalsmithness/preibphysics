# Schema v0.5 — five new interaction types

**Status:** drafted 2026-05-03. Adds matching, multiselect, ordering, categorise, fillblank. Does not change v0.4 contracts; existing types (`mcq`, `short`, `long`, `numeric`) keep their behaviour.

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

**Marker.** For each `pairs[i]`, the user has paired left `i` with some canonical right index `j`. Mark is +1 if `i === j`. Total awarded = correct pairs, capped at `marks`. Default `marks = pairs.length`.

**Schema notes.** `pairs[i].right` is the canonical right partner for `pairs[i].left`. Distractor right items live in `rightExtras` and have no canonical left. `shuffleRight` defaults to `true`; set `false` if the question wants a fixed display order.

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
