# DECISIONS.md

Pre-IB Physics question bank (Edexcel 4SS0). Canonical log of architectural and authoring decisions.

Numbered d001 upward in chronological order. Each entry gives the decision, a date (best estimate where a transcript only references it), and a short substance paragraph. Cross-references name the decision they point at, never a bare number (per the inter-chat protocol, write "d043 atom system" not just "d043"). Provisional, deferred, or uncertain entries are marked. No em-dash character is used anywhere in this file.

Provenance: reconstructed from the project chat transcripts (the web-claude.ai architecture and author chats from 2026-04-28, the implementation and coverage-design chats, the early Cowork author chats, and the two recent architecture chats) plus project memory, by a fresh extraction chat on 2026-06-08, across two reading passes. Dates and engine version numbers are best estimates from context. Entries marked `[?]` are ones where it is unclear whether the item was a settled decision or only discussed; Smith to rule. Reconciled on placement against STATE.md and the existing topic docs in the live folder.

---

## Phase 0: Direction and architecture (2026-04-28, web claude.ai)

### d001: One-question-at-a-time delivery is the target form
**Date:** 2026-04-28
Questions are served one after another in short digestible pieces, not in batches of 10 to 20. The existing batch-quiz topic files (Topics 1, 2, 5, 6) are to evolve toward the one-at-a-time driller loop. This is the founding product decision for the whole estate.

### d002: One shared engine, per-topic swappable question-bank file
**Date:** 2026-04-28
Each topic becomes a question-bank file loaded by a single shared engine, not a self-contained 100KB HTML per topic. This kills the "six engines drifting in parallel" consistency problem that the standalone topic files had created.

### d003: Canonical engine is the Trilogy Energy data-driven architecture
**Date:** 2026-04-28
Topic 7 is authored against the Trilogy Energy engine architecture (one-at-a-time loop, error analytics, coverage matrix, plus the topic-quiz affordances: tags, difficulty filter, mark-scheme reveal, SVG diagram MCQs). Authoring against a clone of an existing engine, rather than a brand-new one, means Topic 7 ships with the analytics, variant, and filter behaviour from day one and there is only one engine to maintain.

### d004: Deck-based serving model
**Date:** 2026-04-28
Questions are served from one big shuffled deck with a cursor; the engine surfaces seen, done, and right counts both overall and for the current filter selection, plus a recent-10 dot strip. This generic loop (deck shuffler, markPoints matcher, instances variant picker, filter logic, stats panel) is topic-agnostic, which is what makes the shared engine (see d003 Trilogy Energy architecture) possible.

### d005: Architecture, author, and implementation chats are separate roles
**Date:** 2026-04-28
The architecture chat owns schema and engine design; an author chat owns only the question bank and treats the schema as read-only, flagging gaps back rather than improvising; an implementation chat ports designs into the engine. The author chat's value-add is questions matching the schema, not schema design.

### d006: The schema is locked and version-controlled; architecture owns changes and migrations
**Date:** 2026-04-28
The schema must be locked before an author chat starts, or schema decisions leak and cause drift. It lives as a durable written document; the architecture chat formalises changes and writes migrations that bump old files; author chats are told their version and do not deviate.

### d007: A one-page durable author brief is required
**Date:** 2026-04-28
Each author commission gets a tight brief containing the schema, the spec coverage required, the conventions, worked examples, and an explicit do/don't list. The brief is a durable document that survives chat deletion and is reusable across topics by swapping the spec notes and subtopic list.

### d008: Diagrams are engine-rendered SVG from a separate library; authors give intent only
**Date:** 2026-04-28
The author specifies diagram kind and params (for example nuclide_symbol, penetration_setup, decay_chain_simple, count_vs_time_table) and never writes SVG; the engine renders from a separate SVG-library module (not inlined as the magnetism file did). A `raster` kind is reserved as an escape hatch for sourced images. SVG is preferred because it is tiny, scales, themes with CSS variables, and is parameterisable; raster freezes, bloats, and cannot theme.

### d009: Numeric questions use the stored-variant ("instances") pattern, not procedural generation
**Date:** 2026-04-28
Number variety comes from hand-picked stored instances rather than procedurally generated parameters, which is the right level for GCSE where the numbers are rarely the hard part. A template hook is reserved in the schema (null for v1) so procedural generation can be added later.

### d010: The question-bank file is a .js file with window assignments; global named by convention
**Date:** 2026-04-28
The bank ships as a .js file with `window.PREIB_<TOPICSHORT>_QUESTIONS` assignments rather than pure JSON, because that is how the engine ingests questions (flipped from an initial pure-JSON recommendation once the engine ingestion path was examined). The top-level global is named `PREIB_<TOPIC>_QUESTIONS` (in practice `PREIB_RAD_QUESTIONS` for Topic 7 using a topic-short, `PREIB_TOPIC8_QUESTIONS` for Topic 8 using the topic number; either form is fine) and is read from `TOPIC_CONFIG.questionsVar`, so the global name need not be known in advance.

### d011: Schema v0.1, decoupled bank format, five types speced
**Date:** 2026-04-28
A topic is one bank: a header (topic id, spec, subtopics) plus an array of question objects, deliberately decoupled from any engine. Five question types are speced (mcq, short, long, numeric, plus reserved), of which three are needed for Topic 7; numeric_template (procedural numbers) and ai_marked_short (LLM marking) are reserved as named placeholders so they can be added later without renaming. A `markingMode` field (keywords default, placeholder_for_ai reserved) is included so questions never need re-tagging if runtime AI marking is built.

