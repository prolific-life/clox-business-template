export const inputs = {
  variants: {
    default: {
      bg: 'neutral.0',
      border: 'neutral.200',
      fg: 'neutral.900',
      focusBorder: 'brand.primary',
    },
    filled: {
      bg: 'neutral.100',
      border: 'transparent',
      fg: 'neutral.900',
      focusBorder: 'brand.primary',
    },
  },
  sizes: {
    sm: { paddingY: 1, paddingX: 2, fontSize: 'sm' },
    md: { paddingY: 2, paddingX: 3, fontSize: 'base' },
    lg: { paddingY: 3, paddingX: 4, fontSize: 'lg' },
  },
} as const;
