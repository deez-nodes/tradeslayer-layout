import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { Shadow } from '@/constants/shadows';
import { useSession } from '@/context/SessionContext';

/**
 * Global hard-stop. The spec's most important guardrail: when session P&L
 * breaches the daily max loss, a blocking "SESSION OVER" overlay appears.
 * Acknowledging it ends the session (status → 'stopped'), which clears the
 * 'max_loss' condition and dismisses the overlay.
 */
export function HardStopOverlay() {
  const { session, endSession } = useSession();
  const router = useRouter();

  const visible = session.sessionStatus === 'max_loss';
  const tiltPeak = Math.max(session.tiltScore, ...session.trades.map((t) => t.tilt), 0);

  const close = () => endSession();
  const viewJournal = () => {
    endSession();
    router.replace('/journal');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Feather name="alert-octagon" size={34} color={Colors.statusRed} />
          </View>
          <Text style={styles.title}>SESSION OVER</Text>
          <Text style={styles.subtitle}>Daily max loss reached</Text>

          <View style={styles.stats}>
            <Stat label="Net P&L" value={`${session.pnl >= 0 ? '+' : ''}$${session.pnl}`} color={Colors.statusRed} />
            <View style={styles.statDivider} />
            <Stat label="Trades" value={`${session.trades.length}`} />
            <View style={styles.statDivider} />
            <Stat label="Tilt peak" value={`${tiltPeak}`} color={tiltPeak > 60 ? Colors.statusRed : Colors.textPrimary} />
          </View>

          <Text style={styles.note}>Review your journal entry before tomorrow.</Text>

          <Pressable style={styles.primaryBtn} onPress={viewJournal} accessibilityRole="button">
            <Feather name="book" size={15} color={Colors.bgPrimary} />
            <Text style={styles.primaryText}>VIEW JOURNAL</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={close} accessibilityRole="button">
            <Text style={styles.secondaryText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2,4,10,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.bgElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.statusRed}55`,
    padding: 28,
    alignItems: 'center',
    gap: 10,
    ...Shadow.elevated,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.statusRed}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'DMSans_700Bold',
    color: Colors.statusRed,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
    width: '100%',
    justifyContent: 'space-between',
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.borderDefault },
  statLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  statValue: {
    fontSize: 18,
    fontFamily: Fonts.monoBold,
    color: Colors.textPrimary,
  },
  note: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accentPrimary,
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    marginTop: 8,
  },
  primaryText: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
    color: Colors.bgPrimary,
    letterSpacing: 1,
  },
  secondaryBtn: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
});
