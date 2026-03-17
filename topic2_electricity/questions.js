window.ELECTRICITY_QUIZ_META = {
  title: "Unit 2 Quiz",
  subtitle: "Electricity • random sets • mark-scheme style feedback"
};

window.ELECTRICITY_QUIZ_QUESTIONS = [
  {id:"units_current", tags:["units"], difficulty:"easy", type:"mcq",
    prompt:"Which is the unit of current?",
    choices:["volt (V)","ampere (A)","ohm (Ω)","watt (W)"],
    answerIndex:1,
    explanation:"Current is measured in amperes (A)."},
  {id:"units_voltage", tags:["units"], difficulty:"easy", type:"mcq",
    prompt:"Which is the unit of potential difference (voltage)?",
    choices:["ampere (A)","volt (V)","coulomb (C)","watt (W)"],
    answerIndex:1,
    explanation:"Potential difference is measured in volts (V)."},
  {id:"units_resistance", tags:["units"], difficulty:"easy", type:"mcq",
    prompt:"Which is the unit of resistance?",
    choices:["ampere (A)","ohm (Ω)","volt (V)","watt (W)"],
    answerIndex:1,
    explanation:"Resistance is measured in ohms (Ω)."},
  {id:"units_power", tags:["units","mains"], difficulty:"easy", type:"mcq",
    prompt:"Which is the unit of power?",
    choices:["joule (J)","watt (W)","coulomb (C)","ohm (Ω)"],
    answerIndex:1,
    explanation:"Power is measured in watts (W)."},
  {id:"units_charge", tags:["units"], difficulty:"easy", type:"mcq",
    prompt:"Which is the unit of charge (even though you won't usually calculate with it here)?",
    choices:["coulomb (C)","current (A)","volt (V)","newton (N)"],
    answerIndex:0,
    explanation:"Charge is measured in coulombs (C)."},
  {id:"mains_acdc", tags:["mains"], difficulty:"easy", type:"mcq",
    prompt:"Mains electricity in a house is usually:",
    choices:[
      "direct current (d.c.) that flows in one direction only",
      "alternating current (a.c.) that changes direction periodically",
      "a current that is always zero",
      "a current that only flows when the plug is upside down"
    ],
    answerIndex:1,
    explanation:"Mains is a.c.: it repeatedly changes direction. Cells/batteries supply d.c. (one direction)."},
  {id:"mains_dc_cell", tags:["mains"], difficulty:"easy", type:"mcq",
    prompt:"A cell/battery supplies:",
    choices:["a.c. (changes direction)","d.c. (one direction)","no current ever","only voltage, not current"],
    answerIndex:1,
    explanation:"Cells/batteries supply d.c.: current flows in one direction only."},
  {id:"piv_formula", tags:["mains"], difficulty:"easy", type:"short",
    prompt:"State the formula linking power, current and voltage.",
    expectedSymbolic:["P=IV","P=VI"],
    marks:1,
    markPoints:[{any:["p=iv","p = iv","power = current x voltage","power = current × voltage","power = voltage x current","p = i × v"]}],
    explanation:"Expected: P = IV."},

  {id:"piv_current_gen", tags:["mains"], difficulty:"med", type:"numeric", generator:{name:"genPIV_Current"}},
  {id:"piv_power_gen", tags:["mains"], difficulty:"med", type:"numeric", generator:{name:"genPIV_Power"}},
  {id:"ohms_current_gen", tags:["series"], difficulty:"med", type:"numeric", generator:{name:"genOhms_Current"}},
  {id:"ohms_voltage_gen", tags:["series"], difficulty:"med", type:"numeric", generator:{name:"genOhms_Voltage"}},
  {id:"series_two_res_gen", tags:["series"], difficulty:"hard", type:"numeric", generator:{name:"genSeriesTwoResistors"}},

  {id:"sym_cell", tags:["symbols"], difficulty:"easy", type:"mcq",
    prompt:"Which symbol is a cell (one cell)?",
    choices:[
      {label:"A", symbolKind:"battery"},
      {label:"B", symbolKind:"cell"},
      {label:"C", symbolKind:"lamp"},
      {label:"D", symbolKind:"resistor"}
    ],
    answerIndex:1,
    explanation:"A cell is one long and one short line. A battery is multiple cells."},
  {id:"sym_battery", tags:["symbols"], difficulty:"easy", type:"mcq",
    prompt:"Which symbol is a battery (more than one cell)?",
    choices:[
      {label:"A", symbolKind:"battery"},
      {label:"B", symbolKind:"cell"},
      {label:"C", symbolKind:"switch"},
      {label:"D", symbolKind:"varres"}
    ],
    answerIndex:0,
    explanation:"A battery is drawn as multiple long/short pairs (several cells in series)."},
  {id:"sym_resistor", tags:["symbols"], difficulty:"easy", type:"mcq",
    prompt:"Which symbol is a fixed resistor?",
    choices:[
      {label:"A", symbolKind:"resistor"},
      {label:"B", symbolKind:"lamp"},
      {label:"C", symbolKind:"cell"},
      {label:"D", symbolKind:"switch"}
    ],
    answerIndex:0,
    explanation:"A fixed resistor is usually a rectangle (GCSE/IGCSE) or zigzag (some specs)."},
  {id:"sym_varres", tags:["symbols"], difficulty:"med", type:"mcq",
    prompt:"Which symbol is a variable resistor?",
    choices:[
      {label:"A", symbolKind:"resistor"},
      {label:"B", symbolKind:"varres"},
      {label:"C", symbolKind:"lamp"},
      {label:"D", symbolKind:"battery"}
    ],
    answerIndex:1,
    explanation:"Variable resistor = resistor with a diagonal arrow through it."},
  {id:"sym_led", tags:["symbols"], difficulty:"med", type:"mcq",
    prompt:"Which symbol is an LED?",
    choices:[
      {label:"A", symbolKind:"lamp"},
      {label:"B", symbolKind:"resistor"},
      {label:"C", symbolKind:"led"},
      {label:"D", symbolKind:"cell"}
    ],
    answerIndex:2,
    explanation:"LED symbol is a diode with arrows showing light coming out."},

  {id:"meters_ammeter", tags:["meters"], difficulty:"easy", type:"mcq",
    prompt:"To measure the current through a component, the ammeter is connected:",
    choices:["in parallel with the component","in series with the component","across the power supply only","anywhere, it makes no difference"],
    answerIndex:1,
    explanation:"An ammeter measures current through it, so it must be placed in series."},
  {id:"meters_voltmeter", tags:["meters"], difficulty:"easy", type:"mcq",
    prompt:"To measure the voltage across a component, the voltmeter is connected:",
    choices:["in series with the component","in parallel with the component","in the power supply wire only","across a switch"],
    answerIndex:1,
    explanation:"A voltmeter measures potential difference across it, so it must be in parallel."},

  {id:"series_current_same", tags:["series"], difficulty:"easy", type:"mcq",
    prompt:"In a series circuit, the current is:",
    choices:["different in each component","the same everywhere","only present in the power supply","zero at the end"],
    answerIndex:1,
    explanation:"In series, the current is the same through every component."},
  {id:"series_voltage_add", tags:["series"], difficulty:"med", type:"mcq",
    prompt:"In a series circuit, the voltages across components:",
    choices:["are all the same","add up to the supply voltage","are always zero","only exist across resistors"],
    answerIndex:1,
    explanation:"In series, voltages across components add to the supply voltage."},
  {id:"series_more_components", tags:["series"], difficulty:"med", type:"mcq",
    prompt:"You add another resistor in series (same supply voltage). What happens to current?",
    choices:["increases","decreases","stays the same","becomes infinite"],
    answerIndex:1,
    explanation:"More resistance in series → larger total resistance → I = V/R decreases."},

  {id:"ohms_law_state", tags:["series","definitions"], difficulty:"easy", type:"short",
    prompt:"State the formula linking voltage, current and resistance.",
    expectedSymbolic:["V=IR","V=RI"],
    marks:1,
    markPoints:[{any:["v=ir","v = ir","voltage = current x resistance","voltage = current × resistance","v = i × r"]}],
    explanation:"Expected: V = IR."},
  {id:"def_current", tags:["definitions"], difficulty:"med", type:"short",
    prompt:"Define electric current.",
    marks:2,
    markPoints:[
      {any:["rate of flow","per second","each second","every second","rate"]},
      {any:["charge","flow of charge","charge passing","charge that flows"]}
    ],
    explanation:"Current is the rate of flow of charge (charge passing a point each second)."},
  {id:"def_resistance", tags:["definitions"], difficulty:"med", type:"short",
    prompt:"Define resistance (in terms of V and I).",
    expectedSymbolic:["R=V/I"],
    marks:1,
    markPoints:[{any:["r=v/i","r = v / i","resistance = voltage/current","ratio of voltage to current"]}],
    explanation:"Resistance is defined by R = V / I."},
  {id:"def_electrons", tags:["definitions"], difficulty:"easy", type:"mcq",
    prompt:"In solid metallic conductors, the current is a flow of:",
    choices:["positively charged ions","negatively charged electrons","neutral atoms","photons"],
    answerIndex:1,
    explanation:"In metals, the charge carriers are electrons (negative)."},

  {id:"indicator_lamp", tags:["indicator"], difficulty:"easy", type:"mcq",
    prompt:"Why can a lamp (or LED) be used to indicate a current is flowing?",
    choices:[
      "Because it stores charge",
      "Because it lights up when current passes through it",
      "Because it increases the voltage",
      "Because it makes resistance zero"
    ],
    answerIndex:1,
    explanation:"If a lamp/LED lights, current must be flowing through it (it can act as an indicator)."},

  {id:"led_orientation", tags:["symbols"], difficulty:"med", type:"mcq",
    prompt:"To light an LED in a simple circuit with a cell, which connection is correct?",
    choices:[
      "Anode to negative, cathode to positive",
      "Either way round works",
      "Anode to positive, cathode to negative",
      "Connect it in parallel with the cell only"
    ],
    answerIndex:2,
    explanation:"An LED is a diode: it only conducts in one direction. Anode to +, cathode to −."},

  {id:"iv_pick_filament", tags:["iv"], difficulty:"hard", type:"mcq",
    prompt:"Which I–V graph best matches a filament lamp?",
    choices:[
      {label:"A", graphKind:"ohmic", caption:"Straight line (ohmic)"},
      {label:"B", graphKind:"filament", caption:"Rising, becoming less steep"},
      {label:"C", graphKind:"diode", caption:"Threshold then steep rise"},
      {label:"D", graphKind:"curveUp", caption:"Becoming more steep"}
    ],
    answerIndex:1,
    explanation:"Filament lamp: as V increases, I increases but not proportionally; resistance increases as the filament heats."},
  {id:"iv_pick_resistor", tags:["iv"], difficulty:"med", type:"mcq",
    prompt:"Which I–V graph best matches a fixed resistor (ohmic conductor)?",
    choices:[
      {label:"A", graphKind:"diode", caption:"Threshold then steep rise"},
      {label:"B", graphKind:"filament", caption:"Rising, less steep"},
      {label:"C", graphKind:"ohmic", caption:"Straight line through origin"},
      {label:"D", graphKind:"flat", caption:"Almost no current"}
    ],
    answerIndex:2,
    explanation:"Ohmic resistor: I is proportional to V (at constant temperature), so a straight line through the origin."},
  {id:"iv_resistance_filament", tags:["iv"], difficulty:"med", type:"mcq",
    prompt:"As the voltage across a filament lamp increases, its resistance usually:",
    choices:["stays constant","decreases","increases","becomes zero"],
    answerIndex:2,
    explanation:"The filament heats up, so resistance increases. That's why the I–V curve is not a straight line."},

  {id:"iv_practical_method", tags:["practical","iv"], difficulty:"hard", type:"short",
    prompt:"Describe how to investigate the relationship between current and voltage for a component (e.g. resistor or bulb).",
    marks:6,
    markPoints:[
      {any:["ammeter","measure current"]},
      {any:["voltmeter","measure voltage","measure p.d."]},
      {any:["variable resistor","rheostat","potentiometer"]},
      {any:["change","vary","adjust","different values"]},
      {any:["record","table","pairs of values","v and i"]},
      {any:["repeat","mean","average","switch off","overheat","cool","temperature"]}
    ],
    explanation:
`Mark scheme style points:
• Circuit with component, ammeter in series, voltmeter in parallel.
• Use a variable resistor to change current/voltage.
• Record pairs of V and I in a table.
• Repeat and take a mean.
• Switch off between readings / allow to cool to reduce heating.
• Plot I–V (or V–I) graph.`
  }
];
