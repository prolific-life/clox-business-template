---
name: review-changes
description: "Run AFTER verify-build is green and BEFORE reporting verifying — a senior-engineer review pass over the wave's diff. Get the diff, dispatch the code-reviewer subagent, then FIX every high+medium issue and re-run verify-build (loop, cap 3x). A high that can't be fixed → file a CreateFeedbackTool blocker and STOP — never ship a known ship-blocker. Low issues: fix the cheap ones, note the rest. Only once review is clean do you merge to main + report. Use whenever you finish a build wave / are about to report status verifying/built."
metadata: {"openclaw":{"emoji":"🔎"}}
---

# review-changes — a senior engineer reads your diff before it ships

verify-build proves the code COMPILES and the tests pass. It does NOT
catch a logic bug in an untested branch, a leaked service-role key, a
missing auth check, or a UI that violates the Design Law. This pass
does. Run it AFTER verify-build is green and BEFORE you merge to `main`
/ report `verifying` — a clean build can still be a bad change.

## 1. Get the diff

The diff is the wave's changes vs `main`. From the worktree (or
`./repo`):

```bash
git -C ./repo fetch origin
git -C ./repo diff origin/main...HEAD
```

In a project worktree, diff against the wave's base instead
(`git diff origin/main...HEAD` from the worktree). If the diff is empty,
there is nothing to review — skip to merge/report.

## 2. Dispatch the code-reviewer subagent on it

Hand the diff to the **code-reviewer** subagent. It reviews like a
senior engineer — correctness, security (secrets, missing auth,
unsanitized input, the Supabase service-role key leaking to the
client), performance, accessibility, design-law — and returns ONLY
compact JSON, keeping the review essay out of your window:

```
{"issues":[{"severity":"high|medium|low","file":"path","line":<n|null>,"problem":"...","fix":"..."}]}
```

`high` = ship-blocker. Clean diff → `{"issues":[]}`.

## 3. Fix high + medium, then loop

For EVERY `high` and `medium` issue: apply the suggested fix (or a
better one), then re-run the **verify-build** skill so the fix didn't
break the build/tests. Re-dispatch code-reviewer on the new diff. Loop
until no high/medium remain — **cap at 3 cycles**.

- If a `high` STILL can't be fixed after 3 cycles, STOP. Do NOT merge,
  do NOT report `verifying`. File a blocker with `CreateFeedbackTool`
  (the unfixable problem + what you tried) and leave the project
  `building`. **Never ship a known ship-blocker.**
- `low` issues: fix the cheap ones inline; note the rest in your relayed
  status (or as a follow-up story) rather than blocking on them.

## 4. Only then — merge + report

Once the review is clean (no high/medium left), proceed exactly as
verify-build's "Reporting done" says: merge your project branch into
`main`, push `main`, and report `status:"verifying"` with the merged
`main` HEAD `commitSha`. verify-build owns the reporting contract — this
skill is the gate in front of it, not a replacement for it.

## Degrade-safe

- If you can't compute a diff vs `main` (shallow clone, detached base),
  fall back to `git diff HEAD~<n>` for this wave's commits, or review
  the working tree against the last pushed `main`.
- The subagent flags + suggests; YOU edit and decide. It never rewrites
  code, so an empty/garbled JSON response means re-dispatch once, then
  do a quick manual pass — never skip the review and ship blind.
