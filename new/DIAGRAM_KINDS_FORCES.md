# Forces diagram kinds — authoring reference

Params schemas for the Forces (Topic 1) diagram renderers in `forces_diagrams.js`,
parallel to `CIRCUIT_DSL.md`. The Forces authoring chat reads this to see what
`params` each `kind` accepts. Author intent only; you never write SVG (d008,
diagrams are engine-rendered SVG, authors give intent only).

A question carries a diagram like this:

```jsonc
{
  "id": "...",
  "type": "mcq",
  "diagram": { "kind": "velocity_time_graph", "params": { /* per below */ } }
}
```

The engine routes `diagram.kind` to `window.render<Kind>` and inserts the returned
SVG above the prompt. An unknown kind, or a renderer that throws, falls back to a
dashed-border placeholder showing the params, so a question is always shippable
before the renderer exists.

Status: stage 1 (the four graph kinds below) is shipped and wired. Stage 2
(`free_body_diagram`, `acceleration_apparatus`, `object_scene`) is in build; the
engine dispatch entries exist but the renderers are not yet live, so those kinds
currently render the placeholder. `forces_on_inclined_plane` is deferred (build on
demand; see the inter-chat thread). Surface a `NEW_FLAG: param <kind>.<param>` on
`inter_chat/Architecture_ForcesDiagramsChat_v1.md` if you need a param not listed.

---

## The hard-to-read tick convention (graph kinds)

On by default for `velocity_time_graph`, `distance_time_graph`,
`stopping_distance_diagram`, and `stopping_distance_vs_speed`. The point is that
reading the graph is part of the question: data lands off the major ticks and the
student counts minor subdivisions to read a value.

Each axis accepts:

| field | meaning | default |
|---|---|---|
| `label` | axis caption, slash-unit per IGCSE (`velocity / m s⁻¹`) | kind default |
| `max` | top of the axis | auto from data, with headroom |
| `min` | bottom of the axis | 0 |
| `majorTick` | spacing between labelled major ticks | auto (nice ~6 intervals) |
| `minorTicks` | subdivisions per major (each minor = majorTick / minorTicks) | 5 |
| `snapToMajor` | opt out of hard reading: clean axis, no minors | false |

`minorTicks: 5` with `majorTick: 1` gives minors every 0.2, so a data point at 3.8
sits two minors below the 4 major. Set `majorTick` and `minorTicks` per axis to
choose another scheme (`majorTick: 1, minorTicks: 4` for quarter divisions; a scale
where one minor is 0.5). Use `snapToMajor: true` sparingly, only for trivial
first-introduction questions where the value really is on a major. The renderer
never silently rounds an annotation to a major.

---

## `velocity_time_graph`

The headline kind. Quantitative (read values off) or qualitative (shape only).

```jsonc
{
  "kind": "velocity_time_graph",
  "params": {
    "segments": [
      { "from": [0, 0],  "to": [4, 12],  "label": "accelerating", "curve": "curve_up_concave" },
      { "from": [4, 12], "to": [10, 12], "label": "constant" },
      { "from": [10, 12],"to": [14, 0],  "label": "decelerating" }
    ],
    "axes": {
      "x": { "label": "time / s",        "max": 16, "majorTick": 2, "minorTicks": 5 },
      "y": { "label": "velocity / m s⁻¹", "max": 14, "majorTick": 2, "minorTicks": 5 }
    },
    "shaded": [{ "from": 0, "to": 14, "label": "distance travelled", "style": "diagonal" }],
    "annotations": [{ "at": [4, 12], "text": "top speed reached" }]
  }
}
```

- `segments`: contiguous `{from:[x,y], to:[x,y]}` pairs. `label` is optional, drawn
  above the segment midpoint. Omit `axes` to auto-scale from the data.
- `curve`: a segment is a straight line by default. Curve keywords:
  `curve_up_concave` (gradient increasing, the accelerating shape),
  `curve_up_convex` (gradient decreasing, easing off),
  `curve_down_concave` and `curve_down_convex` (the falling-velocity mirrors).
  For full control give `"via": [x, y]` (an explicit Bezier control point) instead
  of a keyword.
