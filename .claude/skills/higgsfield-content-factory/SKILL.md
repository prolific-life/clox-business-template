---
name: higgsfield-content-factory
description: >-
  UGC video content pipeline on Higgsfield (Marketing Studio): research
  trends → content plan → generate UGC-style videos in approved
  batches → publish per campaign calendar → cost report. Use when a
  campaign needs VIDEO creatives (UGC, street interviews, unboxing,
  product review, ASMR) and HIGGSFIELD_API_KEY is set. For static
  images use generate-marketing-image.
---

# Higgsfield content factory (operator adaptation)

Adapted from the consumer "Higgsfield Content Factory" skill for
headless operation: no chat buttons — approval gates are FEEDBACK
CARDS, batches never fire unapproved.

## Preconditions
- `HIGGSFIELD_API_KEY` + `HIGGSFIELD_API_SECRET` env set (else stop:
  this skill is Higgsfield-only; relay one line suggesting the user
  connect it on the Connections page).
- Auth header `Authorization: Key $HIGGSFIELD_API_KEY:$HIGGSFIELD_API_SECRET`,
  base `https://platform.higgsfield.ai`. Endpoints evolve — consult
  `https://docs.higgsfield.ai/docs/llms.txt` (their API index) at the
  start of a run rather than guessing routes. **Every generation
  burns the USER's Higgsfield credits — waste none.**
- An active campaign in `marketing/campaigns/` (create one first via
  create-marketing-campaign; videos hang off its calendar).

## Stage 1 — Research → idea cards
Web-research what's converting in this niche on TikTok / Instagram /
YouTube right now. Output `research.md` in the campaign dir: a trends
table + 10–20 idea cards. Each card: format (one of UGC
entertainment / street interview / unboxing / product review / ASMR),
hook line, setting, 4–15s scene description, caption — grounded in
`marketing/context/audience.md` + `brand/voice/`. Real product only
(`app/web/public/logo.*`, offers.md) — never invent claims.

## Stage 2 — Plan
Append a "Video plan" section to the campaign's `campaign.md`: one
row per video (format, idea card ref, scheduled date, channel),
split across the chosen formats. Default 5–10 videos per batch,
batches per format. Update INDEX.md.

## Stage 3 — Generate (GATED)
For EACH batch: file a feedback card "Approve video batch <n> —
<k> <format> videos (~credits estimate)" and STOP that batch until
the user approves (card moved/answered or an explicit chat go).
On approval: generate via the API, poll jobs, download MP4s to
`marketing/campaigns/<slug>/creatives/video/`, publish keepers to
`app/web/public/assets/marketing/<slug>/` + manifest.json (the
/assets gallery + previews render them), log per-video results in
campaign.md. One batch in flight at a time; on API failure log the
failed rows and move on — never tight-loop retries.

## Stage 4 — Publish
Videos ride the NORMAL campaign machinery: calendar items +
generate-social-post frontmatter (`creative:` pointing at the video)
+ the operator's Composio posting under standing/required approval
rules. No separate ads pipeline here (Meta Ads MCP is not wired in
this environment — if the user asks for paid distribution, file a
feedback card).

## Stage 5 — Report
Append to `results.md`: videos produced, credits/cost if the API
exposes usage, engagement once posted (marketing-report pulls the
numbers later). Relay a 2-line wrap to the status thread.
