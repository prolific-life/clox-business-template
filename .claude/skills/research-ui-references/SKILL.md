---
name: research-ui-references
description: "Run BEFORE building ANY UI surface. Grounds the build in best-in-class references instead of a vibe. CLASSIFY the pattern (pricing, marketing-hero, dashboard, onboarding, settings-form, empty-state); if design/briefs/<pattern>.md already exists and is under 30 days old, reuse it and stop; else screenshot 2-3 named reference products headlessly (design/REFERENCES.md) at 1440px + 390px into a SCRATCH dir (never committed), fetch one guidance page as text, then run one vision pass per shot into a TEXT-ONLY pattern brief at design/briefs/<pattern>.md (layout grid, hierarchy, spacing rhythm, type scale ratios, component anatomy + states). NEVER record brand colors, typefaces, copy, logos, or illustrations; synthesize at least TWO references. The build then follows the BRIEF plus the app's own tokens - never the screenshots. Use whenever you build or restyle a UI pattern."
metadata: {"openclaw":{"emoji":"🔬"}}
---

# research-ui-references - grounded design, not a vibe

Reference grounding is MECHANICAL here, not a suggestion in the prompt. Before
any UI build you distill 2-3 best-in-class products into a text-only pattern
brief the build follows. Research is per-PATTERN, not per-task: once a fresh
brief exists you reuse it.

The two hard boundaries, enforced by the extraction prompt in step 5:

- A brief records STRUCTURE (layout, hierarchy, spacing rhythm, type-scale
  ratios, component anatomy, states). It NEVER records brand colors, hex
  values, typeface names, copy, logos, or illustrations. Trade dress stays out.
- The build receives ONLY the brief plus THIS app's design tokens. It never
  sees the screenshots, never lifts a hex, never adds a font. It composes from
  `app/web/components/ui`.

Read `design/REFERENCES.md` first - it holds the pattern-to-URL map, the fixed
slug vocabulary, and the reachability rules.

## 1. Classify the pattern

Name the surface with EXACTLY one slug from the `design/REFERENCES.md` table:
`pricing`, `marketing-hero`, `dashboard`, `onboarding`, `settings-form`, or
`empty-state`. That slug names the brief file and (once wired) the backlog
item's pattern field. Do not invent a slug; if nothing fits, add a row to
REFERENCES.md first.

## 2. Reuse a fresh brief - stop early

```bash
PATTERN="pricing"   # the slug from step 1
BRIEF="design/briefs/${PATTERN}.md"
if [ -f "$BRIEF" ] && [ -n "$(find "$BRIEF" -mtime -30 2>/dev/null)" ]; then
  echo "Fresh brief exists ($BRIEF, under 30 days) - reuse it, skip research."
fi
```

If that prints the reuse line, STOP the skill and build from the existing
brief. Only research when the brief is missing or older than 30 days.

## 3. Pick the references

From the pattern's row in `design/REFERENCES.md`: one canonical guidance page
(Apple HIG or Material 3) fetched as TEXT, plus one or two live product pages
screenshotted. Two reachable references is the FLOOR. If a target 403s or times
out, drop it and pick another from the list - NEVER work around bot protection
(mobbin.com / land-book.com block headless on purpose; do not circumvent).

## 4. Capture into a SCRATCH dir (never committed)

Screenshots go OUTSIDE the repo so they can never be committed. The gateway
image already has Chromium + Playwright (the same install `screenshot-ui`
uses); this just points them at external URLs. It has node but NO curl, so the
guidance page is fetched with node's https.

