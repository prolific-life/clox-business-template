# app/web

Next.js 15 app the business deploys to Vercel.

## Run locally

From the template root:

```bash
pnpm install
pnpm --filter web dev   # http://localhost:3000
```

The home page reads `constants/app.ts` for app name +
tagline. Edit that file and the page updates on hot
reload.

## Automations

`app/web/automations/` will house cron-driven handlers
(outbound email, inbound triage, marketing research,
social posts). Vercel Cron schedules them via
`vercel.json`'s `crons` block — empty at template seed
time, populated as v9 + Claude Code wire each
automation.
