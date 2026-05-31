'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Server action: sign the current user out and send them
 * back to the login page. Wire it to a <form action={...}>
 * so it runs on the server and clears the auth cookies.
 */
export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
};
