---
name: spec-to-tasks
description: >-
  Decompose a feature spec / planspec / PRD (usually the project doc
  handed down in the build prompt) into ordered, actionable epics +
  stories in the roadmap, then execute them in order. Use at the START
  of any project build whose spec has more than one moving part, or
  when the user asks to break work down into tasks.
---

# Spec → tasks

## Inputs
- The spec text (the planspec doc content is in your prompt on build
  wakes; otherwise ask for / read the referenced doc).

## Steps
1. Read the spec twice: first for intent (what must be TRUE when
   done — collect the acceptance criteria verbatim), then for
   surface (every screen, route, table, integration it implies).
2. Decompose into ONE epic per coherent surface, each with 2–6
   stories. A story is one commit-sized, independently verifiable
   change ("create daily_retros migration + types", "retro editor
   panel", "week slider"), with its acceptance check attached.
3. Order stories by dependency: schema → server actions → UI →
   polish. Flag anything the spec leaves ambiguous as an OPEN
   QUESTION on the story rather than guessing silently.
4. Record it via the update-roadmap skill (epics + stories into
   `metrics/work-tracker.json`, re-rendered `docs/Roadmap.md`) so the
   plan survives the session and the user can see it.
5. Execute in order: implement story → verify its acceptance check →
   commit + push (small, build-passing increments — every push
   deploys staging) → mark the story complete via update-roadmap →
   next story.
6. When all stories land, re-read the ORIGINAL acceptance criteria
   from step 1 against the built app — anything unmet becomes a new
   story, not a shrug.

## Never
- Build from a multi-part spec without writing the decomposition
  down first — held-in-head plans drop requirements.
- Mark a story complete without its acceptance check passing.
