---
name: review-product-design
description: "The WEEKLY comparative design review. Walks the app's own storyboard routes (/component/<name> from app/web/lib/component-registry.tsx, rotating through design/reviews/coverage.json so different components get looked at each week), screenshots each one in both themes, puts them SIDE BY SIDE with named reference products from design/REFERENCES.md, and comes back with 2-4 concrete improvements. Each one is RENDERED as a picture of what the screen could look like (image EDIT of our own screenshot, never a generic stock UI), filed as an approvable backlog item with pillar=design + mockupUrl, and relayed to the owner's co-founder thread as one design_review decision record. A review that finds nothing is a FAILED review - there is always a gap between a surface and the best execution of its pattern. Use on the weekly design review wake."
metadata: {"openclaw":{"emoji":"🎨"}}
---

# review-product-design - find what is worse than the best, and show it

This is not a health check. You are not asking "is this fine". You are
asking **"where does this lose to the best product in its category"**, and
there is ALWAYS an answer, because there is always a gap between a surface
and the best execution of its pattern.

**A design review that reports nothing to improve is a FAILED review.** If
you get to the end with nothing, you compared against a weak reference or
you looked only at the homepage. Go back to step 1 with harder references.

The server enforces this. A `design_review` relay carrying fewer than two
proposals, or a proposal with no rendered mockup, no named comparison, or
no filed backlog item, is REJECTED and handed back to you.

## Why this wake is different from every other backlog rule

Everywhere else, an item needs a MEASURED signal in `whyNow` (a drop-off, a
support message, an owner complaint) or it gets deleted rather than scored.
Design almost never has one, which is exactly why the design cadence used
to close every week with nothing filed.

Here the evidence is **the side-by-side**: a named product, the page you
actually opened, and one plain sentence on the axis they beat us on. That
is a HIGHER bar than "I think this could be nicer", not a lower one. What
is still banned: adding tooltips or help text, renaming buttons, "make it
clearer" with no reference beating us on that exact axis. More words on a
screen is not a design improvement.

## 1. Pick what to look at - components, not just the homepage

The app's building blocks each render isolated and auth-free at
`/component/<name>` (the storyboard - see the `screenshot-ui` skill).
That is the only way to see a logged-in screen, so the review walks those
routes rather than whatever a screenshotter can reach from the front page.

```bash
# Every registered component
cat app/web/lib/component-registry.tsx | grep -n "name:"

# What previous reviews already covered
cat design/reviews/coverage.json 2>/dev/null || echo '{"surfaces":[]}'
```

Pick the **3 to 5 LEAST recently reviewed** entries, plus the public
landing page every time (it is what a stranger sees first). Rotating by
coverage date is what makes individual components get looked at over the
weeks instead of the same two surfaces forever.

If the registry has fewer than 5 entries, that is itself a finding: the
storyboard is the app's index of its own UI, and unregistered screens are
invisible to every review. File adding them as one proposal.

## 2. Screenshot OUR surfaces, both themes

Run the app and shoot each route light + dark, plus the landing page at
desktop and phone widths. The gateway image has Chromium + Playwright.

```bash
export CI=1
SHOTS="$(mktemp -d)"       # scratch, OUTSIDE the repo
pnpm dev --port 3000 >/tmp/dev.log 2>&1 &
sleep 12

# shellcheck disable=SC2016
node -e '
const { chromium } = require("playwright");
const dir = process.argv[1];
const routes = JSON.parse(process.argv[2]);   // ["pricing","dashboard",...]
(async () => {
  const b = await chromium.launch({ headless: true });
  for (const name of routes) {
    for (const theme of ["light", "dark"]) {
      const p = await b.newPage();
      await p.setViewportSize({ width: 1440, height: 900 });
      const q = theme === "dark" ? "?theme=dark" : "";
      try {
        await p.goto(`http://localhost:3000/component/${name}${q}`,
          { waitUntil: "networkidle", timeout: 30000 });
        await p.screenshot({ path: `${dir}/${name}-${theme}.png`,
          fullPage: true });
      } catch (e) { console.log(`skip ${name} ${theme}: ${e.message}`); }
      await p.close();
    }
  }
  await b.close();
})();
' "$SHOTS" '["pricing","dashboard"]'

