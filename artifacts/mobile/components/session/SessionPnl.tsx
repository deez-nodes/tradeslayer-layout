import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useSession } from '@/context/SessionContext';

export function SessionPnl() {
  const { session } = useSession();
  const { pnl, peakPnl, trades, dailyGoal, maxLoss } = session;

  const isPositive = pnl >= 0;
  const atGoal = pnl >= dailyGoal;
  const givingBack = peakPnl > 0 && pnl < peakPnl * 0.5;
  const maxLossHit = pnl <= maxLoss;

  const accentColor = maxLossHit
    ? Colors.statusRed
    : givingBack
    ? Colors.statusYellow
    : atGoal
    ? Colors.statusBlue
    : Colors.statusGreen;

  const progress = Math.max(0, Math.min(pnl / dailyGoal, 1));

  return (
    <View style={[styles.container, { borderColor: `${accentColor}40`, backgroundColor: `${accentColor}0a` }]}>
      <View style={styles.header}>
        <Text style={styles.label}>SESSION P&L</Text>
        {atGoal && (
          <View style={[styles.badge, { backgroundColor: `${Colors.statusBlue}20`, borderColor: `${Colors.statusBlue}50` }]}>
            <Text style={[styles.badgeText, { color: Colors.statusBlue }]}>AT GOAL — consider stopping</Text>
          </View>
        )}
      </View>
      <Text style={[styles.pnl, { color: accentColor }]}>
        {isPositive ? '+' : ''}${pnl}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Peak: ${peakPnl}</Text>
        <View style={styles.divider} />
        <Text style={styles.meta}>Trades: {trades.length}/10</Text>
        <View style={styles.divider} />
        <Text style={styles.meta}>Goal: ${dailyGoal}</Text>
      </View>
      <ProgressBar progress={progress} color={accentColor} height={6} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'DMSans_500Medium',
    letterSpacing: 0.5,
  },
  pnl: {
    fontSize: 40,
    fontFamily: 'DMSans_700Bold',
    lineHeight: 44,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  meta: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: Colors.borderDefault,
  },
});