```bash
export CI=1
REFS_DIR="$(mktemp -d)"     # outside the repo - scratch only

# Guidance page as TEXT (node, no curl). Strips tags to plain text.
node -e '
const https = require("https");
const url = process.argv[1];
https.get(url, { headers: { "User-Agent": "clox-design-research" } }, (r) => {
  let d = "";
  r.on("data", (c) => (d += c));
  r.on("end", () => {
    const text = d
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    process.stdout.write(text.slice(0, 8000));
  });
}).on("error", () => process.exit(0));
' "https://m3.material.io/components" > "$REFS_DIR/guidance.txt"

# Product pages at desktop (1440) + mobile (390). Swap the URLs for the
# pattern's targets from design/REFERENCES.md. Single quotes are intentional:
# the ${...} below are JS template literals, not shell expansions.
# shellcheck disable=SC2016
node -e '
const { chromium } = require("playwright");
const dir = process.argv[1];
const targets = [
  ["https://stripe.com/pricing", "stripe-pricing"],
  ["https://linear.app/pricing", "linear-pricing"],
];
(async () => {
  const b = await chromium.launch({ headless: true });
  for (const [u, name] of targets) {
    for (const [w, tag] of [[1440, "desktop"], [390, "mobile"]]) {
      const p = await b.newPage();
      await p.setViewportSize({ width: w, height: 900 });
      try {
        await p.goto(u, { waitUntil: "networkidle", timeout: 30000 });
        await p.screenshot({ path: `${dir}/${name}-${tag}.png`, fullPage: true });
      } catch (e) {
        console.log(`skip ${u} @${w}: ${e.message}`);
      }
      await p.close();
    }
  }
  await b.close();
})();
' "$REFS_DIR"

ls -1 "$REFS_DIR"
```

If a page yields a nearly empty `guidance.txt` (a JS-only shell), re-capture it
with Playwright's `page.innerText("body")` instead - text either way, never a
screenshot of the guidance page.

## 5. One vision pass per screenshot into a TEXT-ONLY brief

Read each PNG in `$REFS_DIR` (you are multimodal) and read `guidance.txt`, then
write `design/briefs/<pattern>.md`. Extract with this prompt, verbatim in
intent:

> From these reference screenshots, describe ONLY the reusable STRUCTURE of the
> pattern. Record: the layout grid and column rhythm; the hierarchy order (what
> the eye hits first, second, third); the spacing rhythm as RELATIVE ratios
> (for example section padding is roughly 3x card padding), never pixel values;
> the type scale as ratios and the weight contrast between levels; the component
> anatomy and every state it must cover (default, hover, focus, empty, loading,
> error, disabled); and 2-3 sentences on what makes it feel premium. You MUST
> NOT record any brand color, hex value, typeface name, copy text, logo, or
> illustration. Synthesize AT LEAST TWO references so no single product's look
> can be reconstructed.

Brief skeleton:

```markdown
# <pattern> pattern brief

References synthesized: <product A>, <product B> (+ guidance: HIG | M3)
Captured: <YYYY-MM-DD>   (regenerate when older than 30 days)

## Layout grid
## Hierarchy order
## Spacing rhythm (relative ratios)
## Type scale (ratios + weight contrast)
## Component anatomy + states
## What makes it feel premium (2-3 sentences)
```

The brief is TEXT only. No hex, no font names, no copy lifted from a reference.

## 6. Clean up scratch, then build from the brief

```bash
rm -rf "$REFS_DIR"
```

The screenshots are gone; only `design/briefs/<pattern>.md` is committed.
Confirm nothing scratch leaked into the repo:

```bash
git status --porcelain   # expect ONLY design/briefs/<pattern>.md
```

Now build. The build prompt gets the BRIEF plus the app's tokens
(`app/web/constants/branding/*`) and `components/ui` primitives - NOT the
screenshots. No hex literals, no new fonts. Post the reference URLs plus 3-5 of
the brief's extracted decisions to the project thread so the owner sees the
grounding.

## 7. Self-critique against the BRIEF (max 2 iterations)

Run the `screenshot-ui` skill on what you built, then judge the storyboard
shot AGAINST THE BRIEF, not against the references: is the hierarchy order
present? is the spacing rhythm consistent? are the required states covered? Fix
and re-shoot. Cap at 2 iterations, then ship.

## Never

- NEVER commit a reference screenshot. Scratch dir only, deleted in step 6.
- NEVER record a reference's colors, hex, typefaces, copy, logos, or imagery.
- NEVER hand a screenshot to the build step - the brief is the only handoff.
- NEVER build from a single reference - two is the floor (trade-dress safety).
- NEVER circumvent bot protection to reach a blocked source.
