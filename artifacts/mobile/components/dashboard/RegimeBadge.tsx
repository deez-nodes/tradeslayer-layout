import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { useSession } from '@/context/SessionContext';

export function RegimeBadge() {
  const { session } = useSession();

  const regimeColors: Record<string, string> = {
    TRENDING: Colors.statusGreen,
    RANGING: Colors.statusBlue,
    VOLATILE: Colors.statusYellow,
    CHOPPY: Colors.statusRed,
  };

  const color = regimeColors[session.regime] ?? Colors.textMuted;

  return (
    <View style={[styles.container, { borderColor: `${color}40`, backgroundColor: `${color}12` }]}>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={[styles.regime, { color }]}>{session.regime}</Text>
        <View style={styles.spacer} />
        <Text style={styles.stat}>ADX {session.adx}</Text>
        <View style={styles.divider} />
        <Text style={styles.stat}>H {session.hurst}</Text>
      </View>
      <Text style={styles.subtitle}>Market Regime · Layer 0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  regime: {
    fontSize: 18,
    fontFamily: 'DMSans_700Bold',
    letterSpacing: 1.5,
  },
  spacer: { flex: 1 },
  stat: {
    fontSize: 13,
    fontFamily: Fonts.monoMedium,
    color: Colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.borderDefault,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
});
