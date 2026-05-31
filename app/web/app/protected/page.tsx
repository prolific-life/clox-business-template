import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '../auth/actions';

/**
 * Example protected page. The middleware already redirects
 * unauthenticated visitors to `/login`, but we re-check the
 * session here too — defence in depth, and it gives us the
 * user's claims to render.
 *
 * Use this as the pattern for any page that requires a
 * signed-in user: call `getClaims()` server-side, redirect
 * if absent.
 */
const ProtectedPage = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect('/login');
  }

  const { email, sub } = data.claims;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            You&apos;re signed in
          </h1>
          <p className="text-sm text-neutral-500">
            This page is gated by Supabase auth. Only a
            signed-in user can see it.
          </p>
        </div>

        <dl className="rounded-md border border-neutral-200 p-4 text-left text-sm">
          <div className="flex justify-between gap-4 py-1">
            <dt className="text-neutral-500">Email</dt>
            <dd className="font-medium text-neutral-800">
              {typeof email === 'string' ? email : '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-1">
            <dt className="text-neutral-500">User ID</dt>
            <dd className="truncate font-mono text-xs text-neutral-800">
              {typeof sub === 'string' ? sub : '—'}
            </dd>
          </div>
        </dl>

        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProtectedPage;