- `shaded`: regions under the trajectory for area-under reasoning. `from`/`to` are
  x-values; `label` sits inside the region; `style` is `"diagonal"`, `"dots"`, or
  `"cross"` (distinct hatch patterns so two regions are separable). Defaults cycle
  through the three styles in order.
- `annotations`: `{at:[x,y], text}` draws a dot at the point with a short leader
  line to the text.

## `distance_time_graph`

Same param shape as `velocity_time_graph`; only the default axis labels change
(`distance / m` on y). Used in parallel for the same scenario (derive one graph
from the other). Same `segments` / `curve` / `shaded` / `annotations` fields.

## `stopping_distance_diagram`

The canonical stopping-distance velocity-time shape: constant velocity during the
thinking phase, then a straight line down to zero during braking. Two shaded
regions with distinct patterns. The renderer builds the segments for you from the
physics, so you give numbers, not coordinates.

```jsonc
{
  "kind": "stopping_distance_diagram",
  "params": {
    "initialVelocity": 14,
    "thinkingTime": 0.7,
    "brakingDeceleration": 7,
    "axes": { "x": { "label": "time / s" }, "y": { "label": "velocity / m s⁻¹" } },
    "showLabels": { "thinkingDistance": true, "brakingDistance": true, "stoppingDistance": false }
  }
}
```

- `showLabels`: `thinkingDistance` and `brakingDistance` default on; set false to
  hide. `stoppingDistance` (default off) adds a "total = area" annotation.
- `preset`: instead of giving `thinkingTime` and `brakingDeceleration`, name a
  preset and the renderer fills the canonical illustrative numbers. Presets:
  `"dry road normal driver"` (0.7 s, 7 m/s²), `"wet road normal driver"`
  (0.7 s, 4 m/s²), `"dry road distracted driver"` (1.5 s, 7 m/s²),
  `"wet road distracted driver"` (1.5 s, 4 m/s²), `"dry road drunk driver"`
  (2.0 s, 7 m/s²). You can still override `initialVelocity` alongside a preset, and
  an explicit `thinkingTime` / `brakingDeceleration` overrides the preset value.
  These preset numbers are illustrative defaults for qualitative questions; for a
  calculation question give explicit numbers so the diagram matches the mark scheme.

## `stopping_distance_vs_speed`

Stopping distance against speed: thinking distance linear, braking distance
quadratic (the v² dependency), total their sum.

```jsonc
{
  "kind": "stopping_distance_vs_speed",
  "params": {
    "maxSpeed": 30,
    "show": ["thinking", "braking", "total"],
    "annotations": [{ "at": [20, "total"], "text": "36 m" }]
  }
}
```

- `show`: which of `thinking`, `braking`, `total` to draw (any subset). Total is
  drawn in accent; thinking and braking are dashed (long dash vs dotted) so they
  read apart without colour.
- `reactionTime` (default 0.67 s) and `brakingDeceleration` (default 6.7 m/s²) set
  the curve shapes; override for a specific scenario.
- `annotations`: `{at:[v, which], text}` where `which` is `"thinking"`,
  `"braking"`, or `"total"`. The renderer computes the y-value on that curve at
  speed `v`, so you do not do the arithmetic; supply the label text you want shown.

---

## Stage 2 kinds (placeholders for now)

`free_body_diagram`, `acceleration_apparatus`, `object_scene`. Param shapes are in
`BRIEF_forces_diagrams.md` sections 3.3, 3.7, 3.8; this doc gains their final
schemas when the renderers land. You may author questions against those shapes now;
they render the dashed placeholder until the renderers ship.

## Notes

- Default canvas is 560x380, scaling to the question card; pass `width` / `height`
  to override. Mobile-safe at 360px.
- Every diagram carries an SVG `<title>` and `<desc>` built from the params, surfaced
  as `aria-label`.
- Colours come from the engine CSS variables; diagrams sit naturally on the card.
- No em-dash anywhere (project housekeeping rule).
