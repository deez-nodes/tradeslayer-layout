import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { useSession } from '@/context/SessionContext';

type Severity = 'danger' | 'warn' | 'info';

type Alert = {
  key: string;
  severity: Severity;
  icon: keyof typeof Feather.glyphMap;
  title: string;
  detail: string;
};

const sevColor: Record<Severity, string> = {
  danger: Colors.statusRed,
  warn: Colors.statusYellow,
  info: Colors.statusBlue,
};

/** Derive actionable discipline alerts from live session state. These are real
 *  (computed from the user's own session), not the dashboard's demo market feed. */
function buildAlerts(s: ReturnType<typeof useSession>['session']): Alert[] {
  const alerts: Alert[] = [];

  if (s.pnl <= s.maxLoss) {
    alerts.push({
      key: 'max-loss',
      severity: 'danger',
      icon: 'alert-octagon',
      title: 'Max loss hit',
      detail: `Session P&L $${s.pnl} is at/below your -$${Math.abs(s.maxLoss)} limit. Stop trading.`,
    });
  }

  if (s.tiltScore >= 60) {
    alerts.push({
      key: 'tilt',
      severity: 'danger',
      icon: 'activity',
      title: 'Tilt critical',
      detail: `Tilt ${s.tiltScore}/100 — step away before the next entry.`,
    });
  } else if (s.tiltScore >= 30) {
    alerts.push({
      key: 'tilt',
      severity: 'warn',
      icon: 'activity',
      title: 'Tilt elevated',
      detail: `Tilt ${s.tiltScore}/100 — slow down and re-check your plan.`,
    });
  }

  if (s.tiltDrivers.consecLosses >= 2) {
    alerts.push({
      key: 'consec',
      severity: 'warn',
      icon: 'trending-down',
      title: `${s.tiltDrivers.consecLosses} consecutive losses`,
      detail: 'Consider a break — losing streaks compound tilt.',
    });
  }

  if (s.tiltDrivers.givingBack && s.pnl > s.maxLoss) {
    alerts.push({
      key: 'giving-back',
      severity: 'warn',
      icon: 'corner-down-right',
      title: 'Giving back profits',
      detail: `Down from a peak of $${s.peakPnl} to $${s.pnl}.`,
    });
  }

  if (s.pnl >= s.dailyGoal && !s.tiltDrivers.givingBack) {
    alerts.push({
      key: 'at-goal',
      severity: 'info',
      icon: 'target',
      title: 'Daily goal reached',
      detail: `+$${s.pnl} vs your $${s.dailyGoal} goal. Consider banking the day.`,
    });
  }

  if (s.trades.length >= s.maxTrades) {
    alerts.push({
      key: 'max-trades',
      severity: 'warn',
      icon: 'hash',
      title: 'Max trades reached',
      detail: `${s.trades.length}/${s.maxTrades} trades taken — no fresh entries.`,
    });
  }

  if (s.reentryCountdown != null) {
    alerts.push({
      key: 'reentry',
      severity: 'warn',
      icon: 'clock',
      title: 'Reentry cooldown active',
      detail: `${s.reentryCountdown}s remaining before re-entry is allowed.`,
    });
  }

  return alerts;
}

export default function NotificationsScreen() {
  const { session } = useSession();
  const insets = useSafeAreaInsets();
  const alerts = useMemo(() => buildAlerts(session), [session]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>NOTIFICATIONS</Text>
        <Pressable
          style={styles.closeBtn}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          accessibilityRole="button"
          accessibilityLabel="Close notifications"
        >
          <Feather name="x" size={20} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {alerts.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="check-circle" size={32} color={Colors.statusGreen} />
            <Text style={styles.emptyTitle}>All clear</Text>
            <Text style={styles.emptyText}>No discipline alerts right now. Trade your plan.</Text>
          </View>
        ) : (
          alerts.map((a) => (
            <View key={a.key} style={[styles.alert, { borderLeftColor: sevColor[a.severity] }]}>
              <Feather name={a.icon} size={18} color={sevColor[a.severity]} style={styles.alertIcon} />
              <View style={styles.alertBody}>
                <Text style={[styles.alertTitle, { color: sevColor[a.severity] }]}>{a.title}</Text>
                <Text style={styles.alertDetail}>{a.detail}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  title: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  closeBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  content: {
    padding: 16,
    gap: 10,
    paddingBottom: 48,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  alert: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderLeftWidth: 3,
    padding: 14,
    gap: 12,
  },
  alertIcon: { marginTop: 1 },
  alertBody: { flex: 1, gap: 3 },
  alertTitle: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
  },
  alertDetail: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
