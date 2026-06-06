import type { Config } from 'tailwindcss';
// Relative (not @/) — Tailwind's config loader doesn't read the
// tsconfig path alias.
import { colors } from './constants/branding/colors';
import { typography } from './constants/branding/typography';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        neutral: colors.neutral,
        semantic: colors.semantic,
      },
      fontFamily: {
        sans: typography.fontFamily.sans.split(/,\s*/),
        serif: typography.fontFamily.serif.split(/,\s*/),
        mono: typography.fontFamily.mono.split(/,\s*/),
      },
      fontSize: typography.scale,
    },
  },
  plugins: [],
};

export default config;
