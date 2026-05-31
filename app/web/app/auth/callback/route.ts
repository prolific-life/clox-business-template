import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth callback. Google redirects here with a `?code=`
 * after the user consents. We exchange that code for a
 * session (PKCE flow) and set the HTTP-only auth cookies,
 * then forward the user on to `next` (default `/protected`).
 *
 * The forwarded-host handling keeps redirects correct
 * behind the Vercel load balancer; locally we just use the
 * request origin.
 */
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // Only allow relative redirect targets to avoid an open
  // redirect via the `next` query param.
  let next = searchParams.get('next') ?? '/protected';
  if (!next.startsWith('/')) {
    next = '/protected';
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // No code, or the exchange failed — bounce to an error
  // page the user can recover from.
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
};
