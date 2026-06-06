'use client';

import { useState } from 'react';

/**
 * "Continue with Google" via the Clox login broker — NOT a per-project
 * Supabase Google client. We hand off to Clox's shared Google OAuth app
 * (one client, one registered redirect), passing this app's /auth/finish
 * as `broker_return`. Clox runs the Google flow, then redirects back to
 * /auth/finish with a signed identity assertion, which mints a Supabase
 * session here. Result: Google login with zero per-business Google setup.
 *
 * Broker base defaults to https://www.clox.co; override with
 * NEXT_PUBLIC_CLOX_BROKER_URL.
 */
export const LoginButton = () => {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = () => {
    setLoading(true);
    const broker =
      process.env.NEXT_PUBLIC_CLOX_BROKER_URL || 'https://www.clox.co';
    const ret = encodeURIComponent(
      `${window.location.origin}/auth/finish`,
    );
    window.location.assign(
      `${broker}/auth/google?source=web&broker_return=${ret}`,
    );
  };

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      disabled={loading}
      className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-neutral-0 px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Redirecting…' : 'Continue with Google'}
    </button>
  );
};
