// ============================================================================
// Topic 8 configuration — read by ../engine.js at boot.
// Sets the topic-specific vocab, atom registry, storage key, and the global
// variable name where the question bank lives.
//
// Must be loaded BEFORE engine.js (and before topic8_questions.js, since it
// declares the variable name those questions live in).
//
// STAGE: vocabulary derived from the author chat's draft v1 question bank
// (Universe structure, Gravity, Orbits, Stars). Four parent groups, fourteen
// subtags. Cross-cutting tags: definition, extended_writing, calc,
// practical_skill. No atom registry yet (Topic 8 v1 doesn't use atoms).
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
          { id: "orbit_periods",         name: "Orbit periods" }
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

  atoms: {}

};
