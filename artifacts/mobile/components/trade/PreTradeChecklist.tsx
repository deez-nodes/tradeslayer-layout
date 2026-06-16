import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { useOrder } from '@/context/OrderContext';
import { useSession } from '@/context/SessionContext';

type Status = 'pass' | 'warn' | 'fail';

type Check = { key: string; status: Status; label: string; detail: string };

const statusMeta: Record<Status, { color: string; icon: keyof typeof Feather.glyphMap }> = {
  pass: { color: Colors.statusGreen, icon: 'check-circle' },
  warn: { color: Colors.statusYellow, icon: 'alert-triangle' },
  fail: { color: Colors.statusRed, icon: 'x-circle' },
};

/**
 * Pre-trade discipline gate (spec's Pre-Trade Checklist). Surfaces a live
 * pass/caution/block read across tilt, reentry lock, trade count, loss room,
 * and the order's R:R — using the same R:R math as OrderSummary so the two
 * never disagree. Informational (doesn't block submit); the trader decides.
 */
export function PreTradeChecklist() {
  const { orderType, limitPrice, stopLoss, takeProfit, currentPrice } = useOrder();
  const { session } = useSession();

  const checks = useMemo<Check[]>(() => {
    // R:R — identical formula to OrderSummary.
    const fillPrice = orderType === 'market' ? currentPrice : limitPrice;
    const slPoints = Math.abs(fillPrice - stopLoss);
    const tpPoints = Math.abs(takeProfit - fillPrice);
    const rr = slPoints > 0 ? tpPoints / slPoints : 0;

    const tiltStatus: Status = session.tiltScore < 30 ? 'pass' : session.tiltScore < 60 ? 'warn' : 'fail';
    const rrStatus: Status = rr >= 2 ? 'pass' : rr >= 1 ? 'warn' : 'fail';

    return [
      {
        key: 'tilt',
        status: tiltStatus,
        label: 'Tilt under control',
        detail: `${session.tiltScore}/100`,
      },
      {
        key: 'reentry',
        status: session.reentryCountdown == null ? 'pass' : 'fail',
        label: 'No reentry cooldown',
        detail: session.reentryCountdown == null ? 'Clear' : `${session.reentryCountdown}s left`,
      },
      {
        key: 'trades',
        status: session.trades.length < session.maxTrades ? 'pass' : 'fail',
        label: 'Trades remaining',
        detail: `${session.trades.length}/${session.maxTrades}`,
      },
      {
        key: 'loss',
        status: session.pnl > session.maxLoss ? 'pass' : 'fail',
        label: 'Above max loss',
        detail: session.pnl > session.maxLoss ? 'Within limit' : 'Limit hit',
      },
      {
        key: 'rr',
        status: rrStatus,
        label: 'R:R ≥ 2:1',
        detail: rr > 0 ? `1 : ${rr.toFixed(1)}` : '—',
      },
    ];
  }, [orderType, limitPrice, stopLoss, takeProfit, currentPrice, session]);

  const overall: Status = checks.some(c => c.status === 'fail')
    ? 'fail'
    : checks.some(c => c.status === 'warn')
    ? 'warn'
    : 'pass';
  const overallLabel =
    overall === 'fail' ? 'NOT CLEAR' : overall === 'warn' ? 'CAUTION' : 'CLEAR TO TRADE';
  const overallColor = statusMeta[overall].color;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>PRE-TRADE CHECKLIST</Text>
        <View style={[styles.verdict, { backgroundColor: `${overallColor}1f`, borderColor: `${overallColor}55` }]}>
          <Text style={[styles.verdictText, { color: overallColor }]}>{overallLabel}</Text>
        </View>
      </View>

      {checks.map(c => {
        const meta = statusMeta[c.status];
        return (
          <View key={c.key} style={styles.row}>
            <Feather name={meta.icon} size={15} color={meta.color} />
            <Text style={styles.rowLabel}>{c.label}</Text>
            <Text style={[styles.rowDetail, { color: meta.color }]}>{c.detail}</Text>
          </View>
        );
      })}
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
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  verdict: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  verdictText: {
    fontSize: 10,
    fontFamily: 'DMSans_700Bold',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
  },
  rowDetail: {
    fontSize: 13,
    fontFamily: Fonts.monoBold,
  },
});
