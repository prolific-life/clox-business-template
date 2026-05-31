import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Refresh the Supabase session + gate protected routes on
// every matched request. See `lib/supabase/middleware.ts`.
//
// Note: Next.js 15.5+ also supports renaming this file to
// `proxy.ts` (the new preferred name). `middleware.ts` is
// still fully supported; keep it here for Edge-runtime
// compatibility.
export const middleware = async (request: NextRequest) =>
  updateSession(request);

export const config = {
  matcher: [
    /*
     * Run on all request paths except:
     * - _next/static (build assets)
     * - _next/image (image optimizer)
     * - favicon.ico
     * - static image files (svg/png/jpg/jpeg/gif/webp)
     * Auth API routes are also skipped so the OAuth code
     * exchange in /auth/callback isn't redirected.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
