// ==========================================
// MASTER QUESTION POOL (37 Questions)
// ==========================================
// Note: This file relies on the variables (s, vbx, c_base, w, p, l, iv) 
// defined in svg_library.js being loaded first in the HTML.

const qs = [
    // ---------------------------------------------------------
    // CATEGORY 1: Visual -> Text Identification
    // ---------------------------------------------------------
    { t: "Which component does this symbol represent?", img: s.volt, m: false, 
        c: [{t:"voltmeter", fb:"Correct!"}], 
        w: [{t:"ammeter", fb:"No."}, {t:"motor", fb:"No."}, {t:"cell", fb:"No."}, {t:"variable resistor", fb:"No."}, {t:"speaker", fb:"No."}] },
    { t: "Which component does this symbol represent?", img: s.amp, m: false, 
        c: [{t:"ammeter", fb:"Correct!"}], 
        w: [{t:"voltmeter", fb:"No."}, {t:"speaker", fb:"No."}, {t:"microphone", fb:"No."}] },
    { t: "Which component does this symbol represent?", img: s.motor, m: false, 
        c: [{t:"motor", fb:"Correct!"}], 
        w: [{t:"microphone", fb:"No, a mic uses a different symbol."}, {t:"ammeter", fb:"No."}, {t:"heater", fb:"No."}, {t:"electric bell", fb:"No."}] },
    { t: "What is this symbol?", img: s.cell, m: false, 
        c: [{t:"cell", fb:"Correct!"}], 
        w: [{t:"battery", fb:"No, a battery is multiple cells."}, {t:"capacitor", fb:"No, a capacitor has equal lines."}, {t:"switch", fb:"No."}] },
    { t: "What is this symbol?", img: s.batt_2, m: false, 
        c: [{t:"two cell battery", fb:"Correct!"}], 
        w: [{t:"cell", fb:"No."}, {t:"capacitor", fb:"No."}, {t:"three cell battery", fb:"No."}] },
    { t: "What is this symbol?", img: s.batt_3, m: false, 
        c: [{t:"three cell battery", fb:"Correct!"}], 
        w: [{t:"several cell battery", fb:"No, that uses a dashed line."}, {t:"two cell battery", fb:"No."}, {t:"heater", fb:"No."}] },
    { t: "What is this symbol?", img: s.batt_sev, m: false, 
        c: [{t:"several cell battery", fb:"Correct!"}], 
        w: [{t:"cell", fb:"No."}, {t:"two cell battery", fb:"No."}, {t:"heater", fb:"No."}, {t:"fuse", fb:"No."}] },
    { t: "Identify this component:", img: s.res, m: false, 
        c: [{t:"fixed resistor", fb:"Correct!"}], 
        w: [{t:"fuse", fb:"No, a fuse has a line running right through it."}, {t:"heater", fb:"No, a heater has vertical lines inside."}, {t:"variable resistor", fb:"No, it lacks an arrow."}, {t:"relay", fb:"No."}] },
    { t: "Identify this component:", img: s.var_r, m: false, 
        c: [{t:"variable resistor", fb:"Correct!"}], 
        w: [{t:"thermistor", fb:"No."}, {t:"ldr", fb:"No."}, {t:"fuse", fb:"No."}, {t:"fixed resistor", fb:"No."}] },
    { t: "Identify this output device:", img: s.bell, m: false, 
        c: [{t:"electric bell", fb:"Correct! It looks like a mushroom."}], 
        w: [{t:"loudspeaker", fb:"A speaker looks like an expanding cone."}, {t:"microphone", fb:"No, that's an input device."}, {t:"push switch", fb:"No."}, {t:"motor", fb:"No."}] },
    { t: "Identify this output device:", img: s.speaker, m: false, 
        c: [{t:"loudspeaker", fb:"Correct! The cone emits sound."}], 
        w: [{t:"microphone", fb:"No, this is an input device."}, {t:"electric bell", fb:"No, a bell is a mushroom shape."}, {t:"diode", fb:"No."}, {t:"heater", fb:"No."}] },
    { t: "Identify this input device:", img: s.mic, m: false, 
        c: [{t:"microphone", fb:"Correct!"}], 
        w: [{t:"loudspeaker", fb:"No."}, {t:"electric bell", fb:"No."}, {t:"motor", fb:"No."}, {t:"cell", fb:"No."}] },
    { t: "Identify this component:", img: s.heater, m: false, 
        c: [{t:"heater", fb:"Correct!"}], 
        w: [{t:"fixed resistor", fb:"No."}, {t:"fuse", fb:"No."}, {t:"capacitor", fb:"No."}] },
    { t: "What state is this switch in?", img: s.sw_closed, m: false, 
        c: [{t:"closed (on)", fb:"Correct!"}], 
        w: [{t:"open (off)", fb:"No."}, {t:"broken", fb:"No."}] },
    { t: "What is this symbol?", img: s.diode, m: false, 
        c: [{t:"diode", fb:"Correct!"}], 
        w: [{t:"light emitting diode (led)", fb:"No arrows."}, {t:"light dependent resistor (ldr)", fb:"No."}, {t:"switch", fb:"No."}] },
    { t: "Identify this component:", img: s.led, m: false, 
        c: [{t:"light emitting diode (led)", fb:"Correct!"}], 
        w: [{t:"diode", fb:"No arrows."}, {t:"light dependent resistor (ldr)", fb:"Arrows point in."}, {t:"lamp/bulb", fb:"No."}] },
    
    // ---------------------------------------------------------
    // CATEGORY 2: Text -> Visual Draw/Selection
    // ---------------------------------------------------------
    { t: "Which is the correct symbol for an open switch?", m: false, 
        c: [{svg:s.sw_open, fb:"Correct! Distinct gap."}], 
        w: [{svg:s.sw_err, fb:"Incorrect. The wire beneath is still joined!"}, {svg:s.sw_closed, fb:"Incorrect. Closed."}, {svg:s.fuse, fb:"Incorrect. Fuse."}, {svg:s.res, fb:"Incorrect."}] },
    { t: "Which is the correct symbol for a voltmeter?", m: false, 
        c: [{svg:s.volt, fb:"Correct!"}], 
        w: [{svg:s.volt_line, fb:"Incorrect. Line goes straight through."}, {svg:s.volt_sq, fb:"Incorrect. Circles."}, {svg:s.volt_txt, fb:"Incorrect. No text."}, {svg:s.motor, fb:"Incorrect."}, {svg:s.amp, fb:"Incorrect."}] },
    { t: "Which is the correct symbol for an ammeter?", m: false, 
        c: [{svg:s.amp, fb:"Correct!"}], 
        w: [{svg:s.amp_err, fb:"Incorrect. Line goes straight through."}, {svg:s.amp_tri, fb:"Incorrect. Circles."}, {svg:s.amp_txt, fb:"Incorrect. No text."}, {svg:s.volt, fb:"Incorrect."}] },
    { t: "Which is the correct symbol for a cell?", m: false, 
        c: [{svg:s.cell, fb:"Correct!"}], 
        w: [{svg:s.cell_line, fb:"Incorrect. Line goes straight through plates."}, {svg:s.cap, fb:"Incorrect. Capacitor."}, {svg:s.batt_sev, fb:"Incorrect. Battery."}, {svg:s.batt_2, fb:"Incorrect."}] },
    { t: "Which symbol represents a several cell battery?", m: false, 
        c: [{svg:s.batt_sev, fb:"Correct!"}], 
        w: [{svg:s.batt_line, fb:"Incorrect. Line goes straight through."}, {svg:s.batt_err, fb:"Incorrect. Dashed lines don't connect!"}, {svg:s.batt_txt, fb:"Incorrect."}, {svg:s.cell, fb:"Incorrect. Single cell."}, {svg:s.batt_2, fb:"Incorrect."}] },
    { t: "Which symbol represents a fixed resistor?", m: false, 
        c: [{svg:s.res, fb:"Correct!"}], 
        w: [{svg:s.res_squat, fb:"Incorrect. Connects to long sides!"}, {svg:s.res_us, fb:"US Style. Used in some parts of the world, but not this course. Use IEC standard. (0 pts)"}, {svg:s.fuse, fb:"Incorrect. Fuse."}, {svg:s.heater, fb:"Incorrect. Heater."}] },
    { t: "Which symbol represents a variable resistor?", m: false, 
        c: [{svg:s.var_r, fb:"Correct!"}], 
        w: [{svg:s.var_noarr, fb:"Incorrect. Missing arrowhead."}, {svg:s.var_fuse_err, fb:"Incorrect. That is a line drawn through, like a fuse."}, {svg:s.therm, fb:"Incorrect. Thermistor."}, {svg:s.ldr, fb:"Incorrect. LDR."}] },
    { t: "Which symbol represents an electric bell?", m: false, 
        c: [{svg:s.bell, fb:"Correct!"}], 
        w: [{svg:s.speaker, fb:"Incorrect."}, {svg:s.mic, fb:"Incorrect."}, {svg:s.sw_open, fb:"Incorrect."}] },
    { t: "Which symbol represents a light emitting diode (led)?", m: false, 
        c: [{svg:s.led, fb:"Correct! Arrows point OUT."}], 
        w: [{svg:s.diode, fb:"Incorrect. Standard diode has no arrows."}, {svg:s.ldr, fb:"Incorrect. Arrows point in."}, {svg:s.motor, fb:"Incorrect."}, {svg:s.speaker, fb:"Incorrect."}] },
    { t: "Which symbol represents a microphone?", m: false, 
        c: [{svg:s.mic, fb:"Correct!"}], 
        w: [{svg:s.speaker, fb:"Incorrect. This is a loudspeaker."}, {svg:s.bell, fb:"Incorrect. This is an electric bell."}, {svg:s.motor, fb:"Incorrect."}] },
    { t: "Which symbol represents a loudspeaker?", m: false, 
        c: [{svg:s.speaker, fb:"Correct!"}], 
        w: [{svg:s.mic, fb:"Incorrect. This is a microphone."}, {svg:s.bell, fb:"Incorrect. This is an electric bell."}, {svg:s.diode, fb:"Incorrect."}] },
    
    // ---------------------------------------------------------
    // CATEGORY 3: Functional Knowledge
    // ---------------------------------------------------------
    { t: "Which component allows current to flow in only ONE direction?", m: false, 
        c: [{svg:s.diode, fb:"Correct! It acts like a one-way valve."}], 
        w: [{svg:s.res, fb:"No."}, {svg:s.fuse, fb:"No."}, {svg:s.cap, fb:"No."}] },
    { t: "Which component converts electrical energy into kinetic (movement) energy?", m: false, 
        c: [{svg:s.motor, fb:"Correct!"}], 
        w: [{svg:s.speaker, fb:"No, sound."}, {svg:s.bell, fb:"No, sound."}, {svg:s.heater, fb:"No, thermal."}] },
    
    // ---------------------------------------------------------
    // CATEGORY 4: Circuit Logic & Meter Placement
    // ---------------------------------------------------------
    { t: "Which circuit(s) is/are correctly set up to measure the current through the bulb?", m: true, 
        c: [{ svg:`<svg ${vbx}>${c_base}${w.a_l}</svg>`, fb:"Ammeter in series is correct." }, 
            { svg:`<svg ${vbx}>${c_base}${w.a_r}</svg>`, fb:"Ammeter anywhere in series loop is correct." }],
        w: [{ svg:`<svg ${vbx}>${c_base}${w.std}${p.a_bulb}</svg>`, fb:"Ammeters in parallel cause a short circuit!" }, 
            { svg:`<svg ${vbx}>${c_base}${w.v_l}</svg>`, fb:"Voltmeters in series block the current entirely!" }, 
            { svg:`<svg ${vbx}>${c_base}${w.std}${p.v_bulb}</svg>`, fb:"This correctly measures voltage, not current." }]
    },
    { t: "Where could you place a switch to successfully turn the bulb on and off?", m: true, 
        c: [{ svg:`<svg ${vbx}>${c_base}<path d="M 40,120 L 40,90 M 40,60 L 40,30 L 85,30 M 95,30 L 160,30 L 160,120 L 147,120 M 123,120 L 100,120 M 60,120 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="40" cy="60" r="3" fill="black"/><circle cx="40" cy="90" r="3" fill="black"/><path d="M 40,90 L 55,75" stroke="black" stroke-width="2"/></svg>`, fb:"Breaking the main loop works perfectly." },
            { svg:`<svg ${vbx}>${c_base}<path d="M 40,120 L 40,30 L 85,30 M 95,30 L 160,30 L 160,60 M 160,90 L 160,120 L 147,120 M 123,120 L 100,120 M 60,120 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="160" cy="60" r="3" fill="black"/><circle cx="160" cy="90" r="3" fill="black"/><path d="M 160,90 L 145,75" stroke="black" stroke-width="2"/></svg>`, fb:"Switch on the other side of the loop works equally well." }],
        w: [{ svg:`<svg ${vbx}>${c_base}${w.std}<path d="M 115,120 L 115,150 L 125,150 M 145,150 L 155,150 L 155,120" fill="none" stroke="black" stroke-width="2"/><circle cx="125" cy="150" r="3" fill="black"/><circle cx="145" cy="150" r="3" fill="black"/><path d="M 125,150 L 135,135" stroke="black" stroke-width="2"/></svg>`, fb:"Switch in parallel creates a short circuit when closed!" },
            { svg:`<svg ${vbx}>${c_base}${w.std}<path d="M 70,30 L 70,-5 L 80,-5 M 100,-5 L 110,-5 L 110,30" fill="none" stroke="black" stroke-width="2"/><circle cx="80" cy="-5" r="3" fill="black"/><circle cx="100" cy="-5" r="3" fill="black"/><path d="M 80,-5 L 90,-20" stroke="black" stroke-width="2"/></svg>`, fb:"Closing this switch dead-shorts the cell! Very dangerous." }]
    },
    { t: "Which circuit is correctly set up to measure the voltage across the bulb?", m: false, 
        c: [{ svg:`<svg ${vbx}>${c_base}${w.std}${p.v_bulb}</svg>`, fb:"Correct! Voltmeter in parallel across the bulb." }],
        w: [{ svg:`<svg ${vbx}>${c_base}${w.std}${p.v_res}</svg>`, fb:"Incorrect. This measures voltage across the resistor." }, 
            { svg:`<svg ${vbx}>${c_base}${w.v_l}</svg>`, fb:"Incorrect. Voltmeters in series block current." }, 
            { svg:`<svg ${vbx}>${c_base}${w.std}${p.a_bulb}</svg>`, fb:"Incorrect. Ammeters in parallel create short circuits." }]
    },
    { t: "Which circuit is correctly set up to measure the voltage across the fixed resistor?", m: false, 
        c: [{ svg:`<svg ${vbx}>${c_base}${w.std}${p.v_res}</svg>`, fb:"Correct! Voltmeter in parallel across the resistor." }],
        w: [{ svg:`<svg ${vbx}>${c_base}${w.std}${p.v_bulb}</svg>`, fb:"Incorrect. This measures voltage across the bulb." }, 
            { svg:`<svg ${vbx}>${c_base}${w.v_l}</svg>`, fb:"Incorrect. Voltmeters in series block current." }, 
            { svg:`<svg ${vbx}>${c_base}${w.std}${p.a_res}</svg>`, fb:"Incorrect. Ammeters in parallel create short circuits." }]
    },
    { t: "Which circuit is properly set up to find the resistance of the fixed resistor?", m: false, 
        c: [{ svg:`<svg ${vbx}>${c_base}${w.a_l}${p.v_res}</svg>`, fb:"Correct! You would then take readings from the ammeter & voltmeter and calculate resistance using R = V / I." }],
        w: [{ svg:`<svg ${vbx}>${c_base}<path d="M 40,120 L 40,90 M 40,60 L 40,30 L 85,30 M 95,30 L 160,30 L 160,60 M 160,90 L 160,120 L 147,120 M 123,120 L 100,120 M 60,120 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="40" cy="75" r="15" fill="none" stroke="black" stroke-width="2"/><text x="40" y="81" font-family="sans-serif" font-size="16" text-anchor="middle">A</text><circle cx="160" cy="75" r="15" fill="none" stroke="black" stroke-width="2"/><text x="160" y="81" font-family="sans-serif" font-size="16" text-anchor="middle">V</text></svg>`, fb:"Incorrect. Voltmeter in series blocks current." },
            { svg:`<svg ${vbx}>${c_base}${w.v_l}${p.a_res}</svg>`, fb:"Incorrect. You swapped them! V is blocking, A is shorting." }, 
            { svg:`<svg ${vbx}>${c_base}${w.std}${p.v_res}${p.a_bulb}</svg>`, fb:"Incorrect. Both are in parallel." }, 
            { svg:`<svg ${vbx}>${c_base}${w.std}${p.v_res}${p.v_bulb}</svg>`, fb:"Incorrect. We need an Ammeter too." }]
    },
    { t: "Which of these simple circuit diagrams is drawn properly?", m: false, 
        c: [{ svg: `<svg ${vbx}>${c_base}${w.std}</svg>`, fb: "Correct! Neat rectangles, no gaps, components placed cleanly on straight lines." }],
        w: [{ svg: `<svg ${vbx}>${c_base}${w.gap}</svg>`, fb: "Incorrect. There is a gap in the left wire." }, 
            { svg: `<svg ${vbx}>${c_base}${w.corner}</svg>`, fb: "Incorrect. Components should not be drawn overlapping the corners." }, 
            { svg: `<svg ${vbx}>${c_base}${w.diag}</svg>`, fb: "Incorrect. Wires should be drawn horizontally and vertically." }]
    },
    { t: "In which of these circuits will the led ACTUALLY light up?", m: true, 
        c: [{ svg:`<svg ${vbx}>${l.c_fwd}${l.loop}${l.led_fwd}</svg>`, fb:"Current correctly pushes through the back of the LED symbol." },
            { svg:`<svg ${vbx}>${l.c_rev}${l.loop}${l.led_rev}</svg>`, fb:"The cell is backwards, but so is the LED! It is perfectly forward-biased and lights up." }],
        w: [{ svg:`<svg ${vbx}>${l.c_fwd}${l.loop}${l.led_rev}</svg>`, fb:"The LED is reverse-biased (hitting the 'wall' blocks the current from the cell)." },
            { svg:`<svg ${vbx}>${l.c_fwd}${l.loop_sw}${l.led_fwd}</svg>`, fb:"The LED is correctly aligned, but the switch is OPEN! Nothing happens." },
            { svg:`<svg ${vbx}>${l.c_rev}${l.loop}${l.led_fwd}</svg>`, fb:"The cell is pushing current the wrong way against the LED wall." }]
    },
    { t: "Which diagram correctly measures the voltage of the cell?", m: false, 
        c: [{ svg:`<svg ${vbx}>${c_base}${w.std}${p.v_cell}</svg>`, fb:"Correct! Voltmeter in parallel specifically across the cell." }],
        w: [{ svg:`<svg ${vbx}>${c_base}${w.std}${p.v_bulb}</svg>`, fb:"Incorrect. This measures the bulb." }, 
            { svg:`<svg ${vbx}>${c_base}${w.v_l}</svg>`, fb:"Incorrect. Voltmeters cannot be in series." }, 
            { svg:`<svg ${vbx}>${c_base}${w.std}${p.a_cell}</svg>`, fb:"Incorrect. This is an ammeter, creating a massive short circuit." }]
    }
];