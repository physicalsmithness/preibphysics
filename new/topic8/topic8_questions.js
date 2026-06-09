// ============================================================================
// Topic 8: Astrophysics — Pre-IB question bank
// Edexcel 4SS0 alignment (schema v0.5)
// Author: Topic 8 author chat, draft v1
// Status: COMPLETE — all four chunks: Universe structure, Gravity, Orbits, Stars
// ============================================================================

window.PREIB_TOPIC8_QUESTIONS = [

  // ==========================================================================
  // GROUP: Universe structure
  // Subtags: scale_hierarchy, objects_inventory
  // Spec: 8.2
  // ==========================================================================

  // --- scale_hierarchy ---------------------------------------------------

  {
    "id": "name_galaxy",
    "tags": ["scale_hierarchy", "definition"],
    "specRefs": ["8.2"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "A large collection of billions of stars is called a {}.",
    "blanks": [
      { "expected": ["galaxy"] }
    ],
    "marks": 1,
    "explanation": "A galaxy is a large collection of billions of stars held together by gravity. Our galaxy is the Milky Way.",
    "examinerNote": "The plural 'galaxies' belongs to the universe, not to one collection. One galaxy = one collection of stars."
  },

  {
    "id": "name_universe",
    "tags": ["scale_hierarchy", "definition"],
    "specRefs": ["8.2"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "A large collection of billions of galaxies is called the {}.",
    "blanks": [
      { "expected": ["universe"] }
    ],
    "marks": 1,
    "explanation": "The universe is the largest collection in the hierarchy: it contains billions of galaxies, each containing billions of stars."
  },

  {
    "id": "name_milky_way",
    "tags": ["scale_hierarchy", "definition"],
    "specRefs": ["8.2"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "What is the name of the galaxy that contains our solar system?",
    "choices": ["Andromeda", "Milky Way", "Orion", "Universe"],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "Andromeda is a different galaxy, our nearest large neighbour. Our solar system is not in it.",
      "2": "Orion is a constellation (a pattern of stars in the sky), not a galaxy.",
      "3": "The universe is everything: it contains billions of galaxies, not just ours."
    },
    "marks": 1,
    "explanation": "Our solar system is in the Milky Way galaxy. The Milky Way contains billions of stars, including the Sun."
  },

  {
    "id": "biggest_object",
    "tags": ["scale_hierarchy"],
    "specRefs": ["8.2"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which of these astronomical objects is the largest?",
    "choices": ["a comet", "the Earth", "the Moon", "the Sun"],
    "answerIndex": 3,
    "distractorRationales": {
      "0": "Comets are tiny compared with planets, moons or stars: typically only a few kilometres across.",
      "1": "The Earth is bigger than its Moon, but much smaller than the Sun. The Sun's diameter is about 100 times Earth's.",
      "2": "The Moon is smaller than the Earth, which is itself far smaller than the Sun."
    },
    "marks": 1,
    "explanation": "The Sun is by far the largest of these. Its diameter is about 100 times the Earth's, and the Sun contains over 99% of the mass of the solar system.",
    "instances": [
      {
        "prompt": "Which of these has the largest mass?",
        "choices": ["artificial satellite", "comet", "Earth", "Sun"],
        "answerIndex": 3,
        "distractorRationales": {
          "0": "Artificial satellites are human-made and have masses of at most a few tonnes.",
          "1": "Comet masses are tiny compared with planets, moons or stars.",
          "2": "The Earth has a smaller mass than the Sun. The Sun contains over 99% of the mass of the solar system."
        },
        "explanation": "The Sun has the largest mass of these objects. It contains over 99% of the mass of the solar system."
      }
    ]
  },

  {
    "id": "scale_ordering",
    "tags": ["scale_hierarchy"],
    "specRefs": ["8.2"],
    "difficultyRating": 2,
    "type": "ordering",
    "prompt": "Put these astronomical things in order of size, smallest first.",
    "items": ["Solar system", "Milky Way galaxy", "Universe"],
    "shuffleStart": true,
    "marks": 3,
    "markingMode": "per_position",
    "explanation": "From smallest to largest: solar system → galaxy → universe. The solar system is one star (and what orbits it). A galaxy contains billions of stars. The universe contains billions of galaxies.",
    "examinerNote": "The hierarchy nests: each level contains many of the level below.",
    "instances": [
      {
        "prompt": "Put these astronomical objects in order of size, smallest first.",
        "items": ["Earth", "Sun", "Solar system", "Milky Way galaxy"],
        "marks": 4,
        "explanation": "Earth (a planet) is smaller than the Sun (a star). The Sun is one of billions of stars in the Milky Way, and the solar system (Sun + everything orbiting it) sits inside the Milky Way."
      }
    ]
  },

  {
    "id": "scale_hierarchy_nest",
    "tags": ["scale_hierarchy"],
    "specRefs": ["8.2"],
    "difficultyRating": 2,
    "type": "matching",
    "prompt": "Match each object to its description.",
    "pairs": [
      { "left": "Solar system", "right": "the Sun and all the objects that orbit it" },
      { "left": "Milky Way",    "right": "the galaxy our Sun is part of" },
      { "left": "Galaxy",       "right": "a collection of billions of stars" },
      { "left": "Universe",     "right": "a collection of billions of galaxies" }
    ],
    "shuffleRight": true,
    "marks": 4,
    "explanation": "The hierarchy: the Sun is one star; the solar system is the Sun plus everything orbiting it; that solar system sits inside the Milky Way galaxy; the Milky Way is one of billions of galaxies in the universe."
  },

  // --- objects_inventory -------------------------------------------------

  {
    "id": "object_orbiting_planet",
    "tags": ["objects_inventory", "orbit_properties"],
    "specRefs": ["8.4"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["moon_orbits"],
    "prompt": "Which of these objects orbits a planet?",
    "choices": ["comet", "dwarf star", "galaxy", "moon"],
    "answerIndex": 3,
    "distractorRationales": {
      "0": "Comets orbit a star, not a planet. Their orbits are highly elliptical.",
      "1": "A dwarf star is a type of star. Stars sit at the centre of solar systems and have planets orbiting them, not the other way round.",
      "2": "A galaxy is a huge collection of billions of stars. It is not in orbit around a planet."
    },
    "marks": 1,
    "explanation": "Moons orbit planets. Examples: our Moon orbits Earth; Phobos and Deimos orbit Mars."
  },

  {
    "id": "object_orbiting_star_circular",
    "tags": ["objects_inventory", "orbit_shapes"],
    "specRefs": ["8.4", "8.5"],
    "difficultyRating": 1,
    "type": "short",
    "prompt": "An object has a roughly circular orbit around a star. State the most likely type of object.",
    "marks": 1,
    "markPoints": [
      { "any": ["planet", "a planet", "planets"] }
    ],
    "allowAdjust": false,
    "explanation": "Planets orbit stars in roughly circular orbits. (Comets also orbit stars but their orbits are highly elliptical, not circular.)"
  },

  {
    "id": "object_orbiting_star_elliptical",
    "tags": ["objects_inventory", "orbit_shapes"],
    "specRefs": ["8.4", "8.5"],
    "difficultyRating": 1,
    "type": "short",
    "prompt": "An object has a highly elliptical orbit around a star. State the most likely type of object.",
    "marks": 1,
    "markPoints": [
      { "any": ["comet", "a comet", "comets"] }
    ],
    "allowAdjust": false,
    "explanation": "Comets orbit stars in highly elliptical (stretched) orbits. Their distance from the star changes a lot during one orbit, so their speed changes too.",
    "examinerNote": "Planets also orbit stars, but their orbits are roughly circular, not elliptical."
  },

  {
    "id": "solar_system_definition",
    "tags": ["scale_hierarchy", "objects_inventory", "definition"],
    "specRefs": ["8.2"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "The Sun and all the objects that orbit it make up the {} {}.",
    "blanks": [
      { "expected": ["solar"] },
      { "expected": ["system"] }
    ],
    "marks": 2,
    "explanation": "The solar system is the Sun together with all the objects that orbit it: planets, moons, comets, asteroids and dwarf planets."
  },

  {
    "id": "categorise_orbit_targets",
    "tags": ["objects_inventory", "gravity_causes_orbits"],
    "specRefs": ["8.4"],
    "difficultyRating": 2,
    "type": "categorise",
    "prompt": "Sort each object by what it orbits.",
    "bins": ["Orbits the Sun", "Orbits the Earth", "Orbits another planet"],
    "items": [
      { "text": "the Earth",                "bin": "Orbits the Sun" },
      { "text": "Halley's Comet",           "bin": "Orbits the Sun" },
      { "text": "Jupiter",                  "bin": "Orbits the Sun" },
      { "text": "the Moon",                 "bin": "Orbits the Earth" },
      { "text": "the International Space Station", "bin": "Orbits the Earth" },
      { "text": "Phobos (a moon of Mars)",  "bin": "Orbits another planet" }
    ],
    "marks": 6,
    "explanation": "Planets and comets orbit the Sun. Moons (like our Moon and Phobos) orbit planets. Artificial satellites such as the ISS orbit the Earth.",
    "examinerNote": "The general rule: smaller objects orbit larger objects. Moons (small) orbit planets (bigger); planets (small) orbit stars (much bigger)."
  },

  // ==========================================================================
  // GROUP: Gravity
  // Subtags: g_variation, weight_calc_astro
  // Spec: 8.1 (units), 8.3
  // ==========================================================================

  // --- g_variation -------------------------------------------------------

  {
    "id": "g_depends_on_what",
    "tags": ["g_variation"],
    "specRefs": ["8.3"],
    "difficultyRating": 2,
    "type": "multiselect",
    "prompt": "Tick the things that affect the gravitational field strength at the surface of a planet.",
    "choices": [
      "the mass of the planet",
      "the colour of the planet",
      "the radius of the planet",
      "the temperature of the planet",
      "the rotation speed of the planet"
    ],
    "answerIndices": [0, 2],
    "distractorRationales": {
      "1": "Colour has no effect on gravitational field strength. Gravity depends on mass and distance from the centre, not optical properties.",
      "3": "Temperature does not change a planet's gravitational pull. A hotter Earth would still have g ≈ 10 N/kg at its surface.",
      "4": "Rotation does not change the planet's mass or its size, so it does not change the gravitational field strength."
    },
    "markingMode": "penalty",
    "marks": 2,
    "explanation": "Gravitational field strength at the surface of a planet depends on (1) the mass of the planet (more mass means stronger gravity) and (2) the distance from the centre, which at the surface is the planet's radius (a smaller planet means closer to the centre, which can mean stronger surface gravity if mass is held the same).",
    "examinerNote": "The teacher's notes flag this nuance: density and radius are both linked to 'distance from the centre'. Stick to mass and radius / distance from centre for safe answers."
  },

  {
    "id": "g_higher_means_what",
    "tags": ["g_variation"],
    "specRefs": ["8.3"],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "The gravitational field strength on Jupiter's surface is much larger than on Earth's surface. What is the most likely reason?",
    "choices": [
      "Jupiter has a much greater mass than the Earth.",
      "Jupiter is much further from the Sun than the Earth.",
      "Jupiter is colder than the Earth.",
      "Jupiter has more moons than the Earth."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Distance from the Sun has no effect on Jupiter's own gravitational pull. The gravitational field at Jupiter's surface is set by Jupiter's properties, not the Sun's distance.",
      "2": "Temperature does not change a planet's gravitational field strength.",
      "3": "Moons orbit Jupiter; they don't make Jupiter's own gravity stronger."
    },
    "marks": 1,
    "explanation": "Jupiter is much more massive than the Earth (about 318 times). Higher mass means a stronger gravitational pull at the surface. (The fact that Jupiter is bigger somewhat reduces this, since the surface is further from the centre, but the much larger mass dominates.)",
    "instances": [
      {
        "prompt": "The gravitational field strength on the Moon's surface is much smaller than on the Earth's surface. What is the most likely reason?",
        "choices": [
          "The Moon has a much smaller mass than the Earth.",
          "The Moon is closer to the Sun than the Earth.",
          "The Moon is colder than the Earth.",
          "The Moon has no atmosphere."
        ],
        "answerIndex": 0,
        "distractorRationales": {
          "1": "The Moon is roughly the same distance from the Sun as the Earth, and in any case the Sun's gravity has no effect on the Moon's own surface gravity.",
          "2": "Temperature does not change gravitational field strength.",
          "3": "Atmospheres do not produce gravity. Gravity is what holds an atmosphere in place, not the other way round."
        },
        "explanation": "The Moon is much less massive than the Earth (about 1/80 the mass). Less mass means a weaker gravitational pull at the surface, so g on the Moon is about 1.6 N/kg compared with about 10 N/kg on Earth."
      }
    ]
  },

  {
    "id": "g_mars_smaller_than_earth",
    "tags": ["g_variation"],
    "specRefs": ["8.3"],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "The gravitational field strength on the surface of Mars (3.7 N/kg) is less than the gravitational field strength on the surface of Earth (about 10 N/kg). Which property of Mars could explain this?",
    "choices": [
      "Mars has a smaller mass than Earth.",
      "Mars is further from the Sun than Earth.",
      "Mars has a thinner atmosphere than Earth.",
      "Mars has fewer moons than Earth."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "How far Mars is from the Sun has no effect on the gravitational field at Mars's own surface. Mars's surface gravity is set by Mars's own properties.",
      "2": "Atmospheres do not produce gravity. Gravity is what holds an atmosphere in place, not the other way round.",
      "3": "The number of moons a planet has does not affect the gravitational field at the planet's surface."
    },
    "marks": 1,
    "explanation": "Surface gravitational field strength depends on the mass of the body (and its size, via the distance from the centre). Mars has a smaller mass than Earth (about one tenth), which is the main reason its surface gravity is weaker.",
    "examinerNote": "The teacher's notes warn against arguing from radius alone — it only works if you word it carefully. 'Smaller mass' is the safe answer here."
  },

  {
    "id": "g_with_distance",
    "tags": ["g_variation"],
    "specRefs": ["8.3"],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "What happens to the gravitational field strength as you move further from the centre of a planet?",
    "choices": [
      "It decreases.",
      "It stays the same.",
      "It increases.",
      "It becomes negative."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Gravity is not constant with distance. It is strongest at the surface (or in fact at the surface of a uniform body) and falls off as you move further out.",
      "2": "Gravity gets weaker, not stronger, as you move away from a planet.",
      "3": "Gravity is always an attractive force; its strength is positive, but its size decreases with distance."
    },
    "marks": 1,
    "explanation": "Gravitational field strength decreases as you move further from the centre of a planet. This is why g is smaller on top of a tall mountain than at sea level, and why distant satellites experience much weaker gravity than objects on the ground."
  },

  {
    "id": "comet_force_changes_orbit",
    "tags": ["g_variation", "orbit_shapes", "extended_writing"],
    "specRefs": ["8.3", "8.5"],
    "difficultyRating": 3,
    "type": "ordering",
    "prompt": "A comet has an elliptical orbit around a star. Put these statements in the right order to explain why the gravitational force on the comet is largest when it is closest to the star.",
    "items": [
      "The comet's orbit is elliptical, so its distance from the star changes.",
      "Gravitational field strength gets weaker as distance from the star increases.",
      "When the comet is closest to the star, the distance is smallest.",
      "So the gravitational field strength is largest there.",
      "And the gravitational force on the comet is largest there."
    ],
    "shuffleStart": true,
    "marks": 5,
    "markingMode": "per_position",
    "explanation": "An elliptical orbit means the distance to the star varies. Gravitational field strength weakens with distance, so when the comet is closest the field is strongest, and the force on the comet (force = mass × g) is largest there too.",
    "examinerNote": "Past papers (4SS0 Nov 2021 Q8c) ask exactly this idea. The chain of reasoning matters: name the changing distance first, then link distance to g, then link g to force."
  },

  // --- weight_calc_astro -------------------------------------------------

  {
    "id": "g_unit",
    "tags": ["g_variation", "weight_calc_astro"],
    "specRefs": ["8.1", "8.3"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "What is the unit of gravitational field strength?",
    "choices": ["N", "N/kg", "kg/N", "m/s"],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "The newton (N) is the unit of force, not field strength. Gravitational field strength is force per unit mass.",
      "2": "kg/N is the upside-down version. Gravitational field strength is newtons per kilogram.",
      "3": "m/s is the unit of speed. Gravitational field strength is a force-per-mass quantity, so its unit is N/kg."
    },
    "marks": 1,
    "explanation": "Gravitational field strength g is force per unit mass: g = W / m. So its unit is newtons per kilogram, written N/kg. The value of g on Earth is about 10 N/kg.",
    "examinerNote": "An equivalent unit is m/s², because g is also the acceleration of free fall. For 4SS0 questions, N/kg is the canonical unit."
  },

  {
    "id": "weight_formula_recall",
    "tags": ["weight_calc_astro", "definition"],
    "specRefs": ["8.3"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "The formula linking weight, mass and gravitational field strength is: weight = {} × {}.",
    "blanks": [
      { "expected": ["mass", "m"] },
      { "expected": ["gravitational field strength", "g"] }
    ],
    "marks": 1,
    "explanation": "W = m × g. Weight (in newtons) equals mass (in kilograms) multiplied by gravitational field strength (in newtons per kilogram).",
    "examinerNote": "Either the words or the symbols are accepted. 'Weight = mass × g' is fine."
  },

  {
    "id": "weight_on_mars",
    "tags": ["weight_calc_astro", "calc"],
    "specRefs": ["8.3"],
    "difficultyRating": 2,
    "type": "numeric",
    "prompt": "A landing vehicle has a mass of 570 kg. The gravitational field strength on the surface of Mars is 3.7 N/kg. Calculate its weight on the surface of Mars.",
    "answer": 2109,
    "unitHint": "N",
    "marks": 3,
    "explanation": "Use W = m × g. W = 570 × 3.7 = 2109 N (≈ 2.1 kN).",
    "examinerNote": "Show the formula, substitute, and give the unit. Forgetting the unit costs a mark."
  },

  {
    "id": "mass_from_weight_mars",
    "tags": ["weight_calc_astro", "calc"],
    "specRefs": ["8.3"],
    "difficultyRating": 2,
    "type": "numeric",
    "prompt": "A landing vehicle has a weight of 2100 N on the surface of Mars. The gravitational field strength on the surface of Mars is 3.7 N/kg. Calculate the mass of the landing vehicle.",
    "answer": 567.5675675675676,
    "unitHint": "kg",
    "marks": 3,
    "explanation": "Rearrange W = m × g to get m = W / g. m = 2100 / 3.7 = 568 kg (3 s.f.). The mass does not change between bodies; only the weight changes.",
    "examinerNote": "This is the W ÷ g pattern. The answer to 3 s.f. is 568 kg; 2 s.f. gives 570 kg. Either is accepted by the marker."
  },

  {
    "id": "g_from_weight_mass",
    "tags": ["weight_calc_astro", "calc"],
    "specRefs": ["8.1", "8.3"],
    "difficultyRating": 3,
    "type": "numeric",
    "prompt": "A comet has a weight of 4.4 × 10⁹ N when at point A in its orbit. The comet has a mass of 2.2 × 10¹⁴ kg. Calculate the gravitational field strength at point A. Give your answer in N/kg.",
    "answer": 0.00002,
    "unitHint": "N/kg",
    "marks": 3,
    "explanation": "Rearrange W = mg to give g = W / m. Then g = (4.4 × 10⁹) / (2.2 × 10¹⁴) = 2 × 10⁻⁵ N/kg. The very small value reflects the very weak gravity far from the star.",
    "examinerNote": "Direct port of 4SS0 Nov 2021 Q8b. Watch the standard form arithmetic: 4.4 / 2.2 = 2, and 10⁹ / 10¹⁴ = 10⁻⁵."
  },

  {
    "id": "weight_on_different_bodies",
    "tags": ["weight_calc_astro", "calc"],
    "specRefs": ["8.3"],
    "difficultyRating": 2,
    "type": "numeric",
    "prompt": "An astronaut has a mass of 75 kg. On the Moon, gravitational field strength is 1.6 N/kg. Calculate the astronaut's weight on the Moon.",
    "answer": 120,
    "unitHint": "N",
    "marks": 3,
    "explanation": "W = m × g = 75 × 1.6 = 120 N. (On Earth, the same astronaut weighs 75 × 10 = 750 N, about six times more.)",
    "instances": [
      {
        "prompt": "An astronaut has a mass of 75 kg. On Jupiter, gravitational field strength is 25 N/kg. Calculate the astronaut's weight on Jupiter.",
        "answer": 1875,
        "unitHint": "N",
        "explanation": "W = m × g = 75 × 25 = 1875 N. The astronaut would weigh roughly 2.5 times more on Jupiter than on Earth, even though their mass is unchanged."
      },
      {
        "prompt": "A rover has a mass of 240 kg. On Mercury, gravitational field strength is 3.7 N/kg. Calculate the rover's weight on Mercury.",
        "answer": 888,
        "unitHint": "N",
        "explanation": "W = m × g = 240 × 3.7 = 888 N."
      }
    ]
  },

  {
    "id": "mass_unchanged_between_bodies",
    "tags": ["weight_calc_astro", "g_variation"],
    "specRefs": ["8.3"],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "An astronaut travels from Earth to the Moon. Which of these statements is correct?",
    "choices": [
      "Their mass stays the same; their weight decreases.",
      "Their mass decreases; their weight stays the same.",
      "Both their mass and their weight decrease.",
      "Both their mass and their weight stay the same."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Mass does not change with location. It is a measure of how much matter is in the astronaut.",
      "2": "Mass does not change with location. Only the weight changes, because g changes.",
      "3": "Weight does change. The Moon's surface gravity is about 1/6 of Earth's, so the astronaut weighs about 1/6 as much on the Moon."
    },
    "marks": 1,
    "explanation": "Mass measures the amount of matter and stays the same wherever you are. Weight is the gravitational force on you, which depends on the local g. Since g on the Moon is much smaller than on Earth, the astronaut's weight is smaller on the Moon, but their mass is unchanged."
  },

  // ==========================================================================
  // GROUP: Orbits
  // Subtags: gravity_causes_orbits, force_direction, orbit_shapes,
  //          orbit_speeds, orbit_periods
  // Spec: 8.4, 8.5
  // ==========================================================================

  // --- gravity_causes_orbits ---------------------------------------------

  {
    "id": "force_that_causes_orbit",
    "tags": ["gravity_causes_orbits", "definition"],
    "specRefs": ["8.4"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "The force that causes a planet to orbit the Sun is the {} force.",
    "blanks": [
      { "expected": ["gravitational", "gravity"] }
    ],
    "marks": 1,
    "explanation": "Gravitational force (gravity) keeps planets, moons, comets and satellites in their orbits. It pulls the orbiting object towards the body it orbits.",
    "examinerNote": "Either 'gravitational' or 'gravity' is fine. Don't write 'magnetic' or 'electric'."
  },

  {
    "id": "what_causes_satellite_orbit",
    "tags": ["gravity_causes_orbits"],
    "specRefs": ["8.4"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "What force keeps an artificial satellite in orbit around the Earth?",
    "choices": [
      "gravitational force",
      "magnetic force",
      "electric force",
      "friction"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Magnetic forces act between magnets or magnetic materials. Most satellites are not magnetic, and the satellite's orbit is set by gravity.",
      "2": "Electric forces act between charged objects. Satellites are usually electrically neutral overall.",
      "3": "There is no friction in space (no air), so friction does not act on a satellite in orbit."
    },
    "marks": 1,
    "explanation": "Gravity is the only force acting on a satellite in orbit. The Earth's gravity pulls the satellite towards the Earth, curving its path into an orbit instead of a straight line."
  },

  {
    "id": "categorise_what_orbits_what",
    "tags": ["gravity_causes_orbits", "objects_inventory"],
    "specRefs": ["8.4"],
    "difficultyRating": 2,
    "type": "categorise",
    "prompt": "Sort each pair into the orbit type. (Each pair is 'orbiting object → body it orbits'.)",
    "bins": [
      "Gravity of the Sun causes the orbit",
      "Gravity of a planet causes the orbit"
    ],
    "items": [
      { "text": "the Earth → the Sun",                 "bin": "Gravity of the Sun causes the orbit" },
      { "text": "Halley's Comet → the Sun",            "bin": "Gravity of the Sun causes the orbit" },
      { "text": "Mars → the Sun",                       "bin": "Gravity of the Sun causes the orbit" },
      { "text": "the Moon → the Earth",                 "bin": "Gravity of a planet causes the orbit" },
      { "text": "the ISS → the Earth",                  "bin": "Gravity of a planet causes the orbit" },
      { "text": "Phobos (a moon of Mars) → Mars",       "bin": "Gravity of a planet causes the orbit" }
    ],
    "marks": 6,
    "explanation": "Gravity of the Sun causes planets and comets to orbit it. Gravity of a planet (like Earth or Mars) causes its moons and any artificial satellites to orbit it. The general rule: gravity of the larger body causes the orbit of the smaller body."
  },

  // --- force_direction ----------------------------------------------------

  {
    "id": "force_on_satellite_direction",
    "tags": ["force_direction"],
    "specRefs": ["8.4"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "The diagram shows an artificial satellite in orbit around the Earth. In which direction does the gravitational force on the satellite act?",
    "diagram": {
      "kind": "orbit_diagram",
      "params": {
        "central": { "label": "Earth" },
        "orbits": [
          { "shape": "circular", "object": { "label": "satellite" } }
        ]
      }
    },
    "choices": [
      "from the satellite towards the centre of the Earth",
      "from the centre of the Earth towards the satellite",
      "in the direction the satellite is moving",
      "opposite to the direction the satellite is moving"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The force we are asked about acts ON the satellite, so it must point from the satellite. A force from the Earth towards the satellite would be a force on the Earth.",
      "2": "Gravity does not act along the direction of motion. It acts towards the object that is being orbited.",
      "3": "Gravity is not a drag force. It points from the satellite to the centre of the Earth, not opposite to the motion."
    },
    "marks": 1,
    "explanation": "Gravity on the satellite always acts towards the object doing the pulling. For a satellite orbiting the Earth, the gravitational force points from the satellite towards the centre of the Earth.",
    "examinerNote": "Past papers (4PH1 Jun 2021 Q1b; 4SS0 Nov 2021 Q8a; 4SS0 Jun 2024 Q2a(ii)) show a diagram and ask you to draw this arrow. The correct arrow has its tail at the orbiting object and points towards the centre of the body it orbits."
  },

  {
    "id": "force_on_viking_around_mars",
    "tags": ["force_direction"],
    "specRefs": ["8.4"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "The diagram shows a spacecraft (Viking 2) in orbit around Mars. In which direction does the gravitational force that causes Viking 2 to orbit Mars act?",
    "diagram": {
      "kind": "orbit_diagram",
      "params": {
        "central": { "label": "Mars" },
        "orbits": [
          { "shape": "circular", "object": { "label": "Viking 2" } }
        ]
      }
    },
    "choices": [
      "from Viking 2 towards the centre of Mars",
      "from the centre of Mars towards Viking 2",
      "tangent to the orbit, in the direction Viking 2 is moving",
      "outwards, away from Mars"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The force on Viking 2 must act ON Viking 2, so it points from Viking 2 (not towards it).",
      "2": "Gravity is not a tangential force. It acts towards the body being orbited, not along the direction of motion.",
      "3": "Gravity always pulls things together. A force away from Mars would not keep Viking 2 in orbit; it would push it away."
    },
    "marks": 1,
    "explanation": "Mars's gravity pulls Viking 2 towards Mars. The arrow goes from Viking 2 to the centre of Mars.",
    "examinerNote": "Direct port of 4SS0 Jun 2024 Q2a(ii)."
  },

  {
    "id": "force_on_planet_direction",
    "tags": ["force_direction"],
    "specRefs": ["8.4"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "A planet orbits the Sun. The gravitational force on the planet points from the planet towards the {}.",
    "blanks": [
      { "expected": ["sun", "centre of the sun"] }
    ],
    "marks": 1,
    "explanation": "The gravitational force on the planet always points from the planet towards the Sun. This is what keeps the planet curving in its orbit instead of flying off in a straight line."
  },

  {
    "id": "force_on_comet_arrow_direction",
    "tags": ["force_direction", "orbit_shapes"],
    "specRefs": ["8.4", "8.5"],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "The diagram shows a comet at point A on its elliptical orbit around a star. In which direction does the gravitational force on the comet at point A act?",
    "diagram": {
      "kind": "orbit_diagram",
      "params": {
        "central": { "label": "star" },
        "orbits": [
          { "shape": "elliptical", "object": { "label": "comet", "atPoint": "A" }, "points": ["A", "B"] }
        ]
      }
    },
    "choices": [
      "from the comet towards the centre of the star",
      "from the centre of the star towards the comet",
      "along the comet's orbital path",
      "outwards, away from the star"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The force on the comet acts ON the comet, so the arrow's tail is at the comet (not at the star).",
      "2": "The force is a straight line, not curved. The orbit is curved because the force keeps changing direction (always pointing towards the star), but at any one moment the force is straight.",
      "3": "Gravity is always attractive. A force away from the star would push the comet out of orbit, not keep it in orbit."
    },
    "marks": 1,
    "explanation": "The gravitational force on the comet is a single straight arrow with its tail at the comet, pointing towards the star. This is true at every point on the elliptical orbit, including A.",
    "examinerNote": "Port of 4SS0 Nov 2021 Q8a. Common errors flagged in the examiners' reports: arrows from star to comet (wrong direction), arrows tangent to the orbit, double-headed arrows, curved arrows. All zero marks."
  },

  {
    "id": "force_on_comet_at_A_vs_B",
    "tags": ["force_direction", "g_variation", "orbit_shapes"],
    "specRefs": ["8.3", "8.4", "8.5"],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "The diagram shows a comet's elliptical orbit around a star. Point A is the point on the orbit closest to the star; point B is the point furthest from the star. At which point is the gravitational force on the comet largest?",
    "diagram": {
      "kind": "orbit_diagram",
      "params": {
        "central": { "label": "star" },
        "orbits": [
          { "shape": "elliptical", "object": { "label": "comet", "atPoint": "A" }, "points": ["A", "B"] }
        ]
      }
    },
    "choices": [
      "at A, because A is closest to the star",
      "at B, because B is furthest from the star",
      "the same at A and B",
      "halfway between A and B"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Gravity gets weaker, not stronger, with distance. So it is weakest at B, not strongest.",
      "2": "Distance from the star changes a lot during an elliptical orbit, so the force cannot be the same at the closest and furthest points.",
      "3": "The force is not specially located halfway between A and B. The gravitational force depends on distance, and the distance is smallest at A (so force is largest at A)."
    },
    "marks": 1,
    "explanation": "Gravitational field strength gets weaker as distance from the star increases. At point A the comet is closest to the star, so the gravitational field is strongest there. The force on the comet (force = mass × g) is therefore largest at A.",
    "examinerNote": "Port of 4SS0 Nov 2021 Q8c, reframed as MCQ. The full chain of reasoning is captured by the existing `comet_force_changes_orbit` ordering question; this MCQ tests the headline conclusion."
  },

  // --- orbit_shapes -------------------------------------------------------

  {
    "id": "shape_of_planet_orbit",
    "tags": ["orbit_shapes", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["planet_shape"],
    "prompt": "Which of these best describes the shape of a planet's orbit around the Sun?",
    "choices": [
      "highly elliptical",
      "approximately circular",
      "a perfect square",
      "a straight line"
    ],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "Highly elliptical orbits belong to comets. Planets' orbits are nearly circular, only slightly elliptical.",
      "2": "Orbits are smooth curves; they cannot have corners.",
      "3": "Straight-line motion would mean no force is acting. A planet's orbit is curved because gravity continually pulls it towards the Sun."
    },
    "marks": 1,
    "explanation": "Planets orbit the Sun in approximately circular orbits. (Strictly speaking, all planet orbits are slightly elliptical, but only a little; for this course they count as roughly circular.)",
    "examinerNote": "Past papers (4SS0 Jun 2022 Q3a) accept 'roughly / approximately circular' as the canonical similarity between planet and moon orbits."
  },

  {
    "id": "shape_of_comet_orbit",
    "tags": ["orbit_shapes"],
    "specRefs": ["8.5"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "A comet's orbit around a star is highly {}.",
    "blanks": [
      { "expected": ["elliptical"] }
    ],
    "marks": 1,
    "explanation": "Comets have highly elliptical (very stretched, oval-shaped) orbits. The star sits at one of the two foci of the ellipse, not the centre.",
    "examinerNote": "'Stretched circle' or 'oval' would not be accepted. The expected vocabulary is 'elliptical'."
  },

  {
    "id": "where_star_sits_comet_orbit",
    "tags": ["orbit_shapes", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "mcq",
    "atoms": ["comet_shape"],
    "prompt": "A comet has a highly elliptical orbit around a star. Where is the star located in the orbit?",
    "choices": [
      "at the centre of the ellipse",
      "at one end of the ellipse, at one focus",
      "outside the ellipse",
      "moving with the comet"
    ],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "The star is at one focus, not at the centre. An ellipse has two foci, and the centre of the ellipse is between them.",
      "2": "The star must be inside the orbit; it cannot be outside the path the comet traces.",
      "3": "The star stays still (relative to the comet's orbit). The comet orbits the star, not the other way round."
    },
    "marks": 1,
    "explanation": "For a comet in an elliptical orbit, the star sits at one of the two foci of the ellipse. This is why the comet is much closer to the star at one end of its orbit than at the other.",
    "examinerNote": "Foci is the plural; one focus is the singular. Either word is fine here, but 'centre' is wrong for an elliptical orbit."
  },

  {
    "id": "matching_object_to_orbit_shape",
    "tags": ["orbit_shapes", "objects_inventory"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "categorise",
    "prompt": "Sort each orbiting object by the shape of its orbit.",
    "bins": ["Approximately circular orbit", "Highly elliptical orbit"],
    "items": [
      { "text": "a planet around the Sun",          "bin": "Approximately circular orbit" },
      { "text": "a moon around a planet",           "bin": "Approximately circular orbit" },
      { "text": "an artificial satellite around the Earth", "bin": "Approximately circular orbit" },
      { "text": "a comet around the Sun",           "bin": "Highly elliptical orbit" }
    ],
    "marks": 4,
    "explanation": "Planets, moons and most artificial satellites all have approximately circular orbits around the body they go round. Only comets have highly elliptical orbits.",
    "examinerNote": "If you wrongly believed every orbit was circular, you would score 3 out of 4 (the comet would be wrong); if you wrongly believed every orbit was elliptical, you would score 1 out of 4. So the question genuinely separates 'I know which ones are different' from 'I'm guessing'."
  },

  // --- orbit_speeds -------------------------------------------------------

  {
    "id": "comet_speed_changes",
    "tags": ["orbit_speeds", "orbit_shapes", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "atoms": ["comet_speed"],
    "type": "mcq",
    "prompt": "Which statement best describes the speed of a comet during its orbit around a star?",
    "choices": [
      "It moves fastest when closest to the star and slowest when furthest.",
      "It moves at constant speed throughout its orbit.",
      "It moves slowest when closest to the star and fastest when furthest.",
      "It speeds up only when leaving the solar system."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "A comet's speed is NOT constant. The orbit is highly elliptical, so the distance to the star varies, and so does the speed.",
      "2": "Backwards. The comet is fastest when closest, not slowest.",
      "3": "The speed varies throughout the orbit, not just on the way out. The comet is fastest near the star, on its closest approach."
    },
    "marks": 1,
    "explanation": "A comet's speed is not constant. It is fastest when closest to the star (when the gravitational pull is strongest) and slowest when furthest from the star.",
    "examinerNote": "This is a key difference from planets, whose speed stays roughly constant throughout their (nearly circular) orbit."
  },

  {
    "id": "planet_speed_constant",
    "tags": ["orbit_speeds", "orbit_shapes", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["planet_speed"],
    "prompt": "A planet has a roughly circular orbit around the Sun. What can you say about its orbital speed?",
    "choices": [
      "It is roughly constant throughout the orbit.",
      "It increases steadily during the orbit.",
      "It changes greatly through the orbit.",
      "It is zero at the closest point to the Sun."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Speed does not just keep increasing; the planet is in a stable orbit and returns to the same conditions each time round.",
      "2": "The orbit is roughly circular, so the distance to the Sun is roughly constant. With distance roughly constant, speed is roughly constant.",
      "3": "The planet does not stop. It moves continuously around the Sun."
    },
    "marks": 1,
    "explanation": "Because a planet's orbit is roughly circular, the distance from the Sun stays roughly constant. The orbital speed therefore stays roughly constant too, in contrast to a comet's elliptical orbit, where speed varies a lot."
  },

  {
    "id": "closer_planet_faster",
    "tags": ["orbit_speeds"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Mercury orbits the Sun much faster than Neptune. Which difference between Mercury and Neptune could explain this?",
    "choices": [
      "Mercury is closer to the Sun than Neptune.",
      "Mercury has a larger mass than Neptune.",
      "Mercury has a hotter surface than Neptune.",
      "Mercury is older than Neptune."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The mass of the planet itself does not control its orbital speed. (Mercury actually has a much smaller mass than Neptune.)",
      "2": "The surface temperature of a planet has no effect on how fast it orbits the Sun.",
      "3": "Age does not change orbital speed. The orbits of planets in the solar system have been very similar throughout their lifetimes."
    },
    "marks": 1,
    "explanation": "Planets that are closer to the Sun have higher orbital speeds. Mercury is the closest planet to the Sun and Neptune is the furthest, so Mercury orbits much faster."
  },

  {
    "id": "rank_planets_by_speed",
    "tags": ["orbit_speeds"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "ordering",
    "prompt": "Put these planets in order of orbital speed around the Sun, fastest first.",
    "items": ["Mercury", "Earth", "Jupiter", "Neptune"],
    "shuffleStart": true,
    "marks": 4,
    "markingMode": "per_position",
    "explanation": "Planets closer to the Sun have higher orbital speeds. Mercury (closest) is fastest; Neptune (furthest) is slowest. So the order is Mercury, Earth, Jupiter, Neptune.",
    "examinerNote": "You don't need to remember exact speeds. Just remember: closer = faster."
  },

  {
    "id": "earth_largest_orbital_speed",
    "tags": ["orbit_speeds"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "The bar chart shows the mean orbital speeds of six planets. Earth has the largest orbital speed of these six. Which property of Earth could explain this?",
    "diagram": {
      "kind": "bar_chart",
      "params": {
        "title": "Mean orbital speed",
        "xAxis": "Planet",
        "yAxis": "Mean orbital speed / km per s",
        "bars": [
          { "label": "Earth",   "value": 30 },
          { "label": "Mars",    "value": 24 },
          { "label": "Jupiter", "value": 13 },
          { "label": "Saturn",  "value": 9.7 },
          { "label": "Uranus",  "value": 6.8 },
          { "label": "Neptune", "value": 5.4 }
        ]
      }
    },
    "choices": [
      "Earth has the smallest orbital radius of these planets.",
      "Earth has the largest mass of these planets.",
      "Earth has the most moons of these planets.",
      "Earth has the fastest rotation of these planets."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The orbiting planet's mass does not control its orbital speed. (Earth is in fact much less massive than Jupiter, but orbits faster.)",
      "2": "The number of moons a planet has doesn't change its orbital speed around the Sun.",
      "3": "How fast a planet spins on its axis (rotation) is unrelated to how fast it orbits the Sun."
    },
    "marks": 1,
    "explanation": "Planets that are closer to the Sun have higher orbital speeds, i.e. a smaller orbital radius means a higher orbital speed. Of the six listed, Earth has the smallest orbital radius, so it orbits fastest.",
    "examinerNote": "Port of 4SS0 Jun 2022 Q3b(iii). The original was an open question; here the comparison is built into the choices ('smallest of these planets')."
  },

  {
    "id": "why_bar_chart_for_planets",
    "tags": ["orbit_speeds", "practical_skill"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Orbital speed is shown using a bar chart (rather than a line graph) when plotted against the planets in the solar system. Why is a bar chart the right choice here?",
    "choices": [
      "The planets are separate, named categories (not a continuous variable).",
      "Bar charts are easier to read than line graphs.",
      "Orbital speeds change too fast to plot as a line graph.",
      "Bar charts can show negative values, but line graphs cannot."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "This is a matter of taste, not the reason for picking one. The real reason is the type of variable on the x-axis.",
      "2": "Orbital speeds are essentially constant for each planet (they don't change over the timescale of an exam question).",
      "3": "Both chart types can show negative values. The decision is about whether the x-variable is categorical or continuous."
    },
    "marks": 1,
    "explanation": "A bar chart is appropriate when the x-axis is a categorical (named) variable like 'planet'. Because there is no smooth value 'between' Earth and Mars, a line graph would be misleading: lines suggest you can interpolate between the points, which makes no sense for separate planets. Bar charts are right for separate categories; line graphs are right for continuous variables like time or temperature.",
    "examinerNote": "Port of 4SS0 Jun 2022 Q3b(i). Examiner reports note that 'because the data isn't continuous' or 'the variable is categorical' both score the mark."
  },

  {
    "id": "ratio_jupiter_to_uranus_speed",
    "tags": ["orbit_speeds", "calc", "practical_skill"],
    "specRefs": ["8.5"],
    "difficultyRating": 3,
    "type": "numeric",
    "prompt": "The bar chart shows the mean orbital speeds of six planets. Use the bar chart to determine the ratio of the orbital speed of Jupiter to the orbital speed of Uranus. Give your answer to 2 significant figures.",
    "diagram": {
      "kind": "bar_chart",
      "params": {
        "title": "Mean orbital speed",
        "xAxis": "Planet",
        "yAxis": "Mean orbital speed / km per s",
        "bars": [
          { "label": "Earth",   "value": 30 },
          { "label": "Mars",    "value": 24 },
          { "label": "Jupiter", "value": 13 },
          { "label": "Saturn",  "value": 9.7 },
          { "label": "Uranus",  "value": 6.8 },
          { "label": "Neptune", "value": 5.4 }
        ]
      }
    },
    "answer": 1.9117647058823528,
    "unitHint": null,
    "marks": 3,
    "explanation": "Read off Jupiter (13 km/s) and Uranus (6.8 km/s). Ratio = 13 / 6.8 = 1.91 (to 2 s.f.) or about 1.9. (1 s.f. would round to 2.)",
    "examinerNote": "Port of 4SS0 Jun 2022 Q3b(ii). Acceptable answers: 1.9 (2 s.f.) or 1.91, or any value within mark-scheme tolerance. The engine's sigfig matcher accepts both. Don't write '1.9 : 1' or '13 : 6.8' — the question asks for a single numerical ratio."
  },

  // --- orbit_periods ------------------------------------------------------

  {
    "id": "earth_rotation_period",
    "tags": ["orbit_periods"],
    "specRefs": ["8.5"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "The Earth takes one {} to spin once on its axis.",
    "blanks": [
      { "expected": ["day"] }
    ],
    "marks": 1,
    "explanation": "The Earth rotates on its axis once every 24 hours, which is one day. (This is rotation, not the Earth's orbit around the Sun.)",
    "examinerNote": "This is the Earth's rotation period, not its orbital period. The Earth's orbital period (one full trip round the Sun) is one year."
  },

  {
    "id": "earth_orbit_period",
    "tags": ["orbit_periods"],
    "specRefs": ["8.5"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "The Earth takes one {} to make one orbit of the Sun.",
    "blanks": [
      { "expected": ["year"] }
    ],
    "marks": 1,
    "explanation": "One full trip around the Sun takes the Earth one year (about 365 days). This is what defines the length of the year."
  },

  {
    "id": "moon_orbit_period",
    "tags": ["orbit_periods", "orbit_properties"],
    "specRefs": ["8.5"],
    "atoms": ["moon_period"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Approximately how long does the Moon take to make one full orbit around the Earth?",
    "choices": [
      "one day",
      "one month",
      "one year",
      "ten years"
    ],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "One day is the time the Earth takes to spin on its axis, not the time the Moon takes to orbit.",
      "2": "One year is the time the Earth takes to orbit the Sun.",
      "3": "Ten years is much too long; the Moon orbits the Earth every month or so."
    },
    "marks": 1,
    "explanation": "The Moon takes about one month (about 28 days) to orbit the Earth once. This is what gives us the lunar month.",
    "examinerNote": "Per the teacher's notes, this is one of three orbital-period facts you should know: Earth's day (rotation), Moon's month (Moon's orbit of Earth), Earth's year (Earth's orbit of the Sun)."
  },

  {
    "id": "moon_orbit_on_solar_system_diagram",
    "tags": ["orbit_periods", "objects_inventory", "gravity_causes_orbits", "orbit_properties"],
    "specRefs": ["8.4", "8.5"],
    "difficultyRating": 2,
    "atoms": ["moon_orbits"],
    "type": "mcq",
    "prompt": "The diagram shows the Earth in its orbit around the Sun. Which is the correct way to add the Moon's orbit to this diagram?",
    "diagram": {
      "kind": "orbit_diagram",
      "params": {
        "central": { "label": "Sun" },
        "orbits": [
          { "shape": "circular", "object": { "label": "Earth" } }
        ]
      }
    },
    "choices": [
      "A small circle around the Earth.",
      "A small circle around the Sun, between the Sun and the Earth.",
      "A large circle around the Sun, just outside the Earth's orbit.",
      "A straight line from the Earth to the Sun."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The Moon does not orbit the Sun directly. It orbits the Earth, so its orbit must be drawn around the Earth, not around the Sun.",
      "2": "Same problem: this is an orbit around the Sun. The Moon orbits the Earth, not the Sun.",
      "3": "The Moon's orbit is a closed curve, not a straight line. It is also not stuck between the Earth and the Sun."
    },
    "marks": 2,
    "explanation": "The Moon orbits the Earth, not the Sun directly. So the Moon's orbit is drawn as a small circle around the Earth (the Earth itself is meanwhile orbiting the Sun, so the Moon also moves around the Sun, but its primary orbit is around the Earth).",
    "examinerNote": "Port of 4SS0 Jun 2025 Q2c. The 4SS0 mark scheme awards: 1 mark for the orbit being a closed curve around the Earth (not the Sun), 1 mark for the orbit being roughly circular and at a sensible scale. As an MCQ, both marks are awarded together."
  },

  {
    "id": "moons_have_shorter_period_than_planets",
    "tags": ["orbit_periods", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "mcq",
    "atoms": ["moon_period", "planet_period"],
    "prompt": "Compared with the time a planet takes to orbit the Sun, how long does a moon typically take to orbit its planet?",
    "choices": [
      "much shorter",
      "exactly the same",
      "much longer",
      "moons do not have orbital periods"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "There's no reason these would be the same. Moons orbit on much smaller scales than planets do.",
      "2": "The orbits of moons are smaller than the orbits of planets, so their periods are shorter, not longer.",
      "3": "Moons do orbit, so they do have orbital periods. Our Moon's is about a month."
    },
    "marks": 1,
    "explanation": "Moons orbit on much smaller scales than planets do (smaller orbital radius), so their orbital periods are typically much shorter. The Earth orbits the Sun in one year; the Moon orbits the Earth in about a month, which is much shorter."
  },

  {
    "id": "match_period_to_motion",
    "tags": ["orbit_periods"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "matching",
    "prompt": "Match each motion with its approximate period.",
    "pairs": [
      { "left": "the Earth spinning on its axis",     "right": "1 day" },
      { "left": "the Moon orbiting the Earth",        "right": "1 month" },
      { "left": "the Earth orbiting the Sun",         "right": "1 year" }
    ],
    "rightExtras": ["1 second", "1000 years"],
    "shuffleRight": true,
    "marks": 3,
    "explanation": "Earth's rotation: about 24 hours, i.e. 1 day. Moon's orbit of Earth: about 28 days, i.e. 1 month. Earth's orbit of the Sun: about 365 days, i.e. 1 year.",
    "examinerNote": "The teacher's notes flag these three as known examiner targets even though they aren't in the spec point bullets."
  },

  // --- comparison questions (span multiple subtags) ----------------------

  {
    "id": "grid_compare_orbits",
    "tags": ["orbit_shapes", "orbit_speeds", "orbit_periods", "objects_inventory", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 3,
    "type": "grid",
    "atoms": ["comet_shape", "comet_speed", "comet_orbits", "planet_shape", "planet_speed", "planet_orbits", "moon_shape", "moon_speed", "moon_orbits"],
    "atomMap": {
      "comet_shape":   [[0, 0], [1, 0]],
      "comet_speed":   [[2, 0], [3, 0]],
      "comet_orbits":  [[4, 0], [5, 0]],
      "planet_shape":  [[0, 1], [1, 1]],
      "planet_speed":  [[2, 1], [3, 1]],
      "planet_orbits": [[4, 1], [5, 1]],
      "moon_shape":    [[0, 2], [1, 2]],
      "moon_speed":    [[2, 2], [3, 2]],
      "moon_orbits":   [[4, 2], [5, 2]]
    },
    "prompt": "For each property, tick which orbiting object(s) it correctly describes.",
    "rows": [
      "Has a roughly circular orbit",
      "Has a highly elliptical orbit",
      "Orbital speed stays roughly constant",
      "Orbital speed changes a lot during the orbit",
      "Orbits a planet, not a star",
      "Orbits the Sun"
    ],
    "columns": ["Comet", "Planet", "Moon"],
    "correct": {
      "0": [1, 2],
      "1": [0],
      "2": [1, 2],
      "3": [0],
      "4": [2],
      "5": [0, 1]
    },
    "marks": 6,
    "markingMode": "per_row",
    "explanation": "Planets and moons have roughly circular orbits with roughly constant speed. Only comets have highly elliptical orbits with speed that varies through the orbit. Comets and planets both orbit the Sun; moons orbit planets.",
    "examinerNote": "This is the canonical 'comet vs planet vs moon' comparison from the teacher's notes. Knowing this matrix unlocks most past-paper questions on orbits."
  },

  {
    "id": "multiselect_comet_features",
    "tags": ["orbit_shapes", "orbit_speeds"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "multiselect",
    "prompt": "Tick all the statements that correctly describe a comet's orbit around a star.",
    "choices": [
      "It is highly elliptical.",
      "It is approximately circular.",
      "The comet's speed varies a lot during the orbit.",
      "The comet's speed is approximately constant.",
      "The comet is fastest when closest to the star.",
      "The star is at the centre of the orbit."
    ],
    "answerIndices": [0, 2, 4],
    "distractorRationales": {
      "1": "Comet orbits are highly elliptical, not circular. (Planet orbits are roughly circular.)",
      "3": "Comet speed varies because the orbit is elliptical and the comet's distance from the star changes.",
      "5": "The star is at one focus of the elliptical orbit, not at the centre."
    },
    "markingMode": "penalty",
    "marks": 3,
    "explanation": "A comet's orbit is highly elliptical with the star at one focus. The comet's distance from the star changes a lot, so its speed changes too: fastest when closest, slowest when furthest."
  },

  {
    "id": "matching_object_to_what_it_orbits",
    "tags": ["objects_inventory", "gravity_causes_orbits"],
    "specRefs": ["8.4"],
    "difficultyRating": 1,
    "type": "categorise",
    "prompt": "Sort each object by what it orbits.",
    "bins": ["Orbits a star", "Orbits a planet", "Orbits something else"],
    "items": [
      { "text": "a planet",                    "bin": "Orbits a star" },
      { "text": "a comet",                     "bin": "Orbits a star" },
      { "text": "a moon",                      "bin": "Orbits a planet" },
      { "text": "an artificial satellite",     "bin": "Orbits a planet" },
      { "text": "a star (in our galaxy)",      "bin": "Orbits something else" }
    ],
    "marks": 5,
    "explanation": "Planets and comets orbit a star (in our solar system, that's the Sun). Moons and artificial satellites orbit a planet (our Moon and the ISS both orbit the Earth). A star itself orbits the centre of its galaxy, so it doesn't belong in either of the other bins.",
    "examinerNote": "The 'orbits something else' bin is there to break the temptation of putting everything in 'orbits a star'. If you really thought everything orbited a star, you'd score zero, which is fair: this question genuinely tests whether you can separate the orbit hierarchy."
  },

  {
    "id": "similarity_planet_moon_orbit",
    "tags": ["orbit_shapes"],
    "specRefs": ["8.5"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "A planet's orbit around the Sun and a moon's orbit around its planet are similar in shape: both are approximately {}.",
    "blanks": [
      { "expected": ["circular"] }
    ],
    "marks": 1,
    "explanation": "Both planet orbits and moon orbits are approximately circular. (Comet orbits, by contrast, are highly elliptical.)",
    "examinerNote": "Past paper 4SS0 Jun 2022 Q3a — the examiner reports note that 'approximately circular orbit' is the most-given correct similarity."
  },

  {
    "id": "differences_planet_vs_comet_multiselect",
    "tags": ["orbit_shapes", "orbit_speeds", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "multiselect",
    "atoms": ["planet_shape", "planet_speed", "comet_shape", "comet_speed", "comet_orbits"],
    "atomMap": {
      "planet_shape": [0, 2],
      "planet_speed": [1],
      "comet_shape":  [0, 2],
      "comet_speed":  [1],
      "comet_orbits": [3]
    },
    "prompt": "A planet and a comet both orbit the Sun. Tick the statements that are TRUE differences between a planet's orbit and a comet's orbit.",
    "choices": [
      "A planet's orbit is approximately circular, but a comet's orbit is highly elliptical.",
      "A planet's orbital speed is roughly constant, but a comet's orbital speed varies a lot.",
      "The Sun is at the centre of a planet's orbit, but at one focus of a comet's orbit.",
      "A planet orbits the Sun, but a comet does not orbit the Sun.",
      "Gravity causes a planet's orbit, but does not cause a comet's orbit.",
      "A planet's orbit can be drawn, but a comet's orbit cannot."
    ],
    "answerIndices": [0, 1, 2],
    "distractorRationales": {
      "3": "Both planets and comets orbit the Sun. This is a similarity, not a difference.",
      "4": "Gravity causes BOTH orbits. This is a similarity, not a difference.",
      "5": "Both orbits can be drawn. This is not a real physics difference."
    },
    "markingMode": "penalty",
    "marks": 3,
    "explanation": "There are three real differences between a planet's orbit and a comet's orbit around the Sun: the shape (circular vs elliptical), the speed (roughly constant vs varies a lot), and where the Sun sits (centre vs one focus). Both objects orbit the Sun and both orbits are caused by gravity, so those are similarities, not differences.",
    "examinerNote": "Past papers ask 'state one difference' as an open question. Here the question is reframed: tick all the statements that are real differences. The skill is the same, but you have to discriminate differences from similarities and from non-physics statements."
  },

  {
    "id": "categorise_comet_planet_features",
    "tags": ["orbit_shapes", "orbit_speeds", "objects_inventory", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "categorise",
    "atoms": ["comet_shape", "comet_speed", "comet_orbits", "planet_shape", "planet_speed", "planet_orbits"],
    "atomMap": {
      "comet_shape":   [0, 2],
      "comet_speed":   [1],
      "comet_orbits":  [6],
      "planet_shape":  [3, 5],
      "planet_speed":  [4],
      "planet_orbits": [6]
    },
    "prompt": "A comet and a planet both orbit the Sun. Sort each statement into the right group.",
    "bins": [
      "True of comets only",
      "True of planets only",
      "True of both"
    ],
    "items": [
      { "text": "Has a highly elliptical orbit",                   "bin": "True of comets only" },
      { "text": "Speed varies a lot during the orbit",             "bin": "True of comets only" },
      { "text": "The Sun sits at one focus of the orbit",          "bin": "True of comets only" },
      { "text": "Has a roughly circular orbit",                    "bin": "True of planets only" },
      { "text": "Has a roughly constant orbital speed",            "bin": "True of planets only" },
      { "text": "The Sun sits at the centre of the orbit",         "bin": "True of planets only" },
      { "text": "Orbits the Sun",                                  "bin": "True of both" },
      { "text": "Held in orbit by gravity",                        "bin": "True of both" }
    ],
    "marks": 8,
    "explanation": "Comets only: highly elliptical orbit, speed varies a lot, the Sun sits at one focus. Planets only: roughly circular orbit, roughly constant orbital speed, the Sun sits at the centre. Both: orbit the Sun; held in orbit by gravity. The 'both' items are similarities, not differences.",
    "examinerNote": "Atomises the comet/planet differences into a deterministic sort. The 'true of both' bin is important: it forces you to recognise that 'orbits the Sun' and 'gravity causes the orbit' are similarities, not differences."
  },

  {
    "id": "differences_planet_vs_moon_multiselect",
    "tags": ["orbit_periods", "orbit_shapes", "objects_inventory", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 2,
    "type": "multiselect",
    "atoms": ["planet_orbits", "moon_orbits", "planet_period", "moon_period"],
    "atomMap": {
      "planet_orbits": [0],
      "moon_orbits":   [0],
      "planet_period": [2],
      "moon_period":   [2]
    },
    "prompt": "A planet orbits the Sun. A moon orbits its planet. Tick the statements that are TRUE differences between these two orbits.",
    "choices": [
      "A planet orbits a star, but a moon orbits a planet.",
      "A moon's orbit has a smaller radius than a planet's orbit.",
      "A moon's orbital period is shorter than a planet's orbital period.",
      "A planet's orbit is circular, but a moon's orbit is elliptical.",
      "A planet's speed varies during the orbit, but a moon's is constant.",
      "Gravity causes a planet's orbit, but does not cause a moon's orbit."
    ],
    "answerIndices": [0, 1, 2],
    "distractorRationales": {
      "3": "Both planet orbits and moon orbits are approximately circular. This is a similarity, not a difference.",
      "4": "Planets orbit at roughly constant speed; so do moons. Speed-varies-a-lot is a feature of comets, not planets or moons.",
      "5": "Gravity causes BOTH orbits. This is a similarity, not a difference."
    },
    "markingMode": "penalty",
    "marks": 3,
    "explanation": "Real differences between planet orbits and moon orbits: a planet orbits a star but a moon orbits a planet; the moon's orbit is smaller in radius; the moon's orbital period is shorter (e.g. our Moon takes about a month, the Earth takes a year). Both orbits are roughly circular, both have roughly constant speed, and both are caused by gravity, so those are similarities."
  },

  // ==========================================================================
  // GROUP: Stars and stellar evolution
  // Subtags: colour_classification, colour_temperature, fusion_in_stars,
  //          lifecycle_low_mass, lifecycle_stages_detail
  // Spec: 8.7, 8.8, 8.9 (and 7.25 cross-listed for fusion_in_stars)
  // ==========================================================================

  // --- colour_classification --------------------------------------------

  {
    "id": "what_property_classifies_stars",
    "tags": ["colour_classification"],
    "specRefs": ["8.7"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "Stars can be classified according to their {}.",
    "blanks": [
      { "expected": ["colour"] }
    ],
    "marks": 1,
    "explanation": "Stars are classified by their colour. This was historically the easiest property to observe, and it tells us about the star's surface temperature.",
    "examinerNote": "British spelling 'colour' is the canonical answer; the engine accepts 'color' too via its US/GB fold."
  },

  {
    "id": "why_classify_by_colour",
    "tags": ["colour_classification", "colour_temperature"],
    "specRefs": ["8.7", "8.8"],
    "difficultyRating": 2,
    "type": "mcq",
    "prompt": "Why is colour useful for classifying stars?",
    "choices": [
      "Because a star's colour tells us about its surface temperature.",
      "Because each star is a different colour from every other star.",
      "Because colour tells us how far away the star is.",
      "Because colour tells us what the star is made of."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Many stars share the same colour. The Sun and many other yellow stars look similar.",
      "2": "Distance is measured in different ways (e.g. parallax, apparent brightness). Colour does not tell you distance.",
      "3": "All main sequence stars are mostly hydrogen and helium. Colour does not tell you composition; it tells you surface temperature."
    },
    "marks": 1,
    "explanation": "A star's colour is closely linked to its surface temperature: hotter stars are blue, cooler stars are red. This makes colour a useful, easy-to-measure proxy for temperature."
  },

  {
    "id": "stars_classified_property",
    "tags": ["colour_classification", "definition"],
    "specRefs": ["8.7"],
    "difficultyRating": 1,
    "type": "short",
    "prompt": "State the property of a star that determines its colour.",
    "marks": 1,
    "markPoints": [
      {
        "any": [
          "surface temperature",
          "the surface temperature",
          "its surface temperature",
          "temperature of the surface",
          "temperature at the surface"
        ]
      }
    ],
    "allowAdjust": false,
    "explanation": "A star's colour is determined by its surface temperature. Hotter surfaces glow blue; cooler surfaces glow red.",
    "examinerNote": "Direct port of 4SS0 Nov 2020 Q1c. The word 'surface' is essential. 'Temperature' alone is risky; 'core temperature' is wrong (cores are far hotter than surfaces and don't determine the colour)."
  },

  // --- colour_temperature -----------------------------------------------

  {
    "id": "hottest_colour",
    "tags": ["colour_temperature"],
    "specRefs": ["8.8"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which of these coloured stars has the highest surface temperature?",
    "choices": ["red", "yellow", "white", "blue"],
    "answerIndex": 3,
    "distractorRationales": {
      "0": "Red is the coolest of these colours, not the hottest.",
      "1": "Yellow stars (like the Sun) are warmer than red but cooler than white or blue.",
      "2": "White stars are hot, but blue stars are hotter still."
    },
    "marks": 1,
    "explanation": "From coolest to hottest: red, orange, yellow, white, blue-white, blue. So blue stars have the highest surface temperature.",
    "examinerNote": "A useful memory trick: think of a flame. The cool outer flame is red; the hot inner part is blue."
  },

  {
    "id": "coolest_colour",
    "tags": ["colour_temperature"],
    "specRefs": ["8.8"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which of these stars is the coolest?",
    "choices": ["blue star", "orange star", "red star", "yellow star"],
    "answerIndex": 2,
    "distractorRationales": {
      "0": "Blue stars are the hottest, not the coolest.",
      "1": "Orange is cooler than yellow and white, but warmer than red.",
      "3": "Yellow stars (like the Sun) are warmer than red stars."
    },
    "marks": 1,
    "explanation": "Red stars are the coolest of these. The full order from coolest to hottest is: red, orange, yellow, white, blue-white, blue."
  },

  {
    "id": "rank_colours_by_temp",
    "tags": ["colour_temperature"],
    "specRefs": ["8.8"],
    "difficultyRating": 2,
    "type": "ordering",
    "prompt": "Put these star colours in order of surface temperature, coolest first.",
    "items": ["red", "yellow", "white", "blue"],
    "shuffleStart": true,
    "marks": 4,
    "markingMode": "per_position",
    "explanation": "From coolest to hottest: red → yellow → white → blue. (The full sequence is red, orange, yellow, white, blue-white, blue.)"
  },

  {
    "id": "match_colour_to_temp",
    "tags": ["colour_temperature"],
    "specRefs": ["8.8"],
    "difficultyRating": 2,
    "type": "matching",
    "prompt": "Match each star colour to a typical surface temperature.",
    "pairs": [
      { "left": "red star",        "right": "about 3 000 °C" },
      { "left": "yellow star (like the Sun)", "right": "about 5 500 °C" },
      { "left": "white star",      "right": "about 10 000 °C" },
      { "left": "blue star",       "right": "about 25 000 °C" }
    ],
    "shuffleRight": true,
    "marks": 4,
    "explanation": "Red stars: about 3 000 °C. The Sun (yellow): about 5 500 °C. White stars: about 10 000 °C. Blue stars: about 25 000 °C and higher.",
    "examinerNote": "You don't need to memorise these numbers, just the order: red coolest, blue hottest."
  },

  {
    "id": "sun_vs_betelgeuse_which_hotter",
    "tags": ["colour_temperature"],
    "specRefs": ["8.8"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "The Sun's surface is yellow. Betelgeuse's surface is red. Which star has the higher surface temperature?",
    "choices": [
      "the Sun",
      "Betelgeuse",
      "they have the same surface temperature",
      "you cannot tell from colour alone"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Red stars are cooler than yellow stars on the colour-temperature scale, so Betelgeuse is the cooler one.",
      "2": "Different colours mean different surface temperatures. They cannot be the same.",
      "3": "Colour is exactly what tells you about surface temperature. Yellow is hotter than red, so the Sun's surface is hotter."
    },
    "marks": 1,
    "explanation": "The Sun (yellow) has a higher surface temperature than Betelgeuse (red). On the star colour-temperature scale, yellow is hotter than red.",
    "examinerNote": "Port of 4SS0 Jun 2021 Q7b mark point 1."
  },

  {
    "id": "betelgeuse_temp_compared_to_sun",
    "tags": ["colour_temperature"],
    "specRefs": ["8.8"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "Betelgeuse looks red. The Sun looks yellow. This means Betelgeuse has a {} surface temperature than the Sun.",
    "blanks": [
      { "expected": ["lower", "cooler", "smaller"] }
    ],
    "marks": 1,
    "explanation": "Red stars have lower surface temperatures than yellow stars. Betelgeuse's surface is cooler than the Sun's.",
    "examinerNote": "The complementary half of the previous question — having said the Sun is hotter, this asks the same idea from Betelgeuse's side."
  },

  {
    "id": "sun_temp_changes_to_red_giant",
    "tags": ["colour_temperature", "lifecycle_stages_detail"],
    "specRefs": ["8.8", "8.9"],
    "difficultyRating": 2,
    "type": "fillblank",
    "atoms": ["main_sequence_temperature", "red_giant_temperature"],
    "prompt": "The Sun is currently a yellow main sequence star. When it becomes a red giant, its surface temperature {}.",
    "blanks": [
      { "expected": ["decreases", "falls", "drops"] }
    ],
    "marks": 1,
    "explanation": "When the Sun becomes a red giant, its surface temperature decreases. The colour changes from yellow (hotter) to red (cooler), so the surface is cooler when it is a red giant.",
    "examinerNote": "Port of 4SS0 Jun 2021 Q7b(ii) mark point 1."
  },

  {
    "id": "why_red_giant_is_cooler",
    "tags": ["colour_temperature", "lifecycle_stages_detail"],
    "specRefs": ["8.8", "8.9"],
    "difficultyRating": 2,
    "type": "mcq",
    "atoms": ["red_giant_temperature", "red_giant_colour"],
    "prompt": "When the Sun becomes a red giant, its surface colour will change from yellow to red. What does this tell you about its surface temperature?",
    "choices": [
      "The surface temperature must have decreased.",
      "The surface temperature must have increased.",
      "The surface temperature must have stayed the same.",
      "Colour does not tell you anything about temperature."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Red is a cooler colour than yellow on the star colour-temperature scale, so going from yellow to red means the surface has cooled, not heated up.",
      "2": "If the surface temperature had stayed the same, the colour would not have changed. The colour change tells you the temperature has changed.",
      "3": "Surface colour is closely linked to surface temperature; that's the whole point of spec point 8.8."
    },
    "marks": 1,
    "explanation": "Red is a cooler colour than yellow on the star colour-temperature scale. So when a star's surface colour changes from yellow to red, its surface temperature must have decreased.",
    "examinerNote": "Port of 4SS0 Jun 2021 Q7b(ii) mark point 2 — the link between colour change and temperature change."
  },

  {
    "id": "lower_temp_colour_than_sun",
    "tags": ["colour_temperature"],
    "specRefs": ["8.8"],
    "difficultyRating": 1,
    "type": "short",
    "prompt": "The Sun is a yellow star. State a possible colour for a star that has a lower surface temperature than the Sun.",
    "marks": 1,
    "markPoints": [
      {
        "any": [
          "red",
          "orange",
          "a red star",
          "an orange star"
        ]
      }
    ],
    "allowAdjust": false,
    "explanation": "Red and orange stars have lower surface temperatures than the (yellow) Sun. The order from coolest to hottest is: red, orange, yellow, white, blue-white, blue.",
    "examinerNote": "Direct port of 4SS0 Jun 2025 Q2a. Either 'red' or 'orange' is accepted. 'White' or 'blue' would score zero (those colours are hotter than yellow)."
  },

  {
    "id": "test_validity_lambda_T",
    "tags": ["colour_temperature", "practical_skill"],
    "specRefs": ["8.8"],
    "difficultyRating": 4,
    "type": "ordering",
    "prompt": "A student is given a graph of peak wavelength vs surface temperature for many stars. The student wants to test whether 'peak wavelength × surface temperature = constant'. Put the steps the student should take in the right order.",
    "items": [
      "Choose one star from the graph and read off its peak wavelength and its surface temperature.",
      "Multiply the two values together to get a result for this star.",
      "Choose a different star from the graph and read off its peak wavelength and its surface temperature.",
      "Multiply the two values together to get a result for the second star.",
      "Compare the two results: if they are approximately the same, the formula is valid."
    ],
    "shuffleStart": true,
    "marks": 5,
    "markingMode": "per_position",
    "explanation": "To test 'peak wavelength × surface temperature = constant', read off pairs of values for at least two different stars, multiply each pair to get a 'constant', and check that the two values agree. If they don't, the formula isn't valid.",
    "examinerNote": "Port of 4SS0 Jun 2023 Q6c. The examiners' reports stress that 'use data from the graph' means reading at least two pairs of values, not just one."
  },

  // --- fusion_in_stars (cross-listed from Topic 7, spec ref 7.25) -------

  {
    "id": "name_fusion_process",
    "tags": ["fusion_in_stars", "definition"],
    "specRefs": ["7.25"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "In a star, hydrogen nuclei are joined together to form helium nuclei. This process is called nuclear {}.",
    "blanks": [
      { "expected": ["fusion"] }
    ],
    "marks": 1,
    "explanation": "Nuclear fusion is the process where small nuclei (like hydrogen) join together to make a larger nucleus (like helium). This releases energy and is the energy source of all main sequence stars.",
    "examinerNote": "Port of 4SS0 Jun 2019 Q5a. The examiners' report: 'Only a quarter of all candidates knew that nuclear fusion was responsible'. Worth memorising."
  },

  {
    "id": "fusion_energy_source_of_stars",
    "tags": ["fusion_in_stars"],
    "specRefs": ["7.25"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "What is the energy source of a main sequence star like the Sun?",
    "choices": [
      "nuclear fusion",
      "nuclear fission",
      "burning chemical fuel",
      "gravitational collapse"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Fission is splitting a heavy nucleus (like uranium) into smaller ones. Stars do not run on fission; they run on fusion.",
      "2": "The Sun isn't burning in the chemical sense. Chemical reactions can't release anywhere near enough energy to power a star.",
      "3": "Gravitational collapse releases energy in the protostar phase, but in a main sequence star like the Sun, fusion is the dominant source."
    },
    "marks": 1,
    "explanation": "Nuclear fusion is the energy source of all main sequence stars. In the Sun, hydrogen nuclei fuse to form helium nuclei, releasing huge amounts of energy."
  },

  {
    "id": "where_fusion_happens",
    "tags": ["fusion_in_stars"],
    "specRefs": ["7.25"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "Nuclear fusion in a main sequence star happens at the {} of the star.",
    "blanks": [
      { "expected": ["core", "centre"] }
    ],
    "marks": 1,
    "explanation": "Fusion happens at the core (centre) of a star, where the temperature and pressure are high enough for hydrogen nuclei to fuse. The outer layers are cooler and don't take part in fusion.",
    "examinerNote": "Either 'core' or 'centre' is accepted."
  },

  {
    "id": "fusion_inputs_outputs",
    "tags": ["fusion_in_stars"],
    "specRefs": ["7.25"],
    "difficultyRating": 2,
    "type": "matching",
    "prompt": "For nuclear fusion in the Sun, match each item to its role.",
    "pairs": [
      { "left": "hydrogen",        "right": "fuel that goes in" },
      { "left": "helium",          "right": "product that comes out" },
      { "left": "energy",          "right": "released by the process" }
    ],
    "shuffleRight": true,
    "marks": 3,
    "explanation": "Hydrogen nuclei are the fuel. They fuse together to form helium nuclei. The fusion releases energy (which is what makes the Sun shine)."
  },

  // --- lifecycle_low_mass -----------------------------------------------

  {
    "id": "lifecycle_stages_recall",
    "tags": ["lifecycle_low_mass", "definition", "lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "multiselect",
    "atoms": ["nebula_state", "main_sequence_state", "red_giant_state", "white_dwarf_state"],
    "atomMap": {
      "nebula_state":        [0],
      "main_sequence_state": [1],
      "red_giant_state":     [2],
      "white_dwarf_state":   [3]
    },
    "prompt": "Tick the stages in the life cycle of a star with a similar mass to the Sun.",
    "choices": [
      "nebula",
      "main sequence star",
      "red giant",
      "white dwarf",
      "supernova",
      "neutron star",
      "black hole"
    ],
    "answerIndices": [0, 1, 2, 3],
    "distractorRationales": {
      "4": "Supernovae happen at the end of the life cycle of stars MUCH more massive than the Sun. The Sun will not become a supernova.",
      "5": "Neutron stars are remnants of supernova explosions in massive stars. Sun-mass stars don't go through this stage.",
      "6": "Black holes form from the cores of very massive stars after supernova explosions. The Sun is far too small to become a black hole."
    },
    "markingMode": "penalty",
    "marks": 4,
    "explanation": "The Sun-mass life cycle has four stages on the 4SS0 spec: nebula, main sequence star, red giant, white dwarf. Supernovae, neutron stars and black holes belong to much more massive stars and are NOT in scope for the Single Award.",
    "examinerNote": "The examiners' reports flag this misconception repeatedly. Sun-mass star = nebula → main sequence → red giant → white dwarf. Stop there."
  },

  {
    "id": "lifecycle_stages_in_order",
    "tags": ["lifecycle_low_mass"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "ordering",
    "prompt": "Put these stages of the life cycle of a Sun-mass star in order, earliest first.",
    "items": ["nebula", "main sequence star", "red giant", "white dwarf"],
    "shuffleStart": true,
    "marks": 4,
    "markingMode": "per_position",
    "explanation": "The order is: nebula → main sequence star → red giant → white dwarf. The Sun is currently in its main sequence phase.",
    "examinerNote": "Port of 4SS0 Nov 2020 Q1a. The most common error is to add post-white-dwarf stages from the high-mass evolution path."
  },

  {
    "id": "stage_before_main_sequence",
    "tags": ["lifecycle_low_mass"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "Before becoming a main sequence star, the Sun was a {}.",
    "blanks": [
      { "expected": ["nebula"] }
    ],
    "marks": 1,
    "explanation": "Stars form from nebulae: large clouds of gas and dust that collapse under gravity. The Sun was a nebula before it became a main sequence star.",
    "examinerNote": "Port of 4SS0 Jun 2021 Q7b(i). The teacher's notes use the more detailed sequence 'nebula → protostar → main sequence', but for 4SS0 the answer 'nebula' is the expected one."
  },

  {
    "id": "current_stage_of_sun",
    "tags": ["lifecycle_low_mass"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which stage of the life cycle is the Sun currently in?",
    "choices": ["nebula", "main sequence", "red giant", "white dwarf"],
    "answerIndex": 1,
    "distractorRationales": {
      "0": "A nebula is a cloud of gas before the star forms. The Sun is no longer a nebula; it's a fully-formed star.",
      "2": "The Sun has not yet become a red giant. That will happen in about 5 billion years, when its hydrogen fuel runs out.",
      "3": "A white dwarf is the final stage of a Sun-mass star, after the red giant phase. The Sun has not reached that stage."
    },
    "marks": 1,
    "explanation": "The Sun is currently a yellow main sequence star, fusing hydrogen into helium in its core. Stars spend the longest part of their lives in the main sequence phase."
  },

  {
    "id": "lifecycle_stage_after_red_giant",
    "tags": ["lifecycle_low_mass"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "mcq",
    "prompt": "Which of these is a stage in the life cycle of the Sun?",
    "choices": ["black hole", "neutron star", "supernova", "white dwarf"],
    "answerIndex": 3,
    "distractorRationales": {
      "0": "Black holes form from very massive stars, much more massive than the Sun. The Sun cannot become a black hole.",
      "1": "Neutron stars are remnants of massive-star supernovae. The Sun is not massive enough.",
      "2": "Supernovae are explosions of massive stars at the end of their lives. The Sun is too small to undergo a supernova explosion."
    },
    "marks": 1,
    "explanation": "White dwarf is the final stage in a Sun-mass star's life. Black holes, neutron stars and supernovae all belong to much more massive stars.",
    "examinerNote": "Port of 4PH1 Jun 2021 Q1a(ii). This question stays inside the 4SS0 spec because the correct answer (white dwarf) is in 4SS0, even though the distractors mention 4PH1-only stages."
  },

  {
    "id": "stage_at_end_of_low_mass_life",
    "tags": ["lifecycle_low_mass"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "The final stage in the life cycle of a Sun-mass star is a {} dwarf.",
    "blanks": [
      { "expected": ["white"] }
    ],
    "marks": 1,
    "explanation": "A Sun-mass star ends its life as a white dwarf: the slowly-cooling core left behind after the red giant phase. (After very long periods of time it would cool to a black dwarf, but the universe is not yet old enough for any white dwarf to have done so.)"
  },

  // --- lifecycle_stages_detail ------------------------------------------

  {
    "id": "nebula_what_it_is",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "A nebula is a cloud of {} and dust.",
    "blanks": [
      { "expected": ["gas"] }
    ],
    "marks": 1,
    "explanation": "A nebula is a large cloud of gas (mostly hydrogen) and dust. Under its own gravity it collapses inwards, eventually becoming hot enough to start fusion and become a star."
  },

  {
    "id": "what_main_sequence_star_does",
    "tags": ["lifecycle_stages_detail", "fusion_in_stars"],
    "specRefs": ["8.9", "7.25"],
    "difficultyRating": 1,
    "type": "fillblank",
    "prompt": "A main sequence star fuses {} nuclei into {} nuclei in its core.",
    "blanks": [
      { "expected": ["hydrogen"] },
      { "expected": ["helium"] }
    ],
    "marks": 2,
    "explanation": "Main sequence stars fuse hydrogen into helium in their cores. This is the longest and most stable phase of a star's life, and it's where the Sun spends most of its time."
  },

  {
    "id": "describe_red_giant",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 2,
    "type": "multiselect",
    "atoms": ["red_giant_size", "red_giant_temperature", "red_giant_state"],
    "atomMap": {
      "red_giant_size":        [0, 3],
      "red_giant_temperature": [1, 2],
      "red_giant_state":       [4]
    },
    "prompt": "Tick all the statements that correctly describe a red giant.",
    "choices": [
      "It is much larger than the original main sequence star.",
      "Its surface is cooler than when it was a main sequence star.",
      "Its surface is hotter than when it was a main sequence star.",
      "It is much smaller than the original main sequence star.",
      "It is what a Sun-mass star becomes after the main sequence."
    ],
    "answerIndices": [0, 1, 4],
    "distractorRationales": {
      "2": "A red giant is cooler at its surface, not hotter. The colour is red, which is a cooler colour than yellow (the Sun's main sequence colour).",
      "3": "A red giant is much LARGER than the original star, not smaller. It is named 'giant' for a reason."
    },
    "markingMode": "penalty",
    "marks": 3,
    "explanation": "When a Sun-mass star becomes a red giant, its outer layers expand greatly (much larger than before). Because the surface is now further from the core, it is cooler, which makes the star appear red instead of yellow."
  },

  {
    "id": "main_sequence_to_red_giant",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 2,
    "type": "ordering",
    "atoms": ["main_sequence_fuel", "main_sequence_fusion_active", "red_giant_fuel", "red_giant_size", "red_giant_temperature"],
    "prompt": "Put these steps in the right order to describe what happens when a Sun-mass star changes from a main sequence star into a red giant.",
    "items": [
      "Hydrogen fusion in the core stops.",
      "The core contracts under gravity, heating up.",
      "Helium fusion begins in the hot core.",
      "The outer layers of the star expand greatly.",
      "The expanded surface cools, so the star appears red."
    ],
    "shuffleStart": true,
    "marks": 5,
    "markingMode": "per_position",
    "explanation": "Hydrogen fuel runs out, so hydrogen fusion stops. The core then collapses, heating up. The hotter core ignites helium fusion. Energy from the new fusion expands the outer layers; the expanded surface is cooler and therefore red.",
    "examinerNote": "Per the teacher's notes (extra notes section). The chain of reasoning matters: fusion stops, core collapses, core heats up, helium fusion starts, outer layers expand, surface cools."
  },

  {
    "id": "red_giant_to_white_dwarf",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 2,
    "type": "ordering",
    "atoms": ["red_giant_fuel", "red_giant_fusion_active", "white_dwarf_state", "white_dwarf_size", "white_dwarf_temperature", "white_dwarf_fusion_active"],
    "prompt": "Put these steps in the right order to describe what happens when a red giant becomes a white dwarf.",
    "items": [
      "Helium fusion in the core stops.",
      "The outer layers of the star are ejected as a planetary nebula.",
      "The hot core of the red giant is left behind.",
      "This hot core is the white dwarf."
    ],
    "shuffleStart": true,
    "marks": 4,
    "markingMode": "per_position",
    "explanation": "Helium fusion ends. With no fusion to support the star, the outer layers are pushed outwards (ejected as a planetary nebula). What's left is the hot, dense core: this is the white dwarf.",
    "examinerNote": "Per the teacher's notes. 'Planetary nebula' is the standard name for the ejected outer layers, even though it has nothing to do with planets (the name is historical)."
  },

  {
    "id": "describe_white_dwarf",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 2,
    "type": "multiselect",
    "atoms": ["white_dwarf_state", "white_dwarf_fusion_active", "white_dwarf_size", "white_dwarf_temperature"],
    "atomMap": {
      "white_dwarf_state":         [0, 4],
      "white_dwarf_fusion_active": [1],
      "white_dwarf_size":          [2],
      "white_dwarf_temperature":   [3]
    },
    "prompt": "Tick all the statements that correctly describe a white dwarf.",
    "choices": [
      "It is the leftover hot core of a red giant.",
      "It is no longer fusing nuclei.",
      "It is much larger than the Sun.",
      "It is hotter at its surface than the original red giant.",
      "It is the final stage of a Sun-mass star."
    ],
    "answerIndices": [0, 1, 3, 4],
    "distractorRationales": {
      "2": "A white dwarf is much smaller than the Sun, not larger. It is roughly Earth-sized: very dense, but tiny."
    },
    "markingMode": "penalty",
    "marks": 4,
    "explanation": "A white dwarf is the cooling, dense core left after the red giant has ejected its outer layers. It no longer fuses nuclei, but its surface is hot (and white-hot, hence 'white' dwarf). It is small (Earth-sized) and dense, not large."
  },

  {
    "id": "evolution_full_description",
    "tags": ["lifecycle_low_mass", "lifecycle_stages_detail", "extended_writing"],
    "specRefs": ["8.9"],
    "difficultyRating": 2,
    "type": "ordering",
    "atoms": ["nebula_state", "main_sequence_state", "main_sequence_fuel", "red_giant_state", "red_giant_size", "white_dwarf_state", "white_dwarf_fusion_active"],
    "prompt": "Describe the full evolution of a Sun-mass star by putting these descriptions in order, starting from the earliest stage.",
    "items": [
      "A cloud of gas and dust collapses under gravity (a nebula).",
      "Hydrogen fusion begins in the core: this is the main sequence phase.",
      "Hydrogen runs out, the star expands and cools at its surface: a red giant forms.",
      "The outer layers are ejected as a planetary nebula.",
      "The leftover hot core remains as a white dwarf."
    ],
    "shuffleStart": true,
    "marks": 5,
    "markingMode": "per_position",
    "explanation": "The full sequence: nebula collapses → main sequence (hydrogen fusion) → red giant (when hydrogen runs out, expansion and cooling) → planetary nebula ejection → white dwarf (the leftover core).",
    "examinerNote": "Port of 4SS0 Jun 2023 Q6b and 4SS0 Jun 2025 Q2b. These 4-mark questions ask the student to 'describe the evolution of the Sun from start to end'. This 5-step ordering captures the full chain."
  },

  {
    "id": "grid_stage_properties",
    "tags": ["lifecycle_stages_detail", "colour_temperature"],
    "specRefs": ["8.9", "8.8"],
    "difficultyRating": 3,
    "type": "grid",
    "atoms": ["main_sequence_fuel", "main_sequence_size", "main_sequence_colour", "main_sequence_fusion_active", "red_giant_fuel", "red_giant_size", "red_giant_colour", "red_giant_fusion_active", "white_dwarf_fuel", "white_dwarf_size", "white_dwarf_colour", "white_dwarf_fusion_active"],
    "atomMap": {
      "main_sequence_fuel":          [[0, 0]],
      "main_sequence_fusion_active": [[0, 0], [4, 0]],
      "main_sequence_size":          [[1, 0], [5, 0]],
      "main_sequence_colour":        [[2, 0], [3, 0]],
      "red_giant_fuel":              [[0, 1]],
      "red_giant_fusion_active":     [[0, 1], [4, 1]],
      "red_giant_size":              [[1, 1], [5, 1]],
      "red_giant_colour":            [[2, 1], [3, 1]],
      "white_dwarf_fuel":            [[0, 2]],
      "white_dwarf_fusion_active":   [[0, 2], [4, 2]],
      "white_dwarf_size":            [[1, 2], [5, 2]],
      "white_dwarf_colour":          [[2, 2], [3, 2]]
    },
    "prompt": "For each property, tick the stages of a Sun-mass star where the property is true.",
    "rows": [
      "Hydrogen fusion is happening at the core",
      "The star is much larger than the Sun is now",
      "The surface colour is yellow",
      "The surface colour is red",
      "The star is no longer fusing nuclei",
      "The star is much smaller than the Sun is now"
    ],
    "columns": ["Main sequence", "Red giant", "White dwarf"],
    "correct": {
      "0": [0],
      "1": [1],
      "2": [0],
      "3": [1],
      "4": [2],
      "5": [2]
    },
    "marks": 6,
    "markingMode": "per_row",
    "explanation": "Main sequence: hydrogen fusion in core, yellow surface, similar size to the Sun now. Red giant: much larger, surface cooler so red, helium fusion (not hydrogen). White dwarf: no fusion, much smaller, hot but tiny.",
    "examinerNote": "Captures the full 'properties of each stage' content of 8.9. Knowing this matrix unlocks most past-paper extended-writing questions on stellar evolution."
  },

  {
    "id": "matching_stage_to_property",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 2,
    "type": "matching",
    "prompt": "Match each stage of a Sun-mass star with its key feature.",
    "pairs": [
      { "left": "Nebula",            "right": "a cloud of gas and dust collapsing under gravity" },
      { "left": "Main sequence star", "right": "fusing hydrogen into helium at its core" },
      { "left": "Red giant",         "right": "much larger than before, with a cooler red surface" },
      { "left": "White dwarf",       "right": "the hot leftover core, no longer fusing" }
    ],
    "shuffleRight": true,
    "marks": 4,
    "explanation": "Nebula: gas/dust cloud. Main sequence: hydrogen fusion in core. Red giant: greatly expanded, cooler surface. White dwarf: hot leftover core, no fusion."
  },

  {
    "id": "fusion_stops_when_hydrogen_runs_out",
    "tags": ["lifecycle_stages_detail", "fusion_in_stars"],
    "specRefs": ["8.9", "7.25"],
    "difficultyRating": 2,
    "type": "mcq",
    "atoms": ["main_sequence_fuel"],
    "prompt": "Why does the Sun eventually leave the main sequence?",
    "choices": [
      "It runs out of hydrogen in its core.",
      "It cools down at its core.",
      "It runs out of helium.",
      "It collides with another star."
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The opposite happens: when hydrogen runs out, the core actually heats up further (because it contracts under gravity).",
      "2": "Helium is the product of fusion in the main sequence, not the fuel. Hydrogen is the fuel that runs out.",
      "3": "Stellar collisions are extremely rare. The Sun leaves the main sequence on its own, when its hydrogen fuel is depleted."
    },
    "marks": 1,
    "explanation": "A main sequence star fuses hydrogen into helium in its core. When the hydrogen in the core is mostly used up, hydrogen fusion stops, and the star leaves the main sequence to become a red giant."
  },

  {
    "id": "lifetime_estimate_calc",
    "tags": ["lifecycle_stages_detail", "calc"],
    "specRefs": ["8.9"],
    "difficultyRating": 3,
    "type": "numeric",
    "prompt": "The mass of hydrogen available for fusion in the Sun's core is approximately 6 × 10²⁹ kg. The Sun's core uses up approximately 5 × 10¹⁹ kg of hydrogen each year. Estimate the time, in years, until the Sun leaves the main sequence. Give your answer to one significant figure.",
    "answer": 12000000000,
    "unitHint": null,
    "marks": 2,
    "explanation": "Time = mass of hydrogen ÷ rate of use = (6 × 10²⁹) / (5 × 10¹⁹) = 1.2 × 10¹⁰ years. To 1 significant figure this rounds to 1 × 10¹⁰ years (10 billion years), which matches the standard estimate of the Sun's main-sequence lifetime.",
    "examinerNote": "Watch the standard form arithmetic: 6 / 5 = 1.2, and 10²⁹ / 10¹⁹ = 10¹⁰. To type the answer, use 1e10 or 10000000000. The 1-sf rounding is what brings 1.2 × 10¹⁰ down to 1 × 10¹⁰."
  },

  {
    "id": "evolution_after_main_sequence",
    "tags": ["lifecycle_low_mass", "lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "ordering",
    "prompt": "Put these stages in order, starting with the Sun's current stage.",
    "items": ["main sequence", "red giant", "white dwarf"],
    "shuffleStart": true,
    "marks": 3,
    "markingMode": "per_position",
    "explanation": "From now (main sequence) onwards: main sequence → red giant → white dwarf.",
    "examinerNote": "A simpler version of the full lifecycle ordering, focusing only on what comes after the present moment."
  },

  // ==========================================================================
  // GAP-COVERAGE MCQs (added 2026-05-10)
  // 18 MCQs targeting the previously-uncovered atoms in the stellar_lifecycle
  // and orbit_properties registries. Drafts in topic8_coverage_gap_mcqs.md.
  // Q11/Q12 (red_giant_fuel + red_giant_fusion_active) reframed per Wispr-
  // correction as a single combined MCQ (red_giant_fusion_mcq) capturing the
  // simultaneous shell-hydrogen + core-helium fusion. After this batch, atom
  // coverage is 35/35.
  // ==========================================================================

  // --- stellar gap-coverage: nebula -----------------------------------------

  {
    "id": "nebula_state_mcq",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["nebula_state"],
    "prompt": "What is a nebula?",
    "choices": [
      "A large cloud of gas and dust",
      "A hot, dense ball of fusing hydrogen",
      "An expanded outer shell of an old star",
      "A small, dense remnant of a dead star"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "That describes a main sequence star, the stage that begins after a nebula has collapsed and started fusion. A nebula is before that stage.",
      "2": "That describes a red giant, a much later stage in the lifecycle. A nebula is the very first stage.",
      "3": "That describes a white dwarf, the final stage of a Sun-mass star's life. A nebula sits at the opposite end of the lifecycle."
    },
    "marks": 1,
    "explanation": "A nebula is a large, diffuse cloud of gas (mostly hydrogen) and dust in space. A Sun-mass star is born when gravity pulls a region of a nebula together and compresses it. At this earliest stage, no fusion is happening yet.",
    "examinerNote": "The three distractors are the three other lifecycle stages; picking one of them tells you which stage you've confused with a nebula.",
    "commonMisconceptions": [
      "nebula confused with another lifecycle stage",
      "nebula thought to already be a fusing star",
      "nebula assumed smaller than a star"
    ]
  },

  {
    "id": "nebula_size_fuel_fusion_mcq",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 2,
    "type": "mcq",
    "atoms": ["nebula_size", "nebula_fuel", "nebula_fusion_active"],
    "prompt": "Which statement is correct about a nebula?",
    "choices": [
      "It is a vast cloud, much larger than a star, and no fusion is happening yet",
      "It is roughly the same size as a star, with hydrogen fusing in its core",
      "It is much smaller than a star, with no fusion happening",
      "It is roughly the size of a planet, with helium fusing in its core"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "A nebula has not yet collapsed enough to ignite fusion. Hydrogen fusion is the signature of a main sequence star, not a nebula.",
      "2": "A nebula is much larger than a star, not smaller. The whole point of the nebula → main sequence transition is that gravity squeezes a vast cloud down to a much smaller, denser ball.",
      "3": "A nebula is enormous (much larger than a star), and no fusion of any kind is happening in it. Helium fusion happens in a red giant's core, much later in the lifecycle."
    },
    "marks": 1,
    "explanation": "A nebula is much larger than a star: a vast cloud of gas and dust spanning many light-years. No fusion is happening because the gas isn't dense or hot enough yet; it has to collapse under gravity first before fusion can begin.",
    "examinerNote": "Three properties of a nebula are tested at once: its size, its fuel, and whether fusion is happening. The correct answer pinpoints all three.",
    "commonMisconceptions": [
      "nebula thought to already fuse hydrogen",
      "nebula thought smaller than a star (rather than vastly larger)",
      "helium fusion attributed to wrong stage"
    ]
  },

  {
    "id": "nebula_temperature_mcq",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["nebula_temperature"],
    "prompt": "What is the temperature inside a nebula, before it begins to collapse into a star?",
    "choices": [
      "Very cold",
      "As hot as the surface of the Sun",
      "Hot enough for hydrogen fusion",
      "Hot enough for helium fusion"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The Sun's surface is around 5800 K; that's the temperature of a star, not of an unformed cloud of gas. A nebula has no fusion to heat it up.",
      "2": "Hydrogen fusion requires temperatures of millions of kelvin. A nebula is far too cold for that; fusion only starts once gravity has compressed and heated the cloud enough.",
      "3": "Helium fusion requires even higher temperatures than hydrogen fusion, and only occurs in the cores of red giant stars. A nebula has not yet become a star, let alone reached the helium-fusion stage."
    },
    "marks": 1,
    "explanation": "Before gravitational collapse has compressed and heated a forming star, a nebula sits at the cold temperature of interstellar space, only a few kelvin above absolute zero. The collapse is what heats the core enough to start hydrogen fusion.",
    "examinerNote": "Distractors mark progressively hotter conditions; picking one signals you think the nebula is already farther along the lifecycle than it actually is.",
    "commonMisconceptions": [
      "nebula assumed to be hot like a star",
      "nebula thought already hot enough for fusion"
    ]
  },

  // --- stellar gap-coverage: main sequence ----------------------------------

  {
    "id": "main_sequence_state_mcq",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["main_sequence_state"],
    "prompt": "What is the physical form of a main sequence star?",
    "choices": [
      "A hot ball of plasma, fusing hydrogen in its core",
      "A diffuse cloud of gas and dust",
      "An expanded outer shell with a contracted hot core",
      "A small, dense remnant, no longer fusing"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "A diffuse cloud of gas and dust is a nebula, the stage before a main sequence star forms.",
      "2": "An expanded outer shell with a contracted hot core describes a red giant, the stage after the main sequence.",
      "3": "A small, dense remnant that is no longer fusing describes a white dwarf, the final stage."
    },
    "marks": 1,
    "explanation": "A main sequence star is a hot ball of plasma in steady balance: the inward pull of gravity is matched by the outward push of energy released by hydrogen fusion in its core. The Sun has been on the main sequence for around 4.6 billion years.",
    "examinerNote": "All three distractors are other stages of the lifecycle, so the question forces you to discriminate between the four physical forms.",
    "commonMisconceptions": [
      "main sequence confused with red giant",
      "main sequence confused with nebula",
      "main sequence confused with white dwarf"
    ]
  },

  {
    "id": "main_sequence_size_mcq",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["main_sequence_size"],
    "prompt": "Compared with a red giant, the Sun on the main sequence is:",
    "choices": [
      "Much smaller",
      "Roughly the same size",
      "Much larger",
      "Hundreds of times larger"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The transition from main sequence to red giant is a dramatic expansion. Saying the two are the same size misses the whole point of why a red giant is called 'giant'.",
      "2": "This reverses the relationship. A red giant is much larger than a main sequence Sun-mass star, not the other way around.",
      "3": "Same direction error as the previous choice: a red giant is much larger than the main sequence Sun, not the reverse."
    },
    "marks": 1,
    "explanation": "When a Sun-mass star leaves the main sequence and becomes a red giant, its outer layers expand enormously, to roughly 100 times the size of the original star. So the main sequence Sun is much smaller than the red giant it will become.",
    "commonMisconceptions": [
      "main sequence Sun and red giant assumed similar size",
      "size direction reversed (main sequence thought larger than red giant)"
    ]
  },

  {
    "id": "main_sequence_colour_mcq",
    "tags": ["lifecycle_stages_detail", "colour_temperature"],
    "specRefs": ["8.7", "8.8"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["main_sequence_colour"],
    "prompt": "The Sun is currently a main sequence star. What is the colour of its surface?",
    "choices": ["Yellow", "Red", "White", "Blue"],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Red stars are cooler than the Sun. The Sun's surface is around 5800 K, which is in the yellow part of the colour-temperature scale, not the red.",
      "2": "White stars are hotter than yellow stars. The Sun's surface is yellow at its current main sequence temperature.",
      "3": "Blue stars are the hottest of all, much hotter than the Sun. The Sun is yellow on the colour-temperature scale."
    },
    "marks": 1,
    "explanation": "The Sun is a yellow main sequence star with a surface temperature of around 5800 K. Hotter stars look white or blue; cooler stars look orange or red. Yellow places the Sun in the middle of the range tested by 4SS0.",
    "commonMisconceptions": [
      "Sun thought red because of sunset imagery",
      "Sun thought white or blue because of brightness",
      "colour-temperature link not internalised"
    ]
  },

  {
    "id": "main_sequence_fusion_active_mcq",
    "tags": ["lifecycle_stages_detail", "fusion_in_stars"],
    "specRefs": ["8.9", "7.25"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["main_sequence_fusion_active", "main_sequence_fuel"],
    "prompt": "What is happening in the core of a main sequence star?",
    "choices": [
      "Hydrogen is being fused into helium",
      "Helium is being fused into heavier elements",
      "No fusion is happening; the core is collapsing",
      "The core is fusing all the way to iron"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Helium fusion is what happens in a red giant's core, not a main sequence star's. A main sequence star fuses hydrogen.",
      "2": "If no fusion were happening and the core were collapsing, the star wouldn't be on the main sequence. The main sequence is defined by stable hydrogen fusion.",
      "3": "Fusion all the way to iron is something that happens inside very high-mass stars (4PH1 territory, not 4SS0). A Sun-mass main sequence star only fuses hydrogen into helium."
    },
    "marks": 1,
    "explanation": "On the main sequence, the core of a Sun-mass star is fusing hydrogen nuclei into helium. The energy released by this fusion is what stops the star collapsing under its own gravity, and is also the energy that radiates away as the star's light and heat.",
    "examinerNote": "The canonical 4SS0 phrasing is 'hydrogen is fused into helium'; both the fuel and the product are part of the answer.",
    "commonMisconceptions": [
      "helium fusion attributed to main sequence (which is hydrogen fusion)",
      "no-fusion state attributed to main sequence",
      "heavier-element or iron fusion (4PH1 scope leakage)"
    ]
  },

  // --- stellar gap-coverage: red giant --------------------------------------

  {
    "id": "red_giant_state_mcq",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["red_giant_state"],
    "prompt": "What is the physical form of a red giant?",
    "choices": [
      "A greatly expanded outer envelope around a smaller, hotter core",
      "A diffuse cloud of gas and dust",
      "A hot ball of plasma fusing hydrogen",
      "A small, dense, Earth-sized remnant"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "A diffuse cloud of gas and dust is a nebula, the very first stage of the lifecycle, not the stage after the main sequence.",
      "2": "A hot ball of plasma fusing hydrogen is a main sequence star. A red giant has expanded and its core has switched to fusing helium, not hydrogen.",
      "3": "A small, dense, Earth-sized remnant is a white dwarf, the final stage. A red giant is the much bigger, expanded stage that comes before the white dwarf."
    },
    "marks": 1,
    "explanation": "A red giant has a greatly expanded outer envelope (the parts the student would actually see) wrapped around a small, hot core where helium is now fusing. The expanded outer surface is much cooler than a main sequence star's surface, which is why the colour shifts from yellow to red.",
    "examinerNote": "Don't picture a red giant as just 'a bigger main sequence star'. The expanded envelope and the contracted hot core are doing very different things.",
    "commonMisconceptions": [
      "red giant thought to fuse hydrogen like main sequence (simpler-model persistence)",
      "red giant confused with white dwarf",
      "red giant thought to still be a nebula-like cloud"
    ]
  },

  {
    "id": "red_giant_size_mcq",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["red_giant_size"],
    "prompt": "Compared with the Sun on the main sequence, a red giant is:",
    "choices": [
      "Much larger",
      "Roughly the same size",
      "Much smaller",
      "About the size of a planet"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "The transition from main sequence to red giant is a dramatic expansion of the outer layers. The two stages are very different sizes.",
      "2": "Much smaller than the main sequence Sun describes a white dwarf, not a red giant. A red giant is bigger than the Sun, not smaller.",
      "3": "Planet-sized describes a white dwarf (about the size of the Earth). A red giant is on a totally different scale, much bigger than the Sun."
    },
    "marks": 1,
    "explanation": "When the Sun becomes a red giant, its outer layers expand to around 100 times their main sequence size. The Sun's red giant phase will be large enough to swallow the orbits of the inner planets, including possibly Earth's.",
    "commonMisconceptions": [
      "red giant assumed similar size to main sequence Sun",
      "red giant confused with white dwarf (planet-sized)"
    ]
  },

  {
    "id": "red_giant_fusion_mcq",
    "tags": ["lifecycle_stages_detail", "fusion_in_stars"],
    "specRefs": ["8.9", "7.25"],
    "difficultyRating": 2,
    "type": "mcq",
    "atoms": ["red_giant_fuel", "red_giant_fusion_active"],
    "prompt": "What is happening with fusion inside a red giant?",
    "choices": [
      "Helium fuses in the core, while hydrogen continues to fuse in a surrounding shell",
      "Hydrogen fuses in the core, as in a main sequence star",
      "No fusion is happening; the core is collapsing",
      "The core is fusing all the way to iron"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "This is the main sequence picture, not the red giant picture. By the time a star is a red giant, its core has run out of hydrogen and switched to helium fusion; only the surrounding shell still fuses hydrogen.",
      "2": "If no fusion were happening, the star would no longer be a red giant. Fusion is what holds the outer envelope up against gravity. The 'no fusion' stage is the white dwarf, which comes later.",
      "3": "Fusion all the way to iron only happens in very high-mass stars (4PH1 supergiant territory). In a Sun-mass red giant, fusion stops at helium, in the core, plus hydrogen fusion in a surrounding shell."
    },
    "marks": 1,
    "explanation": "A red giant has two fusion processes happening at the same time: helium fuses to heavier elements in the contracted hot core, and hydrogen continues to fuse to helium in a shell around that core. This double fusion is part of why the outer layers expand so much.",
    "examinerNote": "The 'two fusions at once' picture is the trickier part of red giant physics. Don't assume the main sequence picture (hydrogen-only, in the core) still applies.",
    "commonMisconceptions": [
      "main-sequence model still applied to red giant (hydrogen-only, in core)",
      "red giant thought to have no fusion (white-dwarf picture)",
      "iron fusion attributed to Sun-mass star (4PH1 supergiant scope leakage)",
      "shell-plus-core simultaneous fusion not recognised"
    ]
  },

  // --- stellar gap-coverage: white dwarf ------------------------------------

  {
    "id": "white_dwarf_state_mcq",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["white_dwarf_state"],
    "prompt": "What is a white dwarf?",
    "choices": [
      "The hot, dense core left behind after a red giant ejects its outer layers",
      "A vast cloud of gas and dust collapsing under gravity",
      "A hot ball of plasma fusing hydrogen",
      "An exploded massive star"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "A vast cloud of gas and dust collapsing under gravity describes a nebula, the very start of a star's life, not the end.",
      "2": "A hot ball of plasma fusing hydrogen is a main sequence star, the long stable middle of a star's life. A white dwarf has run out of fuel and no longer fuses.",
      "3": "An exploded massive star is a 4PH1-only supernova outcome, outside 4SS0 scope. The 4SS0 lifecycle for a Sun-mass star ends at a white dwarf, not an explosion."
    },
    "marks": 1,
    "explanation": "A white dwarf is the small, dense, hot core left behind once a red giant has thrown off its outer layers. It no longer fuses anything; it just slowly cools and fades over very long timescales. This is the final stage in the 4SS0 lifecycle of a Sun-mass star.",
    "examinerNote": "The 'exploded massive star' distractor is deliberately a 4PH1-only outcome, flagging that high-mass stellar evolution sits outside 4SS0.",
    "commonMisconceptions": [
      "white dwarf confused with supernova outcome (4PH1 scope leakage)",
      "white dwarf confused with nebula",
      "white dwarf thought to be a fusing star"
    ]
  },

  {
    "id": "white_dwarf_size_mcq",
    "tags": ["lifecycle_stages_detail"],
    "specRefs": ["8.9"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["white_dwarf_size"],
    "prompt": "How does the size of a white dwarf compare with the Sun?",
    "choices": [
      "Much smaller (roughly the size of the Earth)",
      "Much larger (hundreds of times bigger)",
      "Roughly the same size as the Sun",
      "Smaller than a planet's moon"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Hundreds of times bigger than the Sun describes a red giant, not a white dwarf. A white dwarf is much smaller than the Sun, not larger.",
      "2": "When a red giant ejects its outer layers, the core that remains is far smaller than the original star. A white dwarf is roughly Earth-sized, not Sun-sized.",
      "3": "A white dwarf is small but not that small. It's roughly the size of the Earth, much bigger than a moon."
    },
    "marks": 1,
    "explanation": "A white dwarf is the leftover core of a Sun-mass star, with most of the original mass packed into a volume only about the size of the Earth. That makes it incredibly dense; a teaspoonful of white dwarf material would weigh tonnes.",
    "examinerNote": "The Sun-vs-Earth size contrast is the easiest mental model: take a Sun-mass star and squash it down to Earth size.",
    "commonMisconceptions": [
      "white dwarf assumed Sun-sized",
      "white dwarf confused with red giant (much larger)"
    ]
  },

  {
    "id": "white_dwarf_fuel_fusion_mcq",
    "tags": ["lifecycle_stages_detail", "fusion_in_stars"],
    "specRefs": ["8.9", "7.25"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["white_dwarf_fuel", "white_dwarf_fusion_active"],
    "prompt": "What is happening inside a white dwarf?",
    "choices": [
      "No fusion; the white dwarf is slowly cooling",
      "Hydrogen is being fused into helium",
      "Helium is being fused into heavier elements",
      "The core is collapsing to start fusion"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Hydrogen fusion happens in main sequence stars, not in white dwarfs. By the time a star is a white dwarf, all of its hydrogen fuel has long since been used up.",
      "2": "Helium fusion happens in the core of a red giant, the stage before. By the white dwarf stage, fusion has stopped altogether.",
      "3": "Core collapse leading to fusion describes the early protostar phase, not a white dwarf. A white dwarf is the end of the lifecycle, not the start."
    },
    "marks": 1,
    "explanation": "A white dwarf has no fuel left for fusion, so no fusion is happening. It's just a hot, dense cinder slowly radiating its leftover heat into space. Over timescales much longer than the age of the universe, it would gradually cool and fade.",
    "examinerNote": "Both atoms (no fuel + no active fusion) are tied together: a white dwarf is what's left over after fusion has finished.",
    "commonMisconceptions": [
      "white dwarf thought to fuse hydrogen (main-sequence picture)",
      "white dwarf thought to fuse helium (red-giant picture)",
      "white dwarf thought to be on the verge of igniting fusion (protostar picture)"
    ]
  },

  {
    "id": "white_dwarf_colour_temperature_mcq",
    "tags": ["lifecycle_stages_detail", "colour_temperature"],
    "specRefs": ["8.8", "8.9"],
    "difficultyRating": 2,
    "type": "mcq",
    "atoms": ["white_dwarf_temperature", "white_dwarf_colour"],
    "prompt": "A white dwarf has a high surface temperature. Based on the colour-temperature link, what colour does its surface appear?",
    "choices": [
      "White",
      "Red",
      "Yellow",
      "Black (because it's no longer fusing)"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Red is the colour of cool stellar surfaces, not hot ones. A high surface temperature corresponds to a hotter colour, towards white or blue.",
      "2": "Yellow is the colour of a Sun-temperature star, around 5800 K. A white dwarf is hotter than this; its surface temperature is higher, so its colour is whiter.",
      "3": "This confuses 'no fusion' with 'no light'. A white dwarf's surface is still extremely hot from the leftover heat of the star's earlier life, so it glows brightly even without fusion."
    },
    "marks": 1,
    "explanation": "The colour-temperature link works for any glowing surface, not just main sequence stars: hotter glows whiter or bluer, cooler glows redder. A white dwarf's surface is very hot, so it glows white. The fact that fusion has stopped doesn't change the colour; it just means the star will gradually cool over time.",
    "examinerNote": "This is a derivation question: you start from the temperature fact and use the colour-temperature link to infer the colour. The 'black because no fusion' distractor catches students who think 'no fusion = dark'.",
    "commonMisconceptions": [
      "colour-temperature direction reversed (hot thought red, cool thought blue)",
      "no-fusion thought to mean dark or black",
      "white dwarf assumed yellow like the Sun"
    ]
  },

  // --- orbit gap-coverage ---------------------------------------------------

  {
    "id": "comet_period_mcq",
    "tags": ["orbit_periods", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["comet_period"],
    "prompt": "Comets typically take how long to complete one orbit around the Sun?",
    "choices": [
      "Many years, often decades or centuries",
      "About one day",
      "About one month",
      "About one Earth year"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "About one day is the period of Earth's rotation on its axis, not an orbit. None of the orbital periods studied at 4SS0 are anywhere near a day long.",
      "2": "About one month is the period of the Moon's orbit around the Earth. Comets orbit the Sun, much further out, on a much larger and slower orbit.",
      "3": "About one Earth year is the period of the Earth's orbit around the Sun. Comets are typically far from the Sun for most of their orbit, so their periods are much longer than a planet like Earth's."
    },
    "marks": 1,
    "explanation": "Comets travel on highly elliptical orbits that take them far from the Sun for most of their journey. As a result they have very long orbital periods, typically decades to centuries, sometimes much longer. Halley's Comet, for example, has a period of about 76 years.",
    "examinerNote": "The three distractors are the day, month and year facts that the spec also expects you to know; the trap is to confuse them with comet periods.",
    "commonMisconceptions": [
      "comet period confused with day, month or Earth-year",
      "comet orbit period assumed similar to planet orbit period"
    ]
  },

  {
    "id": "comet_planet_orbits_sun_mcq",
    "tags": ["gravity_causes_orbits", "orbit_properties"],
    "specRefs": ["8.4"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["comet_orbits", "planet_orbits"],
    "prompt": "In our solar system, what do comets and planets both orbit?",
    "choices": [
      "The Sun",
      "A planet",
      "The Moon",
      "The centre of the galaxy"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Things orbit planets too (moons do), but planets and comets themselves orbit the Sun, because the Sun is the largest mass in the solar system.",
      "2": "The Moon is much smaller than the Sun and only the Earth orbits it (well, more accurately, they orbit each other). Comets and planets are not held in orbit by the Moon.",
      "3": "The Sun (and the whole solar system with it) does orbit the centre of the Milky Way galaxy, but at the scale of the solar system, planets and comets orbit the Sun."
    },
    "marks": 1,
    "explanation": "Gravity from the largest nearby mass holds smaller objects in orbit. In the solar system, the Sun is by far the most massive object, so both planets and comets are held in orbit around it. Moons, by contrast, are held in orbit around their planets.",
    "examinerNote": "Questions like this are about scale: at the solar system scale, the Sun is what everything orbits, even though at the galactic scale, the Sun itself is in orbit.",
    "commonMisconceptions": [
      "comets thought to orbit a planet instead of the Sun",
      "comet orbit confused with moon orbit (planet-central)",
      "scale confusion (galactic-centre picture applied at solar-system scale)"
    ]
  },

  {
    "id": "moon_shape_mcq",
    "tags": ["orbit_shapes", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["moon_shape"],
    "prompt": "What is the shape of the orbit of a moon around its planet?",
    "choices": [
      "Roughly circular",
      "Highly elliptical",
      "A perfect square",
      "A straight line"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Highly elliptical orbits are characteristic of comets, not moons. Moons orbit their planets on roughly circular paths.",
      "2": "Orbits in a gravitational field are never square. The shape of an orbit comes from gravity always pulling the orbiting body towards the centre, which traces out a smooth curve.",
      "3": "A straight-line path would mean no orbit at all; the object would either fly off into space or fall directly into the planet. Orbiting requires a curved path."
    },
    "marks": 1,
    "explanation": "Moons orbit their planets on roughly circular paths, in the same way that planets orbit the Sun on roughly circular paths. The whole moon-around-planet system is a smaller-scale version of the planet-around-Sun system.",
    "commonMisconceptions": [
      "comet orbit pattern (highly elliptical) transferred to moons",
      "orbit shape thought non-curved"
    ]
  },

  {
    "id": "moon_speed_mcq",
    "tags": ["orbit_speeds", "orbit_properties"],
    "specRefs": ["8.5"],
    "difficultyRating": 1,
    "type": "mcq",
    "atoms": ["moon_speed"],
    "prompt": "A moon orbits its planet in a roughly circular orbit. How does its orbital speed behave?",
    "choices": [
      "Stays roughly constant throughout the orbit",
      "Varies a lot (fastest when closest to the planet)",
      "Increases steadily during each orbit",
      "The moon is stationary; the planet rotates underneath it"
    ],
    "answerIndex": 0,
    "distractorRationales": {
      "1": "Highly variable orbital speed (fastest when closest) is the comet-orbit pattern, because comets travel on stretched-out elliptical paths. Moons travel on roughly circular paths and have nearly constant orbital speed.",
      "2": "If the orbital speed kept increasing, the moon would eventually fly off. A stable orbit needs a steady speed (for a circular orbit) or a regular speed-up-then-slow-down (for an elliptical one), not a one-way increase.",
      "3": "This is the geostationary satellite picture, not the moon picture. A real moon really moves around its planet; it isn't parked in the sky like a TV satellite."
    },
    "marks": 1,
    "explanation": "Because a moon's orbit is roughly circular, its distance from its planet stays roughly the same. The pull of gravity therefore stays roughly the same, and the moon's orbital speed stays roughly constant throughout the orbit.",
    "examinerNote": "Distractor B is the comet-orbit pattern; picking it suggests confusion between moon (circular) and comet (elliptical) speed behaviour.",
    "commonMisconceptions": [
      "comet speed pattern (fastest when closest) transferred to moon",
      "geostationary misconception (moon thought stationary)",
      "orbital speed thought to increase steadily"
    ]
  }

];
