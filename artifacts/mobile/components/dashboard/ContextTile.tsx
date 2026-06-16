import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';

type Props = {
  label: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral';
};

export function ContextTile({ label, value, subtitle, trend = 'neutral' }: Props) {
  const trendColor =
    trend === 'up' ? Colors.statusGreen : trend === 'down' ? Colors.statusRed : Colors.textSecondary;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={[styles.subtitle, { color: trendColor }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 12,
    height: 76,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  value: {
    fontSize: 17,
    fontFamily: Fonts.monoBold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
  },
});
