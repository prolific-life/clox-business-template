# CLAUDE.md

Orientation for agents working in this repo.

1. **Start with [docs/REPO_MAP.md](docs/REPO_MAP.md)** — the
   navigation map. It answers "where does X live / where do I put Y"
   in one read; only explore directories it doesn't cover. Don't run
   a broad repo exploration before reading it.
2. **Honor [BUSINESS_TEMPLATE_AGENT_CONTRACT.md](BUSINESS_TEMPLATE_AGENT_CONTRACT.md)**
   — sources of truth (`metrics/*.json` over rendered docs),
   commit+push before reporting, no unapproved outbound sends,
   Supabase as the only auth surface.
3. **Never invent the product's name, tagline, or logo.** The canon
   lives in `app/web/constants/app.ts` (`appName`, `appTagline`) and
   `app/web/public/logo.*` (when present) — render UI from those, and
   see the canonical-identity block in
   [docs/branding/identity.md](docs/branding/identity.md). Renames
   happen only on an explicit user request, updating the constants +
   branding docs together.
4. **After structural changes** (new routes, dirs, libs, tables,
   features), update `docs/REPO_MAP.md` in the same commit — see
   `.claude/skills/maintain-repo-map`.
5. Ship small, build-passing commits to `main` (each push deploys
   staging). Never push the `production` branch — users promote it.
6. **The brand is decided in [brand/](brand/README.md)** — four pillar
   docs (positioning, voice, visual identity, story) that every
   surface pulls from. BEFORE building or restyling any user-facing
   UI: read `brand/visual-identity/` + `brand/positioning/` (the
   code-level tokens in `docs/branding/DESIGN_SYSTEM.md` implement
   that pillar — when they disagree, the pillar wins). BEFORE writing
   any user-facing copy: `brand/voice/`. Marketing creatives pull all
   four. Don't re-make brand decisions inline — if the work genuinely
   needs a brand change, update the pillar doc deliberately in the
   same commit.
7. **`/brand` is the living style guide** (`app/web/app/brand/page.tsx`)
   — typography, colors, spacing, radius, shadows, and component
   samples rendered PROGRAMMATICALLY from `constants/branding/*`. To
   change how anything there looks, change the TOKEN (and the
   visual-identity pillar deciding it) — never hardcode values into
   the page. After any design/branding pass, open `/brand` to verify
   the system holds together; it doubles as the shareable design
   review link.
8. **Design tokens live in TWO mirrored places — change both.** The web
   app cascades from `app/web/constants/branding/*` (also fed into the
   Tailwind theme); the native Expo app cascades from
   `app/native/constants/branding/*` (every screen reads its
   `colors`/`typography`/`radius`/`spacing` — NEVER hardcode hex/sizes
   in a screen). The two can't share one file (native is an isolated
   Metro project). Keep the `brand` + `semantic` color groups identical
   across both; a visual-identity change updates both in the same pass
   so the whole product — site AND app — shifts together.

## Design Law — make it beautiful, not average

The #1 failure of AI-built UIs is defaulting to the *average of everything*
— generic fonts, safe colors, no point of view. Don't. Every user-facing
surface must obey these, no exceptions:

1. **Commit to ONE specific, opinionated visual direction** (drawn from
   `brand/visual-identity/` + the **Feel** in `docs/branding/DESIGN_SYSTEM.md`)
   and execute it fully — e.g. warm-editorial, brutalist, retro-futuristic,
   calm-minimal. Decide the direction FIRST, then build to it. Never ship the
   nondescript "AI site" look. **Compose the polished primitives in
   `app/web/components/ui/` (Button, Card, Input, Badge, Reveal) — they
   already encode the system; don't hand-roll raw `<div>`s.**
2. **The floor already ships a real, LOADED type pairing** — Fraunces
   (display) + Hanken Grotesk (body) via `next/font` in
   `app/web/app/layout.tsx`, exposed as `font-display` / `font-sans`. Keep it,
   or rebrand DELIBERATELY (swap the faces in `layout.tsx` + the fallbacks in
   `constants/branding/typography.ts`, same commit). **Banned, always:
   `Inter`, `Roboto`, `Arial`, `system-ui`, `Space Grotesk` and other generic
   defaults** — never revert to them. A characterful display face + a clean,
   readable text face, always actually loaded.
3. **Color is a SYSTEM, not ad-hoc hexes.** The runtime theme is the CSS
   variables in `app/web/app/globals.css` (`:root` light + `.dark`), surfaced
   as Tailwind classes (`bg-background`, `text-foreground`, `text-primary`,
   `border-border`, …). Style from those — never hardcode hexes. Rebrand by
   editing those variables + `constants/branding/colors.ts` +
   `DESIGN_SYSTEM.md` together. Cohesive palette, real contrast, intentional
   (sparing) accent use.
4. **Motion + interaction are required, not optional.** Use the `Reveal`
   primitive (`components/ui/reveal.tsx`) for scroll entrances and the
   `animate-fade-up` / `animate-fade-in` utilities; add purposeful
   micro-interactions and transitions — never a static template.
   `prefers-reduced-motion` is already respected globally in `globals.css`.
5. **Deliberate space + hierarchy.** A real grid, generous rhythm, strong
   typographic scale. Composition is a feature.
6. **Two modes — match the surface:**
   - **Marketing / landing / brand pages** → bold, expressive, editorial;
     make a statement.
   - **Product / app / dashboards / data UIs** → restraint, consistency,
     legibility; clarity beats decoration. Don't over-style data.
7. **The bar is awwwards-winner quality, not "fine."** If a reference site
   would sharpen the direction, run `extract-design-system` on it first.
8. **Verify before done:** open `/brand` to confirm the system holds, and do
   a quick accessibility/quality pass (contrast, focus states, keyboard,
   responsive). Builds run on Sonnet by default; for a higher-quality design
   pass the user can opt into Opus per message via
   `@session [model=claude-opus-4-8 effort=high]` in the project chat (the
   model must be the full id — `opus` alone is not recognized).

## Marketing routing

`marketing/README.md` is the marketing system's contract — campaigns,
context, SOPs. Route marketing work by shape:

| Task | Route |
|---|---|
| Research / sentiment / competitor scan | `marketing-researcher` agent (skills: analyze-audience-sentiment, analyze-reference-site) |
| Writing a post / thread / email / repurposing | `content-creator` agent (skills: generate-social-post, repurpose-content, compose-outbound-email) |
| Any visual asset | `creative-designer` agent (skill: generate-marketing-image) |
| Reports / KPIs / funnels | `data-analyst` agent (skills: marketing-report, log-metric) |
| New campaign / launch push | `create-marketing-campaign` skill directly (it orchestrates the rest) |
| Strategy from scratch | `go-to-market-planner` skill directly |
| Pitch / fundraising / sales deck | `create-pitch-deck` skill directly (brand-grounded slides.json → .pptx + live `/assets/pitch/<slug>` preview) |
| UGC / marketing VIDEO | `higgsfield-content-factory` skill (requires the user's Higgsfield connection; batches are approval-gated) |

Use an agent when the task needs synthesis across sources (research,
analysis, multi-piece campaigns); call the skill directly for a
single executional deliverable. Always read
`marketing/context/audience.md` + the active campaign's
`campaign.md` before producing anything user-facing. Approval rules
(contract invariant #3) hold everywhere: organic posts in an active
campaign are standing-approved; outbound email and paid spend never
ship without an explicit user approval.
