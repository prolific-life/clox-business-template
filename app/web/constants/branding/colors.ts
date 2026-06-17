/**
 * Brand color tokens — the palette the /brand book renders and the source
 * the design pass rebrands. The app's *runtime* theme (light + dark) is the
 * set of CSS variables in app/globals.css; keep these hexes in lockstep
 * with those variables when rebranding (same commit).
 *
 * Default direction: warm-paper neutrals + a deep teal primary — an
 * intentional, editorial-leaning floor, NOT the stock blue/violet "AI SaaS"
 * look. Override the hue per business; never revert to a generic default.
 */

export const colors = {
  brand: {
    primary: '#177568', // deep teal
    secondary: '#2a2620', // warm ink (supporting)
    accent: '#e08b2d', // warm amber — used sparingly
  },
  neutral: {
    0: '#ffffff',
    50: '#faf9f6', // warm paper
    100: '#f3f1ea',
    200: '#e7e3d8',
    300: '#d6d0c1',
    400: '#aaa493',
    500: '#7e776a',
    600: '#585348',
    700: '#423d34',
    800: '#2a2620',
    900: '#1a1712', // warm near-black
    950: '#100e0a',
  },
  semantic: {
    success: '#15803d',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#0e7490',
  },
} as const;
