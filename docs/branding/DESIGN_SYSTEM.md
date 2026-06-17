# Design system

The canonical visual + brand reference for this business. **Every
surface we produce reads from this file** — the web app's theme, and
(soon) generated advertisements, social creatives, and slide decks.
Keep it current: whenever the app's look changes (initial build,
redesign, a reference-site extraction via the extract-design-system
skill), update this file in the same commit.

> **This file ships with a real DEFAULT floor (below), not blanks.** It is
> a deliberate, awwwards-bar starting point — not the generic "AI SaaS"
> look. Rebrand it per business by editing the values here AND their
> implementation (`app/web/app/globals.css` CSS variables +
> `constants/branding/*` + the fonts in `app/web/app/layout.tsx`) in the
> same commit. Commit to ONE opinionated direction — never revert to a
> generic default. See the Design Law in `CLAUDE.md`.

## Feel

Warm, editorial, and confident. Paper-toned neutrals (not stark white or
pure black), a single deep-teal primary used with restraint, characterful
display type over a clean grotesque body. Calm but not sterile; motion is
purposeful, never decorative.

## Color

Runtime source of truth: the CSS variables in `app/web/app/globals.css`
(`:root` = light, `.dark` = dark), consumed as `hsl(var(--token))` and
exposed as Tailwind classes (`bg-background`, `text-primary`,
`border-border`, …). The hexes below mirror those defaults and are what
`/brand` renders — keep them in lockstep.

| Token | Light | Dark | Used for |
|---|---|---|---|
| background | `#FBFAF7` | `#121110` | page background (warm paper) |
| card / surface | `#FFFFFF` | `#1B1815` | cards, panels, popovers |
| foreground (text) | `#1A1712` | `#F3F1EA` | primary copy |
| muted-foreground | `#766F64` | `#A8A293` | secondary copy |
| primary | `#177568` | `#2DBBA3` | CTAs, links, focus, accents |
| accent | `#E08B2D` | `#EB9A3E` | highlights, badges (sparing) |
| border / input | `#E7E3D8` | `#2F2A22` | hairlines, field borders |
| success / warning / danger | `#15803D` / `#D97706` / `#DC2626` | (auto-lightened in dark) | semantic states |

## Typography

Loaded via `next/font` in `app/web/app/layout.tsx` — the app always ships
the real faces, never the system font.

- **Display**: **Fraunces** (400–600) — headings (`h1–h4`, `.font-display`),
  hero/marketing statements. Editorial, optical.
- **Body**: **Hanken Grotesk** (400/500/600) — all UI + body copy,
  `line-height` 1.5–1.6. Clean, slightly humanist.
- **Mono**: **JetBrains Mono** — code, data, numerics.
- Scale (`text-*`): 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 / 72.

## Spacing & shape

- Spacing scale (4px base): 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Radii: `--radius` 12px → `rounded-lg` (cards), `rounded-md` 8 (controls),
  `rounded-sm` 4, `rounded-full` (pills/avatars).
- Borders: 1px `border-border` hairlines. Shadows: soft and low
  (`shadow-sm` on cards/controls); lean on the warm paper + borders for
  depth rather than heavy drop shadows.

## Motion

- Durations/easings: 150–200ms `ease-out` for hovers/controls; 500–600ms
  `cubic-bezier(0.16, 1, 0.3, 1)` for entrances/panels.
- Signature moves: scroll-reveal via the `Reveal` primitive
  (`components/ui/reveal.tsx`); `animate-fade-up` / `animate-fade-in`
  utilities. Always honor `prefers-reduced-motion` (the global reset in
  `globals.css` already neutralizes motion when the user opts out).

## Components

A polished primitive floor lives in `app/web/components/ui/` — **compose
these, don't hand-roll raw divs**: `Button` (primary/secondary/outline/
ghost/destructive/link), `Card` (+Header/Title/Content/Footer), `Input`,
`Badge`, `Reveal`. They render from the tokens above, so rebranding the
CSS variables restyles everything consistently.

## Logo & imagery

- Logo usage: files in `app/web/public/`; render from `appLogoPath`
  (`constants/app.ts`). Give it clear space; never stretch.
- Imagery style: define per brand (photography vs. illustration, grain,
  duotone, etc.) — pick one treatment and apply it consistently.

## Voice (for ads & copy)

Confident, plain, specific — no hype, no filler. Short declarative
sentences. Align with [identity.md](identity.md); ad/slide generation
quotes this section.

- _"Replace with an in-voice line."_
- _"Replace with an in-voice line."_
- _"Replace with an in-voice line."_
