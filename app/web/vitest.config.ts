import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vitest config for the template app. jsdom so React components render; the
// `@` alias mirrors tsconfig (`@/*` → app/web root). The quality gate runs
// `pnpm test` (= `vitest run`), so a green build means these pass.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
