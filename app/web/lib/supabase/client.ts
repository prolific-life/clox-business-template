import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for use in Client Components (runs in
 * the browser). Reads the public project URL + anon key
 * from NEXT_PUBLIC_* env vars, so it is safe to ship to
 * the browser bundle.
 *
 * Usage:
 *   const supabase = createClient();
 *   await supabase.auth.signInWithOAuth({ provider: 'google', ... });
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
