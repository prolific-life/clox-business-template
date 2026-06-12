import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client for SERVER-ONLY admin operations (creating
 * users, minting one-time login links). The service-role key bypasses RLS,
 * so never import this into client code. Used by /auth/finish to bridge a
 * Clox-brokered Google identity into a Supabase session.
 */
export const createAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Fail with a legible error (caught by /auth/finish → auth-code-error)
  // instead of @supabase/supabase-js's opaque "supabaseUrl is required"
  // throw when the deployment is missing its Supabase env.
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase admin client unavailable: NEXT_PUBLIC_SUPABASE_URL / ' +
        'SUPABASE_SERVICE_ROLE_KEY are not set on this deployment',
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};