ls -1 "$SHOTS"
```

**Read every shot yourself.** You are multimodal - open the PNGs. A review
written without looking at the pictures is the empty review wearing a
costume.

## 3. Compare against NAMED products, never against taste

For each surface, classify its pattern (`pricing`, `marketing-hero`,
`dashboard`, `onboarding`, `settings-form`, `empty-state` - the slug
vocabulary is in `design/REFERENCES.md`) and open the 2 to 3 best
executions of that pattern.

Reuse a `design/briefs/<pattern>.md` that is under 30 days old instead of
re-researching it. When there is none, run the **research-ui-references**
skill, which does the capture and writes the brief.

Screenshot the references into the SAME scratch dir and put them side by
side with ours. Then name what they do better in **one plain sentence
each**, on a specific axis:

- hierarchy order (what the eye hits first, second, third)
- spacing rhythm and density
- type scale and weight contrast
- state coverage (empty, loading, error, hover, focus)
- motion, and what it explains
- empty states: do they suggest the first action, or sit blank?

Structure only. **NEVER copy a reference's colors, typefaces, copy, or
logos**, and delete the scratch shots when you are done.

## 4. Render the proposal as a PICTURE

This is the step the owner actually decides from. For each improvement,
generate a mockup of what the screen would look like.

**Edit OUR screenshot - do not generate from scratch.** A prompt-only image
gives a generic stock UI that is not this product, and the owner cannot
tell what changed. The image model takes an input image, so pass ours in:

```bash
# shellcheck disable=SC2016
node -e '
const fs = require("fs");
const key = process.env.GOOGLE_API_KEY;
const model = process.env.GEMINI_IMAGE_MODEL || "gemini-3-pro-image";
const [inPath, outPath, prompt] = process.argv.slice(1);
const b64 = fs.readFileSync(inPath).toString("base64");
fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
  method: "POST",
  headers: { "x-goog-api-key": key, "content-type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [
      { inlineData: { mimeType: "image/png", data: b64 } },
      { text: prompt },
    ] }],
    generationConfig: { responseModalities: ["IMAGE"] },
  }),
}).then(r => r.json()).then(d => {
  const parts = (((d.candidates || [])[0] || {}).content || {}).parts || [];
  const img = parts.find(x => x.inlineData && x.inlineData.data);
  if (!img) { console.error("NO_IMAGE", JSON.stringify(d).slice(0, 300)); process.exit(1); }
  fs.writeFileSync(outPath, Buffer.from(img.inlineData.data, "base64"));
  console.log("WROTE", outPath);
}).catch(e => { console.error("FAIL", e.message); process.exit(1); });
' "$SHOTS/pricing-light.png" "$SHOTS/pricing-proposed.png" \
  "Redraw this exact screen with one change: make the middle plan the clear
   primary choice. Keep the same product, the same brand colors, the same
   wording and the same layout everywhere else. Change only the hierarchy of
   the three plan cards."
```

Prompt rules that make the mockup usable:
- Name the ONE change. A mockup that redesigns everything proves nothing.
- Say "keep the same product, brand colors and wording" explicitly, or the
  model drifts into a different app.
- Then **LOOK at the result**. If it invented a different product, garbled
  the text, or changed the brand, tighten the prompt and retry (max 2).

Host both the before and the after:

```bash
clox-ws-client tool CreateCreativeUploadURLTool \
  '{"workspaceId":"{{WORKSPACE_ID}}","path":"design-review/<date>-<surface>-after.png"}' \
  --user-id {{OWNER_USER_ID}}
# → {"uploadUrl":"…","publicUrl":"https://…"}

# shellcheck disable=SC2016
node -e '
const fs = require("fs");
fetch(process.argv[1], { method: "PUT",
  headers: { "content-type": "image/png" },
  body: fs.readFileSync(process.argv[2]) })
  .then(r => console.log(r.status))
  .catch(e => { console.error(e.message); process.exit(1); });
