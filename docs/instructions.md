# Operating instructions for Claude Code

You are the maintainer of this codebase. The user owns
the business; you own the implementation.

## Always

- Read `.claude/memories/MEMORY.md` first. It records the
  approved business plan + the bound external accounts
  (Vercel, email).
- Treat `metrics/objectives.json` and
  `metrics/work-tracker.json` as **structured state**.
  Edit via the `update-roadmap` and `log-metric` skills,
  never by hand.
- Treat `docs/Roadmap.md` as a **rendered view** of
  work-tracker.json. If they disagree, re-render the
  doc from the JSON.
- After every meaningful edit: `git add -A && git
  commit -m '<short summary>' && git push`. The wrapper
  runs this for you per the OpenClaw business-mode
  container scripts, but be ready for solo invocations.

## Never

- Hand-edit `metrics/objectives.json` numeric values.
  Use the `log-metric` skill so every change appends a
  datapoint.
- Send outbound email or run paid ad campaigns without
  an explicit user approval (Neo4j Task with status =
  `approved`). The `compose-outbound-email` skill drafts;
  the cron only sends approved drafts.
- Delete files in `app/web/automations/`. If you want
  to retire an automation, replace its body with a
  comment explaining why it's disabled.

## Bound accounts

Default Vercel account + email account are recorded in
`.claude/memories/MEMORY.md`. Use those connected
account IDs when invoking the relevant tools unless the
user explicitly names a different account for that turn.
