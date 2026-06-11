# tests

Regression tests for the new\ working area's widget modules.

## forces_diagrams.test.js

Pins the public API and conventions of `..\forces_diagrams.js` (Widgickery census W4): registration surface, aria, the hard-to-read tick engine, minor and major gridlines, snapToMajor and qualitative opt-outs, curve keyword geometry with finite end gradients, area shading, annotations, segment labels, stopping-distance presets, input validation, and absence pins (no tangent API, no stage 2 yet; if either lands, the suite says so and should be extended).

Written 2026-06-11 by the Widgickery chat (milestone 1 prerequisite, DECISIONS D-005 and D-010 there). These replace the seven jsdom assertions described in the original commissioning DONE entry, which were never committed as files. 26 tests, green against the 682-line live copy on the day of writing.

Run:

```
npm install jsdom
node tests/forces_diagrams.test.js            (from new\)
node forces_diagrams.test.js [explicit path]  (from tests\)
```

Default module path is `..\forces_diagrams.js` relative to the test file, so the suite tests the live copy it sits beside. Exit code 0 on green.
