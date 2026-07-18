# Design references - the curated source list

Reference grounding is mechanical, not a vibe. Before building any UI surface,
the `research-ui-references` skill screenshots two to three best-in-class
products for the pattern at hand and distills them into a TEXT-ONLY pattern
brief at `design/briefs/<pattern>.md`. This file is the source list that skill
draws from, plus the fixed pattern vocabulary the briefs are named after.

## What a reference is FOR (and what it is NOT)

A reference teaches STRUCTURE: layout grid, hierarchy order, spacing rhythm,
type-scale ratios, component anatomy, and the states a pattern must cover. It
is never a source of pixels. The brief records ratios and decisions in words;
the build then composes those decisions from THIS app's own design tokens and
`components/ui` primitives.

HARD guardrails (trade-dress safety, non-negotiable):

- NEVER record a reference's brand colors or hex values. Tokens only.
- NEVER record its typeface names. The app already has its loaded pairing.
- NEVER record its copy, logos, illustrations, or imagery.
- NEVER pixel-copy a layout. Take the pattern, not the page.
- Every brief must synthesize at least TWO references, so no single product's
  trade dress can be reconstructed from it.
- NEVER commit reference screenshots. They are scratch, shot into a temp dir.

## Pattern vocabulary (the brief filename slug)

Each brief is named `design/briefs/<slug>.md` using EXACTLY one slug from this
list. The slug is the pattern classification, chosen in the skill's first step.
Keep the vocabulary small and stable: the same slug names the brief file, the
reference targets below, and (once wired) the backlog item's pattern field the
server reads to ground its vision critique (see "Server wiring" at the bottom).

| slug | pattern | primary reference targets |
|---|---|---|
| `pricing` | pricing page / plan comparison | stripe.com/pricing, linear.app/pricing |
| `marketing-hero` | landing / marketing hero | stripe.com, vercel.com |
| `dashboard` | dashboard, data table, list view | linear.app |
| `onboarding` | onboarding / first-run flow | linear.app, notion.so |
| `settings-form` | settings, account, form-heavy surface | linear.app, stripe.com |
| `empty-state` | empty state / zero-data placeholder | linear.app, notion.so |

Add a new slug row here (do not invent one ad hoc) when a genuinely new pattern
appears. A one-word, kebab-case noun, matching how the backlog item will name
it.

## Reachability - which sources the skill may fetch

The gateway pod fetches headlessly (Chromium + a small node http fetch; there
is NO curl). Two source classes:

1. **Live product pages (screenshotted at 1440px and 390px).** Verified
   reachable headless as of this writing:
   - stripe.com, stripe.com/pricing
   - linear.app, linear.app/pricing
   - vercel.com
   - notion.so

2. **Canonical guidance pages (fetched as TEXT, not screenshotted).** One per
   brief, for the principles behind the pattern:
   - https://developer.apple.com/design/human-interface-guidelines
   - https://m3.material.io/components

### Do NOT circumvent bot protection

`mobbin.com` and `land-book.com` return 403 to headless fetchers on purpose.
Do NOT spoof a browser, rotate user agents, solve a challenge, or otherwise
work around bot detection to reach them. If a target 403s or times out, drop it
and use another from this list. Two reachable references is the floor; if you
cannot get two, relay one line to the thread saying so and build from the one
plus the guidance page rather than faking it.

## Server wiring (follow-up, not yet live)

The vision critique (`components/go/business/vision_critique.go`) already reads
`design/briefs/<slug>.md` from the business repo, resolving `<slug>` via
`patternSlugForItem(item)`. That resolver returns `""` today, so no brief is
read yet. To light it up, OP-1 adds a `patternSlug` string field to the
`BacklogItem` model and OP-12 changes `patternSlugForItem` to return it. The
stored value MUST be one of the slugs in the table above, so the brief file the
build wrote is the exact file the critique reads back. This file is that shared
vocabulary; keep the two in sync.
