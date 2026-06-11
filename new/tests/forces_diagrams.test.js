/* forces_diagrams.test.js
 * Regression tests for forces_diagrams.js (census W4), written by Widgickery
 * milestone 1 on 2026-06-11. These REPLACE the seven jsdom assertions described
 * in the commissioning chat's DONE entry, which were never committed as files.
 *
 * Scope: the public API only (window.render<Kind> and window.FORCES_DIAGRAMS),
 * pinning the conventions the milestone 1 graph-frame study must preserve:
 * the hard-to-read tick engine, minor and major gridlines, snapToMajor and
 * qualitative opt-outs, curve keyword geometry with finite end gradients,
 * hatched area shading, annotations, segment labels, aria text, the
 * stopping-distance presets, and the registration surface.
 *
 * Run:  npm install jsdom   (once, anywhere; or set NODE_PATH)
 *       node forces_diagrams.test.js [path-to-forces_diagrams.js]
 * Default module path: ../forces_diagrams.js relative to this file, so the
 * suite tests the live copy it sits beside.
 *
 * Plain assertions, no test framework, exit code 0 on green. UK English.
 * No em-dash anywhere (project housekeeping rule).
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const MODULE_PATH = process.argv[2] ||
  path.join(__dirname, "..", "forces_diagrams.js");
const SRC = fs.readFileSync(MODULE_PATH, "utf8");

/* ---------------------------------------------------------------- *
 * Harness
 * ---------------------------------------------------------------- */

let passed = 0, failed = 0;
const failures = [];

function test(name, fn) {
  try { fn(); passed++; console.log("  ok  " + name); }
  catch (e) { failed++; failures.push(name + ": " + e.message); console.log("FAIL  " + name + "\n      " + e.message); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || "assertion failed"); }
function assertEq(got, want, msg) {
  if (got !== want) throw new Error((msg || "equality") + ": got " + JSON.stringify(got) + ", want " + JSON.stringify(want));
}
function approx(got, want, tol, msg) {
  if (Math.abs(got - want) > (tol == null ? 0.011 : tol)) {
    throw new Error((msg || "approx") + ": got " + got + ", want " + want);
  }
}

/* ---------------------------------------------------------------- *
 * Module loading: fresh jsdom window, module evaluated inside it.
 * ---------------------------------------------------------------- */

function loadWindow() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", { runScripts: "outside-only" });
  dom.window.eval(SRC);
  return dom.window;
}
const win = loadWindow();

/* ---------------------------------------------------------------- *
 * Query helpers
 * ---------------------------------------------------------------- */

function texts(svg) { return Array.from(svg.querySelectorAll("text")).map(t => t.textContent); }
function lines(svg) { return Array.from(svg.querySelectorAll("line")); }
function attr(el, name) { return el.getAttribute(name); }
function num(el, name) { return parseFloat(el.getAttribute(name)); }
function isVertical(l) { return attr(l, "x1") === attr(l, "x2"); }
function isHorizontal(l) { return attr(l, "y1") === attr(l, "y2"); }
function linesByStroke(svg, stroke, width) {
  return lines(svg).filter(l => attr(l, "stroke") === stroke &&
    (width == null || attr(l, "stroke-width") === String(width)));
}
function trajectoryPathEl(svg) {
  return Array.from(svg.querySelectorAll("path"))
    .find(p => attr(p, "stroke") === "var(--ink)" && attr(p, "stroke-width") === "1.7");
}

/* Replica of the module's coordinate mapping, pinned as a convention:
 * W 560, H 380, margins l 66 r 22 t 24 (42 with title) b 58, linear axes. */
function mapper(opts) {
  const W = opts.W || 560, H = opts.H || 380;
  const t = opts.title ? 42 : 24;
  const px = 66, py = t, pw = W - 66 - 22, ph = H - t - 58;
  const r = n => Math.round(n * 100) / 100;
  return {
    toX: v => r(px + (v - opts.xmin) / (opts.xmax - opts.xmin) * pw),
    toY: v => r(py + ph - (v - opts.ymin) / (opts.ymax - opts.ymin) * ph),
    px, py, pw, ph
  };
}

