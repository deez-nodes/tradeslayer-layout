import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type Alert = {
  id: string;
  type: 'warning' | 'info' | 'caution';
  message: string;
};

const alerts: Alert[] = [
  { id: '1', type: 'warning', message: 'H&S forming on 15m' },
  { id: '2', type: 'info', message: 'Pearson corr SPY: 0.91' },
  { id: '3', type: 'caution', message: 'TRIN 1.4 — breadth weak' },
  { id: '4', type: 'info', message: 'VWAP reclaim confirmed' },
];

const alertConfig = {
  warning: { color: Colors.statusYellow, icon: 'alert-triangle' as const },
  info: { color: Colors.statusBlue, icon: 'info' as const },
  caution: { color: Colors.statusRed, icon: 'alert-circle' as const },
};

export function AlertFeed() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>ALERTS</Text>
      <View style={styles.list}>
        {alerts.map(alert => {
          const config = alertConfig[alert.type];
          return (
            <View key={alert.id} style={[styles.item, { borderLeftColor: config.color }]}>
              <Feather name={config.icon} size={13} color={config.color} />
              <Text style={styles.message}>{alert.message}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  list: {
    gap: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderLeftWidth: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  message: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
    flex: 1,
  },
});
