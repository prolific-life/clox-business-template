---
name: generate-social-post
description: >-
  Draft a single social-media post (X / LinkedIn / Reddit) inside a
  campaign — or a one-off when no campaign fits. Use when a campaign
  calendar slot is due, or the user says "draft/post about X".
---

# Generate a social post

## Inputs
- `topic` — what the post should cover.
- `channel` — `x` | `linkedin` | `reddit` (default: x).
- `campaign` — slug (default: the active campaign whose calendar
  this fills; true one-offs go to `marketing/posts/`).

## Steps
1. Read `docs/branding/identity.md` (voice),
   `marketing/style/STYLE_GUIDE.md` (mechanics),
   `marketing/templates/post-formats.md` (the channel skeleton), and
   `marketing/context/audience.md` (who this lands on).
2. Read the campaign's last 3–5 posts so the new one doesn't repeat
   an angle; tie the topic to something CURRENT (quick web research)
   rather than a generic ad.
3. Draft within the channel's structure + char limit. One segment,
   one pain/desire, one CTA max.
4. Write `marketing/campaigns/<slug>/posts/<date>-<channel>-<slug>.md`
   with the standard frontmatter from post-formats.md
   (`status: draft`, `scheduledFor`, `creative:` if a visual is
   wanted — generate it via generate-marketing-image).
5. `git commit -m "post: draft <slug> for <channel>"`.

## Publishing
The OPERATOR publishes via its Composio MCP (`TWITTER_*`,
`LINKEDIN_*`, `REDDIT_*`) when the item is due:
- Inside an `active` campaign with `approval: standing` → publish
  directly (organic posts are pre-approved policy), then set
  `status: posted` + `postedUrl`, tick the calendar item, and log in
  `ops/marketing.md` (the pace log — ~2/day/platform MAX across all
  campaigns).
- `approval: required` campaigns or anything sensitive → leave
  `draft` and surface via a feedback card first.
Claude Code sessions DRAFT but never publish — publishing is the
operator's lane. (A future Vercel-cron publisher may take over the
send step; until it exists, the operator is the publisher.)
