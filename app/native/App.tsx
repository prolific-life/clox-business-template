/**
 * Root: session-aware switch between SignIn and Home. The Supabase auth
 * listener is the single source of truth — both the Google and the
 * email/password flows resolve here.
 */
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { SignInScreen } from './screens/SignInScreen';
import { HomeScreen } from './screens/HomeScreen';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, next) => setSession(next),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      {session ? <HomeScreen session={session} /> : <SignInScreen />}
    </>
  );
}
