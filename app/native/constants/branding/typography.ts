/**
 * Typography tokens — NATIVE app. Numeric (RN takes unitless sizes);
 * weights are the RN string union. Mirrors the intent of
 * app/web/constants/branding/typography.ts (a visual-identity change
 * updates both).
 */
export const typography = {
  scale: {
    sm: 13,
    base: 15,
    md: 16,
    lg: 17,
    xl: 30,
    '2xl': 32,
  },
  weight: {
    regular: '400',
    medium: '600',
    bold: '700',
    heavy: '800',
  },
} as const;
