// ==========================================
// CIRCUIT SYMBOL & DIAGRAM SVG LIBRARY
// ==========================================

// ---------------------------------------------------------
// 1. STANDALONE SYMBOLS (ViewBox 0 0 100 50)
// ---------------------------------------------------------
const s = {
    // Valid Symbols
    volt: `<svg viewBox="0 0 100 50"><circle cx="50" cy="25" r="15" fill="none" stroke="black" stroke-width="2"/><text x="50" y="32" font-family="sans-serif" font-size="20" text-anchor="middle">V</text><path d="M0,25 L35,25 M65,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    amp: `<svg viewBox="0 0 100 50"><circle cx="50" cy="25" r="15" fill="none" stroke="black" stroke-width="2"/><text x="50" y="32" font-family="sans-serif" font-size="20" text-anchor="middle">A</text><path d="M0,25 L35,25 M65,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    cell: `<svg viewBox="0 0 100 50"><path d="M0,25 L45,25 M55,25 L100,25" stroke="black" stroke-width="2"/><line x1="45" y1="10" x2="45" y2="40" stroke="black" stroke-width="2"/><line x1="55" y1="15" x2="55" y2="35" stroke="black" stroke-width="2"/></svg>`,
    batt_2: `<svg viewBox="0 0 100 50"><path d="M0,25 L35,25 M45,25 L55,25 M65,25 L100,25" stroke="black" stroke-width="2"/><line x1="35" y1="10" x2="35" y2="40" stroke="black" stroke-width="2"/><line x1="45" y1="15" x2="45" y2="35" stroke="black" stroke-width="2"/><line x1="55" y1="10" x2="55" y2="40" stroke="black" stroke-width="2"/><line x1="65" y1="15" x2="65" y2="35" stroke="black" stroke-width="2"/></svg>`,
    batt_3: `<svg viewBox="0 0 100 50"><path d="M0,25 L25,25 M35,25 L45,25 M55,25 L65,25 M75,25 L100,25" stroke="black" stroke-width="2"/><line x1="25" y1="10" x2="25" y2="40" stroke="black" stroke-width="2"/><line x1="35" y1="15" x2="35" y2="35" stroke="black" stroke-width="2"/><line x1="45" y1="10" x2="45" y2="40" stroke="black" stroke-width="2"/><line x1="55" y1="15" x2="55" y2="35" stroke="black" stroke-width="2"/><line x1="65" y1="10" x2="65" y2="40" stroke="black" stroke-width="2"/><line x1="75" y1="15" x2="75" y2="35" stroke="black" stroke-width="2"/></svg>`,
    batt_sev: `<svg viewBox="0 0 100 50"><path d="M0,25 L30,25 M70,25 L100,25" stroke="black" stroke-width="2"/><line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/><line x1="40" y1="15" x2="40" y2="35" stroke="black" stroke-width="2"/><line x1="40" y1="25" x2="60" y2="25" stroke="black" stroke-width="2" stroke-dasharray="4,4"/><line x1="60" y1="10" x2="60" y2="40" stroke="black" stroke-width="2"/><line x1="70" y1="15" x2="70" y2="35" stroke="black" stroke-width="2"/></svg>`,
    var_batt: `<svg viewBox="0 0 100 50"><path d="M0,25 L30,25 M70,25 L100,25" stroke="black" stroke-width="2"/><line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/><line x1="40" y1="15" x2="40" y2="35" stroke="black" stroke-width="2"/><line x1="40" y1="25" x2="60" y2="25" stroke="black" stroke-width="2" stroke-dasharray="4,4"/><line x1="60" y1="10" x2="60" y2="40" stroke="black" stroke-width="2"/><line x1="70" y1="15" x2="70" y2="35" stroke="black" stroke-width="2"/><path d="M20,45 L80,5" stroke="black" stroke-width="2"/><polygon points="80,5 72,5 78,13" fill="black"/></svg>`,
    res: `<svg viewBox="0 0 100 50"><rect x="30" y="15" width="40" height="20" fill="none" stroke="black" stroke-width="2"/><path d="M0,25 L30,25 M70,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    var_r: `<svg viewBox="0 0 100 50"><rect x="30" y="15" width="40" height="20" fill="none" stroke="black" stroke-width="2"/><path d="M0,25 L30,25 M70,25 L100,25" stroke="black" stroke-width="2"/><path d="M20,45 L80,5" stroke="black" stroke-width="2"/><polygon points="80,5 72,5 78,13" fill="black"/></svg>`,
    therm: `<svg viewBox="0 0 100 50"><rect x="30" y="15" width="40" height="20" fill="none" stroke="black" stroke-width="2"/><path d="M0,25 L30,25 M70,25 L100,25" stroke="black" stroke-width="2"/><path d="M20,40 L35,40 L75,10" fill="none" stroke="black" stroke-width="2"/></svg>`,
    ldr: `<svg viewBox="0 0 100 50"><circle cx="50" cy="25" r="22" fill="none" stroke="black" stroke-width="2"/><rect x="35" y="15" width="30" height="20" fill="none" stroke="black" stroke-width="2"/><path d="M0,25 L35,25 M65,25 L100,25" stroke="black" stroke-width="2"/><path d="M20,0 L30,10 M25,5 L35,15" stroke="black" stroke-width="2"/><polygon points="30,10 25,10 30,5" fill="black"/><polygon points="35,15 30,15 35,10" fill="black"/></svg>`,
    diode: `<svg viewBox="0 0 100 50"><path d="M0,25 L40,25 M60,25 L100,25" stroke="black" stroke-width="2"/><polygon points="40,10 60,25 40,40" fill="none" stroke="black" stroke-width="2"/><line x1="60" y1="10" x2="60" y2="40" stroke="black" stroke-width="2"/></svg>`,
    led: `<svg viewBox="0 0 100 50"><path d="M0,25 L40,25 M60,25 L100,25" stroke="black" stroke-width="2"/><polygon points="40,15 60,25 40,35" fill="none" stroke="black" stroke-width="2"/><line x1="60" y1="15" x2="60" y2="35" stroke="black" stroke-width="2"/><path d="M62,12 L72,2 M68,18 L78,8" stroke="black" stroke-width="2"/><polygon points="72,2 64,2 70,10" fill="black"/><polygon points="78,8 70,8 76,16" fill="black"/></svg>`,
    motor: `<svg viewBox="0 0 100 50"><circle cx="50" cy="25" r="15" fill="none" stroke="black" stroke-width="2"/><text x="50" y="32" font-family="sans-serif" font-size="20" text-anchor="middle">M</text><path d="M0,25 L35,25 M65,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    bell: `<svg viewBox="0 0 100 50"><path d="M0,35 L45,35 L45,25 M100,35 L55,35 L55,25 M35,25 L65,25" stroke="black" stroke-width="2" fill="none"/><path d="M35,25 A15,15 0 0,1 65,25 Z" fill="none" stroke="black" stroke-width="2"/></svg>`,
    speaker: `<svg viewBox="0 0 100 50"><path d="M0,35 L45,35 L45,25 M100,35 L55,35 L55,25" stroke="black" stroke-width="2" fill="none"/><rect x="40" y="15" width="20" height="10" fill="none" stroke="black" stroke-width="2"/><polygon points="40,15 60,15 75,0 25,0" fill="none" stroke="black" stroke-width="2"/></svg>`,
    mic: `<svg viewBox="0 0 100 50"><path d="M0,35 L45,35 L45,25 M100,35 L55,35 L55,25" stroke="black" stroke-width="2" fill="none"/><circle cx="50" cy="15" r="10" fill="none" stroke="black" stroke-width="2"/><line x1="38" y1="5" x2="62" y2="5" stroke="black" stroke-width="4"/></svg>`,
    heater: `<svg viewBox="0 0 100 50"><rect x="25" y="15" width="50" height="20" fill="none" stroke="black" stroke-width="2"/><path d="M0,25 L25,25 M75,25 L100,25 M40,15 L40,35 M60,15 L60,35" stroke="black" stroke-width="2"/></svg>`,
    sw_open: `<svg viewBox="0 0 100 50"><path d="M0,25 L35,25 M65,25 L100,25" stroke="black" stroke-width="2"/><circle cx="35" cy="25" r="3" fill="black"/><circle cx="65" cy="25" r="3" fill="black"/><path d="M35,25 L60,10" stroke="black" stroke-width="2"/></svg>`,
    sw_closed: `<svg viewBox="0 0 100 50"><path d="M0,25 L100,25" stroke="black" stroke-width="2"/><circle cx="35" cy="25" r="3" fill="black"/><circle cx="65" cy="25" r="3" fill="black"/></svg>`,
    
    // Distractors
    fuse: `<svg viewBox="0 0 100 50"><rect x="30" y="15" width="40" height="20" fill="none" stroke="black" stroke-width="2"/><path d="M0,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    sw_err: `<svg viewBox="0 0 100 50"><path d="M0,25 L100,25" stroke="black" stroke-width="2"/><circle cx="35" cy="25" r="3" fill="black"/><circle cx="65" cy="25" r="3" fill="black"/><path d="M35,25 L60,10" stroke="black" stroke-width="2"/></svg>`,
    cap: `<svg viewBox="0 0 100 50"><path d="M0,25 L45,25 M55,25 L100,25" stroke="black" stroke-width="2"/><line x1="45" y1="10" x2="45" y2="40" stroke="black" stroke-width="2"/><line x1="55" y1="10" x2="55" y2="40" stroke="black" stroke-width="2"/></svg>`,
    volt_line: `<svg viewBox="0 0 100 50"><circle cx="50" cy="25" r="15" fill="none" stroke="black" stroke-width="2"/><text x="50" y="32" font-family="sans-serif" font-size="20" text-anchor="middle">V</text><path d="M0,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    volt_sq: `<svg viewBox="0 0 100 50"><rect x="35" y="10" width="30" height="30" fill="none" stroke="black" stroke-width="2"/><text x="50" y="32" font-family="sans-serif" font-size="20" text-anchor="middle">V</text><path d="M0,25 L35,25 M65,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    volt_sq_dist: `<svg viewBox="0 0 100 50"><rect x="35" y="10" width="30" height="30" fill="none" stroke="black" stroke-width="2"/><text x="50" y="32" font-family="sans-serif" font-size="20" text-anchor="middle">V</text><path d="M0,25 L35,25 M65,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    volt_txt: `<svg viewBox="0 0 100 50"><rect x="20" y="15" width="60" height="20" fill="none" stroke="black" stroke-width="2"/><text x="50" y="29" font-family="sans-serif" font-size="12" text-anchor="middle">voltmeter</text><path d="M0,25 L20,25 M80,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    amp_err: `<svg viewBox="0 0 100 50"><circle cx="50" cy="25" r="15" fill="none" stroke="black" stroke-width="2"/><text x="50" y="32" font-family="sans-serif" font-size="20" text-anchor="middle">A</text><path d="M0,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    amp_tri: `<svg viewBox="0 0 100 50"><polygon points="50,10 65,35 35,35" fill="none" stroke="black" stroke-width="2"/><text x="50" y="30" font-family="sans-serif" font-size="14" text-anchor="middle">A</text><path d="M0,25 L40,25 M60,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    amp_txt: `<svg viewBox="0 0 100 50"><rect x="20" y="15" width="60" height="20" fill="none" stroke="black" stroke-width="2"/><text x="50" y="29" font-family="sans-serif" font-size="12" text-anchor="middle">ammeter</text><path d="M0,25 L20,25 M80,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    cell_line: `<svg viewBox="0 0 100 50"><path d="M0,25 L100,25" stroke="black" stroke-width="2"/><line x1="45" y1="10" x2="45" y2="40" stroke="black" stroke-width="2"/><line x1="55" y1="15" x2="55" y2="35" stroke="black" stroke-width="2"/></svg>`,
    batt_line: `<svg viewBox="0 0 100 50"><path d="M0,25 L100,25" stroke="black" stroke-width="2"/><line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/><line x1="40" y1="15" x2="40" y2="35" stroke="black" stroke-width="2"/><line x1="60" y1="10" x2="60" y2="40" stroke="black" stroke-width="2"/><line x1="70" y1="15" x2="70" y2="35" stroke="black" stroke-width="2"/></svg>`,
    batt_err: `<svg viewBox="0 0 100 50"><path d="M0,25 L30,25 M70,25 L100,25" stroke="black" stroke-width="2"/><line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/><line x1="40" y1="15" x2="40" y2="35" stroke="black" stroke-width="2"/><line x1="43" y1="25" x2="57" y2="25" stroke="black" stroke-width="2" stroke-dasharray="4,4"/><line x1="60" y1="10" x2="60" y2="40" stroke="black" stroke-width="2"/><line x1="70" y1="15" x2="70" y2="35" stroke="black" stroke-width="2"/></svg>`,
    batt_txt: `<svg viewBox="0 0 100 50"><rect x="20" y="15" width="60" height="20" fill="none" stroke="black" stroke-width="2"/><text x="50" y="29" font-family="sans-serif" font-size="12" text-anchor="middle">battery</text><path d="M0,25 L20,25 M80,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    res_us: `<svg viewBox="0 0 100 50"><path d="M0,25 L20,25 L25,10 L35,40 L45,10 L55,40 L65,10 L75,40 L80,25 L100,25" fill="none" stroke="black" stroke-width="2"/></svg>`,
    res_squat: `<svg viewBox="0 0 100 50"><rect x="40" y="5" width="20" height="40" fill="none" stroke="black" stroke-width="2"/><path d="M0,25 L40,25 M60,25 L100,25" stroke="black" stroke-width="2"/></svg>`,
    var_noarr: `<svg viewBox="0 0 100 50"><rect x="30" y="15" width="40" height="20" fill="none" stroke="black" stroke-width="2"/><path d="M0,25 L30,25 M70,25 L100,25" stroke="black" stroke-width="2"/><path d="M20,40 L80,10" stroke="black" stroke-width="2"/></svg>`,
    var_fuse_err: `<svg viewBox="0 0 100 50"><rect x="30" y="15" width="40" height="20" fill="none" stroke="black" stroke-width="2"/><path d="M0,25 L100,25" stroke="black" stroke-width="2"/><path d="M20,45 L80,5" stroke="black" stroke-width="2"/><polygon points="80,5 72,5 78,13" fill="black"/></svg>`
};


// ---------------------------------------------------------
// 2. MODULAR CIRCUIT PIECES (ViewBox -20 -20 240 200)
// ---------------------------------------------------------
const vbx = 'viewBox="-20 -20 240 200"';

// Base Components
const c_base = `<line x1="85" y1="15" x2="85" y2="45" stroke="black" stroke-width="2"/><line x1="95" y1="20" x2="95" y2="40" stroke="black" stroke-width="2"/><rect x="60" y="110" width="40" height="20" fill="none" stroke="black" stroke-width="2"/><circle cx="135" cy="120" r="12" fill="none" stroke="black" stroke-width="2"/><path d="M126.5,111.5 L143.5,128.5 M126.5,128.5 L143.5,111.5" stroke="black" stroke-width="2"/>`;

const w = {
    std: `<path d="M 40,120 L 40,30 L 85,30 M 95,30 L 160,30 L 160,120 L 147,120 M 123,120 L 100,120 M 60,120 L 40,120" fill="none" stroke="black" stroke-width="2"/>`,
    gap: `<path d="M 40,120 L 40,90 M 40,60 L 40,30 L 85,30 M 95,30 L 160,30 L 160,120 L 147,120 M 123,120 L 100,120 M 60,120 L 40,120" fill="none" stroke="black" stroke-width="2"/>`,
    corner: `<path d="M 40,120 L 40,30 L 85,30 M 95,30 L 160,30 L 160,108 M 160,132 L 160,150 L 40,150 L 40,120 M 147,120 L 100,120 M 60,120 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="160" cy="120" r="12" fill="white" stroke="black" stroke-width="2"/><path d="M151.5,111.5 L168.5,128.5 M151.5,128.5 L168.5,111.5" stroke="black" stroke-width="2"/>`,
    diag: `<path d="M 40,120 L 40,30 L 85,30 M 95,30 L 160,30 L 160,120 L 147,120 M 123,120 L 100,120 M 60,120 L 40,120 M 40,120 L 160,30" fill="none" stroke="black" stroke-width="2"/>`,
    a_l: `<path d="M 40,120 L 40,90 M 40,60 L 40,30 L 85,30 M 95,30 L 160,30 L 160,120 L 147,120 M 123,120 L 100,120 M 60,120 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="40" cy="75" r="15" fill="none" stroke="black" stroke-width="2"/><text x="40" y="81" font-family="sans-serif" font-size="16" text-anchor="middle">A</text>`,
    a_r: `<path d="M 40,120 L 40,30 L 85,30 M 95,30 L 160,30 L 160,60 M 160,90 L 160,120 L 147,120 M 123,120 L 100,120 M 60,120 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="160" cy="75" r="15" fill="none" stroke="black" stroke-width="2"/><text x="160" y="81" font-family="sans-serif" font-size="16" text-anchor="middle">A</text>`,
    v_l: `<path d="M 40,120 L 40,90 M 40,60 L 40,30 L 85,30 M 95,30 L 160,30 L 160,120 L 147,120 M 123,120 L 100,120 M 60,120 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="40" cy="75" r="15" fill="none" stroke="black" stroke-width="2"/><text x="40" y="81" font-family="sans-serif" font-size="16" text-anchor="middle">V</text>`
};

