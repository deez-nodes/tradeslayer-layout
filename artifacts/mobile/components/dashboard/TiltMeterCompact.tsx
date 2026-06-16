import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useSession } from '@/context/SessionContext';

export function TiltMeterCompact() {
  const { session } = useSession();
  const score = session.tiltScore;
  const progress = score / 100;
  const color =
    score < 30 ? Colors.statusGreen : score < 60 ? Colors.statusYellow : Colors.statusRed;
  const status = score < 30 ? 'CLEAR' : score < 60 ? 'CAUTION' : 'DANGER';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>TILT</Text>
        <Text style={[styles.score, { color }]}>{score}/100</Text>
        <View style={styles.spacer} />
        <Text style={[styles.status, { color }]}>{status}</Text>
      </View>
      <ProgressBar progress={progress} color={color} height={4} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  score: {
    fontSize: 14,
    fontFamily: Fonts.monoBold,
  },
  spacer: { flex: 1 },
  status: {
    fontSize: 11,
    fontFamily: 'DMSans_500Medium',
    letterSpacing: 0.8,
  },
});
