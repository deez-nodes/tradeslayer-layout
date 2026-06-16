import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { useSession } from '@/context/SessionContext';
import { INSTRUMENT_SYMBOLS, instrumentInfo } from '@/constants/instruments';

const GOOD_COST_PCT = 6; // commission drag this share of an avg win or less = healthy

export function CommissionCalc() {
  const { session, updateLots, updateInstrument } = useSession();
  const instrument = session.instrument;
  const numLots = Math.max(1, session.lots);

  const [lotsText, setLotsText] = useState(String(numLots));
  useEffect(() => {
    setLotsText(String(Math.max(1, session.lots)));
  }, [session.lots]);

  const info = instrumentInfo(instrument);
  const rtCostTotal = info.rtCostPerLot * numLots;

  // Cost/Win is lot-independent (both commission and win scale with lots):
  // rtCostPerLot / avgWinPerLot. For MES: 4 / 83 = 4.8% (matches spec).
  const costPct = (info.rtCostPerLot / info.avgWin) * 100;

  // Break-even win rate with commission drag, solving
  //   WR·(avgWin − rt) = (1 − WR)·(avgLoss + rt)  ⇒  WR = (avgLoss + rt)/(avgWin + avgLoss).
  // With the ~1:1 baseline (avgLoss ≈ avgWin) this yields ≈52% for MES.
  const breakevenWR = ((info.avgLoss + info.rtCostPerLot) / (info.avgWin + info.avgLoss)) * 100;

  const isGood = costPct <= GOOD_COST_PCT;

  const onLotsChange = (t: string) => {
    setLotsText(t);
    const n = parseInt(t, 10);
    if (!Number.isNaN(n) && n > 0) updateLots(n);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COMMISSION CHECK</Text>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Lots</Text>
          <TextInput
            style={styles.input}
            value={lotsText}
            onChangeText={onLotsChange}
            onBlur={() => setLotsText(String(numLots))}
            keyboardType="numeric"
            maxLength={2}
            selectTextOnFocus
            accessibilityLabel="Lots"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Instrument</Text>
          <View style={styles.instrumentRow}>
            {INSTRUMENT_SYMBOLS.map((ins) => (
              <Pressable
                key={ins}
                style={[styles.instrChip, instrument === ins && styles.instrChipActive]}
                onPress={() => updateInstrument(ins)}
                accessibilityRole="button"
                accessibilityState={{ selected: instrument === ins }}
              >
                <Text style={[styles.instrText, instrument === ins && styles.instrTextActive]}>
                  {ins}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.resultRow}>
        <View style={styles.result}>
          <Text style={styles.resultLabel}>RT Cost</Text>
          <Text style={styles.resultValue}>${rtCostTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.result}>
          <Text style={styles.resultLabel}>Cost/Win</Text>
          <Text style={[styles.resultValue, { color: isGood ? Colors.statusGreen : Colors.statusRed }]}>
            {costPct.toFixed(1)}% {isGood ? '✓' : '✗'}
          </Text>
        </View>
        <View style={styles.result}>
          <Text style={styles.resultLabel}>BE Win Rate</Text>
          <Text style={styles.resultValue}>{breakevenWR.toFixed(0)}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 16,
    gap: 14,
  },
  title: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  inputRow: {
    gap: 10,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: Fonts.monoBold,
    color: Colors.textPrimary,
    width: 80,
  },
  instrumentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  instrChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.bgElevated,
  },
  instrChipActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: `${Colors.accentPrimary}20`,
  },
  instrText: {
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  instrTextActive: {
    color: Colors.accentPrimary,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  result: {
    gap: 4,
    flex: 1,
  },
  resultLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  resultValue: {
    fontSize: 15,
    fontFamily: Fonts.monoBold,
    color: Colors.textPrimary,
  },
});
