import Link from 'next/link';

/**
 * Shown when the OAuth code exchange fails (expired code,
 * mismatched redirect URL, provider not enabled in the
 * Supabase dashboard, etc.). Gives the user a way back to
 * `/login` to retry.
 */
const AuthCodeErrorPage = () => (
  <main className="min-h-screen flex items-center justify-center px-6">
    <div className="max-w-sm text-center space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">
        Sign-in failed
      </h1>
      <p className="text-sm text-neutral-500">
        We couldn&apos;t complete the sign-in. The link may
        have expired, or the OAuth provider isn&apos;t fully
        configured yet.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
      >
        Back to sign in
      </Link>
    </div>
  </main>
);

export default AuthCodeErrorPage;
