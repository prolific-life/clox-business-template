# Design references - which products to open for which pattern

Start at `design/library/INDEX.md`: it holds hosted screenshots, measured
rules and frame captures for every pattern below. This file adds the live
products to open when you want more than the library has.

## What a reference is FOR

A reference shows the bar and the concrete decisions behind it: layout
grid, hierarchy, sizes, density, surfaces, states, motion and timing. LOOK
at it while you build and match those decisions closely, in this app's own
tokens, fonts, copy and imagery.

Hard limits (trade dress and licensing):

- Never copy a logo, wordmark, product name, copy, illustration or photo.
- Colors and fonts come from this app's design system, not the reference.
- AGPL source (Midday, Dub) is for studying numbers only.
- Do not commit third-party screenshots; the library links hosted copies.

## Pattern vocabulary (the brief filename slug)

| slug | pattern | open these |
|---|---|---|
| `marketing-hero` | landing / homepage | the design system's example product; EFFECTS.md frames; stripe.com, vercel.com, linear.app |
| `pricing` | pricing / plan comparison | stripe.com/pricing, linear.app/pricing |
| `app-shell` | sidebar + top bar | APP_UI.md 1; linear, attio, shadcn sidebar blocks |
| `dashboard` | overview, stat tiles, charts | APP_UI.md 2-4; midday, tremor, shadcn dashboard-01 |
| `data-table` | tables, lists | APP_UI.md 5; tremor details, shadcn tasks, attio |
| `list-detail` | inbox / mail style split | APP_UI.md 6; shadcn sidebar-09, linear |
| `detail-page` | one object | APP_UI.md 7 |
| `settings-form` | settings, account, forms | APP_UI.md 8; shadcn-admin, tremor settings |
| `sign-in` | auth | APP_UI.md 9; supabase, shadcn login blocks |
| `onboarding` | first run | APP_UI.md 10; linear, notion |
| `empty-state` | zero data | APP_UI.md 11 |
| `composer-editor` | journal, notes, chat input | APP_UI.md 12; reflect, day one, midday composer |
| `calendar-streak` | calendar, habits, streaks | APP_UI.md 13; cal.com booker, things |
| `mobile-home` | phone tab-bar home | APP_UI.md 14; things, strava, headspace |
| `mobile-list-detail` | phone list + detail | APP_UI.md 15 |
| `activity-feed` | notifications, activity | APP_UI.md 16 |

Add a row (do not invent ad hoc) when a genuinely new pattern appears.

## Reachability - which sources the skill may fetch

The gateway pod fetches headlessly (Chromium + a small node http fetch; there
is NO curl). Two source classes:

1. **Live product pages (screenshotted at 1440px and 390px).** Verified
   reachable headless as of this writing (plus most pages linked from the
   library):
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
