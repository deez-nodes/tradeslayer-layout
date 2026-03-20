import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useSession } from '@/context/SessionContext';

type GuardrailItem = {
  label: string;
  limit: string;
  value: string;
  status: 'ok' | 'warn' | 'danger';
};

export function GuardrailStatus() {
  const { session } = useSession();

  const items: GuardrailItem[] = [
    {
      label: 'Daily goal',
      limit: `$${session.dailyGoal}`,
      value: `$${session.pnl}`,
      status: session.pnl >= session.dailyGoal ? 'ok' : 'ok',
    },
    {
      label: 'Max loss',
      limit: `$${session.maxLoss}`,
      value: `$${session.pnl}`,
      status: session.pnl <= session.maxLoss ? 'danger' : 'ok',
    },
    {
      label: 'Max trades',
      limit: `${session.maxTrades}`,
      value: `${session.trades.length}/${session.maxTrades}`,
      status: session.trades.length >= session.maxTrades ? 'danger' : 'ok',
    },
    {
      label: 'Max lots',
      limit: `${session.maxLots}`,
      value: `${session.lots}`,
      status: session.lots > session.maxLots ? 'warn' : 'ok',
    },
    {
      label: 'Walk-away',
      limit: '50% of peak',
      value: session.peakPnl > 0 ? `${((session.pnl / session.peakPnl) * 100).toFixed(0)}%` : '—',
      status:
        session.peakPnl > 0 && session.pnl < session.peakPnl * 0.5 ? 'warn' : 'ok',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GUARDRAILS</Text>
      <View style={styles.list}>
        {items.map(item => {
          const color =
            item.status === 'ok'
              ? Colors.statusGreen
              : item.status === 'warn'
              ? Colors.statusYellow
              : Colors.statusRed;
          const icon =
            item.status === 'ok' ? 'check-circle' : item.status === 'warn' ? 'alert-triangle' : 'x-circle';
          return (
            <View key={item.label} style={styles.row}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowLimit}>{item.limit}</Text>
              <View style={styles.spacer} />
              <Text style={[styles.rowValue, { color }]}>{item.value}</Text>
              <Feather name={icon as any} size={14} color={color} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowLabel: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
    width: 100,
  },
  rowLimit: {
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textPrimary,
    width: 60,
  },
  spacer: { flex: 1 },
  rowValue: {
    fontSize: 13,
    fontFamily: 'DMSans_700Bold',
    marginRight: 4,
  },
});
