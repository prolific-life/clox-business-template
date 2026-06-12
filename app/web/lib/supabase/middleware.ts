import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the Supabase auth session on every request and
 * gates protected routes. Called from the root
 * `middleware.ts`.
 *
 * Why this exists: Server Components cannot write cookies,
 * so a refreshed access token has nowhere to land. The
 * middleware runs before the page, refreshes the token via
 * `getClaims()`, and writes the new cookies onto the
 * response.
 *
 * `PUBLIC_PATHS` are reachable while logged out. Everything
 * else redirects unauthenticated users to `/login`. Add a
 * route here (or to the matcher in `middleware.ts`) to make
 * it public.
 */
// /assets (generated decks + creatives) is public so the platform's
// preview panes can embed it without a session. Don't publish
// secrets into /assets; an admin gate is a planned platform change.
// /brand (the living brand-guidelines page) is public by design — it's
// the shareable design-review link and contains only design tokens.
const PUBLIC_PATHS = ['/', '/login', '/auth', '/assets', '/brand'];

const isPublicPath = (pathname: string) =>
  PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

export const updateSession = async (request: NextRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // The instant deploy lands BEFORE the async Supabase provision +
  // env redeploy, so these can be unset for the first minute of a
  // freshly-materialized site. Serve the site (public pages) instead
  // of hard-failing every request with MIDDLEWARE_INVOCATION_FAILED;
  // auth refresh + route gating engage automatically once the env is
  // present (after the provisioner's redeploy).
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  // Fluid compute / serverless: create a fresh client per
  // request — never a module-level singleton.
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          // Cache-control headers (@supabase/ssr >= 0.10)
          // emitted on token refresh; forward them so CDNs
          // don't cache an authenticated response.
          if (headers) {
            Object.entries(headers).forEach(([key, value]) =>
              supabaseResponse.headers.set(key, value),
            );
          }
        },
      },
    },
  );

  // Do NOT run code between createServerClient and
  // getClaims(): a stray await here can randomly log users
  // out. getClaims() validates the JWT signature against
  // the project's published keys, so it is safe to trust
  // for authorization decisions.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: return `supabaseResponse` untouched. If you
  // build a new response, copy the cookies over first:
  //   const res = NextResponse.next({ request });
  //   res.cookies.setAll(supabaseResponse.cookies.getAll());
  // Otherwise the browser and server sessions drift apart
  // and the user gets logged out early.
  return supabaseResponse;
};
