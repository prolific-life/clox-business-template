/**
 * Button variant + state specs. v9-design fills in
 * concrete values during the design pass; the app/web
 * components consume these to render consistent UI.
 */

export const buttons = {
  variants: {
    primary: {
      bg: 'brand.primary',
      fg: 'neutral.0',
      hoverBg: 'brand.primary',
      hoverOpacity: 0.9,
    },
    secondary: {
      bg: 'neutral.100',
      fg: 'neutral.900',
      hoverBg: 'neutral.200',
    },
    ghost: {
      bg: 'transparent',
      fg: 'neutral.900',
      hoverBg: 'neutral.100',
    },
  },
  sizes: {
    sm: { paddingY: 1, paddingX: 3, fontSize: 'sm' },
    md: { paddingY: 2, paddingX: 4, fontSize: 'base' },
    lg: { paddingY: 3, paddingX: 6, fontSize: 'lg' },
  },
} as const;
