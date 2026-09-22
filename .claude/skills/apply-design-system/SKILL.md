---
name: apply-design-system
description: "Retheme the ENTIRE product to a catalog design system: website, web app, mobile app, pitch deck and generated imagery. Run when a project spec says 'Apply the <name> design system', when the first wake says a design system was chosen at intake, or when the owner asks to switch the look. The spec (from GetDesignSystemTool or the project doc) is MECHANICAL: exact fonts, HSL tokens, hexes, radii and component notes per file. This skill is the file-by-file recipe for landing it without drift, plus the checks that prove nothing old is left. Generates hero imagery itself; never asks the owner for images."
metadata: {"openclaw":{"emoji":"🎨"}}
---

# apply-design-system - one pass, every file, nothing old left

A design system from the catalog is a complete visual language: fonts,
both color modes, shape, spacing, twelve component treatments, the
navigation shell, icons, motion and an imagery direction. Applying it is a
REWRITE of known files with known values, then a judgment pass on the
primitives, then proof. Do it in that order and in one project.

## 0. Get the spec

The spec arrives one of three ways; all three are the same words:

- the project doc you were dispatched to build ("Apply the <name> design system");
- the first wake, when the owner chose a system at intake;
- on demand, at any point:

```bash
clox-ws-client tool GetDesignSystemTool '{"workspaceId":"{{WORKSPACE_ID}}"}' --user-id {{OWNER_USER_ID}}
# -> {"designSystem": {...}, "spec": "<markdown with every value>"}
```

Read the whole spec before touching a file. It names every file below
with the exact values to write. Do not improvise values it already gives.

## 1. Fonts: `app/web/app/layout.tsx` + `constants/branding/typography.ts`

Replace the three `next/font/google` imports with the ones in the spec.
The import name is the family with spaces as underscores
(`Hanken Grotesk` becomes `Hanken_Grotesk`). Keep the three CSS variables
(`--font-display`, `--font-sans`, `--font-mono`) so Tailwind and every
component keep working. Update the family strings in `typography.ts`.

If a family is not on Google Fonts, pick the closest one that is, and say
so in the ship report. Never fall back to the system face.

## 2. Colors: `app/web/app/globals.css` + `constants/branding/colors.ts`

Replace the `:root` and `.dark` blocks with the spec's blocks verbatim.
They are HSL triplets (`--primary: 172 67% 27%;`) because the app consumes
`hsl(var(--token))`; a hex there breaks every page. Then mirror the hexes
into `colors.ts` (`brand.primary/secondary/accent` + the neutral ramp) in
the same commit so `/brand` and the CSS never disagree. Add the spec's
gradients as `backgroundImage` entries in `tailwind.config.ts` and use
them where the spec says (hero, buttons, cards).

## 3. Mobile tokens: `app/native/constants/branding/*`

`colors.ts` brand group = the same three hexes as web. Chrome
(background, surface, border, text ramp) = the spec's dark palette.
`typography.ts` names the same families; `radius.ts` and `spacing.ts`
take the spec's scale. Both apps must be updated in the SAME pass or the
other one silently keeps the old look.

## 4. Shape and spacing: `tailwind.config.ts`

Radii, border width, shadow scale and spacing base from the spec. If the
spec says surfaces are glass, add a `backdrop-blur` + translucent
background utility and use it on cards and nav.

## 5. Components: `app/web/components/ui/*`

For each of button, input, textarea, switch, checkbox, dropdown, table,
card, badge, tabs, modal, chart: restyle the primitive to the spec's
style word, props and note. Missing primitive:
`npx shadcn@latest add <component>`, then restyle through the tokens.
Never hand-roll a primitive and never hardcode a hex in a component.

## 6. Navigation shell

If the spec's pattern (stacked vs flat) or desktop/mobile shell differs
from the current layout, change the layout component ONCE so every page
inherits it. Do not restyle navigation per page.

## 7. Imagery: generate it, do not ask

The spec carries an imagery style and a complete generation prompt.
Generate a homepage hero background and a dashboard ambience image:

```bash
clox-ws-client tool GenerateMarketingImageTool '{"workspaceId":"{{WORKSPACE_ID}}","prompt":"<spec imagery prompt, adjusted for the placement>","aspectRatio":"16:9","path":"design/hero-background.png"}' --user-id {{OWNER_USER_ID}}
```

It picks the best image provider the owner has connected and returns a
hosted `publicUrl`. LOOK at the result (Read the image): off palette,
text in it, or wrong mood means regenerate once with a tighter prompt.
Reference the https URL from the page; commit only a small JSON sidecar,
never the binary. Do not ask the owner to make or approve imagery for
this pass; it is theme work, not a campaign creative.

## 8. Docs and pitch

Rewrite `docs/branding/DESIGN_SYSTEM.md` to describe the new system
(feel, color table with the new hexes, typography, shape, motion,
components, imagery) and update `brand/visual-identity/README.md` to
match, in the same commit. Then run the `create-pitch-deck` skill so the
deck's palette and fonts are the new ones.

## 9. Prove it

1. `verify-build` skill: `pnpm build` and `pnpm test` pass.
2. `screenshot-ui` skill on EVERY registered storyboard component, light
   and dark. Read each shot. Any of these means not done:
   - the old display or body face anywhere;
   - an old palette color anywhere (grep the repo for the old hexes and
     the old HSL triplets too);
   - a contrast failure on text over the new surfaces;
   - a component that ignores the spec's style word.
3. `grep -rn "<old primary hex>" app/` returns nothing.
4. Ship report with a `screenshotUrl` of the themed homepage and
   `tryIt` steps that open one web page and one storyboard component.

## Never

- NEVER write a hex into `globals.css`; HSL triplets only.
- NEVER change one token file without its mirror (web and native).
- NEVER leave the old fonts loaded "just in case".
- NEVER ask the owner for imagery; generate it.
- NEVER restyle a page individually; change the token or the primitive.
- NEVER use em dashes or en dashes in any copy you write.
