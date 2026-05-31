---
name: log-metric
description: >-
  Record a new datapoint for one of the KPIs/OKRs in
  metrics/objectives.json. Recomputes the objective's
  currentValue from the latest datapoint. Use when the
  user reports a number, when a cron monitor returns a
  fresh value, or when external state changes (e.g.
  Stripe MRR refreshes).
---

# Log a metric datapoint

## Inputs
- `metricId` — must match an objective in
  metrics/objectives.json.
- `value` — numeric.
- `source` — `manual` | `stripe` | `hubspot` | `vercel` |
  agent-defined string.
- `notes` — optional free text.

## Steps
1. Validate `metricId` against
   `metrics/objectives.json`. If not found, surface a
   `chat()` asking the user to add the objective first.
2. Write a new file at
   `metrics/datapoints/<ISO-timestamp>-<metricId>.json`
   with `{metricId, value, observedAt, source, notes}`.
3. Update `metrics/objectives.json` —
   `currentValue` = latest datapoint's value.
4. `git commit -m "metric: <metricId>=<value>
   (source=<source>)"`.

## Side effects
- The PM-renderer pass picks up changes on its next
  debounce window and updates the Tiptap-rendered
  business plan doc visible in v9's chat UI.
