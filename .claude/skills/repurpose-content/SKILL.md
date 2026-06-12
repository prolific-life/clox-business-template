---
name: repurpose-content
description: >-
  Turn ONE strong content asset (blog post, video script, launch
  doc, long post) into a channel set — X thread, LinkedIn post,
  newsletter section, carousel copy — each native to its channel,
  expanding with fresh angles rather than summarizing. Use when a
  piece performed well or a campaign calendar needs multi-channel
  coverage from one idea.
---

# Repurpose content

## Inputs
- `source` — path/URL of the asset.
- `targets` — channels to produce (default: the active campaign's
  `channels`).
- `campaign` — slug; outputs land in its `posts/`.

## Steps
1. Read the source + `marketing/style/STYLE_GUIDE.md` +
   `marketing/templates/post-formats.md`.
2. Extract the asset's 3–5 core insights ONCE. Then per target
   channel, REBUILD from the insights using that channel's format
   skeleton — native structure, fresh examples or angles not in the
   source (expansion, not summary), one CTA aligned to the campaign.
3. Each output → `marketing/campaigns/<slug>/posts/<date>-<channel>-<slug>.md`
   with the standard post frontmatter (`status: draft`,
   `scheduledFor` slotted into the campaign calendar's open dates —
   respect the ~2/day/platform pace).
4. If a piece needs a visual, note `creative: pending(<style>)` in
   its frontmatter for a generate-marketing-image pass.
5. Update the campaign calendar checklist (one line per new
   scheduled piece) + commit.

## Never
- Post the same text to two channels.
- Inflate one thin idea across five channels — if the source has
  fewer than 3 real insights, say so and stop at 1–2 outputs.
