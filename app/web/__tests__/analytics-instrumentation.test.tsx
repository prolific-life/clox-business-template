import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// ⚠️ Analytics instrumentation guard - DO NOT DELETE OR WEAKEN.
//
// The Clox "Data & Analytics" tab (/app/business/<id>/data) reads Datadog
// RUM scoped to THIS app's deployed host - which only has data because the
// app boots the RUM SDK on every page load. If that instrumentation is
// removed, analytics silently go dark. `pnpm test` runs in the build gate
// (verify-build), so these assertions FAIL the build when the
// instrumentation is gone - the operator can never ship a build that
// silently kills analytics.
//
// `pnpm test` (vitest run) executes from app/web, so process.cwd() is the
// app/web root.
const web = process.cwd();
const read = (rel: string): string => readFileSync(join(web, rel), 'utf8');

describe('Datadog RUM analytics instrumentation must stay wired', () => {
  it('lib/datadog.ts boots the RUM SDK', () => {
    expect(existsSync(join(web, 'lib/datadog.ts'))).toBe(true);
    const src = read('lib/datadog.ts');
    expect(src).toContain('export const initDatadog');
    expect(src).toContain('datadogRum.init');
  });

  it('components/DatadogInit.tsx calls initDatadog', () => {
    expect(existsSync(join(web, 'components/DatadogInit.tsx'))).toBe(true);
    expect(read('components/DatadogInit.tsx')).toContain('initDatadog()');
  });

  it('the root layout renders <DatadogInit/>', () => {
    expect(read('app/layout.tsx')).toMatch(/<DatadogInit\s*\/>/);
  });
});
