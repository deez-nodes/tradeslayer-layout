import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { useOrder } from '@/context/OrderContext';

const PERCENTS = [25, 50, 75, 100];

export function QuantityInput() {
  const { quantity, setQuantity, maxLots } = useOrder();

  const setPercent = (pct: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const q = Math.max(1, Math.round((pct / 100) * maxLots));
    setQuantity(q);
  };

  const increment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity(Math.min(quantity + 1, maxLots));
  };

  const decrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity(Math.max(quantity - 1, 1));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>QUANTITY</Text>

      {/* Stepper */}
      <View style={styles.stepperRow}>
        <Pressable
          style={[styles.stepBtn, quantity <= 1 && styles.stepBtnDisabled]}
          onPress={decrement}
          disabled={quantity <= 1}
          accessibilityRole="button"
        >
          <Feather name="minus" size={16} color={quantity <= 1 ? Colors.textMuted : Colors.textPrimary} />
        </Pressable>

        <View style={styles.valueWrapper}>
          <TextInput
            style={styles.valueInput}
            value={String(quantity)}
            onChangeText={t => {
              const n = parseInt(t) || 1;
              setQuantity(Math.min(Math.max(n, 1), maxLots));
            }}
            keyboardType="numeric"
            maxLength={2}
            selectTextOnFocus
          />
          <Text style={styles.unit}>lots</Text>
        </View>

        <Pressable
          style={[styles.stepBtn, quantity >= maxLots && styles.stepBtnDisabled]}
          onPress={increment}
          disabled={quantity >= maxLots}
          accessibilityRole="button"
        >
          <Feather name="plus" size={16} color={quantity >= maxLots ? Colors.textMuted : Colors.textPrimary} />
        </Pressable>
      </View>

      {/* Percent quick buttons */}
      <View style={styles.percentRow}>
        {PERCENTS.map(pct => {
          const isActive = quantity === Math.max(1, Math.round((pct / 100) * maxLots));
          return (
            <Pressable
              key={pct}
              style={[styles.pctBtn, isActive && styles.pctBtnActive]}
              onPress={() => setPercent(pct)}
              accessibilityRole="button"
            >
              <Text style={[styles.pctLabel, isActive && styles.pctLabelActive]}>{pct}%</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.maxRow}>
        <Text style={styles.maxLabel}>Max: {maxLots} lots</Text>
        <View style={styles.fillBar}>
          {Array.from({ length: maxLots }).map((_, i) => (
            <View
              key={i}
              style={[styles.fillSegment, i < quantity && styles.fillSegmentActive]}
            />
          ))}
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
    padding: 14,
    gap: 12,
  },
  label: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  valueWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
  },
  valueInput: {
    fontSize: 36,
    fontFamily: Fonts.monoBold,
    color: Colors.textPrimary,
    textAlign: 'center',
    minWidth: 48,
  },
  unit: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  percentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pctBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
  },
  pctBtnActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: `${Colors.accentPrimary}20`,
  },
  pctLabel: {
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  pctLabelActive: {
    color: Colors.accentPrimary,
  },
  maxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  maxLabel: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  fillBar: {
    flexDirection: 'row',
    gap: 4,
  },
  fillSegment: {
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderDefault,
  },
  fillSegmentActive: {
    backgroundColor: Colors.accentPrimary,
  },
});
