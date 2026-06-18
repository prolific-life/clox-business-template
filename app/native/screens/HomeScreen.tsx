/**
 * Placeholder home — the signed-in landing the business's real mobile
 * experience replaces. Kept deliberately minimal: a welcome, the
 * signed-in identity, and an obvious "build here" surface.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { colors, typography, radius, spacing } from '../constants/branding';

export const HomeScreen = ({ session }: { session: Session }) => {
  const email = session.user.email ?? 'there';
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You're in 🎉</Text>
      <Text style={styles.subtle}>Signed in as {email}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your app starts here</Text>
        <Text style={styles.cardBody}>
          This is the placeholder home screen. Describe the mobile features
          you want in your business chat and the operator will build them
          right here.
        </Text>
      </View>

      <Pressable
        style={styles.signOut}
        onPress={() => void supabase?.auth.signOut()}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
};

// All visual values come from constants/branding — a brand/visual-
// identity change to those tokens cascades here (and to web's mirror).
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xxl,
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.scale.xl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs + 2,
  },
  subtle: {
    color: colors.text.secondary,
    fontSize: typography.scale.base,
    marginBottom: spacing.xl + 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg + 4,
  },
  cardTitle: {
    color: colors.text.primary,
    fontSize: typography.scale.lg,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.sm,
  },
  cardBody: {
    color: colors.text.secondary,
    fontSize: 14.5,
    lineHeight: 21,
  },
  signOut: { alignItems: 'center', marginTop: spacing.xl + 4 },
  signOutText: { color: colors.text.dim, fontSize: 14 },
});