const p = {
    v_bulb: `<path d="M 115,120 L 115,150 L 120,150 M 150,150 L 155,150 L 155,120" fill="none" stroke="black" stroke-width="2"/><circle cx="135" cy="150" r="15" fill="none" stroke="black" stroke-width="2"/><text x="135" y="156" font-family="sans-serif" font-size="16" text-anchor="middle">V</text>`,
    a_bulb: `<path d="M 115,120 L 115,150 L 120,150 M 150,150 L 155,150 L 155,120" fill="none" stroke="black" stroke-width="2"/><circle cx="135" cy="150" r="15" fill="none" stroke="black" stroke-width="2"/><text x="135" y="156" font-family="sans-serif" font-size="16" text-anchor="middle">A</text>`,
    v_res: `<path d="M 55,120 L 55,150 L 70,150 M 100,150 L 105,150 L 105,120" fill="none" stroke="black" stroke-width="2"/><circle cx="85" cy="150" r="15" fill="none" stroke="black" stroke-width="2"/><text x="85" y="156" font-family="sans-serif" font-size="16" text-anchor="middle">V</text>`,
    a_res: `<path d="M 55,120 L 55,150 L 70,150 M 100,150 L 105,150 L 105,120" fill="none" stroke="black" stroke-width="2"/><circle cx="85" cy="150" r="15" fill="none" stroke="black" stroke-width="2"/><text x="85" y="156" font-family="sans-serif" font-size="16" text-anchor="middle">A</text>`,
    v_cell: `<path d="M 70,30 L 70,-5 L 75,-5 M 105,-5 L 110,-5 L 110,30" fill="none" stroke="black" stroke-width="2"/><circle cx="90" cy="-5" r="15" fill="none" stroke="black" stroke-width="2"/><text x="90" y="1" font-family="sans-serif" font-size="16" text-anchor="middle">V</text>`,
    a_cell: `<path d="M 70,30 L 70,-5 L 75,-5 M 105,-5 L 110,-5 L 110,30" fill="none" stroke="black" stroke-width="2"/><circle cx="90" cy="-5" r="15" fill="none" stroke="black" stroke-width="2"/><text x="90" y="1" font-family="sans-serif" font-size="16" text-anchor="middle">A</text>`
};

