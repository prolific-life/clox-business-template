---
name: extract-design-system
description: >-
  Extract a design system (colors, typography, spacing, radii, shadows,
  motion) from any provided website URL into docs/branding/
  DESIGN_SYSTEM.md, optionally applying it to the app's Tailwind theme.
  Use when the user shares a site they like ("make it look like X",
  "match this brand", "use this as design reference").
---

# Extract a design system from a website

## Inputs
- `url` — the reference website.
- `apply` — whether to also retheme the app (default: document only;
  apply when the user asked to LOOK like the site).

## Steps
1. Fetch the page + its stylesheets:
   `curl -sL <url>` → collect `<link rel="stylesheet">` hrefs and
   inline `<style>` blocks; `curl -sL` each stylesheet (resolve
   relative URLs). Also grab font links (Google Fonts, @font-face).
2. Distill tokens from the CSS (frequency-weighted — the most-used
   values are the system; one-offs are noise):
   - **Colors**: hex/rgb/hsl values → cluster into background,
     surface, text, primary/accent, semantic (success/error). Note
     dark-mode variants if `prefers-color-scheme` or `.dark` rules
     exist.
   - **Typography**: font families (display vs body vs mono), the
     font-size scale, weights in use, line-heights, letter-spacing.
   - **Spacing**: recurring margin/padding/gap steps → the spacing
     scale.
   - **Shape**: border-radius values, border styles.
   - **Depth**: box-shadow recipes.
   - **Motion**: transition durations/easings, named keyframes.
3. Update `docs/branding/DESIGN_SYSTEM.md` IN PLACE (keep its section
   skeleton — it is the canonical reference future ad/slide/creative
   generation reads): one section per category,
   each token with its value + where it's used on the source site +
   the closest Tailwind utility. Lead with a 3-sentence "feel"
   summary (e.g. "dense, high-contrast, 4px grid, springy motion").
4. If `apply`: map the tokens into `app/web/tailwind.config.*`
   (colors/fontFamily/borderRadius/boxShadow) + `globals.css`
   variables, migrate the most visible surfaces (nav, buttons, cards,
   landing hero) to the new tokens, and verify `pnpm build` passes.
5. Commit (`design: extract design system from <host>` /
   `design: apply <host> design system`).

## Never
- Copy a site's copyrighted ASSETS (logos, illustrations, photos,
  proprietary font files). Tokens and patterns only; fonts via their
  licensed sources (e.g. Google Fonts) or nearest free equivalent.
- Dump raw CSS into the doc — it's a distilled system, not a mirror.
