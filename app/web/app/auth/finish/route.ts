import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { jwtVerify } from 'jose';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Completes a Clox-brokered Google login.
 *
 * Clox runs the Google OAuth (one shared client, one registered redirect),
 * verifies the identity, and redirects here with a short-lived signed
 * assertion (`?token=`). We verify it with the shared broker secret, then
 * mint a Supabase session for that user via the service-role admin API —
 * so this app gets Google login with NO per-business Google setup.
 *
 * Flow: verify assertion -> admin create-or-update user (with the Google
 * profile) -> admin generateLink (one-time magic-link token) -> verifyOtp
 * server-side to set the session cookies -> land in /app.
 */
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const fail = () =>
    NextResponse.redirect(`${origin}/auth/auth-code-error`);

  const token = searchParams.get('token');
  if (!token) return fail();

  // 1. Verify the Clox broker assertion (audience-bound to this route).
  let email = '';
  let fullName: string | undefined;
  let picture: string | undefined;
  try {
    const secret = new TextEncoder().encode(
      process.env.CLOX_BROKER_SIGNING_SECRET,
    );
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'clox-broker',
      audience: `${origin}/auth/finish`,
    });
    email = typeof payload.email === 'string' ? payload.email : '';
    fullName = typeof payload.name === 'string' ? payload.name : undefined;
    picture =
      typeof payload.picture === 'string' ? payload.picture : undefined;
  } catch {
    return fail();
  }
  if (!email) return fail();

  // 2. Ensure the user exists (carry the Google profile into metadata so
  //    the handle_new_user trigger fills public.users), then mint a
  //    one-time magic-link token. createUser errors when the user already
  //    exists — that's fine, generateLink works either way.
  const admin = createAdminClient();
  await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: fullName, avatar_url: picture },
  });
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });
  const tokenHash = data?.properties?.hashed_token;
  if (error || !tokenHash) return fail();

  // 3. Verify the OTP server-side, writing the session cookies onto the
  //    redirect response, then land in the app.
  const response = NextResponse.redirect(`${origin}/app`);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          ),
      },
    },
  );
  const { error: otpError } = await supabase.auth.verifyOtp({
    type: 'magiclink',
    token_hash: tokenHash,
  });
  if (otpError) return fail();
  return response;
};
