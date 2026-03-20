import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type Signal = {
  label: string;
  value: string;
  status: 'bull' | 'bear' | 'neutral';
};

const signals: Signal[] = [
  { label: 'CVD', value: '+2.4K', status: 'bull' },
  { label: 'MACD', value: 'bull', status: 'bull' },
  { label: 'CCI', value: '72', status: 'bull' },
  { label: 'Z-Score', value: '-0.3', status: 'neutral' },
  { label: 'RSI', value: '58', status: 'neutral' },
  { label: 'Vol', value: 'High', status: 'bull' },
];

export function SignalStrip() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>SIGNALS · LAYER 2</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {signals.map(sig => {
          const color =
            sig.status === 'bull'
              ? Colors.statusGreen
              : sig.status === 'bear'
              ? Colors.statusRed
              : Colors.textMuted;
          return (
            <View key={sig.label} style={[styles.chip, { borderColor: `${color}40` }]}>
              <Text style={styles.chipLabel}>{sig.label}</Text>
              <Text style={[styles.chipValue, { color }]}>{sig.value}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    gap: 2,
    minWidth: 64,
  },
  chipLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  chipValue: {
    fontSize: 13,
    fontFamily: 'DMSans_700Bold',
  },
});
