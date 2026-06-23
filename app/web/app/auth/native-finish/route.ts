import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { jwtVerify } from 'jose';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Completes a Clox-brokered Google login for the NATIVE (Expo) app.
 *
 * Same broker contract as /auth/finish, but the caller is the mobile app, so
 * there are no cookies: we mint the Supabase session server-side (service
 * role) and hand the access + refresh tokens back to the app via its deep
 * link (`app_return`), where it calls `supabase.auth.setSession(...)`. Like
 * web, there is NO per-business Google setup — the Clox broker runs Google
 * with its shared OAuth app and signs a short-lived assertion.
 *
 * Native flow:
 *   app opens  ${broker}/auth/google?source=native&broker_return=
 *                 ${APP}/auth/native-finish?app_return=<deeplink>
 *   Clox brokers Google, signs an assertion (aud = that broker_return), and
 *   307s here with &token=. We verify, mint a session, then 302 to
 *   <deeplink>?access_token=...&refresh_token=... — which Expo's
 *   openAuthSessionAsync catches and the app turns into a session.
 */
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const appReturn = searchParams.get('app_return') ?? '';
  const token = searchParams.get('token');

  const failURL = appReturn
    ? `${appReturn}${appReturn.includes('?') ? '&' : '?'}error=auth_failed`
    : `${origin}/auth/auth-code-error`;
  const fail = () => NextResponse.redirect(failURL);

  if (!token || !appReturn) return fail();

  // 1. Verify the Clox broker assertion. The signed audience is the exact
  //    broker_return the app passed (this route + its app_return query); we
  //    check the route PREFIX so deep-link encoding can't break the match,
  //    while still binding the assertion to THIS app's native-finish.
  let email = '';
  let fullName: string | undefined;
  let picture: string | undefined;
  try {
    const secret = new TextEncoder().encode(
      process.env.CLOX_BROKER_SIGNING_SECRET,
    );
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'clox-broker',
    });
    const aud = typeof payload.aud === 'string' ? payload.aud : '';
    if (!aud.startsWith(`${origin}/auth/native-finish`)) return fail();
    email = typeof payload.email === 'string' ? payload.email : '';
    fullName = typeof payload.name === 'string' ? payload.name : undefined;
    picture =
      typeof payload.picture === 'string' ? payload.picture : undefined;
  } catch {
    return fail();
  }
  if (!email) return fail();

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error(
      '[auth/native-finish] Supabase env not configured on this deployment',
    );
    return fail();
  }

  // 2. Ensure the user exists (carry the Google profile into metadata), then
  //    mint a one-time magic-link token. createUser errors when the user
  //    already exists — fine; generateLink works either way.
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

  // 3. verifyOtp server-side to MINT the session, then read the tokens out of
  //    the response (no-op cookie handler — the native app needs raw tokens,
  //    not cookies).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );
  const { data: otp, error: otpError } = await supabase.auth.verifyOtp({
    type: 'magiclink',
    token_hash: tokenHash,
  });
  if (otpError || !otp.session) return fail();

  // 4. Hand the session to the app via its deep link.
  const sep = appReturn.includes('?') ? '&' : '?';
  const target =
    `${appReturn}${sep}` +
    `access_token=${encodeURIComponent(otp.session.access_token)}` +
    `&refresh_token=${encodeURIComponent(otp.session.refresh_token)}`;
  return NextResponse.redirect(target);
};