### d012: specRefs are structured spec points; P-suffix marks 4PH1; only non-P in 4SS0 scope
**Date:** 2026-04-28
Spec references are structured identifiers ("7.3" for Edexcel 4SS0 spec point 7.3), enabling spec-coverage views and filtering. A P-suffix ("7.13P") marks 4PH1-only points so one bank can serve both specs; for the 4SS0 commission only non-P points are in scope. 4SS0 Topic 7 omits 7.7, 7.8, 7.9, 7.11, 7.13 (no equation balancing, no Geiger counter, no activity-decreases, no half-life calculations).

### d013: Schema v0.2 splits `type` (data shape) from `quizKind` (UI hint)
**Date:** 2026-04-28
The v0.1 five-types cut conflated data shape with presentation. v0.2 separates `type` (mcq, short, long, numeric) from an optional `quizKind` UI hint, exposes three pupil-facing text fields per question, and aligns exactly to the Trilogy Energy engine (same instances mechanism, markPoints shape, field names). Supersedes schema v0.1 (see d011 schema v0.1).

### d014: markPoints use synonym arrays anchored on phrases, not bare nouns
**Date:** 2026-04-28
Marking uses `markPoints` with `any: [...]` synonym arrays; because matching is substring-based with no normalisation, anchors should be 4-to-8-word phrases rather than bare nouns (which cause false positives), and lists run longer than the Trilogy Energy norm (6 to 10 synonyms, not 4 to 6). Authors are told to be generous. (Later eased once engine normalisation was decided, see d032 hybrid synonym authoring.) "Name one X" shorts get a generous, fragment-based synonym list (it should match the right idea anywhere inside a verbose answer); definition and specific-term shorts instead need exact phrasing.

---

## Phase 1: Schema v0.3, conventions, and the coverage map (2026-04-29)

### d015: Notes-first authoring
**Date:** 2026-04-29
markPoints are derived from the teacher's syllabus notes, which are the ground truth for what earns a mark in this classroom, not from past-paper markschemes (which are unreadable page images in the pack) and not from the schema's calibration examples. The teacher notes are quoted verbatim in the brief.

### d016: Genuine-variety rule for instances
**Date:** 2026-04-29
A question's instances must test the concept from genuinely different angles (define, identify from a list, decide whether two cases match, explain why), not trivial paraphrases of one prompt. This raises authoring effort per question but produces better coverage.

### d017: allowAdjust is guidance, not a hard rule
**Date:** 2026-04-29
The allowAdjust flag is treated as authoring guidance rather than a strict engine rule.

### d018: Nested parent-group and child-subtag taxonomy; child tags persist on every question
**Date:** 2026-04-29
Subtopics are a nested structure: a few parent groups, each with child subtags that auto-expand in the pupil tickbox. Filtering defaults to "any child of a ticked parent". The fine-grained child subtag persists on every question regardless of how the pupil filters, so per-subtag reports keep the fine grain.

### d019: Weightings and difficulty mix are provisional; the author runs a calibration batch first
**Date:** 2026-04-29
The per-subtopic question counts, difficulty distribution, and type mix in a brief are a starting point for discussion, not a quota. The author chat produces a small calibration batch (5 or 6 questions across a couple of subtopics) and negotiates volume and weighting with Smith before bulk authoring, then periodically rewrites its own brief section to reflect the agreed numbers so the durable artefact stays current. (An early instance of both-think-neither-prescribes, later standing principle 5.)

### d020: Schema v0.3
**Date:** 2026-04-29
Folds in the expanded subtopic list, the raster diagram kind, the separate-SVG-library file pattern, the genuine-variety rule (see d016 genuine-variety rule), allowAdjust-as-guidance (see d017 allowAdjust is guidance), and notes-first authoring (see d015 notes-first authoring). Supersedes schema v0.2 (see d013 schema v0.2 type/quizKind split).

### d021: Topic 7 target is about 80 to 100 base questions
**Date:** 2026-04-29
Target 80 to 100 base questions for Topic 7, each with 3 or more instances, weighted toward high-yield subtopics (penetration, contamination versus irradiation, uses, qualitative half-life, dangers). The author flags if a target cannot be met without artificiality.

### d022: Topic 7 authored in two passes
**Date:** 2026-04-29
Pass 1 is notes-only (full coverage, genuine variety, clean schema, no past papers). Pass 2 (a later commission) adds past-paper questions, tightens marking phrases, and flags any 4PH1-only questions for omission. The Pass 2 brief is written after Pass 1 lands so it can react.

### d023: Whole-mark markpoint credit; avoid fractional
**Date:** 2026-04-29
Markpoint credit values are whole marks; fractional credit is avoided in authoring.

### d024: A live coverage map is a v1 priority pull-through affordance
**Date:** 2026-04-29
A live per-subtag coverage map (fraction correct, recent attempts, overall percentage), modelled on the memorisation tool's coverage view, is built in v1 rather than deferred, because for a fact-heavy topic watching a sparse grid fill up is what pulls students through.

### d025: Coverage averages the marks fraction; "covered" means any instance correct recently
**Date:** 2026-04-29
Coverage colour comes from averaging the marks fraction, so full marks count fully and partial credit contributes proportionally (a 3-out-of-4 long contributes 0.75). A question counts as "covered" when any one of its instances has been answered correctly recently. For v1 the coverage map does not split by difficulty (count attempts and correctness only); difficulty weighting can be added later.

### d026: The mastery rule is deferred; data contract locked, visuals loose
**Date:** 2026-04-29
What counts as "mastered" is left to be decided from watching real students. The coverage data contract (groups, subtags, the per-subtag triple) is locked so any visual is plug-compatible, while the visual direction is left loose.

### d027: Full-tool redesign commissioned via Claude Design, coverage map as headline
**Date:** 2026-04-29
The whole tool, not just one widget, was sent to Claude Design for a visual redesign with the coverage map as the headline new feature. The data contract and marking logic were locked and called out so Design would not redesign them; the prototype is then ported back into the real engine.

