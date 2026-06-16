import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { Screen } from '@/components/shared/Screen';
import { TradeLogEntry } from '@/components/journal/TradeLogEntry';
import { useSession, type Trade } from '@/context/SessionContext';
import { WeeklyHeatMap } from '@/components/journal/WeeklyHeatMap';

type FilterKey = 'all' | 'wins' | 'losses' | 'open' | 'overrides';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'wins', label: 'Wins' },
  { key: 'losses', label: 'Losses' },
  { key: 'open', label: 'Open' },
  { key: 'overrides', label: 'Overrides' },
];

function matchesFilter(t: Trade, f: FilterKey): boolean {
  switch (f) {
    case 'wins':
      return t.pnl > 0;
    case 'losses':
      return t.pnl < 0;
    case 'open':
      return t.pnl === 0;
    case 'overrides':
      return t.override > 0;
    default:
      return true;
  }
}

export default function JournalScreen() {
  const { session } = useSession();

  const winCount = session.trades.filter(t => t.pnl > 0).length;
  const totalTrades = session.trades.length;
  // Win rate over *decided* trades only — open/scratch entries (pnl === 0,
  // e.g. order fills awaiting an exit) don't count for or against it.
  const decidedTrades = session.trades.filter(t => t.pnl !== 0).length;
  const winRate = decidedTrades > 0 ? ((winCount / decidedTrades) * 100).toFixed(0) : '0';
  const commissionTotal = session.trades.reduce((acc, t) => acc + t.lots * 4, 0);
  const overrides = session.trades.filter(t => t.override > 0).length + session.reentryOverrides;
  const tiltPeak = Math.max(...session.trades.map(t => t.tilt), 0);

  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<FilterKey>('all');
  const visibleTrades = useMemo(
    () => session.trades.filter(t => matchesFilter(t, filter)),
    [session.trades, filter],
  );
  const activeFilterLabel = FILTERS.find(f => f.key === filter)?.label ?? 'Filter';

  return (
    <Screen
      header={
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>JOURNAL</Text>
          <Pressable
            style={[styles.filterBtn, filter !== 'all' && styles.filterBtnActive]}
            onPress={() => setShowFilter(v => !v)}
            accessibilityRole="button"
            accessibilityLabel="Filter trades"
            accessibilityState={{ expanded: showFilter }}
          >
            <Feather name="filter" size={16} color={filter !== 'all' ? Colors.accentPrimary : Colors.textMuted} />
            <Text style={[styles.filterText, filter !== 'all' && styles.filterTextActive]}>
              {filter === 'all' ? 'Filter' : activeFilterLabel}
            </Text>
          </Pressable>
        </View>
      }
    >
      {/* Today header */}
      <Text style={styles.dayHeader}>
        Today — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </Text>

      {/* Filter chips */}
      {showFilter && (
        <View style={styles.filterRow}>
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <Pressable
                key={f.key}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setFilter(f.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Trade list */}
      {session.trades.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="book" size={32} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No trades logged today</Text>
        </View>
      ) : visibleTrades.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="filter" size={28} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No trades match this filter</Text>
        </View>
      ) : (
        visibleTrades.map(trade => <TradeLogEntry key={trade.id} trade={trade} />)
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

      <WeeklyHeatMap />
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
    fontFamily: Fonts.monoBold,
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
  filterBtnActive: {},
  filterTextActive: { color: Colors.accentPrimary },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.bgCard,
  },
  filterChipActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: `${Colors.accentPrimary}20`,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  filterChipTextActive: { color: Colors.accentPrimary },
});
