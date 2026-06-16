import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useSession } from '@/context/SessionContext';

const DAYS = ['M', 'T', 'W', 'T', 'F'];

type Heat = 'green' | 'yellow' | 'red' | 'empty';

const heatColors: Record<Heat, string> = {
  green: Colors.statusGreen,
  yellow: Colors.statusYellow,
  red: Colors.statusRed,
  empty: Colors.borderDefault,
};

/** Map an epoch to a Mon–Fri column index (0–4), or -1 for the weekend. */
function weekdayIndex(epoch: number): number {
  const d = new Date(epoch).getDay(); // 0 Sun … 6 Sat
  return d >= 1 && d <= 5 ? d - 1 : -1;
}

/**
 * Weekly P&L heat map, derived from the logged trades (no hardcoded values).
 * Trades are bucketed by the weekday of their timestamp and each day is colored
 * by its net P&L: green (up), red (down), yellow (scratch), empty (no trades).
 * Storage holds the current session only, so in practice this lights up today's
 * column — the structure is ready for multi-day history.
 */
export function WeeklyHeatMap() {
  const { session } = useSession();

  const heat = useMemo<Heat[]>(() => {
    const net = [0, 0, 0, 0, 0];
    const count = [0, 0, 0, 0, 0];
    for (const t of session.trades) {
      const idx = weekdayIndex(t.at ?? Date.now());
      if (idx < 0) continue;
      net[idx] += t.pnl;
      count[idx] += 1;
    }
    return net.map((n, i) =>
      count[i] === 0 ? 'empty' : n > 0 ? 'green' : n < 0 ? 'red' : 'yellow',
    );
  }, [session.trades]);

  return (
    <View style={styles.heatMap}>
      {DAYS.map((day, i) => (
        <View key={i} style={styles.heatDay}>
          <Text style={styles.heatLabel}>{day}</Text>
          <View
            style={[
              styles.heatSquare,
              { backgroundColor: `${heatColors[heat[i]]}40`, borderColor: heatColors[heat[i]] },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
