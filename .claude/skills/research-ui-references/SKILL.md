---
name: research-ui-references
description: "Run BEFORE building ANY UI surface. Grounds the build in the best real products and award sites instead of a vibe. CLASSIFY the surface (a marketing page or moment, or one of the 16 product-screen patterns in design/library/APP_UI.md); OPEN and LOOK at the library's screenshots for it (design/library/INDEX.md) plus the design system's example product; optionally shoot 1-2 live products from design/REFERENCES.md at 1440px + 390px; then write design/briefs/<pattern>.md with the 5-8 concrete decisions you are taking (sizes, grid, density, surfaces, motion, timings) and the links you looked at. Build with the screenshots open and compare side by side before shipping. Take structure, proportions, density and motion; never a logo, wordmark, product name, copy or imagery. Use whenever you build or restyle a UI pattern."
metadata: {"openclaw":{"emoji":"🔬"}}
---

# research-ui-references - look at the best, then build to that bar

The generic "AI site" happens when a build designs from words alone. This
skill makes every build LOOK at the best real products for the thing it is
making, take their concrete decisions, and check its result against them.

## 1. Classify the surface

- **Marketing page or moment** (homepage, landing, pricing, about, a launch
  or reveal moment): read `design/library/EFFECTS.md`.
- **Product screen** inside the app: find its pattern in
  `design/library/APP_UI.md` (app shell, dashboard, stat tiles, charts,
  data table, list-detail, detail page, settings, sign-in, onboarding,
  empty state, composer/editor, calendar/streak/habit, mobile home, mobile
  list/detail, activity feed). Read the global rules (section 0) every time.

The pattern slug names the brief: `design/briefs/<slug>.md` (kebab-case,
e.g. `dashboard`, `composer-editor`, `marketing-hero`, `pricing`).
If a brief for this slug exists and is under 30 days old, reuse it, but
still open its screenshots (step 2) before you build.

## 2. Look at the evidence

Download the screenshots the library links for this pattern and READ them
(they are real images; looking is the point):

```bash
mkdir -p /tmp/refs && cd /tmp/refs
node -e '
const urls = process.argv.slice(1);
(async () => { for (const u of urls) {
  const r = await fetch(u); const b = Buffer.from(await r.arrayBuffer());
  require("fs").writeFileSync(decodeURIComponent(u.split("/").pop()), b);
}})();' "<url1>" "<url2>" "<url3>"
```

Also open the design system's example product (homepage, sign-in, app)
linked in the design system spec, shot at 1440x900 and 390x844 with the
Playwright snippet from screenshot-ui. That is the quality bar for THIS
business.

Optionally shoot 1-2 live products from `design/REFERENCES.md` for the
pattern (1440 + 390). Do not work around bot protection: a 403 or a
challenge means skip it.

## 3. Write the brief

`design/briefs/<slug>.md`, short and concrete:

```md
# <slug> - <date>
Looked at: <links / files>
Decisions:
- Shell: sidebar 256px, nav items 32px tall, 14px/500 labels
- Page title 24px/600, -0.02em; only 4 text sizes on the screen
- Content flat on the page, 1px dividers; cards only for stat tiles
- Table rows 48px, numeric columns right-aligned, tabular figures
- One primary action, top right
- Motion: list items fade up 8px, 240ms, staggered 30ms
States: empty, loading, error, long content, phone layout
```

Record sizes, grid, density, surfaces, hierarchy, states, motion and
timings. Colors and fonts come from THIS app's tokens and the design
system, never a reference's hexes or typefaces. Never record copy, logos
or product names.

## 4. Build with the references open

Compose from the kit (`components/ui`, `components/blocks`) and the effects
layer (`components/fx`). Keep the screenshots beside you while you build;
the brief is the checklist, the screenshots are the target.

## 5. Compare before you ship

Run screenshot-ui (real pages, desktop + phone, the site's own mode) and put
your shots next to the references. List every place yours is weaker
(heavier, busier, larger type, more boxes, less motion, worse spacing) and
fix it. A separate reviewer compares the DEPLOYED site with the same
references before the project counts as built.

Relay the reference links and your 5-8 decisions to the project thread in
one short message.
