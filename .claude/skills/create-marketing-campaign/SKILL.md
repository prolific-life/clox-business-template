---
name: create-marketing-campaign
description: >-
  Scaffold and launch a marketing campaign: brief, dated calendar,
  approval gate, tracker row. Use when the user asks for a campaign /
  launch push / promo, or when the GTM plan's next play needs
  operationalizing. For the strategy itself use go-to-market-planner;
  this skill turns strategy into a running campaign.
---

# Create a marketing campaign

Follow `marketing/sops/campaign-launch.md` exactly. Condensed:

1. Read `marketing/campaigns/INDEX.md` first — max 2 active
   campaigns; propose pausing/wrapping one if at the cap (don't just
   stack).
2. Ground in `docs/go-to-market-plans/` + `marketing/context/*`. The
   campaign must serve a KPI key that exists in
   `metrics/objectives.json` (add one via log-metric conventions if
   genuinely new).
3. Scaffold `marketing/campaigns/<slug>/` from
   `marketing/templates/campaign.md`: campaign.md (frontmatter +
   brief + 2–4 week dated calendar), empty `posts/`, `creatives/`,
   `research.md`; `outreach/leads.md` too when audience is b2b.
4. Approval per the SOP: organic-only → `approval: standing`, status
   `active`; outbound/paid → `approval: required`, status stays
   `draft`, file ONE feedback card ("Review campaign <name> before I
   launch") and only the organic items may run meanwhile.
5. Add the INDEX.md row (same commit). If timing is precise, register
   the agenda item per the SOP step 5.
6. Commit + push; relay ONE line to the status thread with the
   campaign name, window, and first calendar item.
