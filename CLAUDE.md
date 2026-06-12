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

Use an agent when the task needs synthesis across sources (research,
analysis, multi-piece campaigns); call the skill directly for a
single executional deliverable. Always read
`marketing/context/audience.md` + the active campaign's
`campaign.md` before producing anything user-facing. Approval rules
(contract invariant #3) hold everywhere: organic posts in an active
campaign are standing-approved; outbound email and paid spend never
ship without an explicit user approval.
