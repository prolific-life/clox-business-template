import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { appName } from '../../../../constants/app';
import { LoginButton } from './login-button';

/**
 * Login page. Out-of-the-box Supabase OAuth entry point
 * for a freshly spun-up business app.
 *
 * If the visitor already has a session we send them to the
 * example protected page instead of showing the button.
 */
const LoginPage = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect('/protected');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Sign in to {appName}
          </h1>
          <p className="text-sm text-neutral-500">
            Continue with your Google account to get started.
          </p>
        </div>
        <LoginButton />
      </div>
    </main>
  );
};

export default LoginPage;
