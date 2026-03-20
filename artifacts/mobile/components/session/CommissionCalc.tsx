import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { useSession } from '@/context/SessionContext';

const INSTRUMENTS = ['MES', 'ES', 'NQ', 'MNQ', 'RTY', 'YM'];
const RT_COST_PER_LOT: Record<string, number> = {
  MES: 4, ES: 4, NQ: 4, MNQ: 4, RTY: 4, YM: 4,
};
const AVG_WIN: Record<string, number> = {
  MES: 83, ES: 415, NQ: 800, MNQ: 80, RTY: 500, YM: 430,
};

export function CommissionCalc() {
  const { session } = useSession();
  const [lots, setLots] = useState(String(session.lots));
  const [instrument, setInstrument] = useState(session.instrument);

  const numLots = parseInt(lots) || 1;
  const rtCost = (RT_COST_PER_LOT[instrument] ?? 4) * numLots;
  const avgWin = AVG_WIN[instrument] ?? 83;
  const costPct = ((rtCost / avgWin) * 100).toFixed(1);
  const breakevenWR = (rtCost / (rtCost + avgWin) * 100).toFixed(0);
  const isGood = parseFloat(costPct) < 8;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COMMISSION CHECK</Text>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Lots</Text>
          <TextInput
            style={styles.input}
            value={lots}
            onChangeText={setLots}
            keyboardType="numeric"
            maxLength={2}
            selectTextOnFocus
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Instrument</Text>
          <View style={styles.instrumentRow}>
            {INSTRUMENTS.map(ins => (
              <Pressable
                key={ins}
                style={[styles.instrChip, instrument === ins && styles.instrChipActive]}
                onPress={() => setInstrument(ins)}
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
          <Text style={styles.resultValue}>${rtCost.toFixed(2)}</Text>
        </View>
        <View style={styles.result}>
          <Text style={styles.resultLabel}>Cost/Win</Text>
          <Text style={[styles.resultValue, { color: isGood ? Colors.statusGreen : Colors.statusRed }]}>
            {costPct}% {isGood ? '✓' : '✗'}
          </Text>
        </View>
        <View style={styles.result}>
          <Text style={styles.resultLabel}>BE Win Rate</Text>
          <Text style={styles.resultValue}>{breakevenWR}%</Text>
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
    fontFamily: 'DMSans_700Bold',
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
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
});
