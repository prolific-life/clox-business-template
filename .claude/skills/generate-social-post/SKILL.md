---
name: generate-social-post
description: >-
  Draft a single social-media post (X / LinkedIn / Instagram /
  TikTok / Reddit) inside a campaign - or a one-off when no campaign
  fits. Use when a campaign calendar slot is due, or the user says
  "draft/post about X".
---

# Generate a social post

## Inputs
- `topic` - what the post should cover.
- `channel` - `x` | `linkedin` | `instagram` | `tiktok` | `reddit`
  (default: x).
- `campaign` - slug (default: the active campaign whose calendar
  this fills; true one-offs go to `marketing/posts/`).

## Steps
1. Read `docs/branding/identity.md` (voice),
   `marketing/style/STYLE_GUIDE.md` (mechanics),
   `marketing/templates/post-formats.md` (the channel skeleton), and
   `marketing/context/audience.md` (who this lands on).
2. Read the campaign's last 3-5 posts so the new one doesn't repeat
   an angle; tie the topic to something CURRENT (quick web research)
   rather than a generic ad.
3. When the post has a product CTA, resolve its route through
   `ResolveProductLinkTool` immediately before writing the draft, passing the
   destination `channel`. Use only the
   returned `url`. The tool verifies the custom domain first and falls back
   only to a working version-specific READY deployment. Never copy a staging
   alias or an old CTA URL from another post. X links must contain `?x=true`;
   the resolver adds it so Datadog can attribute the landing and signup
   session. If this Claude-only session
   cannot call the tool, leave the CTA URL marked `RESOLVE_BEFORE_REVIEW`
   instead of guessing.
4. Draft within the channel's structure + char limit. One segment,
   one pain/desire, one CTA max.
   Instagram and TikTok are MEDIA-FIRST: neither will accept a
   text-only post, so a draft for either MUST name a `creative:`
   (generate it with generate-marketing-image, or a video for
   TikTok). Instagram carries the link in the bio, not the caption,
   so put the CTA in words ("link in bio") rather than a raw URL.
5. Write `marketing/campaigns/<slug>/posts/<date>-<channel>-<slug>.md`
   with the standard frontmatter from post-formats.md
   (`status: draft`, `scheduledFor`, `creative:` if a visual is
   wanted - generate it via generate-marketing-image).
6. `git commit -m "post: draft <slug> for <channel>"`.

## Publishing
The OPERATOR publishes via its Composio MCP when the item is due.
The exact tool per channel:

| Channel | Publish | Then poll |
|---|---|---|
| X | `TWITTER_CREATION_OF_A_POST` | - |
| LinkedIn | `LINKEDIN_CREATE_LINKED_IN_POST` | - |
| Instagram | `INSTAGRAM_CREATE_POST` (or `INSTAGRAM_CREATE_CAROUSEL_CONTAINER` for multi-image) | `INSTAGRAM_GET_POST_STATUS` |
| TikTok | `TIKTOK_PUBLISH_VIDEO` (video) / `TIKTOK_POST_PHOTO` (stills) | `TIKTOK_FETCH_PUBLISH_STATUS` |

Instagram and TikTok publish asynchronously: the first call returns a
container id, and the post is not live until the status call says so.
Do not write `postedUrl` until it is.

- Call `ResolveProductLinkTool` again with the destination `channel`
  immediately before the send. If an
  approved inventory row contains a different product URL, correct the row,
  let its approval reset, request review again, and do not publish until the
  corrected copy is approved.
- Inside an `active` campaign with `approval: standing` → publish
  directly (organic posts are pre-approved policy), then set
  `status: posted` + `postedUrl`, tick the calendar item, and log in
  `ops/marketing.md` (the pace log - ~2/day/platform MAX across all
  campaigns).
- `approval: required` campaigns or anything sensitive → leave
  `draft` and surface via a feedback card first.
Claude Code sessions DRAFT but never publish - publishing is the
operator's lane. (A future Vercel-cron publisher may take over the
send step; until it exists, the operator is the publisher.)
