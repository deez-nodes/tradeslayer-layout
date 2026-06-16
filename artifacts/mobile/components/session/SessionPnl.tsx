import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useSession } from '@/context/SessionContext';

const STATUS_META: Record<string, { color: string; badge: string | null }> = {
  active: { color: Colors.statusGreen, badge: null },
  at_goal: { color: Colors.statusBlue, badge: 'AT GOAL — consider stopping' },
  giving_back: { color: Colors.statusYellow, badge: 'GIVING BACK — protect the day' },
  max_loss: { color: Colors.statusRed, badge: 'MAX LOSS — session over' },
  stopped: { color: Colors.textMuted, badge: 'SESSION ENDED' },
};

export function SessionPnl() {
  const { session } = useSession();
  const { pnl, peakPnl, trades, dailyGoal, maxTrades, sessionStatus } = session;

  const isPositive = pnl >= 0;
  const { color: accentColor, badge } = STATUS_META[sessionStatus] ?? STATUS_META.active;
  const progress = Math.max(0, Math.min(pnl / dailyGoal, 1));

  return (
    <View style={[styles.container, { borderColor: `${accentColor}40`, backgroundColor: `${accentColor}0a` }]}>
      <View style={styles.header}>
        <Text style={styles.label}>SESSION P&L</Text>
        {badge && (
          <View style={[styles.badge, { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}50` }]}>
            <Text style={[styles.badgeText, { color: accentColor }]}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.pnl, { color: accentColor }]}>
        {isPositive ? '+' : ''}${pnl}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Peak: ${peakPnl}</Text>
        <View style={styles.divider} />
        <Text style={styles.meta}>Trades: {trades.length}/{maxTrades}</Text>
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
    fontFamily: Fonts.monoBold,
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
