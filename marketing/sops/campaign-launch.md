# SOP — launching a campaign

The path from idea → active campaign. Run by the operator (or a
Claude Code session) via the `create-marketing-campaign` skill.

1. **Ground.** Read `docs/go-to-market-plans/` (strategy),
   `marketing/context/*` (audience, offers, competitors),
   `campaigns/INDEX.md` (what's already running — max 2 active
   campaigns at once; finish or pause before adding).
2. **Brief.** Scaffold `campaigns/<slug>/` from
   `templates/campaign.md`. The brief must answer: which segment,
   which pain, which offer/CTA, which channels (≤3), what does
   success look like (ONE `metrics/objectives.json` KPI + target)?
3. **Calendar.** 2–4 weeks of dated checklist items (posts, creatives,
   outreach batches, a mid-point review, a results wrap). Respect the
   standing pace (~2 posts/day/platform max across ALL campaigns).
4. **Approval.**
   - Organic-only campaign → `approval: standing`; set `active` and
     relay one line to the status thread ("Campaign <name> live —
     <k> calendar items over <n> weeks").
   - Outbound email / paid / anything with spend → `approval:
     required`; file a feedback card ("Review campaign <name> before
     I launch") and proceed ONLY with the organic parts until granted.
5. **Schedule.** If timing is precise (launch day, timed drops),
   register an agenda item for the campaign cadence (the operator's
   CreateAgendaItemTool, `every: 24h` typical, instruction:
   "Campaign <slug>: execute due calendar items"). Otherwise the
   regular operate wakes pick up due items.
6. **Run.** Each wake: execute due calendar items per the audience SOP
   (`b2b-pipeline.md` / `b2c-growth.md`), check them off with a
   one-line log (link to what shipped), update INDEX.md.
7. **Wrap.** On endDate (or KPI hit): final `results.md` (numbers vs
   target, what worked, what to keep), `log-metric` the final KPI,
   status → `done`, relay a 2-line wrap to the status thread, and
   fold reusable learnings into `context/` + `style/`.
8. **Plan sync (operator only).** On launch AND wrap, the operator
   updates the business plan doc's **Marketing** section (the
   active-campaigns list) per the runbook's "Keep the business plan
   doc in sync" procedure. Claude Code sessions never write the plan
   doc.
