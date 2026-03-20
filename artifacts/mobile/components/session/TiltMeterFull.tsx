import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useSession } from '@/context/SessionContext';

export function TiltMeterFull() {
  const { session } = useSession();
  const score = session.tiltScore;
  const color =
    score < 30 ? Colors.statusGreen : score < 60 ? Colors.statusYellow : Colors.statusRed;
  const label = score < 30 ? 'Green — Clear to trade' : score < 60 ? 'Caution' : 'Danger — Stop';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TILT SCORE</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${color}20`, borderColor: `${color}50` }]}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[styles.statusText, { color }]}>{label}</Text>
        </View>
      </View>

      <View style={styles.gaugeRow}>
        <Text style={[styles.bigScore, { color }]}>{score}</Text>
        <Text style={styles.outOf}>/100</Text>
      </View>

      <ProgressBar progress={score / 100} color={color} height={8} borderRadius={4} />

      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Consec Losses</Text>
          <Text style={[styles.metaValue, { color: Colors.statusGreen }]}>0</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Giving Back</Text>
          <Text style={[styles.metaValue, { color: Colors.statusGreen }]}>No</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Fast Reentry</Text>
          <Text style={[styles.metaValue, { color: Colors.statusGreen }]}>No</Text>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'DMSans_500Medium',
  },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  bigScore: {
    fontSize: 48,
    fontFamily: 'DMSans_700Bold',
    lineHeight: 52,
  },
  outOf: {
    fontSize: 20,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  metaValue: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
  },
});
