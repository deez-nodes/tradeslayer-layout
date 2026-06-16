import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useSession } from '@/context/SessionContext';

export function SessionBar() {
  const { session } = useSession();
  const progress = Math.max(0, Math.min(session.pnl / session.dailyGoal, 1));
  const isPositive = session.pnl >= 0;
  const color =
    session.pnl >= session.dailyGoal
      ? Colors.statusBlue
      : session.pnl < 0
      ? Colors.statusRed
      : Colors.statusGreen;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.label}>SESSION</Text>
        <View style={styles.rightRow}>
          <Text style={[styles.pnl, { color }]}>
            {isPositive ? '+' : ''}${session.pnl}
          </Text>
          <Text style={styles.trades}>{session.trades.length} trades</Text>
        </View>
      </View>
      <ProgressBar progress={progress} color={color} height={5} />
      <Text style={styles.goal}>Goal: ${session.dailyGoal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 12,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  pnl: {
    fontSize: 18,
    fontFamily: Fonts.monoBold,
  },
  trades: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
  },
  goal: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
    textAlign: 'right',
  },
});