const l = {
    c_fwd: `<line x1="85" y1="15" x2="85" y2="45" stroke="black" stroke-width="2"/><line x1="95" y1="20" x2="95" y2="40" stroke="black" stroke-width="2"/>`,
    c_rev: `<line x1="95" y1="15" x2="95" y2="45" stroke="black" stroke-width="2"/><line x1="85" y1="20" x2="85" y2="40" stroke="black" stroke-width="2"/>`,
    loop: `<path d="M 40,120 L 40,30 L 85,30 M 95,30 L 160,30 L 160,120 L 145,120 M 115,120 L 40,120" fill="none" stroke="black" stroke-width="2"/>`,
    loop_sw: `<path d="M 40,120 L 40,90 M 40,60 L 40,30 L 85,30 M 95,30 L 160,30 L 160,120 L 145,120 M 115,120 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="40" cy="60" r="3" fill="black"/><circle cx="40" cy="90" r="3" fill="black"/><path d="M 40,90 L 55,75" stroke="black" stroke-width="2"/>`,
    led_fwd: `<polygon points="120,110 120,130 140,120" fill="none" stroke="black" stroke-width="2"/><path d="M 140,110 L 140,130 M 115,120 L 120,120 M 140,120 L 145,120" stroke="black" stroke-width="2"/><path d="M142,107 L152,97 M148,113 L158,103" stroke="black" stroke-width="2"/><polygon points="152,97 144,97 150,105" fill="black"/><polygon points="158,103 150,103 156,111" fill="black"/>`,
    led_rev: `<polygon points="140,110 140,130 120,120" fill="none" stroke="black" stroke-width="2"/><path d="M 120,110 L 120,130 M 115,120 L 120,120 M 140,120 L 145,120" stroke="black" stroke-width="2"/><path d="M118,108 L108,98 M112,114 L102,104" stroke="black" stroke-width="2"/><polygon points="108,98 116,98 110,106" fill="black"/><polygon points="102,104 110,104 104,112" fill="black"/>`
};

