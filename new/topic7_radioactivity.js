// ============================================================================
// Topic 7 Radioactivity question bank — v2 FINAL (revision 3)
// Generated 2026-05-08
//
// Schema: v0.5 (nine types in use: mcq, short, matching, multiselect, grid,
//                 fillblank, categorise, ordering, numeric)
//
// What changed from revision 2:
//   - background_subtraction_short → mcq (reasoning, not single-phrase recall)
//   - background_subtraction_calc_short → numeric (it's a calculation)
//   - use_of_alpha_short / use_of_beta_short / use_of_gamma_short:
//       synonym lists fattened to catch fall-throughs from substring matching.
//       Lists now include verb forms ("measuring thickness", "kill bacteria"),
//       colloquialisms (tin foil, kitchen foil, germs), and common paraphrases.
//   - paper_thickness_gauge questions: prompts say "paper or thin aluminium foil"
//   - medical_tracer questions: prompts say "injected", with note about inhaled
//   - external_alpha_low_risk_mcq / alpha_safe_in_smoke_alarm_multiselect:
//       dropped the "alpha can't penetrate skin" claim (loose physics; the
//       syllabus treats touching as dangerous), replaced with cleaner reasons
//   - beta_implant_multiselect: added "alpha is too short-range" as a reason
//   - new question: thin_foil_vs_thick_steel_mcq
//   - new question: inhaled_lung_tracer_mcq
//
// Authoring rule, locked in:
//   - 'short' type ONLY when the answer is a single word, number, or short
//     phrase the engine can mark deterministically.
//   - For 'state one X' shorts, synonym lists are generous: any wording the
//     student might use for the application (substring-matched).
//   - 'numeric' for calculations.
//   - allowAdjust:false on shorts where exact spelling matters
//     (fission_word_short, fusion_word_short).
//   - Distractor rationales on every mcq wrong-choice.
//
// Stats:
//   197 questions, 357 marks, 22 subtags covered.
// ============================================================================

