import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useSession } from '@/context/SessionContext';

const TOTAL_SECONDS = 120;

export function ReentryCountdown() {
  const { session, startReentryCountdown, overrideReentry } = useSession();
  const { reentryCountdown } = session;

  if (reentryCountdown === null) {
    return (
      <Pressable
        style={styles.inactiveContainer}
        onPress={startReentryCountdown}
      >
        <Feather name="clock" size={14} color={Colors.textMuted} />
        <Text style={styles.inactiveText}>Reentry timer — tap to start</Text>
      </Pressable>
    );
  }

  const mins = Math.floor(reentryCountdown / 60);
  const secs = reentryCountdown % 60;
  const progress = reentryCountdown / TOTAL_SECONDS;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>REENTRY COUNTDOWN</Text>
        <Text style={[styles.time, { color: Colors.statusYellow }]}>{timeStr}</Text>
      </View>
      <ProgressBar progress={progress} color={Colors.statusYellow} height={6} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>remaining</Text>
        <Pressable
          style={styles.overrideBtn}
          onPress={overrideReentry}
          accessibilityRole="button"
          accessibilityLabel="Override reentry cooldown (logged)"
        >
          <Text style={styles.overrideText}>Override (logged)</Text>
          <Feather name="arrow-right" size={12} color={Colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Colors.statusYellow}40`,
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  time: {
    fontSize: 22,
    fontFamily: Fonts.monoBold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  overrideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overrideText: {
    fontSize: 11,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  inactiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 14,
  },
  inactiveText: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
});
