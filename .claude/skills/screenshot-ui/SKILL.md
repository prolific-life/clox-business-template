---
name: screenshot-ui
description: "MANDATORY for EVERY UI change. The app's UI is reviewed + shown to the user through the STORYBOARD — never the logged-in app (a screenshotter can't log in; pointed at the app it only ever captures the public homepage). Add/update the component or screen in the storyboard registry (app/web/lib/component-registry.tsx) with representative mock data, render it at /component/<name> (no auth, no app-load), screenshot it locally with the gateway's Chromium+Playwright (light + ?theme=dark), POST that screenshot to the project thread so the user sees what you actually built, then critique vs the Design Law and fix. Use whenever you build or change any UI."
metadata: {"openclaw":{"emoji":"📸"}}
---

# screenshot-ui — the storyboard is how UI is seen + reviewed

A screenshotter cannot log into the app, so it can NEVER show a logged-in
screen — point it at the running app and you get the public homepage (or a
login redirect), not your work. So ALL UI is reviewed + shown through the
**storyboard**: every component and screen renders in isolation at
`/component/<name>` — no nav, no chrome, no auth, no real data — which CAN
be screenshotted. This is the ONLY honest way to show the user what you
built.

**Every time you build or change UI, do this — no exceptions:**

## 1. Put it in the storyboard

The storyboard tracks ALL of the app's UI via
`app/web/lib/component-registry.tsx`. Add or update an entry for what you're
building. For a SCREEN (a logged-in page / dashboard / flow), render its
component tree with REPRESENTATIVE MOCK DATA (the sandbox has no auth or real
data) so it looks populated and real — not empty or broken:

```tsx
// app/web/lib/component-registry.tsx
{
  name: 'dashboard',
  description: 'Logged-in dashboard — KPI cards + activity feed',
  render: () => <Dashboard data={MOCK_DASHBOARD} />,
}
```

Keep it current — the registry is the canonical index of the app's UI, and
`/component/<name>` is the only auth-free way to see any of it.

## 2. Screenshot it locally (Chromium + Playwright are in the image)

```bash
export CI=1 COREPACK_ENABLE_DOWNLOAD_PROMPT=0
cd app/web
pnpm dev &
until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done
mkdir -p refs
node -e '
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage();
  await p.setViewportSize({ width: 1280, height: 900 });
  const shots = [
    ["http://localhost:3000/component/dashboard", "refs/dashboard-light.png"],
    ["http://localhost:3000/component/dashboard?theme=dark", "refs/dashboard-dark.png"],
  ];
  for (const [u, o] of shots) {
    await p.goto(u, { waitUntil: "networkidle" });
    await p.screenshot({ path: o, fullPage: true });
  }
  await b.close();
})();'
```

Swap `dashboard` for what you built; shoot both themes for anything with a
dark variant.

## 3. Post it to the project thread — this is what the user sees

For each PNG: mint a signed upload URL, PUT the bytes, then relay the public
URL as an INLINE image to the PROJECT thread (the threadId from your wake):

```sh
# 1) signed upload URL → {"uploadUrl":"…","publicUrl":"…"}
clox-ws-client tool CreateCreativeUploadURLTool '{"workspaceId":"{{WORKSPACE_ID}}","path":"screenshots/dashboard-light.png"}' --user-id {{OWNER_USER_ID}}
# 2) upload the bytes to the signed uploadUrl
curl -s -X PUT -H "Content-Type: image/png" --data-binary @refs/dashboard-light.png "<uploadUrl>"
# 3) post it inline to the project thread
clox-ws-client tool RelayToThreadTool '{"threadId":"<project thread id>","message":"Here'\''s the dashboard:\n\n![dashboard](<publicUrl>)"}' --user-id {{OWNER_USER_ID}}
```

This REPLACES the old deployed-homepage screenshot — the user now sees the
exact UI you built, in both themes.

## 4. Critique + fix

Read each PNG (you're multimodal). Judge it vs the Design Law: opinionated
direction (not the generic "AI site" look), the loaded type pairing (no
banned `Inter`/`system-ui`), theme tokens (no hardcoded hexes), real
hierarchy + spacing, motion where it belongs, dark mode holding up. Fix the
component; re-shoot. Loop until it clears the bar.

## 5. Clean up

```bash
kill %1 2>/dev/null || pkill -f "next dev" 2>/dev/null || true
```

`refs/*.png` are scratch — don't commit them.

## Never

- NEVER screenshot the running logged-in app to show the user — the
  screenshotter isn't logged in, so you capture the public homepage, not your
  work. Use the storyboard.
- NEVER post the homepage as "the preview." If Chromium/Playwright is somehow
  unavailable, SKIP posting rather than posting a misleading shot.
