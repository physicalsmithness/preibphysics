# Pre-IB Physics Practice — Topic 7 (Radioactivity), v1

A static-site revision tool for the Edexcel International GCSE Single Award (4SS0) physics specification, Topic 7. One question at a time, mark-scheme-style feedback, a coverage map by subtag, all client-side. No backend, no login, no build step. Progress lives in `localStorage`.

## Use

Open `index.html` in any modern browser, or drop the folder into a GitHub Pages repo. The entry point is `index.html`.

## Files

- `index.html` — single page entry.
- `styles.css` — Editorial aesthetic, light mode, responsive.
- `engine.js` — question loop, marking, coverage map, persistence.
- `topic7_radioactivity.js` — question bank (134 base questions, 459 deliverables via instances).
- `README.md` — this file.

## What it does

Loads the topic question bank, picks a random question (or a random one within the active subtag filter), and presents it. The student answers; the engine marks per the schema's substring-matching contract; feedback shows what was hit, what was missed, the model answer, and any examiner note. Tap a subtag tile in the coverage map to filter; tap it again to clear. Reset all progress from the settings cog. That's all there is.

## What it deliberately doesn't do, yet

No login, no multi-device sync, no spaced repetition, no per-question history, no diagrams (placeholders only), no dark mode. v1 is small on purpose. See `IMPLEMENTATION_BRIEF_v1.md` (project doc) for what's parked and where it's parked to.
