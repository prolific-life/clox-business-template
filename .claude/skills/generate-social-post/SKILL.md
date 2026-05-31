---
name: generate-social-post
description: >-
  Draft a single social-media post about a given topic
  and queue it for the cron-driven publisher. Use when
  the user says "draft a post about X" or when a
  scheduled content slot needs a fill.
---

# Generate a social post

## Inputs
- `topic` — what the post should cover.
- `channel` — `x` | `linkedin` | `reddit` (default: x).
- `voice` — pulled from `docs/branding/identity.md` unless
  the user explicitly overrides for this turn.

## Steps
1. Read `docs/branding/identity.md` for voice + tone.
2. Read the last 3–5 posts in
   `docs/go-to-market-plans/posts/` so the new one
   doesn't repeat recent angles.
3. Draft the post (≤ channel char limit).
4. Write to
   `docs/go-to-market-plans/posts/<ISO-timestamp>-<slug>.md`
   with frontmatter `{channel, scheduledFor, approved:
   false, topic}`.
5. `git commit -m "post: draft <slug> for <channel>"`.
6. Surface a `createUserTask` so the user approves
   before the cron sends.

## Sending
`app/web/automations/social-media-posts.ts` runs on a
Vercel cron and only picks up posts with
`approved: true` AND `scheduledFor <= now`. The user
flips `approved` from the v9 chat via a follow-up
`update-roadmap`-style edit (or a future
`approve-post` skill).
