# Business template - agent contract

This document is the **interface** between
`core/openclaw/business-template/` and the v9 +
Claude Code agents that operate inside spawned
business workspaces.

## Invariants

1. **`metrics/objectives.json` is the source of truth
   for KPIs/OKRs.** `docs/Roadmap.md` is a rendered
   view of `metrics/work-tracker.json`. If either drifts
   from the underlying JSON, the JSON wins.
2. **All file writes go through `git commit` + `git
   push`** before the response is reported to the user.
   Claude Code's container wrapper enforces this on
   exit; skills must not fight it.
3. **No outbound sends without explicit user approval.**
   Both the `compose-outbound-email` skill and the
   `automations/outbound.ts` cron enforce this - drafts
   land with `approved: false`; only an explicit user
   flip ships them.
4. **Vercel + email accounts are bound at workspace
   creation** (per `.claude/memories/MEMORY.md`).
   Skills route Composio calls through those
   connected_account_ids unless the user names a
   different account for a turn.
5. **Auth is Supabase, wired in `app/web/lib/supabase/`.**
   The browser/server clients + `middleware.ts` are the
   sanctioned session surface. Use
   `supabase.auth.getClaims()` for authorization (never
   `getSession()`). Per-route protection follows
   `app/web/app/protected/page.tsx`. Don't introduce a
   second auth system.
6. **Deploy is Vercel-native - no git hook, no CI
   workflow.** Every push to the production branch
   auto-deploys via Vercel's GitHub integration (the repo
   is linked to a Vercel project at materialization, see
   below). `deploy-to-vercel` is only for an out-of-band
   manual deploy.
7. **Builds run in fresh-context WAVES anchored to
   `ops/STATE.md`.** Each wave is a fresh `--session-id`
   session: **read `ops/STATE.md` first** to orient,
   **update it last**, then STOP - so context never
   accretes across a long build (the wave loop lives in the
   `spec-to-tasks` skill). Offload heavy work to the native
   subagents so the parent wave window stays lean:
   `.claude/agents/code-planner` (returns a ≤1-page
   touch-set instead of loading file bodies) and
   `.claude/agents/code-verifier` (returns pass/fail + a
   failing tail instead of the multi-KB build log).
8. **One-writer rule for `ops/STATE.md`.** Its **NEXT** and
   **DONE** sections are PURE PROJECTIONS of
   `metrics/work-tracker.json` (re-rendered via
   `update-roadmap`, exactly as `docs/Roadmap.md` is) -
   **never hand-edit them**; mutate the tracker and
   re-project. Only **DECISIONS / BLOCKED / INVARIANTS** are
   STATE.md-native (append-only). Degrade-safe: if STATE.md
   drifts from the tracker, `work-tracker.json` wins.
9. **Observability is LOAD-BEARING - never remove or disable
   it.** `app/web/lib/datadog.ts`,
   `app/web/components/DatadogInit.tsx`, and the
   `<DatadogInit/>` render in `app/web/app/layout.tsx` boot
   Datadog RUM, which powers the Clox "Data & Analytics" tab
   (`/app/business/<id>/data`). Deleting or weakening any of
   them silently kills this business's analytics.
   `__tests__/analytics-instrumentation.test.tsx` fails the
   build (`pnpm test`) if they're gone - never delete or
   weaken that test either.

## Owner of each subtree

| Subtree | Owner | Notes |
|---|---|---|
| `.claude/skills/` | platform team | Bumped via PRs to this template repo; spawned workspaces inherit the new versions on next bootstrap |
| `.claude/memories/MEMORY.md` | workspace | Edited by Claude Code as the business evolves |
| `docs/Roadmap.md` | `update-roadmap` skill | Never hand-edit |
| `ops/STATE.md` | build waves (`spec-to-tasks`) | NEXT/DONE project `work-tracker.json` (never hand-edit); DECISIONS/BLOCKED/INVARIANTS are native, append-only |
| `docs/branding/identity.md` | `refresh-marketing-plan` skill | Hand-edit OK; skill re-renders downstream |
| `docs/go-to-market-plans/posts/` | legacy | Superseded by `marketing/campaigns/*/posts/`; don't add new files here |
| `marketing/context/`, `marketing/style/` | marketing skills | `go-to-market-planner` seeds; `analyze-audience-sentiment` + `build-style-guide` refresh |
| `marketing/sops/`, `marketing/templates/` | platform team | Per-business tuning OK; structural changes via template PRs |
| `marketing/campaigns/` | `create-marketing-campaign` + campaign skills | `INDEX.md` updated in the SAME commit as any campaign change |
| `pitch/`, `app/web/public/assets/` | `create-pitch-deck` + `generate-marketing-image` skills | slides.json is the deck source; rebuild deck.pptx + update `assets/manifest.json` in the same commit. `/assets` is public - no secrets |
| `metrics/objectives.json` | `log-metric` skill | Numbers change via skill; structure via PR to template |
| `metrics/work-tracker.json` | `update-roadmap` skill | |
| `metrics/datapoints/` | `log-metric` skill | Append-only |
| `app/web/` | Claude Code (free hands) | Within the established structure |
| `app/web/lib/supabase/` | platform team | Auth client/server/middleware wiring; bumped via template PRs. Read-only for Claude Code unless changing the auth model |
| `app/web/middleware.ts` | platform team | Session refresh + route gate; extend `PUBLIC_PATHS` in `lib/supabase/middleware.ts` to open routes |
| `app/web/app/login/`, `app/web/app/auth/` | platform team | OAuth login + callback flow |
| `app/web/automations/` | Claude Code | Never delete an automation, only disable |
| `app/native/`, `app/desktop/` | future | Placeholder until requested |
| `constants/` | Claude Code | Branding tokens come from `refresh-marketing-plan` |
| `environment/production.env.example` | platform team | Real values land on Vercel |

## What a spawned workspace inherits

A new business workspace gets:

- This entire tree, at the template's HEAD when the
  user approved their plan.
- A **GitHub repo** (created via the GitHub App; see
  `BUSINESS_MODE.md` → *Operating architecture*, which
  supersedes the earlier GCS bare-repo design) with the
  template's filled-in version as the initial commit.
- A **Vercel project linked to that repo** (root dir
  `app/web`, production branch `main`), so every push to
  production auto-deploys and every PR gets a preview -
  no git hook, no CI workflow. The backend creates this
  link at materialization (Vercel API `POST /v9/projects`
  with `gitRepository`, or the bound Vercel Composio
  account) and sets the project's Environment Variables
  from `environment/production.env.example`.
- A **Supabase project** for auth + DB. Its URL + anon key
  are written to the Vercel env as
  `NEXT_PUBLIC_SUPABASE_URL` /
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`; OAuth providers (e.g.
  Google) + redirect URLs are configured in the Supabase
  dashboard. The login flow in `app/web/app/login` works
  as soon as these are set.
- An OpenClaw business container that clones the
  repo, sets env vars, and runs `claude -p` per user
  turn.

## What template upgrades do (and don't) do

Template changes (PRs to
`core/openclaw/business-template/**`) flow into
**new** workspaces immediately. Existing workspaces
keep their initial-commit version unless they
explicitly run the (future) `template-upgrade` skill.
