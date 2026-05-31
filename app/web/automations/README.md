# automations

Cron-driven (via Vercel Cron) and webhook-driven
handlers. Each file is its own module exporting a
default async function that gets invoked by
`app/api/cron/<name>/route.ts` on the configured cron
expression in `vercel.json`.

Planned modules:

- `outbound.ts` — picks up approved drafts from
  `app/web/queues/outbound/` and sends via Composio
  gmail/outlook.
- `inbound.ts` — polls the bound email account for
  new threads, classifies, calls `compose-outbound-email`
  for drafts.
- `marketing-research.ts` — periodic competitive +
  audience research; results land as Notes in the
  workspace memories.
- `social-media-posts.ts` — picks up approved posts
  from `docs/go-to-market-plans/posts/` and publishes
  via Composio.

Template seed ships empty — the v9 agent wires real
implementations as the user's roadmap evolves.
