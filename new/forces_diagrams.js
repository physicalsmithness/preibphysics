/* forces_diagrams.js
 * Forces (Topic 1) SVG diagram renderers for the Pre-IB physics engine.
 *
 * Commission: BRIEF_forces_diagrams.md (2026-06-09). Reference precedent:
 * circuit_diagram.js / window.renderCircuitDSL, wired in engine.js's
 * renderDiagramPlaceholder. Each renderer is a global window.render<Kind>(params)
 * returning a single <svg> DOM element; the engine wraps it in a per-kind div and
 * falls back to a params-dump placeholder if the function is absent or throws.
 *
 * Stage 1 (this file, graph family):
 *   - velocity_time_graph      -> window.renderVelocityTimeGraph
 *   - distance_time_graph      -> window.renderDistanceTimeGraph
 *   - stopping_distance_diagram-> window.renderStoppingDistanceDiagram
 *   - stopping_distance_vs_speed-> window.renderStoppingDistanceVsSpeed
 * Stage 2 (appended later): free_body_diagram, acceleration_apparatus, object_scene.
 *
 * Conventions (BRIEF_forces_diagrams.md sections 2, 4, 7):
 *   - Vanilla SVG via createElementNS. No libraries. No external assets.
 *   - Colours via CSS variables only (--ink, --ink-2, --muted, --line, --line-2,
 *     --accent, --paper, --bg). Never hardcode hex.
 *   - Every diagram carries <title> + <desc> for aria. role="img" + aria-label.
 *   - Hard-to-read tick convention is the default on graph kinds: data lands off
 *     the integer majors and minor subdivisions force the student to count. An
 *     axis may set majorTick / minorTicks, or snapToMajor:true to opt out.
 *   - Stroke weights: hairline grid 0.6, axes 1, trajectory 1.6, emphasis 2.
 *   - No em-dash anywhere (project housekeeping rule).
 *
 * Defaults documented in DIAGRAM_KINDS_FORCES.md.
 */
