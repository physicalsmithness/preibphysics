// ============================================================================
// Topic 8 configuration — read by ../engine.js at boot.
// Sets the topic-specific vocab, atom registry, storage key, and the global
// variable name where the question bank lives.
//
// Must be loaded BEFORE engine.js (and before topic8_questions.js, since it
// declares the variable name those questions live in).
//
// STAGE: vocabulary derived from the author chat's draft v1 question bank
// (Universe structure, Gravity, Orbits, Stars). Four parent groups, fifteen
// subtags. Cross-cutting tags: definition, extended_writing, calc,
// practical_skill. Atom registries: stellar_lifecycle (22 atoms), orbit_properties
// (12 atoms). Added 2026-05-08.
// ============================================================================

window.TOPIC_CONFIG = {

  questionsVar: "PREIB_TOPIC8_QUESTIONS",
  storageKey: "smithics_topic8_v1",

  vocab: {
    parentGroups: [
      {
        id: "universe",
        name: "Universe structure",
        subtags: [
          { id: "scale_hierarchy",    name: "Scale & hierarchy" },
          { id: "objects_inventory",  name: "Solar system" }
        ]
      },
      {
        id: "gravity",
        name: "Gravity",
        subtags: [
          { id: "g_variation",        name: "g variation" },
          { id: "weight_calc_astro",  name: "Weight calcs" }
        ]
      },
      {
        id: "orbits",
        name: "Orbits",
        subtags: [
          { id: "gravity_causes_orbits", name: "Gravity → orbits" },
          { id: "force_direction",       name: "Force direction" },
          { id: "orbit_shapes",          name: "Orbit shapes" },
          { id: "orbit_speeds",          name: "Orbit speeds" },
          { id: "orbit_periods",         name: "Orbit periods" },
          // v1.5.18 (2026-05-08): umbrella subtag hosting the orbit_properties
          // atom registry. Same name as the registry; mirrors how radiation_types
          // is both a subtag and a registry in Topic 7.
          { id: "orbit_properties",     name: "Orbit properties" }
        ]
      },
      {
        id: "stars",
        name: "Stars and lifecycle",
        subtags: [
          { id: "colour_classification",   name: "Star colour" },
          { id: "colour_temperature",      name: "Colour & temp" },
          { id: "fusion_in_stars",         name: "Stellar fusion" },
          { id: "lifecycle_low_mass",      name: "Low-mass lifecycle" },
          { id: "lifecycle_stages_detail", name: "Lifecycle stages" }
        ]
      }
    ],
    crossCutting: ["definition", "extended_writing", "calc", "practical_skill"]
  },

  // Atom registries. Each key is a subtag id; the value is an array of atom
  // objects. Atoms have id, name, group, attr, and an optional principle field
  // capturing the deeper physics the atom flows from (v0.6 minor, freeform
  // string, currently ignored by the engine but preserved for v0.7+ tooling).
  //
  // stellar_lifecycle: 22 atoms (4 groups × 6 attrs minus 2 nebula
  //   atoms — nebula_colour and nebula_temperature dropped 2026-05-08
  //   because a diffuse cloud has no surface for the colour-temperature
  //   link to apply).
  // orbit_properties: 12 atoms (3 groups × 4 attrs).
  atoms: {

    // ──────────────────────────────────────────────────────────────────────
    // stellar_lifecycle — 22 atoms across 4 stages × 6 attrs (minus 2)
    //   groups: nebula, main_sequence, red_giant, white_dwarf
    //   attrs:  state, fuel, size, temperature, colour, fusion_active
    //
    // Principle clusters:
    //   P-stellar-1 (gravity-vs-fusion balance defines stage): 14 atoms.
    //   P-stellar-2 (colour as temperature proxy): 6 atoms.
    //   No principle: nebula_state alone of the matrix-consistency atoms,
    //     because pre-fusion the "balance" reduces to "no fusion yet,
    //     gravity is collapsing the cloud" — same principle applies, just
    //     in the limit case.
    // ──────────────────────────────────────────────────────────────────────
    lifecycle_stages_detail: [
      // state axis (4 atoms)
      { id: "nebula_state",         name: "Nebula — physical state",        group: "nebula",        attr: "state",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "main_sequence_state",  name: "Main sequence — physical state", group: "main_sequence", attr: "state",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "red_giant_state",      name: "Red giant — physical state",     group: "red_giant",     attr: "state",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "white_dwarf_state",    name: "White dwarf — physical state",   group: "white_dwarf",   attr: "state",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },

      // fuel axis (4 atoms)
      { id: "nebula_fuel",          name: "Nebula — fusion fuel",        group: "nebula",        attr: "fuel",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "main_sequence_fuel",   name: "Main sequence — fusion fuel", group: "main_sequence", attr: "fuel",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "red_giant_fuel",       name: "Red giant — fusion fuel",     group: "red_giant",     attr: "fuel",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "white_dwarf_fuel",     name: "White dwarf — fusion fuel",   group: "white_dwarf",   attr: "fuel",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },

      // size axis (4 atoms)
      { id: "nebula_size",          name: "Nebula — size scale",        group: "nebula",        attr: "size",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "main_sequence_size",   name: "Main sequence — size scale", group: "main_sequence", attr: "size",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "red_giant_size",       name: "Red giant — size scale",     group: "red_giant",     attr: "size",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "white_dwarf_size",     name: "White dwarf — size scale",   group: "white_dwarf",   attr: "size",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },

      // temperature axis (3 atoms — nebula_temperature dropped 2026-05-08)
      { id: "main_sequence_temperature", name: "Main sequence — surface temperature", group: "main_sequence", attr: "temperature",
        principle: "A star's surface colour is determined by its surface temperature: hotter surfaces glow towards blue, cooler surfaces glow towards red. So colour and temperature are two views of the same fact." },
      { id: "red_giant_temperature",     name: "Red giant — surface temperature",     group: "red_giant",     attr: "temperature",
        principle: "A star's surface colour is determined by its surface temperature: hotter surfaces glow towards blue, cooler surfaces glow towards red. So colour and temperature are two views of the same fact." },
      { id: "white_dwarf_temperature",   name: "White dwarf — surface temperature",   group: "white_dwarf",   attr: "temperature",
        principle: "A star's surface colour is determined by its surface temperature: hotter surfaces glow towards blue, cooler surfaces glow towards red. So colour and temperature are two views of the same fact." },

      // colour axis (3 atoms — nebula_colour dropped 2026-05-08)
      { id: "main_sequence_colour", name: "Main sequence — surface colour", group: "main_sequence", attr: "colour",
        principle: "A star's surface colour is determined by its surface temperature: hotter surfaces glow towards blue, cooler surfaces glow towards red. So colour and temperature are two views of the same fact." },
      { id: "red_giant_colour",     name: "Red giant — surface colour",     group: "red_giant",     attr: "colour",
        principle: "A star's surface colour is determined by its surface temperature: hotter surfaces glow towards blue, cooler surfaces glow towards red. So colour and temperature are two views of the same fact." },
      { id: "white_dwarf_colour",   name: "White dwarf — surface colour",   group: "white_dwarf",   attr: "colour",
        principle: "A star's surface colour is determined by its surface temperature: hotter surfaces glow towards blue, cooler surfaces glow towards red. So colour and temperature are two views of the same fact." },

      // fusion_active axis (4 atoms)
      { id: "nebula_fusion_active",        name: "Nebula — fusing or not",        group: "nebula",        attr: "fusion_active",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "main_sequence_fusion_active", name: "Main sequence — fusing or not", group: "main_sequence", attr: "fusion_active",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "red_giant_fusion_active",     name: "Red giant — fusing or not",     group: "red_giant",     attr: "fusion_active",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." },
      { id: "white_dwarf_fusion_active",   name: "White dwarf — fusing or not",   group: "white_dwarf",   attr: "fusion_active",
        principle: "A star's stage is defined by what nuclear fuel is fusing in its core; the resulting fusion-vs-gravity balance sets both how big the star is and what physical form it takes." }
    ],

    // ──────────────────────────────────────────────────────────────────────
    // orbit_properties — 12 atoms across 3 objects × 4 attrs
    //   groups: comet, planet, moon
    //   attrs:  shape, speed, period, what_orbits
    //
    // Principle clusters:
    //   P-orbit-1 (comet's elliptical orbit explains its odd behaviour): 3.
    //   P-orbit-2 (planet's circular orbit, steady speed and period):    3.
    //   P-orbit-3 (moon's orbit is planet-orbit at smaller scale):       3.
    //   P-orbit-4 (gravity of larger body sets what orbits what):        3
    //     — cross-group cluster, the only one in the registry.
    // ──────────────────────────────────────────────────────────────────────
    orbit_properties: [
      // comet group
      { id: "comet_shape",   name: "Comet — orbit shape",            group: "comet", attr: "shape",
        principle: "A comet's highly elliptical orbit means it spends most of its time far from the Sun where gravity is weaker, with brief fast passes near perihelion." },
      { id: "comet_speed",   name: "Comet — orbital speed behaviour", group: "comet", attr: "speed",
        principle: "A comet's highly elliptical orbit means it spends most of its time far from the Sun where gravity is weaker, with brief fast passes near perihelion." },
      { id: "comet_period",  name: "Comet — orbital period scale",    group: "comet", attr: "period",
        principle: "A comet's highly elliptical orbit means it spends most of its time far from the Sun where gravity is weaker, with brief fast passes near perihelion." },
      { id: "comet_orbits",  name: "Comet — what it orbits",          group: "comet", attr: "what_orbits",
        principle: "Gravity of a much larger body holds a smaller body in orbit. Comets and planets are held by the Sun (the largest body in the solar system); moons are held by their planet's gravity." },

      // planet group
      { id: "planet_shape",  name: "Planet — orbit shape",            group: "planet", attr: "shape",
        principle: "A planet's nearly circular orbit means its distance from the Sun stays roughly constant, so its orbital speed and orbital period are also roughly steady; closer planets orbit faster and have shorter years." },
      { id: "planet_speed",  name: "Planet — orbital speed behaviour", group: "planet", attr: "speed",
        principle: "A planet's nearly circular orbit means its distance from the Sun stays roughly constant, so its orbital speed and orbital period are also roughly steady; closer planets orbit faster and have shorter years." },
      { id: "planet_period", name: "Planet — orbital period scale",    group: "planet", attr: "period",
        principle: "A planet's nearly circular orbit means its distance from the Sun stays roughly constant, so its orbital speed and orbital period are also roughly steady; closer planets orbit faster and have shorter years." },
      { id: "planet_orbits", name: "Planet — what it orbits",          group: "planet", attr: "what_orbits",
        principle: "Gravity of a much larger body holds a smaller body in orbit. Comets and planets are held by the Sun (the largest body in the solar system); moons are held by their planet's gravity." },

      // moon group
      { id: "moon_shape",    name: "Moon — orbit shape",              group: "moon", attr: "shape",
        principle: "A moon's orbit around its planet behaves like a planet's around the Sun (roughly circular, steady speed) but on a much smaller scale — smaller orbital radius, shorter orbital period." },
      { id: "moon_speed",    name: "Moon — orbital speed behaviour",   group: "moon", attr: "speed",
        principle: "A moon's orbit around its planet behaves like a planet's around the Sun (roughly circular, steady speed) but on a much smaller scale — smaller orbital radius, shorter orbital period." },
      { id: "moon_period",   name: "Moon — orbital period scale",      group: "moon", attr: "period",
        principle: "A moon's orbit around its planet behaves like a planet's around the Sun (roughly circular, steady speed) but on a much smaller scale — smaller orbital radius, shorter orbital period." },
      { id: "moon_orbits",   name: "Moon — what it orbits",            group: "moon", attr: "what_orbits",
        principle: "Gravity of a much larger body holds a smaller body in orbit. Comets and planets are held by the Sun (the largest body in the solar system); moons are held by their planet's gravity." }
    ]

  }

};
