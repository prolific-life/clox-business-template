# marketing/ — the marketing operating system

This tree is how this business runs marketing. `docs/go-to-market-plans/`
holds STRATEGY (the GTM plan, channel playbooks); this tree holds
OPERATIONS — the grounding context, the style rules, the SOPs, and every
campaign with its artifacts. The operator (OpenClaw) and Claude Code
sessions both work in here; everything is committed.

## Layout

| Path | What it is | Written by |
|---|---|---|
| `context/` | Grounding every marketing task reads FIRST: audience/ICP, offers, competitors. Brand voice lives in `docs/branding/identity.md`; visual system in `docs/branding/DESIGN_SYSTEM.md` — link, don't duplicate. | operator (seeded from the business plan), `analyze-audience-sentiment` |
| `style/STYLE_GUIDE.md` | Mechanical WRITING rules (sentence mix, vocabulary, structures) another AI can follow verbatim. | `build-style-guide` skill |
| `style/creative-styles.md` | Named visual styles for generated creatives + when to use each. | `generate-marketing-image` skill, design passes |
| `sops/` | Step-by-step playbooks: `b2b-pipeline.md`, `b2c-growth.md`, `campaign-launch.md`. The business plan's §6 (B2B vs B2C) decides which pipeline SOP drives the marketing pillar. | platform template; tune per business |
| `templates/` | Skeletons: `campaign.md`, `post-formats.md`. | platform template |
| `campaigns/INDEX.md` | The campaign tracker — one row per campaign, status + KPI vs target. Rendered roll-up of the per-campaign frontmatter; update it in the SAME commit as any campaign change. | `create-marketing-campaign`, operator |
| `campaigns/<slug>/` | One campaign: `campaign.md` (brief + calendar + log), `research.md`, `posts/`, `creatives/`, `outreach/` (B2B), `results.md`. | campaign skills |
| `posts/` | One-off posts that belong to no campaign (rare — prefer campaigns). | `generate-social-post` |

## The campaign model

A campaign is a directory under `campaigns/<slug>/`. `campaign.md`
frontmatter is the structured record:

```yaml
---
slug: jp-cherry-blossom-2026
name: "Japan Cherry Blossom Season"
status: draft | active | paused | done
audience: b2b | b2c
type: launch | evergreen | promo | outbound
channels: [x, linkedin, reddit, email]
startDate: 2026-06-15
endDate: 2026-07-15
kpi: signups            # a metrics/objectives.json key
target: 200
approval: standing | required | granted
---
```

Lifecycle: `draft` → (approval if required) → `active` → `done`/`paused`.
Rules:
- **Organic social inside an active campaign = standing approval** (same
  policy as the operator's existing ~2×/day posting). **Outbound email,
  paid spend, or anything irreversible = `approval: required`** — file a
  feedback card and do NOT execute those items until granted.
- The campaign calendar (checklist in `campaign.md`) is the schedule;
  the operator executes due items on wakes and checks them off with a
  one-line log entry (what shipped, link).
- Results flow to `results.md` + `log-metric` datapoints; the INDEX row
  shows current vs target.

## Plan-doc sync

The user-facing business plan doc (in Clox, not this repo) must
reflect marketing reality: the OPERATOR syncs its **Marketing**
section (active campaigns + KPI status) on campaign launch/wrap and
material KPI changes, via the runbook's "Keep the business plan doc
in sync" procedure. Claude Code sessions never write the plan doc —
one writer.

## Future (platform): Firestore mirror

The repo is canonical. A later platform phase adds an
`UpsertCampaignTool` so the operator mirrors campaign frontmatter to
Firestore (`workspaces/{wsId}/campaigns/{slug}`) and the app's
Marketing tab renders the live board. Until then the INDEX.md is the
board.
