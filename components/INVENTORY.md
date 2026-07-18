# Component inventory - the shared UI ledger

This is the canonical list of the app's reusable UI components. It exists to
stop hand-rolled one-offs: before you build any UI, you read this ledger and
grep `app/web/components/`, and if an existing component covers 80% or more of
the need you EXTEND it (props / variants) instead of adding a file. The
`create-ui-component`, `spec-to-tasks`, and `verify-build` skills enforce this.

## The reuse rules (also in the operator runbook and the build skills)

- **Inventory first.** Read this file and grep `app/web/components/` before
  creating anything. Covered 80%+ by an existing component? Extend it via a
  prop or variant; a NEW file needs a one-line justification relayed to the
  thread.
- **Variants before new components.** A new visual style of an existing thing
  is a variant, not a new file. Cap the prop surface; compose with children.
- **Extract on second use.** The SECOND time a visual appears anywhere, extract
  it into `app/web/components/ui`, replace BOTH call sites, and register it,
  all in the same commit.
- **Design tokens only.** No raw hex in feature code. Colors come from the
  theme tokens (`app/web/constants/branding/*`, Tailwind theme vars), never a
  literal like `#7c3aed`.
- **Keep this ledger honest.** Any commit that adds, extracts, or changes a
  shared component updates its row here AND its
  `app/web/lib/component-registry.tsx` entry in the SAME commit. The
  `/component/<name>` link below must resolve in the storyboard.

## Ledger

Usage = consumer files under `app/web` importing the component (excludes the
`components/ui` source and the registry). Regenerate a row's usage with
`grep -rl "\bButton\b" app/web --include='*.tsx' | grep -v components/ui`.

| Component | Path | Variants / props | When to use | Storyboard | Usage | Last touched |
|---|---|---|---|---|---|---|
| Button | `app/web/components/ui/button.tsx` | `variant`: primary / secondary / outline / ghost / destructive / link; `size`: sm / md / lg / icon; `asChild` | Any action / navigation trigger. `asChild` to render a link as a button. | [/component/button](/component/button) | 2 | 2026-06-17 |
| Card + CardHeader / CardTitle / CardDescription / CardContent / CardFooter | `app/web/components/ui/card.tsx` | Compositional slots (no variant prop) | Any surface panel: KPI tile, list item, section container. Compose the slots you need. | [/component/card](/component/card) | 0 | 2026-06-17 |
| Input | `app/web/components/ui/input.tsx` | Native input props (`type`, `disabled`, `placeholder`, `defaultValue`) | Single-line text entry in a form. Pair with a label for a11y. | [/component/input](/component/input) | 0 | 2026-06-17 |
| Badge | `app/web/components/ui/badge.tsx` | `variant`: default / secondary / outline / accent; `asChild` | Status / label pill: a tag, a state, a count. | [/component/badge](/component/badge) | 0 | 2026-06-17 |
| Reveal | `app/web/components/ui/reveal.tsx` | `delay` (seconds), `className` | Scroll-into-view entrance for sections, cards, hero content. Honors prefers-reduced-motion. Stagger siblings with `delay`. | [/component/reveal](/component/reveal) | 0 | 2026-06-17 |
| Logo | `app/web/components/ui/logo.tsx` | `showWordmark`, `className`, `imgClassName`, `wordmarkClassName` | The single source of truth for the business mark. EVERY surface uses this; never hand-render a header from `appName` or hardcode a logo path. | [/component/logo](/component/logo) | 5 | 2026-06-17 |

## Adding a row

When you extract or add a shared component, append a row above and, in the same
commit, add its `componentRegistry` entry in `app/web/lib/component-registry.tsx`
with representative sample props so `/component/<name>` renders it in isolation.
Then update the Usage count on any rows whose call sites you changed.
