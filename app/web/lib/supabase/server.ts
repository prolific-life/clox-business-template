import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase client for Server Components, Server Actions,
 * and Route Handlers (runs only on the server). Reads the
 * session from the request cookies and writes refreshed
 * tokens back through the cookie store.
 *
 * Important (Fluid compute / serverless): never hoist this
 * client into a module-level variable. Always create a new
 * one inside each request so sessions don't leak across
 * users.
 */
export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` was called from a Server Component.
            // Safe to ignore: the middleware refreshes the
            // session on every request, so the cookie write
            // happens there instead.
          }
        },
      },
    },
  );
};
