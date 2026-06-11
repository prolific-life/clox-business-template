---
name: go-to-market-planner
description: >-
  Generate a complete go-to-market plan for this business or a specific
  launch (ICP, positioning, channel strategy, launch phases, pricing
  angle, success metrics) into docs/go-to-market-plans/. Use when the
  user asks for a GTM plan, launch plan, marketing strategy from
  scratch, or how to get first users. For edits to an EXISTING plan use
  refresh-marketing-plan instead.
---

# Go-to-market planner

## Inputs
- `scope` — whole business, or one launch/feature.
- Context you must read first: `docs/branding/identity.md`,
  `metrics/objectives.json` (the KPIs the plan must serve),
  `docs/Roadmap.md` (what's actually shipping and when).

## Steps
1. Define the ICP: 2–3 concrete segments with the pain, the trigger
   moment, and where they hang out. No demographic mush.
2. Positioning: one-sentence value prop per segment + the alternative
   it beats (including "do nothing"). Align with the brand voice in
   identity.md.
3. Channels: pick ≤3 primary channels with WHY (where the ICP already
   is), the motion per channel (content/outbound/community/product-
   led), cadence, and the first 5 concrete actions for each.
4. Launch phases: pre-launch (waitlist/teasers), launch week
   (day-by-day), post-launch (week 2–4 loops). Tie each phase to the
   channels.
5. Metrics: for each phase, the ONE number that says it worked —
   wired to `metrics/objectives.json` keys where they exist (add new
   objectives via log-metric conventions when they don't).
6. Pricing/offer angle if relevant (free tier, trial shape, launch
   discount) — flag open questions for the user rather than
   inventing financial commitments.
7. Write `docs/go-to-market-plans/<scope>-gtm.md` with those
   sections; keep it action-first (every section ends in next
   actions). Update `docs/go-to-market-plans/README.md` index.
8. Queue any outbound/social drafts the plan calls for through
   compose-outbound-email / generate-social-post (drafts only —
   approval rules hold).
9. Commit (`gtm: <scope> go-to-market plan`).

## Never
- Promise spend, partnerships, or legal/financial commitments — flag
  them as decisions for the user.
- Send anything. Drafts only, per the agent contract.