### d028: Three selectable aesthetics, dark mode, and a responsive mobile-and-desktop layout
**Date:** 2026-04-29
The Design pass landed three aesthetic themes (Editorial as default, Lab, Playful) selectable at runtime via a tweaks panel (aesthetic, dark mode, accent, density, feedback style, coverage placement), with coverage-tile colours graded by accuracy (pale mint to deep green, warm clay for wrong-leaning, single fill scaled by attempted fraction). The tool is responsive: both mobile and desktop are first-class (auto-detect below 720px as mobile), losing or hiding features on mobile rather than merely collapsing the desktop layout.

### d029: An implementation chat ports the Design prototype into the engine
**Date:** 2026-04-29
A dedicated implementation chat takes the Design prototype plus the engine reference files plus the author's Pass 1 output and ships a working tool, keeping the existing engine logic (deck, marking, instances, persistence) and replacing only the DOM rendering, CSS, and layout. It can start before Pass 1 lands using the prototype's mock data.

---

## Phase 2: Schema v0.4, normalisation, migration, long answers, topic order (2026-04-30)

### d030: Schema v0.4, the engine-normalised contract
**Date:** 2026-04-30
The engine owns per-type normalisation of question objects; v0.4 is the engine-side contract and supersedes schema v0.3 (see d020 schema v0.3). Concrete v0.4 changes: count_vs_time_table accepts the author's parallel-arrays form `{times: [...], counts: [...], units: {...}}` as canonical (and the schema example is corrected to count-rate, not activity in Bq); nuclide_symbol stays in the canonical `{kind, params: {...}}` form (two stray flat-param uses fixed in the file, no schema change).