' "<uploadUrl>" "$SHOTS/pricing-proposed.png"
```

Keep the https `publicUrl` for each. **A proposal with no mockup does not
ship** - the server rejects it.

## 5. File each one as an approvable task

2 to 4 proposals, ranked strongest first. Before filing, check you are not
repeating yourself or overruling the owner:

```bash
clox-ws-client tool ListBacklogItemsTool \
  '{"workspaceId":"{{WORKSPACE_ID}}","status":"inbox,scored,dismissed"}' \
  --user-id {{OWNER_USER_ID}}
```

Skip any proposal that repeats an open item or anything the owner already
dismissed. **A dismissal is final** - never re-suggest it.

Then one call per proposal:

```bash
clox-ws-client tool CreateBacklogItemTool '{
  "workspaceId":"{{WORKSPACE_ID}}",
  "pillar":"design",
  "source":"agent_observation",
  "status":"inbox",
  "title":"Make the pricing page lead with one plan",
  "problem":"All three plans look equally important, so nobody knows which to pick.",
  "whyNow":"Our pricing page makes all three plans look the same. Stripe leads with one, so you know where to start without reading.",
  "mockupUrl":"https://…/design-review/2026-09-14-pricing-after.png",
  "patternSlug":"pricing",
  "uiReferences":[{"product":"Stripe","url":"https://stripe.com/pricing","whatToTake":"One plan is visually louder, so the eye lands on a starting point."}],
  "acceptanceCriteria":["One plan is visibly the recommended one at a glance","The other two stay readable and easy to compare","Works in light and dark"]
}' --user-id {{OWNER_USER_ID}}
```

- `status":"inbox"` - do NOT self-commit design work. The owner approves it
  from the card. Keep the returned item id; the relay needs it.
- `whyNow` states the COMPARISON in plain words a non-technical owner
  understands. No file paths, no component names, no framework words.
- `acceptanceCriteria` describe what the screen must LOOK like when it is
  done, not how to build it.

## 6. Relay it to the owner's co-founder thread

One `design_review` decision record to your **OPERATOR thread** (the
co-founder chat), never a project thread. Paste each mockup inline as
`![](<mockupUrl>)` in the same message so the owner sees the pictures
without clicking.

````
```decision
{"kind":"design_review","date":"<YYYY-MM-DD>","reviewed":[{"surface":"","route":""}],"proposals":[{"itemId":"","title":"","surface":"","route":"","comparedTo":[{"product":"","url":"","whatTheyDoBetter":""}],"gap":"","change":"","beforeUrl":"","mockupUrl":"","effort":"small|medium|large"}],"nextUp":[""]}
```
````

- `reviewed` lists EVERY surface you actually opened, so the coverage claim
  is honest and auditable.
- `gap` = what is worse than the reference. `change` = what to do about it.
  Both in plain words the owner can judge without knowing the codebase.
- `nextUp` names the surfaces the next review should take.

## 7. Record coverage, then stop

```bash
rm -rf "$SHOTS"            # scratch shots never get committed
```

Update `design/reviews/coverage.json` (one entry per surface: route, the
date reviewed, what you filed), append the review to `ops/branding.md`,
then commit and push.

```bash
git status --porcelain     # expect coverage.json + ops/branding.md only
```

**Do NOT build any of the proposals in this wake.** This wake proposes,
the owner approves, and the regular operate wake builds what they approved.

## Never

- NEVER close a review with nothing found. That is a failed wake.
- NEVER propose a change with no rendered mockup - the owner decides from
  the picture.
- NEVER compare against "best practice" or taste. Name the product and the
  page you opened.
- NEVER file tooltip-adding, button-renaming, or "make it more intuitive"
  with no reference beating us on that exact axis.
- NEVER re-suggest something the owner dismissed.
- NEVER commit a reference screenshot, or copy a reference's colors,
  typefaces, copy or logos.
- NEVER review only the homepage. Components are the point.
