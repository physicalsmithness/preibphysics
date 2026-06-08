# Pre-IB (single science / 4SS0): STATE and document index

Entry point for any chat picking up this project. Read this first. Its job is to answer the question the architecture chat just hit: "where are all the files the protocol mentions, and am I supposed to generate them?"

## Short answer for the architecture chat

**You do not need to generate a new set of operating-model documents.** This project already has the equivalents of DECISIONS, DESIGN, OPEN_QUESTIONS, ROADMAP and the author briefs; they live under topic-specific names rather than generic ones. The new `INTER_CHAT_PROTOCOL.md` was added to give the project the inter-chat discipline the wider estate uses, and it names those documents by their generic *roles*, not by required filenames. Nothing in it asks you to recreate work you already have. Read the existing docs (indexed below), then carry on with the live work (the open questions and Topic 8), using the `inter_chat/` folder for cross-chat threads from now on.

## What this project is

A static-site revision driller for Edexcel International GCSE Single Award (4SS0) physics, the course this school calls single science / Pre-IB. Topic 7 (Radioactivity) is finished (v2 FINAL, about 200 questions, schema v0.5, six atom registries). Topic 8 (Atoms) is in progress. The work is memory-heavy with little calculation, so the design leans on atom registries and generous-synonym recall marking rather than calculation grading.

## Document index (role, then the file that fills it)

- **Project / manifest:** `README.md` (Topic 7 code readme), `MANIFEST.md`, `FINAL_PACK_README.md`.
- **Decisions:** `topic8_decisions.md` (Topic 8); Topic 7 decisions are embedded in `HANDOVER_NOTES.md` and the rationale in `topic7_atom_registries.md`.
- **Design and schema:** `SCHEMA_v0_5_NEW_TYPES.md`, `CIRCUIT_DSL.md`, `engine.js`, and the registry files (`registry_*.js` with their `*_retrotag.md` diffs, plus `topic7_atom_registries.md`, `topic8_atom_mapping.md`, `topic8_vocabulary_proposal.md`).
- **Open questions:** `HANDOVER_NOTES.md` (Q1 to Q8 plus the schema-and-tooling items), `TOPIC7_GOTCHAS.md`, `TOPIC8_GOTCHAS.md`.
- **Author briefs:** `AUTHOR_BRIEF_topic7_v2.md`, `AUTHOR_BRIEF_topic8.md`, `BRIEF_diagrams_chat.md`.
- **Plans / roadmap:** `PLAN_topic7_retrotag.md`, `atomisation_plan.md`, `PLAN_electricity_mode_trilogy.md`.
- **Inter-chat threads:** `inter_chat/` (new). The existing `topic8_feedback_for_architecture.md` is a prototype authoring-to-architecture thread and can move into `inter_chat/` under the naming convention.
- **Question bank:** `topic7_radioactivity_v2_FINAL.js`, `topic8/topic8_questions.js`, `FINAL_merged_v4.json`.

Note: some older project docs (`IMPLEMENTATION_BRIEF_v1.md`, `SCHEMA_v0_4.md`, `MARKING_ENGINE_NOTE.md`) live in the other Pre-IB folder, `...\Projects\PreIB Qs Project`. If you need them and they are not reachable, ask Smith to connect that folder, or consider consolidating the two into one project home.

## Live work / next steps for the architecture chat

These are the project's own open items, not new busywork. In rough priority:

1. **Ratify the Topic 7 open questions in `HANDOVER_NOTES.md`.** The authoring chat left eight (atoms-at-authoring-time policy Q1, distractor-only coverage strength Q2, the duplicated `decay_random` atom Q4, the `applications_to_radiation` tier shape Q5, and others) plus a set of schema-and-tooling gaps (numeric tolerance and unit-synonym behaviour, `grid` empty-correct-row `neutral` semantics, `ordering` marking modes, the unused `mustNotInclude` field). Each wants an architecture decision recorded in a decisions file.
2. **Continue Topic 8.** `topic8_decisions.md`, `topic8_feedback_for_architecture.md`, and the Topic 8 gap analyses are the live thread; keep authoring and ratifying against them.
3. **Adopt the inter_chat habit.** Put cross-chat communication in `inter_chat/` as named threads (see `INTER_CHAT_PROTOCOL.md`), and read threads addressed to you at session start. This is the one genuinely new practice; everything else already exists.

You do not need to retrofit the whole estate's generic layout. If you ever want a single canonical `DECISIONS.md`, the cheap version is to append future decisions to one file going forward rather than rewriting the topic-specific history. Smith's call, not required.
