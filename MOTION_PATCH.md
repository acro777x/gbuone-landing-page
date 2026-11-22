# GBU One landing page — motion & typography patch

This patch adds a complete, accessible motion layer to the static landing
page without a build step. Apply it to `index.html`:

1. Insert the contents of `motion.css` just before `</style>` in `<head>`.
2. Insert the contents of `motion.js` just before `</body>`.

Both files are plain text so they can be pasted into the single-file site.

Design rules honoured:
- Light-first, warm ivory background, orange accent (#c2410c).
- Motion PERFORMS (reveals hierarchy, confirms actions) — no idle wobble.
- Everything is disabled under `prefers-reduced-motion: reduce`.
- All new animations are GPU-friendly (transform/opacity only).
