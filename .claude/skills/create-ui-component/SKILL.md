---
name: create-ui-component
description: >-
  Build a polished, reusable UI component (hero, pricing table, nav,
  dashboard card, form, modal, data table…) that matches THIS app's
  design system. Use when the user asks for a new piece of UI or a
  visual upgrade of an existing one.
---

# Create a UI component

## Inputs
- What the component is + where it's used.
- Optional reference (a site/screenshot the user likes — run
  extract-design-system first if it's a site and no design-system doc
  exists yet).

## Steps
1. Read `docs/branding/DESIGN_SYSTEM.md` (if present) and
   `docs/branding/identity.md`, plus 1–2 existing components in
   `app/web/components/` — the new piece must look native to the app,
   not pasted in.
2. Design before coding: states (default/hover/focus/active/disabled/
   loading/empty/error), responsive behavior at 360 / 768 / 1280,
   dark mode if the app has it, and the data contract (typed props,
   no `any`).
3. Build in `app/web/components/<Name>.tsx`:
   - Tailwind utilities on the app's tokens — no hardcoded one-off
     hex/px values that bypass the theme.
   - Semantic HTML + a11y: keyboard reachable, focus-visible rings,
     aria labels/roles where the element isn't natively semantic.
   - Motion where it earns it (entrances, hover lift, transitions)
     using the design system's durations/easings — subtle, never
     decorative jitter.
   - Composition over configuration: children/slots beat a prop per
     variant; cap the prop surface.
4. Wire it into the page(s) that needed it; delete any UI it
   replaces.
5. Verify: `pnpm build` passes; check the rendered route at 360px and
   1280px widths (screenshot or careful reasoning about the classes).
6. Commit (`feat(ui): <Name> component`).

## Never
- Install a component library for one component — build on what the
  app already uses.
- Ship a component with unstyled error/empty/loading states.