// ---------------------------------------------------------
// 3. I-V CHARACTERISTIC CIRCUITS (15 Combinations)
// ---------------------------------------------------------
// Component Macros
const t_batt = `<path d="M 40,30 L 85,30 M 115,30 L 160,30" fill="none" stroke="black" stroke-width="2"/><line x1="85" y1="15" x2="85" y2="45" stroke="black" stroke-width="2"/><line x1="95" y1="20" x2="95" y2="40" stroke="black" stroke-width="2"/><line x1="105" y1="15" x2="105" y2="45" stroke="black" stroke-width="2"/><line x1="115" y1="20" x2="115" y2="40" stroke="black" stroke-width="2"/><line x1="95" y1="30" x2="105" y2="30" stroke="black" stroke-width="2" stroke-dasharray="4,4"/>`;
const t_var_batt = `<path d="M 40,30 L 80,30 M 120,30 L 160,30" fill="none" stroke="black" stroke-width="2"/><line x1="80" y1="15" x2="80" y2="45" stroke="black" stroke-width="2"/><line x1="90" y1="20" x2="90" y2="40" stroke="black" stroke-width="2"/><line x1="90" y1="30" x2="110" y2="30" stroke="black" stroke-width="2" stroke-dasharray="4,4"/><line x1="110" y1="15" x2="110" y2="45" stroke="black" stroke-width="2"/><line x1="120" y1="20" x2="120" y2="40" stroke="black" stroke-width="2"/><path d="M 70,55 L 130,5" stroke="black" stroke-width="2"/><polygon points="130,5 122,5 128,13" fill="black"/>`;
const t_res = `<path d="M 40,30 L 80,30 M 120,30 L 160,30" fill="none" stroke="black" stroke-width="2"/><rect x="80" y="20" width="40" height="20" fill="none" stroke="black" stroke-width="2"/>`;
const t_var_res = `<path d="M 40,30 L 80,30 M 120,30 L 160,30" fill="none" stroke="black" stroke-width="2"/><rect x="80" y="20" width="40" height="20" fill="none" stroke="black" stroke-width="2"/><path d="M 70,50 L 130,10" stroke="black" stroke-width="2"/><polygon points="130,10 122,10 128,18" fill="black"/>`;

