import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Screen } from '@/components/shared/Screen';
import { SessionPnl } from '@/components/session/SessionPnl';
import { TiltMeterFull } from '@/components/session/TiltMeterFull';
import { ReentryCountdown } from '@/components/session/ReentryCountdown';
import { CommissionCalc } from '@/components/session/CommissionCalc';
import { GuardrailStatus } from '@/components/session/GuardrailStatus';
import { SessionSummary } from '@/components/session/SessionSummary';
import { useSession } from '@/context/SessionContext';

export default function SessionScreen() {
  const { resetSession } = useSession();

  return (
    <Screen
      header={
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>SESSION CONTROL</Text>
          <Pressable
            style={styles.resetBtn}
            onPress={resetSession}
            accessibilityRole="button"
            accessibilityLabel="Reset session"
          >
            <Text style={styles.resetText}>Reset</Text>
            <Feather name="refresh-ccw" size={14} color={Colors.textMuted} />
          </Pressable>
        </View>
      }
    >
      <SessionPnl />
      <TiltMeterFull />
      <ReentryCountdown />
      <CommissionCalc />
      <GuardrailStatus />
      <SessionSummary />
    </Screen>
  );
}

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBarTitle: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resetText: {
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
});
