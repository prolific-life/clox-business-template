---
name: refresh-marketing-plan
description: >-
  Update a marketing or GTM strategy doc (positioning,
  channel plans, brand voice, etc.). Use when the user
  asks to revise marketing, change positioning, switch
  channels, or update the brand voice.
---

# Refresh the marketing plan

## Inputs
- `section` — which file to update under
  `docs/go-to-market-plans/` or `docs/branding/`.
- `intent` — what the user wants changed.

## Steps
1. Read the target doc + `docs/branding/identity.md`
   for voice grounding.
2. Apply the change. Preserve front-matter / explicit
   sections; rewrite section bodies.
3. If the change is significant (changes positioning,
   ICP, or core voice), also update
   `docs/branding/identity.md` so downstream skills
   stay consistent.
4. `git commit -m "marketing: <short summary>"`.

## Never
- Touch `metrics/objectives.json` from here — that's
  the `log-metric` skill's lane.
- Auto-publish anything. Social posts go through
  `generate-social-post`; emails through
  `compose-outbound-email`. This skill is plan-only.