const l_wire = `<path d="M 40,30 L 40,120" fill="none" stroke="black" stroke-width="2"/>`;
const l_amp = `<path d="M 40,30 L 40,60 M 40,90 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="40" cy="75" r="15" fill="none" stroke="black" stroke-width="2"/><text x="40" y="81" font-family="sans-serif" font-size="16" text-anchor="middle">A</text>`;
const l_sw = `<path d="M 40,30 L 40,60 M 40,90 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="40" cy="60" r="3" fill="black"/><circle cx="40" cy="90" r="3" fill="black"/><path d="M 40,90 L 55,75" stroke="black" stroke-width="2"/>`;
const l_sw_amp = `<path d="M 40,30 L 40,40 M 40,65 L 40,80 M 40,110 L 40,120" fill="none" stroke="black" stroke-width="2"/><circle cx="40" cy="40" r="3" fill="black"/><circle cx="40" cy="65" r="3" fill="black"/><path d="M 40,65 L 55,50" stroke="black" stroke-width="2"/><circle cx="40" cy="95" r="15" fill="none" stroke="black" stroke-width="2"/><text x="40" y="101" font-family="sans-serif" font-size="16" text-anchor="middle">A</text>`;

const r_wire = `<path d="M 160,30 L 160,120" fill="none" stroke="black" stroke-width="2"/>`;
const r_sw = `<path d="M 160,30 L 160,60 M 160,90 L 160,120" fill="none" stroke="black" stroke-width="2"/><circle cx="160" cy="60" r="3" fill="black"/><circle cx="160" cy="90" r="3" fill="black"/><path d="M 160,90 L 145,75" stroke="black" stroke-width="2"/>`;
const r_var_res = `<path d="M 160,30 L 160,50 M 160,90 L 160,120" fill="none" stroke="black" stroke-width="2"/><rect x="150" y="50" width="20" height="40" fill="none" stroke="black" stroke-width="2"/><path d="M 135,85 L 185,55" stroke="black" stroke-width="2"/><polygon points="185,55 177,55 183,63" fill="black"/>`;

