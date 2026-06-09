# Architecture <-> Topic 1 Author: Forces and Motion

**Status:** OPEN

Thread for the Topic 1 (Forces and Motion, 4SS0) authoring commission. Convention: dated entries, newest at the bottom; respond with substance, agree by silence; cite decisions by number plus substance; no em-dash.

Note on thread origin: the brief (§13, §18) anticipated Architecture opening this thread. It had not been created when the Author seat started, so the Author opened it with the acknowledgement below. No content lost; flagging per "no silent absorption".

---

## 2026-06-09, Topic 1 Author: commission acknowledgement

Read before starting: `AUTHOR_BRIEF_topic1_forces.md`, `INTER_CHAT_PROTOCOL.md`, `STATE.md`, `DECISIONS.md` (d001 to d105, in full), `SCHEMA_v0_5_NEW_TYPES.md` (in full, including the calc_workings, Band-2, atomMap, and error-type sections). State is absorbed; surfacing it here as evidence rather than as a status report.

**What I take the commission to be.** A greenfield Topic 1 (Forces and Motion) bank for Edexcel 4SS0, output as `topic1_forces/topic1_questions.js` declaring `window.PREIB_TOPIC1_QUESTIONS`, plus the `index.html` and `topic1_config.js` scaffold cloned from `topic8/`, storage key `smithics_topic1_v1` per d034 (storage-key convention). Stage 1 is the subtag vocabulary proposal (`topic1_vocabulary_proposal.md`), handed back for review before any questions are written, per §3. Roughly 150 to 250 base questions eventually, gated on what survives the past-paper scope discipline.

**Conventions I am holding as binding:**
- d048 (no multi-MP shorts): a `short` has exactly one mark point; everything else atomises or becomes a structured type. This was Topic 7's biggest rot pattern (43 atomised); I will not reintroduce it, and I will treat "shorts test articulation, structured types test classification" as the known drift signal it is per d050 (name and watch drift patterns).
- d090 to d091 (calc_workings type and marking): default to calc_workings for any calculation where method matters, which is most of 4SS0 Forces; `numeric` only for trivial single-step plug-and-answer. Forces is the first heavy user.
- d096 (Band-2 schema sketches): declare dimensioned `knowns`, prefix-aware `asGiven`, `expectedForm`, `calcShape` where they apply, even though the marker does not read them yet. Forces is dense with g-vs-kg, cm-vs-m, kN-vs-N prefix traps; capturing `asGiven` now is cheap.
- d095 (distractorErrorTypes) and d097 (commonMisconceptions): tag diagnostic distractors and capture misconceptions per question. Forces is misconception-dense (mass/weight, balanced/resultant, force/momentum, scalar/vector, action/reaction).
- d079 (atoms-at-authoring): declare `atoms` inline, coin ids freely, surface new ids as NEW_FLAG; d062 (default-build atom registries) sets the bar for skipping a registry high.
- d051 (past-paper anchoring) and d052 (widget review) at every chunk boundary.
- d057 (port-claim verification): "port of" only where traceable to the cited paper, otherwise "based on" / "in the style of".
- d012 (P-suffix spec refs): 4SS0 points only; `1.XP` flags 4PH1-only sub-parts for the Trilogy peer, not for this bank.
- d103 (inter-chat protocol) housekeeping: no em-dash, cite with substance.

**Reading-list omissions and environment flags (per §18, flag before stage 1):**

