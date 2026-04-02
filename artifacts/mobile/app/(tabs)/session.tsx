import React from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SessionPnl } from '@/components/session/SessionPnl';
import { TiltMeterFull } from '@/components/session/TiltMeterFull';
import { ReentryCountdown } from '@/components/session/ReentryCountdown';
import { CommissionCalc } from '@/components/session/CommissionCalc';
import { GuardrailStatus } from '@/components/session/GuardrailStatus';
import { useSession } from '@/context/SessionContext';

export default function SessionScreen() {
  const insets = useSafeAreaInsets();
  const { resetSession } = useSession();
  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.root, { backgroundColor: Colors.bgPrimary }]}>
      {/* App bar */}
      <View style={[styles.appBar, { paddingTop: isWeb ? 67 : insets.top + 8 }]}>
        <Text style={styles.appBarTitle}>SESSION CONTROL</Text>
        <Pressable style={styles.resetBtn} onPress={resetSession}>
          <Text style={styles.resetText}>Reset</Text>
          <Feather name="refresh-ccw" size={14} color={Colors.textMuted} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SessionPnl />
        <TiltMeterFull />
        <ReentryCountdown />
        <CommissionCalc />
        <GuardrailStatus />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
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
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
});
