---
name: publish-mobile
description: >-
  Publish the Expo app so the user's phone preview
  updates. Use after ANY change under app/native, and
  on first-time native init. Runs `eas update` on the
  `main` channel so the user's already-scanned Expo Go
  QR refreshes to the latest bundle - no new QR.
---

# Publish app/native to Expo (EAS Update)

The user previews the native app by scanning ONE Expo Go QR on the Product
tab - the CHANNEL url `exp://u.expo.dev/<easProjectId>?channel-name=main`.
That channel always resolves the NEWEST publish on the `main` branch, so
every `eas update` you ship lands on their phone on the next refresh, with
no new QR to scan. If you changed `app/native` and DON'T publish, their
phone stays on the last-published bundle - the analog of committing web code
but never deploying it.

## Preconditions
- `EXPO_TOKEN` must be available. When the workspace has one saved it is
  already exported inside `clox-execution-env <workspaceId> <cmd>` - treat
  it as a SECRET: never export, echo, log, commit, or relay it yourself.
- If NO token is set (neither the workspace's saved token nor the gateway
  env's), STOP: file a `suggestion` feedback card (CreateFeedbackTool)
  asking the user to connect an Expo access token on the Product tab, relay
  one line, and end. Never block the wake on it.

## Init once (first publish only - app.json has no extra.eas.projectId)
1. `cd app/native && npm install` - `app/native` is npm-managed and lives
   OUTSIDE the pnpm workspace, so never root `pnpm install` for it.
2. Write `.env` with the three PUBLIC vars (same values the web app uses):
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_APP_URL` = your web app's URL - the staging alias from the
     Deployment section of AGENTS.md (e.g. `https://<repo>-staging.vercel.app`).
     REQUIRED: the native Google sign-in broker posts back to
     `${EXPO_PUBLIC_APP_URL}/auth/native-finish`; omit it and Google sign-in
     dead-ends.
3. `clox-execution-env <workspaceId> npx eas-cli init --non-interactive`.
4. `clox-execution-env <workspaceId> npx eas-cli channel:create main || true`
   (a channel that already exists is fine - the `|| true` keeps it idempotent).
5. Ensure `app.json` keeps `"runtimeVersion": {"policy": "sdkVersion"}` -
   `eas init` / `update:configure` may rewrite it, and that policy is what
   keeps published updates loadable in Expo Go. Fix it back if changed,
   then commit + push the app.json changes.
6. First publish: `clox-execution-env <workspaceId> npx eas-cli update
   --branch main --non-interactive --message "<short what-changed>"`.
7. Save the CHANNEL url (COMPOSE it - do NOT copy the CLI's
   `.../group/<groupId>` link, which is a frozen single-publish snapshot):
   ```sh
   clox-ws-client tool SaveMobileAppTool \
     '{"workspaceId":"<workspaceId>","easProjectId":"<extra.eas.projectId from app.json>","previewUrl":"exp://u.expo.dev/<easProjectId>?channel-name=main","webUrl":"<the CLI's printed dashboard/update link>"}' \
     --user-id <ownerUserId>
   ```
   Use the SAME uuid for `<easProjectId>` in both `easProjectId` and the
   composed `previewUrl`.

## Every publish (after init - the common case)
```sh
cd app/native
clox-execution-env <workspaceId> npx eas-cli update --branch main \
  --non-interactive --message "<short what-changed>"
```
That's it - the saved channel URL already points at `main`, so the phone
picks up this update on refresh. No `SaveMobileAppTool` re-report is needed
unless `easProjectId` changed.

## Verify
- The `eas update` command exits 0 and its output lists the new update (an
  update id / group published to the `main` branch). Read the tail of the
  output and confirm the update is there before you call this done.
- An "incompatible with this version of Expo Go" note means the
  runtimeVersion drifted off `sdkVersion` - fix app.json (init step 5) and
  re-run.

## Never
- Never save the CLI's `https://u.expo.dev/<projectId>/group/<groupId>`
  link as `previewUrl` - it is an IMMUTABLE single-publish snapshot, so the
  user's QR would freeze on that one bundle. Always save the channel url
  `exp://u.expo.dev/<easProjectId>?channel-name=main`.
- Never end a turn that changed `app/native` without publishing - the phone
  preview only updates when you publish.
