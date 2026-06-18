/**
 * Brand color tokens — NATIVE app.
 *
 * The `brand` group MIRRORS app/web/constants/branding/colors.ts so the
 * SAME brand color drives both apps. The two can't share one file —
 * app/native is an isolated Expo/Metro project (see pnpm-workspace.yaml:
 * Metro breaks on pnpm symlinks) — so a visual-identity change updates
 * BOTH token files in the same pass (operator runbook "The brand").
 *
 * The chrome (background / surface / border / text ramp) is the native
 * app's own dark palette; only `brand` and `semantic` are kept in
 * lockstep with web.
 */
export const colors = {
  brand: {
    primary: '#0066ff',
    secondary: '#ff6b35',
    accent: '#10b981',
  },
  background: '#0b0b0c',
  surface: '#161618',
  surfaceAlt: '#1a1a1d',
  border: '#26262a',
  text: {
    primary: '#ffffff',
    secondary: '#9a9aa0',
    dim: '#6e6e74',
    placeholder: '#8a8a8e',
  },
  semantic: {
    warning: '#ffb454',
    onBrand: '#ffffff',
  },
} as const;
