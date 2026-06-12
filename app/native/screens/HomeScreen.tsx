/**
 * Placeholder home — the signed-in landing the business's real mobile
 * experience replaces. Kept deliberately minimal: a welcome, the
 * signed-in identity, and an obvious "build here" surface.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0c',
    padding: 28,
    justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 30, fontWeight: '700', marginBottom: 6 },
  subtle: { color: '#9a9aa0', fontSize: 15, marginBottom: 26 },
  card: {
    backgroundColor: '#161618',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#26262a',
    padding: 20,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardBody: { color: '#9a9aa0', fontSize: 14.5, lineHeight: 21 },
  signOut: { alignItems: 'center', marginTop: 26 },
  signOutText: { color: '#6e6e74', fontSize: 14 },
});
