---
name: create-pitch-deck
description: >-
  Create or refresh a pitch/fundraising slide deck: brand-grounded
  narrative → slides.json → real .pptx (pptxgenjs) + a live HTML
  preview at <app>/assets/pitch/<slug>. Use when the user asks for a
  pitch deck, fundraising materials, an investor update deck, or a
  sales/partner deck.
---

# Create a pitch deck

The full system contract is `pitch/README.md` — read it first.

## Inputs
- `slug` — deck id (e.g. `seed-2026`, `sales`).
- `purpose` — fundraising | sales | partner | investor-update.
- `ask` — for fundraising: amount + milestone (from the user; NEVER
  invent financial asks — if unstated, leave the ask slide marked
  TBD and flag it).

## Steps
1. **Ground.** Read `brand/` (all four pillars — positioning gives
   the through-line, voice the words, visual identity the theme,
   story the team slide), `docs/branding/DESIGN_SYSTEM.md` (exact
   color hexes + type), the business plan doc, `metrics/objectives.json`
   + recent datapoints (real traction numbers), and
   `marketing/campaigns/*/results.md` (GTM proof).
2. **Outline.** Write `pitch/decks/<slug>/outline.md` from
   `pitch/templates/deck-outline.md` — the argument slide-by-slide,
   each claim with its evidence source noted. 10–12 slides max.
3. **Slides.** Write
   `app/web/public/assets/pitch/<slug>/slides.json` per the schema
   in `pitch/README.md` (`pitch/templates/example-slides.json` is a
   worked example). Theme hexes from DESIGN_SYSTEM.md. ≤5 bullets a
   slide, ≤10 words a bullet; narration goes in `notes`. Slide
   images (product shots, cover art) via `generate-marketing-image`
   into the deck's `img/` subfolder, referenced relatively.
4. **Build the pptx.**
   ```sh
   cd app/web
   [ -d node_modules/pptxgenjs ] || pnpm install
   node tools/build-deck.mjs public/assets/pitch/<slug>
   ```
   Fix any builder error before committing — a deck without its
   pptx is unpublished.
5. **Publish.** Add/refresh the deck's entry in
   `app/web/public/assets/manifest.json` (`{slug, title, updated}`
   under `decks`). Commit outline + slides.json + deck.pptx +
   manifest together; push (staging deploys the preview at
   `/assets/pitch/<slug>`).
6. **Verify + relay.** After the deploy, the OPERATOR checks the
   staging URL renders the deck and relays ONE line with the link.
   In a project build, just keep pushing the branch — the user
   watches the deck evolve in the project's preview pane.

## Never
- Invent traction, market sizes, logos, or testimonials — every
  number traces to metrics/, the plan doc, or a sourced note in
  outline.md.
- Use off-brand colors/fonts — the theme comes from the brand
  pillars via DESIGN_SYSTEM.md.
- Put secrets or non-public financials in a deck: /assets is
  publicly reachable on the deployed app (admin gating is a planned
  platform change) — flag via feedback card if the user asks for
  sensitive content.