(function () {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";

  /* ------------------------------------------------------------------ *
   * Low-level SVG helpers
   * ------------------------------------------------------------------ */

  // Create an SVG element with attributes and children (strings become text).
  function E(tag, attrs, children) {
    var node = document.createElementNS(SVGNS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] == null) return;
        node.setAttribute(k, String(attrs[k]));
      });
    }
    if (children != null) {
      if (!Array.isArray(children)) children = [children];
      children.forEach(function (c) {
        if (c == null) return;
        node.appendChild(typeof c === "string" || typeof c === "number"
          ? document.createTextNode(String(c)) : c);
      });
    }
    return node;
  }

  // Root <svg> with viewBox, responsive sizing, accessible title + desc.
  function svgRoot(w, h, title, desc) {
    var svg = E("svg", {
      xmlns: SVGNS,
      viewBox: "0 0 " + w + " " + h,
      width: "100%",
      "data-w": w,
      "data-h": h,
      role: "img",
      "aria-label": title + (desc ? (". " + desc) : ""),
      "font-family": "var(--font-sans, ui-sans-serif, system-ui, sans-serif)"
    });
    svg.appendChild(E("title", null, title));
    if (desc) svg.appendChild(E("desc", null, desc));
    return svg;
  }

  function text(x, y, str, opts) {
    opts = opts || {};
    return E("text", {
      x: round(x), y: round(y),
      "font-size": opts.size || 13,
      "font-family": opts.serif
        ? "var(--font-serif, 'Iowan Old Style', Georgia, serif)"
        : "var(--font-sans, ui-sans-serif, system-ui, sans-serif)",
      "font-weight": opts.weight || 400,
      fill: opts.fill || "var(--ink)",
      "text-anchor": opts.anchor || "start",
      "dominant-baseline": opts.baseline || "auto",
      transform: opts.transform || null,
      "letter-spacing": opts.tracking || null
    }, str);
  }

  function line(x1, y1, x2, y2, stroke, width, dash) {
    return E("line", {
      x1: round(x1), y1: round(y1), x2: round(x2), y2: round(y2),
      stroke: stroke || "var(--ink)",
      "stroke-width": width || 1,
      "stroke-dasharray": dash || null,
      "stroke-linecap": "round"
    });
  }

  function round(n) { return Math.round(n * 100) / 100; }

  /* ------------------------------------------------------------------ *
   * Number formatting and the hard-to-read tick engine
   * ------------------------------------------------------------------ */

  function fmt(n) {
    if (!isFinite(n)) return String(n);
    var r = Math.round(n * 1000) / 1000;
    if (Math.abs(r) < 1e-9) r = 0;
    return String(r);
  }

  // A "nice" step (1, 2, 2.5, 5 x 10^k) giving roughly `target` intervals.
  function niceStep(range, target) {
    target = target || 6;
    var raw = range / target;
    var mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var norm = raw / mag;
    var step;
    if (norm < 1.5) step = 1;
    else if (norm < 3) step = 2;
    else if (norm < 4) step = 2.5;
    else if (norm < 7.5) step = 5;
    else step = 10;
    return step * mag;
  }

  // Resolve an axis spec into a concrete tick scheme.
  // axis: { label, min, max, majorTick, minorTicks, snapToMajor }
  // The hard-to-read default: integer-ish majors with `minorTicks` subdivisions
  // between them (each minor = majorTick / minorTicks), so a value at 3.8 forces
  // the student to count divisions. snapToMajor opts out (no minors).
  function resolveAxis(axis, dataMax) {
    axis = axis || {};
    var min = (axis.min != null) ? axis.min : 0;
    var max = (axis.max != null) ? axis.max : null;
    if (max == null) {
      var dm = (dataMax != null && isFinite(dataMax)) ? dataMax : 1;
      // Leave a little headroom and round up to a sensible major.
      var step0 = niceStep(Math.max(dm - min, 1e-6), 6);
      max = Math.ceil((dm * 1.08) / step0) * step0;
      if (max <= dm) max += step0;
    }
    var snap = !!axis.snapToMajor;
    var majorTick = axis.majorTick;
    if (majorTick == null) majorTick = niceStep(max - min, snap ? 5 : 6);
    var minorTicks = snap ? 1 : (axis.minorTicks != null ? axis.minorTicks : 5);
    if (minorTicks < 1) minorTicks = 1;
    return {
      label: axis.label || "",
      min: min, max: max,
      majorTick: majorTick,
      minorTicks: minorTicks,
      snap: snap
    };
  }

  // Generate major values [min .. max] inclusive (tolerant of float drift).
  function majorValues(ax) {
    var out = [], v = ax.min, guard = 0;
    while (v <= ax.max + ax.majorTick * 1e-6 && guard < 1000) {
      out.push(Math.round(v * 1e6) / 1e6);
      v += ax.majorTick; guard++;
    }
    return out;
  }

  /* ------------------------------------------------------------------ *
   * Graph core: frame, axes, ticks, labels. Returns coordinate mappers
   * so each renderer can draw its own series into the same plot.
   * ------------------------------------------------------------------ */

  function makeGraph(opts) {
    var W = opts.width || 560;
    var H = opts.height || 380;
    var m = { l: 66, r: 22, t: opts.title ? 42 : 24, b: 58 };
    var px = m.l, py = m.t;
    var pw = W - m.l - m.r, ph = H - m.t - m.b;

    var xa = resolveAxis(opts.xAxis, opts.xDataMax);
    var ya = resolveAxis(opts.yAxis, opts.yDataMax);

    function toX(v) { return px + (v - xa.min) / (xa.max - xa.min) * pw; }
    function toY(v) { return py + ph - (v - ya.min) / (ya.max - ya.min) * ph; }

    var svg = svgRoot(W, H, opts.title || opts.ariaTitle || "Graph", opts.ariaDesc);
    var defs = E("defs");
    svg.appendChild(defs);
    // Arrowhead marker for axes.
    defs.appendChild(arrowMarker("fd-axis-arrow", "var(--ink-2)"));

    var g = E("g");
    svg.appendChild(g);

    // Title
    if (opts.title) {
      g.appendChild(text(px, m.t - 22, opts.title, { size: 14, weight: 600, serif: true, fill: "var(--ink)", baseline: "middle" }));
    }

    // Minor ticks (hairlines) first, so majors sit on top.
    var xMaj = majorValues(xa), yMaj = majorValues(ya);

    function drawMinors(ax, isX) {
      if (ax.snap) return;
      var maj = isX ? xMaj : yMaj;
      for (var i = 0; i < maj.length - 1; i++) {
        var sub = ax.majorTick / ax.minorTicks;
        for (var k = 1; k < ax.minorTicks; k++) {
          var val = maj[i] + sub * k;
          if (val > ax.max + 1e-9) break;
          if (isX) {
            var xx = toX(val);
            g.appendChild(line(xx, py + ph, xx, py + ph - 5, "var(--line-2)", 0.6));
          } else {
            var yy = toY(val);
            g.appendChild(line(px, yy, px + 5, yy, "var(--line-2)", 0.6));
          }
        }
      }
    }
    drawMinors(xa, true);
    drawMinors(ya, false);

    // Axis lines with arrowheads.
    g.appendChild(E("line", {
      x1: round(px), y1: round(py + ph), x2: round(px + pw + 6), y2: round(py + ph),
      stroke: "var(--ink-2)", "stroke-width": 1, "marker-end": "url(#fd-axis-arrow)"
    }));
    g.appendChild(E("line", {
      x1: round(px), y1: round(py + ph), x2: round(px), y2: round(py - 6),
      stroke: "var(--ink-2)", "stroke-width": 1, "marker-end": "url(#fd-axis-arrow)"
    }));

    // Major ticks + numeric labels.
    xMaj.forEach(function (v) {
      var xx = toX(v);
      g.appendChild(line(xx, py + ph, xx, py + ph + 7, "var(--ink-2)", 1));
      g.appendChild(text(xx, py + ph + 21, fmt(v), { size: 11.5, anchor: "middle", fill: "var(--muted)" }));
    });
    yMaj.forEach(function (v) {
      var yy = toY(v);
      g.appendChild(line(px, yy, px - 7, yy, "var(--ink-2)", 1));
      g.appendChild(text(px - 11, yy, fmt(v), { size: 11.5, anchor: "end", baseline: "middle", fill: "var(--muted)" }));
    });

    // Axis labels.
    if (xa.label) {
      g.appendChild(text(px + pw / 2, H - 12, xa.label, { size: 12.5, anchor: "middle", fill: "var(--ink-2)" }));
    }
    if (ya.label) {
      g.appendChild(text(18, py + ph / 2, ya.label, {
        size: 12.5, anchor: "middle", fill: "var(--ink-2)",
        transform: "rotate(-90 18 " + round(py + ph / 2) + ")"
      }));
    }

    return { svg: svg, g: g, defs: defs, toX: toX, toY: toY,
             xa: xa, ya: ya, plot: { x: px, y: py, w: pw, h: ph } };
  }

  function arrowMarker(id, color) {
    var marker = E("marker", {
      id: id, viewBox: "0 0 8 8", refX: 6, refY: 4,
      markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse"
    });
    marker.appendChild(E("path", { d: "M0,1 L6,4 L0,7 Z", fill: color || "var(--ink-2)" }));
    return marker;
  }

  function hatchPattern(id, color, kind) {
    // kind: "diagonal" | "dots" | "cross"
    var p = E("pattern", { id: id, width: 7, height: 7, patternUnits: "userSpaceOnUse",
      patternTransform: kind === "cross" ? "rotate(0)" : "" });
    if (kind === "dots") {
      p.appendChild(E("circle", { cx: 3.5, cy: 3.5, r: 1, fill: color, "fill-opacity": 0.55 }));
    } else if (kind === "cross") {
      p.appendChild(E("path", { d: "M0,0 l7,7 M7,0 l-7,7", stroke: color, "stroke-width": 0.6, "stroke-opacity": 0.5 }));
    } else {
      p.appendChild(E("path", { d: "M0,7 l7,-7 M-1,1 l2,-2 M6,8 l2,-2", stroke: color, "stroke-width": 0.7, "stroke-opacity": 0.55 }));
    }
    return p;
  }

  /* ------------------------------------------------------------------ *
   * Trajectory model: piecewise segments, straight or curved.
   * A segment: { from:[x,y], to:[x,y], curve?, via?:[x,y], label? }
   * curve keywords (velocity rising left to right unless y decreases):
   *   curve_up_concave   gradient increasing  (accelerating)   control=(x1,y0)
   *   curve_up_convex    gradient decreasing  (easing off)     control=(x0,y1)
   *   curve_down_concave mirror for falling
   *   curve_down_convex  mirror for falling
   * ------------------------------------------------------------------ */

  function controlPoint(seg) {
    var f = seg.from, t = seg.to;
    if (seg.via) return seg.via;
    switch (seg.curve) {
      case "curve_up_concave":
      case "curve_down_concave":
        return [t[0], f[1]];
      case "curve_up_convex":
      case "curve_down_convex":
        return [f[0], t[1]];
      default:
        return null; // straight
    }
  }

  // Evaluate trajectory y at data-x. Assumes segments are x-monotonic and
  // contiguous. Used for shading polygons.
  function trajectoryY(segments, x) {
    for (var i = 0; i < segments.length; i++) {
      var s = segments[i], x0 = s.from[0], x1 = s.to[0];
      var lo = Math.min(x0, x1), hi = Math.max(x0, x1);
      if (x < lo - 1e-9 || x > hi + 1e-9) continue;
      var c = controlPoint(s);
      if (!c) {
        var u = (x1 === x0) ? 0 : (x - x0) / (x1 - x0);
        return s.from[1] + u * (s.to[1] - s.from[1]);
      }
      // Quadratic Bezier, solve t from x then evaluate y.
      var t = bezierTfromX(x0, c[0], x1, x);
      return quad(s.from[1], c[1], s.to[1], t);
    }
    return null;
  }

  function quad(p0, p1, p2, t) {
    var mt = 1 - t;
    return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
  }

  // Solve quadratic Bezier x(t)=X for t in [0,1].
  function bezierTfromX(x0, cx, x1, X) {
    var a = x0 - 2 * cx + x1;
    var b = -2 * x0 + 2 * cx;
    var c = x0 - X;
    if (Math.abs(a) < 1e-9) {
      if (Math.abs(b) < 1e-9) return 0;
      return clamp01(-c / b);
    }
    var disc = b * b - 4 * a * c;
    if (disc < 0) disc = 0;
    var sq = Math.sqrt(disc);
    var t1 = (-b + sq) / (2 * a);
    var t2 = (-b - sq) / (2 * a);
    if (t1 >= -1e-6 && t1 <= 1 + 1e-6) return clamp01(t1);
    return clamp01(t2);
  }
  function clamp01(t) { return t < 0 ? 0 : (t > 1 ? 1 : t); }

  // Build an SVG path "d" string for the trajectory in screen space.
  function trajectoryPath(segments, toX, toY) {
    if (!segments.length) return "";
    var d = "M " + round(toX(segments[0].from[0])) + " " + round(toY(segments[0].from[1]));
    segments.forEach(function (s) {
      var c = controlPoint(s);
      if (!c) {
        d += " L " + round(toX(s.to[0])) + " " + round(toY(s.to[1]));
      } else {
        d += " Q " + round(toX(c[0])) + " " + round(toY(c[1])) +
             " " + round(toX(s.to[0])) + " " + round(toY(s.to[1]));
      }
    });
    return d;
  }

  /* ------------------------------------------------------------------ *
   * Shared segment-graph renderer (velocity-time, distance-time,
   * stopping-distance-diagram all flow through here).
   * ------------------------------------------------------------------ */

  function renderSegmentGraph(params, defaults) {
    var segments = (params.segments || []).map(function (s) {
      return { from: s.from, to: s.to, curve: s.curve, via: s.via, label: s.label };
    });
    if (!segments.length) throw new Error("segments required");

    var xs = [], ys = [];
    segments.forEach(function (s) { xs.push(s.from[0], s.to[0]); ys.push(s.from[1], s.to[1]); });
    (params.annotations || []).forEach(function (a) { if (a.at) { xs.push(a.at[0]); ys.push(a.at[1]); } });

    var xAxis = Object.assign({}, defaults.xAxis, params.axes && params.axes.x);
    var yAxis = Object.assign({}, defaults.yAxis, params.axes && params.axes.y);

    var graph = makeGraph({
      width: params.width, height: params.height,
      title: params.title || defaults.title,
      ariaTitle: defaults.ariaTitle,
      ariaDesc: buildSegmentAria(segments, xAxis, yAxis),
      xAxis: xAxis, yAxis: yAxis,
      xDataMax: Math.max.apply(null, xs),
      yDataMax: Math.max.apply(null, ys)
    });

    drawShaded(graph, segments, params.shaded);
    // Trajectory line.
    graph.g.appendChild(E("path", {
      d: trajectoryPath(segments, graph.toX, graph.toY),
      fill: "none", stroke: "var(--ink)", "stroke-width": 1.7,
      "stroke-linejoin": "round", "stroke-linecap": "round"
    }));
    drawSegmentLabels(graph, segments);
    drawAnnotations(graph, params.annotations, segments);
    return graph.svg;
  }

  function drawShaded(graph, segments, shaded) {
    if (!shaded || !shaded.length) return;
    var styleCycle = ["diagonal", "dots", "cross"];
    shaded.forEach(function (region, idx) {
      var from = (region.from != null) ? region.from : graph.xa.min;
      var to = (region.to != null) ? region.to : graph.xa.max;
      var style = region.style || styleCycle[idx % styleCycle.length];
      var pid = "fd-shade-" + idx + "-" + Math.floor(Math.random() * 1e6);
      graph.defs.appendChild(hatchPattern(pid, "var(--accent)", style));

      // Build polygon: baseline up to trajectory across [from,to] and back down.
      var pts = [[graph.toX(from), graph.toY(0)]];
      var N = 28;
      for (var i = 0; i <= N; i++) {
        var x = from + (to - from) * (i / N);
        var y = trajectoryY(segments, x);
        if (y == null) y = 0;
        pts.push([graph.toX(x), graph.toY(y)]);
      }
      pts.push([graph.toX(to), graph.toY(0)]);
      var d = "M " + pts.map(function (p) { return round(p[0]) + " " + round(p[1]); }).join(" L ") + " Z";
      graph.g.appendChild(E("path", { d: d, fill: "url(#" + pid + ")", stroke: "none" }));

      if (region.label) {
        var midx = (from + to) / 2;
        var midy = trajectoryY(segments, midx);
        if (midy == null) midy = 0;
        graph.g.appendChild(text(graph.toX(midx), graph.toY(midy / 2),
          region.label, { size: 11.5, anchor: "middle", baseline: "middle", fill: "var(--ink-2)", serif: true }));
      }
    });
  }

  function drawSegmentLabels(graph, segments) {
    segments.forEach(function (s) {
      if (!s.label) return;
      var mx = (s.from[0] + s.to[0]) / 2;
      var my = (s.from[1] + s.to[1]) / 2;
      graph.g.appendChild(text(graph.toX(mx), graph.toY(my) - 8, s.label,
        { size: 11, anchor: "middle", fill: "var(--muted)" }));
    });
  }

  function drawAnnotations(graph, annotations, segments) {
    if (!annotations) return;
    annotations.forEach(function (a) {
      var at = a.at;
      if (!at) return;
      var x = at[0], y = at[1];
      if (typeof y === "string" && segments) y = trajectoryY(segments, x) || 0;
      var sx = graph.toX(x), sy = graph.toY(y);
      graph.g.appendChild(E("circle", { cx: round(sx), cy: round(sy), r: 2.6, fill: "var(--accent)" }));
      // Leader line up-right to the label.
      var lx = sx + 14, ly = sy - 20;
      graph.g.appendChild(line(sx, sy, lx, ly, "var(--ink-2)", 0.8));
      graph.g.appendChild(text(lx + 3, ly, a.text, { size: 11, baseline: "middle", fill: "var(--ink)" }));
    });
  }

  function buildSegmentAria(segments, xAxis, yAxis) {
    var parts = segments.map(function (s) {
      var shape = s.curve ? ("a " + s.curve.replace(/_/g, " ") + " curve") : "a straight line";
      return (s.label ? (s.label + ": ") : "") + shape +
        " from (" + s.from.join(", ") + ") to (" + s.to.join(", ") + ")";
    });
    return "Graph of " + (yAxis.label || "y") + " against " + (xAxis.label || "x") +
      ", showing " + parts.join("; ") + ".";
  }

  /* ------------------------------------------------------------------ *
   * Renderer: velocity_time_graph
   * ------------------------------------------------------------------ */

  function renderVelocityTimeGraph(params) {
    params = params || {};
    return renderSegmentGraph(params, {
      title: null,
      ariaTitle: "Velocity-time graph",
      xAxis: { label: "time / s", minorTicks: 5 },
      yAxis: { label: "velocity / m s⁻¹", minorTicks: 5 }
    });
  }

  /* ------------------------------------------------------------------ *
   * Renderer: distance_time_graph (same core, distance axis labels)
   * ------------------------------------------------------------------ */

  function renderDistanceTimeGraph(params) {
    params = params || {};
    return renderSegmentGraph(params, {
      title: null,
      ariaTitle: "Distance-time graph",
      xAxis: { label: "time / s", minorTicks: 5 },
      yAxis: { label: "distance / m", minorTicks: 5 }
    });
  }

  /* ------------------------------------------------------------------ *
   * Renderer: stopping_distance_diagram
   * v-t shape: constant v (thinking) then linear fall to 0 (braking).
   * Two shaded regions with distinct patterns.
   * ------------------------------------------------------------------ */

  // Canonical illustrative presets: thinkingTime (s), brakingDeceleration (m/s^2).
  // Documented as renderer defaults in DIAGRAM_KINDS_FORCES.md; authors override
  // with explicit numbers for calculation questions.
  var STOPPING_PRESETS = {
    "dry road normal driver":      { thinkingTime: 0.7, brakingDeceleration: 7 },
    "wet road normal driver":      { thinkingTime: 0.7, brakingDeceleration: 4 },
    "dry road distracted driver":  { thinkingTime: 1.5, brakingDeceleration: 7 },
    "wet road distracted driver":  { thinkingTime: 1.5, brakingDeceleration: 4 },
    "dry road drunk driver":       { thinkingTime: 2.0, brakingDeceleration: 7 }
  };

  function renderStoppingDistanceDiagram(params) {
    params = params || {};
    var preset = params.preset ? STOPPING_PRESETS[params.preset] : null;
    var v0 = (params.initialVelocity != null) ? params.initialVelocity : (preset ? 14 : 14);
    var tt = (params.thinkingTime != null) ? params.thinkingTime : (preset ? preset.thinkingTime : 0.7);
    var a = (params.brakingDeceleration != null) ? params.brakingDeceleration : (preset ? preset.brakingDeceleration : 7);
    if (a <= 0) throw new Error("brakingDeceleration must be positive");
    var brakeTime = v0 / a;
    var tEnd = tt + brakeTime;

    var labels = params.showLabels || {};
    var segments = [
      { from: [0, v0], to: [tt, v0], label: null },
      { from: [tt, v0], to: [tEnd, 0], label: null }
    ];
    var shaded = [
      { from: 0, to: tt, style: "diagonal",
        label: (labels.thinkingDistance !== false) ? "thinking distance" : null },
      { from: tt, to: tEnd, style: "dots",
        label: (labels.brakingDistance !== false) ? "braking distance" : null }
    ];
    var annotations = [];
    if (labels.stoppingDistance) {
      annotations.push({ at: [tEnd, 0], text: "total stopping distance = area" });
    }

    var built = {
      title: params.title || null,
      segments: segments,
      shaded: shaded,
      annotations: annotations,
      axes: {
        x: Object.assign({ label: (params.axes && params.axes.x && params.axes.x.label) || "time / s", minorTicks: 5 },
                         params.axes && params.axes.x),
        y: Object.assign({ label: (params.axes && params.axes.y && params.axes.y.label) || "velocity / m s⁻¹", minorTicks: 5 },
                         params.axes && params.axes.y)
      },
      width: params.width, height: params.height
    };
    return renderSegmentGraph(built, {
      title: null,
      ariaTitle: "Stopping-distance velocity-time graph",
      xAxis: { label: "time / s", minorTicks: 5 },
      yAxis: { label: "velocity / m s⁻¹", minorTicks: 5 }
    });
  }

  /* ------------------------------------------------------------------ *
   * Renderer: stopping_distance_vs_speed
   * Three function curves: thinking (linear), braking (quadratic), total.
   * ------------------------------------------------------------------ */

  function renderStoppingDistanceVsSpeed(params) {
    params = params || {};
    var maxSpeed = (params.maxSpeed != null) ? params.maxSpeed : 30;
    var tReact = (params.reactionTime != null) ? params.reactionTime : 0.67;
    var a = (params.brakingDeceleration != null) ? params.brakingDeceleration : 6.7;
    var show = params.show || ["thinking", "braking", "total"];

    function thinking(v) { return v * tReact; }
    function braking(v) { return (v * v) / (2 * a); }
    function total(v) { return thinking(v) + braking(v); }
    var fnMap = { thinking: thinking, braking: braking, total: total };

    var yMax = total(maxSpeed);

    var graph = makeGraph({
      width: params.width, height: params.height,
      title: params.title || null,
      ariaTitle: "Stopping distance against speed",
      ariaDesc: "Stopping distance against speed: thinking distance is linear, " +
        "braking distance is proportional to speed squared, total is their sum.",
      xAxis: Object.assign({ label: "speed / m s⁻¹", minorTicks: 5 }, params.axes && params.axes.x),
      yAxis: Object.assign({ label: "distance / m", minorTicks: 5 }, params.axes && params.axes.y),
      xDataMax: maxSpeed,
      yDataMax: yMax
    });

    var styleMap = {
      thinking: { dash: "5 4", label: "thinking" },
      braking:  { dash: "1.5 4", label: "braking" },
      total:    { dash: null, label: "total" }
    };

    show.forEach(function (name) {
      var fn = fnMap[name];
      if (!fn) return;
      var pts = [];
      var N = 48;
      for (var i = 0; i <= N; i++) {
        var v = graph.xa.min + (Math.min(maxSpeed, graph.xa.max) - graph.xa.min) * (i / N);
        pts.push(round(graph.toX(v)) + "," + round(graph.toY(fn(v))));
      }
      graph.g.appendChild(E("polyline", {
        points: pts.join(" "), fill: "none",
        stroke: name === "total" ? "var(--accent)" : "var(--ink)",
        "stroke-width": name === "total" ? 1.8 : 1.3,
        "stroke-dasharray": styleMap[name].dash,
        "stroke-linejoin": "round"
      }));
      // Curve end-label.
      var endv = Math.min(maxSpeed, graph.xa.max);
      graph.g.appendChild(text(graph.toX(endv) + 4, graph.toY(fn(endv)),
        styleMap[name].label, { size: 10.5, baseline: "middle",
          fill: name === "total" ? "var(--accent)" : "var(--muted)" }));
    });

    // Annotations: [v, "total"|"thinking"|"braking"] -> compute the point.
    (params.annotations || []).forEach(function (an) {
      if (!an.at) return;
      var v = an.at[0];
      var which = an.at[1];
      var fn = fnMap[which] || total;
      var sx = graph.toX(v), sy = graph.toY(fn(v));
      graph.g.appendChild(E("circle", { cx: round(sx), cy: round(sy), r: 2.6, fill: "var(--accent)" }));
      graph.g.appendChild(line(sx, sy, sx, graph.toY(0), "var(--ink-2)", 0.7, "2 3"));
      graph.g.appendChild(text(sx + 5, sy - 8, an.text, { size: 11, fill: "var(--ink)" }));
    });

    return graph.svg;
  }

  /* ------------------------------------------------------------------ *
   * Registration
   * ------------------------------------------------------------------ */

  window.renderVelocityTimeGraph = renderVelocityTimeGraph;
  window.renderDistanceTimeGraph = renderDistanceTimeGraph;
  window.renderStoppingDistanceDiagram = renderStoppingDistanceDiagram;
  window.renderStoppingDistanceVsSpeed = renderStoppingDistanceVsSpeed;

  // Optional discoverable namespace (mirrors the window.render<Kind> globals).
  window.FORCES_DIAGRAMS = window.FORCES_DIAGRAMS || {};
  window.FORCES_DIAGRAMS.velocity_time_graph = renderVelocityTimeGraph;
  window.FORCES_DIAGRAMS.distance_time_graph = renderDistanceTimeGraph;
  window.FORCES_DIAGRAMS.stopping_distance_diagram = renderStoppingDistanceDiagram;
  window.FORCES_DIAGRAMS.stopping_distance_vs_speed = renderStoppingDistanceVsSpeed;

})();
