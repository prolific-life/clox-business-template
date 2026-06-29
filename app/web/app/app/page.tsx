import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Logo } from '@/components/ui';
import { signOut } from '../auth/actions';

/**
 * The signed-in landing page (`/app`). The middleware already
 * redirects unauthenticated visitors to `/login`, but we re-check
 * server-side here too — defence in depth — and load the profile to
 * render a "{name} is logged in" message + a log out button.
 *
 * Profile source: we prefer the `public.users` row (populated on
 * signup by the `handle_new_user` trigger — see
 * supabase/migrations/0001_users.sql), and fall back to the OAuth
 * identity metadata (Google supplies full_name / email / avatar_url)
 * when the row/table isn't present yet. So this page renders
 * correctly whether or not the migration has been applied.
 */
const AppPage = async () => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) {
    redirect('/login');
  }

  const meta = user.user_metadata ?? {};
  let name = meta.full_name || meta.name || user.email || 'there';
  let email = user.email ?? '';
  let picture = meta.avatar_url || meta.picture || '';

  // .maybeSingle() returns { data: null } (not a throw) when the row
  // or table is absent, so this degrades gracefully pre-migration.
  const { data: profile } = await supabase
    .from('users')
    .select('name, email, picture')
    .eq('id', user.id)
    .maybeSingle();
  if (profile) {
    name = profile.name || name;
    email = profile.email || email;
    picture = profile.picture || picture;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <Logo imgClassName="h-10" />
        </div>
        {picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={picture}
            alt={name}
            referrerPolicy="no-referrer"
            className="mx-auto h-16 w-16 rounded-full"
          />
        ) : null}

        <h1 className="text-2xl font-bold tracking-tight">
          {name} is logged in
        </h1>
        {email ? (
          <p className="text-sm text-neutral-500">{email}</p>
        ) : null}

        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
};

export default AppPage;
