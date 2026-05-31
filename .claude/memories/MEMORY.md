# Workspace memory

Filled in by `approveBusinessPlan` at materialization
time. Once populated, this file is your durable context
across container restarts — read it first on every
session boot.

## Business

- **Name**: _set at approval_
- **Tagline**: _set at approval_
- **Domain**: _set at approval_
- **Template seed**: _set at approval (git sha of
  business-template @ materialization)_

## Default external accounts

- **Vercel**: _account label_
  (composio_connected_account_id: _id_)
- **Email**: _Gmail | Outlook · address_
  (toolkit: _gmail|outlook_,
   composio_connected_account_id: _id_)

Route `deploy-to-vercel` calls through the Vercel
account above. Route `compose-outbound-email` drafts
through the email account above. If the user names a
different account in a turn, use that for the turn and
confirm the choice.

## Approved business plan

The full 11-section plan from the user's approval is
appended below at materialization time. It is the
canonical reference for every subsequent decision.

_(plan text inserted here)_
