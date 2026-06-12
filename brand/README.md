# Brand — the operating system under everything

This folder is the business's **master brand brain**. Branding is not the
logo, the palette, or a font — it is the operating system underneath every
surface this business ships. When it's missing, every piece of output is a
one-off: nothing connects, nothing compounds. When it's here and the four
pillars AGREE with each other, brand decisions are already made before any
work starts.

## The four pillars

| Folder | Pillar | Answers |
|---|---|---|
| `positioning/` | Positioning | Who is this for — and explicitly NOT for? What do we stand for / against? |
| `voice/` | Voice | How do we sound? Words we always use; words we never use. |
| `visual-identity/` | Visual identity | The palette **with rules**, typography, motifs — a system, not swatches. |
| `story/` | Story | Why this exists, who the founder was before, what we believe now. |

They are deliberately **separate documents** so the brand stays dynamic:
visuals can be refined without touching positioning; the story can deepen
without breaking the voice. Update the pillar that changed; the other three
stay locked.

## Who reads this (everyone)

- **Engineering / UI work** (Claude Code sessions): read
  `visual-identity/` + `positioning/` BEFORE building or restyling any
  user-facing surface. The implementation-level tokens live in
  `docs/branding/DESIGN_SYSTEM.md` — that file implements what
  `visual-identity/` decides; when they disagree, fix the design system to
  match the pillar (or update the pillar deliberately first).
- **Marketing / creatives**: every campaign, post, thumbnail, and email
  pulls voice from `voice/`, framing from `positioning/`, looks from
  `visual-identity/`, and narrative from `story/`. `marketing/style/`
  holds per-channel executions of these pillars — it derives from here,
  never contradicts it.
- **Copy anywhere** (site, emails, app strings): `voice/` + `positioning/`.

## Keeping it alive

- The four pillars are seeded from the approved business plan (sections
  8–11). The Clox plan doc and this folder must say the same thing — when
  a pillar changes here, sync the matching plan section, and vice versa.
- Pillars are living documents: fold in real audience evidence (comments,
  replies, reviews), sharpen the positioning, evolve the story. Date
  material changes at the bottom of the pillar doc.
- Before shipping anything user-facing, the one-line check: *does this
  agree with all four pillars?* If it doesn't, either the work or a pillar
  is wrong — decide which, deliberately.
