---
name: update-roadmap
description: >-
  Edit the roadmap (epics, stories, sub-tasks) in a single
  atomic operation. Use when the user adds, changes,
  prioritizes, or completes any work item. Maintains both
  metrics/work-tracker.json (structured source of truth)
  and docs/Roadmap.md (rendered human-readable view).
---

# Update the roadmap

## Inputs
- One or more roadmap mutations (add epic, add story to
  epic, mark story complete, change story status, etc.).

## Steps
1. Read `metrics/work-tracker.json`.
2. Apply the mutation. Story IDs are stable UUIDs; reuse
   existing IDs when modifying.
3. Write back to `metrics/work-tracker.json`.
4. Re-render `docs/Roadmap.md` from the new tree (Now /
   Next / Later sections, then per-epic story lists).
5. `git add metrics/work-tracker.json docs/Roadmap.md &&
   git commit -m "roadmap: <short summary>"`.

## Never
- Hand-edit `metrics/work-tracker.json` numeric fields
  outside this skill — keeps the schema invariants tight.
- Touch `docs/Roadmap.md` directly. Re-render only.
