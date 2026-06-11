# Design system

The canonical visual + brand reference for this business. **Every
surface we produce reads from this file** — the web app's theme, and
(soon) generated advertisements, social creatives, and slide decks.
Keep it current: whenever the app's look changes (initial build,
redesign, a reference-site extraction via the extract-design-system
skill), update this file in the same commit.

## Feel

_Three sentences max: the personality of the visual language (e.g.
"dense and engineered, high contrast, 4px grid, springy motion")._

## Color

| Token | Value | Used for |
|---|---|---|
| background | _#…_ | page background |
| surface | _#…_ | cards, panels |
| text | _#…_ | primary copy |
| text-muted | _#…_ | secondary copy |
| primary | _#…_ | CTAs, links, focus |
| accent | _#…_ | highlights, badges |
| success / warning / danger | _#… / #… / #…_ | semantic states |

Dark-mode variants (if the app ships them): _note the overrides._

## Typography

- **Display**: _family, weights, where it's used_
- **Body**: _family, weights, line-height_
- **Mono**: _family (code, data)_
- Scale: _e.g. 12 / 14 / 16 / 20 / 28 / 40_

## Spacing & shape

- Spacing scale: _e.g. 4 / 8 / 12 / 16 / 24 / 40_
- Radii: _e.g. 8 (controls), 14 (cards), 999 (pills)_
- Borders & shadows: _the standard recipes_

## Motion

- Durations/easings: _e.g. 180ms ease-out for hovers, 260ms for panels_
- Signature moves: _entrances, hover lifts, transitions worth reusing_

## Logo & imagery

- Logo usage: _files, clear space, don't-do's_
- Imagery style: _photography vs illustration, treatments_

## Voice (for ads & copy)

_One short paragraph + 3 example lines in-voice. Align with
[identity.md](identity.md); this section is what ad/slide generation
quotes._
