// ============================================================================
// Demo questions for the v1.5 new interaction types
// ----------------------------------------------------------------------------
// Add this file to index.html BEFORE engine.js but AFTER topic7_radioactivity.js
// to mix these demos into the practice pool. Remove the script tag to detach.
//   <script src="topic7_radioactivity.js"></script>
//   <script src="demo_new_types.js"></script>      <-- here
//   <script src="engine.js"></script>
//
// Each demo has a standard tag set so it shows up in the right subtag tile.
// All are difficulty 1 (foundation) and meant for quick verification, not
// as a calibrated production question. Park them or delete via the editor
// when you're done with the round.
// ============================================================================

(function () {
  const demos = [

    // ── Matching ────────────────────────────────────────────────────────
    {
      id: "demo_matching_charge",
      type: "matching",
      tags: ["radiation_types"],
      atoms: ["alpha_charge", "beta_charge", "gamma_charge"],
      specRefs: ["7.5"],
      difficultyRating: 1,
      marks: 3,
      prompt: "Match each radiation to its electric charge.",
      pairs: [
        { left: "Alpha (α)", right: "+2" },
        { left: "Beta (β)",  right: "−1" },
        { left: "Gamma (γ)", right: "0"  }
      ],
      explanation: "Alpha is two protons + two neutrons, so charge +2. Beta is an electron, charge −1. Gamma is electromagnetic radiation, no charge.",
      examinerNote: ""
    },
    {
      id: "demo_matching_use",
      type: "matching",
      tags: ["uses_alpha", "uses_beta", "uses_gamma"],
      specRefs: ["7.14"],
      difficultyRating: 1,
      marks: 3,
      prompt: "Match each radiation to a typical use.",
      pairs: [
        { left: "Alpha (α)", right: "Smoke detector" },
        { left: "Beta (β)",  right: "Thickness gauge for paper" },
        { left: "Gamma (γ)", right: "Sterilising medical equipment" }
      ],
      rightExtras: ["Heating water"],
      explanation: "Alpha → smoke alarms (the alpha ionises air, the smoke disrupts it). Beta → thin-foil thickness gauges. Gamma → sterilisation and tracers. 'Heating water' is a distractor; you don't pick a radiation type to heat water.",
      examinerNote: ""
    },

    // ── Multi-select ────────────────────────────────────────────────────
    {
      id: "demo_multiselect_deflected",
      type: "multiselect",
      tags: ["radiation_types"],
      specRefs: ["7.5"],
      difficultyRating: 2,
      marks: 2,
      prompt: "Tick all the radiations that are deflected by a magnetic field.",
      choices: ["Alpha", "Beta", "Gamma"],
      answerIndices: [0, 1],
      distractorRationales: {
        "2": "Gamma has no charge, so a magnetic field has no effect on it. Only charged particles deflect."
      },
      explanation: "Magnetic deflection requires the particle to carry charge. Alpha (+2) and beta (−1) deflect; gamma (no charge) does not.",
      examinerNote: ""
    },
    {
      id: "demo_multiselect_gamma_use",
      type: "multiselect",
      tags: ["uses_gamma"],
      specRefs: ["7.14"],
      difficultyRating: 1,
      marks: 3,
      prompt: "Tick all the genuine uses of gamma radiation.",
      choices: [
        "Sterilising medical equipment",
        "Smoke detectors",
        "Treating cancer (radiotherapy)",
        "Thickness gauging of paper",
        "Medical tracers"
      ],
      answerIndices: [0, 2, 4],
      distractorRationales: {
        "1": "Smoke detectors use alpha, not gamma. Alpha's range is short, which makes it safe for use in a sealed device.",
        "3": "Paper thickness gauging uses beta, because paper is too thin to noticeably absorb gamma."
      },
      explanation: "Gamma is used for sterilisation (kills bacteria), radiotherapy (kills cancerous cells), and as a tracer (passes through tissue and is detected outside).",
      examinerNote: ""
    },

    // ── Ordering ────────────────────────────────────────────────────────
    {
      id: "demo_ordering_penetration",
      type: "ordering",
      tags: ["radiation_types", "penetration"],
      specRefs: ["7.5"],
      difficultyRating: 1,
      marks: 3,
      prompt: "Put α, β, γ in order of penetrating power, weakest first.",
      items: ["Alpha", "Beta", "Gamma"],
      explanation: "Alpha is stopped by paper. Beta is stopped by a few mm of aluminium. Gamma needs lead/concrete and is reduced rather than fully stopped.",
      examinerNote: ""
    },
    {
      id: "demo_ordering_ionising",
      type: "ordering",
      tags: ["radiation_types"],
      specRefs: ["7.5"],
      difficultyRating: 1,
      marks: 3,
      prompt: "Put α, β, γ in order of ionising power, least ionising first.",
      items: ["Gamma", "Beta", "Alpha"],
      explanation: "Gamma is the least ionising (no charge, very fast, weak interactions). Beta is medium. Alpha is most ionising (large charge, slow, lots of interactions per mm).",
      examinerNote: ""
    },

    // ── Categorise ──────────────────────────────────────────────────────
    {
      id: "demo_categorise_uses",
      type: "categorise",
      tags: ["uses_alpha", "uses_beta", "uses_gamma"],
      specRefs: ["7.14"],
      difficultyRating: 2,
      marks: 5,
      prompt: "Sort each example into the radiation type it uses.",
      bins: ["Alpha", "Beta", "Gamma"],
      items: [
        { text: "Smoke detector",                    bin: "Alpha" },
        { text: "Paper thickness gauge",             bin: "Beta" },
        { text: "Sterilising medical equipment",     bin: "Gamma" },
        { text: "Static eliminator (anti-static)",   bin: "Alpha" },
        { text: "Medical tracer (gamma camera)",     bin: "Gamma" }
      ],
      explanation: "Alpha is used where a short range matters (smoke alarm, static eliminator). Beta is used for thin-foil thickness gauging. Gamma is used for sterilisation and tracers (long range, passes through tissue).",
      examinerNote: ""
    },

    // ── Fill-in-the-blank ───────────────────────────────────────────────
    {
      id: "demo_fillblank_alpha_nucleus",
      type: "fillblank",
      tags: ["radiation_types"],
      atoms: ["alpha_composition"],
      specRefs: ["7.5"],
      difficultyRating: 1,
      marks: 1,
      prompt: "An alpha particle is a {} nucleus.",
      blanks: [
        { expected: ["helium", "He", "helium-4", "He-4"] }
      ],
      explanation: "An alpha particle is a helium nucleus: 2 protons + 2 neutrons. (Sometimes written 'helium-4' or 'He-4'.)",
      examinerNote: ""
    },
    {
      id: "demo_fillblank_alpha_count",
      type: "fillblank",
      tags: ["radiation_types"],
      atoms: ["alpha_composition"],
      specRefs: ["7.5"],
      difficultyRating: 1,
      marks: 2,
      prompt: "An alpha particle has {} protons and {} neutrons.",
      blanks: [
        { expected: ["2", "two"] },
        { expected: ["2", "two"] }
      ],
      explanation: "Alpha is the helium nucleus: 2 protons and 2 neutrons.",
      examinerNote: ""
    },
    {
      id: "demo_fillblank_charges",
      type: "fillblank",
      tags: ["radiation_types"],
      atoms: ["alpha_charge", "beta_charge", "gamma_charge"],
      specRefs: ["7.5"],
      difficultyRating: 1,
      marks: 3,
      prompt: "Alpha has charge {}, beta has charge {}, and gamma has charge {}.",
      blanks: [
        { expected: ["+2", "2", "+ 2", "plus 2", "plus two"] },
        { expected: ["-1", "−1", "minus 1", "minus one"] },
        { expected: ["0", "zero", "no charge", "none"] }
      ],
      explanation: "Alpha carries +2 (two protons). Beta is an electron, charge −1. Gamma has no charge.",
      examinerNote: ""
    },

    // ── Grid (matrix multi-select) ──────────────────────────────────────
    {
      id: "demo_grid_safety",
      type: "grid",
      tags: ["contam_irrad", "waste_disposal"],
      specRefs: ["7.16"],
      difficultyRating: 2,
      marks: 5,
      prompt: "For each safety measure, tick the hazard(s) it primarily protects against.",
      rows: [
        "Use gloves",
        "Use tongs to handle the source",
        "Wear a lead apron / shielding",
        "Increase distance from the source",
        "Reduce time near the source"
      ],
      columns: ["Contamination", "Irradiation"],
      correct: {
        "0": [0],          // gloves: contamination
        "1": [0, 1],       // tongs: both (no skin contact + distance)
        "2": [1],          // lead apron: irradiation
        "3": [1],          // distance: irradiation (inverse-square)
        "4": [1]           // time: irradiation (dose = rate × time)
      },
      neutral: {
        "0": [1]           // gloves vs irradiation: defensible but not primary
      },
      markingMode: "per_row",
      explanation: "Contamination is preventing radioactive material getting on or in you (gloves, tongs, hand-washing). Irradiation is reducing dose from a source you can't physically separate from (distance, time, shielding). Tongs protect against both: they prevent contact (contamination) and increase distance (irradiation).",
      examinerNote: "Gloves vs irradiation is marked 'neither' rather than wrong — alpha won't penetrate skin so gloves do block it slightly, but the textbook answer is contamination."
    },
    {
      id: "demo_grid_radiation_uses",
      type: "grid",
      tags: ["uses_alpha", "uses_beta", "uses_gamma"],
      specRefs: ["7.14"],
      difficultyRating: 2,
      marks: 6,
      prompt: "For each application, tick which radiation is typically used.",
      rows: [
        "Smoke detector",
        "Paper thickness gauge",
        "Sterilising medical equipment",
        "Static eliminator",
        "Medical tracer (gamma camera)",
        "Steel thickness gauge"
      ],
      columns: ["Alpha", "Beta", "Gamma"],
      correct: {
        "0": [0],   // smoke detector: alpha
        "1": [1],   // paper thickness: beta
        "2": [2],   // sterilising: gamma
        "3": [0],   // static eliminator: alpha
        "4": [2],   // medical tracer: gamma
        "5": [2]    // steel thickness: gamma (paper would let it all through; alpha/beta wouldn't penetrate steel)
      },
      markingMode: "per_row",
      explanation: "Alpha is short-range and ionising (smoke detector, static eliminator). Beta has a moderate range (paper thickness). Gamma is highly penetrating (steel gauging, medical tracer, sterilisation).",
      examinerNote: ""
    }

  ];

  if (Array.isArray(window.PREIB_RAD_QUESTIONS)) {
    window.PREIB_RAD_QUESTIONS = window.PREIB_RAD_QUESTIONS.concat(demos);
  } else {
    window.PREIB_RAD_QUESTIONS = demos;
  }
})();