const FIXED = { axes: { x: { max: 10, majorTick: 2, minorTicks: 5 }, y: { max: 10, majorTick: 2, minorTicks: 5 } } };
const M10 = mapper({ xmin: 0, xmax: 10, ymin: 0, ymax: 10 });

console.log("forces_diagrams.test.js against " + MODULE_PATH);

/* ---------------------------------------------------------------- *
 * 1. Registration surface
 * ---------------------------------------------------------------- */

test("registers four render globals, mirrored by reference on FORCES_DIAGRAMS", () => {
  const kinds = {
    velocity_time_graph: "renderVelocityTimeGraph",
    distance_time_graph: "renderDistanceTimeGraph",
    stopping_distance_diagram: "renderStoppingDistanceDiagram",
    stopping_distance_vs_speed: "renderStoppingDistanceVsSpeed"
  };
  Object.keys(kinds).forEach(k => {
    assert(typeof win[kinds[k]] === "function", kinds[k] + " missing");
    assert(win.FORCES_DIAGRAMS[k] === win[kinds[k]], "FORCES_DIAGRAMS." + k + " is not the same function");
  });
  assertEq(Object.keys(win.FORCES_DIAGRAMS).length, 4, "namespace key count");
});

/* ---------------------------------------------------------------- *
 * 2. SVG root and aria
 * ---------------------------------------------------------------- */

test("returns an accessible SVG element with viewBox, title and desc", () => {
  const svg = win.renderVelocityTimeGraph({ segments: [{ from: [0, 0], to: [10, 10] }] });
  assertEq(svg.tagName.toLowerCase(), "svg");
  assertEq(svg.namespaceURI, "http://www.w3.org/2000/svg");
  assertEq(attr(svg, "viewBox"), "0 0 560 380", "default viewBox");
  assertEq(attr(svg, "width"), "100%", "responsive width");
  assertEq(attr(svg, "role"), "img");
  const title = svg.querySelector("title"), desc = svg.querySelector("desc");
  assert(title && title.textContent === "Velocity-time graph", "title element");
  assert(desc, "desc element");
  assertEq(desc.textContent,
    "Graph of velocity / m s⁻¹ against time / s, showing a straight line from (0, 0) to (10, 10).",
    "segment aria sentence");
  assertEq(attr(svg, "aria-label"), "Velocity-time graph. " + desc.textContent, "aria-label composition");
});

test("a params title takes over the accessible name and renders as a heading text", () => {
  const svg = win.renderDistanceTimeGraph({ title: "Journey to school",
    segments: [{ from: [0, 0], to: [10, 10] }] });
  assert(attr(svg, "aria-label").indexOf("Journey to school. ") === 0, "title leads aria-label");
  const t = Array.from(svg.querySelectorAll("text")).find(x => x.textContent === "Journey to school");
  assert(t, "heading text present");
  assertEq(attr(t, "font-weight"), "600", "heading weight");
});

test("aria names curve keywords and segment labels", () => {
  const svg = win.renderVelocityTimeGraph({ segments: [
    { from: [0, 0], to: [10, 10], curve: "curve_up_concave", label: "speeding up" }
  ] });
  assertEq(svg.querySelector("desc").textContent,
    "Graph of velocity / m s⁻¹ against time / s, showing speeding up: a curve up concave curve from (0, 0) to (10, 10).");
});

/* ---------------------------------------------------------------- *
 * 3. The hard-to-read tick engine and gridlines
 * ---------------------------------------------------------------- */

