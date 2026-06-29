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

// Logo served from app/web/public/ (e.g. 'logo.png'). Set at
// approval by the v9 materializer from the business's logo; the
// shared <Logo> primitive + the favicon read it. Empty = wordmark.
export const appLogoPath = '';

// Domain candidates the v9 agent proposed during the
// onboarding flow. The user picks one + we lock it on
// approval; the others stay for later reference.
export const appDomainCandidates: string[] = [];
export const appDomain = '';
