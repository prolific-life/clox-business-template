# pitch/ — fundraising & pitch decks

Slide decks for this business (fundraising, sales, partner pitches),
built by the operator / Claude Code via the `create-pitch-deck` skill.
The brand is law: every deck derives its look from `brand/`
(positioning, voice, visual identity, story) + `docs/branding/DESIGN_SYSTEM.md`.

## How a deck exists (three forms, one source)

1. **`pitch/decks/<slug>/outline.md`** — the working narrative: the
   argument, slide-by-slide, with notes and open questions. Edit THIS
   when iterating on the story.
2. **`app/web/public/assets/pitch/<slug>/slides.json`** — the
   PUBLISHED structured deck (schema below). This is the single
   source both renderers consume.
3. **Rendered artifacts**, generated FROM slides.json:
   - `app/web/public/assets/pitch/<slug>/deck.pptx` — the real
     PowerPoint file (built with `app/web/tools/build-deck.mjs`,
     pptxgenjs — pure node, no native deps).
   - The live HTML preview at `<app>/assets/pitch/<slug>` — the
     in-app route renders slides.json as brand-styled slides. Every
     push deploys it (staging on main; per-project preview on
     project branches), so the user watches the deck evolve in the
     app's preview panes.

## slides.json schema

```json
{
  "title": "Acme — Seed Deck",
  "updated": "YYYY-MM-DD",
  "theme": {
    "bg": "#0E1116", "surface": "#161B22", "text": "#F0F3F6",
    "muted": "#8B949E", "accent": "#3FB6A8", "font": "Inter"
  },
  "slides": [
    { "layout": "title",   "title": "Acme", "subtitle": "one-liner" },
    { "layout": "bullets", "title": "Problem", "bullets": ["…"],
      "notes": "speaker notes" },
    { "layout": "stat",    "title": "Traction", "stat": "1,200",
      "statLabel": "weekly actives", "bullets": ["…"] },
    { "layout": "image",   "title": "Product", "image": "img/shot.png",
      "caption": "…" },
    { "layout": "closing", "title": "The ask",
      "subtitle": "$750k pre-seed", "bullets": ["use of funds…"] }
  ]
}
```

- `theme` colors come from `brand/visual-identity/` (via
  DESIGN_SYSTEM.md tokens) — never invent them.
- `image` paths are RELATIVE to the deck folder
  (`app/web/public/assets/pitch/<slug>/`); generate slide images with
  the `generate-marketing-image` skill into `img/`.
- Layouts: `title | bullets | stat | image | closing`. Keep bullets
  ≤5 per slide, ≤10 words each — a deck is not a doc.

## Rules

- Build/refresh the pptx in the SAME commit as any slides.json
  change: `cd app/web && node tools/build-deck.mjs
  public/assets/pitch/<slug>`.
- Update `app/web/public/assets/manifest.json` (the /assets index)
  in the same commit.
- Numbers in decks come from `metrics/objectives.json` / datapoints
  or the plan doc — NEVER invent traction, market size without a
  sourced note in outline.md.
- `/assets/*` routes are PUBLIC on the deployed app for now (so
  previews work) — don't put secrets in decks; an admin gate is a
  planned platform change.
