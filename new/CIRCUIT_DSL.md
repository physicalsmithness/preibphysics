# Circuit DSL — authoring reference

Compact text language for describing electrical circuits. Compiled by `circuit_diagram.js` to SVG. IEC / European notation.

This file is the persistent authoring reference. The original development tool (`circuit-builder.html`, kept in the reference folder) renders DSL live in a browser and is useful as a sandbox; this doc is the canonical syntax description for question-authoring chats.

---

## Quickstart

```
3cb6,s,r10,bb
```

→ 3-cell 6V battery, switch (open), 10Ω resistor, bulb. Default layout: battery top, components round the loop.

```
left, 3cb, s, r10, bb
```

→ Same, but horizontal: battery left, components on right + top + bottom walls as needed.

---

## Composition

| Operator | Meaning |
|---|---|
| `,` | Series (next component). A newline also works as a series separator. |
| `(A;B)` or `(A|B)` | Parallel branches (semicolon and pipe both work as separators) |
| `:A;B` | **Trailing parallel** — opens parallel branches inline without surrounding brackets. Close with `\` if there's more after the parallel block. Example: `2cb,s,r:r10.1;r20.2;v` (a resistor in series, then three parallel branches: R₁, R₂, voltmeter). If something follows, close: `2cb,s,r:r10;r20\,bb`. |
| `/X` | Voltmeter "tap" across the next atom (the voltmeter sits in parallel with `X`, no wires between them) |
| `+` after a component | Place on **right** wall |
| `-` after a component | Place on **left** wall |
| `++` / `--` after a component | Place on **top** wall (use sparingly) |
| no suffix | Default wall — bottom (vertical orientation) or right (horizontal) |
| `!` after a component | Reverse it (e.g. flip a battery, reverse a diode) |
| `>` / `<` between atoms | Current-direction chevron in the local traversal direction. Optional value follows: `>2` = 2A. Without a value, the chevron is unlabelled. |
| `*` after a battery | Show `…` ellipsis for "many cells" |
| `left, ` at the very start | Horizontal orientation |
| `// comment to end of line` | Inline comments ignored by the parser |

---

## Components

### Power

| Code | Means | Examples |
|---|---|---|
| `c` | One cell | `c`, `c6` = 6V cell |
| `cb` (or `b`) | Battery (multi-cell). `b` is an alias. | `cb`, `3cb` = 3 cells, `3cb6` = 3 cells totalling 6V; `3b6` works identically |
| `cb*` | Battery with **unspecified-N** ellipsis | `cb*` shows `…` between cells, for "many cells" without committing to a number |
| `vc` | Variable cell (diagonal arrow) | `vc`, `vc6` |
| `vb` (or `Nvb`) | Variable battery; `N` is the cell count | `vb`, `2vb` = 2-cell variable battery, `vb6` = variable battery 6V, `3vb6` = 3 cells totalling 6V |
| `pdc` | DC power supply | `pdc`, `pdc12` = 12V DC |
| `pac` | AC power supply | `pac`, `pac230` = 230V AC |

Position default: top wall (vertical) or left wall (horizontal). Use `cb!` to reverse polarity.

### Passive

| Code | Means | Examples |
|---|---|---|
| `r` | Fixed resistor | `r`, `r10` = 10Ω, `r.1` = R₁, `r10.1` = R₁ at 10Ω |
| `vr` | Variable resistor / rheostat | `vr`, `vr50` |
| `pot` | Potentiometer | `pot`, `pot10`, `pot(bb)` (wiper drives a bulb) |
| `bb` / `lamp` / `l` | Bulb (filament lamp) | `bb`, `bb.1` = L₁ |
| `htr` | Heater element | `htr` |
| `wire` / `w` | Plain wire (labelled "wire") | `wire`, `wire fat`, `wire wiggle` |

### Switches

| Code | Means |
|---|---|
| `s` / `so` | Open switch |
| `sc` | Closed switch |
| `s2` | Two-way (SPDT) switch. Bind branches with `s2(A;B)` |

### Meters

| Code | Means | Examples |
|---|---|---|
| `a` | Ammeter | `a`, `a.1` = A₁, `a1` = ammeter reading 1A |
| `v` | Voltmeter | `v`, `v.2` = V₂, `v6` = reading 6V |
| `/X` | Voltmeter tapped across X | `/r10` puts a voltmeter across the resistor, no extra wire |

The convention for subscripts vs values is consistent across components: `.X` is a subscript, `N` is a value, `N.X` combines them. So `r10.1` = R₁ at 10Ω; `a.1` = A₁ (no reading); `a1` = ammeter reading 1A; `a1.1` = A₁ reading 1A.

### Semiconductors

