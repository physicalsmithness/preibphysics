window.MAGNETISM_QUIZ_META = {
  title: "Topic 6 Quiz",
  subtitle: "Magnetism & electromagnetism • random sets • mark-scheme style feedback"
};

window.MAGNETISM_QUIZ_QUESTIONS = [
  // -------------------- Units --------------------
  {id:"u_current", tags:["units"], difficulty:"easy", type:"mcq",
    prompt:"Which is the unit of current?",
    choices:["volt (V)","ampere (A)","watt (W)"],
    answerIndex:1,
    explanation:"Current is measured in amperes (A)."},
  {id:"u_voltage", tags:["units"], difficulty:"easy", type:"mcq",
    prompt:"Which is the unit of potential difference (voltage)?",
    choices:["ampere (A)","watt (W)","volt (V)"],
    answerIndex:2,
    explanation:"Potential difference is measured in volts (V)."},
  {id:"u_power", tags:["units"], difficulty:"easy", type:"mcq",
    prompt:"Which is the unit of power?",
    choices:["watt (W)","volt (V)","ampere (A)"],
    answerIndex:0,
    explanation:"Power is measured in watts (W)."},
  {id:"piv_power_calc", tags:["units","speaker"], difficulty:"med", type:"numeric",
    prompt:"A loudspeaker takes 0.15 A from a 0.75 V supply. Calculate the power.",
    answer:0.1125,
    unitHint:"W",
    explanation:"Use P = IV.\nP = 0.15 × 0.75 = 0.1125 W (≈ 0.11 W)."},
  {id:"piv_state", tags:["units"], difficulty:"easy", type:"short",
    prompt:"State the formula linking power, current and voltage.",
    marks:1,
    expectedSymbolic:["P=IV","P=VI"],
    markPoints:[{any:["power = current","power = voltage","power = current × voltage","power = current x voltage","p = i v","p=iv"]}],
    explanation:"Expected: P = IV."},

  // -------------------- Magnetic field lines --------------------
  {id:"mfl_define", tags:["fieldlines"], difficulty:"med", type:"short",
    prompt:"What does a magnetic field line show?",
    marks:2,
    markPoints:[
      {any:["direction","shows the direction"]},
      {any:["north pole","north","a north pole","force on a north","magnetic force on a north"]}
    ],
    explanation:"A magnetic field line shows the direction of the magnetic force on a north pole at that point (direction a north pole would move/point)."},
  {id:"mfl_n_to_s", tags:["fieldlines"], difficulty:"easy", type:"mcq",
    prompt:"Outside a bar magnet, magnetic field lines go from:",
    choices:["S to N","N to S","they go in circles with no direction","they start and stop randomly"],
    answerIndex:1,
    explanation:"Outside the magnet, field lines go from the north pole to the south pole (arrows N → S)."},
  {id:"mfl_strength", tags:["fieldlines"], difficulty:"easy", type:"mcq",
    prompt:"How can you tell a magnetic field is stronger in a diagram of field lines?",
    choices:[
      "Field lines are further apart",
      "Field lines are closer together",
      "Field lines have bigger arrows",
      "Field lines are coloured red"
    ],
    answerIndex:1,
    explanation:"Closer spacing of field lines indicates a stronger magnetic field."},
  {id:"mfl_no_cross", tags:["fieldlines"], difficulty:"med", type:"short",
    prompt:"Why must magnetic field lines never cross?",
    marks:2,
    markPoints:[
      {any:["direction","two directions","different directions"]},
      {any:["force","magnetic force","field would point"]}
    ],
    explanation:"At a point, the magnetic field has one direction. If lines crossed, it would imply the force/field points in two directions at once."},

  {id:"mfl_pick_correct_diagram", tags:["fieldlines"], difficulty:"med", type:"mcq",
    prompt:"Which diagram shows a correct set of magnetic field lines around a bar magnet?",
    choices:[
      {label:"A", svgKind:"barField_wrong_arrows", caption:"Arrows wrong way"},
      {label:"B", svgKind:"barField_good", caption:"Continuous, no crossings, N→S"},
      {label:"C", svgKind:"barField_wrong_cross", caption:"Lines cross"},
      {label:"D", svgKind:"barField_wrong_gaps", caption:"Lines don't touch magnet"}
    ],
    answerIndex:1,
    explanation:"Correct field lines should be continuous, not crossing, and arrows show N → S outside the magnet."},

  // -------------------- Practical: plotting field patterns --------------------
  {id:"practical_compass", tags:["practical"], difficulty:"hard", type:"short",
    prompt:"Describe a method to investigate the magnetic field pattern around a bar magnet (shape and direction).",
    marks:6,
    markPoints:[
      {any:["paper","card","place magnet under","put magnet under"]},
      {any:["plotting compass","compass"]},
      {any:["move the compass","different positions","repeat at many points","multiple points"]},
      {any:["mark","dot","mark the direction","draw arrows","join","lines"]},
      {any:["iron filings","sprinkle","tap","shake"]},
      {any:["direction","use compass to show direction","arrows from n to s"]}
    ],
    explanation:
`Mark scheme style points (any suitable set):
• Place magnet under paper/card.
• Use a plotting compass to find direction at lots of points (move compass around).
• Mark the direction and join marks to make field lines with arrows.
• OR sprinkle iron filings on paper and tap to show the pattern (shape).
• To show direction when using filings, follow up with a compass and add arrows.
(Compass is the key method for direction.)`
  },
  {id:"practical_which_for_direction", tags:["practical"], difficulty:"easy", type:"mcq",
    prompt:"Iron filings show the pattern (shape) of a magnetic field. What do you need to show the direction?",
    choices:["a thermometer","a plotting compass","a voltmeter","a stopwatch"],
    answerIndex:1,
    explanation:"A plotting compass shows direction (which way a north pole would point)."},
  {id:"practical_tap", tags:["practical"], difficulty:"easy", type:"mcq",
    prompt:"When using iron filings over a magnet, you gently tap the paper/card mainly to:",
    choices:[
      "make the magnet stronger",
      "help the filings line up with the field",
      "change the direction of the field",
      "increase the current in the magnet"
    ],
    answerIndex:1,
    explanation:"Tapping helps the iron filings move and align along the field lines."},

  // -------------------- Uniform fields --------------------
  {id:"uniform_arrangement", tags:["uniform"], difficulty:"med", type:"mcq",
    prompt:"How do you arrange two bar magnets to produce an approximately uniform field in the gap?",
    choices:[
      "North facing north, very close",
      "South facing south, very close",
      "North facing south, close together",
      "Any arrangement gives a uniform field"
    ],
    answerIndex:2,
    explanation:"Opposite poles facing with a small gap gives nearly uniform field in the gap."},
  {id:"uniform_picture", tags:["uniform"], difficulty:"med", type:"mcq",
    prompt:"Which diagram shows a uniform magnetic field between two poles?",
    choices:[
      {label:"A", svgKind:"uniformField_wrong_curved", caption:"Curved lines"},
      {label:"B", svgKind:"uniformField_wrong_notParallel", caption:"Not parallel"},
      {label:"C", svgKind:"uniformField_good", caption:"Straight, parallel, evenly spaced"},
      {label:"D", svgKind:"uniformField_wrong_arrows", caption:"Arrows wrong way"}
    ],
    answerIndex:2,
    explanation:"Uniform field is shown by straight, parallel, evenly spaced lines with arrows N → S."},

  // -------------------- Current produces magnetic field --------------------
  {id:"current_field_statement", tags:["currentfield"], difficulty:"easy", type:"mcq",
    prompt:"A current in a conductor produces:",
    choices:["no magnetic field", "a magnetic field around the conductor", "only an electric field", "sound waves directly"],
    answerIndex:1,
    explanation:"An electric current in a conductor produces a magnetic field around it."},
  {id:"current_field_shape", tags:["currentfield"], difficulty:"easy", type:"mcq",
    prompt:"What is the shape of the magnetic field around a straight current‑carrying wire?",
    choices:[
      "Straight lines parallel to the wire",
      "Concentric circles around the wire",
      "Random squiggles",
      "A single line from N to S"
    ],
    answerIndex:1,
    explanation:"Around a straight wire, the field lines are concentric circles."},
  {id:"current_field_circles_pic", tags:["currentfield"], difficulty:"easy", type:"mcq",
    prompt:"Which diagram best shows the field pattern around a straight wire?",
    choices:[
      {label:"A", svgKind:"uniformField_good", caption:"Uniform field (not a wire)"},
      {label:"B", svgKind:"wire_circles", caption:"Concentric circles"},
      {label:"C", svgKind:"barField_good", caption:"Bar magnet field"},
      {label:"D", svgKind:"uniformField_wrong_curved", caption:"Curved between poles"}
    ],
    answerIndex:1,
    explanation:"A straight wire produces concentric circular field lines around it."},
  {id:"dot_cross_meaning", tags:["currentfield"], difficulty:"med", type:"mcq",
    prompt:"In diagrams, a dot (•) in a circle usually means current is:",
    choices:["into the page","out of the page","to the left","to the right"],
    answerIndex:1,
    explanation:"A dot represents something coming out of the page (like arrow tip). A cross (×) is into the page."},
  {id:"dot_cross_pic", tags:["currentfield"], difficulty:"med", type:"mcq",
    prompt:"Which diagram shows current INTO the page?",
    choices:[
      {label:"A", svgKind:"wire_dot", caption:"• out of page"},
      {label:"B", svgKind:"wire_cross", caption:"× into page"},
      {label:"C", svgKind:"wire_circles", caption:"No current direction shown"},
      {label:"D", svgKind:"barField_good", caption:"Not a wire"}
    ],
    answerIndex:1,
    explanation:"× indicates into the page."},

  // -------------------- Motor effect: force on a wire --------------------
  {id:"motoreffect_why_force", tags:["motoreffect"], difficulty:"hard", type:"short",
    prompt:"Explain why a force acts on a current‑carrying wire placed in a magnetic field.",
    marks:4,
    markPoints:[
      {any:["current","current-carrying","wire carries a current"]},
      {any:["magnetic field around","produces a magnetic field"]},
      {any:["interact","interaction","overlap"]},
      {any:["force","exerted","push","pull"]}
    ],
    explanation:
`Mark scheme style points:
• Current in the wire produces a magnetic field around the wire.
• This field interacts with the external magnetic field.
• The magnet exerts a force on the wire (and the wire exerts an equal and opposite force on the magnet).
Avoid saying the fields “repel” — say “interact”.`
  },

  // -------------------- Left-hand rule --------------------
  {id:"fleming_labels", tags:["lefthand"], difficulty:"med", type:"mcq",
    prompt:"Fleming’s left‑hand rule: which finger represents which quantity?",
    choices:[
      "Thumb = current, First finger = force, Second finger = field",
      "Thumb = force, First finger = field, Second finger = current",
      "Thumb = field, First finger = current, Second finger = force",
      "Thumb = force, First finger = current, Second finger = field"
    ],
    answerIndex:1,
    explanation:"FBI: Thumb = Force, First finger = magnetic field (B), Second finger = current (I)."},
  {id:"fleming_symbols_ok", tags:["lefthand"], difficulty:"easy", type:"mcq",
    prompt:"In Fleming’s left‑hand rule, the magnetic field direction is from:",
    choices:["S to N","N to S","either direction, doesn’t matter","up to down only"],
    answerIndex:1,
    explanation:"Use field direction N → S."},

  // Direction of force questions (PPQ-inspired)
  {id:"force_dir_1", tags:["lefthand","motoreffect"], difficulty:"hard", type:"mcq",
    prompt:"Magnetic field is left → right. Current is up. What is the direction of force on the wire?",
    choices:["into the page","out of the page","left","right"],
    answerIndex:0,
    explanation:"Use F = I × B. Up (y) × right (x) = into the page (−z)."},
  {id:"force_dir_2", tags:["lefthand","motoreffect"], difficulty:"hard", type:"mcq",
    prompt:"Magnetic field is left → right. Current is into the page (×). What is the direction of force on the wire?",
    choices:["up","down","left","right"],
    answerIndex:1,
    explanation:"I is into page (−z). (−z) × (+x) = (−y) → down."},
  {id:"force_dir_3", tags:["lefthand","motoreffect"], difficulty:"hard", type:"mcq",
    prompt:"Magnetic field is down. Current is out of the page (•). What is the direction of force on the wire?",
    choices:["left","right","up","down"],
    answerIndex:0,
    explanation:"I is out of page (+z). (+z) × (−y) = (−x) → left."},

  // -------------------- Simple d.c. motor ideas --------------------
  {id:"motor_turns", tags:["motor"], difficulty:"hard", type:"short",
    prompt:"In a simple d.c. motor, why does the coil start to rotate?",
    marks:4,
    markPoints:[
      {any:["current","coil carries a current"]},
      {any:["magnetic field","coil produces a magnetic field","field around the wire"]},
      {any:["interact","interaction","overlap"]},
      {any:["opposite","forces on opposite sides","one up one down","turn","rotate","spins"]}
    ],
    explanation:
`Mark scheme style points:
• Current in the coil produces a magnetic field.
• This interacts with the field from the (permanent) magnet.
• A force acts on each side of the coil.
• Forces on opposite sides are in opposite directions, giving a turning effect so the coil rotates.`},
  {id:"motor_speed_up", tags:["motor","changes"], difficulty:"med", type:"mcq",
    prompt:"Which change would increase the speed of a simple d.c. motor?",
    choices:[
      "Decrease the current in the coil",
      "Use a weaker magnetic field",
      "Increase the current or use a stronger magnetic field",
      "Make the wire parallel to the field"
    ],
    answerIndex:2,
    explanation:"Force increases with current and field strength, so the turning effect is bigger and the motor spins faster."},

  // -------------------- Loudspeakers --------------------
  {id:"speaker_how_sound", tags:["speaker"], difficulty:"hard", type:"short",
    prompt:"Describe how a simple loudspeaker produces sound (coil connected to an a.c. supply).",
    marks:6,
    markPoints:[
      {any:["current in coil","a.c.","alternating current"]},
      {any:["coil produces","magnetic field"]},
      {any:["interact","interaction","overlap"]},
      {any:["force","on the coil","on the cone"]},
      {any:["changes direction","alternating force","reverses"]},
      {any:["vibrate","cone vibrates","air vibrates","sound","longitudinal"]}
    ],
    explanation:
`Mark scheme style points (any 5–6):
• a.c. flows in the coil.
• Coil/current produces a magnetic field.
• Field of coil interacts with the permanent magnet’s field.
• Force acts on the coil/cone (motor effect).
• Because the current changes direction, the force changes direction.
• Cone vibrates back and forth, making air vibrate → sound (longitudinal wave).`
  },
  {id:"speaker_why_ac", tags:["speaker"], difficulty:"med", type:"mcq",
    prompt:"Why is an a.c. supply used in a loudspeaker (rather than d.c.)?",
    choices:[
      "a.c. makes the magnet stronger",
      "a.c. changes direction, so the force reverses and the cone vibrates",
      "d.c. cannot produce a magnetic field",
      "d.c. makes sound louder"
    ],
    answerIndex:1,
    explanation:"With a.c., current reverses, so force reverses and the cone vibrates to make sound. With d.c. it would push one way and stop."},
  {id:"ac_dc_difference", tags:["speaker","units"], difficulty:"easy", type:"mcq",
    prompt:"Which statement correctly compares a.c. and d.c.?",
    choices:[
      "a.c. flows in one direction only; d.c. changes direction",
      "a.c. changes direction repeatedly; d.c. flows in one direction only",
      "both always change direction",
      "both always flow in one direction"
    ],
    answerIndex:1,
    explanation:"a.c. changes direction repeatedly; d.c. is one direction only."},

  // -------------------- How force changes --------------------
  {id:"force_bigger", tags:["changes"], difficulty:"easy", type:"mcq",
    prompt:"If current increases (same magnetic field), the force on the wire:",
    choices:["increases","decreases","stays the same","becomes zero"],
    answerIndex:0,
    explanation:"Force increases with current (bigger current → stronger interaction)."},
  {id:"force_bfield_bigger", tags:["changes"], difficulty:"easy", type:"mcq",
    prompt:"If the magnetic field strength increases (same current), the force on the wire:",
    choices:["increases","decreases","stays the same","reverses direction"],
    answerIndex:0,
    explanation:"Force increases with field strength."},
  {id:"force_reverse_current", tags:["changes"], difficulty:"med", type:"mcq",
    prompt:"If the current direction reverses (same field direction), the force on the wire:",
    choices:["reverses direction","stays the same direction","becomes zero","becomes infinite"],
    answerIndex:0,
    explanation:"Reversing current reverses the force direction."},
  {id:"force_reverse_field", tags:["changes"], difficulty:"med", type:"mcq",
    prompt:"If the magnetic field direction reverses (same current direction), the force on the wire:",
    choices:["reverses direction","stays the same direction","becomes zero","does not change"],
    answerIndex:0,
    explanation:"Reversing the field direction reverses the force direction."},
  {"id": "piv_power_var1", "tags": ["units"], "difficulty": "med", "type": "numeric", "prompt": "A circuit takes 0.2 A at 6 V. Calculate the power.", "answer": 1.2000000000000002, "unitHint": "W", "explanation": "Use P = IV.\nP = 0.2 × 6 = 1.2000000000000002 W."},
  {"id": "piv_power_var2", "tags": ["units"], "difficulty": "med", "type": "numeric", "prompt": "A circuit takes 0.35 A at 9 V. Calculate the power.", "answer": 3.15, "unitHint": "W", "explanation": "Use P = IV.\nP = 0.35 × 9 = 3.15 W."},
  {"id": "piv_power_var3", "tags": ["units"], "difficulty": "med", "type": "numeric", "prompt": "A circuit takes 0.08 A at 3.0 V. Calculate the power.", "answer": 0.24, "unitHint": "W", "explanation": "Use P = IV.\nP = 0.08 × 3.0 = 0.24 W."},
  {"id": "piv_power_var4", "tags": ["units"], "difficulty": "med", "type": "numeric", "prompt": "A circuit takes 0.5 A at 1.5 V. Calculate the power.", "answer": 0.75, "unitHint": "W", "explanation": "Use P = IV.\nP = 0.5 × 1.5 = 0.75 W."},
  {"id": "piv_power_var5", "tags": ["units"], "difficulty": "med", "type": "numeric", "prompt": "A circuit takes 0.12 A at 12 V. Calculate the power.", "answer": 1.44, "unitHint": "W", "explanation": "Use P = IV.\nP = 0.12 × 12 = 1.44 W."},
  {"id": "units_which_not_in_list", "tags": ["units"], "difficulty": "easy", "type": "mcq", "prompt": "Which unit is NOT required for Topic 6 (Magnetism & electromagnetism) in this course?", "choices": ["ampere (A)", "volt (V)", "watt (W)", "ohm (Ω)"], "answerIndex": 3, "explanation": "Topic 6 specifies A, V and W. (Ω is used in electricity, not listed here.)"},
  {"id": "mfl_imaginary", "tags": ["fieldlines"], "difficulty": "easy", "type": "short", "prompt": "Magnetic field lines are real objects you can hold. True or false? Explain briefly.", "marks": 2, "markPoints": [{"any": ["false", "not real", "imaginary"]}, {"any": ["represent", "show", "model", "indicate"]}], "explanation": "False. Field lines are imaginary lines we draw to represent the field (direction/strength), not physical lines."},
  {"id": "mfl_missing_arrows", "tags": ["fieldlines"], "difficulty": "med", "type": "mcq", "prompt": "A student draws field lines around a bar magnet but forgets the arrows. What is missing from the diagram?", "choices": ["Nothing — arrows are optional", "The direction of the magnetic field", "The strength of the magnetic field", "The magnet’s poles"], "answerIndex": 1, "explanation": "Arrows show direction (N → S outside the magnet). Without arrows, direction is missing."},
  {"id": "mfl_spacing_meaning", "tags": ["fieldlines"], "difficulty": "med", "type": "mcq", "prompt": "Field lines are much closer together near the poles of a bar magnet. This means:", "choices": ["The field is weaker there", "The field is stronger there", "The field changes from a.c. to d.c.", "The magnet has no poles"], "answerIndex": 1, "explanation": "Closer spacing means stronger magnetic field."},
  {"id": "mfl_rules_three", "tags": ["fieldlines"], "difficulty": "hard", "type": "short", "prompt": "Give three correct rules for drawing magnetic field lines around a bar magnet.", "marks": 3, "markPoints": [{"any": ["n to s", "north to south", "from north", "to south"]}, {"any": ["never cross", "do not cross", "never touch", "don’t cross"]}, {"any": ["continuous", "join to the magnet", "touch the magnet", "reach the magnet", "not broken"]}], "explanation": "Examples of valid rules:\n• Arrows show N → S outside the magnet.\n• Lines must be continuous and meet the magnet.\n• Lines must not cross (field has one direction at a point).\n• Closer lines indicate stronger field."},
  {"id": "practical_between_two", "tags": ["practical"], "difficulty": "hard", "type": "short", "prompt": "Describe how you could compare the field pattern between two bar magnets when the poles are (i) unlike, (ii) like.", "marks": 6, "markPoints": [{"any": ["paper", "card"]}, {"any": ["two magnets", "bar magnets"]}, {"any": ["iron filings", "sprinkle", "tap", "shake"]}, {"any": ["compass", "plotting compass"]}, {"any": ["unlike", "n and s", "attract"]}, {"any": ["like", "n and n", "s and s", "repel"]}], "explanation": "Method ideas:\n• Place the two magnets under paper/card in the chosen arrangement.\n• Sprinkle iron filings and tap to show the pattern.\n• Use a plotting compass to add arrows/direction.\n• Repeat for unlike poles facing, then like poles facing, and compare the patterns."},
  {"id": "practical_direction_only_compass", "tags": ["practical"], "difficulty": "easy", "type": "mcq", "prompt": "Which method gives the direction of the magnetic field at a point most directly?", "choices": ["Iron filings only", "Plotting compass", "Ruler", "Stopwatch"], "answerIndex": 1, "explanation": "A plotting compass points along the magnetic field direction."},
  {"id": "uniform_define", "tags": ["uniform"], "difficulty": "med", "type": "short", "prompt": "Define a uniform magnetic field.", "marks": 2, "markPoints": [{"any": ["same strength", "constant strength", "equal strength"]}, {"any": ["all points", "everywhere", "throughout", "same at all points"]}], "explanation": "Uniform magnetic field: same strength (and direction) at all points in the region."},
  {"id": "uniform_spacing", "tags": ["uniform"], "difficulty": "med", "type": "mcq", "prompt": "In a uniform magnetic field diagram, the field lines should be:", "choices": ["curved and closer near one side", "straight, parallel and evenly spaced", "randomly spaced", "crossing each other"], "answerIndex": 1, "explanation": "Uniform field is shown by straight, parallel, equally spaced lines."},
  {"id": "two_magnets_attract_pic", "tags": ["uniform", "practical"], "difficulty": "med", "type": "mcq", "prompt": "Which diagram best matches two magnets arranged to produce attraction (unlike poles facing in the gap)?", "choices": [{"label": "A", "svgKind": "twoMagnets_repel", "caption": "Like poles facing"}, {"label": "B", "svgKind": "twoMagnets_attract", "caption": "Unlike poles facing"}, {"label": "C", "svgKind": "uniformField_wrong_notParallel", "caption": "Not uniform"}, {"label": "D", "svgKind": "barField_wrong_cross", "caption": "Crossing lines"}], "answerIndex": 1, "explanation": "Unlike poles facing → many field lines connect across the gap (attraction)."},
  {"id": "two_magnets_repel_pic", "tags": ["uniform", "practical"], "difficulty": "med", "type": "mcq", "prompt": "Which diagram best matches two magnets arranged to produce repulsion (like poles facing)?", "choices": [{"label": "A", "svgKind": "twoMagnets_repel", "caption": "Like poles facing"}, {"label": "B", "svgKind": "twoMagnets_attract", "caption": "Unlike poles facing"}, {"label": "C", "svgKind": "uniformField_good", "caption": "Uniform field"}, {"label": "D", "svgKind": "barField_good", "caption": "Single magnet"}], "answerIndex": 0, "explanation": "Like poles facing → field lines bow out; weak field region in the gap (repulsion)."},
  {"id": "rhgrip_thumb", "tags": ["currentfield"], "difficulty": "med", "type": "short", "prompt": "State the right-hand grip rule for a straight current-carrying wire.", "marks": 3, "markPoints": [{"any": ["right hand", "grip", "thumb"]}, {"any": ["thumb", "current"]}, {"any": ["fingers", "field", "circles", "direction of field"]}], "explanation": "Right-hand grip rule:\n• Point your right thumb in the direction of conventional current.\n• Your curled fingers show the direction of the magnetic field (circles around the wire)."},
  {"id": "conventional_current", "tags": ["currentfield"], "difficulty": "easy", "type": "mcq", "prompt": "In the right-hand grip rule, the thumb points in the direction of current. Which current direction is used?", "choices": ["Electron flow (− to +)", "Conventional current (+ to −)", "Either, it never matters", "No direction is needed"], "answerIndex": 1, "explanation": "Use conventional current: from positive to negative."},
  {"id": "field_dir_dot", "tags": ["currentfield"], "difficulty": "hard", "type": "mcq", "prompt": "A wire carries current out of the page (•). Looking at the page, the magnetic field direction is:", "choices": ["clockwise", "anticlockwise", "straight up", "straight down"], "answerIndex": 1, "explanation": "Right-hand rule: thumb out of page, fingers curl anticlockwise."},
  {"id": "field_dir_cross", "tags": ["currentfield"], "difficulty": "hard", "type": "mcq", "prompt": "A wire carries current into the page (×). Looking at the page, the magnetic field direction is:", "choices": ["clockwise", "anticlockwise", "left", "right"], "answerIndex": 0, "explanation": "Right-hand rule: thumb into page, fingers curl clockwise."},
  {"id": "motoreffect_wording", "tags": ["motoreffect"], "difficulty": "med", "type": "mcq", "prompt": "Which phrase is best in an exam explanation of why the wire experiences a force?", "choices": ["The fields repel each other", "The wire’s field interacts with the magnet’s field", "The current is attracted to the magnet", "Induction pushes the wire"], "answerIndex": 1, "explanation": "Use “interacts” rather than “repels”. Induction is a different topic."},
  {"id": "newton3_pair", "tags": ["motoreffect"], "difficulty": "hard", "type": "short", "prompt": "What can you say about the forces between the wire and the magnet when the wire experiences a force?", "marks": 2, "markPoints": [{"any": ["equal", "same size", "equal magnitude"]}, {"any": ["opposite", "opposite direction"]}], "explanation": "If the magnet exerts a force on the wire, the wire exerts an equal and opposite force on the magnet (Newton’s third law)."},
  {"id": "force_zero_parallel", "tags": ["changes", "motoreffect"], "difficulty": "med", "type": "mcq", "prompt": "A wire carries current in a magnetic field. When is the force on the wire greatest?", "choices": ["Wire parallel to field", "Wire perpendicular to field", "Wire at 45° to field gives zero force", "It doesn’t depend on angle"], "answerIndex": 1, "explanation": "Force is greatest when current is perpendicular to the field; it is zero when parallel."},
  {"id": "force_zero_parallel2", "tags": ["changes", "motoreffect"], "difficulty": "med", "type": "mcq", "prompt": "A wire is placed parallel to the magnetic field lines and carries a current. The force on it is:", "choices": ["maximum", "zero (or very small)", "reversed", "random"], "answerIndex": 1, "explanation": "If the wire/current is parallel to the field, the motor-effect force is zero."},
  {"id": "force_dir_extra_1", "tags": ["lefthand", "motoreffect"], "difficulty": "hard", "type": "mcq", "prompt": "Magnetic field is right. Current is down. Force is:", "choices": ["out of the page", "into the page", "left", "right"], "answerIndex": 0, "explanation": "Use Fleming’s left-hand rule (FBI).\nDown (−y) × right (+x) = out of the page (+z)."},
  {"id": "force_dir_extra_2", "tags": ["lefthand", "motoreffect"], "difficulty": "hard", "type": "mcq", "prompt": "Magnetic field is up. Current is right. Force is:", "choices": ["into the page", "out of the page", "up", "down"], "answerIndex": 1, "explanation": "Use Fleming’s left-hand rule (FBI).\nRight (+x) × up (+y) = out of the page (+z). (So out.)"},
  {"id": "force_dir_extra_3", "tags": ["lefthand", "motoreffect"], "difficulty": "hard", "type": "mcq", "prompt": "Magnetic field is up. Current is into the page (×). Force is:", "choices": ["left", "right", "up", "down"], "answerIndex": 1, "explanation": "Use Fleming’s left-hand rule (FBI).\nI into page (−z): (−z) × (+y) = (+x) → right."},
  {"id": "force_dir_extra_4", "tags": ["lefthand", "motoreffect"], "difficulty": "hard", "type": "mcq", "prompt": "Magnetic field is down. Current is left. Force is:", "choices": ["into the page", "out of the page", "up", "down"], "answerIndex": 0, "explanation": "Use Fleming’s left-hand rule (FBI).\nLeft (−x) × down (−y) = into the page (−z)."},
  {"id": "force_dir_extra_5", "tags": ["lefthand", "motoreffect"], "difficulty": "hard", "type": "mcq", "prompt": "Magnetic field is into the page (×). Current is up. Force is:", "choices": ["left", "right", "into the page", "out of the page"], "answerIndex": 0, "explanation": "Use Fleming’s left-hand rule (FBI).\nUp (+y) × into page (−z) = left (−x)."},
  {"id": "force_dir_extra_6", "tags": ["lefthand", "motoreffect"], "difficulty": "hard", "type": "mcq", "prompt": "Magnetic field is out of the page (•). Current is right. Force is:", "choices": ["up", "down", "left", "right"], "answerIndex": 1, "explanation": "Use Fleming’s left-hand rule (FBI).\nRight (+x) × out of page (+z) = down (−y)."},
  {"id": "force_dir_extra_7", "tags": ["lefthand", "motoreffect"], "difficulty": "hard", "type": "mcq", "prompt": "Magnetic field is left. Current is out of the page (•). Force is:", "choices": ["up", "down", "into the page", "out of the page"], "answerIndex": 0, "explanation": "Use Fleming’s left-hand rule (FBI).\nOut (+z) × left (−x) = up (+y)."},
  {"id": "force_dir_extra_8", "tags": ["lefthand", "motoreffect"], "difficulty": "hard", "type": "mcq", "prompt": "Magnetic field is into the page (×). Current is left. Force is:", "choices": ["up", "down", "left", "right"], "answerIndex": 0, "explanation": "Use Fleming’s left-hand rule (FBI).\nLeft (−x) × into page (−z) = up (+y)."},
  {"id": "motor_reverse_current", "tags": ["motor", "changes"], "difficulty": "med", "type": "mcq", "prompt": "To reverse the direction a d.c. motor turns, you can:", "choices": ["reverse the current direction", "reverse the magnetic field direction", "either of these", "none of these"], "answerIndex": 2, "explanation": "Reversing current or field reverses the direction of the forces, so the motor turns the other way."},
  {"id": "motor_increase_speed", "tags": ["motor", "changes"], "difficulty": "med", "type": "short", "prompt": "Give two ways to increase the turning effect (and speed) of a simple d.c. motor.", "marks": 2, "markPoints": [{"any": ["increase current", "more current", "higher current"]}, {"any": ["stronger field", "increase magnetic field", "move magnets closer", "stronger magnet"]}], "explanation": "Two valid methods:\n• Increase the current in the coil.\n• Increase the magnetic field strength (stronger magnets / magnets closer).\n(Other specs might also allow more turns of wire.)"},
  {"id": "motor_no_force_ends", "tags": ["motor"], "difficulty": "hard", "type": "short", "prompt": "In a simple coil motor, why do the parts of the coil parallel to the magnetic field experience little/no force?", "marks": 2, "markPoints": [{"any": ["parallel", "same direction"]}, {"any": ["no force", "zero force", "force is zero", "greatest when perpendicular"]}], "explanation": "Motor effect is greatest when current is perpendicular to the magnetic field. When the wire is parallel to the field, the force is zero (or very small)."},
  {"id": "speaker_dc_effect", "tags": ["speaker"], "difficulty": "med", "type": "mcq", "prompt": "If you connect a loudspeaker coil to a d.c. supply, the cone will most likely:", "choices": ["vibrate back and forth continuously", "move one way and stay there", "not move because d.c. gives no force", "spin in circles"], "answerIndex": 1, "explanation": "With d.c. the current is steady, so force is steady: the cone moves to a new position and stops (no vibration)."},
  {"id": "speaker_louder", "tags": ["speaker", "changes"], "difficulty": "med", "type": "short", "prompt": "How could you make a loudspeaker produce a louder sound using the same speaker? Give one change and explain.", "marks": 3, "markPoints": [{"any": ["increase current", "larger current", "increase amplitude", "higher current"]}, {"any": ["bigger force", "greater force"]}, {"any": ["bigger vibration", "greater amplitude", "cone moves more", "air vibrates more"]}], "explanation": "Increase the current (amplitude of the a.c.). Larger current → larger force on the coil → cone vibrates with bigger amplitude → louder sound."},
  {"id": "speaker_direction_change", "tags": ["speaker"], "difficulty": "easy", "type": "mcq", "prompt": "In a loudspeaker, the force on the coil changes direction because:", "choices": ["the magnet swaps poles", "the a.c. current reverses direction", "the coil becomes non-magnetic", "the cone is made of iron"], "answerIndex": 1, "explanation": "a.c. reverses direction, so the motor-effect force reverses direction."},
  {"id": "force_more_if_more_current", "tags": ["changes"], "difficulty": "easy", "type": "mcq", "prompt": "If the current doubles (same field), the force on the wire will:", "choices": ["double", "halve", "stay the same", "reverse"], "answerIndex": 0, "explanation": "Force increases with current. If current doubles, force increases (approximately doubles)."},
  {"id": "force_more_if_more_field", "tags": ["changes"], "difficulty": "easy", "type": "mcq", "prompt": "If the magnets are moved closer together (same current), the force on the wire will:", "choices": ["increase", "decrease", "stay the same", "reverse"], "answerIndex": 0, "explanation": "Moving magnets closer increases field strength, so force increases."},
  {"id": "reverse_both", "tags": ["changes"], "difficulty": "med", "type": "mcq", "prompt": "If you reverse BOTH the current direction and the magnetic field direction, the force direction will:", "choices": ["reverse", "stay the same", "become zero", "become random"], "answerIndex": 1, "explanation": "Reversing either one reverses the force. Reversing both gives two reversals, so the force stays the same direction."},
  {"id": "mfl_crossing_reason", "tags": ["fieldlines"], "difficulty": "easy", "type": "mcq", "prompt": "Field lines must not cross because:", "choices": ["crossing makes the field stronger", "a compass would point in two directions at once", "magnets would lose their poles", "it wastes magnetic field"], "answerIndex": 1, "explanation": "At any point the field has one direction; crossing implies two directions."},
  {"id": "mfl_arrow_direction", "tags": ["fieldlines"], "difficulty": "easy", "type": "mcq", "prompt": "In a field diagram, an arrow on a field line shows:", "choices": ["where the magnet will move", "the direction a north pole would be forced", "the direction electrons flow", "the temperature of the field"], "answerIndex": 1, "explanation": "Field direction is defined as the direction of force on a north pole."},
  {"id": "identify_poles_from_lines", "tags": ["fieldlines"], "difficulty": "med", "type": "mcq", "prompt": "You see field lines outside a bar magnet drawn with arrows pointing left → right across the top. Which end is the NORTH pole?", "choices": ["Left end", "Right end", "Cannot tell from arrows", "Neither end"], "answerIndex": 0, "explanation": "Outside a magnet, field lines go N → S. If arrows go left → right, left end must be N and right end S."},
  {"id": "mfl_near_poles_stronger", "tags": ["fieldlines"], "difficulty": "easy", "type": "mcq", "prompt": "Where is the magnetic field usually strongest for a bar magnet?", "choices": ["Near the middle", "Near the poles", "Everywhere equal", "Outside only, never near magnet"], "answerIndex": 1, "explanation": "Field is strongest near the poles (field lines densest there)."},
  {"id": "practical_one_field_line", "tags": ["practical"], "difficulty": "hard", "type": "short", "prompt": "Using a plotting compass, how do you draw ONE magnetic field line around a bar magnet?", "marks": 5, "markPoints": [{"any": ["place magnet under", "magnet under paper", "paper", "card"]}, {"any": ["compass", "plotting compass"]}, {"any": ["mark", "dot", "mark the direction"]}, {"any": ["move", "move compass", "move the compass", "tail of compass", "move to end of arrow"]}, {"any": ["repeat", "repeat many times", "join", "smooth line", "draw a line"]}], "explanation": "Compass method (one line):\n• Put magnet under paper.\n• Place compass near magnet; mark the direction of the needle.\n• Move the compass so its tail sits at the previous mark.\n• Mark the new direction.\n• Repeat and join marks to make a smooth arrowed field line."},
  {"id": "uniform_why_lines", "tags": ["uniform"], "difficulty": "med", "type": "short", "prompt": "Why are the lines drawn straight and equally spaced for a uniform field?", "marks": 2, "markPoints": [{"any": ["same strength", "constant strength"]}, {"any": ["same direction", "parallel", "direction is constant"]}], "explanation": "Uniform field means the field has the same direction and strength everywhere. Straight parallel lines show constant direction; equal spacing shows constant strength."},
  {"id": "wire_field_stronger", "tags": ["currentfield", "changes"], "difficulty": "easy", "type": "mcq", "prompt": "How can you make the magnetic field around a straight wire stronger (using the same wire)?", "choices": ["Decrease current", "Increase current", "Reverse current", "Make wire longer"], "answerIndex": 1, "explanation": "Bigger current produces a stronger magnetic field around the wire."},
  {"id": "rhgrip_clockwise", "tags": ["currentfield"], "difficulty": "med", "type": "mcq", "prompt": "If the current is upwards in a vertical wire, looking from above, the field circles are:", "choices": ["clockwise", "anticlockwise", "straight up", "random"], "answerIndex": 1, "explanation": "Right-hand rule: thumb up; fingers curl anticlockwise when viewed from above (depends on viewpoint, but standard convention: looking along current, fingers show field direction)."},
  {"id": "motoreffect_reverse", "tags": ["changes", "motoreffect"], "difficulty": "easy", "type": "short", "prompt": "A wire in a magnetic field experiences an upward force. If the current is reversed, what happens to the force?", "marks": 1, "markPoints": [{"any": ["reverses", "opposite", "down"]}], "explanation": "Reversing the current reverses the direction of the force (Fleming’s left-hand rule)."},
  {"id": "lefthand_perpendicular", "tags": ["lefthand", "motoreffect"], "difficulty": "med", "type": "mcq", "prompt": "Fleming’s left-hand rule applies when the wire is:", "choices": ["parallel to the magnetic field", "perpendicular to the magnetic field", "in a field of zero strength", "not carrying current"], "answerIndex": 1, "explanation": "The motor-effect force is for current perpendicular to the magnetic field (maximum at 90°)."},
  {"id": "motor_reverse_field", "tags": ["motor", "changes"], "difficulty": "med", "type": "mcq", "prompt": "If you swap the poles of the permanent magnets in a motor (reverse the field), the motor’s direction of rotation will:", "choices": ["stay the same", "reverse", "stop completely", "double its speed"], "answerIndex": 1, "explanation": "Reversing the magnetic field reverses the forces on the coil, so rotation reverses."},
  {"id": "speaker_need_magnet", "tags": ["speaker"], "difficulty": "med", "type": "short", "prompt": "Why does a loudspeaker include a permanent magnet?", "marks": 2, "markPoints": [{"any": ["magnetic field", "field"]}, {"any": ["interact", "interaction", "force", "motor effect"]}], "explanation": "The permanent magnet provides an external magnetic field. The coil’s field interacts with it so a force acts on the coil (motor effect)."},
  {"id": "unit_case_A", "tags": ["units"], "difficulty": "easy", "type": "mcq", "prompt": "Which unit is correctly written for current?", "choices": ["a", "A", "amps", "Amps"], "answerIndex": 1, "explanation": "The correct symbol is A (case matters)."},
  {"id": "mfl_continuous", "tags": ["fieldlines"], "difficulty": "med", "type": "mcq", "prompt": "A student draws field lines that stop in empty space (they don’t reach the magnet). What’s wrong?", "choices": ["Nothing", "Field lines should be continuous and meet the magnet", "Arrows should point S→N", "Spacing should be random"], "answerIndex": 1, "explanation": "In diagrams, field lines should form continuous paths and meet the magnet (no broken gaps)."}

];
