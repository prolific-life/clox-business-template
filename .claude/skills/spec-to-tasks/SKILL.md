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
5. **Render `ops/STATE.md` too** — the build spine, a committed
   PROJECTION of `metrics/work-tracker.json` exactly the way step 4
   renders `docs/Roadmap.md` from it. STATE.md is what each fresh-context
   wave reads first and updates last (see Execution below); it survives
   across waves/sessions. Six sections:
   - **HEADER** — the build's one-line goal + the spec/planspec it
     decomposes.
   - **DECISIONS** — append-only log of choices made (why X over Y).
     STATE.md-native.
   - **DONE** — stories already complete. PURE PROJECTION of
     `work-tracker.json` (status=done) — re-rendered, never hand-edited.
   - **NEXT** — the next stories in dependency order. PURE PROJECTION of
     `work-tracker.json` (not-done, ordered) — re-rendered, never
     hand-edited.
   - **BLOCKED** — open blockers + their `CreateFeedbackTool` refs.
     STATE.md-native.
   - **INVARIANTS** — build-wide rules that must stay true (e.g.
     "`app/web` stays self-contained", auth via Supabase only).
     STATE.md-native, append-only.
   `work-tracker.json` is the single source of truth for task state —
   do NOT duplicate it. NEXT/DONE are projections (re-render via
   update-roadmap, never write by hand); only DECISIONS / BLOCKED /
   INVARIANTS are STATE.md-native. Must be DEGRADE-SAFE: a wave works
   even if STATE.md lags the tracker — when they disagree,
   `work-tracker.json` wins and you re-project.
6. Execute in **fresh-context WAVES**, not one long session. Context
   never accretes: a single session that runs every story overflows
   its window and starts dropping the spec. Instead, ONE WAVE PER FRESH
   `--session-id` SESSION:
   - **Read `ops/STATE.md` first** to orient (HEADER + DECISIONS +
     INVARIANTS + the next NEXT stories). It is the spine; you do not
     re-read the whole repo.
   - **Implement THIS wave's stories only** (a small dependency-ordered
     batch from NEXT). Offload heavy file-reads to the **code-planner**
     subagent (it returns a ≤1-page touch-set so file bodies stay out of
     your window) and verification to the **code-verifier** subagent (it
     returns pass/fail + a failing tail, not the multi-KB build log).
   - Per story: implement → verify its acceptance check (via
     code-verifier / the verify-build matrix) → commit + push (small,
     build-passing increments — every push deploys staging) → mark the
     story complete via update-roadmap (which re-projects NEXT/DONE in
     STATE.md).
   - **Update `ops/STATE.md` last** (append any DECISIONS / BLOCKED /
     INVARIANTS, re-project NEXT/DONE), commit it, then **STOP at wave
     end.** The next wave starts in a fresh session and reads STATE.md —
     so the window is lean again.
7. When all stories land, re-read the ORIGINAL acceptance criteria
   from step 1 against the built app — anything unmet becomes a new
   story, not a shrug.

## Never
- Build from a multi-part spec without writing the decomposition
  down first — held-in-head plans drop requirements.
- Mark a story complete without its acceptance check passing.
- Hand-edit STATE.md's NEXT or DONE — they project
  `work-tracker.json`; mutate the tracker via update-roadmap and
  re-render.
- Run the whole build in one session — decompose into fresh-context
  waves so the window never overflows.
