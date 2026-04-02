import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { TradeLogEntry } from '@/components/journal/TradeLogEntry';
import { useSession } from '@/context/SessionContext';

const DAYS = ['M', 'T', 'W', 'T', 'F'];
const HEAT = ['green', 'green', 'yellow', 'empty', 'empty'] as const;

const heatColors: Record<string, string> = {
  green: Colors.statusGreen,
  yellow: Colors.statusYellow,
  red: Colors.statusRed,
  empty: Colors.borderDefault,
};

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { session } = useSession();

  const winCount = session.trades.filter(t => t.pnl > 0).length;
  const totalTrades = session.trades.length;
  const winRate = totalTrades > 0 ? ((winCount / totalTrades) * 100).toFixed(0) : '0';
  const commissionTotal = session.trades.reduce((acc, t) => acc + t.lots * 4, 0);
  const overrides = session.trades.filter(t => t.override > 0).length;
  const tiltPeak = Math.max(...session.trades.map(t => t.tilt), 0);

  return (
    <View style={[styles.root, { backgroundColor: Colors.bgPrimary }]}>
      <View style={[styles.appBar, { paddingTop: isWeb ? 67 : insets.top + 8 }]}>
        <Text style={styles.appBarTitle}>JOURNAL</Text>
        <Pressable style={styles.filterBtn}>
          <Feather name="filter" size={16} color={Colors.textMuted} />
          <Text style={styles.filterText}>Filter</Text>
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
        {/* Today header */}
        <Text style={styles.dayHeader}>
          Today — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>

        {/* Trade list */}
        {session.trades.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="book" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No trades logged today</Text>
          </View>
        ) : (
          session.trades.map(trade => <TradeLogEntry key={trade.id} trade={trade} />)
        )}

        {/* Session summary */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>SESSION SUMMARY</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Trades</Text>
              <Text style={styles.summaryValue}>{totalTrades}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Win Rate</Text>
              <Text style={[styles.summaryValue, { color: Colors.statusGreen }]}>{winRate}%</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Net P&L</Text>
              <Text style={[styles.summaryValue, { color: session.pnl >= 0 ? Colors.statusGreen : Colors.statusRed }]}>
                {session.pnl >= 0 ? '+' : ''}${session.pnl}
              </Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Overrides</Text>
              <Text style={[styles.summaryValue, { color: overrides > 0 ? Colors.statusYellow : Colors.textSecondary }]}>
                {overrides}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tilt Peak</Text>
              <Text style={[styles.summaryValue, { color: tiltPeak > 60 ? Colors.statusRed : tiltPeak > 30 ? Colors.statusYellow : Colors.statusGreen }]}>
                {tiltPeak}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Commission</Text>
              <Text style={styles.summaryValue}>${commissionTotal}</Text>
            </View>
          </View>
          <View style={styles.matchRow}>
            <Feather name="check-circle" size={13} color={Colors.statusGreen} />
            <Text style={styles.matchText}>Green day profile: MATCH</Text>
          </View>
        </View>

        {/* Weekly heat map */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>WEEKLY HEAT MAP</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.heatMap}>
          {DAYS.map((day, i) => (
            <View key={i} style={styles.heatDay}>
              <Text style={styles.heatLabel}>{day}</Text>
              <View
                style={[styles.heatSquare, { backgroundColor: `${heatColors[HEAT[i]]}40`, borderColor: heatColors[HEAT[i]] }]}
              />
            </View>
          ))}
        </View>
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
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 10 },
  dayHeader: {
    fontSize: 13,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  empty: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyText: { fontSize: 14, fontFamily: 'DMSans_400Regular', color: Colors.textMuted },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.borderDefault },
  dividerLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  summaryCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 14,
    gap: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: { gap: 4, flex: 1, alignItems: 'center' },
  summaryLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.borderDefault,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
    color: Colors.statusGreen,
  },
  heatMap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 16,
  },
  heatDay: { alignItems: 'center', gap: 8 },
  heatLabel: {
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  heatSquare: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
  },
});
