---
name: deploy-to-vercel
description: >-
  Ship the current state of app/web to Vercel using the
  bound DEFAULT_VERCEL_COMPOSIO_ACCOUNT_ID. Use when a
  meaningful change is ready (new feature, copy update,
  branding edit) — debounced to one deploy per 60s
  window by the wrapper script.
---

# Deploy app/web to Vercel

## Inputs
- None. Reads
  `DEFAULT_VERCEL_COMPOSIO_ACCOUNT_ID` from the
  container env.

## Steps
1. Walk `app/web/` excluding `.next/`, `node_modules/`,
   `.env*`.
2. Build the Vercel files manifest.
3. Call Composio's Vercel `create_deployment` tool
   (slug: `VERCEL_CREATE_NEW_DEPLOYMENT`) with the
   manifest + the project ID from
   `app/web/vercel.json`.
4. Wait for the deploy to settle (poll
   `VERCEL_GET_DEPLOYMENT_BY_ID` until status is `READY`
   or `ERROR`, timeout 5 min).
5. On success: capture the prod URL, update
   `.claude/memories/MEMORY.md`'s
   `WEB_APP_URL`, and surface a thread message with the
   URL.
6. On failure: surface a thread message with the
   Vercel error + a `createUserTask` for the user to
   inspect.

## Never
- Deploy without the user-initiated trigger (chat
  message OR a roadmap completion event that crosses
  the explicit `auto_deploy: true` flag on the
  affected story).
- Skip the wait + capture step. The MEMORY.md update
  is what makes the v9 chat surface show the live URL.
