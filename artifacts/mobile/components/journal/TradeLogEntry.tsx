import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Trade } from '@/context/SessionContext';

type Props = {
  trade: Trade;
};

export function TradeLogEntry({ trade }: Props) {
  const isWin = trade.pnl > 0;
  const pnlColor = isWin ? Colors.statusGreen : Colors.statusRed;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.number}>#{trade.number}</Text>
        <Text style={styles.strategy} numberOfLines={1}>{trade.strategy}</Text>
        <View style={styles.spacer} />
        <Text style={styles.instrument}>{trade.instrument}</Text>
        <Text style={[styles.pnl, { color: pnlColor }]}>
          {isWin ? '+' : ''}${trade.pnl}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{trade.time}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.meta}>{trade.duration}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.meta}>{trade.lots} lots</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.tiltText}>Tilt: {trade.tilt}</Text>
        <Text style={styles.overrideText}>Override: {trade.override}</Text>
        <View style={styles.spacer} />
        <View style={[styles.exitBadge, { backgroundColor: isWin ? `${Colors.statusGreen}20` : `${Colors.statusRed}20` }]}>
          <Text style={[styles.exitText, { color: pnlColor }]}>{trade.exitType}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 14,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  number: {
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    minWidth: 24,
  },
  strategy: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  spacer: { flex: 1 },
  instrument: {
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textSecondary,
    marginRight: 4,
  },
  pnl: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  metaDot: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  tiltText: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  overrideText: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  exitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  exitText: {
    fontSize: 11,
    fontFamily: 'DMSans_500Medium',
  },
});