### d031: Engine answer-normalisation is part of the v0.4 marking contract
**Date:** 2026-04-30
The marking engine normalises a student answer before substring matching, via `normTxt`: six essential passes (lowercase, whitespace, articles, contractions, trailing punctuation, GB/US spelling) plus three desirable extras (plurals, number-words, hyphens). This is a contract, not a one-off engine tweak; it exists so authors do not have to hand-enumerate every spelling and punctuation variant. (Assigned to the implementation chat to build; folds the author chat's flagged normalisation need into the schema.)

### d032: Hybrid synonym authoring, relying on engine normalisation
**Date:** 2026-04-30
Authors stop enumerating spelling, contraction, hyphenation, and article variants by hand and rely on the engine normalisation (see d031 normalisation contract); they enumerate only plurals and genuinely-semantic synonyms. A note in the questions file documents the normalisation assumed, so nothing breaks if the engine ever drifts. This runs the author and implementation work in parallel rather than in sequence.

### d033: A `parked` field for off-spec, overdone, or stretch questions
**Date:** 2026-04-30
Questions that do not fit the current scope but might serve a future use (Pre-IB stretch, Topic 8, an extended-writing teaching mode) are marked `parked` rather than deleted, becoming latent inventory rather than being lost. A companion `parkedFor` field records the candidate future use.

### d034: Storage-key convention
**Date:** 2026-04-30
Per-topic localStorage progress uses the key form `smithics_topic<N>_v<n>` (for example smithics_topic7_v1), so each topic's progress is distinct and does not collide in one browser. (One of the small calls the Design prototype deferred to implementation.)

### d035: Long-answer questions de-emphasised
**Date:** 2026-04-30
Long answers are hard for non-native English students, slow the one-at-a-time rhythm, and mark badly under keyword matching, so the long target drops toward 10% for Topic 7. Inflated longs are converted to 3-mark shorts; long-answer is reserved for genuinely extended-writing content (waste disposal, contamination-versus-irradiation comparison, biological effects). The test for keeping a question long is whether the past papers ask it as a long.

### d036: "Atomise the content, then set a longer task" authoring guidance
**Date:** 2026-04-30
Where a topic needs extended-writing practice, the approach is to break the content into atomic questions that feed into a longer task, rather than only setting the long question. Flagged as author-chat guidance. (Conceptual ancestor of the later atom system, see d043 atom system.)

### d037: Topic order is 7, then 8, then 1 (Forces)
**Date:** 2026-04-30
Topic 7 Radioactivity first, then Topic 8 (being taught at the time), then Topic 1 Forces. (Architecture had proposed Topic 1 second; Smith overrode to Topic 8 second because he was teaching it.) Sets the standing build order.

### d038: Migrate existing standalone tools into the engine later, content only
**Date:** 2026-04-30
The existing standalone topic tools (1, 2, 5, 6) are migrated into the shared engine later, discarding their CSS and engine code and bringing across only the question content (re-authored into schema shape, with improvements). The circuit-symbols tool and the Electricity engine stay standalone (v0.4 has no "pick the visual" question type, and they work as they are).

### d039: Login and cloud progress deferred; localStorage per-device for now
**Date:** 2026-04-30 (deferred)
Per-student accounts with cloud-stored progress (likely Firebase or Supabase) are deferred until two or three topics have shipped, because login is a fixed one-time cost whose value scales with how much history a student has to lose. For now progress stays in browser localStorage, per-device. (The separate memorisation tool already has a login working; this defers it for the question-bank tool specifically.)

### d040: v0.4 author-flagged schema needs recorded as non-blocking
**Date:** 2026-04-30
The author flagged six schema gaps (numeric answers inside short questions, multi-select MCQs, position-keyed markpoints for "list these" questions, a half-mark mechanism, instance type-override clarification, diagram param confirmation). Recorded as non-blocking; they later became the v0.5 structured types (see d041 structured types added).

---

## Phase 3: Structured types, atoms, and the recent architecture work (2026-05-03 onward)

### d041: Structured question types replace keyword-marked shorts (schema v0.5, engine v1.5.0)
**Date:** 2026-05-03
Added matching, multiselect, ordering, categorise, and fillblank, realising the v0.4 flagged needs (see d040 v0.4 flagged needs). These give deterministic marking for classification-shaped tasks and became the preferred home for anything that was being forced into a multi-mark short. multiselect is marked one mark per correct tick in penalty mode, so ticking everything does not score.

### d042: Grid type with `neutral` cell semantics
**Date:** 2026-05-03
A grid row can carry cells that are neither required nor penalised (ticked or not, both accepted), for rows with a defensible-but-not-correct option (the canonical case is beta, never the single "most dangerous" but a reasonable second place). The engine `markGrid` honours `q.neutral` and feedback shows a "neither right nor wrong" legend.

### d043: Atom system, per-question atom tagging, coverage auto-derived
**Date:** early May 2026 (est., circa v1.4) [?]
Each question declares `atoms: [...]`; per-atom coverage is computed by averaging marksAwarded/marksPossible over recent attempts touching the atom. Coverage is derived from the question tags, never from a separate registry-side list, so there is a single source of truth and no drift risk. `radiation_types` was the first registry. (Tagging later moved to authoring time, see d079 atoms-at-authoring.)

### d044: Matching marked by value, not index (engine v1.5.3)
**Date:** early May 2026
The matching marker compares right-hand values rather than canonical indices, so non-injective (many-to-one) matchings mark correctly. Later authoring chats hit stale references claiming index comparison; the live engine has been value-based since v1.5.3.

### d045: KaTeX math via `$...$` (engine v1.5.12)
**Date:** early May 2026
Both topic deployments load KaTeX from CDN; prompts and explanations split on `$...$` and render via window.katex. Unicode-superscript fallbacks are acceptable for simple cases, but the `$...$` convention is supported and authoritative. (Authors repeatedly hit a stale engine without KaTeX wired and worked around it with Unicode; see d054 work from the live engine.)

### d046: Inline stats panel replaces modal drilldown for routine coverage viewing (engine v1.5.16)
**Date:** 2026-05-07
A slim sticky stats strip pinned to the bottom of the coverage drawer reflects the current filter; clicking a tile sets the filter directly rather than opening a modal. The old modal survives only as an explicit "Full breakdown" power-user view. This keeps the coverage map the focus and the stats always visible.

### d047: Numeric marking is lenient strip-and-compare; no unit validation
**Date:** 2026-05-08
Tolerance defaults to plus or minus 0.5% of the target (0.0001 floor), overridable via `q.tolerance`; the marker strips non-numeric text before parsing, so "150", "150 cpm", and "1.5e2" all pass; `unitHint` is a display label only. Decided NOT to add unit-synonym checking or required-unit modes, because at IGCSE level the prompt names the unit and students should not be penalised for typing or omitting it.

### d048: "No multi-MP shorts" hard rule
**Date:** 2026-05-08
A short answer must have exactly one mark point; anything needing more becomes a structured type. Tightened from the earlier soft guidance ("stop if more than five mark points") after 43 multi-MP shorts had to be atomised in Topic 7. (Hardens the short-marker convention.)

### d049: Type-mix percentages are a guideline, not a quota
**Date:** 2026-05-08
Quality individual questions trump cosmetic balance; if the right type for a question pushes MCQ to 40%, ship 40%. This prevents deleting well-built atomic MCQs purely to hit a target ratio. (Reframes the "30% MCQ" target as diagnostic, not prescriptive.)

### d050: Name and watch authoring drift patterns
**Date:** 2026-05-08
The "shorts test articulation, structured types test classification" rationale is flagged as a known drift signal (it had been used to restore bloat that was rightly cut). General rule: inventing a fresh pedagogical rationale mid-flight to keep a question is a warning sign, to be flagged in the topic decisions log rather than acted on silently.

### d051: Past-paper anchoring as a chunk-boundary check
**Date:** 2026-05-08
For each spec point in a chunk, name a past-paper question that tests it; if none can be found, flag the question for cut. This caught the count-rate-to-activity question in Topic 7 (12 papers audited, zero instances).

### d052: Widget review at every chunk boundary, formalised
**Date:** 2026-05-08
Visual review of each chunk is a required workflow step, not optional. It catches issues JSON validation cannot: physics errors, missing reasons, narrow synonym lists, and completeness gaps (all four seen in Topic 7 chunk 4).

### d053: Per-topic content gotchas captured in TOPIC*_GOTCHAS.md
**Date:** 2026-05-08
Durable content-specific notes (alpha-skin nuance, beta thickness-gauge canonical example is aluminium foil, "beta" not "beta-minus" at this level, inhaled versus injected tracer half-lives, 4SS0 7.1 no-activity-calculations) live in the live folder so they outlive the authoring chat. TOPIC8_GOTCHAS.md was created the same way (4SS0 versus 4PH1 boundary, lifecycle-stages-are-four, force-direction phrasing, lifetime-calc cautionary tale, Topic 7 and 8 paired in the teacher's source files so astrophysics questions must be filtered out of the radioactivity bank).

### d054: Work from the live engine, not a stale reference
**Date:** 2026-05-08
Several reported Topic 8 "schema bugs" (matching by index, KaTeX missing, a numeric 3-mark cap) were artefacts of an older reference engine, not the live one. Authors must grep the live engine before assuming a feature is missing; a warning sits at the top of the schema doc and in the brief.

### d055: fillblank is exact-match; verb/descriptor slots go to MCQ
**Date:** 2026-05-08
fillblank synonyms cover typographical variants only, not conceptual ones (for example "gravity" is not accepted for "gravitational field strength"). Any slot whose answer is a verb, descriptor, or comparative with unbounded paraphrase belongs in an MCQ, not a blank. Promoted to a callout in the schema doc. The same logic sends predict-a-value questions (natural answer "approximately X" or "essentially unchanged") to MCQ with ballpark options rather than short, since the synonym space is too vague for deterministic string marking; genuine numeric answers use type numeric.

### d056: META and REPORT_FORM fields deprecated
**Date:** 2026-05-08
Vestigial from an older schema generation; the engine never read them. Documented as deprecated in the file-structure section.

### d057: Port-claim verification rule
**Date:** 2026-05-08
If a question says "port of [paper]", it must quote enough of the source phrasing in the explanation to ground the claim; otherwise it must say "based on" or "in the style of". Cheaper than building a sourcePaper corpus validator and it closes the invented-port failure mode seen in Topic 8.

### d058: Empty-mark-scheme pre-flight check is architecture-side
**Date:** 2026-05-08
Source materials are checked for completeness by the architecture chat at commission time, before an authoring chat starts work.

### d059: `calc` tag is for non-numeric calculation questions only
**Date:** 2026-05-08
The engine treats `type === "numeric"` as auto-calc, so the `calc` tag is reserved for calculation-reasoning questions that are not numeric-typed. Documented in the cross-cutting tags section. Other cross-cutting tags in the same family are `practical_skill` and `extended_writing` (the latter applied to every long question of 3 or more marks).

### d060: Draw-on-diagram type deferred
**Date:** 2026-05-08 (deferred to v0.7+)
A real candidate but expensive; MCQ-with-diagram-context is the v0.5 workaround. Diagram param shapes documented so they are reusable as canvases if the type is built later.

### d061: Chart-reading scaffolded credit: will not build
**Date:** 2026-05-08 (rejected)
A fillblank-numeric hybrid for one chart-reading question is not worth the invasiveness; the cheaper fix when it matters is generous tolerance on the final numeric.

### d062: Atom registries, default-build
**Date:** 2026-05-08
Build a registry wherever content has a real N-entities-by-M-attributes shape; skip only when clearly superfluous, and the bar for skipping is high. The skip case is when a structured question type already gives equivalent per-atom analytics. Smith's stance is stronger than "build if useful": build unless clearly superfluous.

### d063: Build all six Topic 7 registries
**Date:** 2026-05-08
halflife, applications_to_radiation, nuclear_processes, radiation_safety_principles, contam_irrad, and atomic_structure. atomic_structure is included because Topic 1 in 4SS0 is mechanics (Forces), not atomic structure, so Topic 7 is its only physics home. (Modifies an earlier lean to defer atomic_structure to a shared cross-topic registry.)

### d064: Build both Topic 8 registries
**Date:** 2026-05-08
stellar_lifecycle (four stages by their distinguishing properties) and orbit_properties (three orbiting-object types by their orbit properties).

### d065: audit_atoms.js build-time validator; no registry-side question list
**Date:** 2026-05-08
A small Node script cross-checks registry atoms against question references and reports orphans (declared, unused) and unknowns (referenced, undeclared, a typo catcher). Rejected the proposal to have the registry declare its own list of questions, because that introduces a second source of truth and a drift risk; coverage stays auto-derived from question atoms (see d043 atom system, single source of truth).

### d066: `principle` field ships now as a v0.6 minor, freeform, capture-while-authoring
**Date:** 2026-05-08
Every atom gets an optional freeform `principle` string naming the deeper physics it flows from; atoms sharing a principle string verbatim form a cluster (exact-match). The engine does not act on the field yet, but it is captured now because retrofitting it across every atom later is costly. (Brought the lighter version of the v0.7+ principle-hierarchy concept forward.)

### d067: orbit_properties added as a new umbrella subtag (Option B)
**Date:** 2026-05-08
The orbit registry attaches under a new `orbit_properties` subtag, mirroring radiation_types where the registry name and subtag name match. The eight orbit-atom questions gain the subtag so the mosaic tile has questions to land on.

### d068: Hub wrapper over Topics 7 and 8
**Date:** 2026-05-08
index.html became a hub listing both topics with live progress; the previous Topic 7 entry point moved to topic7.html. Each topic page gained an explicit back-to-hub button.

### d069: Hub shows a condensed coverage mosaic, no "engagement" language
**Date:** 2026-05-08
Dropped the word "engagement" and the progress bar (it implies a duty to practise). Each card shows two stat tiles plus a mini per-subtag coverage mosaic using the same colour bands as the in-topic coverage map.

### d070: Editor is teacher-only; gitignored out of the deployed repo
**Date:** 2026-05-08
editor.html, editor.css, and editor.js are removed from the hub and gitignored so students cannot reach them. A static site has no server-side gate, so not deploying the files is the strongest control available.

### d071: The `principle` field describes, it does not generate
**Date:** 2026-05-09
Guardrail: a principle describes why an existing, examinable atom is true; it must never be used to manufacture new atoms on the grounds that "the principle implies them". Added to the schema doc after the nebula_colour near-miss (see d077 nebula_colour dropped).

### d072: "No atoms on multi-cell types" convention withdrawn
**Date:** 2026-05-09
The Topic 8 convention of tagging atoms only on MCQ and matching questions (where the answer pinpoints an atom) and skipping multiselect, grid, categorise, and ordering left most mosaics grey, because most stellar and orbit content is tested by exactly those types. Reversed: multi-cell questions get `atoms` arrays and the whole-question aggregate fraction is credited to each tagged atom.

### d073: Per-cell atom attribution via `atomMap` (engine v1.5.21), built ahead of schedule
**Date:** 2026-05-09
multiselect, grid, categorise, and fillblank can declare `atomMap: { atomId: [cellIndex, ...] }`; the engine then scores each atom from cell-level correctness rather than the whole-question aggregate, falling back to aggregate where no map is given. Brought forward from a v0.7 idea to settle the convention before more questions were written. Ordering and matching do not get atomMap (ordering positions depend on neighbours and over-count; matching tags are already one atom per pair).

### d074: Coverage map has two display modes
**Date:** 2026-05-09
Subtags with a designed registry render the atom mosaic (cells are atoms); subtags without render the auto-mosaic (cells are questions, one per question). Registries are built where content has a real matrix shape; the auto-mosaic is the right granularity elsewhere. About a third of subtags get registries by design, not by oversight.

### d075: Migrate Topic 7 and Topic 8 authoring chats from web to Cowork
**Date:** 2026-05-09 (process)
The web-to-file-to-Cowork loop was lossy (manual uploads, reconstruction from intermittent files). Authoring chats move to Cowork with the live folder mounted so they edit files directly and share memory with architecture.

### d076: Wispr-correction, Q11/Q12 reframed, not dropped
**Date:** 2026-05-09
A voice-input turn that changed its mind mid-utterance was read as "drop those two"; Smith actually wanted Option B, a single combined MCQ (helium fuses in the core while hydrogen continues to fuse in a surrounding shell). The coverage-gap MCQ set goes from 17 to 18 and stellar atom coverage becomes complete. Cause logged as both voice rendering and chat-flow misread; lesson banked: on a two-position turn the later position usually binds, so reflect back before acting.

### d077: nebula_colour dropped from the registry; nebula_temperature kept
**Date:** 2026-05-09
nebula_colour is not a learnable 4SS0 fact and admits no clean MCQ, so the atom is removed (an untestable atom is misleading to keep). nebula_temperature is kept as a one-atom cluster with its own principle, defensible as derivable from the gravity-versus-fusion idea. (Partially reverses an earlier lean to drop both nebula atoms.) Generalised lesson: matrix-completeness is not a sufficient reason to include an atom; if no clean question can test it, the atom misleadingly implies a fact that is not really there.

### d078: Gap-fill questions to cover thin atoms; Topic 7 bank reaches 204
**Date:** 2026-05-09
Seven new Topic 7 questions give every one of the 94 atoms at least one positive-form probe, removing the thin-coverage gaps surfaced by retro-tagging. Topic 8 has an analogous gap-fill pass of 18 MCQs pending authoring (see d076 Q11/Q12 reframed).

### d079: Atoms-at-authoring is the convention; authors may invent atoms freely
**Date:** 2026-05-10
Atoms travel with questions: authors declare `atoms` (and `atomMap` where multi-cell) inline while writing, and may coin new atom ids on the spot. Architecture reviews new ids for coherence and folds them into registries afterwards; audit_atoms.js flags references-without-registry-entries as warnings to be resolved, not blockers. (Modifies d043 atom system by moving tagging to authoring time, and reverses both the "atoms only via retro-tag diff" workflow and the briefly-held "atoms must pre-exist in a registry" constraint.)

### d080: Distractor-only coverage tagged with `atoms` for now; `atoms_implicit` deferred
**Date:** 2026-05-10 (partly deferred)
An atom shown implicitly (for example by rejecting a distractor) still credits the atom for now via the ordinary `atoms` field. A future split into positive coverage (`atoms`) and distractor coverage (`atoms_implicit`) is a v0.7+ idea; the audit can flag implicit-only atoms as a soft warning.

### d081: Principle clustering is verbatim-only for v0.6
**Date:** 2026-05-10 (deferred)
Only exact-match principle strings cluster automatically. Near-shared (same idea, different instantiation) and differently-framed (same physics, different angle) principle relationships are v0.7+ tooling; for now the freeform string plus exact-match is the whole mechanism.

### d082: decay_random and halflife_random_decay kept as two atoms (case-specific)
**Date:** 2026-05-10
Two evidence channels for the same physics, entering from different conceptual angles ("decay is random" versus "half-life is statistical"), so both are kept. This is a case-by-case judgement at registry-design time, not a general rule; the audit must not auto-flag verbatim-shared-principle pairs as duplicates.

### d083: Atom registries stay flat (1-tier)
**Date:** 2026-05-10
No 2-tier "principles sub-registry" inside the atoms layer. The freeform principle field (see d066 principle field ships now) detects redundancy softly, and a future principle registry (v0.7+) would make it structural without restructuring the atoms layer. Premature 2-tiering would create work the future layer obsoletes.

### d084: Registry-worthiness is shape, not topic volume
**Date:** 2026-05-10
Whether content deserves its own registry depends on having a coherent N-by-M shape that mosaics well, not on how many atoms a single topic yields. This decouples the decision from topic primacy and anticipates cross-topic registries. units stays folded into atomic_struct until someone has a concrete reason to split it out.

### d085: Registries are not required to be two-dimensional
**Date:** 2026-05-10
A registry is a 1D ordered list of atoms; the engine uses each atom's `group` to set the mosaic column count, and the `attr` field is residual documentation the engine ignores. Registries may be a single ungrouped column or have unequal-sized groups; the matrix appearance is an author-ordering convention, not an engine constraint.

### d086: Group and principle are orthogonal axes
**Date:** 2026-05-10
Group is a structural and layout choice (how to lay atoms out so the mosaic reads cleanly); principle is a physics statement (why an atom is true). They may align but must not be conflated. Authoring workflow: do the group thought first (lay out for readability), then the principle thought (the why behind each atom), cross-referencing only where it genuinely helps.

### d087: Atom-name reveal versus axis-only naming: parked; interim rule is "show the fact, not the derivation step"
**Date:** 2026-05-10 (parked)
Topic 7 registries use answer-revealing names; Topic 8 used axis-only names. Resolution is UI-dependent (it matters more if the name shows without the question) and low priority. The operative interim rule, since the mosaic shows the name on hover, is loose: an atom name may show the fact but must not reveal a step the question wants the student to derive. If a sweep happens, the direction is Topic 7 toward axis-only naming.

### d088: Cross-registry `informs` relation deferred
**Date:** 2026-05-10 (deferred to v0.7+)
Modelling one atom informing or depending on another across registries is a future feature, not built now.

### d089: Course-level abstraction above topic
**Date:** 2026-05-10 (v0.7+ design directive)
Trilogy versus Pre-IB is a choice at a level above topic, and a student's atom mastery should follow them if they switch courses. Design implications recorded for later: atom-id stability across courses, a course dimension on the storage key (see d034 storage-key convention), the hub acting as a course picker, and a course/topic folder convention.

### d090: calc_workings question type, four-line working (engine v1.5.22)
**Date:** 2026-05-10
A calculation type with four lines (equation, substitution, rearrangement, final answer plus unit), each worth one mark and marked independently, so a student who knows the method but slips on arithmetic still scores partial credit. Built to make calculation marking diagnostic per step, primarily for the Trilogy electricity work.

### d091: calc_workings marking conventions (engine v1.5.23 and v1.5.24)
**Date:** 2026-05-10
Lines 1 and 2 accept any algebraically-equivalent form (numeric check against the knowns plus the expected answer), so a rearranged equation or substitution still scores; lines 1 to 3 are case-insensitive and accept `x` as multiplication; line 4 is a bare value plus a case-sensitive unit (V is volts, v is velocity); per-line feedback shows a tick or cross plus a reason string. Line 4 dropped the "V =" prefix requirement in favour of a value box and a unit box.

### d092: categorise items render KaTeX; partial-credit miss rows coloured (engine v1.5.25)
**Date:** 2026-05-10
categorise inputs and feedback now run through inline-math rendering, and partial-credit miss rows get a red tint. A longstanding CSS selector bug had left wrong rows on multi-cell types completely unstyled; fixed in the same pass, which also repaired the calc_workings per-line feedback colouring.

### d093: Error-type taxonomy is the next major dimension (the "flip the cube" view)
**Date:** 2026-05-11 (v0.7+ direction)
Smith's roughly 50-category hand-marking scheme becomes a second per-atom, per-topic axis answering "how do students get things wrong", toggled against the coverage view. This is the direction of travel, not a now-build; the data model lands incrementally and the full enum is deliberately not frozen early. Detectability was sorted into four bands (line-level auto-detect, small-authoring-addition, question-metadata, and human-judgement). This realises standing principle 1 (atomic understanding of errors).

### d094: Error-type soft launch, collect, do not display (engine v1.5.26)
**Date:** 2026-05-11
calc_workings derives canonical error codes from its per-line reasons and stores them on each attempt, with no student-facing display and no aggregation UI yet, so real data builds up to validate the codes before anything is shown. Codes are snake_case and stable; internal labels use Smith's taxonomy ("SubF", "unit", "Wrong equation"), student labels are reserved. Dev helpers (SmithicsDev.errorTypeReport) inspect the data behind the scenes.

### d095: Per-distractor MCQ error tagging via `distractorErrorTypes`
**Date:** 2026-05-11
An MCQ may map diagnostic distractors to error codes; choosing that distractor records the code on the attempt. This is the tractable Band-4 entry point, catching conceptual misunderstandings without student self-report, and is flagged as high-leverage for the Trilogy electricity author (one extra line per diagnostic distractor).

### d096: Band-2 schema sketches documented, not wired
**Date:** 2026-05-11
Dimensioned `knowns` (value plus dimension, enabling SubK wrong-kind-of-number detection), prefix-aware `asGiven` (enabling prefix-conversion detection), `expectedForm` (sig fig or standard form), and `calcShape` (equation, geometry, or graph) are documented so authors can declare them while writing. The marker does not read them yet; the shape is backward-compatible with the plain knowns form.

### d097: `commonMisconceptions` per-question field
**Date:** 2026-05-11
An optional freeform array capturing the errors a question is likely to surface. The engine ignores it; future tooling reads it. Same capture-while-authoring rationale as the principle field (see d066 principle field ships now).

### d098: No student self-report of error type
**Date:** 2026-05-11
Self-classification will not work in bulk for this age group. Error types are inferred from the marker and from distractor choice (see d095 distractorErrorTypes) instead.

### d099: Mains electricity deferred to v2 (Trilogy electricity)
**Date:** 2026-05-11 (scope, deferred)
Kept out of v1 to keep the electricity vocabulary tight.

### d100: Circuit diagrams via a text DSL, not structured params (engine v1.5.27)
**Date:** 2026-05-23
circuit_diagram.js, extracted from the circuit-builder tool built with Claude Code, renders a compact circuit DSL; questions carry `diagram: { kind: "circuit", source: "..." }` and an unparseable source falls back to a placeholder showing the error. This contracts the diagrams-chat brief (circuits come off the list, leaving only Topic 8 orbit diagrams and bar charts) and reduces circuit authoring to a DSL string documented in CIRCUIT_DSL.md.

### d101: Circuit DSL v2, SI prefixes, variable sources, forced units, non-ideal meters (engine v1.5.28)
**Date:** 2026-05-23
Prefixed values (for example r10k, v6, a5mohm) render directly, with prefix codes case-sensitive (M mega versus m milli). This pairs with the Band-2 `asGiven` field (see d096 Band-2 sketches) for prefix-conversion error detection. CIRCUIT_DSL.md updated to mirror v2 in full, including the trailing-parallel operator, the b alias for cb, and combined value-plus-annotation forms.

### d102: Chat-fleet split, GCSE Physics Overview seat, Pre-IB project, Trilogy project
**Date:** 2026-06-08
Pre-IB (4SS0) and Trilogy become peer projects coordinated by a GCSE Physics Overview seat. Trilogy leaves the Pre-IB architecture's remit but inherits its artefacts (engine, schema, calc_workings, atom-registry pattern, error-type tagging, circuit DSL) and cross-fertilises via brokered inter_chat threads. Pre-IB drops Trilogy from its forward planning.

### d103: Inter-chat protocol, read shared state, cite decisions with substance
**Date:** 2026-06-08
All coordination is file-mediated, with no out-of-band channel. On session start a chat reads memory, the canonical state docs (DECISIONS, DESIGN, OPEN_QUESTIONS, ROADMAP, brief, handover), and any inter_chat threads addressed to its role, then surfaces what it found. Decisions are cited by number plus substance (write "d043 atom system", never bare "d043"). Respond with substance, agree by silence, no silent absorption (flag NEW_FLAG or NEW_QTYPE), both think and neither prescribes. No em-dash anywhere.

### d104: Authoring follow-up dispatched "parallel-ish", one after another
**Date:** 2026-06-08 (process)
Topic 7 and Topic 8 author follow-ups run in parallel but are dispatched one after the other rather than simultaneously. Topic 7 first (narrower scope), Topic 8 staggered behind it. Each gets an inter_chat thread plus a reading list of its own prior outputs and the protocol.

### d105: Forces (4SS0 Topic 1, mechanics) is the next topic to commission
**Date:** 2026-06-08 [?]
Stated as the next topic after the Topic 7 and Topic 8 follow-ups, with abundant past-paper material available. It is the first heavy user of calc_workings and the Band-2 calc metadata, and it confirms the standing topic order (see d037 topic order 7 then 8 then 1). Marked uncertain because it reads as a near-term plan rather than a fully settled commission.

### d106: Unified ten-code MCQ-distractor canonical set adopted (engine v1.5.29)
**Date:** 2026-06-09
The Topic 7 and Topic 8 author chats independently surfaced overlapping NEW_FLAG batches of error codes for `distractorErrorTypes` per d095 (per-distractor MCQ error tagging via distractorErrorTypes). Architecture merged into one canonical set of ten: `concept_swap` (Topic 7's name, generalises Topic 8's `stage_confusion`), `property_value_swap`, `false_dependency`, `false_consequence`, `causation_inverted`, `magnitude_wrong`, `direction_reversed` (Topic 8's name, generalises Topic 7's `context_inversion`), `simpler_model_persistence`, `scope_leakage`, `pattern_transferred`. Topic 8's `geostationary_misconception` rejected as too topic-specific; canonical codes live at the kind-of-error level, specific named misconceptions go in `commonMisconceptions` per d097 (commonMisconceptions per-question field). Both authors resume tagging immediately. ERROR_TYPES in engine.js now carries twenty-five codes total (fifteen calc_workings line-level plus the ten ratified here).

### d107: Forces diagrams as a separate chat commission (engine wire-up follows circuit_diagram.js)
**Date:** 2026-06-09
Forces needs eight diagram kinds (velocity_time_graph, distance_time_graph, free_body_diagram, forces_on_inclined_plane, stopping_distance_diagram, stopping_distance_vs_speed, acceleration_apparatus, object_scene) which is too much for the Forces author chat to also produce. A dedicated Forces diagrams chat is commissioned via `BRIEF_forces_diagrams.md`, modelled on the circuit_diagram.js pattern (window function returning an SVG element, dispatch via `renderDiagramPlaceholder`). Hard-to-read tick numbers are the recommended default for graph kinds: data points off integer values, typical form five subdivisions between integer majors; other tick schemes acceptable so long as the data still requires careful reading. Silent snap-to-major is the named failure mode to avoid. Author widgets are optional sweeteners; SVG renderers are mandatory.

---

## Items raised but not decided (for Smith to rule)

- A separate `SCHEMA_v0_4.md` file split out from SCHEMA_v0_5_NEW_TYPES.md (offered, not taken; the v0.4 clarifications currently live as a section inside the v0.5 doc, and an older SCHEMA_v0_4.md exists in the other Pre-IB folder per STATE.md).
- `mustNotInclude` field: unused across 200-plus questions; kept in the engine but flagged as a candidate for deprecation if Topic 8 also yields no uses.
- Coverage drawer layout for dense registries (the 30-atom applications registry renders awkwardly); parked as a design conversation, no option chosen.
- Procedural numeric generation (the numeric_template type and the IB1B-style procedural grading) remains reserved in the schema but unbuilt.
- File size: question banks around 12K lines are accepted for now; lazy-load per topic only if it becomes a problem (Topic 1 Forces, a bigger spec, could force the question). Not scheduled.
- Migration of the existing standalone Topic 1, 2, 5 tools into the engine (content only) is agreed in principle (see d038 migrate standalone tools) but not scheduled.
- `ordering` marking mode: a `pairwise` option (adjacent items in the right relative order score, regardless of absolute position) is an unbuilt candidate for tightly-coupled sequences; ordering currently marks per_position.
- Short subtypes: splitting `short` into `short_recall_one_of_n` (generous fragment matching) and `short_recall_specific` (strict, often allowAdjust false) is a v0.7+ schema candidate, surfaced by the heterogeneity of the seven surviving Topic 7 shorts.
- `coverage_strength` field (positive / distractor / synonym) on atom tags, as an alternative to the `atoms_implicit` split (see d080 distractor-only coverage); raised in the Topic 7 handover, not chosen.
- Autocomplete-from-vocabulary question type (noted 2026-05-03, v0.6/v0.7 candidate, not built): a shared statement-vocabulary the student searches and taps to build a list answer, with per-question statement statuses (correct, wrong_plausible, right_spirit_poorly, off_topic) and deterministic per-pick marking. The intended path for "give N reasons" list questions where free-text marking fails; the `right_spirit_poorly` status anticipates the error taxonomy (see d093 error-type taxonomy). Real infrastructure, not a quick build; v0.5 grid covers the practical-safety case meanwhile.

## Recurring environment note (not a decision)

The live folder is `G:\My Drive\github local files\preibphysics\new\`. Several Cowork sessions have found that this folder is not the mounted workspace (the mount has been the OneDrive `PreIB Qs Project` folder, which holds only spec PDFs and a stale code snapshot). When a chat cannot see the live files, it should raise the path mismatch before acting rather than working against the wrong folder.
