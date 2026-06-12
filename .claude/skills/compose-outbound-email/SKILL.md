---
name: compose-outbound-email
description: >-
  Draft (NEVER send) an outbound email for a B2B sequence or a named
  recipient, queue it for user approval. Use when an outreach
  sequence needs its next touch, or the user asks to email someone.
---

# Compose an outbound email

## Inputs
- `to` — recipient email or a lead row from
  `marketing/campaigns/<slug>/outreach/leads.md`.
- `intent` — purpose / sequence touch (1=intro, 2=value, 3=breakup).
- `campaign` — slug; sequence emails belong to a b2b campaign.

## Steps
1. Read `marketing/templates/email-sequences.md` (the touch
   skeleton + hard rules), `marketing/sops/b2b-pipeline.md` (stage
   rules), the lead's research note in `outreach/leads.md`, and
   `docs/branding/identity.md` (voice). Legacy playbook notes may
   also live in `docs/go-to-market-plans/outbound.md`.
2. Draft subject + body per the touch skeleton: ≤120 words,
   personalized from the lead's trigger, ONE low-friction CTA.
3. Write `marketing/campaigns/<slug>/outreach/drafts/<date>-<lead>-t<touch>.md`
   with frontmatter `{to, subject, touch, approved: false,
   campaign}`; update the lead's `next-touch` in leads.md.
4. Approval: batch drafts into ONE feedback card ("Approve outreach
   batch — <k> drafts to <segment>") rather than one card per email.
5. `git commit -m "outbound: drafted t<touch> for <lead>"`.

## Sending
Only AFTER the user approves: the operator sends via its Composio
Gmail/Outlook tools using the bound email account (see
`.claude/memories/MEMORY.md`), then sets `approved: true →
sent: <date>` on the draft and advances the lead's stage. **No
approval, no send — ever.** Any reply STOPS the sequence (see the
b2b SOP). Claude Code sessions draft only; sending is the
operator's lane.