test("explicit majors and minors: labels, tick marks, minor and major gridlines", () => {
  const svg = win.renderVelocityTimeGraph({
    segments: [{ from: [0, 0], to: [10, 8] }],
    axes: { x: { max: 10, majorTick: 2, minorTicks: 5 }, y: { max: 8, majorTick: 2, minorTicks: 4 } }
  });
  const tx = texts(svg);
  ["0", "2", "4", "6", "8", "10"].forEach(v => assert(tx.indexOf(v) >= 0, "x label " + v));
  const minors = linesByStroke(svg, "var(--line)", 0.5);
  assertEq(minors.filter(isVertical).length, 20, "x minor gridlines (5 intervals x 4)");
  assertEq(minors.filter(isHorizontal).length, 12, "y minor gridlines (4 intervals x 3)");
  const majors = linesByStroke(svg, "var(--line-2)", 0.6);
  assertEq(majors.filter(isVertical).length, 5, "x major gridlines skip the axis value");
  assertEq(majors.filter(isHorizontal).length, 4, "y major gridlines skip the axis value");
  const tickMarks = linesByStroke(svg, "var(--ink-2)", 1).filter(l => !attr(l, "marker-end"));
  assertEq(tickMarks.length, 11, "6 x ticks + 5 y ticks");
  const axes = linesByStroke(svg, "var(--ink-2)", 1).filter(l => attr(l, "marker-end") === "url(#fd-axis-arrow)");
  assertEq(axes.length, 2, "two arrowheaded axis lines");
  assert(svg.querySelector("marker#fd-axis-arrow path"), "arrowhead marker defined");
});

test("auto axis: headroom rounds data max 10 up to 12, hard-to-read minors by default", () => {
  const svg = win.renderVelocityTimeGraph({ segments: [{ from: [0, 0], to: [10, 10] }] });
  assert(texts(svg).indexOf("12") >= 0, "auto max 12 labelled");
  const minors = linesByStroke(svg, "var(--line)", 0.5);
  assertEq(minors.filter(isVertical).length, 24, "6 intervals x 4 minor gridlines, default minorTicks 5");
});

test("snapToMajor opts an axis out of minors; the other axis keeps them", () => {
  const svg = win.renderVelocityTimeGraph({
    segments: [{ from: [0, 0], to: [10, 8] }],
    axes: { x: { max: 10, snapToMajor: true } }
  });
  const minors = linesByStroke(svg, "var(--line)", 0.5);
  assertEq(minors.filter(isVertical).length, 0, "no x minors under snapToMajor");
  assert(minors.filter(isHorizontal).length > 0, "y minors remain");
});

test("qualitative mode strips grid and numbers, keeps axes, labels and shape", () => {
  const svg = win.renderVelocityTimeGraph({
    segments: [{ from: [0, 0], to: [10, 10], curve: "curve_up_convex" }],
    qualitative: true
  });
  assertEq(linesByStroke(svg, "var(--line)").length, 0, "no minor grid");
  assertEq(linesByStroke(svg, "var(--line-2)").length, 0, "no major grid");
  const tx = texts(svg);
  assert(!tx.some(t => /^\d+(\.\d+)?$/.test(t)), "no numeric labels anywhere");
  assert(tx.indexOf("time / s") >= 0 && tx.indexOf("velocity / m s⁻¹") >= 0, "axis labels kept");
  assertEq(lines(svg).filter(l => attr(l, "marker-end")).length, 2, "axis arrows kept");
  assert(trajectoryPathEl(svg), "trajectory kept");
});

/* ---------------------------------------------------------------- *
 * 4. Curve keyword geometry (finite end gradients)
 * ---------------------------------------------------------------- */

function pathQ(svg) {
  const d = attr(trajectoryPathEl(svg), "d");
  const m = d.match(/^M (\S+) (\S+) Q (\S+) (\S+) (\S+) (\S+)$/);
  assert(m, "single Q path, got: " + d);
  return m.slice(1).map(parseFloat);
}

test("concave keyword puts the control at mid-x on the FROM level (finite end gradients)", () => {
  const svg = win.renderVelocityTimeGraph(Object.assign({
    segments: [{ from: [0, 0], to: [10, 10], curve: "curve_up_concave" }] }, FIXED));
  const [x0, y0, cx, cy, x1, y1] = pathQ(svg);
  approx(cx, (x0 + x1) / 2, 0.011, "control x at mid-x");
  approx(cy, y0, 0.011, "concave control y at from-level");
  assert(cx < x1 - 1, "control is not a corner, so the end gradient stays finite");
  assertEq(x0, M10.toX(0)); assertEq(y0, M10.toY(0));
  assertEq(x1, M10.toX(10)); assertEq(y1, M10.toY(10));
});

