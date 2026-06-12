/**
 * Supabase client for the mobile app. Reads the SAME project the web app
 * uses — the operator writes `.env` (see .env.example) with the public
 * URL + anon key (both are public by design; the anon key already ships
 * in the web bundle). Until `.env` exists the client is null and the UI
 * shows a setup note instead of crashing.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          // Mobile deep links are handled explicitly in SignInScreen —
          // never parse window.location (there isn't one).
          detectSessionInUrl: false,
          flowType: 'pkce',
        },
      })
    : null;
