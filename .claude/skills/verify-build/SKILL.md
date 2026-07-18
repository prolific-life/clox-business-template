---
name: verify-build
description: "Run BEFORE reporting a build done/verifying/built. Verifies the app actually compiles, type-checks, and passes tests from app/web — `pnpm build` (compile + TypeScript) then `pnpm test` (smoke/feature tests), with `pnpm lint` advisory. Self-fix failures up to 3x then file a blocker. This is the fast LOCAL feedback loop; the SERVER then re-checks the live Vercel deploy for your reported commit and only marks the project built when that deploy is READY. Use whenever you finish a build wave or are about to report status verifying/built."
metadata: {"openclaw":{"emoji":"✅"}}
---

# verify-build — prove the build is green before you report done

The server WILL re-check your work: marking a project `built` only sticks if
the Vercel deploy for your reported commit reaches READY (it re-runs
`next build`). A red build is REFUSED and a blocker is filed. So verify
locally FIRST — it's faster than waiting on the deploy and it stops you from
looping on a broken push.

## Run from `app/web` (the deployable Next.js app)

Export these first (headless-safe — never let a tool block on stdin):

```bash
export CI=1 COREPACK_ENABLE_DOWNLOAD_PROMPT=0
cd app/web || exit 1
```

Then, in order:

1. **`pnpm build`** — the compile + type gate. `next build` runs the
   TypeScript compiler and FAILS on any type error (the template is
   `strict: true`, no `ignoreBuildErrors`). It does NOT require ESLint (it
   only prints "No ESLint configuration detected" and continues). This single
   command catches the large majority of breakage.
2. **`pnpm test`** — runs the vitest suite (the smoke test + any feature
   tests). Add a test when you add real logic; a green suite is what makes the
   gate cover behavior, not just compilation.
3. **`pnpm lint`** — ADVISORY ONLY. Skim it, fix what's cheap, but NEVER block
   shipping on lint. Never run `next lint` (removed in Next 16; it hangs on an
   interactive setup prompt).

## Design-discipline gates - these FAIL the check

Two greps over the DIFF (not the whole tree, so legacy code never traps you)
that hard-fail the verify. Run them from the repo root; they compare the branch
against `main`. Paste the block as is (it is shellcheck-clean):

```bash
cd "$(git rev-parse --show-toplevel)" || exit 1
BASE="$(git merge-base HEAD origin/main 2>/dev/null || git rev-parse HEAD~1 2>/dev/null || echo HEAD)"
gate_fail=0

# Gate A - raw hex color in feature .tsx code (design tokens only). Scans only
# ADDED lines; excludes token/theme files (constants/branding, globals.css,
# tailwind.config are not .tsx) and the two self-contained palette renderers.
hex_hits="$(git diff "$BASE" -- \
  ':(glob)app/web/**/*.tsx' \
  ':(exclude,glob)app/web/**/*.test.tsx' \
  ':(exclude,glob)app/web/__tests__/**' \
  ':(exclude,glob)app/web/app/assets/pitch/**' \
  ':(exclude)app/web/app/brand/page.tsx' \
  | grep '^+' | grep -v '^+++' \
  | grep -iE '#[0-9a-fA-F]{3,8}\b' || true)"
if [ -n "$hex_hits" ]; then
  echo "FAIL hex-gate: raw hex color(s) added to feature code:"
  echo "$hex_hits"
  echo "Use a theme token (constants/branding / Tailwind theme var), never a literal hex."
  gate_fail=1
fi

# Gate B - a shared component changed with no INVENTORY.md update in the diff.
changed_ui="$(git diff --name-only "$BASE" -- \
  ':(glob)app/web/components/**/*.tsx' \
  ':(exclude,glob)app/web/components/**/*.test.tsx' || true)"
inv_changed="$(git diff --name-only "$BASE" -- components/INVENTORY.md || true)"
if [ -n "$changed_ui" ] && [ -z "$inv_changed" ]; then
  echo "FAIL inventory-gate: shared component changed with no components/INVENTORY.md update:"
  echo "$changed_ui"
  echo "Update the component's INVENTORY.md row (+ component-registry.tsx) in the SAME commit."
  gate_fail=1
fi

[ "$gate_fail" -eq 0 ] && echo "design gates: PASS"
```

If either gate prints FAIL, fix it (swap the hex for a token; add the
INVENTORY.md row) and re-run - do NOT report the build done with a gate red.
These are the machine enforcement of the reuse + tokens rules in
`components/INVENTORY.md`.

## On failure — self-fix, don't loop

If `pnpm build` or `pnpm test` exits non-zero: read the error tail, fix the
cause, re-run. Cap at **3 fix cycles**. If it still fails after 3, STOP — do
NOT mark the build done. File a blocker with `CreateFeedbackTool` (include the
failing command + the error tail) and leave the project `building`.

## Reporting done

When `pnpm build` + `pnpm test` are green: commit, merge your project branch
to `main`, push `main`, then report with your merged main commit sha:

```
clox-ws-client tool SaveSessionIdTool '{"projectId":"<id>","sessionId":"<id>","status":"verifying","commitSha":"<merged main HEAD sha>"}' --user-id <owner>
```

Use `status:"verifying"` (NOT `built`) and pass `commitSha` (the merged
`main` HEAD — `git rev-parse HEAD` after the merge). The server watches the
Vercel deploy for that commit and flips the project to `built` ITSELF once
it's READY — you do NOT report again. (If you instead report
`status:"built"` directly, the server gates it the same way: it returns
`verifying` while the deploy builds, or `blocked` if it ERRORed.)

## Degrade-safe

- If `pnpm` is unavailable (older pod without corepack), fall back to
  `npm run build` / `npm test`.
- If there is no `test` script yet, run `pnpm build` alone — never skip the
  build check.