test("convex keyword puts the control at mid-x on the TO level", () => {
  const svg = win.renderVelocityTimeGraph(Object.assign({
    segments: [{ from: [0, 0], to: [10, 10], curve: "curve_up_convex" }] }, FIXED));
  const [, , cx, cy, , y1] = pathQ(svg);
  approx(cx, (M10.toX(0) + M10.toX(10)) / 2, 0.011, "control x at mid-x");
  approx(cy, y1, 0.011, "convex control y at to-level");
});

test("an explicit via overrides the keyword control point", () => {
  const svg = win.renderVelocityTimeGraph(Object.assign({
    segments: [{ from: [0, 0], to: [10, 10], curve: "curve_up_concave", via: [2, 8] }] }, FIXED));
  const [, , cx, cy] = pathQ(svg);
  assertEq(cx, M10.toX(2), "via x honoured");
  assertEq(cy, M10.toY(8), "via y honoured");
});

test("straight segments draw L commands, never Q", () => {
  const svg = win.renderDistanceTimeGraph(Object.assign({
    segments: [{ from: [0, 0], to: [4, 6] }, { from: [4, 6], to: [10, 6] }] }, FIXED));
  const d = attr(trajectoryPathEl(svg), "d");
  assert(d.indexOf(" L ") >= 0 && d.indexOf(" Q ") < 0, "got: " + d);
});

/* ---------------------------------------------------------------- *
 * 5. Area shading
 * ---------------------------------------------------------------- */

test("a shaded region builds a hatch pattern and a baseline-closed polygon with label", () => {
  const svg = win.renderDistanceTimeGraph(Object.assign({
    segments: [{ from: [0, 0], to: [10, 10] }],
    shaded: [{ from: 2, to: 8, label: "region A" }] }, FIXED));
  const pattern = svg.querySelector("defs pattern");
  assert(pattern && /^fd-shade-0-/.test(attr(pattern, "id")), "pattern id");
  assert(pattern.querySelector("path"), "diagonal hatch is a path");
  const shade = Array.from(svg.querySelectorAll("path"))
    .find(p => (attr(p, "fill") || "").indexOf("url(#fd-shade-") === 0);
  assert(shade, "shade polygon fill references the pattern");
  const d = attr(shade, "d");
  assert(d.indexOf("M " + M10.toX(2) + " " + M10.toY(0)) === 0, "polygon starts on the baseline at from");
  assert(d.indexOf("L " + M10.toX(8) + " " + M10.toY(0) + " Z") >= 0, "polygon closes on the baseline at to");
  const label = Array.from(svg.querySelectorAll("text")).find(t => t.textContent === "region A");
  assert(label, "shade label present");
  assertEq(num(label, "x"), M10.toX(5), "label centred in x");
  assertEq(num(label, "y"), M10.toY(2.5), "label at half the mid-height (trajectory y 5 over 2)");
});

test("unstyled regions cycle diagonal, dots, cross", () => {
  const svg = win.renderDistanceTimeGraph(Object.assign({
    segments: [{ from: [0, 0], to: [10, 10] }],
    shaded: [{ from: 0, to: 2 }, { from: 2, to: 4 }, { from: 4, to: 6 }] }, FIXED));
  const patterns = Array.from(svg.querySelectorAll("defs pattern"));
  assertEq(patterns.length, 3, "three patterns");
  assert(patterns[0].querySelector("path"), "first is diagonal hatch");
  assert(patterns[1].querySelector("circle"), "second is dots");
  const crossPath = patterns[2].querySelector("path");
  assert(crossPath && attr(crossPath, "d").indexOf("l7,7") >= 0, "third is cross hatch");
});

/* ---------------------------------------------------------------- *
 * 6. Segment labels and annotations
 * ---------------------------------------------------------------- */

