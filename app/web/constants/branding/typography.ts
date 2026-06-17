/**
 * Typographic system. The display + sans + mono faces are LOADED via
 * next/font in app/layout.tsx and exposed as the CSS variables referenced
 * below — so the app actually SHIPS a real type pairing and never falls
 * back to the system font.
 *
 * Default pairing (rebrand per business in the design pass, but NEVER
 * revert to a generic default — see the Design Law in CLAUDE.md):
 *   display → Fraunces        (characterful editorial serif)
 *   sans    → Hanken Grotesk  (clean, slightly humanist grotesque — UI/body)
 *   mono    → JetBrains Mono
 *
 * To rebrand: swap the faces in app/layout.tsx (next/font) AND the
 * fallbacks here, in the same commit.
 */

export const typography = {
  fontFamily: {
    display: 'var(--font-display), Fraunces, Georgia, serif',
    sans: 'var(--font-sans), "Hanken Grotesk", system-ui, sans-serif',
    // `serif` kept for /brand back-compat; points at the display face.
    serif: 'var(--font-display), Fraunces, Georgia, serif',
    mono: 'var(--font-mono), "JetBrains Mono", ui-monospace, monospace',
  },
  scale: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
