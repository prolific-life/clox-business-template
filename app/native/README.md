# app/native — the business's mobile app (Expo)

A React Native app (Expo SDK, managed workflow) that ships with every
business. Out of the box: **Sign in with Google** + **email/password**
(both via the business's Supabase project) and a placeholder home screen
the real product replaces.

## How users preview it (no app store needed)

Publishing happens through **EAS Update**: each publish uploads the JS
bundle to Expo's CDN; the user scans the QR in the app's **Product** tab
and the build opens in **Expo Go** on their phone. There is no dev server
to keep running and updates land on next scan/reload.

## Operator: one-time init (requires EXPO_TOKEN in your environment)

```sh
cd app/native
npm install
cp .env.example .env   # fill EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY (same
                       # values as the web app's Vercel env — public)
npx eas-cli init --non-interactive   # creates the EAS project
npx eas-cli update:configure --non-interactive
# CRITICAL: keep "runtimeVersion": {"policy": "sdkVersion"} in app.json —
# update:configure may rewrite it; the sdkVersion policy is what keeps
# published updates loadable in Expo Go.
```

## Operator: publish (after every app/native change)

```sh
cd app/native && npx eas-cli update --branch main --non-interactive \
  --message "<short what-changed>"
```

Then report the preview link so the Product tab QR updates — copy the
Expo Go / preview URL **verbatim from the eas output** (never compose it
by hand):

```sh
clox-ws-client tool SaveMobileAppTool \
  '{"workspaceId":"<wsId>","easProjectId":"<uuid from app.json extra.eas.projectId>","previewUrl":"<verbatim from eas update output>"}' \
  --user-id <ownerUserId>
```

## Auth notes

- **Email/password** works on a fresh Supabase project (confirmations
  are ON by default — sign-ups get a confirmation email).
- **Google** needs one-time Supabase config: enable the Google provider
  (Auth → Providers) and allow-list this app's redirect URL (the
  `exp://…` URI `makeRedirectUri()` produces in Expo Go, plus the
  `businessapp://` scheme for store builds).

## Local dev

`npm run start` then scan the terminal QR with Expo Go on the same
network (or `--tunnel` from anywhere).
