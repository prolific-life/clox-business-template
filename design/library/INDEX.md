# Design library - start every UI here

The difference between a site people remember and the generic "AI site" is
not taste in the abstract: it is specific decisions (sizes, density, motion,
timing) that the best products all make. This library holds those decisions,
with the evidence to look at.

| File | What it gives you |
|---|---|
| [APP_UI.md](APP_UI.md) | Product screens inside the app: the measured rules (type scale, control heights, sidebar and table sizes, surfaces, color) and the best exemplars for 16 patterns (shell, dashboard, stat tiles, charts, tables, list-detail, detail, settings, sign-in, onboarding, empty states, composer/editor, calendar/streak, mobile home, mobile list, activity feed), each with screenshots. |
| [EFFECTS.md](EFFECTS.md) | Marketing pages and moments: 18 effects taken apart from award-winning sites (wave reveals, ribbon scroll, shader backgrounds, cursor and sound design...), their exact timings, which component in `components/fx` or the kit builds each one, and frame captures. |
| [../REFERENCES.md](../REFERENCES.md) | Which live products to open for which pattern. |

## The workflow (every UI build)

1. **Classify** each surface you are about to build: a marketing page or
   moment (EFFECTS.md) or a product screen (APP_UI.md, find its pattern).
2. **Look before you build.** Download the linked screenshots for that
   pattern (node fetch to a temp dir, then Read the image) and the
   design system's example product (homepage, sign-in, app) from the
   design system spec. Write down, in the plan, the 5-8 concrete decisions
   you are taking from them (e.g. "sidebar 256px, nav items 32px, page title
   24px/600, table rows 48px, content flat on the page with 1px dividers").
3. **Compose, don't invent.** Pages are built from the kit
   (`components/ui`, `components/blocks`) and the effects layer
   (`components/fx`). A marketing page uses at least three effects chosen
   for the story; a product screen follows APP_UI.md's numbers.
4. **Check like a visitor.** screenshot-ui: the real pages, desktop and
   phone, in the mode the site opens in. Compare side by side with the
   exemplar. Fix every gap before you ship.
5. **Expect the reviewer.** A separate reviewer judges the deployed site
   against the same references before the project counts as built.

Never copy a reference's logo, wordmark, product name, copy or imagery.
Structure, proportions, density and motion are what you take.