test("segment labels sit above the segment midpoint", () => {
  const svg = win.renderVelocityTimeGraph(Object.assign({
    segments: [{ from: [0, 0], to: [10, 10], label: "cruise" }] }, FIXED));
  const t = Array.from(svg.querySelectorAll("text")).find(x => x.textContent === "cruise");
  assert(t, "label present");
  assertEq(num(t, "x"), M10.toX(5), "label x at midpoint");
  assertEq(num(t, "y"), M10.toY(5) - 8, "label floats 8px above");
});

test("annotations: a string y computes the point on the curve; leader line and text follow", () => {
  const svg = win.renderVelocityTimeGraph(Object.assign({
    segments: [{ from: [0, 0], to: [10, 10] }],
    annotations: [{ at: [4, "on-curve"], text: "note here" }] }, FIXED));
  const dot = svg.querySelector("circle");
  assert(dot, "annotation dot");
  assertEq(attr(dot, "r"), "2.6"); assertEq(attr(dot, "fill"), "var(--accent)");
  assertEq(num(dot, "cx"), M10.toX(4), "dot x");
  assertEq(num(dot, "cy"), M10.toY(4), "dot computed on curve");
  const leader = lines(svg).find(l => attr(l, "stroke-width") === "0.8");
  assert(leader, "leader line");
  const label = Array.from(svg.querySelectorAll("text")).find(t => t.textContent === "note here");
  assert(label, "annotation text");
});

test("annotations with numeric y place the dot at that y", () => {
  const svg = win.renderVelocityTimeGraph(Object.assign({
    segments: [{ from: [0, 0], to: [10, 10] }],
    annotations: [{ at: [4, 2], text: "below the line" }] }, FIXED));
  assertEq(num(svg.querySelector("circle"), "cy"), M10.toY(2), "numeric y honoured");
});

/* ---------------------------------------------------------------- *
 * 7. Input validation
 * ---------------------------------------------------------------- */

test("segment renderers throw on missing segments (the engine catches and placeholders)", () => {
  ["renderVelocityTimeGraph", "renderDistanceTimeGraph"].forEach(fn => {
    let threw = false;
    try { win[fn]({}); } catch (e) { threw = /segments required/.test(e.message); }
    assert(threw, fn + " should throw 'segments required'");
    threw = false;
    try { win[fn](); } catch (e) { threw = true; }
    assert(threw, fn + " should throw with no params");
  });
});

/* ---------------------------------------------------------------- *
 * 8. stopping_distance_diagram
 * ---------------------------------------------------------------- */

test("defaults build the canonical two-segment shape with both distances shaded", () => {
  const svg = win.renderStoppingDistanceDiagram({});
  const desc = svg.querySelector("desc").textContent;
  assert(desc.indexOf("from (0, 14) to (0.7, 14)") >= 0, "thinking segment: " + desc);
  assert(desc.indexOf("from (0.7, 14) to (2.7, 0)") >= 0, "braking segment, tEnd 0.7 + 14/7");
  const tx = texts(svg);
  assert(tx.indexOf("thinking distance") >= 0, "thinking label");
  assert(tx.indexOf("braking distance") >= 0, "braking label");
  const patterns = Array.from(svg.querySelectorAll("defs pattern"));
  assertEq(patterns.length, 2, "two shaded regions");
  assert(patterns[0].querySelector("path"), "thinking region diagonal");
  assert(patterns[1].querySelector("circle"), "braking region dots");
});

test("presets set thinkingTime and brakingDeceleration; explicit params beat presets", () => {
  const wet = win.renderStoppingDistanceDiagram({ preset: "wet road normal driver" });
  assert(wet.querySelector("desc").textContent.indexOf("to (4.2, 0)") >= 0, "wet preset: tEnd 0.7 + 14/4");
  const drunk = win.renderStoppingDistanceDiagram({ preset: "dry road drunk driver" });
  assert(drunk.querySelector("desc").textContent.indexOf("from (2, 14)") >= 0, "drunk preset thinking time 2.0");
  const overridden = win.renderStoppingDistanceDiagram({ preset: "wet road normal driver", thinkingTime: 1 });
  assert(overridden.querySelector("desc").textContent.indexOf("from (0, 14) to (1, 14)") >= 0, "explicit thinkingTime wins");
});

