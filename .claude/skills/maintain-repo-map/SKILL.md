---
name: maintain-repo-map
description: >-
  Keep docs/REPO_MAP.md — the repo's navigation doc — accurate so
  agents can orient from one file instead of exploring the tree.
  Use at the START of any coding task (read the map first, only
  explore what it doesn't answer) and at the END of any task that
  added, moved, or removed routes, top-level dirs, libs, tables, or
  features (update the map + feature index in the same commit).
---

# Maintain the repo map

`docs/REPO_MAP.md` exists so a coding agent can answer "where does X
live / where do I put Y" by reading ONE file instead of running an
exploration pass over the whole tree. Exploration of this repo from
scratch costs minutes per session; the map costs seconds.

## At task START

1. Read `docs/REPO_MAP.md` (and skim
   `BUSINESS_TEMPLATE_AGENT_CONTRACT.md` if you haven't this
   session).
2. Trust it for orientation; only explore directories the map
   doesn't cover or where it looks stale.
3. If it IS stale or missing, regenerate it first (below) — that
   work pays for itself immediately.

## At task END (structural changes only)

If the task added/moved/removed any route, top-level directory, core
lib, DB table, or user-facing feature:

1. Update the affected rows in the Layout table.
2. Add one line to the **Feature index**: `- <feature> — <entry
   points / key files>`.
3. Commit the map change WITH the feature commit (same push), not as
   an afterthought.

Skip this for pure content edits, copy tweaks, or bug fixes that
don't move anything.

## Regenerating from scratch

1. `ls` the repo root and `app/web/` one level deep; read
   `package.json` workspaces and `app/web/app/` route folders.
2. Write the Layout table: every top-level dir gets one row saying
   what BELONGS there (purpose), not just what's in it.
3. Record the conventions that prevent wrong-place work: auth
   surface, migrations dir, roadmap skill, deploy branches.
4. Rebuild the Feature index from `app/web/app/` routes +
   `docs/Roadmap.md` shipped items.
5. Keep it under ~80 lines — a map, not an inventory. Link files,
   don't inline them.

## Never

- Let the map drift silently — a wrong map is worse than no map.
- Inline file contents or volatile detail (line numbers, TODO
  states) that rots within a week.
