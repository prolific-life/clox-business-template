---
name: marketing-report
description: >-
  Roll campaign performance into a report: per-channel numbers,
  KPI vs target, what worked, next moves. Updates the campaign's
  results.md + INDEX.md row and logs the KPI datapoint. Use at a
  campaign's mid-point review, wrap, or on request ("how's the
  campaign doing?").
---

# Marketing report

## Steps
1. Gather numbers for the campaign window:
   - Post engagement via Composio analytics tools where the platform
     exposes them (X/LinkedIn metrics endpoints) — match posts via
     `postedUrl` in `posts/*.md`.
   - Product-side results from Datadog (`DATADOG_*` via Composio):
     traffic, signups, conversions on the campaign's CTA page.
   - The campaign KPI's `metrics/datapoints/` history.
   Record what was UNAVAILABLE explicitly — never guess a number.
2. Write/refresh `marketing/campaigns/<slug>/results.md`:
   - Topline: KPI current vs target, trend arrow, days left.
   - Per-channel table: posts shipped, best post (link + why),
     engagement totals.
   - B2B campaigns: the funnel (prospect→contacted→replied→call→won
     counts from `outreach/leads.md`).
   - 3 bullets: what worked / what flopped / the steer (which
     calendar items to change).
3. `log-metric` the KPI's current value (source: the platform it
   came from).
4. Update the campaign's INDEX.md row (Current / Target column);
   apply the steer to the campaign calendar in the same commit.
5. Relay a 2-line summary to the status thread; at wrap, follow the
   campaign-launch SOP step 7 instead.
