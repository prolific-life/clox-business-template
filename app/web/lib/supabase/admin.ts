import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client for SERVER-ONLY admin operations (creating
 * users, minting one-time login links). The service-role key bypasses RLS,
 * so never import this into client code. Used by /auth/finish to bridge a
 * Clox-brokered Google identity into a Supabase session.
 */
export const createAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
