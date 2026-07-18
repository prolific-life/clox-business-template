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

## First (MANDATORY) - reuse before you create
Read `components/INVENTORY.md` and grep `app/web/components/` for what
you're about to build. If an existing component covers 80% or more of the
need, EXTEND it (a prop or variant) instead of adding a file - variants
before new components. Creating a NEW file is allowed only when nothing
covers it; when you do, relay a one-line justification to the project
thread ("new component <Name>: no existing kit covers <need>"). Also apply
extract-on-second-use: if this is the SECOND place a visual appears,
extract it to `app/web/components/ui` and replace BOTH call sites in this
same commit rather than copying it.

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
6. **Last (MANDATORY) - keep the ledger honest.** In the SAME commit, add
   or update the component's row in `components/INVENTORY.md` (name, path,
   variants/props, when-to-use, `/component/<name>` link, usage count) AND
   register it in `app/web/lib/component-registry.tsx` with sample props so
   `/component/<name>` renders it in isolation. The `verify-build` gate
   fails a component change with no matching INVENTORY.md change.
7. Commit (`feat(ui): <Name> component`) - component + registry + inventory
   together.

## Never
- Install a component library for one component — build on what the
  app already uses.
- Ship a component with unstyled error/empty/loading states.
- Add a component file without its INVENTORY.md row + component-registry.tsx
  entry in the same commit.
- Hardcode a hex color in feature code - theme tokens only (the
  `verify-build` gate rejects raw hex outside the token files).