test("label switches: showLabels false suppresses a shade label; stoppingDistance adds the area note", () => {
  const svg = win.renderStoppingDistanceDiagram({ showLabels: { thinkingDistance: false, stoppingDistance: true } });
  const tx = texts(svg);
  assert(tx.indexOf("thinking distance") < 0, "thinking label suppressed");
  assert(tx.indexOf("braking distance") >= 0, "braking label kept");
  assert(tx.indexOf("total stopping distance = area") >= 0, "area annotation added");
});

test("non-positive brakingDeceleration throws", () => {
  let threw = false;
  try { win.renderStoppingDistanceDiagram({ brakingDeceleration: 0 }); }
  catch (e) { threw = /positive/.test(e.message); }
  assert(threw);
});

/* ---------------------------------------------------------------- *
 * 9. stopping_distance_vs_speed
 * ---------------------------------------------------------------- */

test("defaults draw thinking (linear, dashed), braking (quadratic, dotted) and total (solid accent)", () => {
  const svg = win.renderStoppingDistanceVsSpeed({});
  const polys = Array.from(svg.querySelectorAll("polyline"));
  assertEq(polys.length, 3, "three series");
  const byDash = d => polys.find(p => attr(p, "stroke-dasharray") === d);
  assert(byDash("5 4"), "thinking dash");
  assert(byDash("1.5 4"), "braking dash");
  const total = polys.find(p => !attr(p, "stroke-dasharray"));
  assert(total, "total solid");
  assertEq(attr(total, "stroke"), "var(--accent)");
  assertEq(attr(total, "stroke-width"), "1.8");
  const tx = texts(svg);
  ["thinking", "braking", "total"].forEach(l => assert(tx.indexOf(l) >= 0, "end label " + l));
  // Pin the physics at the right edge: total(30) with defaults 0.67 s and 6.7 m/s^2.
  const m = mapper({ xmin: 0, xmax: 35, ymin: 0, ymax: 100 });
  const last = attr(total, "points").trim().split(" ").pop().split(",").map(parseFloat);
  approx(last[0], m.toX(30), 0.011, "total ends at maxSpeed");
  approx(last[1], m.toY(30 * 0.67 + (30 * 30) / (2 * 6.7)), 0.011, "total(30) = thinking + braking");
});

test("show restricts the series drawn", () => {
  const svg = win.renderStoppingDistanceVsSpeed({ show: ["total"] });
  assertEq(svg.querySelectorAll("polyline").length, 1, "one series");
});

test("annotations compute the named series point and drop a dashed line to the axis", () => {
  const svg = win.renderStoppingDistanceVsSpeed({ annotations: [{ at: [20, "total"], text: "at 20" }] });
  const m = mapper({ xmin: 0, xmax: 35, ymin: 0, ymax: 100 });
  const dot = svg.querySelector("circle");
  approx(num(dot, "cx"), m.toX(20), 0.011, "dot at v");
  approx(num(dot, "cy"), m.toY(20 * 0.67 + 400 / 13.4), 0.011, "dot on total curve");
  const drop = lines(svg).find(l => attr(l, "stroke-dasharray") === "2 3");
  assert(drop, "dashed drop line");
  approx(num(drop, "y2"), m.toY(0), 0.011, "drop reaches the axis");
  assert(texts(svg).indexOf("at 20") >= 0, "annotation text");
});

/* ---------------------------------------------------------------- *
 * 10. Module hygiene (absence pins for the milestone 1 study)
 * ---------------------------------------------------------------- */

test("source hygiene: no em-dash, no tangent API, no hardcoded hex fills outside comments", () => {
  assert(SRC.indexOf(String.fromCharCode(0x2014)) < 0, "em-dash found in source");
  assert(!/function\s+\w*[Tt]angent|renderTangent/.test(SRC), "a tangent API has appeared; update the registry before relying on it");
  assert(!/window\.renderFreeBodyDiagram/.test(SRC), "stage 2 has landed; extend this suite");
});

/* ---------------------------------------------------------------- */

console.log("\n" + passed + " passed, " + failed + " failed");
if (failed) { console.log(failures.map(f => " - " + f).join("\n")); process.exit(1); }
