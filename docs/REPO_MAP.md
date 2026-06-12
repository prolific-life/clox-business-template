# Repo map

Navigation doc for agents working in this repo. **Read this before
exploring the tree** — it answers most "where does X live" questions
without a file crawl. **Keep it honest**: whenever you add, move, or
remove a top-level area, route group, or core lib, update this file in
the same commit (see `.claude/skills/maintain-repo-map`).

## Layout

| Path | What lives there |
|---|---|
| `app/web/` | The product — Next.js (App Router) + Supabase. This is where almost all feature work happens. |
| `app/web/app/` | Routes. `page.tsx` (landing), `login/`, `auth/` (Supabase auth flows), `app/` (the signed-in product surface), `brand/` (the living brand-guidelines page — rendered from `constants/branding`, never hardcoded). |
| `app/web/components/` | Shared React components. |
| `app/web/lib/` | Core wiring: `supabase/` (browser + server clients — the ONLY sanctioned session surface, with `middleware.ts`), `datadog.ts` (logging). |
| `app/web/automations/` | Scheduled/background jobs (e.g. outbound drafts). Sends require explicit user approval — see the agent contract. |
| `app/web/supabase/migrations/` | SQL migrations, applied on every deploy push (`0001_users.sql` + onward). New tables/columns go here, never ad-hoc. |
| `app/desktop/`, `app/native/` | Desktop & mobile shells. Rarely touched unless the task names them. |
| `docs/` | Human-facing docs: `Roadmap.md` (RENDERED view — never hand-edit, see update-roadmap skill), `engineering-plans/`, `go-to-market-plans/` (GTM STRATEGY — plans + channel playbooks), `branding/identity.md`, `branding/DESIGN_SYSTEM.md` (canonical visual+brand tokens — ads/slides/creatives read this), this map. |
| `marketing/` | Marketing OPERATIONS — `context/` (audience/offers/competitors grounding), `style/` (writing STYLE_GUIDE + creative styles), `sops/` (b2b-pipeline, b2c-growth, campaign-launch), `templates/`, `campaigns/<slug>/` (brief + calendar + posts + creatives + outreach + results; `INDEX.md` is the tracker). Contract: `marketing/README.md`. |
| `pitch/` | Pitch/fundraising decks — `decks/<slug>/outline.md` (working narrative) + templates. PUBLISHED decks live at `app/web/public/assets/pitch/<slug>/` (slides.json + deck.pptx, built by `app/web/tools/build-deck.mjs`), rendered live at the app's `/assets/pitch/<slug>`. Contract: `pitch/README.md`. |
| `app/web/public/assets/` | Published agent artifacts (deck files, final marketing creatives) + `manifest.json` (the /assets index). Served statically on every deploy; `/assets/*` routes are PUBLIC. |
| `metrics/` | Structured sources of truth: `objectives.json` (KPIs/OKRs), `work-tracker.json` (roadmap data), `monitors.ts`, `datapoints/`. JSON wins over any rendered doc. |
| `environment/` | `app.env` — the env-var REGISTRY: request an API key by adding `KEY=BLANK  # why` (the user fills the value in the Environment tab; never commit real values). `production.env.example` — the env contract for deploys. |
| `ops/` | Operator state: build locks, project notes. Machine-managed; don't design features here. |
| `.claude/` | Agent config: `skills/` (task playbooks), `agents/` (subagent roles: marketing-researcher, content-creator, creative-designer, data-analyst), `memories/`, `settings.json`. |
| `BUSINESS_TEMPLATE_AGENT_CONTRACT.md` | The invariants every agent must honor (JSON sources of truth, commit+push discipline, no unapproved sends, account bindings, Supabase auth surface). Read it once per session. |

## Conventions that save you a search

- **Auth**: Supabase only, via `app/web/lib/supabase/` + `middleware.ts`. Don't roll new session handling.
- **Roadmap edits**: go through `.claude/skills/update-roadmap` (mutate `metrics/work-tracker.json`, re-render `docs/Roadmap.md`).
- **Deploys**: every push to `main` deploys staging; the `production` branch is user-promoted only — never push it.
- **DB changes**: add a numbered migration in `app/web/supabase/migrations/`; it runs automatically on the next deploy push.
- **New feature work**: route in `app/web/app/`, components in `app/web/components/`, data access via the Supabase clients in `app/web/lib/supabase/`.
- **Marketing work**: ground in `marketing/context/*` first; campaigns via `.claude/skills/create-marketing-campaign`; routing table in `CLAUDE.md` → Marketing routing.

## Feature index

Update this list as features land (one line each — what + where):

- _(seed repo — no product features yet)_
