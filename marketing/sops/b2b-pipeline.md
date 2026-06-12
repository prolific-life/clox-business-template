# SOP — B2B pipeline (lead gen → outreach → follow-up)

Applies when the business plan §6 says B2B (or B2B2C selling to the
business side). The unit of work is a NAMED ACCOUNT moving through
stages. Everything here is gated: **no outbound send without explicit
user approval** (the contract's invariant #3).

## Stages & cadence

`prospect → researched → contacted → replied → call/demo → won|lost`

Track per-campaign in `campaigns/<slug>/outreach/leads.md` — one table,
one row per lead: `| company | contact | role | source | stage |
last-touch | next-touch | notes |`.

## 1. Lead gen (research, no sends)
- Source 10–25 leads per pass that MATCH a segment in
  `context/audience.md` — from the watering holes listed there
  (directories, LinkedIn search, communities, "who's hiring for X",
  competitors' public customers). Web research via Claude Code.
- For each: 2-line research note — why them, why NOW (the trigger).
  No generic lists; a lead without a trigger note gets dropped.

## 2. Outreach (drafts only)
- Draft with `compose-outbound-email` — sequence skeletons live in
  `templates/email-sequences.md` (intro → value → breakup; 3 touches
  max, 3–4 days apart).
- Personalize from the research note (their words, their trigger);
  ≤120 words; one specific CTA (15-min call, or a 1-line reply).
- Drafts queue `approved: false`; file ONE feedback card per batch
  ("Approve outreach batch <n> — <k> drafts to <segment>"), not per
  email.

## 3. Follow-up
- On each wake: scan `leads.md` for `next-touch <= today` → draft the
  next sequence step (again approval-gated). Replies (via the
  connected email account) move the stage and STOP the sequence —
  never auto-follow-up a human reply; relay it + file a card if a
  human decision is needed.
- A `won` flips to onboarding: log the win in `results.md` +
  `log-metric`, and add proof to `context/offers.md` once usable.

## Weekly hygiene
Dedupe leads across campaigns, archive `lost` with the reason, and
roll stage counts into `campaigns/<slug>/results.md` (the funnel IS
the B2B KPI).
