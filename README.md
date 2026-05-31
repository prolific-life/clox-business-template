# business-template

Seed for every business workspace materialized by the v9
business-mode flow. When a user approves their business
plan, the production runtime tars this tree and untars it
into a per-workspace GCS-backed bare git repo. OpenClaw
clones the repo, Claude Code edits the files, and pushes
the changes back.

This directory **also runs locally** for tooling +
template review:

```bash
cd core/openclaw/business-template
pnpm install
cd app/web && pnpm dev   # http://localhost:3000
```

The web app reads `constants/app.ts` for its name + tag
line. Drop the canonical seed values there and the page
re-renders.

## Auth (Supabase, batteries-included)

`app/web` ships a working Supabase OAuth login flow out of
the box — no per-business wiring beyond filling two env
vars + enabling a provider in the Supabase dashboard.

| Path | Role |
|---|---|
| `lib/supabase/client.ts` | Browser client (`createBrowserClient`) for Client Components |
| `lib/supabase/server.ts` | Server client (`createServerClient`) for Server Components / Actions / Route Handlers |
| `lib/supabase/middleware.ts` | `updateSession` — refreshes the session + gates protected routes |
| `middleware.ts` | Wires `updateSession` into the request pipeline (with route matcher) |
| `app/login/` | `/login` page + Google OAuth button (`signInWithOAuth`) |
| `app/auth/callback/route.ts` | OAuth callback — `exchangeCodeForSession` (PKCE) |
| `app/auth/auth-code-error/` | Friendly error page if the exchange fails |
| `app/auth/actions.ts` | `signOut` server action |
| `app/protected/` | Example gated page — the pattern for any auth-required route |

**Per-business setup (done at materialization):**

1. Provision a Supabase project; copy its **URL** + **anon
   key** into the Vercel project env as
   `NEXT_PUBLIC_SUPABASE_URL` /
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see
   `environment/production.env.example`).
2. In the Supabase dashboard: **Authentication → Providers
   → Google**, enable it, and paste the Google Cloud OAuth
   2.0 **Client ID + Secret**.
3. In **Authentication → URL Configuration → Redirect
   URLs**, add `https://<your-domain>/auth/callback` (and
   `http://localhost:3000/auth/callback` for local dev).
4. In Google Cloud, add the Supabase callback
   `https://<project-ref>.supabase.co/auth/v1/callback`
   as an authorized redirect URI.

Auth decisions use `supabase.auth.getClaims()` (validates
the JWT signature against the project's published keys) —
never `getSession()` for authorization. To add another
provider, enable it in Supabase and render a second button
in `app/login/login-button.tsx`.

## Auto-deploy (Vercel ↔ GitHub)

Deploys are **Vercel-native**: there is no CI workflow or
git hook in this template. Once the workspace repo is
linked to a Vercel project, **every push to the production
branch auto-deploys** and every PR gets a preview URL —
this is Vercel's standard GitHub Git integration.

**How the link gets made (at materialization, by the
backend — not in this repo):**

1. The backend creates the GitHub repo (via the GitHub App)
   and seeds it with this filled-in template as the initial
   commit.
2. It creates a Vercel project linked to that repo + the
   `app/web` root directory — via the Vercel API
   (`POST /v9/projects` with `gitRepository`) or the bound
   Vercel Composio account. The production branch defaults
   to `main`.
3. It sets the project's Environment Variables (the
   `production.env.example` keys above).
4. From then on, OpenClaw / Claude Code just commit + push;
   Vercel builds and ships automatically. The
   `deploy-to-vercel` skill is only needed for an
   out-of-band manual deploy.

`app/web/vercel.json` pins `framework: nextjs` and disables
auto-deploys for `internal-*` branches (everything else,
including the production branch + PRs, deploys by default —
`git.deploymentEnabled` defaults to `true`).

## Layout

| Path | Purpose |
|---|---|
| `.claude/` | Skills + settings + MEMORY.md Claude Code reads inside the spawned workspace |
| `docs/` | Human-readable plans the v9 agent maintains over time |
| `environment/` | Documented env vars (production.env.example) |
| `constants/` | app name + branding tokens consumed by `app/web` |
| `metrics/` | KPIs/OKRs as structured JSON + cron monitors |
| `app/web` | Next.js 15 deployable + automations |
| `app/native` | Expo scaffold (later) |
| `app/desktop` | Electron scaffold (later) |

See [`BUSINESS_TEMPLATE_AGENT_CONTRACT.md`](./BUSINESS_TEMPLATE_AGENT_CONTRACT.md)
for what the v9 agent expects to find / edit / never touch.

## Local dev

Phase 0 acceptance: `pnpm install && pnpm --filter web dev`
in this directory boots a working Next.js page at
`localhost:3000` that reads `constants/app.ts`. Phase 1
materialization (the approveBusinessPlan mutation) is what
turns this template into a real spawned workspace.
