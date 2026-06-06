/**
 * Identity for the business this codebase represents.
 *
 * v9 fills these values at workspace materialization
 * time from the approved business plan. The Next.js app
 * + automations all read from here so a single edit
 * (e.g. user renames the company) rolls through to
 * every surface.
 */

export const appName = 'Untitled Business';
export const appTagline = 'A new venture, freshly bootstrapped.';
export const appDescription =
  'Replace this description with the elevator pitch ' +
  'from your approved business plan.';

// Logo path is relative to app/web/public/. Empty until
// the design-system pass uploads an asset.
export const appLogoPath = '';

// Domain candidates the v9 agent proposed during the
// onboarding flow. The user picks one + we lock it on
// approval; the others stay for later reference.
export const appDomainCandidates: string[] = [];
export const appDomain = '';