1. **No `reference/` folder in the live folder.** The brief (§2 items 4 to 7) points at `reference/` for the spec PDFs, syllabus notes, and past paper archive. That folder does not exist under `new/`. I have located the sources elsewhere and am treating these as canonical unless told otherwise:
   - 4SS0 spec: `...\OneDrive\Documents\Claude\Projects\PreIB Qs Project\4SS0 Science (Single Award) Specification (2) (1).pdf`.
   - 4PH1 spec (for the Double-Award boundary, §7 Rule 2): `...\PreIB Qs Project\international-gcse-physics-2017-specification.pdf`.
   - 4SS0 past papers (2023, 2024, 2025, plus sample-to-2023 bundles, with mark schemes and examiner reports): the `PaperDatabases` repo, `4ss0 Edexcel Single Science\4ss0 past papers\`.
   This matches the recurring environment note at the foot of `DECISIONS.md` (the live folder is often not the mounted workspace; spec PDFs and stale code sit in the OneDrive folder). Confirmation requested that this is the intended source set.

2. **No Topic 1 teacher syllabus notes found anywhere.** Topic 7 was authored notes-first per d015 (notes-first authoring): the teacher's notes carried the canonical marking phrasing and were the ground truth for what earns a mark. I can find no equivalent Forces notes in the live folder, the OneDrive folder, or the paper repo. The brief (§2 item 6) says "if Smith has placed them" and (§2 item 7) treats past papers as at least equally important, so anchoring on spec plus past-paper mark schemes plus examiner reports may be the intended plan for Forces. Flagging because it is a real change from the Topic 7 method and it affects how I pin down marking phrases and the canonical wording for `short` / `fillblank` answers. If notes exist, pointing me at them would materially improve the marking lists.

3. **Thread not pre-opened** (noted above); opened by the Author.

**First questions before stage 1:**

A. **Who ratifies stage 1?** The fleet model has Architecture ratify the Author's vocab proposal before question-writing (§3, "hand back for review"). In this Cowork session there is no separate Architecture seat live; it is the Author seat and Smith. Confirm whether Smith reviews the vocabulary proposal directly, or whether I should self-review wearing the Architecture hat and proceed once it validates against the spec. This gates the start of question-writing.

B. **Momentum and impulse scope.** The brief (§3, momentum group) flags that whether 4SS0 covers the impulse form `F = Δp / Δt` depends on the spec, and (§7 Rule 2) names turning moments as the classic 4PH1-only material. I will resolve both against the 4SS0 spec PDF directly in stage 1 and record the boundary in `topic1_decisions.md`; raising here so the decision is visible. No action needed unless Smith already knows the call he wants.

No blockers beyond questions A and B. Once A is answered I proceed to the stage-1 vocabulary proposal.

---

## 2026-06-09, Topic 1 Author: Smith's answers + scope finding from the 4SS0 spec

**Smith's answers to the two questions.** (A) Stage-1 approval: the Author writes back to Architecture on this thread; Architecture ratifies (no self-ratification). (B) Source anchor: teacher notes plus past-paper questions have been placed under a `reference/` folder in the live folder; some of the past papers are 4SD0 (Double Award Science), not 4SS0, and must be filtered. Sync flag: as of this entry the `reference/` folder has not propagated to the local Google Drive mirror (the two newest inter_chat threads synced, but `reference/` and its PDFs have not), so the notes and ppqs are not yet readable from this seat. Recorded so the gap is visible; not yet acted on.

**Scope finding (important, reshapes the brief's §3 suggested group list).** I extracted the actual Topic 1 scope from the 4SS0 Single Award spec (Issue 3, April 2018) and cross-read it against the 4PH1 Physics spec (Issue 4, Sept 2024) to fix the boundary. The 4SS0 Single Award Topic 1 is materially narrower than the brief's eight suggested parent groups.

**In 4SS0 Single Award scope (15 spec points), three sub-topics as the spec groups them:**
- (a) Units: 1.1 (kg, m, m/s, m/s2, N, s, N/kg).
- (b) Movement and position: 1.3 distance-time graphs; 1.4 average speed = distance / time; 1.5 practical (motion of everyday objects); 1.6 acceleration = change in velocity / time, a = (v - u)/t; 1.7 velocity-time graphs; 1.8 acceleration from the gradient of a v-t graph; 1.9 distance from the area under a v-t graph.
- (c) Forces and movement: 1.11 effects of forces (speed, shape, direction); 1.12 types of force (gravitational, electrostatic); 1.16 friction opposes motion; 1.17 F = m x a; 1.18 W = m x g; 1.19 stopping distance = thinking + braking; 1.20 factors affecting stopping distance (speed, mass, road condition, reaction time).

**Carved out of Single Award (NOT this bank), with routing per §7 Rule 2:**
- Physics + Double Award (4SD0), route to the Double/Trilogy peer: 1.10 (v2 = u2 + 2as, the only "suvat" point Edexcel lists), 1.13 (scalar vs vector), 1.14 (force is a vector), 1.15 (resultant force along a line), 1.21 (falling objects / terminal velocity), 1.22 (Hooke's-law practical), 1.23 (force-extension linear region / Hooke's law), 1.24 (elastic behaviour).
- Physics only (4PH1), not Double either: 1.2, and 1.25P to 1.33P (momentum p = mv, momentum safety features, conservation of momentum, F = change-in-momentum / time, Newton's third law, moments, centre of gravity, principle of moments).

**Consequences for the brief's §3 suggested groups:**
- "Equations of motion (the suvat set v = u + at, s = (u+v)t/2, v2 = u2 + 2as)": NOT a Single Award group. Edexcel only codifies a = (v - u)/t (1.6, in scope) and v2 = u2 + 2as (1.10, out of scope). The other two suvat forms are not Edexcel spec points. Recommend no suvat group; acceleration lives under Movement.
- "Newton's laws (first and third), balanced vs resultant, free-body, scalar vs vector": Newton's third law (1.29P) and resultant-force calculation (1.15) and scalar/vector (1.13, 1.14) are all out of scope. Single Award forces is effects (1.11), types (1.12), friction (1.16), F = ma (1.17), weight (1.18). Recommend the group be "Forces and Newton's second law", without N1/N3, resultant-force, or vector treatment.
- "Momentum": entirely Physics-only (1.25P+). Out. No momentum group.
- "Density" and "Pressure": not in Topic 1 in the Edexcel spec at all (they sit in the Solids/liquids/gases topic). Out of this commission. Recommend dropping both from the Topic 1 vocab.

**Consequence for the brief's §12 distractor codes.** Several suggested Forces misconception codes target out-of-scope content: `scalar_vector_confusion`, `confused_action_reaction_pair`, `confused_force_momentum`, `terminal_velocity_no_acceleration`. In Single Award these have no home. The live in-scope misconception seam is narrower: mass vs weight (1.18), force-causes-motion vs force-causes-acceleration / friction (1.11, 1.16, 1.17), speed vs acceleration and gradient vs area on graphs (1.6 to 1.9), and stopping-distance factor confusions (1.20).

**Consequence for question count.** The brief's 150 to 250 base-question estimate looks high for the true Single Award scope. With generous genuine-variety instances (graph reading offers many; calc_workings for average speed, acceleration, F = ma, W = mg; qualitative stopping-distance variants), a realistic figure is closer to 70 to 120 base questions. Flagging per d019 (calibration first, negotiate volume) rather than padding to hit 150+ with weak items (d049 type-mix is a guideline, not a quota; d016 genuine-variety rule).

**Proposed vocabulary shape for stage 1 (for Architecture ratification):** three parent groups mirroring the spec sub-topics (`units`, `movement_position`, `forces_movement`), roughly 12 to 16 child subtags across them, plus cross-cutting `definition`, `practical_skill`, `calc`. Registry candidates that survive the scope cut: `force_types` (gravitational, electrostatic, friction, weight, contact), `motion_graphs` (distance-time and velocity-time x gradient / area / shape meaning), `units_quantities` (the seven 1.1 units x quantity / symbol). The suvat, momentum, newton_laws (three-law), and density_pressure registry candidates from the brief fall away with the out-of-scope content.

Awaiting: (1) confirmation of the tightened Single Award scope above; (2) the `reference/` folder syncing so I can read the notes and ppqs and anchor marking phrasing and past-paper coverage. I can draft the full `topic1_vocabulary_proposal.md` from the spec immediately on the scope confirmation; the notes will refine grouping and the ppqs will feed stage-2 anchoring.

---

## 2026-06-09, Topic 1 Author to Architecture: scope ratified, and a standing request to stop setting target numbers

**Scope ratified.** Smith has confirmed the tightened Single Award scope above: three spec-aligned groups (`units`, `movement_position`, `forces_movement`), with suvat, momentum, Newton's third law, moments, scalar/vector, resultant force, Hooke's law, terminal velocity, density and pressure all out of this bank and routed to the Double / Physics peer per §7 Rule 2. Stage 1 proceeds on this scope.

**Standing request to Architecture, from Smith, to bake in: briefs must not set target question counts, and authors must not set their own.** This is a correction worth carrying into every future Author brief, not just this one.

The principle, in Smith's framing: an author should not be driven by a number. The brief must not hand down a count ("roughly 150 to 250 base questions", per-subtag counts, and so on), and the author must not invent one either. A target number causes two opposite failure modes, both bad: "I have hit the number, therefore I am done" (stop short of fully testing an idea), and "I have not hit the number, therefore I am not done" (pad with weak items to reach it). Either way the number, not the physics, is steering.

What should steer instead: read the spec point, ask what actually tests it, what kinds of questions have been asked and could be asked, what fully examines the idea from different angles, and how the understanding breaks down into atoms. The number of questions is then whatever falls out of doing that well. It is an output, never a target and never a stopping rule.

I am holding myself to the same standard: I retract the "70 to 120 base questions" figure I offered in the entry above. That was me restating a count as if it were a calibration target, which is the exact error. Strike it. The bank will be as large as fully testing the 15 in-scope spec points requires, and no specific size is planned.

**Concrete changes requested in the brief and the conventions:**
- `AUTHOR_BRIEF_topic1_forces.md` §4: remove "Roughly 150 to 250 base questions, depending on how much past-paper material survives the scope discipline." Replace with a coverage instruction: test each in-scope spec point fully, from the angles past papers use and could use, atomised; let the count fall out.
- §4 "Soft targets, not quotas" and §5: the type-mix percentages and the difficulty split read as numeric targets even though they are captioned "diagnostic". Recommend demoting them further: keep them only as an end-of-bank sanity check the author may glance at, with explicit text that they are never to be authored toward. This extends d049 (type-mix percentages are a guideline, not a quota) and d016 (genuine-variety rule) from "do not pad to hit the mix" to "do not let any number, including a total count, set the target".
- The template used for future Author briefs (the §3/§4 shape reused across Topics 7, 8, and onward): strip per-topic and per-subtag target counts from the template entirely. d021 (Topic 7 target about 80 to 100 base questions) and d019 (calibration batch, negotiate volume) were the early pattern; this supersedes the "negotiate a target volume" framing with "there is no target volume; coverage of the spec is the only driver".

**Proposed as a new decision for DECISIONS.md (Architecture to ratify and number):** "Briefs do not set target question counts and authors do not self-set them. Coverage is driven by fully testing each in-scope spec point from every angle it is or could be examined, atomised; the resulting count is an output, not a target or a stopping condition." Cites d049 (type-mix is a guideline) and d016 (genuine-variety) as the lineage. Flagging as NEW_FLAG for ratification rather than editing the brief unilaterally.

No other action this turn, at Smith's instruction. Stage 1 drafting begins next, on the ratified scope, once the `reference/` notes and ppqs are readable.

---

## 2026-06-09, Topic 1 Author to Architecture: stage 1 delivered (`topic1_vocabulary_proposal.md`)

**Source access resolved.** The `reference/` folder turned out to be a sibling of `new/` (`...\preibphysics\reference\`), not under `new/`, which is why it never appeared. Drive-sync to the local mirror also lagged, so I read the teacher's syllabus notes through the Google Drive connector rather than the local files. The notes are now absorbed and are load-bearing for the proposal's marking phrasing and the scope confirmation.

**Stage 1 deliverable: `topic1_vocabulary_proposal.md`** (saved to the live folder, root, alongside `topic8_vocabulary_proposal.md`). Headlines:
- Three parent groups mirroring the spec sub-topics: `units`, `movement_position`, `forces_movement`; sixteen child subtags; cross-cutting `definition`, `practical_skill`, `calc`. Every in-scope spec point (1.1, 1.3 to 1.9, 1.11, 1.12, 1.16 to 1.20) has a home; no subtag exists without a spec point.
- The teacher's "will not be examined" column independently confirms every scope cut: no vectors/scalars (1.4 note), no resultant-force-from-components (1.12 note), no v2 = u2 + 2as (1.9 note), no falling objects / terminal velocity (1.20 note). Full boundary table with routing in §5.
- No target question count anywhere, per the standing request above. The proposal's §2 states the coverage-driven approach explicitly and asks for the no-count principle to be ratified.
- Atom-registry sketch (§6): `motion_graphs`, `force_types`, `stopping_distance_factors`, `mechanics_units` proposed; `mechanics_equations` raised as a question (dedicated registry vs per-equation atoms). The brief's suvat / momentum / newton_laws / density_pressure registry candidates do not survive the scope cut.

**Four questions for Architecture before stage 2** (proposal §8): (1) approve or amend the group/subtag structure; (2) ruling on `units` as a standalone parent group vs folding into calc coverage as Topic 8 did with 8.1; (3) ruling on the `mechanics_equations` registry candidate; (4) confirm the no-target-count principle.

No questions are written until this is ratified. On approval, stage 2 starts with the first chunk and the past-paper sweep per d051 (past-paper anchoring) and widget review per d052.
