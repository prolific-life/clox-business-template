/**
 * Sign-in: "Continue with Google" (Supabase OAuth via the system browser —
 * Expo Go compatible, no native Google SDK) + email/password. Both flows
 * land a Supabase session; App.tsx flips to Home on the auth event.
 *
 * Google requires one-time project setup (Google provider enabled in
 * Supabase Auth + this app's redirect URL allow-listed); email/password
 * works on a fresh Supabase project out of the box.
 */
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';
import { colors, typography, radius, spacing } from '../constants/branding';

WebBrowser.maybeCompleteAuthSession();

export const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  if (!supabase) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Almost there</Text>
        <Text style={styles.subtle}>
          Supabase isn't configured yet. Copy .env.example to .env, fill in
          EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY, then
          restart the dev server / republish.
        </Text>
      </View>
    );
  }
  const sb = supabase;

  const finishFromRedirect = async (url: string) => {
    const { queryParams } = Linking.parse(url);
    const code = typeof queryParams?.code === 'string' ? queryParams.code : '';
    if (!code) {
      setNotice('Google sign-in was cancelled.');
      return;
    }
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (error) setNotice(error.message);
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    setNotice('');
    try {
      const redirectTo = AuthSession.makeRedirectUri();
      const { data, error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error || !data?.url) {
        setNotice(
          error?.message ??
            'Google sign-in is not configured for this app yet.',
        );
        return;
      }
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (res.type === 'success' && res.url) await finishFromRedirect(res.url);
    } finally {
      setBusy(false);
    }
  };

  const submitEmail = async () => {
    if (!email.trim() || !password) {
      setNotice('Enter an email and password.');
      return;
    }
    setBusy(true);
    setNotice('');
    try {
      if (mode === 'signin') {
        const { error } = await sb.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) setNotice(error.message);
      } else {
        const { data, error } = await sb.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) setNotice(error.message);
        else if (!data.session) {
          // Email confirmations are ON by default in Supabase.
          setNotice('Check your email to confirm your account.');
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtle}>Sign in to continue</Text>

      <Pressable
        style={[styles.googleBtn, busy && styles.disabled]}
        onPress={signInWithGoogle}
        disabled={busy}
      >
        <Text style={styles.googleG}>G</Text>
        <Text style={styles.googleText}>Continue with Google</Text>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.text.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.text.placeholder}
        secureTextEntry
        autoComplete={mode === 'signin' ? 'password' : 'new-password'}
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={[styles.primaryBtn, busy && styles.disabled]}
        onPress={submitEmail}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color={colors.semantic.onBrand} />
        ) : (
          <Text style={styles.primaryText}>
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => {
          setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
          setNotice('');
        }}
      >
        <Text style={styles.switchText}>
          {mode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </Text>
      </Pressable>

      {!!notice && <Text style={styles.notice}>{notice}</Text>}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xxl,
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.scale['2xl'],
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs + 2,
  },
  subtle: {
    color: colors.text.secondary,
    fontSize: typography.scale.base,
    marginBottom: spacing.xxl,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm + 2,
    // Google's button is intentionally white + Google blue (their brand,
    // not ours) — onBrand white reads correctly on any brand color.
    backgroundColor: colors.semantic.onBrand,
    borderRadius: radius.md,
    paddingVertical: spacing.lg - 2,
  },
  googleG: {
    fontSize: typography.scale.lg,
    fontWeight: typography.weight.heavy,
    color: '#4285F4',
  },
  googleText: {
    fontSize: typography.scale.md,
    fontWeight: typography.weight.medium,
    color: '#1c1c1e',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.text.dim, fontSize: typography.scale.sm },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg - 2,
    color: colors.text.primary,
    fontSize: typography.scale.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryBtn: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg + 1,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  primaryText: {
    color: colors.semantic.onBrand,
    fontSize: typography.scale.md,
    fontWeight: typography.weight.medium,
  },
  switchText: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.lg + 2,
  },
  notice: {
    color: colors.semantic.warning,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.md + 2,
  },
  disabled: { opacity: 0.55 },
});
