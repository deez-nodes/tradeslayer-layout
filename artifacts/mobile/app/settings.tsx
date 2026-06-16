import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { useSession } from '@/context/SessionContext';
import { INSTRUMENT_SYMBOLS } from '@/constants/instruments';

/** A labelled −/＋ stepper row. Steppers (vs. text inputs) keep editing robust
 *  across web + native without on-screen-keyboard handling. */
function StepperRow({
  label,
  value,
  display,
  onChange,
  step,
  min,
  max,
}: {
  label: string;
  value: number;
  display: string;
  onChange: (next: number) => void;
  step: number;
  min: number;
  max: number;
}) {
  const clamp = (n: number) => Math.min(Math.max(n, min), max);
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable
          style={[styles.stepBtn, value <= min && styles.stepBtnDisabled]}
          disabled={value <= min}
          onPress={() => onChange(clamp(value - step))}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
        >
          <Feather name="minus" size={16} color={value <= min ? Colors.textMuted : Colors.textPrimary} />
        </Pressable>
        <Text style={styles.stepValue}>{display}</Text>
        <Pressable
          style={[styles.stepBtn, value >= max && styles.stepBtnDisabled]}
          disabled={value >= max}
          onPress={() => onChange(clamp(value + step))}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
        >
          <Feather name="plus" size={16} color={value >= max ? Colors.textMuted : Colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { session, updateConfig } = useSession();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>SETTINGS</Text>
        <Pressable
          style={styles.closeBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close settings"
        >
          <Feather name="x" size={20} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>GUARDRAILS</Text>
        <View style={styles.card}>
          <StepperRow
            label="Daily Goal"
            value={session.dailyGoal}
            display={`$${session.dailyGoal}`}
            step={50}
            min={0}
            max={10000}
            onChange={(dailyGoal) => updateConfig({ dailyGoal })}
          />
          <View style={styles.divider} />
          <StepperRow
            label="Max Loss"
            value={session.maxLoss}
            display={`-$${Math.abs(session.maxLoss)}`}
            step={50}
            min={-10000}
            max={0}
            onChange={(maxLoss) => updateConfig({ maxLoss })}
          />
          <View style={styles.divider} />
          <StepperRow
            label="Max Trades"
            value={session.maxTrades}
            display={`${session.maxTrades}`}
            step={1}
            min={1}
            max={100}
            onChange={(maxTrades) => updateConfig({ maxTrades })}
          />
          <View style={styles.divider} />
          <StepperRow
            label="Max Lots"
            value={session.maxLots}
            display={`${session.maxLots}`}
            step={1}
            min={1}
            max={50}
            onChange={(maxLots) =>
              updateConfig({
                maxLots,
                // keep the default lot size within the new ceiling
                lots: Math.min(session.lots, maxLots),
              })
            }
          />
        </View>

        <Text style={styles.sectionLabel}>DEFAULT INSTRUMENT</Text>
        <View style={styles.chipWrap}>
          {INSTRUMENT_SYMBOLS.map((sym) => {
            const active = session.instrument === sym;
            return (
              <Pressable
                key={sym}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => updateConfig({ instrument: sym })}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{sym}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>DEFAULT LOTS</Text>
        <View style={styles.card}>
          <StepperRow
            label="Lots per trade"
            value={session.lots}
            display={`${session.lots}`}
            step={1}
            min={1}
            max={session.maxLots}
            onChange={(lots) => updateConfig({ lots })}
          />
        </View>

        <View style={styles.note}>
          <Feather name="check-circle" size={13} color={Colors.statusGreen} />
          <Text style={styles.noteText}>Changes save automatically to this device.</Text>
        </View>
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
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: 12,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textPrimary,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: { opacity: 0.4 },
  stepValue: {
    minWidth: 72,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.monoBold,
    color: Colors.textPrimary,
  },
  divider: { height: 1, backgroundColor: Colors.borderDefault },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.bgCard,
  },
  chipActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: `${Colors.accentPrimary}20`,
  },
  chipText: {
    fontSize: 13,
    fontFamily: Fonts.monoMedium,
    color: Colors.textMuted,
  },
  chipTextActive: { color: Colors.accentPrimary },
  note: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  noteText: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
});
