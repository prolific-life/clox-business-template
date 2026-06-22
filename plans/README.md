# plans/ — the durable plan record

One Markdown file per project, `plans/<slug>.md`, committed to the repo.
This directory is the DURABLE, greppable record of every product decision
this business has made. The live planning surface is each project's **Clox
planspec doc** (a Firestore doc the user edits in the app); `plans/` is its
committed twin. They stay in lockstep — the build writes/refreshes the plan
file and reconciles the Clox doc (`UpdateDocTool`) whenever the spec moves,
so neither goes stale.

Why it exists: a single Clox doc is one project's window and is easy to lose
across many projects. `plans/` is the committed memory of ALL decisions, so
every build can READ what was already decided and never contradict or
re-litigate it — new work reuses and extends prior plans instead of
reinventing them.

## The convention

- **One file per project**: `plans/<slug>.md`. `<slug>` = readable
  kebab-case of the project name + the short project id for uniqueness,
  e.g. `update-web-app-styling-878a5bcb.md`.
- **Header** at the top of every file: project name, project id, status
  (`building` | `verifying` | `built`), and last-updated date.
- **Body**: the plan/spec content — the Clox planspec doc converted to
  clean Markdown.
- **Key decisions**: a short list of the choices made (and why), so a
  future build can honor them at a glance.

## When it's written and read

- **At build START** (the `spec-to-tasks` / WAVE 0 pass): the build FIRST
  reads every existing `plans/*.md` so new work stays consistent with prior
  decisions, THEN writes/refreshes this project's `plans/<slug>.md` and
  commits it as the **first commit** of the build.
- **As the spec evolves**: keep `plans/<slug>.md` updated AND reconcile the
  Clox planspec doc via `UpdateDocTool` (the builder has the docId from the
  build / follow-up wake) so the in-app view matches the committed plan.
- **Superseding a prior decision**: never silently contradict a committed
  plan. If a new project must overturn an earlier one, say so explicitly in
  the new plan's Key decisions ("supersedes <slug>: …").

## Example skeleton

```markdown
# Update web app styling

- **Project id:** 878a5bcb
- **Status:** building
- **Last updated:** 2026-06-22

## Plan

<the Clox planspec doc, converted to clean Markdown — goals, scope,
acceptance criteria, screens/routes touched, anything pasted into the doc>

## Key decisions

- Adopt the warm-editorial direction from `brand/visual-identity/`; no new
  palette.
- Keep the existing Fraunces + Hanken Grotesk type pairing.
- Supersedes nothing.
```