| Code | Means |
|---|---|
| `d` | Diode (current chevron auto-orients) |
| `led` | Light-emitting diode |
| `f` / `fu` | Fuse. `f5` = 5A rating |
| `th` / `ntc` | Thermistor (NTC) |
| `ldr` | Light-dependent resistor |

### Transducers

| Code | Means |
|---|---|
| `bz` / `buz` | Buzzer / bell |
| `sp` / `ls` | Loudspeaker |
| `mic` | Microphone |
| `m` / `mot` | Motor |
| `g` / `gen` | Generator |
| `e` / `gnd` | Earth / ground symbol |
| `tr` | Transformer (defaults to right wall, generates a load loop) |

---

## SI prefixes on values (v2 — case-sensitive)

Values can carry SI prefixes. The DSL is **case-sensitive for prefixes**: `M` (mega) ≠ `m` (milli), `k` (kilo) ≠ `K` (not used).

| Prefix | Letter | Example | Means |
|---|---|---|---|
| pico | `p` | `r10p` | 10 pΩ |
| nano | `n` | `r10n` | 10 nΩ |
| micro | `u` or `µ` | `r10u`, `r10µ` | 10 µΩ |
| micro (ASCII) | `mu` | `r10mu` | 10 µΩ (use when µ isn't easy to type) |
| milli | `m` | `r10m` | 10 mΩ |
| kilo | `k` | `r10k` | 10 kΩ |
| mega | `M` | `r10M` | 10 MΩ |
| mega (ASCII) | `meg` | `r10meg` | 10 MΩ |
| giga | `G` | `r10G` | 10 GΩ |

Prefixes apply to any numeric value: resistor values (`r10k`), capacitor values (when supported), ammeter readings (`a6m` = 6 mA), voltmeter readings, etc. The displayed label uses the proper unicode prefix (µ, Ω).

Worked examples:

| Source | Renders |
|---|---|
| `3cb6,s,r10k,a6m` | 10 kΩ resistor, ammeter showing 6 mA |
| `3cb,s,r10M,r10m,r10mu` | Three resistors: 10 MΩ, 10 mΩ, 10 µΩ in series |
| `3cb,s,a5mohm,r10,/bb,v1Mohm` | Non-ideal ammeter (5 mΩ internal), 10Ω resistor, non-ideal voltmeter across a bulb (1 MΩ internal) |

**Forcing ohms as the unit.** Some components have non-Ω primary units (`bb` is a bulb; its bare-number value isn't usually a resistance). To pin ohms on those, append `ohm` after the number: `bb3ohm` (bulb with 3Ω resistance), `pot10kohm` (potentiometer with 10 kΩ track). This is useful for circuit-rule questions where a bulb has a stated resistance. Redundant on resistors (`r10` and `r10ohm` render identically) but accepted there too.

**Non-ideal meters.** Ammeters and voltmeters can carry a resistance with the same notation: `a5mohm` = ammeter with 5 mΩ internal resistance, `v1Mohm` = voltmeter with 1 MΩ internal resistance. Renders alongside the meter symbol.

---

## Modifiers (after a component word)

Most modifiers are added as extra space-separated words after the component code.

| Modifier | Effect |
|---|---|
| `closed` / `on` | Force switch closed |
| `open` / `off` | Force switch open |
| `pm` / `polarity` | Show explicit + / − polarity (batteries, cells) |
| `fat` / `thick` | Thick line (wires only) |
| `wiggle` / `wiggly` | Wavy line (wires only — denotes long-distance link) |
| `NV` | Annotate voltage-across, e.g. `r10 6V` |
| `NA` | Annotate current-through, e.g. `r10 2A` |
| `NV NA` | Both at once, e.g. `r10 6V 0.5A` (resistor labelled 10Ω with 6V across and 0.5A through) |
| `N` (bare) | Primary value, e.g. `r 10` is the same as `r10` |
| Skip words | `ohms`, `volts`, `amps` etc. allowed for readability — parser ignores them |

---

## Worked examples

| Source | Description |
|---|---|
| `3cb6,s,r10.1,/bb,a.1` | 3-cell 6V battery, switch, R₁ = 10Ω, voltmeter across a bulb, ammeter A₁ |
| `3cb,>,s,r,>2,bb` | Battery, chevron, switch, resistor, chevron labelled 2A, bulb |
| `2cb!,s,bb` | Battery reversed (current goes the other way round the loop) |
| `2cb,r:r10.1;r20.2;v` | Parallel: three branches — R₁=10Ω, R₂=20Ω, voltmeter |
| `3cb-,sc,r,>,/bb,a+` | Battery on left, closed switch + resistor + chevron + voltmeter-on-bulb at bottom, ammeter on right |
| `3cb,s,d,r10,led` | Diode oriented automatically with current direction, LED at end |
| `3cb,s,r10 6V,bb` | Resistor annotated "6V" (voltage-across label) |
| `2cb,s,htr,m,e` | Battery, switch, heater, motor, earth |
| `pac,s,bz,sp,mic` | AC supply, switch, buzzer, speaker, microphone |
| `cb* pm,s,d,bb` | Battery with "many cells" ellipsis + explicit polarity, diode auto-oriented, bulb |
| `pac,s,tr,r10` | AC supply with transformer; transformer defaults to right wall and pulls a load loop on the right side |
| `3cb,s2(bb;r10,bb)` | Two-way switch routing to two branches: bulb / resistor+bulb |
| `left, 3cb6, s, r10, bb` | Horizontal layout |
| `2cb,s,pot,bb` | Potentiometer in series |
| `2cb,s,wire,r10,bb` | Plain "wire" component labelled |
| `2cb,s,pot(bb)` | Potentiometer with its wiper driving a bulb branch |
| `2cb,s,wire fat,r10,wire wiggle,bb` | Mixed wire styles |
| `3cb,r,v` | Voltmeter in series (deliberately wrong — useful for "what's wrong?" questions) |
| `2cb,s,pot!(bb)` | Potentiometer flipped so the wiper branch trails to the right |
| `3cb6,s,r10k,a6m` | SI prefixes: 10 kΩ resistor, ammeter reading 6 mA |
| `2vb,s,r,bb` | 2-cell variable battery |
| `3cb,s,r10M,r10m,r10mu` | Mega / milli / micro in one circuit (case-sensitive) |
| `2cb,s,bb3ohm,pot10kohm` | Force ohms on bulb (3Ω) and potentiometer (10 kΩ) |
| `3cb,s,a5mohm,r10,/bb,v1Mohm` | Non-ideal meters: ammeter 5 mΩ, voltmeter 1 MΩ |

---

## Authoring tips

**Subscript convention.** Use `.1`, `.2`, ... for numbered references (`r.1` → R₁, `cb.2` → B₂, `a.1` → A₁). Use letter subscripts where physics convention prefers them (`v.s` → V_s for supply voltage). Subscripts work on any component including batteries.

**Bake values into the DSL.** Don't write "the resistor is 10Ω" in the prompt and `r` in the diagram. Write `r10` and the value displays as part of the symbol.

**Annotations vs labels.** `r10` shows "10 Ω" next to the resistor. `r10 6V` shows the 10 Ω value AND a "6V" annotation (voltage across, useful when the question wants the student to read the PD off the diagram).

**Position defaults.** A simple `cb, s, r, bb` gives a loop with the battery at the top. Adding `+` / `-` only matters when the default doesn't give what you want, or when you have multiple components on the same wall and want to be explicit.

**Two-way switches and potentiometers** bind a branch with parentheses immediately after the component (no comma): `s2(A;B)` and `pot(X)`. Inside the parentheses, normal DSL applies.

**Auto-orientation of diodes** and chevrons. If the circuit has exactly one battery, current direction is deduced (clockwise from a normal battery, anticlockwise from a reversed one) and diodes are auto-oriented to let current through. A `d!` reverses the diode (useful for reverse-biased questions).

---

## When to use the DSL vs static images

If a question's diagram is genuinely a circuit, use the DSL. The renderer is canonical and means the question file stays compact and editable.

If a question shows something the DSL doesn't cover (an oscilloscope trace, a meter face, a graph of V vs t, a chart of resistivity, a physical apparatus photo), use a different diagram kind (or, for now, omit and describe in the prompt). The DSL is for circuits only — it does not draw graphs, waveforms, apparatus, or anything outside the circuit-symbol vocabulary.

---

## Common gotchas

- The very first token can be `left,` to set horizontal orientation. Anywhere else it's parsed as a component name and will error.
- `cb` without a number defaults to 2 cells. Write `3cb` for 3 cells, `1cb` for one cell (equivalent to `c`).
- A potentiometer `pot` without a bound branch is just a labelled symbol. `pot(X)` puts X across the wiper-to-end span. The wiper is on the left by default; `pot!(X)` puts it on the right.
- Voltmeter-across-X via `/X` does NOT add a series wire — it visually drops a tap line above the component and puts a voltmeter on it. Use this rather than wiring a parallel branch when the visual intent is "voltmeter across this thing".
- The DSL is case-sensitive for SI prefixes only. `M` ≠ `m` (mega vs milli); `meg`/`mu` are ASCII-safe alternatives when typing the proper letters is awkward. Component names and all other identifiers can be written in any case (`R10.1`, `r10.1` both work).

---

## Version history

**v1 (2026-05-10).** Initial extraction. Components, composition, position, modifiers, voltmeter taps, wire markers.

**v2 (2026-05-10).** SI prefixes on values, variable cell/battery (`vc`, `vb`, `Nvb`), force-ohms (`bb3ohm`, `pot10kohm`), non-ideal meter resistances. Case-sensitivity policy introduced (for SI prefixes only).
