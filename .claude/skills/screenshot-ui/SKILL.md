---
name: screenshot-ui
description: "The fast LOCAL visual loop — screenshot a UI component against your own running dev server with the gateway's Chromium+Playwright (no Vercel, no login), then YOU (multimodal) read the PNG and critique it vs the Design Law, fix, re-shoot. Use whenever you BUILD or CHANGE UI: it's faster than waiting on the Vercel deploy + PostPreviewScreenshotTool. Screenshots the /component/<name> sandbox route, which renders ONE component in isolation (no chrome/auth/app-load), incl. ?theme=dark. Degrade-safe: if Chromium/Playwright is unavailable, fall back to the server-side post-deploy screenshot."
metadata: {"openclaw":{"emoji":"📸"}}
---

# screenshot-ui — see the UI locally before the deploy does

When you build or change UI, don't wait on the Vercel deploy to find out
it looks wrong. The gateway image ships Chromium + Playwright, so you can
screenshot a component against your OWN local dev server in seconds, READ
the PNG (you're multimodal), and critique it against the Design Law — then
fix and re-shoot. This is the local mirror of `PostPreviewScreenshotTool`
(which screenshots the *deployed* preview); use this one DURING the build.

## Why the `/component/<name>` route exists

The template ships a `/component/[name]` sandbox route that renders ONE
component in ISOLATION — no nav, no chrome, no auth, no app data load —
so a screenshot needs nothing but the dev server. It supports
`?theme=dark` to render the dark variant. (The `/components` gallery
lists what's available.) That's the URL you shoot — never the full app.

## Run from `app/web`

1. **Start the dev server in the background** and wait for it to answer:

   ```bash
   export CI=1 COREPACK_ENABLE_DOWNLOAD_PROMPT=0
   cd app/web
   pnpm dev &
   # wait for it to come up (~5–10s)
   until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done
   ```

2. **Screenshot the sandbox route(s)** with a tiny inline Playwright
   snippet (`npx playwright` is available; Chromium is installed in the
   image). Shoot both themes for any component that has a dark variant.
   Save PNGs under `refs/`:

   ```bash
   mkdir -p refs
   node -e '
   const { chromium } = require("playwright");
   (async () => {
     const browser = await chromium.launch({ headless: true });
     const page = await browser.newPage();
     await page.setViewportSize({ width: 1280, height: 900 });
     const shots = [
       ["http://localhost:3000/component/hero", "refs/hero-light.png"],
       ["http://localhost:3000/component/hero?theme=dark", "refs/hero-dark.png"],
     ];
     for (const [url, out] of shots) {
       await page.goto(url, { waitUntil: "networkidle" });
       await page.screenshot({ path: out, fullPage: true });
     }
     await browser.close();
   })();
   '
   ```

   Swap `hero` for the component you built and add/remove rows as needed.

3. **READ the PNGs and critique.** Open each `refs/*.png` with the Read
   tool — you see them. Judge against the Design Law: opinionated visual
   direction (not the generic "AI site" look), the loaded type pairing
   (no banned `Inter`/`system-ui`), theme tokens (no hardcoded hexes),
   real hierarchy/spacing, motion where it belongs, and dark mode holding
   up. Fix what's off in the component, then re-shoot. Loop until it
   clears the bar.

4. **Kill the dev server when done:**

   ```bash
   kill %1 2>/dev/null || pkill -f "next dev" 2>/dev/null || true
   ```

   (The `refs/*.png` are scratch — don't commit them.)

## Degrade-safe

If Playwright or Chromium isn't available in this environment (older
pod, missing browser), DON'T block the build: skip the local loop and
fall back to the server-side post-deploy screenshot
(`PostPreviewScreenshotTool` against the deployed preview) to verify the
visual after the push. Local-first is faster; the deploy screenshot is
the safety net.
