'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Google OAuth sign-in button. Kicks off the PKCE flow:
 * Supabase redirects to Google, Google redirects back to
 * `/auth/callback`, and that route handler exchanges the
 * code for a session (see `app/auth/callback/route.ts`).
 *
 * `redirectTo` is derived from `window.location.origin` so
 * the same code works on localhost and on the deployed
 * Vercel domain with no env change. Add the resulting
 * `<origin>/auth/callback` URL to the Supabase dashboard's
 * allowed redirect URLs.
 *
 * Swap `provider` (or render more buttons) to support other
 * OAuth providers enabled in the Supabase dashboard.
 */
export const LoginButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
    // On success the browser is redirected to Google, so no
    // need to reset `loading`.
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-neutral-0 px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Redirecting…' : 'Continue with Google'}
      </button>
      {error ? (
        <p className="text-sm text-semantic-danger">{error}</p>
      ) : null}
    </div>
  );
};
