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
| `app/web/app/` | Routes. `page.tsx` (landing), `login/`, `auth/` (Supabase auth flows), `app/` (the signed-in product surface). |
| `app/web/components/` | Shared React components. |
| `app/web/lib/` | Core wiring: `supabase/` (browser + server clients — the ONLY sanctioned session surface, with `middleware.ts`), `datadog.ts` (logging). |
| `app/web/automations/` | Scheduled/background jobs (e.g. outbound drafts). Sends require explicit user approval — see the agent contract. |
| `app/web/supabase/migrations/` | SQL migrations, applied on every deploy push (`0001_users.sql` + onward). New tables/columns go here, never ad-hoc. |
| `app/desktop/`, `app/native/` | Desktop & mobile shells. Rarely touched unless the task names them. |
| `docs/` | Human-facing docs: `Roadmap.md` (RENDERED view — never hand-edit, see update-roadmap skill), `engineering-plans/`, `go-to-market-plans/`, `branding/identity.md`, this map. |
| `metrics/` | Structured sources of truth: `objectives.json` (KPIs/OKRs), `work-tracker.json` (roadmap data), `monitors.ts`, `datapoints/`. JSON wins over any rendered doc. |
| `environment/` | `app.env` — the env-var REGISTRY: request an API key by adding `KEY=BLANK  # why` (the user fills the value in the Environment tab; never commit real values). `production.env.example` — the env contract for deploys. |
| `ops/` | Operator state: build locks, project notes. Machine-managed; don't design features here. |
| `.claude/` | Agent config: `skills/` (task playbooks), `memories/`, `settings.json`. |
| `BUSINESS_TEMPLATE_AGENT_CONTRACT.md` | The invariants every agent must honor (JSON sources of truth, commit+push discipline, no unapproved sends, account bindings, Supabase auth surface). Read it once per session. |

## Conventions that save you a search

- **Auth**: Supabase only, via `app/web/lib/supabase/` + `middleware.ts`. Don't roll new session handling.
- **Roadmap edits**: go through `.claude/skills/update-roadmap` (mutate `metrics/work-tracker.json`, re-render `docs/Roadmap.md`).
- **Deploys**: every push to `main` deploys staging; the `production` branch is user-promoted only — never push it.
- **DB changes**: add a numbered migration in `app/web/supabase/migrations/`; it runs automatically on the next deploy push.
- **New feature work**: route in `app/web/app/`, components in `app/web/components/`, data access via the Supabase clients in `app/web/lib/supabase/`.

## Feature index

Update this list as features land (one line each — what + where):

- _(seed repo — no product features yet)_