window.PREIB_RAD_QUESTIONS = [
  {
    "id": "bq_definition",
    "tags": [
      "units",
      "definition"
    ],
    "specRefs": [
      "7.1"
    ],
    "difficultyRating": 1,
    "type": "short",
    "prompt": "State what is meant by an activity of 1 becquerel (Bq).",
    "marks": 1,
    "markPoints": [
      {
        "any": [
          "1 decay per second",
          "one decay per second",
          "1 decay every second",
          "one decay every second",
          "1 nucleus decays per second",
          "one nucleus decays per second",
          "1 disintegration per second",
          "one disintegration per second",
          "1 nuclear decay per second"
        ]
      }
    ],
    "allowAdjust": true,
    "explanation": "An activity of 1 Bq means one nucleus decays per second. So an activity of 50 Bq means about 50 nuclei are decaying every second.",
    "examinerNote": "Examiners accept 'decay', 'disintegration' or 'nuclear decay'. They want a rate per second, not just 'one decay'.",
    "instances": [
      {
        "prompt": "A radioactive sample has an activity of 50 Bq. State, in plain words, what this tells you about the sample.",
        "explanation": "50 nuclei are decaying every second on average."
      },
      {
        "prompt": "Activity is measured in becquerels (Bq). State what 1 Bq is equal to.",
        "explanation": "1 decay per second."
      }
    ]
  },
  {
    "id": "bq_unit_of_activity_mcq",
    "tags": [
      "units"
    ],
    "specRefs": [
      "7.1"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which is the unit of activity of a radioactive source?",
    "choices": [
      "becquerel (Bq)",
      "joule (J)",
      "watt (W)",
      "newton (N)"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Joule is the unit of energy, not activity.",
      "2": "Watt is the unit of power (energy per second), not nuclear decays per second.",
      "3": "Newton is the unit of force."
    },
    "explanation": "Activity (the rate at which nuclei in a sample decay) is measured in becquerels. 1 Bq = 1 decay per second."
  },
  {
    "id": "subatomic_charges_matching",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 1,
    "type": "matching",
    "prompt": "Match each subatomic particle with its relative charge.",
    "pairs": [
      {
        "left": "Proton",
        "right": "+1"
      },
      {
        "left": "Neutron",
        "right": "0"
      },
      {
        "left": "Electron",
        "right": "−1"
      }
    ],
    "marks": 3,
    "explanation": "Protons carry charge +1, electrons carry charge −1, and neutrons are neutral. In a neutral atom, the number of protons equals the number of electrons, so the charges cancel out."
  },
  {
    "id": "subatomic_masses_matching",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 1,
    "type": "matching",
    "prompt": "Match each subatomic particle with its relative mass.",
    "pairs": [
      {
        "left": "Proton",
        "right": "1"
      },
      {
        "left": "Neutron",
        "right": "1"
      },
      {
        "left": "Electron",
        "right": "negligible (≈ 0)"
      }
    ],
    "marks": 3,
    "explanation": "Protons and neutrons each have a relative mass of 1. Electrons are about 1800 times lighter, so we treat their mass as negligible. This is why almost all the mass of an atom is in the nucleus."
  },
  {
    "id": "subatomic_grid",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 2,
    "type": "grid",
    "prompt": "For each particle, tick every property that applies.",
    "rows": [
      "Proton",
      "Neutron",
      "Electron"
    ],
    "columns": [
      "Found in the nucleus",
      "Has positive charge",
      "Has negative charge",
      "Has negligible mass"
    ],
    "correct": {
      "0": [
        0,
        1
      ],
      "1": [
        0
      ],
      "2": [
        2,
        3
      ]
    },
    "marks": 3,
    "markingMode": "per_row",
    "explanation": "Protons sit in the nucleus and carry positive charge. Neutrons sit in the nucleus and carry no charge. Electrons orbit outside the nucleus, carry negative charge, and have negligible mass compared with protons and neutrons."
  },
  {
    "id": "where_in_atom_mcq",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which statement correctly describes where the protons, neutrons and electrons are located in an atom?",
    "choices": [
      "Protons and neutrons are in the nucleus; electrons orbit the nucleus.",
      "Protons and electrons are in the nucleus; neutrons orbit the nucleus.",
      "All three particles are mixed together in the nucleus.",
      "Protons are in the nucleus; neutrons and electrons orbit the nucleus."
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Electrons are not in the nucleus. They orbit it in shells.",
      "2": "Electrons are in shells outside the nucleus, not mixed in with the protons and neutrons.",
      "3": "Neutrons are in the nucleus alongside protons. Only electrons orbit outside it."
    },
    "explanation": "The nucleus contains the protons and neutrons (the 'nucleons'). The electrons sit in shells around the nucleus. Almost all the mass of the atom is in the tiny central nucleus; almost all the volume is empty space outside it."
  },
  {
    "id": "nucleus_size_mcq",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "An atom is described as 'mostly empty space'. Which of the following best explains this description?",
    "choices": [
      "The nucleus is tiny compared to the size of the whole atom.",
      "Atoms have no electrons in some directions.",
      "Atoms shrink between collisions.",
      "Most atoms are gaseous and so contain gaps."
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Electrons surround the nucleus in all directions; there are no 'empty' directions.",
      "2": "Atoms don't change size like that.",
      "3": "Whether the atoms are in a gas or a solid doesn't change what an individual atom looks like."
    },
    "explanation": "The nucleus is roughly 100,000 times smaller in radius than the whole atom. The rest of the atom's volume is the space in which the electrons orbit, which is mostly empty."
  },
  {
    "id": "make_negative_ion_mcq",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "What change to a neutral atom turns it into a negative ion?",
    "choices": [
      "It gains an electron.",
      "It loses an electron.",
      "It gains a proton.",
      "It loses a proton."
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Losing an electron leaves a positive ion (one fewer negative charge).",
      "2": "Gaining a proton would turn it into a different element, and add positive charge, not negative.",
      "3": "Losing a proton would turn it into a different element."
    },
    "explanation": "Adding a negative electron to a neutral atom gives the atom a net negative charge. The number of protons (which determines what element it is) does not change.",
    "examinerNote": "Examiners reject answers that change the proton number, because that would change the element, not just the charge."
  },
  {
    "id": "isotope_definition_fillblank",
    "tags": [
      "atomic_struct",
      "nuclide_notation",
      "definition"
    ],
    "specRefs": [
      "7.3"
    ],
    "difficultyRating": 2,
    "type": "fillblank",
    "prompt": "Complete the definition of isotopes:\nIsotopes of an element are atoms that have the {} number of protons but {} numbers of neutrons.",
    "blanks": [
      {
        "expected": [
          "same"
        ]
      },
      {
        "expected": [
          "different"
        ]
      }
    ],
    "marks": 2,
    "explanation": "Isotopes share the same proton number (so they are atoms of the same element), but they differ in neutron count (so they have different mass numbers).",
    "examinerNote": "The teacher's mark scheme accepts 'same atomic number / different mass number' as an alternative phrasing, but this fill-in-the-blank version asks specifically about protons and neutrons.",
    "instances": [
      {
        "prompt": "Complete the definition:\nIsotopes of an element have the same {} number but different {} numbers.",
        "blanks": [
          {
            "expected": [
              "atomic",
              "proton"
            ]
          },
          {
            "expected": [
              "mass",
              "nucleon"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "read_nuclide_fillblank",
    "tags": [
      "nuclide_notation",
      "atomic_struct"
    ],
    "specRefs": [
      "7.2",
      "7.3"
    ],
    "difficultyRating": 2,
    "type": "fillblank",
    "prompt": "A nuclide is written as $^{14}_{6}\\text{C}$.\nNumber of protons = {}\nNumber of neutrons = {}\nNumber of electrons in the neutral atom = {}",
    "blanks": [
      {
        "expected": [
          "6"
        ]
      },
      {
        "expected": [
          "8"
        ]
      },
      {
        "expected": [
          "6"
        ]
      }
    ],
    "marks": 3,
    "explanation": "The lower number is the atomic number (proton count): 6.\nNeutrons = mass number − atomic number = 14 − 6 = 8.\nIn a neutral atom, electrons = protons = 6.",
    "instances": [
      {
        "prompt": "A nuclide is written as $^{23}_{11}\\text{Na}$.\nNumber of protons = {}\nNumber of neutrons = {}\nNumber of electrons in the neutral atom = {}",
        "blanks": [
          {
            "expected": [
              "11"
            ]
          },
          {
            "expected": [
              "12"
            ]
          },
          {
            "expected": [
              "11"
            ]
          }
        ],
        "explanation": "Atomic number 11 → 11 protons, so 11 electrons in a neutral atom. Neutrons = 23 − 11 = 12."
      },
      {
        "prompt": "A nuclide is written as $^{238}_{92}\\text{U}$.\nNumber of protons = {}\nNumber of neutrons = {}\nNumber of electrons in the neutral atom = {}",
        "blanks": [
          {
            "expected": [
              "92"
            ]
          },
          {
            "expected": [
              "146"
            ]
          },
          {
            "expected": [
              "92"
            ]
          }
        ],
        "explanation": "Atomic number 92 → 92 protons and 92 electrons (neutral). Neutrons = 238 − 92 = 146."
      },
      {
        "prompt": "A nuclide is written as $^{67}_{31}\\text{Ga}$ (gallium).\nNumber of protons = {}\nNumber of neutrons = {}",
        "blanks": [
          {
            "expected": [
              "31"
            ]
          },
          {
            "expected": [
              "36"
            ]
          }
        ],
        "marks": 2,
        "explanation": "Atomic number 31 → 31 protons. Neutrons = 67 − 31 = 36.",
        "examinerNote": "This is the layout used in the 4SS0 June 2019 paper, Q1(a)."
      }
    ]
  },
  {
    "id": "what_each_number_means_mcq",
    "tags": [
      "nuclide_notation"
    ],
    "specRefs": [
      "7.3"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "In the nuclide notation $^{A}_{Z}\\text{X}$, what does the lower number $Z$ represent?",
    "choices": [
      "The number of protons in the nucleus.",
      "The total number of protons and neutrons in the nucleus.",
      "The number of electrons in the outermost shell.",
      "The number of neutrons in the nucleus."
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "That's the mass number $A$, the upper number.",
      "2": "Nuclide notation doesn't show shell structure; it shows nuclear composition.",
      "3": "Neutron number isn't shown directly; you work it out from $A − Z$."
    },
    "explanation": "$Z$ is the atomic (proton) number: the number of protons in the nucleus. $A$ is the mass (nucleon) number: protons plus neutrons. Neutrons = $A − Z$.",
    "instances": [
      {
        "prompt": "In the nuclide notation $^{A}_{Z}\\text{X}$, what does the upper number $A$ represent?",
        "choices": [
          "The total number of protons and neutrons in the nucleus.",
          "The number of protons in the nucleus.",
          "The atomic mass in grams.",
          "The number of neutrons in the nucleus."
        ],
        "answerIndex": 0,
        "distractorRationales": {
          "1": "That's the atomic number $Z$, the lower number.",
          "2": "$A$ is a count of nucleons, not a mass in grams.",
          "3": "Neutrons = $A − Z$; the upper number includes protons too."
        },
        "explanation": "$A$ is the mass (nucleon) number: the total number of protons plus neutrons in the nucleus."
      }
    ]
  },
  {
    "id": "spot_the_isotope_pair_mcq",
    "tags": [
      "nuclide_notation",
      "atomic_struct"
    ],
    "specRefs": [
      "7.3"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Which two nuclides are isotopes of each other?",
    "choices": [
      "$^{12}_{6}\\text{C}$ and $^{14}_{6}\\text{C}$",
      "$^{14}_{6}\\text{C}$ and $^{14}_{7}\\text{N}$",
      "$^{16}_{8}\\text{O}$ and $^{17}_{9}\\text{F}$",
      "$^{1}_{1}\\text{H}$ and $^{4}_{2}\\text{He}$"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "These have the same mass number but different proton numbers, so they are different elements, not isotopes.",
      "2": "These differ in both proton number and mass number; they are different elements with no isotope relationship.",
      "3": "Hydrogen and helium are different elements with different proton numbers."
    },
    "explanation": "Isotopes of an element have the same proton number but different neutron numbers. Both forms of carbon have 6 protons; carbon-12 has 6 neutrons and carbon-14 has 8 neutrons."
  },
  {
    "id": "same_or_different_categorise",
    "tags": [
      "nuclide_notation",
      "atomic_struct"
    ],
    "specRefs": [
      "7.3"
    ],
    "difficultyRating": 3,
    "type": "categorise",
    "prompt": "Sort each pair of nuclides into the correct category.",
    "bins": [
      "Isotopes of the same element",
      "Different elements"
    ],
    "items": [
      {
        "text": "$^{16}_{8}\\text{O}$ and $^{18}_{8}\\text{O}$",
        "bin": "Isotopes of the same element"
      },
      {
        "text": "$^{35}_{17}\\text{Cl}$ and $^{37}_{17}\\text{Cl}$",
        "bin": "Isotopes of the same element"
      },
      {
        "text": "$^{14}_{6}\\text{C}$ and $^{14}_{7}\\text{N}$",
        "bin": "Different elements"
      },
      {
        "text": "$^{40}_{18}\\text{Ar}$ and $^{40}_{20}\\text{Ca}$",
        "bin": "Different elements"
      },
      {
        "text": "$^{1}_{1}\\text{H}$ and $^{2}_{1}\\text{H}$",
        "bin": "Isotopes of the same element"
      }
    ],
    "marks": 5,
    "explanation": "What identifies an element is the proton number (the lower digit). If two nuclides share that lower digit, they're the same element and therefore isotopes of each other. Same mass number but different proton numbers means they're different elements that just happen to have the same total nucleon count."
  },
  {
    "id": "what_ionising_means_fillblank",
    "tags": [
      "ionising_random",
      "definition"
    ],
    "specRefs": [
      "7.4"
    ],
    "difficultyRating": 2,
    "type": "fillblank",
    "prompt": "Complete the definition of ionising radiation:\nIonising radiation has enough energy to knock {} off atoms, turning them into charged particles called {}.",
    "blanks": [
      {
        "expected": [
          "electrons",
          "an electron",
          "electron"
        ]
      },
      {
        "expected": [
          "ions"
        ]
      }
    ],
    "marks": 2,
    "explanation": "When radiation has enough energy, it can remove an electron from an atom. The atom is left with one fewer negative charge than it had, so it becomes a positively charged ion. Knocking electrons off in this way is called 'ionisation', and the radiation that can do it is called 'ionising' radiation.",
    "examinerNote": "Examiners accept 'electron' or 'electrons'."
  },
  {
    "id": "decay_random_fillblank",
    "tags": [
      "ionising_random",
      "definition"
    ],
    "specRefs": [
      "7.4"
    ],
    "difficultyRating": 2,
    "type": "fillblank",
    "prompt": "Complete the explanation of what 'random decay' means:\nIt is impossible to predict {} an individual nucleus will decay. However, every nucleus has the same {} of decaying in any given time interval.",
    "blanks": [
      {
        "expected": [
          "when"
        ]
      },
      {
        "expected": [
          "chance",
          "probability",
          "likelihood"
        ]
      }
    ],
    "marks": 2,
    "explanation": "Random doesn't mean 'unpredictable in every way'. It means: for any one nucleus, you cannot say when it will decay. But across a large sample, all the nuclei share the same fixed probability per second of decaying, so the average behaviour (such as the half-life) is very predictable."
  },
  {
    "id": "which_em_are_ionising_multiselect",
    "tags": [
      "ionising_random"
    ],
    "specRefs": [
      "7.4"
    ],
    "difficultyRating": 2,
    "type": "multiselect",
    "prompt": "Tick all the types of radiation that are ionising.",
    "choices": [
      "Alpha particles",
      "Beta particles",
      "Gamma rays",
      "X-rays",
      "Visible light",
      "Radio waves"
    ],
    "answerIndices": [
      0,
      1,
      2,
      3
    ],
    "distractorRationales": {
      "4": "Visible light photons don't carry enough energy to knock electrons off atoms.",
      "5": "Radio waves have very low photon energy — well below the threshold needed to ionise atoms."
    },
    "marks": 4,
    "markingMode": "penalty",
    "explanation": "Alpha, beta, gamma, and X-rays are all ionising. Of the EM radiations, only the high-frequency / high-photon-energy ones ionise. Visible light, infrared, microwaves and radio waves do not have enough energy to knock electrons off atoms.",
    "examinerNote": "Note that X-rays and some ultraviolet are ionising too. They are not 'nuclear' radiations because they don't come from the nucleus, but they still count as ionising."
  },
  {
    "id": "source_is_nucleus_mcq",
    "tags": [
      "ionising_random"
    ],
    "specRefs": [
      "7.4"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Where in an atom do alpha, beta and gamma radiations come from?",
    "choices": [
      "The nucleus",
      "The electron shells",
      "The space between atoms",
      "Anywhere within the atom, depending on the energy"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Electron-shell processes can produce X-rays and visible light, but not alpha, beta or gamma. Note: a beta particle is an electron, but it is created in the nucleus when a neutron changes to a proton, not from a shell.",
      "2": "Atoms produce radiation; the gaps between them don't.",
      "3": "All three nuclear radiations have the same source: the nucleus."
    },
    "explanation": "Alpha, beta and gamma radiations are emitted by unstable nuclei. A beta particle is an electron, but it is produced inside the nucleus (when a neutron changes into a proton), not flung out from a shell. Examiners are strict about saying 'nucleus' rather than 'atom' here.",
    "examinerNote": "Examiners often penalise candidates who write 'atom' or 'electron shell' as the source. The mark scheme wants 'nucleus'."
  },
  {
    "id": "random_predictable_paradox_multiselect",
    "tags": [
      "ionising_random",
      "halflife"
    ],
    "specRefs": [
      "7.4",
      "7.12"
    ],
    "difficultyRating": 3,
    "type": "multiselect",
    "prompt": "If decay is random, how can the half-life of an isotope still be a fixed quantity? Tick all the statements that correctly explain this.",
    "choices": [
      "A real sample contains a huge number of nuclei, so the average behaviour is reliable.",
      "Each nucleus has the same fixed probability of decaying per unit time.",
      "Random means we can predict every individual decay if we measure carefully.",
      "Individual decays are unpredictable, but with billions of nuclei the proportion that decays each second is consistent.",
      "Half-life only applies once the random process has 'settled down' after a few seconds."
    ],
    "answerIndices": [
      0,
      1,
      3
    ],
    "distractorRationales": {
      "2": "Random specifically means we can never predict when an individual nucleus will decay, no matter how carefully we measure.",
      "4": "There's no 'settling down' phase. The same fixed probability per second applies from the start."
    },
    "marks": 3,
    "markingMode": "penalty",
    "explanation": "It's the law of large numbers. Each nucleus decays at a random time, but they all share the same probability of decaying per unit time. With a huge number of nuclei, the proportion that has decayed by any given moment is reliably predictable, even though no individual decay is."
  },
  {
    "id": "what_is_alpha_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "alpha_composition"
    ],
    "prompt": "What is an alpha particle?",
    "choices": [
      "A helium nucleus (2 protons and 2 neutrons)",
      "A fast-moving electron",
      "A high-frequency electromagnetic wave",
      "A free neutron"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "A fast-moving electron is a beta particle, not alpha.",
      "2": "A high-frequency electromagnetic wave is gamma radiation.",
      "3": "A free neutron is sometimes emitted in nuclear reactions, but it isn't alpha."
    },
    "explanation": "An alpha particle is a helium nucleus: 2 protons and 2 neutrons bound together. It has no electrons (so it isn't a helium atom; it's the nucleus only)."
  },
  {
    "id": "what_is_beta_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "beta_composition"
    ],
    "prompt": "What is a beta particle?",
    "choices": [
      "A fast-moving electron emitted from the nucleus",
      "A helium nucleus",
      "A high-frequency electromagnetic wave",
      "A proton emitted from the nucleus"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "A helium nucleus is an alpha particle.",
      "2": "A high-frequency electromagnetic wave is gamma radiation.",
      "3": "A beta particle is an electron, not a proton. (Inside the nucleus, a neutron changes into a proton plus an electron, and the electron is ejected.)"
    },
    "explanation": "A beta particle is a fast-moving electron emitted from the nucleus. It is created when a neutron in the nucleus changes into a proton, with the electron flung out."
  },
  {
    "id": "what_is_gamma_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "gamma_composition"
    ],
    "prompt": "What is gamma radiation?",
    "choices": [
      "A high-frequency electromagnetic wave",
      "A helium nucleus",
      "A fast-moving electron",
      "A proton emitted from the nucleus"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "A helium nucleus is an alpha particle.",
      "2": "A fast-moving electron is a beta particle.",
      "3": "Gamma is electromagnetic radiation, not a particle of any kind."
    },
    "explanation": "Gamma radiation is a high-frequency, high-energy electromagnetic wave. It is the only one of the three nuclear radiations that is not a particle."
  },
  {
    "id": "alpha_charge_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "alpha_charge"
    ],
    "prompt": "What is the charge of an alpha particle?",
    "choices": [
      "+2",
      "+1",
      "−1",
      "0"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "+1 is the charge of a proton. An alpha particle has 2 protons, so its charge is +2.",
      "2": "−1 is the charge of an electron (and so of a beta particle).",
      "3": "0 is the charge of a neutron, or of gamma radiation. Alpha particles do carry charge."
    },
    "explanation": "An alpha particle is made of 2 protons and 2 neutrons. The 2 protons each contribute +1; the 2 neutrons contribute 0; total charge = +2."
  },
  {
    "id": "beta_charge_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "beta_charge"
    ],
    "prompt": "What is the charge of a beta particle?",
    "choices": [
      "−1",
      "+1",
      "+2",
      "0"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "+1 is the charge of a proton.",
      "2": "+2 is the charge of an alpha particle.",
      "3": "0 is the charge of gamma radiation. A beta particle is charged because it is an electron."
    },
    "explanation": "A beta particle is an electron, and an electron has a charge of −1."
  },
  {
    "id": "gamma_charge_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "gamma_charge"
    ],
    "prompt": "What is the charge of gamma radiation?",
    "choices": [
      "0",
      "+1",
      "−1",
      "+2"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "+1 is the charge of a proton.",
      "2": "−1 is the charge of an electron (a beta particle).",
      "3": "+2 is the charge of an alpha particle."
    },
    "explanation": "Gamma radiation carries no charge: it is an electromagnetic wave, not a particle. This is why a magnetic field doesn't deflect gamma."
  },
  {
    "id": "alpha_stopped_by_mcq",
    "tags": [
      "radiation_types",
      "penetration"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "alpha_penetration"
    ],
    "prompt": "Alpha radiation is absorbed by:",
    "choices": [
      "A sheet of paper or a few centimetres of air",
      "A few millimetres of aluminium",
      "A few centimetres of lead",
      "Nothing — it passes through everything"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "A few mm of aluminium will stop alpha (and stops beta), but paper or a few cm of air is enough for alpha.",
      "2": "Lead will stop alpha, but it is overkill — paper alone is enough.",
      "3": "Alpha is the easiest of the three radiations to stop. Almost any solid blocks it."
    },
    "explanation": "Alpha radiation has very short range because it is highly ionising and loses its energy quickly. A sheet of paper, or a few centimetres of air, is enough to absorb it."
  },
  {
    "id": "beta_stopped_by_mcq",
    "tags": [
      "radiation_types",
      "penetration"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "beta_penetration"
    ],
    "prompt": "Beta radiation is absorbed by:",
    "choices": [
      "A few millimetres of aluminium",
      "A sheet of paper",
      "A few centimetres of lead",
      "Air alone (over typical lab distances)"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "A sheet of paper is enough to stop alpha but it does NOT stop beta — beta passes through paper.",
      "2": "Lead will stop beta, but a few mm of aluminium is enough.",
      "3": "Beta has a range of tens of metres in air, so air over normal lab distances does not absorb it."
    },
    "explanation": "Beta is more penetrating than alpha but less than gamma. A few millimetres of aluminium absorbs it. Paper does not."
  },
  {
    "id": "gamma_stopped_by_mcq",
    "tags": [
      "radiation_types",
      "penetration"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "gamma_penetration"
    ],
    "prompt": "Gamma radiation is mostly absorbed by:",
    "choices": [
      "A few centimetres of lead",
      "A sheet of paper",
      "A few millimetres of aluminium",
      "Air alone (over typical lab distances)"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Paper barely affects gamma at all; gamma is highly penetrating.",
      "2": "A few mm of aluminium has very little effect on gamma. It needs much denser shielding.",
      "3": "Gamma travels easily through air — its range there is hundreds of kilometres."
    },
    "explanation": "Gamma is the most penetrating of the three nuclear radiations. Even a few centimetres of lead does not absorb it completely; it just reduces the count rate substantially. Examiners accept 'lead' or 'thick concrete'."
  },
  {
    "id": "most_ionising_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "alpha_ionising"
    ],
    "prompt": "Which of the three nuclear radiations is the most ionising?",
    "choices": [
      "Alpha",
      "Beta",
      "Gamma"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Beta is moderately ionising — less than alpha.",
      "2": "Gamma is the least ionising of the three."
    },
    "explanation": "Alpha is by far the most ionising of the three. It is heavy and slow-moving with a large +2 charge, so it interacts strongly with electrons in atoms it passes near, knocking many off in a short distance."
  },
  {
    "id": "least_ionising_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "gamma_ionising"
    ],
    "prompt": "Which of the three nuclear radiations is the least ionising?",
    "choices": [
      "Gamma",
      "Alpha",
      "Beta"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha is the most ionising, not the least.",
      "2": "Beta is in the middle. Gamma is the least ionising — it has no charge and barely interacts with atoms it passes."
    },
    "explanation": "Gamma is the least ionising. It carries no charge, so it doesn't 'pull' on electrons as it passes; most of its energy goes straight through matter without ionising anything."
  },
  {
    "id": "beta_ionising_middle_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": [
      "beta_ionising"
    ],
    "prompt": "Compared with alpha and gamma, beta radiation is:",
    "choices": [
      "Less ionising than alpha but more ionising than gamma",
      "More ionising than alpha and gamma",
      "Less ionising than alpha and gamma",
      "Equally ionising as alpha"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha is the most ionising of the three. Beta sits in the middle.",
      "2": "Beta is more ionising than gamma; it carries charge.",
      "3": "Alpha and beta both ionise more than beta does. The order is α > β > γ."
    },
    "explanation": "The ionising order is: alpha (most) > beta > gamma (least). Beta sits in the middle: it carries a single −1 charge but moves much faster than alpha, so it doesn't interact as strongly with each atom it passes."
  },
  {
    "id": "radiation_properties_grid",
    "tags": [
      "radiation_types",
      "penetration"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 2,
    "type": "grid",
    "prompt": "For each radiation, tick every property that applies.",
    "rows": [
      "Alpha",
      "Beta",
      "Gamma"
    ],
    "columns": [
      "Carries positive charge",
      "Carries negative charge",
      "Carries no charge",
      "Is a particle",
      "Is electromagnetic"
    ],
    "correct": {
      "0": [
        0,
        3
      ],
      "1": [
        1,
        3
      ],
      "2": [
        2,
        4
      ]
    },
    "marks": 3,
    "markingMode": "per_row",
    "explanation": "Alpha: +2 charge, particle (helium nucleus).\nBeta: −1 charge, particle (electron).\nGamma: no charge, electromagnetic wave (not a particle)."
  },
  {
    "id": "radiation_what_is_matching",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 2,
    "type": "matching",
    "prompt": "Match each radiation to the best description of what it is.",
    "pairs": [
      {
        "left": "Alpha",
        "right": "A helium nucleus (2 protons and 2 neutrons)"
      },
      {
        "left": "Beta",
        "right": "A fast-moving electron emitted from the nucleus"
      },
      {
        "left": "Gamma",
        "right": "A high-frequency electromagnetic wave"
      }
    ],
    "rightExtras": [
      "An electron orbiting the nucleus at high speed",
      "A free proton emitted from the nucleus"
    ],
    "marks": 3,
    "explanation": "These are the standard 4SS0 descriptions. Note that for beta, the electron is emitted from the nucleus (not from a shell, even though it's the same kind of particle as a shell electron).",
    "examinerNote": "Examiners reject 'beta is an electron from outside the atom' or 'an orbiting electron'. The phrase wanted is 'an electron emitted from the nucleus'."
  },
  {
    "id": "ionising_vs_penetration_fillblank",
    "tags": [
      "penetration",
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 2,
    "type": "fillblank",
    "prompt": "Complete the link between ionising power and penetration:\nA radiation that is highly ionising loses its energy {} as it passes through matter. So it tends to have a {} penetrating power.",
    "blanks": [
      {
        "expected": [
          "quickly",
          "rapidly",
          "fast"
        ]
      },
      {
        "expected": [
          "low",
          "small",
          "short"
        ]
      }
    ],
    "marks": 2,
    "explanation": "Each ionisation event takes a small amount of energy from the radiation. Highly ionising radiation creates many ionisations per centimetre, so it runs out of energy quickly and stops in a short distance. That is why alpha is both the most ionising and the least penetrating."
  },
  {
    "id": "barrier_swap_predict_mcq",
    "tags": [
      "penetration"
    ],
    "specRefs": [
      "7.5",
      "7.6"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "A gamma source produces a count rate of 200 counts/min at a Geiger-Müller tube, with no barrier between source and detector. A sheet of paper is then placed between source and detector. What happens to the count rate?",
    "choices": [
      "It stays at roughly 200 counts/min",
      "It falls to roughly half (around 100 counts/min)",
      "It falls to roughly the background count rate",
      "It rises sharply"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Gamma is highly penetrating; paper is far too thin to absorb a noticeable fraction. The count rate is essentially unchanged.",
      "2": "Paper absorbs alpha (so an alpha source would drop to near-background), but it does not absorb gamma.",
      "3": "Adding a barrier never increases the count rate."
    },
    "explanation": "Paper barely affects gamma at all. Gamma is highly penetrating: it would take a few cm of lead to noticeably reduce the count. With paper in place, the count rate is essentially unchanged.",
    "instances": [
      {
        "prompt": "A beta source produces a count rate of 800 counts/min at a Geiger-Müller tube, with no barrier. A sheet of paper is placed between source and detector. What happens to the count rate?",
        "choices": [
          "It stays at roughly 800 counts/min",
          "It falls to roughly half (around 400 counts/min)",
          "It falls to roughly the background count rate",
          "It rises sharply"
        ],
        "answerIndex": 0,
        "distractorRationales": {
          "1": "Paper absorbs alpha, but not beta. A few mm of aluminium would be needed to noticeably reduce the count from a beta source.",
          "2": "Paper has very little effect on a beta source; it doesn't halve the count.",
          "3": "Adding a barrier never increases the count rate."
        },
        "explanation": "Paper does not absorb beta. The count rate is essentially unchanged. To stop beta you'd need a few mm of aluminium."
      },
      {
        "prompt": "An alpha source produces a count rate of 500 counts/min at a Geiger-Müller tube positioned 1 cm away. A sheet of paper is placed between source and detector. What happens to the count rate?",
        "choices": [
          "It falls to roughly the background count rate",
          "It stays at roughly 500 counts/min",
          "It falls to roughly half (around 250 counts/min)",
          "It rises sharply"
        ],
        "answerIndex": 0,
        "distractorRationales": {
          "1": "Alpha is the least penetrating of the three radiations; paper absorbs it.",
          "2": "Paper absorbs alpha quite effectively. The drop is to near-background, not roughly half.",
          "3": "Adding a barrier never increases the count rate."
        },
        "explanation": "Paper absorbs alpha. The count rate falls to approximately the background count rate — only a few counts/min remain."
      }
    ]
  },
  {
    "id": "which_radiation_paper_test_mcq",
    "tags": [
      "penetration"
    ],
    "specRefs": [
      "7.5",
      "7.6"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "A radioactive source is held in front of a Geiger-Müller tube. The count rate is high. When a sheet of paper is placed between source and tube, the count rate falls to approximately the background level. Which radiation is the source emitting?",
    "choices": [
      "Alpha",
      "Beta",
      "Gamma",
      "It could be any of the three"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Beta passes through paper. The count rate would barely change with paper alone.",
      "2": "Gamma is highly penetrating. Paper has almost no effect on it.",
      "3": "The fall to background tells you it must be the radiation that paper absorbs — alpha — and rules out beta and gamma."
    },
    "explanation": "Paper absorbs alpha but not beta or gamma. Once paper is in place, only alpha would be reduced to (near) background. So the source emits alpha.",
    "examinerNote": "This is the standard inference pattern in 4SS0 penetration questions: paper-only absorption identifies alpha; aluminium-but-not-paper absorption identifies beta; only-lead absorption identifies gamma."
  },
  {
    "id": "range_in_air_matching",
    "tags": [
      "penetration",
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 2,
    "type": "matching",
    "prompt": "Match each radiation to its typical range in air.",
    "pairs": [
      {
        "left": "Alpha",
        "right": "A few centimetres"
      },
      {
        "left": "Beta",
        "right": "Tens of metres"
      },
      {
        "left": "Gamma",
        "right": "Hundreds of kilometres or more (barely absorbed by air)"
      }
    ],
    "marks": 3,
    "explanation": "These are typical ranges in air for the three radiations. The ordering matches the ionising and penetration patterns: alpha is highly ionising, so it is absorbed quickly; gamma is barely ionising, so it travels far."
  },
  {
    "id": "background_definition_fillblank",
    "tags": [
      "background",
      "definition"
    ],
    "specRefs": [
      "7.10"
    ],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "Complete the definition:\nBackground radiation is the low-level {} radiation that is always present in the environment, from a mixture of {} and human-made sources.",
    "blanks": [
      {
        "expected": [
          "ionising",
          "ionizing"
        ]
      },
      {
        "expected": [
          "natural"
        ]
      }
    ],
    "marks": 2,
    "explanation": "It is 'background' because it is always there, regardless of any specific source we are studying. Most of it comes from natural sources (radon, cosmic rays, food, rocks); only a small fraction comes from human activity (mostly medical X-rays)."
  },
  {
    "id": "background_sources_categorise",
    "tags": [
      "background"
    ],
    "specRefs": [
      "7.10"
    ],
    "difficultyRating": 2,
    "type": "categorise",
    "prompt": "Sort each source of background radiation into 'natural' or 'human-made'.",
    "bins": [
      "Natural",
      "Human-made"
    ],
    "items": [
      {
        "text": "Radon gas from rocks and soil",
        "bin": "Natural"
      },
      {
        "text": "Cosmic rays from space",
        "bin": "Natural"
      },
      {
        "text": "Naturally radioactive isotopes in food (e.g. potassium-40)",
        "bin": "Natural"
      },
      {
        "text": "Granite and other rocks",
        "bin": "Natural"
      },
      {
        "text": "Medical X-rays and CT scans",
        "bin": "Human-made"
      },
      {
        "text": "Nuclear weapons fallout",
        "bin": "Human-made"
      },
      {
        "text": "Waste from nuclear power stations",
        "bin": "Human-made"
      }
    ],
    "marks": 7,
    "explanation": "About 85% of average background radiation in the UK comes from natural sources, with radon gas the largest single contributor. The human-made fraction is dominated by medical procedures.",
    "examinerNote": "Past papers cite radon, cosmic rays, rocks, food and medical X-rays most often. Answers like 'sound' or 'electricity' are rejected — they are not radiation."
  },
  {
    "id": "background_subtraction_mcq",
    "type": "mcq",
    "tags": [
      "background",
      "practical_penetration"
    ],
    "specRefs": [
      "7.6",
      "7.10"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Before measuring the count rate from a radioactive source, a student measures the count rate at the detector with no source nearby. Why is this measurement needed?",
    "choices": [
      "to measure the background count rate, so it can be subtracted from later readings",
      "to check that the detector is working correctly",
      "to make the experiment a fair test",
      "because radiation is dangerous, so the lab must be checked first"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Examiners reject 'check the detector works' for this question. The actual reason is to find the background, not to test the equipment.",
      "2": "'Fair test' on its own is a vague phrase that examiners reject for this question. You need to say what's being kept fair (the background contribution) and how (by subtraction).",
      "3": "Background radiation is everywhere all the time; it doesn't need to be checked beforehand for safety. The reason is about subtracting it from the reading."
    },
    "explanation": "Background radiation is always present, so the count rate from the source alone is the source-plus-background reading minus the background reading. Without measuring the background first, the source's count rate cannot be calculated.",
    "examinerNote": "Past-paper mark schemes for this question accept 'subtract / allow for / correct for the background'. They explicitly reject 'fair test' and 'check the detector works'."
  },
  {
    "id": "halflife_definition_fillblank",
    "tags": [
      "halflife",
      "definition"
    ],
    "specRefs": [
      "7.12"
    ],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "Complete the definition:\nThe half-life of a radioactive isotope is the time taken for the number of unstable {} in a sample to {} (or, equivalently, for the activity of the sample to {}).",
    "blanks": [
      {
        "expected": [
          "nuclei",
          "atoms"
        ]
      },
      {
        "expected": [
          "halve",
          "half"
        ]
      },
      {
        "expected": [
          "halve",
          "half"
        ]
      }
    ],
    "marks": 3,
    "explanation": "Two ways to say the same thing. Either 'half the unstable nuclei have decayed' or 'the activity has dropped to half its starting value'.",
    "examinerNote": "Past-paper mark schemes (Q15) accept either angle: 'time for activity to halve' OR 'time for half the radioactive nuclei/atoms/isotope/mass to decay'. They reject 'half the time' (a common student misreading)."
  },
  {
    "id": "halflife_meaning_mcq",
    "tags": [
      "halflife"
    ],
    "specRefs": [
      "7.12"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "The half-life of a radioactive isotope is the time taken for:",
    "choices": [
      "The activity of a sample to halve",
      "All of the nuclei in a sample to decay",
      "The radiation to travel half its usual distance",
      "Half of one nucleus to decay"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Decay never finishes completely — the activity just keeps halving.",
      "2": "Half-life is about the activity (or number of nuclei), not about how far the radiation travels.",
      "3": "A nucleus either decays or doesn't. It can't 'half-decay'."
    },
    "explanation": "Half-life is the time for the activity (count rate) of a sample to drop to half its previous value. After one half-life, half remain undecayed; after two, a quarter remain; and so on."
  },
  {
    "id": "halflife_temperature_independent_mcq",
    "tags": [
      "halflife"
    ],
    "specRefs": [
      "7.12"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "If you heat up a radioactive sample, its half-life:",
    "choices": [
      "Stays the same",
      "Gets shorter",
      "Gets longer",
      "Becomes zero"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Heating speeds up chemical reactions because it changes how electrons interact, but it does not affect the nucleus, which is where decay happens.",
      "2": "Cooling doesn't change it either. Half-life is a property of the nucleus, not its surroundings.",
      "3": "Heating doesn't stop or start nuclear decay. The nuclei carry on at their fixed probability."
    },
    "explanation": "Half-life is a property of the nucleus and is unaffected by temperature, pressure, or chemical state. The same isotope has the same half-life whether it is in a cold rock, a hot star, a chemical compound, or a free atom."
  },
  {
    "id": "halflife_isotope_specific_mcq",
    "tags": [
      "halflife"
    ],
    "specRefs": [
      "7.12"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Choose the most accurate statement about half-lives.",
    "choices": [
      "Different isotopes have different half-lives, but a given isotope always has the same half-life.",
      "All radioactive isotopes have the same half-life.",
      "An isotope's half-life depends on how much of it you have.",
      "An isotope's half-life depends on the temperature."
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Half-lives range from fractions of a second to longer than the age of the universe, depending on the isotope.",
      "2": "A larger sample has more activity (more decays per second), but the half-life — the time for the activity to halve — is unchanged.",
      "3": "Half-life is a fixed property of the nucleus."
    },
    "explanation": "Each radioactive isotope has its own characteristic half-life. Carbon-14 is about 5,700 years; iodine-131 is about 8 days; uranium-238 is about 4.5 billion years. But for any given isotope, that half-life is fixed and the same everywhere."
  },
  {
    "id": "long_vs_short_halflife_matching",
    "tags": [
      "halflife"
    ],
    "specRefs": [
      "7.12"
    ],
    "difficultyRating": 2,
    "type": "matching",
    "prompt": "Each row shows an isotope and its half-life. Match it to what happens to a sample's activity over the course of one year.",
    "pairs": [
      {
        "left": "Carbon-14 (half-life ≈ 5700 years)",
        "right": "Activity barely changes"
      },
      {
        "left": "Iodine-131 (half-life ≈ 8 days)",
        "right": "Activity falls to essentially zero"
      },
      {
        "left": "Cobalt-60 (half-life ≈ 5 years)",
        "right": "Activity drops noticeably but most remains"
      }
    ],
    "marks": 3,
    "explanation": "The number of half-lives that fit in one year tells you how much the activity has dropped. For carbon-14, one year is much less than a single half-life — barely a dent. For cobalt-60, one year is a fifth of a half-life — a noticeable fall, but most still remains. For iodine-131, a year is about 45 half-lives — the activity halves 45 times, which leaves essentially nothing."
  },
  {
    "id": "isotopes_chemistry_electrons_fillblank",
    "tags": [
      "atomic_struct",
      "halflife"
    ],
    "specRefs": [
      "7.3"
    ],
    "difficultyRating": 2,
    "type": "fillblank",
    "prompt": "Two isotopes of the same element behave identically in chemical reactions. Complete the explanation:\nChemical behaviour depends on an atom's {}. Isotopes of an element have the same number of {} (because they have the same number of {}), so they react in the same way.",
    "blanks": [
      {
        "expected": [
          "electrons"
        ]
      },
      {
        "expected": [
          "electrons"
        ]
      },
      {
        "expected": [
          "protons"
        ]
      }
    ],
    "marks": 3,
    "explanation": "Chemistry is about how atoms exchange or share electrons. Two isotopes have the same proton number (so the neutral atoms have the same electron count and the same electron arrangement), and that's what determines chemical behaviour."
  },
  {
    "id": "chemistry_vs_radioactivity_matching",
    "tags": [
      "atomic_struct",
      "halflife",
      "ionising_random"
    ],
    "specRefs": [
      "7.3",
      "7.4"
    ],
    "difficultyRating": 3,
    "type": "matching",
    "prompt": "Match each property of an atom to the part of the atom that determines it.",
    "pairs": [
      {
        "left": "Chemical behaviour",
        "right": "Electrons"
      },
      {
        "left": "Whether (and how fast) the atom decays radioactively",
        "right": "Nucleus"
      },
      {
        "left": "Mass of the atom (almost all of it)",
        "right": "Nucleus"
      }
    ],
    "marks": 3,
    "explanation": "Chemistry is electron-driven, so all isotopes of an element behave the same way in chemical reactions. Radioactivity is nucleus-driven, and isotopes can have very different nuclear stabilities — which is why two atoms with identical chemistry (like carbon-12 and carbon-14) can have completely different radioactive properties."
  },
  {
    "id": "name_a_background_source_short",
    "tags": [
      "background"
    ],
    "specRefs": [
      "7.10"
    ],
    "difficultyRating": 1,
    "type": "short",
    "prompt": "Name one source of background radiation.",
    "marks": 1,
    "markPoints": [
      {
        "any": [
          "cosmic rays",
          "cosmic radiation",
          "radiation from space",
          "the Sun",
          "Sun",
          "radon",
          "radon gas",
          "rocks",
          "granite",
          "radioactive rocks",
          "soil",
          "food",
          "bananas",
          "potassium-40 in food",
          "Brazil nuts",
          "medical X-rays",
          "X-rays",
          "nuclear power waste",
          "nuclear waste"
        ]
      }
    ],
    "allowAdjust": true,
    "explanation": "Any one of: cosmic rays from space, radon gas from rocks/soil, granite or other rocks, naturally radioactive isotopes in food (e.g. potassium-40 in bananas), medical X-rays, or nuclear waste. The two answers most commonly accepted by examiners are 'cosmic rays' and 'radon gas'.",
    "examinerNote": "Past papers (Q23 Nov 2020) accept any single named source. Vague answers like 'radiation' or 'space' alone don't score; you need a specific source."
  },
  {
    "id": "halflife_is_fixed_mcq",
    "tags": [
      "halflife"
    ],
    "specRefs": [
      "7.12"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Which of the following statements about the half-life of a radioactive isotope is correct?",
    "choices": [
      "The half-life is fixed; it cannot be changed by chemical or physical conditions.",
      "The half-life can be made shorter by heating the sample.",
      "The half-life can be made shorter by reacting the sample chemically.",
      "The half-life depends on how much of the substance you have."
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Heating affects how electrons interact (chemistry), not the nucleus, where decay happens.",
      "2": "Chemical reactions involve electrons, not the nucleus. The nucleus is unaffected.",
      "3": "More of the substance means more decays per second (higher activity), but the half-life — the time for the activity to halve — is unchanged."
    },
    "explanation": "Half-life is a property of the nucleus and is unaffected by temperature, pressure, chemical state, or sample size. Once you know which isotope you have, the half-life is fixed."
  },
  {
    "id": "one_bq_meaning_mcq",
    "tags": [
      "units"
    ],
    "specRefs": [
      "7.1"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "1 becquerel (Bq) is equal to:",
    "choices": [
      "1 decay per second",
      "1 decay per minute",
      "1 decay per hour",
      "100 decays per second"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "1 decay per minute would be too small a unit. The Bq is per second.",
      "2": "1 decay per hour is far too small. The Bq is per second.",
      "3": "100 decays per second would be 100 Bq, not 1 Bq."
    },
    "explanation": "1 Bq = 1 decay per second. So a sample with activity 50 Bq has 50 decays happening every second."
  },
  {
    "id": "proton_charge_mcq",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "What is the charge of a proton?",
    "choices": [
      "+1",
      "−1",
      "0",
      "+2"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "−1 is the charge of an electron, not a proton.",
      "2": "0 is the charge of a neutron, not a proton.",
      "3": "+2 is the charge of an alpha particle (which contains two protons)."
    },
    "explanation": "A proton has charge +1."
  },
  {
    "id": "neutron_charge_mcq",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "What is the charge of a neutron?",
    "choices": [
      "0 (no charge)",
      "+1",
      "−1",
      "+2"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "+1 is the charge of a proton. The neutron is the uncharged particle.",
      "2": "−1 is the charge of an electron. The neutron has no charge.",
      "3": "+2 is the charge of an alpha particle (two protons). A single neutron has charge 0."
    },
    "explanation": "A neutron has no charge — that's why it's called a neutron."
  },
  {
    "id": "electron_charge_mcq",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "What is the charge of an electron?",
    "choices": [
      "−1",
      "+1",
      "0",
      "−2"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "+1 is the charge of a proton. Electrons are negatively charged.",
      "2": "0 is the charge of a neutron. Electrons are negatively charged.",
      "3": "−2 is too large in magnitude. A single electron has charge −1."
    },
    "explanation": "An electron has charge −1."
  },
  {
    "id": "proton_vs_electron_mass_mcq",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Compared to an electron, the mass of a proton is:",
    "choices": [
      "About 2000 times bigger",
      "About 2 times bigger",
      "About the same",
      "About 100 times smaller"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Much closer to 2000 times. Two times is far too small a ratio.",
      "2": "Protons and electrons have very different masses. The proton is far more massive.",
      "3": "The proton is much MORE massive than the electron, not less."
    },
    "explanation": "A proton is about 1836 times more massive than an electron. Most of the mass of an atom is in its nucleus."
  },
  {
    "id": "where_is_the_mass_mcq",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Where in an atom would you find most of its mass?",
    "choices": [
      "In the electron shells",
      "Spread evenly across the atom",
      "In the nucleus",
      "In empty space"
    ],
    "answerIndex": 2,
    "marks": 1,
    "distractorRationales": {
      "0": "Electrons have very small mass; the shells contribute almost nothing to total mass.",
      "1": "Mass is concentrated, not spread evenly.",
      "3": "Empty space has no mass."
    },
    "explanation": "Almost all of the mass of an atom is in the nucleus, because protons and neutrons are much more massive than electrons."
  },
  {
    "id": "isotope_definition_mcq",
    "tags": [
      "atomic_struct",
      "nuclide_notation"
    ],
    "specRefs": [
      "7.3"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Two isotopes of the same element have:",
    "choices": [
      "The same number of protons but different numbers of neutrons",
      "The same number of neutrons but different numbers of protons",
      "Different numbers of protons and different numbers of neutrons",
      "The same number of protons and the same number of neutrons"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Isotopes have the same protons (same element); different neutrons. This describes the wrong way round.",
      "2": "Different protons would mean different elements, not isotopes.",
      "3": "Isotopes are different from each other — having all three quantities the same would mean the same isotope."
    },
    "explanation": "Isotopes have the same atomic number (so same element) but different mass numbers (different neutron count)."
  },
  {
    "id": "isotopes_same_chemistry_mcq",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.3"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Two isotopes of the same element behave the same in chemical reactions because they have:",
    "choices": [
      "The same number of electrons",
      "The same number of neutrons",
      "The same mass",
      "The same colour"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Number of neutrons differs between isotopes — that's their defining feature, not the reason chemistry is the same.",
      "2": "Isotopes of the same element have different masses (different mass numbers).",
      "3": "Colour isn't usually relevant to elemental chemistry, and isotopes look the same anyway."
    },
    "explanation": "Chemistry depends on electron arrangement. Isotopes of the same element have the same number of protons and therefore the same number of electrons, so the chemistry is identical."
  },
  {
    "id": "decay_random_predictable_mcq",
    "tags": [
      "ionising_random",
      "halflife"
    ],
    "specRefs": [
      "7.4",
      "7.12"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Which of the following best describes radioactive decay?",
    "choices": [
      "Predictable for both individual nuclei and large samples",
      "Unpredictable for both individual nuclei and large samples",
      "Unpredictable for individual nuclei, but predictable on average for large samples",
      "Predictable for individual nuclei, but unpredictable on average for large samples"
    ],
    "answerIndex": 2,
    "marks": 1,
    "distractorRationales": {
      "0": "Individual decays are unpredictable.",
      "1": "Large samples are predictable on average.",
      "3": "This reverses the truth: individuals are unpredictable, samples are predictable on average."
    },
    "explanation": "Individual nuclear decays are unpredictable in time, but for a large enough sample the average behaviour is well-defined and predictable. This is the central idea of random radioactive decay."
  },
  {
    "id": "ionisation_meaning_mcq",
    "tags": [
      "ionising_random"
    ],
    "specRefs": [
      "7.4"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Ionisation means:",
    "choices": [
      "Removing an electron from an atom",
      "Adding an electron to an atom",
      "Splitting a nucleus",
      "Joining two atoms together"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Adding an electron is the OPPOSITE of ionisation.",
      "2": "Splitting a nucleus is fission, not ionisation.",
      "3": "Joining atoms is bonding, not ionisation."
    },
    "explanation": "Ionisation is the removal of one or more electrons, leaving a positively charged ion."
  },
  {
    "id": "ionising_ranking_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "atoms": [
      "alpha_ionising",
      "beta_ionising",
      "gamma_ionising"
    ],
    "prompt": "List the three nuclear radiations in order from highest ionising ability to lowest.",
    "choices": [
      "Alpha, beta, gamma",
      "Gamma, beta, alpha",
      "Beta, alpha, gamma",
      "Alpha, gamma, beta"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "This is the order of penetrating power (highest to lowest), not ionising ability.",
      "2": "Alpha is the most ionising of the three, not the second.",
      "3": "Gamma is the least ionising, not the second."
    },
    "explanation": "Ionising ability: alpha > beta > gamma. Penetrating power runs in the opposite direction (gamma > beta > alpha). Remembering them as opposites helps avoid mixing them up."
  },
  {
    "id": "which_is_em_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which of the following nuclear radiations is electromagnetic?",
    "choices": [
      "Alpha",
      "Beta",
      "Gamma",
      "All of them"
    ],
    "answerIndex": 2,
    "marks": 1,
    "distractorRationales": {
      "0": "Alpha is a particle (two protons and two neutrons), not an electromagnetic wave.",
      "1": "Beta is a fast-moving electron, a particle, not an electromagnetic wave.",
      "3": "Only gamma is electromagnetic; alpha and beta are particles."
    },
    "explanation": "Gamma radiation is high-frequency electromagnetic radiation. Alpha is a helium nucleus (a particle) and beta is a fast-moving electron (a particle)."
  },
  {
    "id": "best_phrasing_for_beta_mcq",
    "tags": [
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Which of the following is the most accurate description of beta radiation?",
    "choices": [
      "A fast electron from outside the atom",
      "A fast-moving electron emitted from the nucleus",
      "An electron orbiting the nucleus at high speed",
      "A particle that comes from the electron shell"
    ],
    "answerIndex": 1,
    "marks": 1,
    "distractorRationales": {
      "0": "Beta does not come from outside the atom; it comes from the nucleus.",
      "2": "Orbiting electrons are not beta radiation. Beta is emitted, not orbiting.",
      "3": "Beta comes from the nucleus, not the electron shell."
    },
    "explanation": "Beta is a fast-moving electron emitted from the nucleus. Even though it is an electron, it does not come from the electron shell; it comes from a neutron decaying inside the nucleus.",
    "examinerNote": "This is the precise phrasing examiners look for. 'Electron from outside the atom' or 'orbiting electron' are both rejected."
  },
  {
    "id": "spot_the_false_penetration_mcq",
    "tags": [
      "penetration"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Which of the following statements is FALSE?",
    "choices": [
      "Alpha has the highest ionising ability of the three radiations.",
      "Gamma can travel hundreds of kilometres through air before being absorbed.",
      "Beta is absorbed by a sheet of paper.",
      "Lead is more effective than aluminium at absorbing gamma."
    ],
    "answerIndex": 2,
    "marks": 1,
    "distractorRationales": {
      "0": "True. Alpha is the most ionising.",
      "1": "True. Gamma's range in air is hundreds of kilometres.",
      "3": "True. Lead is denser and so absorbs gamma more effectively than aluminium of the same thickness."
    },
    "explanation": "Beta is NOT absorbed by paper; it passes through paper almost unchanged. Beta is absorbed by a few mm of aluminium. The other three statements are all true."
  },
  {
    "id": "ionising_penetration_link_mcq",
    "tags": [
      "penetration",
      "radiation_types"
    ],
    "specRefs": [
      "7.5"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Choose the best statement about the link between ionising ability and penetrating power.",
    "choices": [
      "Highly penetrating means highly dangerous.",
      "Highly ionising means highly penetrating.",
      "Radiation that is highly ionising tends not to penetrate far, and vice versa.",
      "Penetrating power and ionising ability are unrelated."
    ],
    "answerIndex": 2,
    "marks": 1,
    "distractorRationales": {
      "0": "Whether something is dangerous depends on the situation (e.g. inside or outside the body), not just on penetration.",
      "1": "These are inversely related, not the same.",
      "3": "They are linked: highly ionising radiation uses up its energy quickly, so does not penetrate far."
    },
    "explanation": "Radiation that is highly ionising tends not to penetrate far, because each ionisation uses energy, so highly ionising radiation runs out of energy in a short distance. The opposite holds too: low-ionising radiation can travel further before being absorbed."
  },
  {
    "id": "background_meaning_mcq",
    "tags": [
      "background"
    ],
    "specRefs": [
      "7.10"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Background radiation is:",
    "choices": [
      "Ionising radiation that is always present in the environment",
      "Radiation only present near nuclear power stations",
      "Radiation only present during a thunderstorm",
      "Radiation that comes only from radioactive sources in a school lab"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Background radiation is everywhere, not just near nuclear power stations.",
      "2": "Background is always present, not only during storms.",
      "3": "Background includes natural sources too — it's not just from labs."
    },
    "explanation": "Background radiation is the low level of ionising radiation that is always present everywhere, from natural and human-made sources."
  },
  {
    "id": "not_a_background_source_mcq",
    "tags": [
      "background"
    ],
    "specRefs": [
      "7.10"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which of the following is NOT a source of background radiation?",
    "choices": [
      "Cosmic rays from space",
      "Radon gas from rocks",
      "Potassium-40 in bananas",
      "Sound waves from traffic"
    ],
    "answerIndex": 3,
    "marks": 1,
    "distractorRationales": {
      "0": "Cosmic rays are a major source.",
      "1": "Radon from rocks (especially granite) is a major source.",
      "2": "Potassium-40 in bananas is a small but real source."
    },
    "explanation": "Sound waves are not a form of ionising radiation, so they do not contribute to background radiation. The other three are all genuine sources."
  },
  {
    "id": "no_source_count_rate_mcq",
    "tags": [
      "background",
      "practical_penetration"
    ],
    "specRefs": [
      "7.6",
      "7.10"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which of the following best describes what would happen if a Geiger-Müller tube was switched on with no radioactive source nearby?",
    "choices": [
      "The count rate would be exactly zero",
      "The count rate would be a small but non-zero number",
      "The tube would not work at all",
      "The count rate would be very high"
    ],
    "answerIndex": 1,
    "marks": 1,
    "distractorRationales": {
      "0": "Background radiation is always present, so the count is not exactly zero.",
      "2": "The tube works fine; it just picks up background.",
      "3": "Background levels are normally low, not high."
    },
    "explanation": "The detector would pick up the background radiation that is always present in the environment, giving a small but non-zero count rate. Typical background count rates are a few counts per minute."
  },
  {
    "id": "halflife_single_nucleus_mcq",
    "tags": [
      "halflife",
      "ionising_random"
    ],
    "specRefs": [
      "7.12",
      "7.4"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "What does it mean to say that the half-life of carbon-14 is 5700 years?",
    "choices": [
      "Every individual carbon-14 nucleus will decay after exactly 5700 years",
      "In a sample of carbon-14, on average half of the nuclei will have decayed after 5700 years",
      "Carbon-14 only exists for 5700 years before disappearing",
      "Carbon-14 stops being radioactive after 5700 years"
    ],
    "answerIndex": 1,
    "marks": 1,
    "distractorRationales": {
      "0": "Individual nuclei decay at random times; you cannot say any particular one will decay at exactly 5700 years.",
      "2": "Carbon-14 exists for much longer than 5700 years; the activity just halves every 5700 years.",
      "3": "Carbon-14 remains radioactive; the activity halves every half-life but never quite reaches zero."
    },
    "explanation": "Half-life is a statistical property of a sample, not a property of individual nuclei. It means that in a sample of carbon-14, on average half the nuclei will have decayed after 5700 years. After another 5700 years, half of what remained will have decayed, and so on. Individual nuclei decay at random times; you cannot say of any particular one when it will decay."
  },
  {
    "id": "gm_tube_function_mcq",
    "tags": [
      "practical_penetration"
    ],
    "specRefs": [
      "7.6"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "What is a Geiger-Müller (GM) tube used for?",
    "choices": [
      "Detecting and counting individual ionising particles",
      "Measuring the temperature of a radioactive source",
      "Producing a radioactive source",
      "Shielding the user from radiation"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "GM tubes don't measure temperature.",
      "2": "GM tubes detect radiation; they don't produce it.",
      "3": "GM tubes are detectors, not shields. Lead is the standard shield against gamma."
    },
    "explanation": "A GM tube detects ionising radiation. Each ionising particle entering the tube triggers a small electrical pulse, which is counted. The 'count rate' (counts per minute or counts per second) is then a measure of how much ionising radiation is reaching the tube.",
    "examinerNote": "Past-paper mark schemes (Q20) accept 'GM tube', 'Geiger-Müller (detector)', 'GM detector', or 'Geiger counter'."
  },
  {
    "id": "penetration_apparatus_multiselect",
    "tags": [
      "practical_penetration"
    ],
    "specRefs": [
      "7.6"
    ],
    "difficultyRating": 2,
    "type": "multiselect",
    "prompt": "A student wants to investigate which materials best absorb radiation from a radioactive source. Tick all the items that the student needs.",
    "choices": [
      "A radioactive source",
      "A Geiger-Müller tube and counter",
      "Sheets of paper, aluminium and lead to use as absorbers",
      "A stopwatch or timer (so count rate can be calculated)",
      "A magnet to deflect the radiation",
      "A thermometer to measure source temperature",
      "A microscope to see the radiation"
    ],
    "answerIndices": [
      0,
      1,
      2,
      3
    ],
    "distractorRationales": {
      "4": "A magnet deflects alpha and beta but isn't part of an absorption experiment.",
      "5": "Source temperature has no effect on radioactive decay or detection.",
      "6": "Radiation cannot be seen with a microscope. Detection must be done with a GM tube."
    },
    "marks": 4,
    "markingMode": "penalty",
    "explanation": "A standard absorption experiment needs: a source, a detector (GM tube + counter), the absorbers being tested, and a way to time the counts so a count rate can be calculated. The geometry (distances) must also be kept fixed, but no specific extra apparatus is needed for that beyond a ruler."
  },
  {
    "id": "practical_method_ordering",
    "tags": [
      "practical_penetration"
    ],
    "specRefs": [
      "7.6"
    ],
    "difficultyRating": 2,
    "type": "ordering",
    "prompt": "Put these steps for a radiation absorption experiment into the correct order.",
    "items": [
      "Set up the GM tube and counter at a fixed distance from where the source will go.",
      "With no source present, measure the background count rate.",
      "Place the radioactive source at the fixed distance from the GM tube and record the count rate.",
      "Place an absorber (e.g. paper, aluminium, lead) between source and tube and record the new count rate.",
      "Subtract the background count rate from each measurement to get the corrected count rate.",
      "Compare the corrected count rates to see how much each material absorbs."
    ],
    "marks": 5,
    "markingMode": "per_position",
    "explanation": "Background must be measured before the source is brought in (otherwise it would contaminate the reading). Geometry is fixed first so that all source-with-absorber readings can be compared on the same basis. Subtracting background gives the count rate due to the source alone, which is the meaningful quantity to compare across absorbers.",
    "examinerNote": "Past-paper Q15 mark schemes accept variations on this order, but always require: fix geometry, measure background, then make readings with each absorber, then subtract background."
  },
  {
    "id": "background_subtraction_calc_numeric",
    "type": "numeric",
    "tags": [
      "practical_penetration",
      "background"
    ],
    "specRefs": [
      "7.6",
      "7.10"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "A student records the count rate from a Geiger-Müller tube with no source nearby as 25 counts per minute. They then place a radioactive source near the tube and record 175 counts per minute. State the corrected count rate from the source alone, in counts per minute.",
    "answer": 150,
    "unitHint": "counts per minute",
    "explanation": "Subtract the background count rate from the source-plus-background count rate: 175 − 25 = 150 counts per minute.",
    "examinerNote": "Unit is specified in the prompt so a bare numeric answer is sufficient. The engine's numeric-type marker handles the comparison."
  },
  {
    "id": "is_it_radioactive_mcq",
    "tags": [
      "practical_penetration",
      "background"
    ],
    "specRefs": [
      "7.6",
      "7.10"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "A student records a background count rate of 20 counts per minute. They then place a sample close to the GM tube and record 22 counts per minute. What can they reasonably conclude?",
    "choices": [
      "The sample is barely above background; they cannot conclude that it is significantly radioactive.",
      "The sample has an activity of 22 Bq.",
      "The sample is highly radioactive.",
      "The GM tube is broken."
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Counts per minute and Bq are not the same unit. And in this case, almost all the counts are background, not from the sample.",
      "2": "A reading only just above background suggests a weakly radioactive (or non-radioactive) sample, not a strongly radioactive one.",
      "3": "Picking up background is exactly what a working GM tube should do."
    },
    "explanation": "The corrected count rate (22 − 20 = 2 counts/min) is so close to zero that we can't tell it apart from natural variation in the background. Background itself fluctuates randomly. To conclude a sample is significantly radioactive, you need its corrected count rate to be clearly above the background — typically several times the natural variation."
  },
  {
    "id": "identifying_radiation_grid",
    "tags": [
      "practical_penetration",
      "penetration"
    ],
    "specRefs": [
      "7.5",
      "7.6"
    ],
    "difficultyRating": 3,
    "type": "grid",
    "prompt": "A student measures the corrected count rate from an unknown source with different absorbers. From the patterns shown below, identify which radiation(s) the source is emitting. Tick every radiation present.",
    "rows": [
      "Pattern 1: Paper drops the count to background; aluminium and lead make no further difference.",
      "Pattern 2: Paper has no effect; aluminium drops the count to background.",
      "Pattern 3: Paper has no effect; aluminium has no effect; lead reduces the count substantially.",
      "Pattern 4: Paper drops the count partially; aluminium drops it further; lead drops it to background."
    ],
    "columns": [
      "Alpha",
      "Beta",
      "Gamma"
    ],
    "correct": {
      "0": [
        0
      ],
      "1": [
        1
      ],
      "2": [
        2
      ],
      "3": [
        0,
        1,
        2
      ]
    },
    "marks": 4,
    "markingMode": "per_row",
    "explanation": "The standard inference pattern: paper absorbs alpha (and only alpha) → if paper drops the count, alpha is present; aluminium absorbs beta but not gamma → if aluminium drops the count further (after paper), beta is present; lead absorbs gamma → if lead reduces the count further, gamma is present. Pattern 4 shows all three radiations present (each absorber removes another component).",
    "examinerNote": "This is the standard 4SS0 inference task (Q48 June 2023). Mark schemes accept 'idea that count from alpha is decreased by paper and aluminium and lead', 'idea that count from beta is decreased by aluminium and lead' (i.e. counting layers): the contributory accumulation of each absorber is the marking point."
  },
  {
    "id": "safety_precautions_multiselect",
    "tags": [
      "practical_penetration"
    ],
    "specRefs": [
      "7.6"
    ],
    "difficultyRating": 2,
    "type": "multiselect",
    "prompt": "A teacher is about to demonstrate radiation experiments with a sealed source. Tick all the precautions they should take.",
    "choices": [
      "Increase the distance between the source and people",
      "Minimise the time the source is out of its storage box",
      "Use tongs or a long handle, not bare hands, when moving the source",
      "Keep the source pointed away from the audience",
      "Store the source in a lead-lined box when not in use",
      "Eat and drink in the lab as normal",
      "Heat the source to make it less radioactive"
    ],
    "answerIndices": [
      0,
      1,
      2,
      3,
      4
    ],
    "distractorRationales": {
      "5": "Eating or drinking in the lab risks ingesting any radioactive material that has somehow contaminated surfaces. Always banned.",
      "6": "Heating does not change radioactive decay. The activity is unaffected by temperature."
    },
    "marks": 5,
    "markingMode": "penalty",
    "explanation": "The standard precautions are: distance (the inverse-square law makes a big difference), time (less exposure means less dose), shielding (lead box, behind a screen), and not pointing the source at anyone. Tongs or a long handle keep the source away from skin. The two distractors are eating/drinking in the lab (a contamination risk) and heating the source (which does nothing).",
    "examinerNote": "Past-paper Q20 mark scheme: 'any two from: increase distance from source; idea of minimising time of exposure; not pointing source at teacher/people; handle source with tongs / wear gloves; idea of shielding between teacher and source'."
  },
  {
    "id": "contamination_meaning_mcq",
    "tags": [
      "contam_irrad"
    ],
    "specRefs": [
      "7.15"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Contamination (in the context of nuclear radiation) means:",
    "choices": [
      "Radioactive material getting onto or into a non-radioactive object",
      "Being exposed to radiation from outside",
      "A nucleus splitting in two",
      "An electron being removed from an atom"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Exposure from outside is irradiation, not contamination.",
      "2": "A nucleus splitting is fission, not contamination.",
      "3": "Removing an electron is ionisation, not contamination."
    },
    "explanation": "Contamination is when radioactive material is transferred onto (or into) something that wasn't radioactive before. The contaminated object then carries the radioactive material with it and continues to emit radiation until the material is removed or decays."
  },
  {
    "id": "irradiation_meaning_mcq",
    "tags": [
      "contam_irrad"
    ],
    "specRefs": [
      "7.15"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Irradiation (in the context of nuclear radiation) means:",
    "choices": [
      "Being exposed to ionising radiation from a source",
      "Radioactive material getting onto or into an object",
      "Becoming radioactive after exposure",
      "Eating food that emits radiation"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Radioactive material on or in an object is contamination, not irradiation.",
      "2": "Irradiated objects do NOT become radioactive (this is a common student misconception).",
      "3": "Eating radioactive food is contamination (the radioactive material is now inside the body)."
    },
    "explanation": "Irradiation is exposure to ionising radiation. The radiation reaches the body or object from a source, but no radioactive material is transferred. Once the source is removed, the irradiation stops."
  },
  {
    "id": "irradiated_does_not_become_radioactive_mcq",
    "tags": [
      "contam_irrad"
    ],
    "specRefs": [
      "7.15"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "An object has been irradiated by a gamma source for several minutes. Which statement is correct?",
    "choices": [
      "The object does NOT become radioactive itself",
      "The object becomes weakly radioactive itself",
      "The object becomes strongly radioactive itself",
      "The object's radioactivity depends on its colour"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Irradiation does not transfer radioactive material. The object is not contaminated by being exposed.",
      "2": "Same reasoning. Irradiation does not make objects radioactive.",
      "3": "Colour has nothing to do with it."
    },
    "explanation": "Irradiation does not make an object radioactive. This is why irradiated food (used to kill bacteria) is safe to eat afterwards: the radiation passes through but no radioactive material is left behind.",
    "examinerNote": "This is one of the most common student misconceptions. The 4PH1 Q34 mark scheme rewards 'fruit has not been made radioactive' as one of the marks for explaining why irradiated fruit is safe."
  },
  {
    "id": "contam_vs_irrad_grid",
    "tags": [
      "contam_irrad"
    ],
    "specRefs": [
      "7.15"
    ],
    "difficultyRating": 2,
    "type": "grid",
    "prompt": "For each feature, tick whether it applies to contamination, irradiation, or both.",
    "rows": [
      "The radioactive source must be in physical contact (or transferred) with the body or object",
      "The object can be exposed without itself becoming radioactive",
      "The exposure stops as soon as you move away from the source",
      "The radioactive material may have to be washed off or wait to decay"
    ],
    "columns": [
      "Contamination",
      "Irradiation"
    ],
    "correct": {
      "0": [
        0
      ],
      "1": [
        1
      ],
      "2": [
        1
      ],
      "3": [
        0
      ]
    },
    "marks": 4,
    "markingMode": "per_row",
    "explanation": "Contamination requires physical transfer of radioactive material; irradiation does not. Irradiation stops when you move away or shield yourself; contamination follows the object until the material is removed or has decayed. An irradiated object does not become radioactive itself.",
    "examinerNote": "These distinctions are exactly what the 4SS0 spec point 7.15 expects pupils to know."
  },
  {
    "id": "scenario_categorise",
    "tags": [
      "contam_irrad"
    ],
    "specRefs": [
      "7.15"
    ],
    "difficultyRating": 3,
    "type": "categorise",
    "prompt": "Sort each scenario into the right category.",
    "bins": [
      "Irradiation only",
      "Contamination only",
      "Both irradiation and contamination",
      "Neither"
    ],
    "items": [
      {
        "text": "Standing 5 m from a sealed gamma source for 1 minute",
        "bin": "Irradiation only"
      },
      {
        "text": "Having an X-ray taken at the dentist",
        "bin": "Irradiation only"
      },
      {
        "text": "Inhaling radon gas in a poorly ventilated cellar",
        "bin": "Both irradiation and contamination"
      },
      {
        "text": "A worker spilling a few drops of radioactive liquid onto bare skin",
        "bin": "Both irradiation and contamination"
      },
      {
        "text": "Eating fruit that was irradiated with gamma rays at the supermarket",
        "bin": "Neither"
      },
      {
        "text": "Swallowing a radioactive tracer for a medical scan",
        "bin": "Both irradiation and contamination"
      },
      {
        "text": "Picking up a banana (which contains some potassium-40)",
        "bin": "Both irradiation and contamination"
      }
    ],
    "marks": 7,
    "explanation": "Scenarios where the radioactive material gets onto or into the body (radon, spillage, tracer, banana) involve both contamination and irradiation: the source is in contact, and it is also emitting radiation that reaches surrounding tissue. Sealed sources at a distance and X-ray exposures are irradiation only — no transfer of radioactive material. Irradiated fruit is neither: the food itself is not radioactive (irradiation doesn't make it so) and the gamma source is no longer present.",
    "examinerNote": "The 'irradiated fruit' bin (Neither) is the trickiest. Students often want to call it 'irradiation'. But irradiation requires an ongoing source — once the source is gone, there is no continued exposure and the food carries no radioactive material."
  },
  {
    "id": "contam_vs_irrad_general_mcq",
    "tags": [
      "contam_irrad"
    ],
    "specRefs": [
      "7.15"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Choose the best statement comparing contamination and irradiation.",
    "choices": [
      "Contamination is generally harder to deal with because the source stays with the body.",
      "Contamination is more dangerous than irradiation in all cases.",
      "Irradiation is more dangerous than contamination in all cases.",
      "There is no useful difference between contamination and irradiation."
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Brief contamination of the skin (washed off quickly) can be less dangerous than prolonged high-dose irradiation. Severity depends on the situation.",
      "2": "External irradiation that is brief is much less dangerous than internal contamination.",
      "3": "The difference is real and significant for safety procedures."
    },
    "explanation": "In general, contamination is harder to handle because the source moves with the contaminated object — you can't shield against it by moving away. But which is more dangerous in any specific case depends on the radiation type, the dose, and the duration."
  },
  {
    "id": "rank_scenarios_mcq",
    "tags": [
      "contam_irrad",
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.15",
      "7.16"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "Which of the following scenarios poses the greatest risk to a person?",
    "choices": [
      "Inhaling dust contaminated with an alpha-emitting substance",
      "Standing 5 m away from a sealed gamma source for 1 minute",
      "Holding a sealed alpha source in a gloved hand for 1 minute",
      "Being briefly irradiated by an X-ray during a routine check-up"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Brief gamma exposure at 5 m is a small dose, and the source is sealed so there's no contamination.",
      "2": "Holding a sealed alpha source briefly in a glove is essentially safe: the alpha is absorbed by the casing and the glove prevents skin contamination even if there were a leak.",
      "3": "A single routine X-ray is a low dose and most people receive these routinely."
    },
    "explanation": "Inhaled alpha-emitting dust is the worst case here: the dust gets inside the lungs (so contamination), and once inside, the alpha radiation has nowhere to go but into the surrounding lung tissue, where it is highly damaging because alpha is the most ionising of the three. This is why radon gas (an alpha emitter) is a leading cause of lung cancer.",
    "examinerNote": "The general rule: alpha is most dangerous when inside the body (because then its very short range and high ionisation are channelled directly into tissue); alpha is least dangerous when outside the body (because skin and clothing absorb it before it reaches anything important)."
  },
  {
    "id": "lab_safety_categorise",
    "tags": [
      "contam_irrad",
      "practical_penetration"
    ],
    "specRefs": [
      "7.15",
      "7.6"
    ],
    "difficultyRating": 3,
    "type": "categorise",
    "prompt": "A scientist works with radioactive substances in liquid form. Sort each precaution by its main purpose.",
    "bins": [
      "Mainly prevents contamination",
      "Mainly reduces irradiation"
    ],
    "items": [
      {
        "text": "Wearing gloves",
        "bin": "Mainly prevents contamination"
      },
      {
        "text": "Wearing a lab coat",
        "bin": "Mainly prevents contamination"
      },
      {
        "text": "Working in a fume hood",
        "bin": "Mainly prevents contamination"
      },
      {
        "text": "Storing the source behind a lead screen",
        "bin": "Mainly reduces irradiation"
      },
      {
        "text": "Increasing the distance from the source",
        "bin": "Mainly reduces irradiation"
      },
      {
        "text": "Limiting the time spent handling the source",
        "bin": "Mainly reduces irradiation"
      }
    ],
    "marks": 6,
    "explanation": "Contamination is about radioactive material reaching skin or being inhaled, so contamination precautions are barriers (gloves, coat, fume hood). Irradiation depends on time, distance, and shielding — so irradiation precautions reduce the dose received by limiting one of those three factors."
  },
  {
    "id": "use_of_alpha_short",
    "tags": [
      "uses_alpha"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 1,
    "type": "short",
    "prompt": "State one use of alpha radiation.",
    "marks": 1,
    "markPoints": [
      {
        "any": [
          "smoke alarm",
          "smoke detector",
          "fire alarm",
          "fire detector",
          "smoke detection",
          "static eliminator",
          "remove static",
          "removing static",
          "neutralise static",
          "neutralising static",
          "discharge static",
          "static electricity",
          "anti-static",
          "antistatic",
          "powering spacecraft",
          "spacecraft power",
          "space probe power",
          "powering space probes",
          "powering satellites",
          "RTG",
          "radioisotope thermoelectric generator",
          "radioisotope generator",
          "radiotherapy",
          "treating cancer",
          "treat cancer",
          "cancer treatment"
        ]
      }
    ],
    "allowAdjust": true,
    "explanation": "Common uses of alpha sources: smoke alarms (alpha ionises the air, smoke disrupts the current), static eliminators in industrial machines, and powering long-mission space probes (the heat from decay is converted to electricity).",
    "examinerNote": "Past-paper Q48 (4SS0 June 2023) accepts: 'smoke detectors / radiotherapy / powering spacecraft / static eliminator'. Note 'fire alarms' is allowed."
  },
  {
    "id": "smoke_alarm_radiation_mcq",
    "tags": [
      "uses_alpha"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Smoke alarms typically use a source that emits which radiation?",
    "choices": [
      "Alpha",
      "Beta",
      "Gamma"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Beta would not ionise the air strongly enough at the small range needed inside an alarm. It would also escape the alarm, becoming a safety problem.",
      "2": "Gamma would mostly pass straight through the alarm without ionising the air, so smoke would not be detected. It would also escape the alarm."
    },
    "explanation": "Alpha is highly ionising (so it creates a steady ionised current across the small gap inside the alarm) but has a short range (so it cannot escape the alarm and reach the user). Both properties matter for a smoke detector."
  },
  {
    "id": "smoke_alarm_property_mcq",
    "tags": [
      "uses_alpha"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Why is alpha used in a smoke alarm? Alpha is the radiation that:",
    "choices": [
      "Ionises the air gap strongly, but is stopped inside the device",
      "Has the longest half-life of the three",
      "Has the highest penetrating power",
      "Is the least dangerous"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Half-life isn't the deciding factor for which radiation to choose; it's about the ionising and range properties.",
      "2": "Alpha is the LEAST penetrating, not the most. Inside the alarm this is exactly what we want.",
      "3": "Alpha is actually the MOST dangerous if it gets inside the body. It's safe in this use only because it can't escape the device or penetrate skin."
    },
    "explanation": "Alpha is highly ionising, which is good for ionising the air between the electrodes, and short-range, which means it can't escape the alarm and harm the user."
  },
  {
    "id": "smoke_alarm_halflife_mcq",
    "tags": [
      "uses_alpha",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "A smoke alarm needs a source with a half-life of about:",
    "choices": [
      "Many years",
      "A few hours",
      "A few minutes",
      "A few seconds"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "If the half-life were a few hours, the alarm's source would decay too fast and the alarm would stop working in days.",
      "2": "Same problem, only worse — a few minutes would mean the alarm is only good for a few hours.",
      "3": "Far too short — the source would be gone in seconds."
    },
    "explanation": "A smoke alarm is meant to last many years, so it needs a source whose activity stays roughly constant over that time. Americium-241 (used in most smoke alarms) has a half-life of about 432 years, so its activity barely changes over the lifetime of the alarm."
  },
  {
    "id": "alpha_static_eliminator_mcq",
    "tags": [
      "uses_alpha"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Some industrial machines use a small alpha source to remove static electrical charge from materials moving on a conveyor belt. How does the alpha do this?",
    "choices": [
      "It ionises the air around the material; the ions then neutralise the static charge",
      "It heats the material until the charge dissipates",
      "It magnetises the material so the charge flows away",
      "It absorbs the static charge directly"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Heating doesn't directly remove static charge.",
      "2": "Magnetism is about magnetic field, not electric charge.",
      "3": "Radiation cannot 'absorb' charge from another object."
    },
    "explanation": "Alpha is highly ionising, so it creates many ions in the surrounding air. These ions are attracted to opposite charges on the material's surface, and neutralise them. Alpha's short range is also useful here: the ionisation only happens close to where it's needed."
  },
  {
    "id": "use_of_beta_short",
    "type": "short",
    "tags": [
      "uses_beta"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "State one use of beta radiation.",
    "markPoints": [
      {
        "any": [
          "thickness gauge",
          "thickness gage",
          "gauge for paper",
          "gauge for foil",
          "gauge for aluminium",
          "gauge for thickness",
          "paper gauge",
          "foil gauge",
          "aluminium foil",
          "tin foil",
          "kitchen foil",
          "cooking foil",
          "thin metal foil",
          "thin foil",
          "measure the thickness",
          "measuring thickness",
          "check the thickness",
          "checking thickness",
          "monitor the thickness",
          "monitoring thickness",
          "thickness of paper",
          "thickness of foil",
          "thickness of aluminium",
          "tracer",
          "betalight",
          "beta light",
          "radiotherapy",
          "radio therapy",
          "implant",
          "brachytherapy",
          "radioactive implant"
        ]
      }
    ],
    "allowAdjust": true,
    "explanation": "The classic beta use is a thickness gauge for paper, plastic film, or thin metal (aluminium) foil. Beta is also used in implanted radiotherapy sources (where the beta delivers its energy locally to the tumour) and in betalights (e.g. exit signs).",
    "examinerNote": "Past-paper mark schemes accept 'thickness gauge', 'tracer', and 'radiotherapy' alone. 'Radiotherapy' is broader than the strict 'implanted radiotherapy' answer (since the everyday meaning of radiotherapy is gamma-from-outside) — examiners accept it but a stronger answer specifies 'implant' or 'brachytherapy'."
  },
  {
    "id": "paper_thickness_gauge_radiation_mcq",
    "tags": [
      "uses_beta"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which radiation is used in a thickness gauge for paper or thin aluminium foil?",
    "choices": [
      "Beta",
      "Alpha",
      "Gamma"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha would be completely absorbed by even very thin paper or foil, so the gauge would always read zero. It couldn't detect changes in thickness.",
      "2": "Gamma would pass through paper or thin aluminium foil almost unaffected. The gauge couldn't detect changes in thickness either."
    },
    "explanation": "Beta is partially absorbed by paper or thin aluminium foil. A thicker sheet absorbs more, a thinner one absorbs less, so the count rate at the detector tracks the thickness."
  },
  {
    "id": "thickness_gauge_halflife_mcq",
    "tags": [
      "uses_beta",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "An industrial thickness gauge needs a source with a half-life of about:",
    "choices": [
      "Many years",
      "A few seconds",
      "A few hours",
      "A few days"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Far too short — the source would be gone in seconds.",
      "2": "Still too short. The activity would change noticeably during a single shift, making the gauge unreliable.",
      "3": "Still too short. The source would lose half its activity each few days; the gauge would need constant recalibration."
    },
    "explanation": "A thickness gauge needs to give consistent readings over years. If the source decayed quickly, the count rate would drop over time even if the thickness was unchanged. So the half-life needs to be many years (e.g. strontium-90, 28 years, or krypton-85, 11 years)."
  },
  {
    "id": "use_of_gamma_short",
    "type": "short",
    "tags": [
      "uses_gamma"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "State one use of gamma radiation.",
    "markPoints": [
      {
        "any": [
          "sterilisation",
          "sterilising",
          "sterilize",
          "sterilization",
          "kill bacteria",
          "killing bacteria",
          "kill germs",
          "killing germs",
          "kill microbes",
          "kill microorganisms",
          "preserving food",
          "preserve food",
          "irradiating food",
          "irradiate food",
          "food irradiation",
          "medical equipment",
          "tracer",
          "tracing leaks",
          "trace leaks",
          "tracing pipes",
          "leak detection",
          "find a leak",
          "finding leaks",
          "medical imaging",
          "imaging the body",
          "PET scan",
          "radiotherapy",
          "treating cancer",
          "treat cancer",
          "cancer treatment",
          "gamma knife",
          "kill cancer",
          "killing cancer cells",
          "thickness gauge",
          "steel thickness",
          "thick metal",
          "thick steel",
          "measuring thickness",
          "measure thickness"
        ]
      }
    ],
    "allowAdjust": true,
    "explanation": "Three big categories of use for gamma: (1) sterilisation (kills bacteria on equipment or food, and the radiation passes through packaging); (2) tracers (medical or industrial — gamma can leave the body or pipe and be detected outside); (3) thickness gauges for thick steel or other thick metal (gamma is the only radiation penetrating enough to give a thickness-dependent count rate); (4) radiotherapy (treating cancer with focused gamma beams)."
  },
  {
    "id": "medical_tracer_radiation_mcq",
    "tags": [
      "uses_gamma"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "A patient is given a radioactive tracer (typically by injection) so that a camera outside the body can build an image of where the tracer goes. Which radiation is used?",
    "choices": [
      "Gamma",
      "Alpha",
      "Beta"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha would be absorbed inside the body and never reach the detector outside. It would also be highly damaging to nearby tissue.",
      "2": "Beta is partially absorbed by tissue; only some would escape the body. Gamma is the more reliable choice for imaging."
    },
    "explanation": "A medical tracer is a radioactive substance given to a patient (most commonly by injection, sometimes by inhalation for lung scans, sometimes by swallowing for digestion scans) so that radiation emerging from the body can be detected externally. Gamma is highly penetrating, so it can leave the body and be detected. Alpha and (mostly) beta cannot."
  },
  {
    "id": "medical_tracer_property_mcq",
    "tags": [
      "uses_gamma"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Why is gamma used as a medical tracer (typically injected and detected by an external camera)? Gamma is the radiation that:",
    "choices": [
      "can leave the body and be detected outside",
      "is the most ionising",
      "has the largest charge",
      "has the longest half-life of the three"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "We don't want a tracer to be highly ionising — that would damage tissue more than necessary. Alpha is the most ionising and is exactly what you don't want here.",
      "2": "Gamma carries no charge.",
      "3": "Half-life isn't a property of the type of radiation; it depends on the isotope. Tracer half-lives are typically only a few hours."
    },
    "explanation": "An injected tracer needs to be detectable from outside the body. Gamma's high penetrating power means most of it can leave the body and reach an external camera, where its arrival pattern is used to build an image."
  },
  {
    "id": "medical_tracer_halflife_mcq",
    "tags": [
      "uses_gamma",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "An injected medical tracer (e.g. for a heart or bone scan) should have a half-life of about:",
    "choices": [
      "a few hours",
      "a few seconds",
      "many years",
      "a few months"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Too short for an injected tracer. The tracer would have decayed before the imaging scan could be done. (Some inhaled tracers do use seconds-half-life isotopes — see krypton-81m — but injected tracers are slower to deliver, image, and clear.)",
      "2": "Far too long. The tracer would continue to irradiate the patient long after the scan was over.",
      "3": "Still too long. The patient would be irradiated for months from the residual tracer."
    },
    "explanation": "An injected medical tracer needs a half-life long enough for the tracer to circulate, reach the target tissue, and be imaged, but short enough that it decays away soon afterwards (so the patient doesn't carry a radioactive source around). A few hours is about right (technetium-99m, the most-used medical tracer, has a half-life of 6 hours).",
    "examinerNote": "The 'a few hours' answer is for injected tracers. Inhaled tracers used for lung scans (krypton-81m) have much shorter half-lives — about 13 seconds — because they're imaged immediately as the patient breathes them in."
  },
  {
    "id": "sterilisation_radiation_mcq",
    "tags": [
      "uses_gamma"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which radiation is used to sterilise medical equipment?",
    "choices": [
      "Gamma",
      "Alpha",
      "Beta"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha would not penetrate the packaging — and the equipment would have to be unsealed to be sterilised, which defeats the purpose.",
      "2": "Beta would not pass through enough of the packaging to sterilise reliably."
    },
    "explanation": "Gamma is highly penetrating: it passes through the cardboard or plastic packaging and reaches the equipment inside, killing bacteria without the equipment ever being unsealed. The equipment then arrives at the hospital sterile and ready to use."
  },
  {
    "id": "sterilisation_property_mcq",
    "tags": [
      "uses_gamma"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Why is gamma used to sterilise medical equipment? Gamma is the radiation that:",
    "choices": [
      "Can penetrate the packaging and kill bacteria inside",
      "Is the most ionising",
      "Has the shortest half-life",
      "Is the least dangerous"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha is the most ionising. Alpha would never reach the equipment because it cannot penetrate the packaging.",
      "2": "Half-life depends on the isotope. The gamma source itself (typically cobalt-60) has a half-life of about 5 years.",
      "3": "Gamma is actually quite dangerous to be near — the workers operating the sterilisation plant must use thick lead and concrete shielding."
    },
    "explanation": "Sterilisation needs the radiation to penetrate the packaging. Only gamma is penetrating enough."
  },
  {
    "id": "steel_thickness_gauge_radiation_mcq",
    "tags": [
      "uses_gamma"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Which radiation is used in a thickness gauge for thick steel sheet?",
    "choices": [
      "Gamma",
      "Alpha",
      "Beta"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha would be absorbed by even very thin steel. The gauge would always read zero.",
      "2": "Beta would also be stopped by thick steel. The gauge would still read close to zero, regardless of thickness."
    },
    "explanation": "For thick steel, you need a radiation that is partially absorbed (so the count rate varies with thickness). Alpha and beta are both fully absorbed by thick steel. Only gamma penetrates partially, so the count rate at the detector tracks the thickness."
  },
  {
    "id": "radiotherapy_term_mcq",
    "tags": [
      "uses_gamma",
      "uses_beta"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "What is the use of ionising radiation to treat cancer called?",
    "choices": [
      "Radiotherapy",
      "Chemotherapy",
      "Sterilisation",
      "Tracing"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Chemotherapy uses chemicals (drugs), not radiation.",
      "2": "Sterilisation uses radiation to kill bacteria, not to treat cancer.",
      "3": "Tracing uses radioactive sources to follow the movement of substances; it does not treat disease."
    },
    "explanation": "Radiotherapy uses ionising radiation (typically gamma or X-rays from outside, or beta from an implanted source) to kill cancer cells. The dose is high enough to damage tumour DNA so the cells cannot reproduce."
  },
  {
    "id": "gamma_vs_xrays_mcq",
    "tags": [
      "uses_gamma"
    ],
    "specRefs": [
      "7.14",
      "7.4"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "Gamma rays and X-rays are both ionising electromagnetic radiation. What is a real difference between them?",
    "choices": [
      "Gamma comes from the nucleus; X-rays come from outside the nucleus (e.g. from electrons in an X-ray machine)",
      "Gamma is ionising but X-rays are not",
      "Gamma is electromagnetic but X-rays are not",
      "X-rays are more penetrating than gamma"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Both are ionising.",
      "2": "Both are electromagnetic.",
      "3": "Gamma is at least as penetrating as X-rays — usually more so."
    },
    "explanation": "Gamma and X-rays are both high-frequency electromagnetic waves and both are ionising. The main difference is where they come from: gamma is emitted by an unstable nucleus; X-rays are produced when high-speed electrons hit a metal target inside an X-ray machine. Because of this, X-rays are not 'nuclear radiation', even though their effects are similar."
  },
  {
    "id": "use_to_radiation_matching",
    "tags": [
      "choosing_isotopes_for_uses",
      "uses_alpha",
      "uses_beta",
      "uses_gamma"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "type": "matching",
    "prompt": "Match each use to the radiation typically used.",
    "pairs": [
      {
        "left": "Smoke alarm",
        "right": "Alpha"
      },
      {
        "left": "Static eliminator on a conveyor belt",
        "right": "Alpha"
      },
      {
        "left": "Thickness gauge for paper or thin foil",
        "right": "Beta"
      },
      {
        "left": "Implanted source for treating a tumour",
        "right": "Beta"
      },
      {
        "left": "Sterilisation of medical equipment in packaging",
        "right": "Gamma"
      },
      {
        "left": "Medical tracer (PET / gamma camera)",
        "right": "Gamma"
      },
      {
        "left": "Thickness gauge for thick steel sheet",
        "right": "Gamma"
      }
    ],
    "marks": 7,
    "explanation": "Alpha is for short-range, highly ionising uses (smoke alarms, static elimination). Beta is for partial absorption in thin materials (paper gauges, thin-tissue radiotherapy). Gamma is for penetration through thick or sealed material (sterilisation, tracers, thick steel)."
  },
  {
    "id": "use_to_property_matching",
    "tags": [
      "choosing_isotopes_for_uses"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 3,
    "type": "matching",
    "prompt": "Match each use to the key property of the radiation that makes it suitable.",
    "pairs": [
      {
        "left": "Smoke alarm (alpha)",
        "right": "Highly ionising and very short range"
      },
      {
        "left": "Paper thickness gauge (beta)",
        "right": "Partially absorbed by thin material"
      },
      {
        "left": "Sterilisation (gamma)",
        "right": "Penetrates packaging to reach the contents"
      },
      {
        "left": "Medical tracer (gamma)",
        "right": "Can leave the body and be detected outside"
      },
      {
        "left": "Implanted radiotherapy (beta)",
        "right": "Deposits energy locally so damage stays in the tumour"
      }
    ],
    "marks": 5,
    "explanation": "The 'why this radiation' for each use comes down to one main physical property: range, ionising power, or penetration. Knowing which property matters tells you which radiation to choose.",
    "examinerNote": "Examiners want the property-to-use link to be specific. 'Gamma is highly penetrating' alone isn't enough on its own for marks — you have to say what the penetration enables (passing through packaging, leaving the body, etc.)."
  },
  {
    "id": "halflife_for_use_categorise",
    "tags": [
      "choosing_isotopes_for_uses",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 3,
    "type": "categorise",
    "prompt": "Each application below needs a source with a particular kind of half-life. Sort them.",
    "bins": [
      "Short (hours to days, so the activity fades soon after use)",
      "Medium (weeks to months, so a dose is delivered then activity fades)",
      "Long (many years, so the activity stays roughly constant in service)"
    ],
    "items": [
      {
        "text": "Medical tracer injected into a patient",
        "bin": "Short (hours to days, so the activity fades soon after use)"
      },
      {
        "text": "Industrial tracer added to water to find a leak in a buried pipe",
        "bin": "Short (hours to days, so the activity fades soon after use)"
      },
      {
        "text": "Source implanted directly into a tumour to kill cancer cells",
        "bin": "Medium (weeks to months, so a dose is delivered then activity fades)"
      },
      {
        "text": "Smoke alarm in a house",
        "bin": "Long (many years, so the activity stays roughly constant in service)"
      },
      {
        "text": "Thickness gauge in a paper mill",
        "bin": "Long (many years, so the activity stays roughly constant in service)"
      },
      {
        "text": "Cobalt-60 source in a sterilisation plant",
        "bin": "Long (many years, so the activity stays roughly constant in service)"
      }
    ],
    "marks": 6,
    "explanation": "If the source is going inside a person and won't be removed (a tracer or an industrial leak-tracer in water), you want it to decay away soon afterwards so the radioactivity doesn't persist. If the source is implanted to deliver a dose over time and then fade (brachytherapy), you want a half-life of weeks to months — long enough to deliver useful damage, short enough that the patient isn't irradiated for life. If the source is part of a piece of equipment that needs to work reliably for years (smoke alarm, thickness gauge, sterilisation source), you want a half-life much longer than the equipment's useful life so the count rate doesn't drift."
  },
  {
    "id": "match_radiation_to_use_mcq",
    "tags": [
      "choosing_isotopes_for_uses"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "Which row of the table correctly matches a use of nuclear radiation to the radiation type and the property of that radiation that makes it suitable?",
    "choices": [
      "Smoke alarm: alpha — alpha is highly ionising and has a short range",
      "Smoke alarm: alpha — alpha is the most penetrating",
      "Thickness gauge for paper: gamma — gamma is partially absorbed by paper",
      "Thickness gauge for thick steel: beta — beta is sensitive to thickness changes in steel"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha is the LEAST penetrating, not the most. Smoke alarms use it precisely because it can't escape the alarm.",
      "2": "Gamma is barely absorbed by paper, so it would not vary with paper thickness. Beta is the right choice for paper.",
      "3": "Beta would be completely absorbed by thick steel. Gamma is the right choice for thick steel."
    },
    "explanation": "The smoke alarm row is the correct match: alpha's two properties (highly ionising, short range) are exactly what's needed inside the alarm — strong ionisation of the air gap, and complete absorption inside the alarm casing."
  },
  {
    "id": "choose_isotope_for_smoke_alarm_mcq",
    "tags": [
      "choosing_isotopes_for_uses",
      "uses_alpha",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "Which of these isotopes would be the most suitable choice for use in a household smoke alarm?",
    "choices": [
      "An alpha-emitter with a half-life of hundreds of years",
      "An alpha-emitter with a half-life of a few seconds",
      "A gamma-emitter with a half-life of hundreds of years",
      "A beta-emitter with a half-life of a few hours"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "The half-life is far too short — the alarm would stop working in minutes.",
      "2": "Gamma is too penetrating: it would escape the alarm and irradiate the user.",
      "3": "Beta would also escape the alarm, plus the half-life is too short for an alarm meant to last years."
    },
    "explanation": "Alpha for the radiation (highly ionising, can't escape the alarm); long half-life so the alarm works for years (americium-241 has a half-life of about 432 years).",
    "examinerNote": "This is a 'choose the right isotope for the job' question. Both properties — radiation type AND half-life — must match the job."
  },
  {
    "id": "choose_isotope_for_tracer_mcq",
    "tags": [
      "choosing_isotopes_for_uses",
      "uses_gamma",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "Which of these isotopes would be the most suitable choice as a medical tracer (injected into a patient and detected by a gamma camera outside the body)?",
    "choices": [
      "A gamma-emitter with a half-life of a few hours",
      "An alpha-emitter with a half-life of a few hours",
      "A gamma-emitter with a half-life of hundreds of years",
      "A beta-emitter with a half-life of a few seconds"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha would be absorbed inside the body and never reach the camera. It would also be highly damaging to the patient.",
      "2": "The half-life is far too long: the patient would continue to be irradiated for months after the scan.",
      "3": "Beta is partially absorbed by tissue and the half-life is far too short — the tracer would have decayed away before the scan could finish."
    },
    "explanation": "Gamma for the radiation (so it can leave the body and reach the camera); a few hours for the half-life (long enough for the scan, short enough that the tracer decays away soon afterwards). Technetium-99m is the standard choice."
  },
  {
    "id": "choose_isotope_for_sterilisation_mcq",
    "tags": [
      "choosing_isotopes_for_uses",
      "uses_gamma",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "A sterilisation plant uses a radioactive source to sterilise medical equipment in sealed packaging. Which isotope is the most suitable choice for the source?",
    "choices": [
      "A gamma-emitter with a half-life of several years",
      "A gamma-emitter with a half-life of a few hours",
      "An alpha-emitter with a half-life of several years",
      "A beta-emitter with a half-life of several years"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "The half-life is far too short. Sterilisation plants run for years; the source's activity must stay roughly constant over that time. With a half-life of a few hours, the source would have to be replaced daily.",
      "2": "Alpha would not penetrate the packaging, so the equipment inside would not be sterilised.",
      "3": "Beta would not pass through the packaging reliably either; it is absorbed by even modest layers of cardboard or plastic."
    },
    "explanation": "Gamma for the radiation (penetrates the packaging and kills bacteria inside); a half-life of years so the plant can operate without constantly replacing the source. Cobalt-60 (half-life 5.3 years) is the standard choice."
  },
  {
    "id": "choose_isotope_for_paper_gauge_mcq",
    "tags": [
      "choosing_isotopes_for_uses",
      "uses_beta",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "A continuous paper-mill uses a thickness gauge to monitor the paper thickness as it is rolled. Which isotope is the most suitable choice for the source in the gauge?",
    "choices": [
      "A beta-emitter with a half-life of many years",
      "A beta-emitter with a half-life of a few hours",
      "An alpha-emitter with a half-life of many years",
      "A gamma-emitter with a half-life of many years"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "The half-life is too short. The gauge is in continuous service; the activity must stay roughly constant.",
      "2": "Alpha would be completely absorbed by even thin paper, so the count rate would always be (close to) zero. The gauge couldn't tell anything about the thickness.",
      "3": "Gamma would pass through thin paper almost unchanged, so the count rate wouldn't vary with thickness."
    },
    "explanation": "Beta for the radiation (partially absorbed by paper, so the count rate varies with thickness); many years for the half-life (so the gauge stays calibrated over its service life). Strontium-90 (half-life 28 years) is a common choice."
  },
  {
    "id": "choose_isotope_for_steel_gauge_mcq",
    "tags": [
      "choosing_isotopes_for_uses",
      "uses_gamma",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "A steel mill uses a thickness gauge to monitor the thickness of thick steel sheet as it is rolled. Which isotope is the most suitable choice for the source in the gauge?",
    "choices": [
      "A gamma-emitter with a half-life of many years",
      "A gamma-emitter with a half-life of a few hours",
      "A beta-emitter with a half-life of many years",
      "An alpha-emitter with a half-life of many years"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "The half-life is too short. The gauge is in continuous service; the activity must stay roughly constant.",
      "2": "Beta is fully absorbed by thick steel, so the count rate would always be (close to) zero. The gauge couldn't tell anything about the thickness.",
      "3": "Alpha is even more easily absorbed than beta. Same problem, only worse."
    },
    "explanation": "Gamma for the radiation (only one penetrating enough to be partially absorbed by thick steel, so the count rate varies with thickness); many years for the half-life (so the gauge stays calibrated). Cobalt-60 (half-life 5.3 years) or caesium-137 (half-life 30 years) are common choices."
  },
  {
    "id": "choose_isotope_for_implant_mcq",
    "tags": [
      "choosing_isotopes_for_uses",
      "uses_beta",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 4,
    "type": "mcq",
    "prompt": "A small radioactive source is implanted directly into a tumour to kill the cancer cells locally. The source will be left in place. Which isotope is the most suitable choice?",
    "choices": [
      "A beta-emitter with a half-life of weeks to months",
      "A beta-emitter with a half-life of many years",
      "A gamma-emitter with a half-life of weeks to months",
      "An alpha-emitter with a half-life of weeks to months"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Many years would mean the patient continues to be irradiated for the rest of their life, which is not what's wanted. The source must deliver its dose then decay away.",
      "2": "Gamma is too penetrating: it would carry past the tumour and irradiate healthy tissue beyond it.",
      "3": "Alpha would be absorbed within micrometres of the source, so might not reach all of the tumour. (Beta gives a few mm range, which matches the size of typical tumours better.)"
    },
    "explanation": "Beta for the radiation (deposits its energy within a few mm of the source, so the damage stays inside the tumour); a half-life of weeks to months so the source delivers a useful dose then decays away. Iridium-192 (74 days) is a commonly used choice for this type of treatment."
  },
  {
    "id": "choose_isotope_for_pipe_leak_mcq",
    "tags": [
      "choosing_isotopes_for_uses",
      "uses_gamma",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "A small amount of radioactive isotope is added to the water in a buried pipe network to find a suspected leak. Workers walk above ground with a Geiger counter; the leak shows up as a higher count rate at the spot where the radioactive water has reached the soil. Which isotope is the most suitable choice?",
    "choices": [
      "A gamma-emitter with a half-life of a few hours to a few days",
      "An alpha-emitter with a half-life of a few hours to a few days",
      "A gamma-emitter with a half-life of many years",
      "A beta-emitter with a half-life of a few hours to a few days"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha would be absorbed by the water itself, the pipe wall, and the soil — never reaching the worker's Geiger counter at the surface.",
      "2": "A half-life of years would mean the radioactive substance persisting in the water supply long after the leak is found, contaminating it for years to come.",
      "3": "Beta is partially absorbed by water, the pipe wall, and a metre of soil. Most of it would not reach the worker's counter at the surface."
    },
    "explanation": "Gamma for the radiation (it's the only one penetrating enough to reach the surface from a buried pipe); a short-ish half-life so the radioactivity in the water supply fades quickly once the leak is found. Sodium-24 (half-life 15 hours) is a common choice for this kind of industrial tracer."
  },
  {
    "id": "radiation_damages_mcq",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Ionising radiation can cause:",
    "choices": [
      "Cancer and damage to cells / DNA",
      "Indigestion and stomach ache",
      "Loss of hearing only",
      "No biological effects of any kind"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Indigestion is unrelated to ionising radiation.",
      "2": "Hearing loss is not a typical effect of ionising radiation. The main hazards are cancer and tissue damage.",
      "3": "Ionising radiation can definitely damage living cells; that's why it's regulated."
    },
    "explanation": "Ionising radiation can damage cells and DNA, leading to cell death (in the short term) or mutations that can develop into cancer (over years to decades)."
  },
  {
    "id": "dna_mutation_cancer_mcq",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Why can ionising radiation cause cancer?",
    "choices": [
      "It damages DNA, leading to mutations that can cause uncontrolled cell growth",
      "It heats up cells until they burst",
      "It removes oxygen from blood",
      "It dissolves cell membranes"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Ionising radiation does not significantly heat tissues at normal exposure levels; the damage is at the molecular level (breaking chemical bonds), not thermal.",
      "2": "Radiation does not affect blood oxygen.",
      "3": "Radiation can damage cell components, but it doesn't dissolve membranes specifically."
    },
    "explanation": "Ionising radiation knocks electrons off atoms in DNA, breaking chemical bonds and damaging the genetic code. If the cell's DNA repair mechanisms get it wrong, the resulting mutations may cause cells to multiply uncontrollably, which is cancer."
  },
  {
    "id": "cell_outcomes_mcq",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Which is the most accurate statement about how ionising radiation affects living cells?",
    "choices": [
      "Cells exposed to ionising radiation may die, may behave abnormally, or may repair themselves",
      "All cells exposed to ionising radiation die immediately",
      "Ionising radiation has no effect on cells",
      "Ionising radiation only affects cancer cells"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Most cells survive low doses with the help of repair mechanisms.",
      "2": "Cells absolutely respond to radiation — that's why low doses can still increase cancer risk over time.",
      "3": "Ionising radiation damages all cells, healthy and cancerous. Radiotherapy targets it carefully so the cancerous ones are damaged more."
    },
    "explanation": "After a radiation hit, a cell can: (a) repair the DNA damage and continue normally, (b) die because the damage is too severe, or (c) survive with a mutation that may later cause problems (including cancer)."
  },
  {
    "id": "short_vs_long_term_mcq",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Choose the most accurate statement about the biological effects of ionising radiation.",
    "choices": [
      "Effects can be short-term (e.g. burns, sickness) or long-term (e.g. cancer years later)",
      "All effects of radiation appear within hours of exposure",
      "Radiation has no biological effect at low doses",
      "Only people exposed to nuclear weapons are affected by radiation"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Cancer caused by mutations may not appear for years or even decades after exposure.",
      "2": "Even low doses carry some risk; the relationship between dose and cancer risk has no clear safe threshold.",
      "3": "Background radiation, medical X-rays, and accidents all expose people to ionising radiation, not just weapons."
    },
    "explanation": "Short-term (acute) effects from a high dose: radiation sickness (nausea, vomiting), skin burns, hair loss, in extreme cases death within days or weeks. Long-term effects from any dose: increased lifetime cancer risk, possible inheritable mutations."
  },
  {
    "id": "alpha_outside_body_safe_mcq",
    "tags": [
      "bio_effects",
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Why is a sealed alpha source not particularly dangerous from outside the body?",
    "choices": [
      "Alpha is stopped by skin or even by a few centimetres of air",
      "Alpha is not ionising",
      "Alpha has a very short half-life",
      "Alpha cannot exist in air"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha is the most ionising of the three. That's exactly why it's so dangerous when it does reach tissue.",
      "2": "Half-life is a property of the source, not of the radiation type.",
      "3": "Alpha can travel through a few cm of air; it just doesn't travel far."
    },
    "explanation": "Alpha has very short range. It is absorbed by a few centimetres of air, and skin is more than enough to absorb any that reaches the body. So an alpha source held at arm's length deposits essentially no dose in body tissue."
  },
  {
    "id": "most_dangerous_inside_mcq",
    "tags": [
      "bio_effects",
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Which radiation is generally most dangerous when the source is INSIDE the body (e.g. inhaled or ingested)?",
    "choices": [
      "Alpha",
      "Beta",
      "Gamma"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Beta is moderately ionising and partially absorbed by tissue; some passes out of the body without depositing all its energy. Less damaging than alpha for the same activity.",
      "2": "Gamma is the least ionising; most of it passes through tissue without depositing much energy."
    },
    "explanation": "Inside the body, alpha's two properties combine to do the most damage: highly ionising (so it deposits a lot of energy per particle) and very short range (so all that energy is dumped into nearby tissue, not carried away). This is why radon (an alpha-emitter) is a leading cause of lung cancer."
  },
  {
    "id": "most_dangerous_outside_mcq",
    "tags": [
      "bio_effects",
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Which radiation is generally most dangerous when the source is OUTSIDE the body, several metres away?",
    "choices": [
      "Gamma",
      "Alpha",
      "Beta"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Alpha doesn't even reach the body from several metres away; it's absorbed by the air.",
      "2": "Beta might reach the body but is partially absorbed by air over that distance, and skin will absorb most of what arrives."
    },
    "explanation": "From outside, only the most penetrating radiation reaches you. Gamma travels easily through air and can also penetrate skin and clothing to deposit energy in deeper tissue. Alpha and beta would mostly be absorbed before reaching the body."
  },
  {
    "id": "acute_vs_long_term_categorise",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "categorise",
    "prompt": "Sort each effect of ionising radiation into 'short-term' (appears within hours to days) or 'long-term' (appears years or decades later).",
    "bins": [
      "Short-term effect",
      "Long-term effect"
    ],
    "items": [
      {
        "text": "Radiation sickness (nausea, vomiting)",
        "bin": "Short-term effect"
      },
      {
        "text": "Skin burns",
        "bin": "Short-term effect"
      },
      {
        "text": "Hair loss",
        "bin": "Short-term effect"
      },
      {
        "text": "Death from very high doses",
        "bin": "Short-term effect"
      },
      {
        "text": "Cancer (e.g. leukaemia, thyroid cancer)",
        "bin": "Long-term effect"
      },
      {
        "text": "Inherited mutations passed to children",
        "bin": "Long-term effect"
      }
    ],
    "marks": 6,
    "explanation": "Short-term effects (acute radiation syndrome) appear within hours or days of a high dose: tissue damage that's already done. Long-term effects appear years to decades later: cancers caused by accumulated DNA mutations, and possibly inherited mutations that show up in children of irradiated parents."
  },
  {
    "id": "dose_factors_categorise",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "categorise",
    "prompt": "Sort each factor by whether it affects the dose received by a person near a radioactive source.",
    "bins": [
      "Affects the dose received",
      "Does not affect the dose received"
    ],
    "items": [
      {
        "text": "The activity of the source (its Bq value)",
        "bin": "Affects the dose received"
      },
      {
        "text": "The distance from the source to the person",
        "bin": "Affects the dose received"
      },
      {
        "text": "The time spent near the source",
        "bin": "Affects the dose received"
      },
      {
        "text": "The type of radiation (alpha, beta, gamma)",
        "bin": "Affects the dose received"
      },
      {
        "text": "Whether shielding is between the source and the person",
        "bin": "Affects the dose received"
      },
      {
        "text": "The temperature of the lab",
        "bin": "Does not affect the dose received"
      },
      {
        "text": "The colour of the source",
        "bin": "Does not affect the dose received"
      }
    ],
    "marks": 7,
    "explanation": "Dose depends on: how much radiation the source produces (activity), how much of it reaches the person (distance, shielding), how much energy each particle deposits when it gets there (radiation type), and how long the person is exposed for (time). Temperature and colour have no relevance — they don't change radioactive decay or how the radiation interacts with tissue."
  },
  {
    "id": "safety_precautions_multiselect_2",
    "tags": [
      "bio_effects",
      "practical_penetration"
    ],
    "specRefs": [
      "7.16",
      "7.6"
    ],
    "difficultyRating": 2,
    "type": "multiselect",
    "prompt": "A teacher is about to demonstrate with a sealed gamma source. Tick all the precautions that genuinely reduce the dose to the teacher and students.",
    "choices": [
      "Use long-handled tongs to hold the source",
      "Stand as far from the source as the demonstration allows",
      "Limit the time the source is out of its lead-lined storage",
      "Keep the source pointing away from people",
      "Place a lead screen between the source and the audience",
      "Wear a non-radiation-rated lab coat",
      "Heat the source briefly before using it"
    ],
    "answerIndices": [
      0,
      1,
      2,
      3,
      4
    ],
    "distractorRationales": {
      "5": "An ordinary lab coat does almost nothing against gamma radiation — it would need to be a metres-thick lead apron to make a real difference.",
      "6": "Heating does not change radioactive decay. The source's activity is unaffected by temperature."
    },
    "marks": 5,
    "markingMode": "penalty",
    "explanation": "The three reliable ways to reduce dose are: distance (the further away, the smaller the dose), time (less time means less dose), and shielding (lead absorbs gamma). 'Don't point the source at people' and 'use tongs' both add distance. Lab coats and heating do not help against gamma."
  },
  {
    "id": "alpha_internal_external_mcq",
    "tags": [
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Choose the best statement about the danger of alpha radiation.",
    "choices": [
      "Alpha is the most dangerous if inside the body, and among the safest if outside",
      "Alpha is always the most dangerous radiation",
      "Alpha is always the safest radiation",
      "The danger of alpha doesn't depend on where the source is"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Outside the body, alpha doesn't even reach you (skin/air absorb it). It's only most dangerous when it gets inside.",
      "2": "Alpha is highly dangerous inside the body. 'Always safe' is exactly wrong.",
      "3": "Whether the source is internal or external is the most important single factor for alpha's danger."
    },
    "explanation": "Alpha's danger depends entirely on whether it can reach living tissue. Outside the body, it can't get past skin or even a few cm of air. Inside the body, it dumps all its energy into a small volume of nearby tissue and is the most damaging of the three radiations."
  },
  {
    "id": "danger_phrasing_mcq",
    "tags": [
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Which is the most accurate statement about why alpha is the most dangerous radiation when inside the body?",
    "choices": [
      "Alpha is highly ionising and damages cells when in contact with tissue",
      "Alpha is the most dangerous because it is the strongest",
      "Alpha is the most dangerous because it travels the furthest",
      "Alpha is never dangerous"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "'Strongest' isn't a precise physics term; we need to say what about alpha actually does the damage.",
      "2": "Alpha travels the SHORTEST distance, not the furthest. That's exactly why it's so damaging when inside the body — it dumps all its energy in a small volume.",
      "3": "Alpha is highly dangerous when inside the body."
    },
    "explanation": "Alpha is highly ionising (it knocks many electrons off atoms in the tissue it passes), and short-range (so all of that ionising happens in one small volume of cells). Together, that means high local damage."
  },
  {
    "id": "rank_external_dangers_mcq",
    "tags": [
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "Three sources, all with the same activity, are placed outside the body, several metres away. Rank them from MOST to LEAST dangerous.",
    "choices": [
      "Gamma > beta > alpha",
      "Alpha > beta > gamma",
      "Beta > alpha > gamma",
      "All three are equally dangerous"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "This is the inside-the-body ordering, not outside. Outside, alpha barely reaches you.",
      "2": "Beta is partially absorbed by air over several metres; alpha is fully absorbed.",
      "3": "Penetration matters a lot here. Gamma reaches you, alpha doesn't."
    },
    "explanation": "Outside the body, only the most penetrating radiation reaches you. Gamma travels easily through air and clothing; beta is partially absorbed; alpha doesn't even reach you. So gamma > beta > alpha for external danger."
  },
  {
    "id": "rank_internal_dangers_mcq",
    "tags": [
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "Three sources, all with the same activity, are inside the body (e.g. inhaled or swallowed). Rank them from MOST to LEAST dangerous.",
    "choices": [
      "Alpha > beta > gamma",
      "Gamma > beta > alpha",
      "Beta > gamma > alpha",
      "All three are equally dangerous"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "This is the outside-the-body ordering, not inside. Inside, alpha is the most damaging.",
      "2": "Inside the body, alpha is more dangerous than beta because it deposits more energy per particle in a smaller volume.",
      "3": "There's a clear ranking driven by ionising ability."
    },
    "explanation": "Inside the body, all three reach tissue (no skin or air to stop them). The most ionising deposits the most energy per particle and so does the most damage: alpha > beta > gamma. This is the reverse of the external ordering, where penetration was the deciding factor."
  },
  {
    "id": "ingested_beta_vs_alpha_mcq",
    "tags": [
      "which_most_dangerous",
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 3,
    "type": "mcq",
    "prompt": "Why is ingesting a beta-emitting substance, on the whole, less dangerous than ingesting an alpha-emitting substance of the same activity?",
    "choices": [
      "Beta has higher penetrating power, so much of it leaves the body without depositing all its energy in tissue",
      "Beta is not ionising at all",
      "Beta is negatively charged and so is repelled by the body",
      "Beta passes through cells without doing anything to them"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Beta is moderately ionising. It is far less ionising than alpha but it does ionise.",
      "2": "Repulsion plays no relevant role; tissue is roughly neutral.",
      "3": "Beta does ionise tissue. It just does less damage per particle than alpha."
    },
    "explanation": "Once inside the body, both alpha and beta reach tissue. The difference is the amount of damage per particle: alpha is highly ionising and short-range, so all its energy is deposited in tissue close to the source. Beta is moderately ionising and longer range, so a fraction of beta particles leave the body altogether without depositing all their energy. So the dose to tissue is lower for the same activity."
  },
  {
    "id": "danger_ranking_grid",
    "tags": [
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 3,
    "type": "grid",
    "prompt": "For each radiation, tick whether it is generally the most dangerous in each context.",
    "rows": [
      "Alpha",
      "Beta",
      "Gamma"
    ],
    "columns": [
      "Most dangerous when source is INSIDE the body",
      "Most dangerous when source is OUTSIDE the body",
      "Most easily stopped by a sheet of paper"
    ],
    "correct": {
      "0": [
        0,
        2
      ],
      "1": [],
      "2": [
        1
      ]
    },
    "marks": 3,
    "markingMode": "per_row",
    "explanation": "Alpha: most dangerous inside (highly ionising, short range); least dangerous outside; the only one stopped by paper. Gamma: most dangerous outside (only one that penetrates air and skin to reach internal tissue); least dangerous inside (least ionising). Beta: middle on both axes — never the answer to 'most dangerous'.",
    "examinerNote": "The deliberate omission for beta (no ticks in any column) is part of the test: students who default to ticking 'something for each row' will be wrong."
  },
  {
    "id": "waste_dangerous_why_mcq",
    "tags": [
      "waste_disposal"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Why is high-level nuclear waste dangerous?",
    "choices": [
      "It gives off ionising radiation for a long time",
      "It is electrically conductive",
      "It catches fire easily",
      "It produces toxic chemical fumes"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Conductivity isn't the problem.",
      "2": "Nuclear waste isn't typically flammable.",
      "3": "Some chemical processes produce fumes, but the danger from nuclear waste is the radiation, not chemical toxicity."
    },
    "explanation": "High-level waste contains highly radioactive isotopes (typically spent fuel or its derivatives) that emit dangerous amounts of ionising radiation for many decades, centuries, or millennia. Direct exposure can be fatal."
  },
  {
    "id": "waste_storage_mcq",
    "tags": [
      "waste_disposal"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Where is high-level nuclear waste typically stored long-term?",
    "choices": [
      "In sealed containers buried deep underground",
      "In ordinary landfill sites",
      "In normal recycling bins",
      "Released into the atmosphere"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Ordinary landfill is for non-hazardous waste; nuclear waste needs much more robust containment.",
      "2": "Nuclear waste is hazardous and is never put in normal recycling.",
      "3": "Releasing radioactive material to the atmosphere would be a major safety violation."
    },
    "explanation": "High-level nuclear waste is stored in sealed containers deep underground (often in geologically stable rock, hundreds of metres below the surface) and/or in deep water cooling pools. The aim is to keep it isolated from people and the biosphere for the thousands of years it remains dangerous."
  },
  {
    "id": "waste_containers_rust_mcq",
    "tags": [
      "waste_disposal"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Why must nuclear waste containers be rust-proof and corrosion-resistant?",
    "choices": [
      "So radioactive material cannot leak out into soil or water",
      "So they look attractive",
      "So they are easier to lift",
      "So the waste inside stays cold"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Aesthetics aren't a relevant concern for buried waste.",
      "2": "Waste containers are very heavy regardless.",
      "3": "Cooling is a separate issue addressed by other means; corrosion-resistance is about containment."
    },
    "explanation": "If the container corrodes, radioactive material inside can escape — into the soil and groundwater around the storage site. The containers must keep their contents sealed for as long as the waste is dangerous, which can be thousands of years."
  },
  {
    "id": "waste_timescale_mcq",
    "tags": [
      "waste_disposal",
      "halflife"
    ],
    "specRefs": [
      "7.16",
      "7.12"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Choose the most accurate statement about nuclear waste.",
    "choices": [
      "Some nuclear waste decays quickly, but other waste remains dangerous for thousands of years",
      "All nuclear waste is harmless within a few years",
      "All nuclear waste remains dangerous forever",
      "Nuclear waste is no different from chemical waste"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Some isotopes in waste have half-lives of millions of years, so they remain hazardous for far longer than a few years.",
      "2": "Eventually all radioactive isotopes decay completely. 'Forever' is too strong.",
      "3": "Nuclear waste is qualitatively different — it emits ionising radiation, which chemical waste doesn't."
    },
    "explanation": "Nuclear waste contains a mix of isotopes with very different half-lives: some decay to safe levels in days, others remain radioactive for hundreds of thousands of years. The disposal method needs to suit the longest-lived components."
  },
  {
    "id": "waste_climate_change_mcq",
    "tags": [
      "waste_disposal"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which kind of waste is more directly responsible for climate change?",
    "choices": [
      "Coal-power waste (especially CO₂ emissions)",
      "Nuclear-power waste",
      "Both equally",
      "Neither"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Nuclear power produces almost no CO₂; the waste is dangerous in different ways (radioactivity), but isn't a climate driver.",
      "2": "These are very different problems. Coal is the climate problem; nuclear isn't.",
      "3": "Coal-fired power stations release large quantities of CO₂ directly to the atmosphere; this is the major contributor."
    },
    "explanation": "Nuclear waste is dangerous, but in different ways: it's radioactive, and the danger is local and (in principle) containable. The climate-change problem comes from CO₂ emissions, which nuclear power produces almost none of and coal power produces a lot of."
  },
  {
    "id": "waste_storage_match_halflife_mcq",
    "tags": [
      "waste_disposal",
      "halflife"
    ],
    "specRefs": [
      "7.16",
      "7.12"
    ],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Choose the most accurate statement about nuclear waste storage.",
    "choices": [
      "The storage method depends on the half-lives of the isotopes in the waste",
      "All nuclear waste needs to be stored deep underground",
      "Nuclear waste becomes safe after one half-life",
      "All nuclear waste has the same half-life"
    ],
    "answerIndex": 0,
    "marks": 1,
    "distractorRationales": {
      "1": "Low-level waste with short half-lives is stored in shallower, less expensive facilities.",
      "2": "After one half-life, only half has decayed — the activity is still half of what it was. The waste is far from safe.",
      "3": "Nuclear waste is a mixture of many different isotopes, with very different half-lives."
    },
    "explanation": "If the waste is short-lived, it can be stored in less robust facilities for the few decades it takes to decay to safe levels. If it's long-lived (thousands or millions of years), it needs deep geological storage that will keep it isolated for that entire time."
  },
  {
    "id": "low_high_level_grid",
    "tags": [
      "waste_disposal"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "type": "grid",
    "prompt": "For each kind of nuclear waste, tick the features that apply.",
    "rows": [
      "Low-level waste (e.g. contaminated lab equipment, gloves, paper)",
      "High-level waste (e.g. spent nuclear fuel)"
    ],
    "columns": [
      "High activity",
      "Low activity",
      "Stored in shallow burial near the surface",
      "Stored in deep geological repository"
    ],
    "correct": {
      "0": [
        1,
        2
      ],
      "1": [
        0,
        3
      ]
    },
    "marks": 4,
    "markingMode": "per_row",
    "explanation": "Low-level waste: low activity, short-lived, stored in shallow burial sites where it will decay to safe levels in years to decades. High-level waste: high activity, long-lived (some isotopes have half-lives of thousands of years), stored deep underground in stable rock formations."
  },
  {
    "id": "atom_neutral_fillblank",
    "type": "fillblank",
    "tags": [
      "atomic_struct"
    ],
    "specRefs": [
      "7.2"
    ],
    "difficultyRating": 1,
    "marks": 2,
    "prompt": "An atom contains equal numbers of {} and {}, so its overall electrical charge is zero.",
    "blanks": [
      {
        "expected": [
          "protons"
        ]
      },
      {
        "expected": [
          "electrons"
        ]
      }
    ],
    "explanation": "An atom is electrically neutral because the number of protons (charge +1 each) is the same as the number of electrons (charge −1 each). The positive and negative charges cancel exactly.",
    "examinerNote": ""
  },
  {
    "id": "ga68_vs_ga67_mcq",
    "type": "mcq",
    "tags": [
      "nuclide_notation"
    ],
    "specRefs": [
      "7.3"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Gallium-67 and gallium-68 are both isotopes of gallium. Compared with gallium-67, the nucleus of gallium-68 has:",
    "choices": [
      "one more neutron and the same number of protons",
      "one more proton and the same number of neutrons",
      "one more electron and the same number of protons",
      "the same number of every type of particle"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Both are gallium, so both have the same number of protons (31). Adding a proton would make a different element.",
      "2": "Electrons aren't in the nucleus, and adding one wouldn't change the mass number from 67 to 68.",
      "3": "If they were identical, they wouldn't be different isotopes."
    },
    "explanation": "Both nuclei have 31 protons (because they are both gallium). Mass number 67 vs 68 differs by 1, so gallium-68 has one more neutron.",
    "examinerNote": "Past paper Q17 4SS0 (June 2019) marks this; mark scheme rejects 'less neutrons' as a description of the difference."
  },
  {
    "id": "radon_facts_multiselect",
    "type": "multiselect",
    "tags": [
      "background"
    ],
    "specRefs": [
      "7.10"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "Radon is the largest single source of natural background radiation for most people in the UK. Tick all the true statements about radon.",
    "choices": [
      "radon comes from the radioactive decay of uranium in rocks and soil",
      "radon is a gas, so it can escape from the ground into the air",
      "radon builds up to higher levels indoors because the air is less well dispersed",
      "radon is produced by cosmic rays from space",
      "radon is a man-made source from nuclear power stations",
      "radon levels are higher outdoors than indoors because of wind"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Cosmic rays are a separate source of background radiation, and they are not what produces radon.",
      "4": "Radon is natural, not man-made; it comes from decay of natural uranium in the ground.",
      "5": "It's the other way round: outdoor wind disperses radon, so outdoor levels are lower than indoors."
    },
    "markingMode": "penalty",
    "explanation": "Radon is a radioactive gas produced by the decay of natural uranium in rocks and soil. It seeps out of the ground and accumulates indoors, where there is less air movement to disperse it.",
    "examinerNote": ""
  },
  {
    "id": "irradiated_fruit_multiselect",
    "type": "multiselect",
    "tags": [
      "contam_irrad"
    ],
    "specRefs": [
      "7.15",
      "7.14"
    ],
    "difficultyRating": 2,
    "marks": 2,
    "prompt": "Fruit is irradiated with gamma rays at a sterilisation plant before being sold in supermarkets. Tick the statements that explain why the fruit is safe to eat afterwards.",
    "choices": [
      "the fruit has not been made radioactive",
      "bacteria on the fruit have been killed by the radiation",
      "the gamma source has been absorbed by the fruit",
      "the radiation cleans the fruit chemically",
      "the fruit was only briefly contaminated, and the contamination has now decayed"
    ],
    "answerIndices": [
      0,
      1
    ],
    "distractorRationales": {
      "2": "Gamma is electromagnetic radiation; it isn't absorbed and stored as a substance in the fruit.",
      "3": "Irradiation isn't a chemical cleaning process. Its effect on bacteria is biological — DNA damage.",
      "4": "Irradiation does not contaminate the fruit at all. There is nothing radioactive on the fruit either before or after."
    },
    "markingMode": "penalty",
    "explanation": "Irradiation does not transfer any radioactive material to the fruit; the fruit itself does not become radioactive. The gamma kills bacteria and microorganisms by damaging their DNA, so the fruit is safe and lasts longer.",
    "examinerNote": "Past-paper Q34 mark scheme: 'fruit has no bacteria; fruit has not been contaminated; fruit has not been made radioactive; radioactive source has not been in contact with the fruit'."
  },
  {
    "id": "irradiation_stops_when_away_mcq",
    "type": "mcq",
    "tags": [
      "contam_irrad"
    ],
    "specRefs": [
      "7.15"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Which statement about irradiation is correct?",
    "choices": [
      "irradiation stops as soon as the person moves away from the source",
      "irradiation continues even after the person leaves the area",
      "irradiation can only be removed by washing the skin",
      "irradiation transfers radioactive material onto the person"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Irradiation only happens while radiation is reaching the person. Move away, and it stops.",
      "2": "That describes contamination, not irradiation.",
      "3": "Irradiation does not deposit radioactive material; nothing needs washing off."
    },
    "explanation": "Irradiation is exposure to radiation. As soon as the person leaves the source's reach, no more radiation arrives, so the irradiation stops.",
    "examinerNote": ""
  },
  {
    "id": "contamination_persists_mcq",
    "type": "mcq",
    "tags": [
      "contam_irrad"
    ],
    "specRefs": [
      "7.15"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Why is contamination usually harder to deal with than irradiation?",
    "choices": [
      "the radioactive material stays with the person and keeps emitting radiation wherever they go",
      "contamination always involves alpha radiation, which is the most dangerous",
      "contamination can be stopped by moving away from the original source",
      "contamination only happens to inanimate objects, not to people"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Contamination can involve any kind of radioactive material, not specifically alpha.",
      "2": "That's irradiation. Contamination travels with you because the radioactive material is on or in you.",
      "3": "Contamination definitely happens to people. Internal contamination is one of the most serious cases."
    },
    "explanation": "Contamination means radioactive material is in physical contact with the person (on the skin, swallowed, or inhaled). Wherever they go, the material goes too, and it keeps emitting radiation. Removal usually requires washing or, for internal contamination, waiting for the substance to decay.",
    "examinerNote": ""
  },
  {
    "id": "alpha_safe_in_smoke_alarm_multiselect",
    "type": "multiselect",
    "tags": [
      "uses_alpha",
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.14",
      "7.16"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "Alpha is the most ionising of the three radiations and the most dangerous if it reaches living tissue. Tick all the genuine reasons why an alpha source in a household smoke alarm is nonetheless considered safe.",
    "choices": [
      "alpha has a very short range in air, so it cannot travel far from the source",
      "the source is sealed inside the alarm casing, so the radioactive material cannot be touched, swallowed, or inhaled",
      "the small amount of alpha that escapes the casing is absorbed by even a few cm of air before reaching anyone",
      "alpha is actually one of the safest radiations under all conditions",
      "the alarm contains a beta source, not an alpha source",
      "alpha sources have very short half-lives so they decay before reaching anyone"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Alpha is the MOST ionising and the most dangerous if it reaches tissue. It's only safe in the smoke alarm because it cannot reach tissue.",
      "4": "The source genuinely is alpha (typically americium-241). The radiation type isn't different.",
      "5": "Smoke-alarm sources have very long half-lives (americium-241 has a half-life of about 432 years). Decay isn't what makes them safe."
    },
    "markingMode": "penalty",
    "explanation": "Alpha is dangerous to living tissue, but in a smoke alarm it never reaches living tissue. Two layers of protection apply at once: the source is sealed inside the alarm so it cannot be touched, swallowed, or inhaled; and the very short range of alpha in air means even any that escaped wouldn't reach a person standing nearby.",
    "examinerNote": "An earlier draft of this question included 'alpha cannot penetrate skin' as a tick. That phrasing is technically loose — the syllabus treats touching alpha as dangerous (e.g. the radon contamination case) — so the cleaner safety reasons are containment and air absorption."
  },
  {
    "id": "smoke_alarm_mechanism_ordering",
    "type": "ordering",
    "tags": [
      "uses_alpha"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "marks": 4,
    "prompt": "Put the steps that explain how an alpha source enables a smoke alarm to detect smoke in the right order.",
    "items": [
      "alpha radiation from the source passes through air between two electrodes inside the alarm",
      "the alpha ionises air molecules, creating ions",
      "the ions allow a small steady current to flow between the electrodes",
      "smoke particles entering the alarm absorb the alpha or block the ions, so the current drops",
      "the alarm detects the drop in current and sounds"
    ],
    "shuffleStart": true,
    "markingMode": "per_position",
    "explanation": "Alpha ionises the air inside the alarm, creating a small steady current. Smoke particles disrupt this ionisation, the current falls, and the alarm sounds.",
    "examinerNote": "Five-step ordering at 4 marks (per_position, capped at 4)."
  },
  {
    "id": "paper_gauge_beta_multiselect",
    "type": "multiselect",
    "tags": [
      "uses_beta"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "A thickness gauge for paper or thin aluminium foil uses a beta source. Tick all the genuine reasons why beta is the right choice rather than alpha or gamma.",
    "choices": [
      "alpha would be absorbed completely by even thin paper or foil, so the count rate wouldn't depend on thickness",
      "gamma would pass through almost unaffected, so the count rate wouldn't depend on thickness",
      "beta is partially absorbed, so the count rate varies with thickness",
      "beta is the only radiation that can travel through air",
      "alpha and gamma do not work as gauges of any kind",
      "beta is the cheapest radiation to produce"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Beta and gamma both travel through air; alpha doesn't go far. That's not the deciding factor here.",
      "4": "Alpha and gamma are used for other thickness gauges (e.g. gamma for thick steel). The choice depends on what's being measured.",
      "5": "The choice of radiation is governed by physics (penetration), not cost."
    },
    "markingMode": "penalty",
    "explanation": "For a thickness gauge to work, the count rate at the detector must vary with thickness. Beta is partially absorbed by paper or thin aluminium foil, so the count rate tracks thickness. Alpha would be completely absorbed (gauge always reads background); gamma is barely absorbed at all (gauge reads the same regardless).",
    "examinerNote": "The Edexcel syllabus uses 'aluminium foil' as the canonical thin-foil example for the beta gauge."
  },
  {
    "id": "beta_implant_multiselect",
    "type": "multiselect",
    "tags": [
      "uses_beta"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 3,
    "marks": 4,
    "prompt": "A radioactive source is implanted directly into a tumour. Tick all the genuine reasons why a beta-emitter could be a sensible choice over either alpha or gamma.",
    "choices": [
      "beta has a moderate range and deposits its energy locally, in and near the tumour",
      "beta damage is mostly confined to the tumour, sparing distant healthy tissue",
      "alpha would be absorbed within a fraction of a millimetre, so could not reach all the cancer cells in the tumour",
      "gamma would pass through the tumour and irradiate healthy tissue beyond",
      "beta is harmless, so it cannot damage the tumour",
      "gamma cannot enter living tissue at all",
      "the beta source is not actually radioactive once implanted"
    ],
    "answerIndices": [
      0,
      1,
      2,
      3
    ],
    "distractorRationales": {
      "4": "Beta is harmful to cells; that's how it kills the tumour. The point is that the harm is local to the tumour.",
      "5": "Gamma penetrates tissue easily; that's why it's used for external scans. For implants, that's the problem — gamma carries past the tumour.",
      "6": "The source is radioactive in exactly the same way once implanted. That's how it treats the tumour."
    },
    "markingMode": "penalty",
    "explanation": "An implanted source is meant to deliver dose to the tumour and as little as possible to surrounding healthy tissue. Beta has just the right range: long enough to reach all the cancer cells in a tumour several mm across, short enough that the dose is largely confined to the tumour. Alpha would only ionise the immediate surroundings of the source (a fraction of a mm), missing most of the tumour. Gamma would carry far past the tumour and irradiate distant healthy tissue.",
    "examinerNote": "This is the syllabus's full reasoning: 'alpha would only ionise immediate surroundings, gamma would ionise too widely' — so beta is the Goldilocks choice. The 'why not alpha' angle is what the original question was missing."
  },
  {
    "id": "gamma_tracer_multiselect",
    "type": "multiselect",
    "tags": [
      "uses_gamma"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "marks": 2,
    "prompt": "A radioactive tracer is injected into a patient and the radiation emerging from the body is detected by a camera outside. Tick all the genuine reasons why a gamma-emitter is used.",
    "choices": [
      "gamma is highly penetrating, so it can pass through tissue and out of the body",
      "the gamma can be detected by a camera outside the body",
      "alpha and beta would be absorbed inside the body and never reach the camera",
      "gamma is harmless to all tissue",
      "gamma is the only radiation that can be injected"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Gamma is harmful — that's why tracers are used in low doses with short-half-life isotopes. It's penetrating enough to escape, not harmless.",
      "4": "Any radioactive substance can be injected. The radiation type is what differs."
    },
    "markingMode": "penalty",
    "explanation": "For a tracer to work, the radiation must be detectable from outside the body. Gamma is the only radiation that reliably penetrates body tissue and reaches an external detector.",
    "examinerNote": "Past-paper Q17 4SS0 (June 2019) accepts: 'gamma has a high penetrating ability; gamma can be detected outside the body'."
  },
  {
    "id": "gamma_sterilisation_multiselect",
    "type": "multiselect",
    "tags": [
      "uses_gamma"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "Surgical equipment is sterilised by exposing it (still in its packaging) to gamma radiation from a cobalt-60 source. Tick all the genuine reasons why gamma is the right choice.",
    "choices": [
      "gamma is highly penetrating, so it can pass through the packaging to reach the equipment",
      "gamma kills bacteria and microorganisms on the equipment",
      "the equipment can be sterilised inside its sealed packaging without opening it",
      "gamma chemically cleans the metal surfaces",
      "alpha would also work, but is too expensive",
      "the equipment becomes radioactive afterwards, so any new bacteria are also killed"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Gamma works biologically (DNA damage to bacteria), not by chemical cleaning.",
      "4": "Alpha couldn't penetrate the packaging at all; it's the wrong radiation, not the wrong price.",
      "5": "Irradiation does not make the equipment radioactive. That's a defining feature of irradiation, and the reason this method is safe."
    },
    "markingMode": "penalty",
    "explanation": "Gamma penetrates the packaging easily, so the equipment can be sterilised without ever being unpacked. Gamma kills bacteria by damaging their DNA. The equipment doesn't become radioactive (irradiation, not contamination), so it's safe to use immediately.",
    "examinerNote": ""
  },
  {
    "id": "gamma_steel_gauge_multiselect",
    "type": "multiselect",
    "tags": [
      "uses_gamma"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "A thickness gauge for thick steel sheet uses a gamma source. Tick all the genuine reasons why gamma is the right choice rather than alpha or beta.",
    "choices": [
      "alpha and beta are both absorbed completely by thick steel",
      "gamma is highly penetrating, so it passes through thick steel partially",
      "the count rate at the detector varies with the thickness of the steel",
      "gamma is the cheapest option",
      "alpha cannot be made into a directional beam",
      "thick steel is transparent to alpha"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Cost isn't the deciding factor; physics is.",
      "4": "Beam directionality isn't the issue; thickness penetration is.",
      "5": "Thick steel is the opposite of transparent to alpha — alpha is stopped by even thin material."
    },
    "markingMode": "penalty",
    "explanation": "For a thickness gauge to work, the count rate must vary with thickness. Alpha and beta are both stopped by even modest thicknesses of steel, so neither would reach the detector. Gamma is highly penetrating but partially absorbed, so the count rate at the detector tracks the steel thickness.",
    "examinerNote": ""
  },
  {
    "id": "alpha_wrong_for_paper_gauge_mcq",
    "type": "mcq",
    "tags": [
      "uses_alpha",
      "uses_beta"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "What would happen if alpha (instead of beta) were used in a thickness gauge that monitors paper or thin metal foil?",
    "choices": [
      "the alpha would be absorbed completely by the paper, so the detector would always read background and could not detect changes in thickness",
      "the alpha would pass through the paper unaffected, so the detector reading would never change",
      "the alpha would make the paper radioactive, ruining the product",
      "the alpha would heat the paper, causing it to char"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "That's gamma's behaviour with paper. Alpha is the opposite extreme: stopped completely.",
      "2": "Irradiation by alpha doesn't make objects radioactive in any case.",
      "3": "Alpha sources don't deliver enough energy to char paper at the levels used in gauges."
    },
    "explanation": "Alpha is absorbed by even very thin paper, so essentially no alpha would reach the detector regardless of paper thickness. The detector would just read background noise, and the gauge would be useless.",
    "examinerNote": "The 'alpha is wrong for paper gauges' angle complements the 'beta is right for paper gauges' angle in paper_gauge_beta_multiselect."
  },
  {
    "id": "alpha_static_eliminator_ordering",
    "type": "ordering",
    "tags": [
      "uses_alpha"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 3,
    "marks": 3,
    "prompt": "Some industrial machines use a small alpha source to remove static electrical charge from materials moving on a conveyor (for example, plastic film or paper). Put the steps that explain how the alpha source does this in order.",
    "items": [
      "the alpha source ionises the air around the moving material",
      "the ions in the air are attracted to the opposite static charge on the material",
      "the static charge on the material is neutralised"
    ],
    "shuffleStart": true,
    "markingMode": "per_position",
    "explanation": "Alpha is highly ionising over its short range, so it produces lots of ions in the air right next to the material. Positive ions in the air are attracted to a negatively charged surface and vice versa, neutralising the static.",
    "examinerNote": "Three-step ordering, 3 marks per_position."
  },
  {
    "id": "harm_mechanism_ordering",
    "type": "ordering",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "Put the steps that explain how ionising radiation can damage living cells in order.",
    "items": [
      "ionising radiation passes through tissue and ionises atoms in the cell",
      "the ionisation breaks chemical bonds, including in DNA",
      "damaged cells may die, or may survive with mutations and behave abnormally (e.g. become cancerous)"
    ],
    "shuffleStart": true,
    "markingMode": "per_position",
    "explanation": "Ionisation strips electrons from atoms, breaking chemical bonds. DNA is the most consequential target: damage there can kill the cell outright or leave it with mutations that lead to cancer over time.",
    "examinerNote": "Three-step ordering captures the cause-and-effect chain that the original short tested across three MPs."
  },
  {
    "id": "effect_depends_on_radiation_multiselect",
    "type": "multiselect",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "The biological effect of nuclear radiation depends on the type of radiation as well as the activity of the source. Tick all the genuine reasons why the type of radiation matters.",
    "choices": [
      "different radiations have different ionising abilities (alpha most, gamma least)",
      "different radiations have different ranges in tissue (alpha very short, gamma long)",
      "for the same activity, different radiations deposit different amounts of energy in the body",
      "different radiations have different colours, which the body absorbs differently",
      "different radiations always have different half-lives",
      "only one of the three radiations is ionising"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Alpha and beta are particles; gamma is electromagnetic but not visible. None of them have a 'colour'.",
      "4": "Half-life is a property of the source isotope, not of the radiation type.",
      "5": "All three (alpha, beta, gamma) are ionising — that's why they all cause biological damage."
    },
    "markingMode": "penalty",
    "explanation": "The radiation type affects how ionising it is per particle and how far it travels in tissue. The same activity of an alpha source vs a gamma source can deliver very different doses depending on whether the source is inside the body, behind shielding, or at a distance.",
    "examinerNote": ""
  },
  {
    "id": "dose_factors_multiselect",
    "type": "multiselect",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "Tick all the factors that affect the dose a person receives from a radioactive source.",
    "choices": [
      "the time spent near the source",
      "the distance from the source",
      "the type of radiation emitted",
      "the colour of the person's clothes",
      "the person's age (in itself, holding everything else constant)",
      "the time of day"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Clothes (other than purpose-made shielding) don't significantly absorb the kinds of radiation involved.",
      "4": "Age affects susceptibility to harm from a given dose, but not the dose itself.",
      "5": "Decay is independent of time of day."
    },
    "markingMode": "penalty",
    "explanation": "Three factors govern the dose: time (more time = more decays reach you), distance (further away = fewer decays reach you), and the type of radiation (alpha, beta, gamma have different penetrating and ionising profiles, so deliver different doses for the same activity).",
    "examinerNote": "The 'time, distance, type' triad. (Distance and shielding are the same family; both reduce how much radiation arrives.)"
  },
  {
    "id": "dividing_cells_sensitive_mcq",
    "type": "mcq",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Why are hair, the lining of the gut, and bone marrow typically the first parts of the body to show effects after a high dose of ionising radiation?",
    "choices": [
      "the cells in these tissues divide rapidly, so DNA damage stops them being replaced",
      "these tissues are closer to the skin, so they receive a larger dose",
      "these tissues contain less water, so radiation passes through them more easily",
      "these tissues are not protected by the immune system"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Bone marrow is deep inside the body, not near the skin. The dose argument doesn't fit.",
      "2": "All tissues are mostly water; this isn't the explanation.",
      "3": "The immune system isn't what protects against ionising radiation damage."
    },
    "explanation": "Rapidly dividing cells are the most sensitive to ionising radiation: DNA damage interferes with cell division, and these tissues rely on continuous cell replacement (new hair cells, new gut lining, new blood cells from marrow). So the visible effects (hair loss, gut symptoms, low blood counts) appear soon after exposure.",
    "examinerNote": ""
  },
  {
    "id": "radiation_sickness_multiselect",
    "type": "multiselect",
    "tags": [
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 1,
    "marks": 3,
    "prompt": "Tick all the harmful effects that can result from a high dose of ionising radiation.",
    "choices": [
      "radiation sickness (nausea, vomiting)",
      "skin burns",
      "hair loss",
      "DNA mutations leading to cancer",
      "deafness from loud radioactive emissions",
      "magnetic damage to electronic implants"
    ],
    "answerIndices": [
      0,
      1,
      2,
      3
    ],
    "distractorRationales": {
      "4": "Radioactive decay isn't audible; ionising radiation does not produce sound.",
      "5": "Ionising radiation isn't a magnetic effect."
    },
    "markingMode": "penalty",
    "explanation": "Acute high doses cause radiation sickness, burns, hair loss and damage or kill cells. Long-term, surviving cells with DNA damage may become cancerous.",
    "examinerNote": "Past-paper Q48 (4SS0 June 2023) accepts: 'radiation sickness; (skin) burns; damaging/mutating/killing cells; cancer'."
  },
  {
    "id": "external_alpha_low_risk_mcq",
    "type": "mcq",
    "tags": [
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Why does an external alpha source held at arm's length pose very little risk to a person?",
    "choices": [
      "alpha has a very short range in air, so essentially none reaches the person",
      "alpha is the least ionising of the three radiations",
      "alpha cannot be detected by the body's nerves",
      "alpha is electromagnetic, so it passes harmlessly through tissue"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Alpha is the MOST ionising of the three; that's why it's so dangerous when it does reach tissue.",
      "2": "Detection by nerves isn't the relevant safety mechanism.",
      "3": "Alpha is a particle (helium nucleus), not electromagnetic."
    },
    "explanation": "Alpha is absorbed in just a few centimetres of air, so very little reaches a person at arm's length. The danger only arises when the source is much closer — touching the skin, or (especially) inside the body where it deposits all its energy in nearby living tissue.",
    "examinerNote": "Note: students sometimes write 'alpha can't penetrate skin'. This is loosely true (the dead outer layer of skin absorbs much of the alpha), but the syllabus's framing is that alpha is dangerous from close contact (touching, inhaling), so the cleaner reason is that alpha is absorbed by air before it reaches you when held at arm's length."
  },
  {
    "id": "inhaled_alpha_danger_multiselect",
    "type": "multiselect",
    "tags": [
      "which_most_dangerous",
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 3,
    "marks": 3,
    "prompt": "Tick all the genuine reasons why inhaling dust contaminated with an alpha-emitting substance is much more dangerous than holding a sealed alpha source in your hand.",
    "choices": [
      "the alpha is now inside the body, so there is no skin to absorb it",
      "alpha deposits its energy locally, and lung tissue is in close contact with the source",
      "alpha is highly ionising, so a lot of damage is done per particle",
      "inhaled alpha turns into beta inside the body",
      "the lungs are made of unusually radiation-sensitive material",
      "alpha has a much longer range inside tissue than in air"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Alpha doesn't change into another radiation type once inhaled; it's the same alpha.",
      "4": "Lung tissue is sensitive but not unusually so. The danger comes from the source being right next to dividing cells, not lung-specific properties.",
      "5": "Alpha's range in tissue is even shorter than in air. The danger isn't range; it's that all the energy is dumped into the very nearby tissue."
    },
    "markingMode": "penalty",
    "explanation": "Alpha is dangerous to tissue when it can reach tissue. Held externally, the skin absorbs everything; inhaled, the source is in direct contact with lung tissue with no skin barrier, and alpha's high ionising power means heavy local damage.",
    "examinerNote": "Past-paper Q42 (4PH1 Jan 2023) directly asks this kind of question about radon."
  },
  {
    "id": "barrier_dose_dominant_mcq",
    "type": "mcq",
    "tags": [
      "which_most_dangerous",
      "penetration"
    ],
    "specRefs": [
      "7.5",
      "7.16"
    ],
    "difficultyRating": 3,
    "marks": 1,
    "prompt": "A worker stands behind a sheet of aluminium that completely blocks beta but only partly absorbs gamma. A source on the other side emits both beta and gamma. Which radiation contributes more to the worker's dose?",
    "choices": [
      "the gamma — the aluminium blocks beta entirely, but lets some gamma through",
      "the beta — beta is more harmful than gamma in all situations",
      "they contribute equally, because the aluminium absorbs both",
      "neither — the aluminium blocks all radiation"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Beta isn't 'more harmful in all situations' — it depends on what reaches the body. Here, no beta reaches the worker at all.",
      "2": "The aluminium blocks beta but only partly absorbs gamma; the absorptions are different.",
      "3": "Aluminium of a few mm has very little effect on gamma; some always gets through."
    },
    "explanation": "If the aluminium completely blocks beta, no beta reaches the worker, so beta contributes zero to the dose. Some gamma passes through the aluminium and reaches the worker, so gamma is the only contributor.",
    "examinerNote": ""
  },
  {
    "id": "danger_external_vs_internal_grid",
    "type": "grid",
    "tags": [
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 3,
    "marks": 6,
    "prompt": "For each radiation, tick whether it is the most dangerous when the source is OUTSIDE the body, when the source is INSIDE the body, both, or neither.",
    "rows": [
      "alpha (α)",
      "beta (β)",
      "gamma (γ)"
    ],
    "columns": [
      "most dangerous: external source",
      "most dangerous: internal source"
    ],
    "correct": {
      "0": [
        1
      ],
      "1": [],
      "2": [
        0
      ]
    },
    "neutral": {
      "1": [
        0,
        1
      ]
    },
    "markingMode": "per_row",
    "explanation": "Outside the body, only the most penetrating radiation reaches tissue, so gamma is the worst external risk; alpha doesn't even reach the skin. Inside the body, all three reach tissue equally, but alpha's very high ionising ability makes it the worst per particle. Beta is in the middle in both cases — never the most dangerous, but always significant.",
    "examinerNote": "Beta has empty correct and neutral cells for both columns: it's neither the worst external nor the worst internal, but a tick on either column isn't penalised because it's a defensible second-place."
  },
  {
    "id": "three_sources_at_2m_mcq",
    "type": "mcq",
    "tags": [
      "which_most_dangerous"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 3,
    "marks": 1,
    "prompt": "Three sealed sources, one alpha, one beta and one gamma, each with the same activity, are laid on a teacher's desk for 5 minutes. The teacher stands 2 metres away. Which source contributes most to the dose received by the teacher?",
    "choices": [
      "the gamma — alpha and beta are mostly absorbed by 2 m of air, so only gamma reaches the teacher",
      "the alpha — alpha is the most ionising, so it always does the most damage",
      "the beta — beta has the right range to reach 2 m and still cause damage",
      "all three contribute equally, because the activities are the same"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Alpha is the most ionising IF it reaches tissue. At 2 m through air, essentially none reaches the teacher.",
      "2": "Beta is largely absorbed by 2 m of air; only a small fraction reaches the teacher compared to gamma.",
      "3": "Equal activity means equal decay rate, but most of the alpha and much of the beta is absorbed before reaching the teacher."
    },
    "explanation": "Alpha is absorbed by a few cm of air; almost none reaches the teacher 2 m away. Beta is mostly absorbed over 2 m of air. Gamma travels 2 m of air essentially unabsorbed. So even though the activities are the same, only the gamma reaches the teacher in significant amounts.",
    "examinerNote": ""
  },
  {
    "id": "long_halflife_long_danger_mcq",
    "type": "mcq",
    "tags": [
      "which_most_dangerous",
      "halflife"
    ],
    "specRefs": [
      "7.12",
      "7.16"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Why is a radioactive substance with a long half-life generally regarded as 'dangerous for a long time'?",
    "choices": [
      "the substance keeps emitting ionising radiation for a long time, because most of it decays only slowly",
      "long-half-life isotopes are always more ionising than short-half-life ones",
      "long-half-life isotopes always have higher activity than short-half-life ones",
      "long-half-life means the substance decays into more dangerous products"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Half-life and ionising power are independent properties. Half-life doesn't determine which radiation comes out.",
      "2": "It's the opposite, in fact: for the same number of nuclei, longer half-life means lower activity (slower decay).",
      "3": "What it decays into depends on the specific isotope, not on the length of the half-life."
    },
    "explanation": "Long half-life means the substance takes a long time for its activity to drop. So even after years, much of the original substance is still present and still emitting radiation. Anyone exposed during this time receives a dose, and the area remains hazardous for many half-lives.",
    "examinerNote": ""
  },
  {
    "id": "waste_lifetime_storage_matching",
    "type": "matching",
    "tags": [
      "waste_disposal",
      "halflife"
    ],
    "specRefs": [
      "7.16",
      "7.12"
    ],
    "difficultyRating": 2,
    "marks": 2,
    "prompt": "Match each kind of nuclear waste to the storage approach typically used.",
    "pairs": [
      {
        "left": "short-lived isotopes (half-lives of years to decades)",
        "right": "decay to safe levels relatively quickly; surface-near sealed burial is acceptable"
      },
      {
        "left": "long-lived isotopes (half-lives of thousands to millions of years)",
        "right": "remain radioactive for thousands of years; require deep geological repositories"
      }
    ],
    "rightExtras": [
      "release into the atmosphere (the radiation disperses harmlessly)"
    ],
    "shuffleRight": true,
    "explanation": "How long the waste must be safely stored is set by its half-life. Short-lived isotopes decay to safe activity in years to decades; long-lived isotopes need storage stable on a geological timescale.",
    "examinerNote": "rightExtras includes the wrong-direction distractor that students sometimes write."
  },
  {
    "id": "why_waste_dangerous_mcq",
    "type": "mcq",
    "tags": [
      "waste_disposal",
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Why must nuclear waste from a power station be disposed of carefully?",
    "choices": [
      "the waste contains radioactive isotopes that emit ionising radiation harmful to living tissue, sometimes with very long half-lives",
      "the waste is hot and would otherwise burn anyone who touched it",
      "the waste is acidic and would corrode soil over time",
      "the waste is bulky and there is no space to store it casually"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Heat is one practical issue but not why disposal is regulated; the radiation hazard is.",
      "2": "Nuclear waste is not chemically acidic in any unusual way.",
      "3": "Nuclear waste is actually small in volume compared to fossil-fuel waste; the issue is its toxicity, not its bulk."
    },
    "explanation": "Spent fuel and other waste from a reactor contain a wide range of radioactive isotopes that emit ionising radiation. Some have long half-lives, so the waste can remain dangerous for thousands of years; the storage method has to keep the waste safely contained for that long.",
    "examinerNote": ""
  },
  {
    "id": "waste_storage_location_multiselect",
    "type": "multiselect",
    "tags": [
      "waste_disposal"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 3,
    "marks": 3,
    "prompt": "Tick all the genuine reasons why nuclear waste is generally not stored near population centres or major waterways, even when packaged in robust containers.",
    "choices": [
      "if a container fails, radioactive material could spread and contaminate the area",
      "for long-lived waste, any contamination would persist for thousands of years",
      "groundwater could carry contamination far from the storage site",
      "radiation can pass directly through any container to harm people nearby",
      "the radioactive waste attracts wildlife that would spread the material",
      "storing waste near towns is cheaper than the alternatives"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Properly designed containers shield the radiation effectively. The risk is from a leak, not from in-service shielding failure.",
      "4": "Radioactive waste isn't biologically attractive in that way.",
      "5": "Cost might be lower in the short term but the long-term consequences of a leak in a populated area are catastrophic."
    },
    "markingMode": "penalty",
    "explanation": "The risk is contamination spread, not in-service radiation. If a container ever fails, radioactive material could leak into soil and groundwater. Since long-lived waste persists for thousands of years, even a remote storage site has to keep the waste contained on a geological timescale, and proximity to people or rivers makes a leak much more dangerous.",
    "examinerNote": ""
  },
  {
    "id": "nuclear_vs_fossil_waste_grid",
    "type": "grid",
    "tags": [
      "waste_disposal"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "marks": 4,
    "prompt": "For each statement, tick which kind of power station's waste it best describes.",
    "rows": [
      "the volume of waste is small (per unit of electricity generated)",
      "the volume of waste is very large (mostly ash and CO₂)",
      "the waste is contained / sealed in storage",
      "the waste is mostly released into the atmosphere"
    ],
    "columns": [
      "nuclear",
      "coal-fired",
      "both"
    ],
    "correct": {
      "0": [
        0
      ],
      "1": [
        1
      ],
      "2": [
        0
      ],
      "3": [
        1
      ]
    },
    "markingMode": "per_row",
    "explanation": "A nuclear station produces a small volume of intensely radioactive waste, which is sealed and stored. A coal station produces a large volume of ash plus CO₂ and other gases, most of which is released to the atmosphere. The headline trade-off is small-but-contained vs large-but-released.",
    "examinerNote": ""
  },
  {
    "id": "fission_means_mcq",
    "type": "mcq",
    "tags": [
      "fission"
    ],
    "specRefs": [
      "7.17",
      "7.18"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Nuclear fission is:",
    "choices": [
      "a large nucleus splitting into smaller nuclei",
      "small nuclei joining to make a larger nucleus",
      "an electron leaving a nucleus",
      "a nucleus emitting a gamma ray"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Small nuclei joining is fusion, not fission.",
      "2": "An electron leaving the nucleus is beta decay, not fission.",
      "3": "Gamma emission is part of decay but is not fission."
    },
    "explanation": "Fission splits a large nucleus into smaller (daughter) nuclei. Fusion is the opposite.",
    "examinerNote": ""
  },
  {
    "id": "fission_starter_mcq",
    "type": "mcq",
    "tags": [
      "fission"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "What particle starts the fission of a uranium-235 nucleus?",
    "choices": [
      "a neutron",
      "a proton",
      "an alpha particle",
      "a gamma ray"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Protons are positively charged like the U-235 nucleus, so they would be repelled. Neutrons are uncharged and can get in.",
      "2": "Alpha particles are charged and would be repelled by the nucleus.",
      "3": "Gamma rays don't usually trigger fission of U-235."
    },
    "explanation": "A neutron is absorbed by the U-235 nucleus, briefly making U-236, which then splits.",
    "examinerNote": "Past paper Q23(a)(i): \"neutron\" with note \"ignore n\"."
  },
  {
    "id": "fission_intermediate_mcq",
    "type": "mcq",
    "tags": [
      "fission"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "When uranium-235 absorbs a neutron, it briefly becomes:",
    "choices": [
      "uranium-236",
      "uranium-234",
      "plutonium-239",
      "barium-141"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "U-234 has fewer neutrons than U-235, not more.",
      "2": "Plutonium-239 is a different fuel made by neutron capture on U-238, not from U-235.",
      "3": "Barium-141 is a daughter nucleus produced AFTER the U-236 splits, not the intermediate."
    },
    "explanation": "U-235 + neutron → U-236, which is unstable and immediately splits.",
    "examinerNote": "Past papers (Q22, Q30) award a separate mark point for naming U-236."
  },
  {
    "id": "fission_fuel_mcq",
    "type": "mcq",
    "tags": [
      "fission",
      "energy_from_nuclear"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "What nucleus is most commonly used as fuel in a nuclear power station?",
    "choices": [
      "uranium-235",
      "hydrogen-2",
      "carbon-14",
      "iron-56"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Hydrogen-2 (deuterium) is used in fusion reactors, not fission. Fission needs a heavy nucleus.",
      "2": "Carbon-14 is a radioactive isotope used for dating, not as a power-station fuel.",
      "3": "Iron-56 is the most stable nucleus; it cannot be split for energy."
    },
    "explanation": "Uranium-235 is the standard fission fuel. Plutonium-239 is also used.",
    "examinerNote": ""
  },
  {
    "id": "fission_daughter_count_mcq",
    "type": "mcq",
    "tags": [
      "fission"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "When U-235 splits in fission, how many daughter nuclei are produced?",
    "choices": [
      "two",
      "one",
      "three or four",
      "it varies from zero to five"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Just one daughter would mean the nucleus didn't really split.",
      "2": "Three or four would imply a more complex split. Two is the standard fission picture.",
      "3": "The number of daughters is two every time."
    },
    "explanation": "Two daughter nuclei are produced from each U-235 fission event.",
    "examinerNote": "Past paper Q30: \"producing (two) daughter nuclei\"."
  },
  {
    "id": "fission_neutrons_released_mcq",
    "type": "mcq",
    "tags": [
      "fission"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "When a U-235 nucleus splits in fission, how many neutrons are typically released?",
    "choices": [
      "two or three",
      "always exactly one",
      "always exactly four",
      "zero"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Only one neutron triggered the fission, but more come out.",
      "2": "Four neutrons is too many. The typical number is 2 or 3.",
      "3": "Zero would mean no neutrons available for further reactions."
    },
    "explanation": "Fission of U-235 typically releases 2 or 3 neutrons, alongside the two daughter nuclei.",
    "examinerNote": "4SS0 7.19 explicitly excludes the chain-reaction follow-up."
  },
  {
    "id": "fission_daughters_radioactive_mcq",
    "type": "mcq",
    "tags": [
      "fission",
      "waste_disposal"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Are the daughter nuclei produced by fission radioactive?",
    "choices": [
      "yes",
      "no",
      "only if the reactor is running"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The daughters are radioactive, which is the source of nuclear waste's radioactivity.",
      "2": "The daughters are radioactive whether the reactor is running or not."
    },
    "explanation": "The daughter nuclei are radioactive. This is why spent fuel from a reactor stays radioactive long after the reaction has stopped.",
    "examinerNote": ""
  },
  {
    "id": "why_fission_products_radioactive_mcq",
    "type": "mcq",
    "tags": [
      "fission"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 3,
    "marks": 1,
    "prompt": "The daughter nuclei produced by fission are typically radioactive because:",
    "choices": [
      "they have too many neutrons compared to a stable nucleus of their size",
      "they have too few neutrons compared to a stable nucleus of their size",
      "they are all hydrogen nuclei",
      "fission always heats them up too much"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "U-235 is very neutron-rich; the daughters inherit that, so they have too many, not too few.",
      "2": "Most fission products are not hydrogen.",
      "3": "Heat doesn't make a nucleus radioactive; the proton-neutron ratio does."
    },
    "explanation": "U-235 is very neutron-rich. When it splits, the smaller daughter nuclei inherit a high neutron-to-proton ratio, which is unstable for nuclei of that size. They then decay (typically by beta) until they reach a stable configuration.",
    "examinerNote": "Replaces a 2-mark short. The 'neutron-rich' idea is the single reason; multiple synonyms fold in to one MCQ."
  },
  {
    "id": "fission_energy_form_mcq",
    "type": "mcq",
    "tags": [
      "fission",
      "energy_from_nuclear"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Energy released in nuclear fission appears mainly as:",
    "choices": [
      "kinetic energy of the fission products",
      "sound",
      "light",
      "chemical energy"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Sound energy is not significant in fission.",
      "2": "Some gamma is emitted, but most of the energy is kinetic energy of the daughter nuclei.",
      "3": "Fission is a nuclear process, not a chemical one."
    },
    "explanation": "The energy released appears as kinetic energy of the daughter nuclei and the released neutrons. This kinetic energy heats the surrounding material, which is how the reactor produces useful heat.",
    "examinerNote": "Past paper Q23(a)(iii) accepts \"kinetic energy / KE\" with note \"allow thermal\"."
  },
  {
    "id": "fission_products_summary_mcq",
    "type": "mcq",
    "tags": [
      "fission"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "When a uranium-235 nucleus undergoes fission after absorbing a neutron, what are the typical products?",
    "choices": [
      "two equal smaller nuclei, with no other products",
      "two smaller nuclei, plus 2 or 3 neutrons, plus energy",
      "a single smaller nucleus, plus an alpha particle, plus energy",
      "two electrons and a gamma ray"
    ],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "Fission also releases neutrons and energy.",
      "2": "Fission splits into two roughly comparable nuclei, not one nucleus plus an alpha.",
      "3": "The products are nuclei and neutrons, not electrons."
    },
    "explanation": "The typical products are two smaller (and usually unequal) nuclei, 2 or 3 free neutrons, and a large amount of energy. The smaller nuclei are themselves often radioactive.",
    "examinerNote": ""
  },
  {
    "id": "fission_vs_other_processes_mcq",
    "type": "mcq",
    "tags": [
      "fission"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Which of the following best describes nuclear fission?",
    "choices": [
      "two small nuclei joining to form a larger nucleus",
      "a large nucleus splitting after absorbing a neutron, releasing energy and more neutrons",
      "an unstable nucleus emitting an alpha particle",
      "a chemical reaction in the fuel"
    ],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "That describes fusion, not fission.",
      "2": "That describes alpha decay; fission is a different process.",
      "3": "Fission is a nuclear reaction, not chemical."
    },
    "explanation": "Fission is the splitting of a large nucleus, triggered by absorption of a neutron, releasing energy and 2 or 3 more neutrons.",
    "examinerNote": "Distinguish from fusion (joining), alpha decay (single particle emission), and chemistry."
  },
  {
    "id": "nuclear_power_station_uses_mcq",
    "type": "mcq",
    "tags": [
      "fission",
      "energy_from_nuclear"
    ],
    "specRefs": [
      "7.17"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "A nuclear power station generates energy from:",
    "choices": [
      "fission",
      "fusion",
      "radioactive decay only",
      "burning uranium"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Fusion would produce more energy but is not yet workable on Earth as a power source.",
      "2": "Radioactive decay alone is too slow and weak for a power station.",
      "3": "Uranium isn't burned chemically — it undergoes nuclear fission."
    },
    "explanation": "Power stations use fission of uranium-235 (or plutonium-239). Fusion would produce vastly more energy but is not yet workable on Earth.",
    "examinerNote": ""
  },
  {
    "id": "fission_word_short",
    "type": "short",
    "tags": [
      "fission"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "What is the name of the process in which a large nucleus splits, after absorbing a neutron, into smaller nuclei plus energy and more neutrons?",
    "markPoints": [
      {
        "any": [
          "fission",
          "nuclear fission"
        ]
      }
    ],
    "allowAdjust": false,
    "explanation": "This is nuclear fission. The word must be spelled correctly.",
    "examinerNote": "Spelling matters: 'fission' not 'fision' or 'fussion'."
  },
  {
    "id": "fission_process_ordering",
    "type": "ordering",
    "tags": [
      "fission"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 2,
    "marks": 4,
    "prompt": "Put the steps of the fission of uranium-235 in the order they happen.",
    "items": [
      "A free neutron is absorbed by a U-235 nucleus.",
      "The nucleus briefly becomes U-236, which is unstable.",
      "The nucleus splits into two smaller (daughter) nuclei.",
      "Energy and 2 or 3 free neutrons are released."
    ],
    "shuffleStart": true,
    "markingMode": "per_position",
    "explanation": "U-235 absorbs a free neutron and momentarily becomes U-236. The unstable U-236 nucleus immediately splits into two smaller nuclei. Energy (mostly as kinetic energy of the products) and 2 or 3 free neutrons are released.",
    "examinerNote": "Direct map to Q30 mark scheme phrasing. Past paper accepts 'allow atom for nucleus'."
  },
  {
    "id": "fusion_means_mcq",
    "type": "mcq",
    "tags": [
      "fusion"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Nuclear fusion is:",
    "choices": [
      "the joining of two small nuclei to form a larger nucleus, releasing energy",
      "the splitting of a large nucleus into smaller ones",
      "the same as fission",
      "a process that absorbs energy without releasing any"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "That describes fission.",
      "2": "Fusion and fission are opposite processes.",
      "3": "Fusion releases a large amount of energy."
    },
    "explanation": "Fusion joins two small nuclei into a larger one, releasing energy. The mass of the product is slightly less than the combined mass of the reactants; the difference becomes energy.",
    "examinerNote": "Past paper Q28(b)(i) mark scheme: 'creation of a (large) nucleus from small nuclei; loss of mass; release of energy'."
  },
  {
    "id": "fusion_word_short",
    "type": "short",
    "tags": [
      "fusion"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "What is the name of the process in which two small nuclei combine to form a larger nucleus, releasing energy?",
    "markPoints": [
      {
        "any": [
          "fusion",
          "nuclear fusion"
        ]
      }
    ],
    "allowAdjust": false,
    "explanation": "This is nuclear fusion. The word must be spelled correctly.",
    "examinerNote": "Spelling matters: 'fusion' not 'fussion' or 'fution'."
  },
  {
    "id": "sun_uses_mcq",
    "type": "mcq",
    "tags": [
      "fusion"
    ],
    "specRefs": [
      "7.17",
      "7.25"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "The Sun generates its energy from:",
    "choices": [
      "fusion",
      "fission",
      "burning hydrogen",
      "radioactive decay"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Fission requires heavy nuclei like U-235; the Sun is mostly hydrogen.",
      "2": "Hydrogen isn't burned chemically in the Sun — its nuclei fuse.",
      "3": "Radioactive decay is too small a process to power the Sun."
    },
    "explanation": "The Sun fuses hydrogen nuclei into helium nuclei in its core, releasing huge amounts of energy.",
    "examinerNote": "Past paper Q5: 'D - nuclear fusion'."
  },
  {
    "id": "where_fusion_happens_mcq",
    "type": "mcq",
    "tags": [
      "fusion"
    ],
    "specRefs": [
      "7.25"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Where does fusion happen naturally?",
    "choices": [
      "inside stars",
      "inside nuclear power stations on Earth",
      "inside batteries",
      "in rocks under the ground"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Power stations use fission, not fusion.",
      "2": "Batteries use chemical reactions, not nuclear fusion.",
      "3": "No fusion happens in rocks under normal conditions."
    },
    "explanation": "Fusion happens in the cores of stars, including the Sun. Experimental fusion reactors on Earth exist but are not yet workable for power generation.",
    "examinerNote": ""
  },
  {
    "id": "what_fuses_in_stars_mcq",
    "type": "mcq",
    "tags": [
      "fusion"
    ],
    "specRefs": [
      "7.25"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Which element is mostly fused into another in the Sun's core?",
    "choices": [
      "hydrogen (into helium)",
      "helium (into hydrogen)",
      "oxygen (into carbon)",
      "iron (into uranium)"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "It's the other way round: hydrogen fuses to make helium.",
      "2": "Oxygen fusion happens in massive stars at later stages, not in the Sun.",
      "3": "Iron is the heaviest element formed by ordinary stellar fusion."
    },
    "explanation": "The Sun fuses hydrogen nuclei into helium nuclei.",
    "examinerNote": ""
  },
  {
    "id": "fusion_in_sun_centre_mcq",
    "type": "mcq",
    "tags": [
      "fusion"
    ],
    "specRefs": [
      "7.25"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Where in the Sun does fusion happen?",
    "choices": [
      "evenly throughout the Sun",
      "only at the centre, where it is hot enough",
      "only at the surface",
      "fusion does not happen in the Sun"
    ],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "Only the centre is hot and pressurised enough for fusion.",
      "2": "The surface is too cool and not under enough pressure.",
      "3": "Fusion is the source of the Sun's energy."
    },
    "explanation": "Fusion takes place only in the centre of the Sun. The rest of the Sun is too cool and not pressurised enough.",
    "examinerNote": "Past paper Q32(a)(ii): '(Centre of) stars / allow the Sun'."
  },
  {
    "id": "fusion_hard_on_earth_multiselect",
    "type": "multiselect",
    "tags": [
      "fusion",
      "energy_from_nuclear"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "Tick all the genuine reasons why fusion is not yet a working commercial energy source on Earth.",
    "choices": [
      "extremely high temperatures are needed",
      "extremely high pressures are needed",
      "no ordinary material can contain the hot fuel",
      "hydrogen is in very short supply on Earth",
      "the products of fusion are highly radioactive",
      "fusion does not actually release any energy"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Hydrogen is abundant; deuterium can be extracted from sea water. Fuel supply isn't the problem.",
      "4": "Fusion's main product (helium) is harmless; this is one of fusion's advantages, not a disadvantage.",
      "5": "Fusion releases a great deal of energy; that's why we want it as a power source."
    },
    "markingMode": "penalty",
    "explanation": "Fusion needs star-like conditions: very high temperatures (so nuclei have enough kinetic energy to overcome their electrical repulsion), very high pressures (to force them close enough), and no ordinary material can hold the resulting plasma. The other choices are common myths.",
    "examinerNote": "Past paper Q28(b)(iii) accepts five MPs: high T, KE, high P, close enough to collide, repel each other."
  },
  {
    "id": "fusion_state_of_tech_mcq",
    "type": "mcq",
    "tags": [
      "fusion",
      "energy_from_nuclear"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Choose the most accurate statement about fusion as an energy source.",
    "choices": [
      "fusion is impossible on Earth",
      "fusion happens easily on Earth, but is not yet economical",
      "fusion has been demonstrated in experiments, but no commercial-scale fusion power station is yet operating",
      "fusion power stations have been operating for decades"
    ],
    "answerIndex": 2,
    "distractorRationales": {
      "0": "Fusion has been demonstrated in experiments and in hydrogen bombs.",
      "1": "Fusion does not happen easily on Earth; the conditions are very hard to create.",
      "3": "There is currently no commercial fusion power station."
    },
    "explanation": "Fusion has been demonstrated experimentally, but no commercial-scale fusion power station is yet operating.",
    "examinerNote": ""
  },
  {
    "id": "fission_vs_fusion_grid",
    "type": "grid",
    "tags": [
      "fission",
      "fusion",
      "waste_disposal"
    ],
    "specRefs": [
      "7.17",
      "7.18"
    ],
    "difficultyRating": 2,
    "marks": 5,
    "prompt": "For each statement, tick whether it applies to fission, fusion, or both.",
    "rows": [
      "splits a large nucleus",
      "joins two small nuclei",
      "produces long-lived radioactive waste",
      "happens naturally in the cores of stars",
      "is currently used in commercial power stations"
    ],
    "columns": [
      "fission",
      "fusion",
      "both"
    ],
    "correct": {
      "0": [
        0
      ],
      "1": [
        1
      ],
      "2": [
        0
      ],
      "3": [
        1
      ],
      "4": [
        0
      ]
    },
    "markingMode": "per_row",
    "explanation": "Fission splits a heavy nucleus and is currently used in power stations; its products are long-lived radioactive waste. Fusion joins light nuclei and happens naturally in stars. Both release energy because the products together have slightly less mass than the reactants — but only one row tests that here. (See `fusion_vs_fission_waste_mcq` for the cleanness comparison.)",
    "examinerNote": "Five rows; one row per row is the marking mode. Direct contrast across both processes."
  },
  {
    "id": "fusion_vs_fission_waste_mcq",
    "type": "mcq",
    "tags": [
      "fusion",
      "fission",
      "waste_disposal"
    ],
    "specRefs": [
      "7.18"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Choose the best statement comparing fusion and fission as energy sources.",
    "choices": [
      "fission and fusion produce the same kinds of waste",
      "fission produces long-lived radioactive waste; fusion produces little radioactive waste, mostly with shorter half-lives",
      "fusion produces more long-lived radioactive waste than fission",
      "neither process produces any radioactive waste at all"
    ],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "The waste profiles are different: fission much worse than fusion in this respect.",
      "2": "Fusion produces much LESS long-lived waste than fission.",
      "3": "Fission certainly produces radioactive waste; fusion produces some too (from neutron activation of reactor materials)."
    },
    "explanation": "Fission produces long-lived radioactive waste, including spent fuel and fission products with half-lives of thousands of years. Fusion's main product (helium) is harmless; some reactor materials become radioactive through neutron activation, but with much shorter half-lives.",
    "examinerNote": "Both produce some waste, but fusion's is smaller and shorter-lived."
  },
  {
    "id": "energy_from_where_fillblank",
    "type": "fillblank",
    "tags": [
      "energy_from_nuclear"
    ],
    "specRefs": [
      "7.17"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "The energy released in fission and fusion comes from changes in the {}.",
    "blanks": [
      {
        "expected": [
          "nucleus",
          "nuclei"
        ]
      }
    ],
    "explanation": "Fission and fusion are nuclear reactions: the energy comes from changes in the nucleus. (Chemical reactions, by contrast, only rearrange electrons.)",
    "examinerNote": ""
  },
  {
    "id": "nuclear_energy_source_mcq",
    "type": "mcq",
    "tags": [
      "energy_from_nuclear"
    ],
    "specRefs": [
      "7.17"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Choose the best statement about the source of nuclear energy.",
    "choices": [
      "nuclear energy comes from chemical reactions in the fuel",
      "nuclear energy comes from changes in the nucleus, with a small amount of mass becoming energy",
      "nuclear energy comes from heat already present in the fuel",
      "nuclear energy comes from the kinetic energy of the fuel atoms"
    ],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "Chemistry rearranges electrons; nuclear energy comes from the nucleus.",
      "2": "The fuel doesn't simply have the energy as heat; the energy comes from the reaction.",
      "3": "The kinetic energy of fuel atoms is small; nuclear energy is from the nucleus."
    },
    "explanation": "Nuclear energy is released by changes in the nucleus, in which a tiny amount of mass is converted into energy. The energy per reaction is enormous compared to chemical reactions.",
    "examinerNote": "The mass→energy idea is the headline."
  },
  {
    "id": "reactor_shielding_material_mcq",
    "type": "mcq",
    "tags": [
      "shielding",
      "energy_from_nuclear"
    ],
    "specRefs": [
      "7.22"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "What material is typically used as shielding around a nuclear reactor?",
    "choices": [
      "thick concrete and lead",
      "wood",
      "aluminium foil",
      "plastic sheets"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Wood is too thin and too low-density to absorb gamma.",
      "2": "Aluminium foil is far too thin. (A few mm of aluminium stops beta but not gamma.)",
      "3": "Plastic is too low-density. Gamma needs dense materials."
    },
    "explanation": "Thick concrete (often several metres) and/or lead are used because gamma is highly penetrating and only thick dense materials absorb it.",
    "examinerNote": "Past paper Q29(b)(i) accepts 'concrete absorbs / weakens radiation'; Q23(b) accepts 'absorbed by many cm of lead'."
  },
  {
    "id": "why_shielding_mcq",
    "type": "mcq",
    "tags": [
      "shielding",
      "energy_from_nuclear"
    ],
    "specRefs": [
      "7.22"
    ],
    "difficultyRating": 1,
    "marks": 1,
    "prompt": "Why is shielding needed around a nuclear reactor?",
    "choices": [
      "to absorb harmful ionising radiation so it doesn't reach workers",
      "to keep the reactor warm",
      "to stop the fuel from falling out",
      "to make the building look more solid"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Reactors produce far more heat than is useful; the issue is keeping radiation OUT, not heat IN.",
      "2": "Shielding doesn't physically hold the fuel.",
      "3": "Shielding is functional, not decorative."
    },
    "explanation": "The reactor produces large amounts of ionising radiation (especially gamma) that would harm anyone exposed. Shielding absorbs the radiation.",
    "examinerNote": "Past paper Q22(d)(iii) anchors the 'radiation absorbed' phrasing."
  },
  {
    "id": "shielding_to_radiation_matching",
    "type": "matching",
    "tags": [
      "shielding",
      "radiation_types"
    ],
    "specRefs": [
      "7.16",
      "7.5"
    ],
    "atoms": [
      "alpha_penetration",
      "beta_penetration",
      "gamma_penetration"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "Match each radiation to the shielding usually needed to stop it.",
    "pairs": [
      {
        "left": "alpha (α)",
        "right": "paper or a few cm of air"
      },
      {
        "left": "beta (β)",
        "right": "a few mm of aluminium"
      },
      {
        "left": "gamma (γ)",
        "right": "thick lead or concrete"
      }
    ],
    "rightExtras": [
      "a single layer of clingfilm"
    ],
    "shuffleRight": true,
    "explanation": "The denser/thicker the material, the more penetrating the radiation it can stop. Alpha is easy to stop; beta needs a few mm of aluminium; gamma needs thick lead or concrete.",
    "examinerNote": "Match shielding to the penetrating power of the radiation."
  },
  {
    "id": "extra_precautions_with_shielding_multiselect",
    "type": "multiselect",
    "tags": [
      "shielding"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "marks": 3,
    "prompt": "Shielding alone never absorbs all the radiation. Tick all the extra precautions that should be combined with shielding to keep the dose low.",
    "choices": [
      "limit the time spent near the source",
      "increase the distance from the source",
      "rotate workers so no one is near for too long",
      "stand directly between the source and the wall",
      "remove the shielding to check the source",
      "ignore dose readings under 50 mSv"
    ],
    "answerIndices": [
      0,
      1,
      2
    ],
    "distractorRationales": {
      "3": "Standing between the source and the wall puts you in the path of the radiation; the opposite of what you want.",
      "4": "Removing shielding raises the dose, not lowers it.",
      "5": "All dose matters; safety culture is to keep dose 'as low as reasonably achievable'."
    },
    "markingMode": "penalty",
    "explanation": "The three pillars of radiation safety are time, distance and shielding. No shielding is perfect, so combine it with limiting time of exposure and increasing distance. Rotating workers spreads the dose so no individual receives too much over their career.",
    "examinerNote": "The 'time, distance, shielding' triad. All three together is standard radiation safety."
  },
  {
    "id": "shielding_application_examples_mcq",
    "type": "mcq",
    "tags": [
      "shielding"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Which pair correctly matches a use to the appropriate shielding?",
    "choices": [
      "smoke alarm: thick lead to contain the alpha",
      "X-ray room: lead-lined walls to protect operators outside the room",
      "gamma sterilisation facility: a few mm of aluminium between source and worker",
      "alpha-source classroom demonstration: thick concrete blocks around the source"
    ],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "Alpha doesn't need lead — paper or even air absorbs it. The smoke alarm casing is enough.",
      "2": "Aluminium is for beta. Gamma needs thick lead or concrete.",
      "3": "Alpha is stopped by air or paper; thick concrete is wildly excessive."
    },
    "explanation": "X-rays are highly penetrating, similar to gamma, so an X-ray room needs thick lead-lined walls. The other pairs mismatch the radiation to the shielding.",
    "examinerNote": ""
  },
  {
    "id": "combined_precautions_mcq",
    "type": "mcq",
    "tags": [
      "shielding",
      "bio_effects"
    ],
    "specRefs": [
      "7.16"
    ],
    "difficultyRating": 2,
    "marks": 1,
    "prompt": "Choose the best statement about radiation safety precautions.",
    "choices": [
      "shielding alone is enough to make any radiation safe",
      "shielding is useless if you have no other precautions",
      "shielding combined with limiting time and increasing distance gives the best protection",
      "distance is the only precaution that matters"
    ],
    "answerIndex": 2,
    "distractorRationales": {
      "0": "Shielding alone is incomplete; long exposure can still build up dose.",
      "1": "Shielding is very useful; just not the only thing.",
      "3": "All three precautions matter; distance alone may be impractical."
    },
    "explanation": "Combining shielding with limiting time near the source and keeping a good distance gives the best practical protection. This combined approach is standard radiation safety practice.",
    "examinerNote": "Time, distance, shielding — all three together."
  },
  {
    "id": "thin_foil_vs_thick_steel_mcq",
    "type": "mcq",
    "tags": [
      "uses_beta",
      "uses_gamma",
      "choosing_isotopes_for_uses"
    ],
    "specRefs": [
      "7.14"
    ],
    "difficultyRating": 3,
    "marks": 1,
    "prompt": "Which row correctly matches the radiation to the thickness gauge?",
    "choices": [
      "Beta for thin paper or aluminium foil; gamma for thick steel sheet",
      "Gamma for thin paper or aluminium foil; beta for thick steel sheet",
      "Alpha for thin paper or aluminium foil; gamma for thick steel sheet",
      "The same radiation works for both, since both gauges measure thickness"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Gamma is barely absorbed by thin paper or foil, so the count rate wouldn't depend on the thickness. Beta would also be stopped completely by thick steel, so the gauge would always read background.",
      "2": "Alpha would be stopped completely by even thin paper. The gauge needs partial absorption.",
      "3": "The choice depends on the material's thickness. Thin material needs a less penetrating radiation (beta); thick material needs a more penetrating radiation (gamma)."
    },
    "explanation": "The rule is: choose the radiation that is partially absorbed by the material being measured. For thin paper or aluminium foil, beta is partially absorbed (alpha completely, gamma not at all). For thick steel, gamma is partially absorbed (alpha and beta both completely)."
  },
  {
    "id": "inhaled_lung_tracer_mcq",
    "type": "mcq",
    "tags": [
      "uses_gamma",
      "halflife"
    ],
    "specRefs": [
      "7.14",
      "7.12"
    ],
    "difficultyRating": 3,
    "marks": 1,
    "prompt": "A medical tracer used to image the lungs is sometimes inhaled rather than injected. The patient breathes in a small amount of a radioactive gas while the gamma camera makes an image of how the gas spreads through the lungs. The half-life of an inhaled tracer of this kind is typically:",
    "choices": [
      "a few seconds",
      "a few hours",
      "a few months",
      "many years"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Hours is right for an injected tracer that has to circulate, reach the target tissue, and be imaged. An inhaled tracer reaches the lungs immediately and is imaged on the spot.",
      "2": "Months would mean the patient continues to breathe out radioactive gas long after the scan.",
      "3": "Far too long for a tracer; the patient would be irradiated for life."
    },
    "explanation": "An inhaled tracer reaches the imaging target (the lungs) immediately when the patient breathes in, so a very short half-life is fine and is actually preferred — the radioactivity decays away within minutes of the scan ending. Krypton-81m (half-life about 13 seconds) is a typical example.",
    "examinerNote": "This is genuine 4SS0-level physics: the question is asking the student to apply the half-life-matches-the-application principle to a slightly less standard case. Inhaled tracers can have much shorter half-lives than injected ones because they don't have to circulate before being imaged."
  }
];
