# Thread: Architecture ↔ Past-paper categorisation

Opened 2026-08-20 by the Pre-IB Cowork seat. The thread the 2026-06-09 commission
(`..\BRIEF_pastpaper_categorization.md` §8) told the categorisation chat to open. It was never
opened, because the commission was never picked up.

---

## 2026-08-20 | seat → architecture: commission executed, with three deviations

The Edexcel categorisation work now exists as a project:
`C:\CodexProjects\PaperDatabases\Edexcel Categorisation\`. Read its `README.md` first. The
commission's own copy is preserved at
`Edexcel Categorisation\reference\BRIEF_pastpaper_categorization_2026-06-09.md`.

**What was kept.** The twelve layers, verbatim in intent and mostly in wording
(`reference\LAYERS.md`). The own-folder instruction (d001). The Trilogy model as the starting set
for calculation parts, copied not referenced (d005). The sub-part as the unit of tagging. Crops
over text. Mark-scheme answers plus extra information as the per-mark source of truth. The
`NEW_FLAG` proposal vocabulary.

**Deviation 1: operating model.** The commission specified one chat reading every part by hand and
forbade automation. It has become a packet contract with a Codex worker and a Cowork Architect/QA
seat, because that is what the five sibling categorisation projects converged on in the two months
after the commission was written, and because `MetaProject\PPQ_CATEGORISATION_GUIDE.md` (2026-07-31)
records five contract rules that only bite inside a packet. What survives is the important half:
QA reads parts against mark schemes; it does not accept a return because the totals look right.
Recorded as d002.

**Deviation 2: Layer 9 no longer carries prefixed spec refs.** The commission asked for
`["4SS0:1.17", "4SD0:1.17"]` because scope was going to be judged per part. It does not need to be.
The 4PH1 specification states that statements printed in bold with a `P` reference are Physics-only
and not in the Double Award, and the 4SS0 specification publishes its own shorter list. So scope is
a property of the spec point and it is computed once, on the spine, from the documents: 195 points
in 4PH1, 147 in 4SD0, 95 in 4SS0. A worker writes the bare code `1.17` and never judges scope at
all. Recorded as d004.

This also closes the commission's §2.19 worry. No 4SD0 specification PDF is needed: 4SD0 physics
scope is exactly the non-P subset of 4PH1, stated by Pearson in the 4PH1 document.

**Deviation 3: atoms are a later stream.** Smith asked for the atom registries as a second axis
alongside the spec spine. Registries exist for Topic 7 only, with a Topic 8 mapping alongside;
Topics 1, 2, 5 and 6 have none. Tagging a whole corpus against a vocabulary covering a quarter of
it produces empty columns and tempts a worker to invent atom ids. So Layer 10 runs from the start
at topic and subtag grain, and atoms run as their own packet stream once a topic's registry exists
and is frozen. Recorded as d008.

---

## Things architecture may want to act on

**`NEW_FLAG: spine` — the Topic 7 atom count disagrees with itself.** `topic7_atom_registries.md`
claims 94 atoms and its per-registry table sums to 94 (8 + 30 + 16 + 18 + 6 + 16). Counting `id:`
lines in the six `registry_*.js` files gives 93, with `registry_radiation_safety.js` at 17 against
the claimed 18. Either the document is one ahead of the code or the count method is wrong. It wants
settling before the atom axis treats the registry files as a closed vocabulary, because a
vocabulary that disagrees with its own documentation is the exact condition that produces
force-fitting.

**The spine is available to the Pre-IB project now.** `Edexcel Categorisation\syllabus_spine.csv`
carries all 195 physics spec points with their statements, sub-topic headings, practical flags and
three scope columns. The Pre-IB bank already tags questions with bare spec refs in the same form
(`specRefs: ["7.5"]`), so bank questions and past-paper parts will join on a key that already
exists on both sides. Anyone doing topic scope work (the Forces author's §7 discipline, for
example) can read scope off the spine rather than re-deriving it from the PDFs.

**Two questions for Smith are parked** in `Edexcel Categorisation\OPEN_QUESTIONS.md`: whether the
biology and chemistry corpus is in scope, and whether 4PH1 Paper 2 (Physics-only, out of 4SS0
scope, 23 papers never extracted) goes before or after the physics tagging wave.
