import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// Flat ESLint config. ADVISORY ONLY — the quality gate never blocks on lint
// (it gates on `next build` + `tsc --noEmit` + `vitest`). This replaces the
// removed `next lint`, which hangs headless on its interactive setup prompt.
export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      '**/*.config.*',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
