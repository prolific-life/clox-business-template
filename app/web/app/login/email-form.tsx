'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Mode = 'signin' | 'signup';

/**
 * Email + password form (Supabase email auth, enabled by default). On
 * sign-up we pass `full_name` into the user metadata so the
 * handle_new_user trigger fills public.users.name. With email
 * auto-confirm on, sign-up returns an active session immediately, so we
 * forward straight to /app — same as the Google flow.
 */
export const EmailForm = () => {
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const result =
      mode === 'signup'
        ? await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
          })
        : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }
    window.location.assign('/app');
  };

  const input =
    'w-full rounded-md border border-neutral-200 px-3 py-2 text-sm ' +
    'outline-none focus:border-neutral-400';

  return (
    <form onSubmit={onSubmit} className="space-y-3 text-left">
      {mode === 'signup' ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          autoComplete="name"
          className={input}
        />
      ) : null}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
        required
        className={input}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        required
        minLength={6}
        className={input}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-0 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? 'Working…'
          : mode === 'signup'
            ? 'Create account'
            : 'Sign in'}
      </button>
      <button
        type="button"
        onClick={() => {
          setMode(mode === 'signup' ? 'signin' : 'signup');
          setError(null);
        }}
        className="w-full text-center text-xs text-neutral-500 hover:text-neutral-800"
      >
        {mode === 'signup'
          ? 'Have an account? Sign in'
          : 'New here? Create an account'}
      </button>
      {error ? (
        <p className="text-sm text-semantic-danger">{error}</p>
      ) : null}
    </form>
  );
};
