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
     0. Topic configuration (v1.5.2 multi-topic support)
     Each per-topic deployment provides a window.TOPIC_CONFIG before engine.js
     loads. The engine reads vocab, atoms, storageKey, and questionsVar from it.
     If TOPIC_CONFIG is not set (the existing Topic 7 deployment in `new/`),
     the engine falls back to the Topic 7 defaults baked in below. So nothing
     breaks for the existing single-topic deployment.
     ────────────────────────────────────────────────────────────────────────── */

  const TOPIC_CONFIG = (typeof window.TOPIC_CONFIG === "object" && window.TOPIC_CONFIG !== null)
    ? window.TOPIC_CONFIG : {};
  const QUESTIONS_VAR = TOPIC_CONFIG.questionsVar || "PREIB_RAD_QUESTIONS";

  /* ──────────────────────────────────────────────────────────────────────────
     0b. Diagnostic logging (v1.5.8)
     A circular buffer of recent lifecycle events. Each entry has a timestamp
     so the architect can reconstruct the actual sequence when the user
     reports a bug. Persisted to localStorage so refresh doesn't lose it.
     The user can copy the log to clipboard via a Settings button.
     ────────────────────────────────────────────────────────────────────────── */
  const DEBUG_LOG_KEY = "smithics_debug_log";
  const DEBUG_LOG_MAX = 500;
  const DEBUG_LOG = (function () {
    try {
      const raw = localStorage.getItem(DEBUG_LOG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  })();
  function dbg(event, data) {
    DEBUG_LOG.push({ t: Date.now(), event: event, data: data == null ? null : data });
    while (DEBUG_LOG.length > DEBUG_LOG_MAX) DEBUG_LOG.shift();
    // Defer the localStorage write so logging is cheap during hot paths.
    if (!dbg._pending) {
      dbg._pending = true;
      setTimeout(function () {
        try { localStorage.setItem(DEBUG_LOG_KEY, JSON.stringify(DEBUG_LOG)); } catch (e) {}
        dbg._pending = false;
      }, 200);
    }
  }
  dbg("engine.boot", { questionsVar: QUESTIONS_VAR, ua: navigator.userAgent });

  /* ──────────────────────────────────────────────────────────────────────────
     1. Topic vocabulary
     Source of truth: TOPIC_CONFIG.vocab when set; otherwise the Topic 7
     defaults baked in below (mirrors SCHEMA_v0_4.md §6).
     ────────────────────────────────────────────────────────────────────────── */

  const VOCAB = TOPIC_CONFIG.vocab || {
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
          { id: "uses_gamma", name: "Uses of gamma" },
          // 2026-05-08: umbrella subtag hosting the choosing_isotopes_for_uses
          // atom registry (10 applications × 3 attrs). Same name as the
          // registry; mirrors orbit_properties / radiation_types pattern.
          { id: "choosing_isotopes_for_uses", name: "Choose isotope for use" }
        ]
      },
      {
        id: "hazards",
        name: "Hazards",
        subtags: [
          { id: "bio_effects",          name: "Biological effects" },
          { id: "which_most_dangerous", name: "Most dangerous when" },
          { id: "contam_irrad",         name: "Contamination vs irradiation" },
          { id: "waste_disposal",       name: "Waste & precautions" },
          // 2026-05-08: umbrella subtag hosting the radiation_safety_principles
          // atom registry (18 atoms across bio_effects, dose_factors,
          // danger_profile, time_profile).
          { id: "radiation_safety_principles", name: "Safety principles" }
        ]
      },
      {
        id: "nuclear",
        name: "Fission & fusion",
        subtags: [
          { id: "energy_from_nuclear", name: "Nuclear energy" },
          { id: "fission",             name: "Fission" },
          { id: "fusion",              name: "Fusion" },
          { id: "shielding",           name: "Reactor shielding" },
          // 2026-05-08: umbrella subtag hosting the nuclear_processes atom
          // registry (16 atoms across fission, fusion, decay).
          { id: "nuclear_processes",   name: "Nuclear processes" }
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
     v1.5.2: also configurable via TOPIC_CONFIG.atoms.
     ────────────────────────────────────────────────────────────────────────── */

  const ATOMS = TOPIC_CONFIG.atoms || {
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
    ],

    // ──────────────────────────────────────────────────────────────────────
    // halflife — 8 atoms (Topic 7 registry #1).
    // Asymmetric: 3 atoms in external_factors share a verbatim principle.
    // ──────────────────────────────────────────────────────────────────────
    halflife: [
      { id: "halflife_definition",
        name: "Half-life: time for activity / number of unstable nuclei to halve",
        group: "what_it_is", attr: "definition",
        principle: "" },
      { id: "halflife_isotope_specific",
        name: "Each isotope has its own characteristic half-life",
        group: "what_it_is", attr: "characteristic",
        principle: "Each isotope's nucleus has a unique structural stability, so each has its own fixed decay probability per second." },
      { id: "halflife_random_decay",
        name: "Decays are random; half-life is a statistical average over huge numbers of nuclei",
        group: "what_it_is", attr: "statistics",
        principle: "Each unstable nucleus has the same fixed per-second probability of decaying. Statistical averaging over very large populations turns a probabilistic process into a fixed half-life." },
      { id: "halflife_independent_temp",
        name: "Half-life unaffected by temperature",
        group: "what_doesnt_affect_it", attr: "external_factors",
        principle: "Nuclear processes happen in the nucleus; thermal, mechanical, and chemical effects are atomic-orbital-level — different domains, no interaction." },
      { id: "halflife_independent_pressure",
        name: "Half-life unaffected by pressure",
        group: "what_doesnt_affect_it", attr: "external_factors",
        principle: "Nuclear processes happen in the nucleus; thermal, mechanical, and chemical effects are atomic-orbital-level — different domains, no interaction." },
      { id: "halflife_independent_chemical_state",
        name: "Half-life unaffected by chemical state / compound",
        group: "what_doesnt_affect_it", attr: "external_factors",
        principle: "Nuclear processes happen in the nucleus; thermal, mechanical, and chemical effects are atomic-orbital-level — different domains, no interaction." },
      { id: "halflife_after_n_halflives",
        name: "After n half-lives, fraction of original unstable nuclei remaining = (1/2)ⁿ",
        group: "quantitative_behaviour", attr: "decay_curve",
        principle: "Each half-life halves the remaining unstable nuclei; n halvings gives (1/2)ⁿ." },
      { id: "halflife_long_means_low_activity",
        name: "For the same number of nuclei, longer half-life ⇒ lower activity",
        group: "quantitative_behaviour", attr: "activity_relation",
        principle: "Activity is decays per second. Longer half-life means each nucleus has a smaller per-second decay probability, so fewer decays per second from the same population." }
    ],

    // ──────────────────────────────────────────────────────────────────────
    // choosing_isotopes_for_uses — 30 atoms (Topic 7 registry #2).
    // 10 applications × 3 attrs (radiation, key_property, halflife_class).
    // Principle clusters A & B (4 atoms) on long-running applications;
    // C (2 atoms) on tracer escapes body; D (2 atoms, near-shared) on
    // partial absorption for thickness gauges.
    // ──────────────────────────────────────────────────────────────────────
    choosing_isotopes_for_uses: [
      // Smoke alarm (alpha)
      { id: "smoke_alarm_uses_alpha", name: "Smoke alarm uses alpha", group: "smoke_alarm", attr: "radiation",
        principle: "The application needs a radiation that ionises the air gap inside the alarm strongly but cannot escape the casing to harm the user. Alpha is the most ionising and the shortest-range, so it satisfies both." },
      { id: "smoke_alarm_property_short_range_ionising", name: "Why alpha for smoke alarm: highly ionising AND short range", group: "smoke_alarm", attr: "key_property",
        principle: "The alarm needs the radiation to ionise the air gap (so smoke can disrupt the resulting current) AND not escape the casing (so the user is not exposed). Alpha's high ionising power and short range together meet both." },
      { id: "smoke_alarm_halflife_long", name: "Smoke alarm needs long half-life (years)", group: "smoke_alarm", attr: "halflife_class",
        principle: "An installed device must keep working for many years, so the source's activity must remain roughly constant over that time. That requires a half-life much longer than the device's lifetime." },
      // Static eliminator (alpha)
      { id: "static_eliminator_uses_alpha", name: "Static eliminator uses alpha", group: "static_eliminator", attr: "radiation",
        principle: "The application needs a radiation that ionises air strongly in a small region near the moving material. Alpha's high ionising power over a short range delivers that." },
      { id: "static_eliminator_property_ionises_air", name: "Why alpha for static eliminator: ionises nearby air to neutralise charge", group: "static_eliminator", attr: "key_property",
        principle: "Static charge on the material is neutralised by oppositely-charged ions in the surrounding air. Producing those ions requires highly ionising radiation, applied locally." },
      { id: "static_eliminator_halflife_long", name: "Static eliminator needs long half-life (years)", group: "static_eliminator", attr: "halflife_class",
        principle: "An installed device must keep working for many years, so the source's activity must remain roughly constant over that time. That requires a half-life much longer than the device's lifetime." },
      // Spacecraft power / RTG (alpha)
      { id: "spacecraft_power_uses_alpha", name: "Spacecraft power source uses alpha", group: "spacecraft_power", attr: "radiation",
        principle: "The application needs the radiation's energy deposited locally inside a thermoelectric block, with no penetrating radiation escaping to harm the rest of the spacecraft. Alpha's short range and high energy-per-particle deliver concentrated heat without leakage." },
      { id: "spacecraft_power_property_local_heating", name: "Why alpha for spacecraft power: dense, local energy deposition (heat)", group: "spacecraft_power", attr: "key_property",
        principle: "The thermoelectric generator converts heat from radioactive decay into electricity. Heat is energy-per-time deposited locally; alpha's high energy and short range produce concentrated local heating in a small block." },
      { id: "spacecraft_power_halflife_very_long", name: "Spacecraft power needs very long half-life (decades)", group: "spacecraft_power", attr: "halflife_class",
        principle: "Space missions run for decades; the heat output (and so the electrical output) must stay roughly constant for the mission's lifetime. Plutonium-238, with a half-life of 87 years, is the typical choice." },
      // Paper / aluminium foil thickness gauge (beta)
      { id: "paper_foil_gauge_uses_beta", name: "Paper/foil thickness gauge uses beta", group: "paper_foil_gauge", attr: "radiation",
        principle: "A thickness gauge requires the radiation's count rate at the detector to vary with the thickness of the material being measured. For paper or thin foil, only beta is partially absorbed; alpha is fully absorbed, gamma is barely absorbed at all." },
      { id: "paper_foil_gauge_property_partial_absorption", name: "Why beta for paper/foil: partial absorption gives thickness-dependent count rate", group: "paper_foil_gauge", attr: "key_property",
        principle: "A thickness gauge works by detecting the fraction of radiation that passes through the material. That fraction must depend on thickness, which means the absorption must be partial — neither complete (alpha, no signal) nor negligible (gamma, no variation)." },
      { id: "paper_foil_gauge_halflife_long", name: "Paper/foil thickness gauge needs long half-life (years)", group: "paper_foil_gauge", attr: "halflife_class",
        principle: "An industrial gauge runs continuously for years; the count rate at constant thickness must not drift due to source decay. That requires a half-life much longer than the gauge's working lifetime, so calibration stays stable." },
      // Thick steel thickness gauge (gamma)
      { id: "steel_gauge_uses_gamma", name: "Thick steel thickness gauge uses gamma", group: "steel_gauge", attr: "radiation",
        principle: "A thickness gauge requires the radiation's count rate at the detector to vary with the thickness of the material. For thick steel, only gamma is partially absorbed; alpha and beta are both fully absorbed." },
      { id: "steel_gauge_property_partial_absorption", name: "Why gamma for thick steel: partial absorption gives thickness-dependent count rate", group: "steel_gauge", attr: "key_property",
        principle: "A thickness gauge works by detecting the fraction of radiation that passes through the material. That fraction must depend on thickness, which means the absorption must be partial — neither complete (alpha and beta, no signal) nor negligible." },
      { id: "steel_gauge_halflife_long", name: "Thick steel thickness gauge needs long half-life (years)", group: "steel_gauge", attr: "halflife_class",
        principle: "An industrial gauge runs continuously for years; the count rate at constant thickness must not drift due to source decay. That requires a half-life much longer than the gauge's working lifetime, so calibration stays stable." },
      // Medical tracer, injected (gamma)
      { id: "injected_tracer_uses_gamma", name: "Injected medical tracer uses gamma", group: "injected_tracer", attr: "radiation",
        principle: "A tracer's emitted radiation must escape the body to be detected by an external camera. Gamma is highly penetrating; alpha would be absorbed within micrometres of the source, beta within centimetres." },
      { id: "injected_tracer_property_escapes_body", name: "Why gamma for injected tracer: escapes the body to reach external camera", group: "injected_tracer", attr: "key_property",
        principle: "Imaging requires the radiation to leave the body and reach a detector outside it. Tissue is up to tens of cm thick; only gamma penetrates that reliably." },
      { id: "injected_tracer_halflife_short", name: "Injected tracer needs short half-life (hours)", group: "injected_tracer", attr: "halflife_class",
        principle: "The tracer must last long enough to circulate, reach the target tissue, and be imaged, but decay away soon afterwards so the patient does not carry a radioactive source for long. Typically a few hours (technetium-99m: 6 hours)." },
      // Medical tracer, inhaled lung (gamma)
      { id: "inhaled_lung_tracer_uses_gamma", name: "Inhaled lung tracer uses gamma", group: "inhaled_lung_tracer", attr: "radiation",
        principle: "A tracer's emitted radiation must escape the body to be detected by an external camera. Gamma is highly penetrating; alpha would be absorbed within micrometres of the source, beta within centimetres." },
      { id: "inhaled_lung_tracer_property_escapes_body", name: "Why gamma for inhaled lung tracer: escapes lungs to reach external camera", group: "inhaled_lung_tracer", attr: "key_property",
        principle: "Imaging requires the radiation to leave the body and reach a detector outside it. Tissue is up to tens of cm thick; only gamma penetrates that reliably." },
      { id: "inhaled_lung_tracer_halflife_very_short", name: "Inhaled lung tracer needs very short half-life (seconds)", group: "inhaled_lung_tracer", attr: "halflife_class",
        principle: "An inhaled tracer reaches the lungs immediately on breathing in and is imaged on the spot. There is no circulation delay, so the half-life can be much shorter than for an injected tracer; very short is preferred so the patient stops being radioactive within minutes. Krypton-81m: 13 seconds." },
      // Sterilisation (gamma)
      { id: "sterilisation_uses_gamma", name: "Sterilisation uses gamma", group: "sterilisation", attr: "radiation",
        principle: "Equipment is sterilised inside its sealed packaging; the radiation must penetrate cardboard or plastic to reach the contents. Only gamma is penetrating enough; alpha and beta would be stopped by the packaging." },
      { id: "sterilisation_property_penetrates_packaging", name: "Why gamma for sterilisation: penetrates packaging, kills bacteria inside", group: "sterilisation", attr: "key_property",
        principle: "Sterilisation requires the radiation to reach the contents of sealed packaging without the packaging being opened. Penetration through cardboard or plastic packaging is the discriminating property; only gamma has it." },
      { id: "sterilisation_halflife_long", name: "Sterilisation source needs long half-life (years)", group: "sterilisation", attr: "halflife_class",
        principle: "An industrial sterilisation plant runs for years on the same source; the activity must stay roughly constant. Cobalt-60, with a half-life of about 5 years, is the typical choice." },
      // Implanted radiotherapy / brachytherapy (beta)
      { id: "implant_uses_beta", name: "Implanted radiotherapy uses beta", group: "implant", attr: "radiation",
        principle: "An implanted source must deliver dose to the tumour but spare distant healthy tissue. Beta has a moderate range — long enough to reach all the cells of a tumour, short enough that the dose drops off before reaching distant healthy tissue. Alpha would only ionise the immediate surroundings; gamma would carry far past the tumour." },
      { id: "implant_property_local_dose", name: "Why beta for implant: deposits energy locally in and near tumour", group: "implant", attr: "key_property",
        principle: "Implanted radiotherapy requires the dose-vs-distance profile of the radiation to match the size of the tumour: enough range to reach all the cancer cells, but not so much that distant healthy tissue is significantly irradiated." },
      { id: "implant_halflife_medium", name: "Implanted radiotherapy needs medium half-life (weeks to months)", group: "implant", attr: "halflife_class",
        principle: "The implant is left in place; its activity must drop to safe levels on a clinically reasonable timescale. Medium half-life (weeks to months) delivers a useful tumoricidal dose then becomes effectively inert. Iridium-192, half-life 74 days, is a typical choice." },
      // Pipe leak tracer (gamma)
      { id: "pipe_leak_tracer_uses_gamma", name: "Pipe leak tracer uses gamma", group: "pipe_leak_tracer", attr: "radiation",
        principle: "The radiation must travel through soil and pipe wall to reach a detector at ground level. Only gamma is penetrating enough; alpha would not even leave the water, beta would not reach the surface from a buried pipe." },
      { id: "pipe_leak_tracer_property_reaches_surface", name: "Why gamma for pipe leak tracer: reaches surface through soil", group: "pipe_leak_tracer", attr: "key_property",
        principle: "Detection requires the radiation to leave the buried pipe, pass through the surrounding soil and emerge at the surface where a Geiger counter is held. That depth (often a metre or more of soil) requires gamma's high penetrating power." },
      { id: "pipe_leak_tracer_halflife_short", name: "Pipe leak tracer needs short half-life (hours to days)", group: "pipe_leak_tracer", attr: "halflife_class",
        principle: "The tracer enters a public water supply; the half-life must be short enough that radioactivity in the supply decays away rapidly after the leak is found. Sodium-24 (15 hours) is typical." }
    ],

    // ──────────────────────────────────────────────────────────────────────
    // nuclear_processes — 16 atoms (Topic 7 registry #3).
    // 3 groups (fission 7, fusion 6, decay 2). Cross-registry principle
    // share with halflife (decay_random ↔ halflife_random_decay).
    // ──────────────────────────────────────────────────────────────────────
    nuclear_processes: [
      { id: "fission_definition", name: "Fission: a heavy nucleus splits into two smaller nuclei (plus neutrons)", group: "fission", attr: "definition", principle: "" },
      { id: "fission_requires_neutron", name: "Fission is started by a nucleus absorbing a (slow) neutron", group: "fission", attr: "input", principle: "" },
      { id: "fission_fuel_uranium_235", name: "U-235 is the typical fission fuel", group: "fission", attr: "fuel", principle: "" },
      { id: "fission_releases_more_neutrons", name: "Fission releases 2-3 more neutrons (which can trigger further fissions)", group: "fission", attr: "output",
        principle: "Each fission event produces more of the particle that triggers it (the slow neutron). This same property is what allows a chain reaction in a reactor or weapon, but the chain reaction itself is off-spec for 4SS0." },
      { id: "fission_two_daughters", name: "Fission produces two daughter nuclei (typically of unequal size)", group: "fission", attr: "output", principle: "" },
      { id: "fission_daughters_radioactive", name: "Fission daughter nuclei are typically radioactive", group: "fission", attr: "output",
        principle: "Fission daughters inherit a neutron-rich composition from the heavy parent. Stable isotopes of the lighter elements have lower neutron-to-proton ratios, so the daughters are neutron-heavy and decay (typically by beta-emission) towards stability." },
      { id: "fission_energy_released", name: "Fission releases energy, mainly as heat / kinetic energy", group: "fission", attr: "energy",
        principle: "Mass is converted to energy in the nuclear rearrangement. The mass-energy equivalence (E = mc²) is the underlying reason; the same principle drives both fission and fusion energy release." },
      { id: "fusion_definition", name: "Fusion: two small nuclei combine into a larger one", group: "fusion", attr: "definition", principle: "" },
      { id: "fusion_fuel_hydrogen", name: "Hydrogen is the typical fusion fuel (fusing into helium)", group: "fusion", attr: "fuel", principle: "" },
      { id: "fusion_requires_high_temp", name: "Fusion requires very high temperature and pressure", group: "fusion", attr: "conditions",
        principle: "Both nuclei are positively charged and repel each other electrostatically. Overcoming this repulsion close enough for the strong nuclear force to take over requires extreme kinetic energies, achieved by temperatures of millions of degrees." },
      { id: "fusion_in_stars", name: "Fusion happens naturally in the cores of stars (including the Sun)", group: "fusion", attr: "where",
        principle: "Stellar gravity compresses hydrogen until the temperature and pressure at the core are sufficient for fusion. This is currently the only sustained fusion humans observe." },
      { id: "fusion_not_yet_commercial", name: "Fusion is not yet a working commercial energy source on Earth", group: "fusion", attr: "tech_status",
        principle: "Achieving and confining a plasma at fusion conditions is an unsolved engineering problem; existing experimental reactors put in more energy than they extract. The physics is understood; the technology isn't." },
      { id: "fusion_energy_released", name: "Fusion releases energy", group: "fusion", attr: "energy",
        principle: "Mass is converted to energy in the nuclear rearrangement. The mass-energy equivalence (E = mc²) is the underlying reason; the same principle drives both fission and fusion energy release." },
      { id: "fusion_no_radioactive_waste", name: "Fusion produces little to no long-lived radioactive waste (unlike fission)", group: "fusion", attr: "waste", principle: "" },
      { id: "decay_from_nucleus", name: "Alpha, beta and gamma all originate in the nucleus", group: "decay", attr: "source",
        principle: "Alpha and gamma are nuclear emissions by definition. Beta is also a nuclear emission: the electron is created when a neutron changes into a proton inside the nucleus, not flung out from an electron shell." },
      { id: "decay_random", name: "Individual decays are random; the half-life is statistical", group: "decay", attr: "character",
        principle: "Each unstable nucleus has the same fixed per-second probability of decaying. Statistical averaging over very large populations turns a probabilistic process into a fixed half-life." }
    ],

    // ──────────────────────────────────────────────────────────────────────
    // radiation_safety_principles — 18 atoms (Topic 7 registry #4).
    // 4 groups: bio_effects (5), dose_factors (5), danger_profile (6),
    // time_profile (1). The danger_profile sub-group is a 3×2 matrix
    // (radiation × context).
    // ──────────────────────────────────────────────────────────────────────
    radiation_safety_principles: [
      { id: "harm_via_ionisation_dna", name: "Harm mechanism: ionisation breaks bonds, including DNA", group: "bio_effects", attr: "mechanism",
        principle: "Ionising radiation strips electrons from atoms in tissue. Stripped atoms re-bond differently or fail to bond at all, breaking the molecules they were part of. DNA is the molecule whose specific bonds matter most for the cell's behaviour." },
      { id: "harm_kills_or_mutates_cells", name: "DNA damage can kill cells or leave mutations (which may become cancer)", group: "bio_effects", attr: "outcome",
        principle: "A cell with severely damaged DNA either fails to function and dies, or repairs the damage, or survives with a mutation. The mutation may have no effect, or may cause the cell to multiply abnormally — cancer." },
      { id: "short_term_effects", name: "Short-term effects of high dose: radiation sickness, burns, hair loss", group: "bio_effects", attr: "effect_timescale", principle: "" },
      { id: "long_term_effects", name: "Long-term effects: cancer, inherited mutations", group: "bio_effects", attr: "effect_timescale", principle: "" },
      { id: "dividing_cells_more_sensitive", name: "Rapidly-dividing cells (hair, gut lining, bone marrow) are most sensitive", group: "bio_effects", attr: "sensitivity",
        principle: "Cell division requires intact DNA to copy. Cells that divide frequently are caught mid-cycle most often, so DNA damage stops them being replaced. Tissues that depend on continuous replacement (hair, gut lining, blood-cell production from marrow) show the loss first." },
      { id: "dose_depends_on_time", name: "Dose increases with time of exposure", group: "dose_factors", attr: "factor",
        principle: "Dose is total energy absorbed; time exposed is proportional to total decays that can reach the tissue. Halving the time roughly halves the dose." },
      { id: "dose_depends_on_distance", name: "Dose decreases with distance from source", group: "dose_factors", attr: "factor",
        principle: "Radiation spreads in all directions from a point source; the fraction reaching a fixed area falls with distance. For penetrating radiation in vacuum the relationship is the inverse-square law; for alpha and beta in air, absorption cuts the dose to essentially zero within metres." },
      { id: "dose_depends_on_shielding", name: "Dose decreases with shielding between source and person", group: "dose_factors", attr: "factor",
        principle: "Shielding absorbs the radiation before it reaches tissue. The thickness and material needed depend on which radiation type — paper for alpha, aluminium for beta, lead/concrete for gamma." },
      { id: "dose_depends_on_activity", name: "Dose increases with source activity", group: "dose_factors", attr: "factor",
        principle: "Activity is decays per second; more decays produce more particles per second to reach tissue. Doubling activity roughly doubles dose." },
      { id: "dose_depends_on_radiation_type", name: "Dose varies by radiation type (different ionising power, different range)", group: "dose_factors", attr: "factor",
        principle: "Per same activity, different radiations deposit different amounts of energy in tissue. Alpha is highly ionising and short-range, depositing all its energy locally; gamma is weakly ionising and long-range, depositing only a fraction. So 'same activity' does not mean 'same dose'." },
      { id: "external_alpha_low_risk", name: "External α: low risk (absorbed in cm of air; doesn't reach living tissue at distance)", group: "danger_profile", attr: "external",
        principle: "Alpha is absorbed by a few centimetres of air, so essentially none reaches a person at arm's length. Alpha's high ionising power makes it dangerous when it does reach tissue, but for an external sealed source at any reasonable distance, it doesn't." },
      { id: "external_beta_intermediate", name: "External β: intermediate risk (absorbed by ~1 m of air; partially reaches tissue at short range)", group: "danger_profile", attr: "external",
        principle: "Beta is absorbed by about a metre of air or a few mm of aluminium. At close range some reaches the skin; at greater distances or with thin shielding most is absorbed." },
      { id: "external_gamma_high_risk", name: "External γ: high risk (highly penetrating; reaches tissue from several metres)", group: "danger_profile", attr: "external",
        principle: "Gamma penetrates air, clothing, and skin essentially unattenuated. It is the only radiation that reaches the body in significant amounts from a few metres away with the source unshielded." },
      { id: "internal_alpha_high_risk", name: "Internal α: high risk (highly ionising; deposits all energy in nearby tissue)", group: "danger_profile", attr: "internal",
        principle: "Once alpha is inside the body (inhaled, ingested, or in a wound) it ionises tissue intensely over its short range. There is no skin barrier and no air absorption to mitigate the dose; all the alpha's energy is deposited in cells immediately around the source." },
      { id: "internal_beta_intermediate", name: "Internal β: intermediate risk (some energy deposited locally, some escapes the body)", group: "danger_profile", attr: "internal",
        principle: "Beta inside the body has moderate range; some of its energy is deposited in nearby tissue, some escapes the body with the particle. Less concentrated damage than alpha, but more reach." },
      { id: "internal_gamma_low_risk", name: "Internal γ: low (relative) risk (passes through tissue, depositing only a fraction)", group: "danger_profile", attr: "internal",
        principle: "Gamma's low ionising power and high penetration means most of it passes through the body without depositing energy. The fraction that is absorbed is spread over a large volume of tissue, so the dose-per-cell is low. Still harmful — but less so than alpha or beta at the same activity inside." },
      { id: "long_halflife_long_danger", name: "Long half-life ⇒ source remains hazardous for a long time", group: "time_profile", attr: "persistence",
        principle: "Half-life is the time for activity to halve. Long half-life means activity stays high for many years; the source therefore keeps emitting ionising radiation for years and remains a hazard." }
    ],

    // ──────────────────────────────────────────────────────────────────────
    // contam_irrad — 6 atoms (Topic 7 registry #5).
    // Symmetric 2×3 (process × aspect): irradiation × {definition, consequence,
    // persistence}; contamination × {definition, persistence, type}.
    // ──────────────────────────────────────────────────────────────────────
    contam_irrad: [
      { id: "irradiation_definition", name: "Irradiation: exposure to ionising radiation from an external source", group: "irradiation", attr: "definition", principle: "" },
      { id: "irradiation_no_material_transfer", name: "Irradiation does NOT transfer radioactive material; the irradiated object does not become radioactive", group: "irradiation", attr: "consequence",
        principle: "Ionising radiation is energy (or fast particles), not the radioactive substance itself. Energy passes through the object; no atoms of the source remain on or in it." },
      { id: "irradiation_stops_when_away", name: "Irradiation stops when the person leaves the source's reach", group: "irradiation", attr: "persistence",
        principle: "Irradiation requires the radiation to be reaching the person. With no source nearby, no radiation arrives, so the irradiation ends." },
      { id: "contamination_definition", name: "Contamination: radioactive material on or in a non-radioactive object", group: "contamination", attr: "definition", principle: "" },
      { id: "contamination_persists_with_object", name: "Contamination persists: the radioactive material stays with the contaminated object/person", group: "contamination", attr: "persistence",
        principle: "Contamination is a physical transfer of radioactive atoms. Wherever the contaminated object goes, those atoms go too, and they continue to emit radiation until they decay or are removed." },
      { id: "contamination_internal_or_external", name: "Contamination can be on the body (skin) or inside it (inhaled/swallowed/in a wound)", group: "contamination", attr: "type",
        principle: "Contamination is a physical transfer; the destination depends on how the transfer happened. Skin contact deposits material on the body; inhalation or ingestion places it inside, where it irradiates internal tissue with no skin barrier." }
    ],

    // ──────────────────────────────────────────────────────────────────────
    // atomic_struct — 16 atoms (Topic 7 registry #6).
    // 4 groups (particle_properties 5, atom_structure 5, isotopes 4, units 2).
    // CROSS-REGISTRY shared principle: isotopes_chemically_identical shares
    // the verbatim principle string with the three halflife independence atoms
    // — the largest cross-registry cluster (4 atoms, "nuclear processes are
    // decoupled from atomic-orbital processes"). Canonical test case for
    // v0.7+ principle-hierarchy tooling.
    // ──────────────────────────────────────────────────────────────────────
    atomic_struct: [
      { id: "proton_charge_pos1", name: "Proton charge: +1 (relative)", group: "particle_properties", attr: "charge", principle: "" },
      { id: "neutron_charge_zero", name: "Neutron charge: 0", group: "particle_properties", attr: "charge", principle: "" },
      { id: "electron_charge_neg1", name: "Electron charge: −1 (relative)", group: "particle_properties", attr: "charge", principle: "" },
      { id: "proton_neutron_similar_mass", name: "Proton and neutron have similar mass (relative mass ≈ 1)", group: "particle_properties", attr: "mass", principle: "" },
      { id: "electron_negligible_mass", name: "Electron mass is negligible compared to proton/neutron (~1/2000)", group: "particle_properties", attr: "mass", principle: "" },
      { id: "nucleus_contains_protons_neutrons", name: "Nucleus contains protons and neutrons", group: "atom_structure", attr: "location", principle: "" },
      { id: "electrons_in_shells", name: "Electrons orbit the nucleus in shells", group: "atom_structure", attr: "location", principle: "" },
      { id: "atom_mostly_empty_space", name: "Atom is mostly empty space (nucleus is tiny relative to atom)", group: "atom_structure", attr: "scale",
        principle: "The nucleus is about 10⁻¹⁵ m across; the atom is about 10⁻¹⁰ m across. The nucleus occupies less than a trillionth of the atom's volume." },
      { id: "mass_concentrated_in_nucleus", name: "Most of an atom's mass is in the nucleus", group: "atom_structure", attr: "mass_distribution",
        principle: "The nucleus contains the heavy particles (protons and neutrons), while electrons in the shells contribute almost no mass." },
      { id: "atom_neutral_equal_p_and_e", name: "An atom has equal numbers of protons and electrons (overall charge zero)", group: "atom_structure", attr: "neutrality",
        principle: "The proton and electron charges are equal in magnitude and opposite in sign. With equal numbers of each, the total charge cancels exactly." },
      { id: "isotope_definition", name: "Isotopes of an element have the same number of protons but different numbers of neutrons", group: "isotopes", attr: "definition", principle: "" },
      { id: "isotopes_chemically_identical", name: "Isotopes of an element behave identically in chemical reactions", group: "isotopes", attr: "chemistry",
        principle: "Nuclear processes happen in the nucleus; thermal, mechanical, and chemical effects are atomic-orbital-level — different domains, no interaction." },
      { id: "chemistry_determined_by_electrons", name: "Chemical behaviour is determined by an atom's electrons", group: "isotopes", attr: "mechanism",
        principle: "Chemical bonding involves the rearrangement of valence electrons between atoms. Two atoms with the same electron configuration must therefore react the same way, regardless of nuclear differences." },
      { id: "nuclide_notation_AZX", name: "Nuclide notation: ᴬZX where A = mass number (p+n) and Z = atomic number (p)", group: "isotopes", attr: "notation", principle: "" },
      { id: "bq_unit_of_activity", name: "Becquerel (Bq) is the unit of activity of a radioactive source", group: "units", attr: "unit", principle: "" },
      { id: "bq_one_decay_per_second", name: "1 Bq = 1 nuclear decay per second", group: "units", attr: "definition", principle: "" }
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

  function subtagHasDesignedAtoms(subtag) {
    return Array.isArray(ATOMS[subtag]) && ATOMS[subtag].length > 0;
  }
  // v1.5.3: every subtag with active questions is treated as atomised. If a
  // designed atom registry exists (e.g. radiation_types), the mosaic uses
  // that bespoke layout. Otherwise it auto-atomises: each question in the
  // subtag becomes one cell. This addresses the user's "size of the group
  // must reflect the concepts underneath" feedback for topics that don't
  // yet have a designed registry (Topic 8 etc).
  function subtagIsAtomised(subtag) {
    if (subtagHasDesignedAtoms(subtag)) return true;
    return (SUBTAG_COUNTS[subtag] || 0) > 0;
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
    // pairings is { leftIdx: chosenRightIdx } where leftIdx indexes into
    // q.pairs and chosenRightIdx indexes into the displayed right column
    // (which contains pairs[*].right values plus rightExtras).
    //
    // v1.5.3: marker now compares by right TEXT value, not by canonical index.
    // This means non-injective matchings work correctly: if two pairs share
    // the same right text (e.g. "Planet → a star" and "Comet → a star"),
    // pairing either left with any "a star" tile scores. Without this fix,
    // identical-right pairings could only score one of the matches no matter
    // what the student picked.
    const pairs = Array.isArray(q.pairs) ? q.pairs : [];
    const extras = Array.isArray(q.rightExtras) ? q.rightExtras : [];
    const possible = q.marks || pairs.length || 1;

    function rightTextAt(idx) {
      if (idx == null) return null;
      if (idx < pairs.length) return pairs[idx].right;
      const ei = idx - pairs.length;
      return (ei >= 0 && ei < extras.length) ? extras[ei] : null;
    }

    let awarded = 0;
    if (pairings && typeof pairings === "object") {
      pairs.forEach(function (pair, i) {
        const userText = rightTextAt(pairings[i]);
        if (userText != null && userText === pair.right) awarded++;
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

  const STORAGE_KEY = TOPIC_CONFIG.storageKey || "smithics_topic7_v1";
  const APP_VERSION = "v1.5.20";

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

  // v1.5.5: filter is now {type, id}. Migrate older string filters.
  function migrateFilter(raw) {
    if (typeof raw === "string" && raw) return { type: "subtag", id: raw };
    if (raw && typeof raw === "object" && raw.type && raw.id) return raw;
    return null;
  }

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
        activeFilter: migrateFilter(parsed.activeFilter),
        lastSeen: parsed.lastSeen || null,
        version: parsed.version || APP_VERSION,
        excludedTypes: excludedTypes,
        coverageWindow: coverageWindow,
        // v1.5.7: shuffle-deck state. Both nullable; lazy-built on first pick.
        deck: (parsed.deck && Array.isArray(parsed.deck.ids)) ? parsed.deck : null,
        questionState: (parsed.questionState && typeof parsed.questionState === "object") ? parsed.questionState : {}
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
      coverageWindow: 2,
      // v1.5.7: shuffle-deck state. Lazy-built on first pickNextQuestion.
      deck: null,
      questionState: {}
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
    updateSkipForQuestion(rec.questionId);
    persist();
  }

  // v1.5.7: streak is computed fresh from attempt history (so adjustMark
  // automatically reflects in the streak). skipRemaining is stored.
  function computeStreakForQuestion(qid) {
    let streak = 0;
    for (let i = store.attempts.length - 1; i >= 0; i--) {
      const a = store.attempts[i];
      if (a.questionId !== qid) continue;
      if (a.status === "full") streak++;
      else break;
    }
    return streak;
  }

  function updateSkipForQuestion(qid) {
    if (!store.questionState) store.questionState = {};
    if (!store.questionState[qid]) store.questionState[qid] = { skipRemaining: 0 };
    const streak = computeStreakForQuestion(qid);
    // 2 in a row → skip 1 pass; 3 → skip 2; 4 → skip 3; etc.
    store.questionState[qid].skipRemaining = (streak >= 2) ? (streak - 1) : 0;
  }

  function clearProgress() {
    store = defaultStore();
    persist();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     5. Question bank: load and index
     ────────────────────────────────────────────────────────────────────────── */

  const ALL_QUESTIONS = Array.isArray(window[QUESTIONS_VAR]) ? window[QUESTIONS_VAR] : [];

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
  // v1.5.5: filter is now an object {type: "group"|"subtag"|"question", id: ...}
  // or null for "show all". poolForFilter handles all three. A legacy string
  // value (a bare subtag id) is treated as {type:"subtag", id:string}.
  function poolForFilter(filterSpec) {
    let pool = ALL_QUESTIONS.filter(function (q) { return q.parked !== true; });

    const f = (typeof filterSpec === "string") ? { type: "subtag", id: filterSpec } : filterSpec;
    if (f && f.type && f.id) {
      if (f.type === "group") {
        // Multi-subtag OR filter: any question whose tags include any subtag
        // belonging to this group.
        const grp = VOCAB.parentGroups.find(function (g) { return g.id === f.id; });
        const subtagIds = grp ? grp.subtags.map(function (st) { return st.id; }) : [];
        pool = pool.filter(function (q) {
          if (!Array.isArray(q.tags)) return false;
          return q.tags.some(function (t) { return subtagIds.indexOf(t) !== -1; });
        });
      } else if (f.type === "subtag") {
        pool = pool.filter(function (q) {
          return Array.isArray(q.tags) && q.tags.indexOf(f.id) !== -1;
        });
      } else if (f.type === "question") {
        pool = pool.filter(function (q) { return q.id === f.id; });
      }
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
  // v1.5.7: shuffle-deck question selection with streak-based exclusion.
  // The pool is dealt out as a shuffled deck; cursor advances per pick.
  // When the deck exhausts, a new pass begins: skipRemaining decrements for
  // every question, then the next deck is built from those whose
  // skipRemaining is now 0. Questions with skipRemaining > 0 sit out this
  // pass. Streak grows only on full-marks attempts; wrong/partial resets it.
  // Filter or type-exclusion change rebuilds the deck (decrement applies),
  // so toggling filters effectively advances the pass counter.

  function poolSignature(pool) {
    return pool.map(function (q) { return q.id; }).sort().join("|");
  }

  function buildDeck(pool) {
    if (!store.questionState) store.questionState = {};
    const qstate = store.questionState;

    // Decrement skipRemaining for every question that has any (this is
    // "starting a new pass"). Only decrement, don't grow.
    Object.keys(qstate).forEach(function (qid) {
      if (qstate[qid].skipRemaining > 0) qstate[qid].skipRemaining--;
    });

    const ids = [];
    pool.forEach(function (q) {
      if (!qstate[q.id]) qstate[q.id] = { skipRemaining: 0 };
      if (qstate[q.id].skipRemaining > 0) {
        // Sit out this pass.
      } else {
        ids.push(q.id);
      }
    });

    shuffleInPlace(ids);

    const newSig = poolSignature(pool);
    const newPass = (store.deck && store.deck.signature === newSig)
      ? (store.deck.pass || 1) + 1
      : 1;

    return { ids: ids, cursor: 0, signature: newSig, pass: newPass };
  }

  function pickNextQuestion(filter) {
    const pool = poolForFilter(filter);
    if (pool.length === 0) return null;
    const sig = poolSignature(pool);

    // Build or rebuild the deck if the pool changed or the deck is exhausted.
    if (!store.deck || store.deck.signature !== sig || store.deck.cursor >= store.deck.ids.length) {
      store.deck = buildDeck(pool);
      // Fallback: every question is currently on cooldown → force-include all
      // so the student isn't left with nothing to do.
      if (store.deck.ids.length === 0) {
        store.deck.ids = pool.map(function (q) { return q.id; });
        shuffleInPlace(store.deck.ids);
      }
      persist();
    }

    const qid = store.deck.ids[store.deck.cursor];
    store.deck.cursor++;
    persist();

    const q = pool.find(function (qq) { return qq.id === qid; });
    if (!q) {
      // Question vanished from pool between deck-build and now (parking?).
      // Recurse to find a valid one. Capped recursion via deck length.
      return pickNextQuestion(filter);
    }
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
    return coverageFromMatches(function (a) {
      return Array.isArray(a.atoms) && a.atoms.indexOf(atomId) !== -1;
    });
  }

  // v1.5.3: same shape as coverageForAtom but matches by questionId. Used for
  // auto-atomised subtags where each question stands as its own atom-cell.
  function coverageForQuestion(qId) {
    return coverageFromMatches(function (a) {
      return a.questionId === qId;
    });
  }

  // Shared coverage-band computation. Walks store.attempts newest-first, picks
  // up to coverageWindow matches via predicate, returns { attemptCount, avg,
  // fill, text, textSoft } the same way as coverageForSubtag.
  function coverageFromMatches(predicate) {
    const matched = [];
    const win = (typeof store.coverageWindow === "number" && store.coverageWindow > 0) ? store.coverageWindow : 2;
    for (let i = store.attempts.length - 1; i >= 0; i--) {
      const a = store.attempts[i];
      if (predicate(a)) {
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
      // Split on $...$ math blocks. v1.5.12: render with KaTeX when the
      // library is loaded (via CDN in index.html); fall back to the code-style
      // monospace span if it isn't available yet.
      const parts = line.split(/(\$[^$]+\$)/);
      parts.forEach(function (p) {
        if (p.length >= 2 && p.charAt(0) === "$" && p.charAt(p.length - 1) === "$") {
          const math = p.substring(1, p.length - 1);
          if (typeof window.katex !== "undefined" && window.katex.render) {
            const span = document.createElement("span");
            span.className = "prompt-katex";
            try {
              window.katex.render(math, span, { throwOnError: false, displayMode: false });
            } catch (err) {
              span.textContent = math;
              span.className = "prompt-math";
            }
            container.appendChild(span);
          } else {
            container.appendChild(el("code", { class: "prompt-math" }, math));
          }
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

  // ── Module-scope state for the "Enter advances to next question" arm.
  //
  // History: this lived as a closure inside showFeedback(). That worked when
  // every question boundary went through Enter (which removed the listener
  // itself on fire). But if the user clicked Next manually with a mouse, the
  // listener was never removed — it lingered, and the next time the user
  // pressed Enter on a non-text question (multiselect, matching, ordering,
  // categorise, grid, fillblank) the lingering arm consumed the keypress
  // instead of letting the question's own Enter-to-submit path run. Result:
  // user's answer was never submitted, no feedback shown, deck advanced
  // silently. v1.5.17 promotes the arm to module scope so renderQuestion()
  // can reliably tear it down at the start of every question.
  let _armOnEnter = null;        // the actual keydown handler (or null)
  let _armOnKeyup = null;        // the keyup-to-arm listener (or null)
  let _armTimerId = 0;           // setTimeout id for the 300ms fallback
  let _armedAt = 0;              // timestamp when the keydown listener went live

  function disarmNextOnEnter() {
    // Remove every lingering listener and clear the fallback timer. Idempotent:
    // safe to call from anywhere, any number of times.
    if (_armOnEnter) {
      document.removeEventListener("keydown", _armOnEnter);
      _armOnEnter = null;
    }
    if (_armOnKeyup) {
      document.removeEventListener("keyup", _armOnKeyup);
      _armOnKeyup = null;
    }
    if (_armTimerId) {
      clearTimeout(_armTimerId);
      _armTimerId = 0;
    }
    _armedAt = 0;
  }

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

    // v1.5.6: track selection on both sides so pairing works in either order
    // (left-then-right or right-then-left).
    const state = { selectedLeft: null, selectedRight: null, pairings: {} };

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
      if (state.selectedRight != null && rightItems[state.selectedRight]) {
        rightItems[state.selectedRight].classList.add("is-selected");
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

    function clearRightForLeft(leftIdx) {
      // No-op helper for symmetry: removing the entry by leftIdx already does it.
      delete state.pairings[leftIdx];
    }
    function clearAllUsesOfRight(canIdx) {
      Object.keys(state.pairings).forEach(function (k) {
        if (state.pairings[k] === canIdx) delete state.pairings[k];
      });
    }

    pairs.forEach(function (p, i) {
      const item = el("li", {
        class: "match-item match-left-item",
        "data-idx": String(i),
        onClick: function () {
          // 1. If this left is already paired, unpair it and clear selection.
          if (state.pairings[i] != null) {
            clearRightForLeft(i);
            state.selectedLeft = null;
            state.selectedRight = null;
            refresh();
            return;
          }
          // 2. If a right is currently selected, complete the pair.
          if (state.selectedRight != null) {
            clearAllUsesOfRight(state.selectedRight);
            state.pairings[i] = state.selectedRight;
            state.selectedLeft = null;
            state.selectedRight = null;
            refresh();
            return;
          }
          // 3. Otherwise toggle this left's selection.
          state.selectedLeft = (state.selectedLeft === i) ? null : i;
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
          // 1. If this right is already paired with some left, unpair.
          const pairedLeft = Object.keys(state.pairings).find(function (k) {
            return state.pairings[k] === canIdx;
          });
          if (pairedLeft != null) {
            delete state.pairings[pairedLeft];
            state.selectedLeft = null;
            state.selectedRight = null;
            refresh();
            return;
          }
          // 2. If a left is currently selected, complete the pair.
          if (state.selectedLeft != null) {
            clearAllUsesOfRight(canIdx);
            state.pairings[state.selectedLeft] = canIdx;
            state.selectedLeft = null;
            state.selectedRight = null;
            refresh();
            return;
          }
          // 3. Otherwise toggle this right's selection.
          state.selectedRight = (state.selectedRight === canIdx) ? null : canIdx;
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
    // v1.5.11: shuffle the displayed order so correct answers don't sit in a
    // learnable position. Map back to original index on submit. Opt out per
    // question with shuffleChoices: false.
    const order = choices.map(function (_, i) { return i; });
    if (v.shuffleChoices !== false) shuffleInPlace(order);
    const list = el("div", { class: "multiselect" });
    const inputs = []; // each: { cb, origIdx }
    order.forEach(function (origIdx) {
      const text = choices[origIdx];
      const cb = el("input", {
        type: "checkbox",
        class: "ms-cb",
        id: "ms-cb-" + origIdx,
        "data-orig-idx": String(origIdx)
      });
      const row = el("label", { class: "ms-row", for: "ms-cb-" + origIdx }, [
        cb,
        el("span", { class: "ms-text", text: text })
      ]);
      list.appendChild(row);
      inputs.push({ cb: cb, origIdx: origIdx });
    });
    inputWrap.appendChild(list);

    inputWrap.appendChild(el("button", {
      class: "btn btn-primary submit-btn",
      type: "button",
      onClick: function () {
        const checked = [];
        inputs.forEach(function (entry) { if (entry.cb.checked) checked.push(entry.origIdx); });
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

    function refresh(movedOriginalIdx) {
      // v1.5.4: animate position changes so the user sees what moved. The
      // arrows are far from the text on wide rows, so without animation the
      // change is easy to miss. Uses FLIP: capture old positions, mutate
      // the DOM, capture new positions, apply an inverse transform, then
      // transition that transform back to zero so the row visibly slides.
      const oldTops = {};
      rows.forEach(function (row) {
        const oid = row.getAttribute("data-original-idx");
        if (oid != null) oldTops[oid] = row.getBoundingClientRect().top;
      });

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
            refresh(originalIdx);
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
            refresh(originalIdx);
          },
          text: "▼"
        });
        downBtn.disabled = (position === currentOrder.length - 1);
        const row = el("li", {
          class: "ord-row",
          "data-original-idx": String(originalIdx)
        }, [
          el("span", { class: "ord-num", text: String(position + 1) }),
          el("span", { class: "ord-text", text: items[originalIdx] }),
          el("span", { class: "ord-controls" }, [upBtn, downBtn])
        ]);
        list.appendChild(row);
        rows.push(row);
      });

      // FLIP step: animate any row whose top has changed since the last
      // refresh. Skip on the very first render (oldTops is empty).
      rows.forEach(function (row) {
        const oid = row.getAttribute("data-original-idx");
        const oldTop = oldTops[oid];
        if (oldTop == null) return;
        const newTop = row.getBoundingClientRect().top;
        const dy = oldTop - newTop;
        if (Math.abs(dy) < 1) return;
        row.style.transform = "translateY(" + dy + "px)";
        row.style.transition = "none";
        // Force a reflow so the browser registers the starting transform.
        void row.offsetHeight;
        row.style.transition = "transform 0.35s ease-out";
        row.style.transform = "";
        // Highlight the row the user just moved (vs the ones that shifted
        // around it) with a brief cool-blue wash. Comes from CSS.
        if (oid === String(movedOriginalIdx)) {
          row.classList.add("ord-row-flashed");
          setTimeout(function () { row.classList.remove("ord-row-flashed"); }, 900);
        }
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

    // v1.5.7: HTML5 drag-and-drop for desktop alongside the existing tap-to-
    // select interaction (which still works for touch). On drag of an item,
    // store its index in dataTransfer; bins and the strip both accept drops.
    function attachDragSource(el, itemIdx) {
      el.setAttribute("draggable", "true");
      el.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", String(itemIdx));
        e.dataTransfer.effectAllowed = "move";
        el.classList.add("cat-item-dragging");
      });
      el.addEventListener("dragend", function () {
        el.classList.remove("cat-item-dragging");
      });
    }
    function attachDropTarget(target, onDropItem) {
      target.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        target.classList.add("cat-drop-hover");
      });
      target.addEventListener("dragleave", function () {
        target.classList.remove("cat-drop-hover");
      });
      target.addEventListener("drop", function (e) {
        e.preventDefault();
        target.classList.remove("cat-drop-hover");
        const raw = e.dataTransfer.getData("text/plain");
        const itemIdx = parseInt(raw, 10);
        if (isNaN(itemIdx)) return;
        onDropItem(itemIdx);
      });
    }

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
        attachDragSource(it, i);
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
          // v1.5.6: placed item is a div (not a button) with an explicit ×
          // button to remove. Clicking the body of the placed item does
          // nothing (specifically: doesn't bubble up to the bin's place
          // handler, and doesn't remove). The × button removes.
          const removeBtn = el("button", {
            class: "cat-item-remove",
            type: "button",
            title: "Remove from bin",
            "aria-label": "Remove from bin",
            onClick: function (e) {
              e.stopPropagation();
              delete state.placements[i];
              refresh();
            },
            text: "×"
          });
          const placedItem = el("div", {
            class: "cat-item is-placed",
            "data-idx": String(i),
            onClick: function (e) {
              // Swallow the click so it doesn't reach the bin and trigger a
              // re-place of whatever is currently selected.
              e.stopPropagation();
            }
          }, [
            el("span", { class: "cat-item-text", text: item.text }),
            removeBtn
          ]);
          attachDragSource(placedItem, i);
          placedList.appendChild(placedItem);
        });
        binWrap.appendChild(placedList);
      });
    }

    wrap.appendChild(strip);
    // The strip is also a drop target — drop a placed item back onto the
    // strip to remove it from its bin.
    attachDropTarget(strip, function (itemIdx) {
      delete state.placements[itemIdx];
      state.selectedItem = null;
      refresh();
    });
    const binsWrap = el("div", { class: "cat-bins" });
    bins.forEach(function (binId) {
      const binWrap = el("div", {
        class: "cat-bin",
        "data-bin": binId,
        onClick: function () {
          // Bin clicks place the currently-selected item. Clicks on a placed
          // item don't reach here (the placed item's handler stops them).
          if (state.selectedItem != null) {
            state.placements[state.selectedItem] = binId;
            state.selectedItem = null;
            refresh();
          }
        }
      });
      attachDropTarget(binWrap, function (itemIdx) {
        state.placements[itemIdx] = binId;
        state.selectedItem = null;
        refresh();
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
    dbg("renderQuestion.start");
    // v1.5.17: tear down any lingering Enter-to-Next arm BEFORE we render.
    // If the previous question's feedback armed Enter and the user clicked
    // Next manually (not via Enter), the listener used to outlive the
    // question boundary and would eat the user's first Enter on the new
    // question. See bug report 2026-05-07.
    disarmNextOnEnter();
    dbg("disarm.onRenderQuestion");
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

    // v1.5.10: a question-level filter has only one item in its pool. After
    // the user answers it, redelivering the same question is annoying — show
    // a "you've done this one" message instead and tell them how to move on.
    const lastAttempt = store.attempts.length > 0 ? store.attempts[store.attempts.length - 1] : null;
    if (filterSub && filterSub.type === "question" && lastAttempt && lastAttempt.questionId === filterSub.id) {
      phase = "answering";
      current = null;
      card.classList.add("empty");
      card.appendChild(el("div", { class: "qcard-empty" }, [
        el("div", { class: "qcard-empty-h", text: "You've answered this question." }),
        el("div", { class: "qcard-empty-p", text: "Click another cell or tile in the coverage map to move on, or use \"Show all\" to broaden the pool." })
      ]));
      return;
    }

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
      // v1.5.11: shuffle MCQ choices on each delivery so the correct answer
      // doesn't sit in a learnable position. The user clicks a tile in the
      // shuffled order; we map back to the original index via origIdx so
      // answerIndex and distractorRationales (both keyed by original index)
      // still work. Authors can opt out per question with shuffleChoices: false.
      // v1.5.13: each choice gets a small leading number badge (1, 2, 3, ...)
      // and the digit keys 1-9 act as shortcuts (handled by a global keydown
      // listener wired in init).
      const rawChoices = v.choices || [];
      const order = rawChoices.map(function (_, i) { return i; });
      if (v.shuffleChoices !== false) shuffleInPlace(order);
      const choices = el("div", { class: "qchoices" });
      order.forEach(function (origIdx, displayIdx) {
        const choice = rawChoices[origIdx];
        const btn = el("button", {
          class: "choice",
          type: "button",
          "data-orig-i": String(origIdx),
          onClick: (function (idx) {
            return function () { submitMCQ(idx); };
          })(origIdx)
        }, [
          el("span", { class: "choice-key", text: String(displayIdx + 1) }),
          el("span", { class: "choice-text", text: choice })
        ]);
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
        if (e.key === "Enter") {
          dbg("input.keydown.long", { repeat: e.repeat, ctrl: e.ctrlKey, meta: e.metaKey });
          if (e.ctrlKey || e.metaKey) { e.preventDefault(); submitText(); }
        }
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
        if (e.key === "Enter") {
          dbg("input.keydown.numeric", { repeat: e.repeat, value: inp.value });
          e.preventDefault();
          submitText();
        }
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
        if (e.key === "Enter") {
          dbg("input.keydown.short", { repeat: e.repeat, value: inp.value });
          e.preventDefault();
          submitText();
        }
      });
      setTimeout(function () { inp.focus(); }, 30);
    }
    card.appendChild(inputWrap);
  }

  // -- Submission handlers --
  function submitMCQ(chosenIndex) {
    dbg("submitMCQ", { phase: phase, chosenIndex: chosenIndex, qid: current && current.question && current.question.id });
    if (phase !== "answering") { dbg("submitMCQ.guard.phase"); return; }
    const v = current.view;
    const result = markMCQ(v, chosenIndex);
    showFeedback(result, { rawResponse: null, chosenIndex: chosenIndex });
  }

  function submitText() {
    dbg("submitText", { phase: phase, qid: current && current.question && current.question.id, type: current && current.view && current.view.type });
    if (phase !== "answering") { dbg("submitText.guard.phase"); return; }
    const v = current.view;
    const inp = document.getElementById("ans-input");
    if (!inp) { dbg("submitText.guard.noinput"); return; }
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
    // v1.5.7: re-derive skip state for this question from the now-updated
    // attempts. If the user upgraded a partial to full, the streak grows;
    // if they downgraded, it resets.
    if (attempt.questionId) updateSkipForQuestion(attempt.questionId);
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
    dbg("showFeedback.start", { qid: current && current.question && current.question.id, status: result && result.status, awarded: result && result.marksAwarded, possible: result && result.marksPossible });
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
    if ((v.type === "short" || v.type === "long" || v.type === "fillblank") && v.allowAdjust !== false) {
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
      onClick: function (e) {
        dbg("nextBtn.click", { trusted: !!(e && e.isTrusted) });
        renderQuestion(); renderCoverage(); updateProgressLine();
      },
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
    // same Enter that submitted didn't also advance. v1.4.3 added e.repeat +
    // 200ms grace for held-Enter cases. v1.5.3 added the keyup-arm pattern
    // so a still-held Enter fully releases before the listener arms. v1.5.17
    // promotes all this state to module scope and adds disarm-on-renderQ +
    // a phase guard, fixing the case where a manual mouse-click on Next left
    // a lingering keydown listener that ate Enter on the next question.
    //
    // Defence in depth: disarm anything left from a previous arm before we
    // arm a new one. (Should be a no-op; renderQuestion already disarms.)
    disarmNextOnEnter();

    _armOnEnter = function (e) {
      if (e.key !== "Enter") return;
      // v1.5.17: phase guard. If we're not in feedback any more (e.g. the
      // user hit Next manually and renderQuestion ran but somehow this
      // listener survived), refuse to fire.
      if (phase !== "feedback") {
        dbg("nextOnEnter.skipped.notFeedback", { phase: phase });
        return;
      }
      const delta = Date.now() - _armedAt;
      if (e.repeat) {
        dbg("nextOnEnter.skipped.repeat", { delta: delta });
        return;
      }
      if (delta < 300) {
        dbg("nextOnEnter.skipped.grace", { delta: delta });
        return;
      }
      dbg("nextOnEnter.fired", { delta: delta });
      e.preventDefault();
      disarmNextOnEnter();
      nextBtn.click();
    };

    dbg("arm.start");
    _armOnKeyup = function (e) {
      if (e.key !== "Enter") return;
      // The keyup signals the previously-held Enter is fully released. Now
      // it's safe to listen for the NEXT keydown as the advance trigger.
      document.removeEventListener("keyup", _armOnKeyup);
      _armOnKeyup = null;
      if (_armTimerId) { clearTimeout(_armTimerId); _armTimerId = 0; }
      _armedAt = Date.now();
      dbg("arm.viaKeyup");
      document.addEventListener("keydown", _armOnEnter);
    };
    document.addEventListener("keyup", _armOnKeyup);
    _armTimerId = setTimeout(function () {
      // Fallback path: 300ms with no keyup observed (mouse-click submit, or
      // the user never pressed Enter at all). Arm the keydown listener
      // anyway so subsequent Enter presses can advance.
      if (_armOnKeyup) {
        document.removeEventListener("keyup", _armOnKeyup);
        _armOnKeyup = null;
      }
      _armTimerId = 0;
      if (_armedAt === 0) {
        _armedAt = Date.now();
        dbg("arm.viaTimeout");
        document.addEventListener("keydown", _armOnEnter);
      }
    }, 300);

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
      const lab = activeFilterLabel();
      const filterStrip = el("div", { class: "cov-filter-strip" }, [
        el("span", { class: "cov-filter-eyebrow", text: lab ? (lab.kind + ":") : "Filter:" }),
        el("span", { class: "cov-filter-name", text: lab ? lab.text : "" })
      ]);
      root.appendChild(filterStrip);
    }

    VOCAB.parentGroups.forEach(function (group) {
      // Skip a group if all its subtags have zero questions (none in v1)
      const groupTotal = group.subtags.reduce(function (s, st) { return s + (SUBTAG_COUNTS[st.id] || 0); }, 0);
      if (groupTotal === 0) return;

      const af = store.activeFilter;
      const isGroupActive = af && af.type === "group" && af.id === group.id;
      const groupEl = el("div", { class: "cov-group" + (isGroupActive ? " cov-group-active" : "") });
      const groupHd = el("div", { class: "cov-group-hd" }, [
        el("button", {
          class: "cov-group-name",
          type: "button",
          title: "Filter to all of " + group.name,
          onClick: function () {
            // v1.5.5: real group-level filter. The pool now includes any
            // question whose tags reference any subtag in this group.
            // If we're already filtered to this group, clicking again clears.
            // v1.5.16: stops opening the modal — the inline stats panel below
            // the coverage map updates to reflect the new filter.
            if (isGroupActive) {
              setFilter(null);
            } else {
              setFilter({ type: "group", id: group.id });
            }
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
        // v1.5.5: a tile is "active" when the current filter is exactly this
        // subtag, OR when the filter is at a higher/lower level that includes
        // this subtag (group filter on its parent, question filter on a Q
        // tagged with this subtag). Different visual treatment per level.
        const af = store.activeFilter;
        const isExactSubtag = af && af.type === "subtag" && af.id === st.id;
        const isInActiveGroup = af && af.type === "group" && groupIdForSubtag(st.id) === af.id;
        const containsActiveQ = af && af.type === "question" && filterIncludesSubtag(st.id);
        const isActive = isExactSubtag;
        const atomised = subtagIsAtomised(st.id);
        // Atomised tiles need a bit more visual room so the atom mosaic reads.
        // Boost their flex-grow proportionally to atom count.
        // Sizing: designed atom registries get their atom count as a floor;
        // auto-atomised subtags use the question count (each question = 1 cell).
        const growBoost = atomised
          ? (subtagHasDesignedAtoms(st.id)
              ? Math.max(count, ATOMS[st.id].length * 1.2)
              : count)
          : count;

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
          class: "tile"
                 + (isActive ? " tile-active" : "")
                 + (isInActiveGroup ? " tile-in-active-group" : "")
                 + (containsActiveQ ? " tile-contains-active-q" : "")
                 + (atomised ? " tile-atomised" : ""),
          type: "button",
          title: titleText,
          "data-id": st.id,
          style: tileStyle,
          // v1.5.16: tile click sets the subtag filter only. The inline
          // stats panel below the coverage map shows scope-appropriate
          // stats; the modal is reserved for the "Full breakdown" link.
          // Click again on the same tile to clear; click an atom cell to
          // drill to a single question (handled in renderAutoAtomMosaic).
          onClick: function () {
            const af = store.activeFilter;
            const isAlreadyHere = af && af.type === "subtag" && af.id === st.id;
            setFilter(isAlreadyHere ? null : { type: "subtag", id: st.id });
          }
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

    // v1.5.16: keep the inline stats panel in lock-step with the coverage map.
    // Cheap to render (a few DOM nodes) and ensures the panel exists on
    // initial load and after any coverage refresh, even from call sites that
    // don't directly touch setFilter.
    renderCoverageStats();
  }

  function setFilter(filterSpec) {
    // v1.5.5: filterSpec can be null (clear), a string (legacy = subtag), or
    // {type: "group"|"subtag"|"question", id: string}.
    if (typeof filterSpec === "string") filterSpec = { type: "subtag", id: filterSpec };
    store.activeFilter = filterSpec || null;
    persist();
    // v1.5.16: drawer no longer auto-closes on filter change — the inline
    // stats panel now lives in the drawer and we want it visible while the
    // user picks/changes focus. They can dismiss the drawer themselves with
    // the close button or the toggle button when ready to practise.
    // Also close the modal drilldown if it's open: it'd otherwise show stats
    // for the OLD scope while the inline panel updates for the new one.
    closeDrilldown();
    renderQuestion();
    renderCoverage();
    renderCoverageStats();
    updateProgressLine();
  }

  // Helper: which group does a subtag belong to?
  function groupIdForSubtag(subtagId) {
    const info = SUBTAG_INDEX[subtagId];
    return info ? info.parentId : null;
  }

  // Helper: does the active filter "include" this subtag (for highlighting)?
  function filterIncludesSubtag(subtagId) {
    const af = store.activeFilter;
    if (!af) return false;
    if (af.type === "subtag") return af.id === subtagId;
    if (af.type === "group") return groupIdForSubtag(subtagId) === af.id;
    if (af.type === "question") {
      // Find the question and check its subtags.
      const q = ALL_QUESTIONS.find(function (qq) { return qq.id === af.id; });
      if (!q || !Array.isArray(q.tags)) return false;
      return q.tags.indexOf(subtagId) !== -1;
    }
    return false;
  }

  // Helper: human-readable label for the current filter, for the coverage strip.
  function activeFilterLabel() {
    const af = store.activeFilter;
    if (!af) return null;
    if (af.type === "group") {
      const grp = VOCAB.parentGroups.find(function (g) { return g.id === af.id; });
      return { kind: "Group", text: grp ? grp.name : af.id };
    }
    if (af.type === "subtag") {
      return { kind: "Subtag", text: SUBTAG_INDEX[af.id] ? SUBTAG_INDEX[af.id].name : af.id };
    }
    if (af.type === "question") {
      const q = ALL_QUESTIONS.find(function (qq) { return qq.id === af.id; });
      const promptPreview = q && q.prompt
        ? (String(q.prompt).length > 60 ? String(q.prompt).slice(0, 57) + "…" : String(q.prompt))
        : af.id;
      return { kind: "Question", text: promptPreview };
    }
    return null;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     8a-bis. Inline coverage stats panel (v1.5.16)
     Always-on stats strip at the bottom of the coverage drawer/column. Shows
     scope-appropriate stats for the current activeFilter, or a topic-wide
     summary when there's no filter. Rebuilt every time setFilter() runs and
     on initial coverage render.
     The modal drilldown is still here too — accessed via the "Full breakdown"
     link for the rich detail (atom-by-atom, recent attempts list).
     ────────────────────────────────────────────────────────────────────────── */

  function computeStatsForScope(af) {
    // af is null (topic-wide) or a {type, id} filter spec.
    let title, eyebrow, totalActive, scopeAttempts, subtagIdsInScope, questionInScope;

    if (!af) {
      // No filter: topic-wide. Title comes from TOPIC_CONFIG.topicLabel if
      // set, else from the brand-title element ("Topic 7: Radioactivity"),
      // else a generic fallback.
      const brand = document.querySelector(".brand-title");
      title = TOPIC_CONFIG.topicLabel
            || (brand ? brand.textContent.trim() : "")
            || "All questions";
      eyebrow = "Whole topic";
      // Active = not parked.
      totalActive = ALL_QUESTIONS.filter(function (q) { return q.parked !== true; }).length;
      scopeAttempts = store.attempts.slice();
    } else if (af.type === "group") {
      const grp = VOCAB.parentGroups.find(function (g) { return g.id === af.id; });
      title = grp ? grp.name : af.id;
      eyebrow = "Parent group";
      subtagIdsInScope = grp ? grp.subtags.map(function (st) { return st.id; }) : [];
      totalActive = subtagIdsInScope.reduce(function (sum, sid) { return sum + (SUBTAG_COUNTS[sid] || 0); }, 0);
      scopeAttempts = store.attempts.filter(function (a) {
        return Array.isArray(a.subtags) && a.subtags.some(function (t) { return subtagIdsInScope.indexOf(t) !== -1; });
      });
    } else if (af.type === "question") {
      questionInScope = ALL_QUESTIONS.find(function (qq) { return qq.id === af.id; });
      const promptPreview = questionInScope && questionInScope.prompt
        ? (String(questionInScope.prompt).length > 80 ? String(questionInScope.prompt).slice(0, 77) + "…" : String(questionInScope.prompt))
        : af.id;
      title = promptPreview;
      eyebrow = "Single question · " + af.id;
      totalActive = (questionInScope && questionInScope.parked !== true) ? 1 : 0;
      scopeAttempts = store.attempts.filter(function (a) { return a.questionId === af.id; });
    } else { // subtag
      const info = SUBTAG_INDEX[af.id];
      title = info ? info.name : af.id;
      eyebrow = info ? (info.parentName + " · subtag") : "Subtag";
      totalActive = SUBTAG_COUNTS[af.id] || 0;
      scopeAttempts = store.attempts.filter(function (a) {
        return Array.isArray(a.subtags) && a.subtags.indexOf(af.id) !== -1;
      });
    }

    const win = (typeof store.coverageWindow === "number" && store.coverageWindow > 0) ? store.coverageWindow : 2;
    const recent = scopeAttempts.slice(-win);

    function avgFraction(arr) {
      if (!arr.length) return null;
      let s = 0;
      arr.forEach(function (a) {
        const possible = a.marksPossible > 0 ? a.marksPossible : 1;
        s += a.marksAwarded / possible;
      });
      return s / arr.length;
    }

    return {
      title: title,
      eyebrow: eyebrow,
      totalActive: totalActive,
      totalAttempts: scopeAttempts.length,
      recentAvg: avgFraction(recent),
      recentCount: recent.length,
      allTimeAvg: avgFraction(scopeAttempts),
      win: win
    };
  }

  // v1.5.16: track the last scope key so the fade-up animation only fires
  // when the SCOPE changes, not on every renderCoverage tick (which happens
  // after each answered question to update tile colours).
  let _lastStatsScopeKey = null;

  function renderCoverageStats() {
    const root = document.getElementById("cov-stats");
    if (!root) return;
    const af = store.activeFilter;
    const s = computeStatsForScope(af);

    function pct(v) { return v == null ? "—" : Math.round(v * 100) + "%"; }

    // Compute a key for the current scope. If it matches what we rendered
    // last time, skip the fade animation — just refresh the numbers in
    // place. This keeps the stats panel quiet when the user is just answering
    // questions and noisy only when they actually change focus.
    const scopeKey = af ? (af.type + ":" + af.id) : "topic";
    const scopeChanged = (scopeKey !== _lastStatsScopeKey);
    _lastStatsScopeKey = scopeKey;

    root.innerHTML = "";
    if (scopeChanged) {
      // Restart the CSS fade-up by toggling animation-name only. We don't
      // touch the .cov-stats class because that holds all the layout styles.
      root.style.animation = "none";
      void root.offsetWidth; // force reflow
      root.style.animation = "";
    }

    root.appendChild(el("div", { class: "cov-stats-eyebrow", text: s.eyebrow }));
    root.appendChild(el("div", { class: "cov-stats-title", text: s.title }));

    const grid = el("div", { class: "cov-stats-grid" }, [
      el("div", { class: "cov-stats-cell" }, [
        el("div", { class: "cov-stats-cell-label", text: "Active Qs" }),
        el("div", { class: "cov-stats-cell-value", text: String(s.totalActive) })
      ]),
      el("div", { class: "cov-stats-cell" }, [
        el("div", { class: "cov-stats-cell-label", text: "Attempts" }),
        el("div", { class: "cov-stats-cell-value", text: String(s.totalAttempts) })
      ]),
      el("div", { class: "cov-stats-cell" }, [
        el("div", { class: "cov-stats-cell-label", text: "Last " + s.win + " avg" }),
        el("div", { class: "cov-stats-cell-value", text: pct(s.recentAvg) }),
        el("div", { class: "cov-stats-cell-sub", text: s.recentCount + " in window" })
      ]),
      el("div", { class: "cov-stats-cell" }, [
        el("div", { class: "cov-stats-cell-label", text: "All-time avg" }),
        el("div", { class: "cov-stats-cell-value", text: pct(s.allTimeAvg) })
      ])
    ]);
    root.appendChild(grid);

    // Action row
    const actions = el("div", { class: "cov-stats-actions" });
    if (af) {
      const scopeWord = af.type === "group" ? "group" : af.type === "question" ? "question" : "subtag";
      actions.appendChild(el("button", {
        class: "cov-stats-filter-btn is-clear",
        type: "button",
        onClick: function () { setFilter(null); },
        text: "Clear " + scopeWord + " filter"
      }));
      actions.appendChild(el("button", {
        class: "cov-stats-more",
        type: "button",
        onClick: function () { openDrilldown(af); },
        text: "Full breakdown"
      }));
    } else {
      // No filter: hint, no buttons. Gives the panel something to say.
      root.appendChild(el("div", {
        class: "cov-stats-hint",
        text: "Click a group, tile, or atom cell above to focus stats on it."
      }));
    }
    if (actions.childNodes.length) root.appendChild(actions);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     8b. Subtag drill-down (v1.3)
     Click a tile, see a modal with stats: total questions, attempts, accuracy
     within the configured window and overall, type breakdown, recent attempts.
     "Filter practice to this subtag" button replaces the old click-to-filter.
     ────────────────────────────────────────────────────────────────────────── */

  // v1.5.14: drilldown takes a {type, id} scope, not just a subtag id.
  // Accepts a bare string for backwards compat (treated as subtag id).
  function openDrilldown(scope) {
    const overlay = document.getElementById("drilldown-overlay");
    if (!overlay) return;
    if (typeof scope === "string") scope = { type: "subtag", id: scope };
    if (!scope || !scope.type || !scope.id) return;
    const content = document.getElementById("drilldown-content");
    content.innerHTML = "";
    content.appendChild(buildDrilldownContent(scope));
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
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
    // Two paths: a designed atom registry (radiation_types) gets the bespoke
    // grouped mosaic with α/β/γ column markers; a subtag with no designed
    // registry gets an auto-mosaic where each question in the subtag becomes
    // one cell.
    if (subtagHasDesignedAtoms(subtagId)) {
      return renderDesignedAtomMosaic(subtagId);
    }
    return renderAutoAtomMosaic(subtagId);
  }

  function renderDesignedAtomMosaic(subtagId) {
    const atomList = ATOMS[subtagId];
    if (!atomList) return el("span");

    const wrap = el("span", { class: "atom-mosaic-wrap" });

    // Column markers: derive distinct groups in registry order. The mosaic's
    // grid column count is set dynamically from the group count, so registries
    // with 4 groups (e.g. stellar lifecycle) lay out cleanly without column
    // headers wrapping. v1.5.20.
    const groupsSeen = [];
    atomList.forEach(function (atom) {
      if (groupsSeen.indexOf(atom.group) === -1) groupsSeen.push(atom.group);
    });
    const colCount = Math.max(groupsSeen.length, 1);
    const gridStyle = "grid-template-columns: repeat(" + colCount + ", 1fr);";

    // Group labels: known short glyphs for radiation types; for everything
    // else, take the first character of each underscore-delimited word and
    // join (e.g. "main_sequence" → "MS", "white_dwarf" → "WD"). Two letters
    // fits any column width comfortably and the full group name remains on
    // hover via the title attribute.
    const groupGlyph = { alpha: "α", beta: "β", gamma: "γ" };
    function shortLabel(g) {
      if (groupGlyph[g]) return groupGlyph[g];
      const parts = String(g).split(/[_-]+/).filter(Boolean);
      if (parts.length === 0) return String(g).slice(0, 2).toUpperCase();
      if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
      // Multi-word: first letter of each, capped at 3 letters total.
      return parts.map(function (p) { return p.charAt(0).toUpperCase(); }).join("").slice(0, 3);
    }

    const headerRow = el("span", { class: "atom-mosaic-head", style: gridStyle },
      groupsSeen.map(function (g) {
        return el("span", { class: "atom-mosaic-col-label", title: g, text: shortLabel(g) });
      })
    );
    wrap.appendChild(headerRow);

    const mosaic = el("span", { class: "atom-mosaic", style: gridStyle });
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

  // v1.5.3: auto-atomised mosaic. Each active question in the subtag becomes
  // one cell. Coverage is per-question, using attempts whose questionId
  // matches. Cells are fixed-size and flex-wrap so cell count drives both
  // width and height — bigger subtags fill more visual space.
  function renderAutoAtomMosaic(subtagId) {
    const wrap = el("span", { class: "atom-mosaic-auto" });
    const af = store.activeFilter;
    ALL_QUESTIONS.forEach(function (q) {
      if (q.parked === true) return;
      if (!Array.isArray(q.tags) || q.tags.indexOf(subtagId) === -1) return;
      const cov = coverageForQuestion(q.id);
      // Title shows the question id and a truncated prompt so hover reveals
      // which specific question this cell tracks. Don't dump the full prompt
      // because that may give away an answer.
      const promptPreview = q.prompt
        ? (String(q.prompt).length > 90 ? String(q.prompt).slice(0, 87) + "…" : String(q.prompt))
        : "";
      const titleParts = [q.id];
      if (promptPreview) titleParts.push(promptPreview);
      if (cov.attemptCount === 0) titleParts.push("untried");
      else titleParts.push(cov.attemptCount + " recent · avg " + Math.round(cov.avg * 100) + "%");
      const isThisQActive = af && af.type === "question" && af.id === q.id;
      const cell = el("span", {
        class: "atom-cell atom-cell-auto"
               + (cov.attemptCount === 0 ? " is-untried" : "")
               + (isThisQActive ? " atom-cell-active" : ""),
        title: titleParts.join(" · "),
        style: "background:" + cov.fill + ";",
        "data-question": q.id,
        // v1.5.5: clicking a cell narrows the practice pool to that single
        // question. v1.5.16: no more modal — the inline stats panel reflects
        // the question scope. stopPropagation so the click doesn't bubble up
        // to the tile (which would set a subtag-level filter and override
        // this).
        onClick: function (e) {
          e.stopPropagation();
          if (isThisQActive) {
            setFilter(null);
          } else {
            setFilter({ type: "question", id: q.id });
          }
        }
      });
      wrap.appendChild(cell);
    });
    return wrap;
  }

  function buildDrilldownContent(scope) {
    // v1.5.14: scope is {type, id}. Compute scope-appropriate values, then
    // build the panel using a common shape.
    let title, eyebrow, totalActive, scopeAttempts, typeCountsByType, isAtomScope;
    let questionInScope = null; // for type === "question"
    let subtagIdsInScope = [];  // for type === "group" or "subtag"

    if (scope.type === "group") {
      const grp = VOCAB.parentGroups.find(function (g) { return g.id === scope.id; });
      title = grp ? grp.name : scope.id;
      eyebrow = "Parent group";
      subtagIdsInScope = grp ? grp.subtags.map(function (st) { return st.id; }) : [];
      totalActive = subtagIdsInScope.reduce(function (sum, sid) { return sum + (SUBTAG_COUNTS[sid] || 0); }, 0);
      scopeAttempts = store.attempts.filter(function (a) {
        return Array.isArray(a.subtags) && a.subtags.some(function (t) { return subtagIdsInScope.indexOf(t) !== -1; });
      });
      isAtomScope = false;
    } else if (scope.type === "question") {
      questionInScope = ALL_QUESTIONS.find(function (qq) { return qq.id === scope.id; });
      const promptPreview = questionInScope && questionInScope.prompt
        ? (questionInScope.prompt.length > 90 ? questionInScope.prompt.slice(0, 87) + "…" : questionInScope.prompt)
        : scope.id;
      title = promptPreview;
      eyebrow = "Single question · " + scope.id;
      totalActive = (questionInScope && questionInScope.parked !== true) ? 1 : 0;
      scopeAttempts = store.attempts.filter(function (a) { return a.questionId === scope.id; });
      isAtomScope = false;
    } else { // "subtag"
      const info = SUBTAG_INDEX[scope.id];
      title = info ? info.name : scope.id;
      eyebrow = (info ? info.parentName + " · subtag" : "Subtag");
      subtagIdsInScope = [scope.id];
      totalActive = SUBTAG_COUNTS[scope.id] || 0;
      scopeAttempts = store.attempts.filter(function (a) {
        return Array.isArray(a.subtags) && a.subtags.indexOf(scope.id) !== -1;
      });
      isAtomScope = subtagIsAtomised(scope.id);
    }

    const totalAttempts = scopeAttempts.length;

    // Accuracy in window vs all-time.
    const win = (typeof store.coverageWindow === "number" && store.coverageWindow > 0) ? store.coverageWindow : 2;
    const recent = scopeAttempts.slice(-win);
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
    const allTimeAvg = avgFraction(scopeAttempts);

    // Status counts (full / partial / none) within all attempts.
    const statusCounts = { full: 0, partial: 0, none: 0 };
    scopeAttempts.forEach(function (a) {
      if (a.status === "full") statusCounts.full++;
      else if (a.status === "partial") statusCounts.partial++;
      else statusCounts.none++;
    });

    // Active questions per type within scope.
    typeCountsByType = { mcq: 0, short: 0, long: 0, numeric: 0, matching: 0, multiselect: 0, ordering: 0, categorise: 0, fillblank: 0, grid: 0 };
    if (scope.type === "question") {
      if (questionInScope && typeCountsByType[questionInScope.type] != null) typeCountsByType[questionInScope.type]++;
    } else {
      ALL_QUESTIONS.forEach(function (q) {
        if (q.parked === true) return;
        if (!Array.isArray(q.tags)) return;
        if (!q.tags.some(function (t) { return subtagIdsInScope.indexOf(t) !== -1; })) return;
        if (typeCountsByType[q.type] != null) typeCountsByType[q.type]++;
      });
    }

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
        el("div", { class: "dd-eyebrow", text: eyebrow }),
        el("h2", { class: "dd-title", text: title })
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
    const typeHeader = (scope.type === "group") ? "Question types in this group (active)"
                     : (scope.type === "question") ? "Question type"
                     : "Question types in this subtag (active)";
    const typeBreakdown = el("div", { class: "dd-types" }, [
      el("h3", { text: typeHeader }),
      el("div", { class: "dd-types-row" }, TYPES.map(function (t) {
        if ((typeCountsByType[t] || 0) === 0) return null;
        return el("div", { class: "dd-type-item" }, [
          el("span", { class: "dd-type-label", text: t }),
          el("span", { class: "dd-type-count", text: String(typeCountsByType[t]) })
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

    // v1.4.1: per-atom breakdown for atomised subtags (only when scope IS a
    // subtag with a designed atom registry). Each row shows the atom's
    // current colour swatch, its name, recent count and average, and an
    // all-time count.
    let atomBreakdown = null;
    if (scope.type === "subtag" && subtagHasDesignedAtoms(scope.id)) {
      const atomList = ATOMS[scope.id];
      atomBreakdown = el("div", { class: "dd-atoms" }, [
        el("h3", { text: "Atom breakdown (last " + win + " in window)" }),
        el("ul", { class: "dd-atom-list" }, atomList.map(function (atom) {
          const cov = coverageForAtom(atom.id);
          const allCount = scopeAttempts.filter(function (a) {
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
      const lastTen = scopeAttempts.slice(-10).reverse();
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

    // Footer actions — scope-aware filter toggle.
    const af = store.activeFilter;
    const isCurrent = !!(af && af.type === scope.type && af.id === scope.id);
    const scopeWord = scope.type === "group" ? "group"
                    : scope.type === "question" ? "question"
                    : "subtag";
    const filterBtn = el("button", {
      class: "btn btn-primary dd-filter-btn",
      type: "button",
      onClick: function () {
        setFilter(isCurrent ? null : { type: scope.type, id: scope.id });
        closeDrilldown();
      },
      text: isCurrent ? ("Stop filtering, show all") : ("Filter practice to this " + scopeWord)
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
    // v1.5.7: include deck/pass status if a deck exists for the current pool.
    let deckBit = "";
    if (store.deck && Array.isArray(store.deck.ids)) {
      const total = store.deck.ids.length;
      const done = Math.min(store.deck.cursor, total);
      const passN = store.deck.pass || 1;
      if (total > 0) {
        deckBit = " · pass <b>" + passN + "</b>: <b>" + done + "/" + total + "</b>";
      }
    }
    line.innerHTML = "<b>" + n + "</b> attempt" + (n === 1 ? "" : "s")
      + " · last 10: <b>" + avg10 + "%</b>"
      + " · subtags touched: <b>" + touchedSubtags.size + "/" + totalSubtags + "</b>"
      + deckBit;
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

  // v1.5.8: copy the diagnostic log to clipboard. Used to send the architect
  // a trace of what happened when something behaves unexpectedly.
  function injectDiagnosticLogSetting() {
    const panel = document.querySelector(".settings-panel");
    if (!panel) return;
    const status = el("p", { class: "settings-link", text: "" });
    const copyBtn = el("button", {
      class: "ed-btn",
      type: "button",
      onClick: async function () {
        const payload = {
          when: new Date().toISOString(),
          version: APP_VERSION,
          ua: navigator.userAgent,
          topic: TOPIC_CONFIG.topicLabel || QUESTIONS_VAR,
          recentAttempts: (store.attempts || []).slice(-10),
          deck: store.deck,
          log: DEBUG_LOG.slice(-200)
        };
        const text = JSON.stringify(payload, null, 2);
        try {
          await navigator.clipboard.writeText(text);
          status.textContent = "Copied. Paste into chat.";
        } catch (err) {
          // Fallback for browsers without clipboard API: drop a textarea
          // the user can copy from manually.
          const ta = el("textarea", {
            style: "width:100%;height:200px;font-family:monospace;font-size:11px;",
            readonly: "readonly"
          });
          ta.value = text;
          status.innerHTML = "";
          status.appendChild(ta);
          ta.focus();
          ta.select();
        }
      },
      text: "Copy diagnostic log"
    });
    const clearBtn = el("button", {
      class: "ed-btn ed-btn-ghost",
      type: "button",
      style: "margin-left:8px;",
      onClick: function () {
        DEBUG_LOG.length = 0;
        try { localStorage.removeItem(DEBUG_LOG_KEY); } catch (e) {}
        status.textContent = "Log cleared.";
      },
      text: "Clear log"
    });
    const section = el("div", { class: "settings-section" }, [
      el("h3", null, "Diagnostics"),
      el("p", null, "If something behaves unexpectedly, click Copy and paste the result into chat. Records the last few hundred lifecycle events."),
      copyBtn,
      clearBtn,
      status
    ]);
    panel.appendChild(section);
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
          + "<div class='qcard-empty-p'>Make sure your question file (which defines window." + QUESTIONS_VAR + ") is included before engine.js.</div></div>";
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
    injectDiagnosticLogSetting();

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

    // v1.5.3: global Enter-submit for non-text question types (matching,
    // ordering, categorise, grid). Text-based types (short, long, numeric,
    // fillblank) have their own input-level Enter handlers that take
    // precedence because they fire first and call e.preventDefault. This
    // listener only acts when:
    //   - we're in the answering phase (not feedback);
    //   - the focused element isn't a text input or textarea;
    //   - a Check-answer button is currently in the DOM to click.
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      if (e.repeat) return;
      if (phase !== "answering") return;
      const ae = document.activeElement;
      const tag = (ae && ae.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const checkBtn = document.querySelector(".qcard .submit-btn");
      if (!checkBtn) return;
      dbg("globalEnter.fireCheckBtn", { activeTag: tag });
      e.preventDefault();
      checkBtn.click();
    });

    // v1.5.13: digit-key shortcuts for MCQ. Pressing 1-9 selects the
    // corresponding displayed choice (in post-shuffle display order).
    document.addEventListener("keydown", function (e) {
      if (e.repeat) return;
      if (phase !== "answering") return;
      if (!current || !current.view || current.view.type !== "mcq") return;
      if (e.key < "1" || e.key > "9") return;
      const ae = document.activeElement;
      const tag = (ae && ae.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const choices = document.querySelectorAll(".qcard .qchoices .choice");
      const digit = parseInt(e.key, 10);
      if (digit < 1 || digit > choices.length) return;
      dbg("mcqDigit.fire", { digit: digit, of: choices.length });
      e.preventDefault();
      choices[digit - 1].click();
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
