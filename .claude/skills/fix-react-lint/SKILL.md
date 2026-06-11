---
name: fix-react-lint
description: >-
  Lint and fix the React/Next.js app: run ESLint + TypeScript across
  app/web, auto-fix what's mechanical, hand-fix the rest (hooks rules,
  dead code, unsafe types), and verify the build. Use when the user
  asks to clean up / lint / fix warnings, when a build fails on lint
  or type errors, or as the final pass before releasing changes.
---

# Fix React lint + type errors

## Steps
1. From `app/web`: `pnpm lint 2>&1 | tail -80` and
   `npx tsc --noEmit 2>&1 | head -80` to get the real lists. (If no
   lint script exists, `npx next lint`.)
2. Mechanical pass: `pnpm lint --fix` (or `npx next lint --fix`) —
   then re-run to see what survived.
3. Hand-fix the survivors, worst first:
   - **react-hooks/rules-of-hooks + exhaustive-deps**: fix the dep
     array or restructure — never silence with a disable comment
     unless the dep is provably stable (and say why inline).
   - **Unused vars/imports/dead code**: delete, don't underscore.
   - **`any` / unsafe casts**: type properly from usage; narrow with
     guards instead of assertions.
   - **next/image, a11y, key warnings**: fix per the rule's intent.
4. Re-run both commands until clean (or only pre-existing,
   out-of-scope findings remain — list those in the commit body).
5. `pnpm build` must pass before you finish.
6. Commit (`chore: fix lint + type errors`) — small commits if the
   fixes span many areas.

## Never
- Blanket-disable rules (file-wide eslint-disable, `skipLibCheck`
  flips, tsconfig loosening) to get to green.
- Reformat unrelated code — fixes only, minimal diffs.
