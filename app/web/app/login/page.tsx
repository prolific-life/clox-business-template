import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { appName } from '@/constants/app';
import { Logo } from '@/components/ui';
import { LoginButton } from './login-button';
import { EmailForm } from './email-form';

/**
 * Login page. Out-of-the-box Supabase OAuth entry point
 * for a freshly spun-up business app.
 *
 * If the visitor already has a session we send them straight to
 * the app instead of showing the button.
 */
const LoginPage = async () => {
  // Before the async Supabase provision + env redeploy lands, the
  // session pre-check would throw. Render the sign-in UI anyway (the
  // Google button just links to the Clox broker); the already-signed-in
  // redirect engages once Supabase env is present.
  const supabaseReady =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseReady) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (data?.claims) {
      redirect('/app');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center">
          <Logo showWordmark={false} imgClassName="h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Sign in to {appName}
          </h1>
          <p className="text-sm text-neutral-500">
            Continue with Google, or use your email.
          </p>
        </div>
        <LoginButton />
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs text-neutral-400">or</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>
        <EmailForm />
      </div>
    </main>
  );
};

export default LoginPage;
