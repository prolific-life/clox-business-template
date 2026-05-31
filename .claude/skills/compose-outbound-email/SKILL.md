---
name: compose-outbound-email
description: >-
  Draft (never send) an outbound email and queue it for
  user approval. Use when the user asks to send an
  email to a contact, or when an outbound sequence
  needs the next-step draft.
---

# Compose an outbound email

## Inputs
- `to` — recipient email or contact ID.
- `intent` — purpose of the email.
- `referenceUrl` — optional (a related post, doc, etc.).

## Steps
1. Read `docs/go-to-market-plans/outbound.md` for the
   playbook + the current sequence stage.
2. Draft subject + body. Match brand voice from
   `docs/branding/identity.md`.
3. Write to `app/web/queues/outbound/<ISO-timestamp>-<slug>.json`
   with `{to, subject, body, approved: false,
   sequenceStage, referenceUrl}`.
4. Surface a `createUserTask` ("approve this draft to
   <recipient>") for the user.
5. `git commit -m "outbound: drafted <slug> for <to>"`.

## Sending
`app/web/automations/outbound.ts` cron picks up drafts
with `approved: true`. The cron uses
`DEFAULT_EMAIL_COMPOSIO_ACCOUNT_ID` to call Composio's
gmail/outlook send tool. **The cron never sends
unapproved drafts** — that invariant is enforced both
in the cron + in this skill's never-set-`approved`-here
rule.