const b_res = `<path d="M 40,120 L 80,120 M 120,120 L 160,120" fill="none" stroke="black" stroke-width="2"/><rect x="80" y="110" width="40" height="20" fill="none" stroke="black" stroke-width="2"/>`;
const b_res_v = `<path d="M 40,120 L 80,120 M 120,120 L 160,120" fill="none" stroke="black" stroke-width="2"/><rect x="80" y="110" width="40" height="20" fill="none" stroke="black" stroke-width="2"/><path d="M 70,120 L 70,160 L 85,160 M 115,160 L 130,160 L 130,120" fill="none" stroke="black" stroke-width="2"/><circle cx="100" cy="160" r="15" fill="none" stroke="black" stroke-width="2"/><text x="100" y="166" font-family="sans-serif" font-size="16" text-anchor="middle">V</text>`;

const iv = {
    // Static (3)
    static_base:      `<svg ${vbx}>` + t_batt + l_amp + r_wire + b_res_v + `</svg>`,
    static_sw:        `<svg ${vbx}>` + t_batt + l_amp + r_sw + b_res_v + `</svg>`,
    static_sw_no_v:   `<svg ${vbx}>` + t_batt + l_amp + r_sw + b_res + `</svg>`,

    // Var Batt (5)
    var_batt_base:    `<svg ${vbx}>` + t_var_batt + l_amp + r_wire + b_res_v + `</svg>`,
    var_batt_sw:      `<svg ${vbx}>` + t_var_batt + l_amp + r_sw + b_res_v + `</svg>`,
    var_batt_sw_no_v: `<svg ${vbx}>` + t_var_batt + l_amp + r_sw + b_res + `</svg>`,
    var_batt_sw_no_a: `<svg ${vbx}>` + t_var_batt + l_wire + r_sw + b_res_v + `</svg>`,
    var_batt_no_v:    `<svg ${vbx}>` + t_var_batt + l_amp + r_wire + b_res + `</svg>`,

    // Var Res (5)
    var_res_base:     `<svg ${vbx}>` + t_batt + l_amp + r_var_res + b_res_v + `</svg>`,
    var_res_sw:       `<svg ${vbx}>` + t_batt + l_sw_amp + r_var_res + b_res_v + `</svg>`,
    var_res_sw_no_v:  `<svg ${vbx}>` + t_batt + l_sw_amp + r_var_res + b_res + `</svg>`,
    var_res_sw_no_a:  `<svg ${vbx}>` + t_batt + l_sw + r_var_res + b_res_v + `</svg>`,
    var_res_no_v:     `<svg ${vbx}>` + t_batt + l_amp + r_var_res + b_res + `</svg>`,

    // Fatal Flaws (2)
    no_pwr_var_res:   `<svg ${vbx}>` + t_var_res + l_amp + r_sw + b_res_v + `</svg>`,
    no_pwr_fixed:     `<svg ${vbx}>` + t_res + l_amp + r_sw + b_res_v + `</svg>`
};