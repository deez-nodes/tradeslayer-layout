import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { useSession, type SessionStatus } from '@/context/SessionContext';
import { instrumentInfo } from '@/constants/instruments';

const statusBanner: Record<SessionStatus, { color: string; icon: keyof typeof Feather.glyphMap; text: string }> = {
  active: { color: Colors.statusBlue, icon: 'activity', text: 'Session in progress' },
  at_goal: { color: Colors.statusGreen, icon: 'check-circle', text: 'Goal reached — consider banking the day' },
  giving_back: { color: Colors.statusYellow, icon: 'corner-down-right', text: 'Giving back — protect your profits' },
  max_loss: { color: Colors.statusRed, icon: 'alert-octagon', text: 'Max loss hit — stop for the day' },
  stopped: { color: Colors.textMuted, icon: 'stop-circle', text: 'Session ended' },
};

/**
 * End-of-session rollup (spec's Session Summary). Computes win rate, net P&L,
 * overrides, tilt peak, and commission from the logged trades — the same
 * figures as the Journal's summary — plus a status banner and an End-session
 * action that locks the day (Reset, in the header, starts a fresh session).
 */
export function SessionSummary() {
  const { session, endSession } = useSession();

  const stats = useMemo(() => {
    const trades = session.trades;
    const decided = trades.filter(t => t.pnl !== 0).length;
    const wins = trades.filter(t => t.pnl > 0).length;
    const winRate = decided > 0 ? Math.round((wins / decided) * 100) : 0;
    const overrides = trades.filter(t => t.override > 0).length + session.reentryOverrides;
    const tiltPeak = Math.max(session.tiltScore, ...trades.map(t => t.tilt), 0);
    const commission = trades.reduce((acc, t) => acc + t.lots * instrumentInfo(t.instrument).rtCostPerLot, 0);
    return { count: trades.length, winRate, overrides, tiltPeak, commission };
  }, [session.trades, session.reentryOverrides, session.tiltScore]);

  const banner = statusBanner[session.sessionStatus];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>SESSION SUMMARY</Text>

      <View style={[styles.banner, { backgroundColor: `${banner.color}14`, borderColor: `${banner.color}40` }]}>
        <Feather name={banner.icon} size={15} color={banner.color} />
        <Text style={[styles.bannerText, { color: banner.color }]}>{banner.text}</Text>
      </View>

      <View style={styles.grid}>
        <Stat label="Trades" value={`${stats.count}`} />
        <Stat label="Win Rate" value={`${stats.winRate}%`} color={Colors.statusGreen} />
        <Stat
          label="Net P&L"
          value={`${session.pnl >= 0 ? '+' : ''}$${session.pnl}`}
          color={session.pnl >= 0 ? Colors.statusGreen : Colors.statusRed}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.grid}>
        <Stat
          label="Overrides"
          value={`${stats.overrides}`}
          color={stats.overrides > 0 ? Colors.statusYellow : Colors.textSecondary}
        />
        <Stat
          label="Tilt Peak"
          value={`${stats.tiltPeak}`}
          color={stats.tiltPeak > 60 ? Colors.statusRed : stats.tiltPeak > 30 ? Colors.statusYellow : Colors.statusGreen}
        />
        <Stat label="Commission" value={`$${stats.commission}`} />
      </View>

      {session.stopped ? (
        <View style={styles.endedNote}>
          <Feather name="info" size={13} color={Colors.textMuted} />
          <Text style={styles.endedNoteText}>Session ended — use Reset above to start a new one.</Text>
        </View>
      ) : (
        <Pressable
          style={styles.endBtn}
          onPress={endSession}
          accessibilityRole="button"
          accessibilityLabel="End session"
        >
          <Feather name="stop-circle" size={15} color={Colors.textSecondary} />
          <Text style={styles.endBtnText}>End Session</Text>
        </Pressable>
      )}
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bannerText: {
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: { gap: 4, flex: 1, alignItems: 'center' },
  statLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  statValue: {
    fontSize: 18,
    fontFamily: Fonts.monoBold,
    color: Colors.textPrimary,
  },
  divider: { height: 1, backgroundColor: Colors.borderDefault },
  endBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.bgPrimary,
  },
  endBtnText: {
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textSecondary,
  },
  endedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  endedNoteText: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
});
