/**
 * Brand color tokens. v9-design fills these in at
 * approval time. Tailwind preset in app/web/tailwind.config.ts
 * reads from this export.
 */

export const colors = {
  brand: {
    primary: '#0066ff',
    secondary: '#ff6b35',
    accent: '#10b981',
  },
  neutral: {
    0: '#ffffff',
    100: '#f5f5f5',
    200: '#e5e5e5',
    400: '#a3a3a3',
    600: '#525252',
    800: '#262626',
    900: '#111111',
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
} as const;
