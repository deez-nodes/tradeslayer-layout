import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { useOrder } from '@/context/OrderContext';

const round2 = (n: number) => Math.round(n * 100) / 100;

function PriceField({
  label,
  value,
  onCommit,
  currentPrice,
  showDelta = false,
}: {
  label: string;
  value: number;
  onCommit: (n: number) => void;
  currentPrice: number;
  showDelta?: boolean;
}) {
  const [text, setText] = useState(value.toFixed(2));
  const [focused, setFocused] = useState(false);

  // Reflect external changes (+/- buttons, symbol switch) only while not editing,
  // so the user can freely type partial values like "5210." without it snapping.
  useEffect(() => {
    if (!focused) setText(value.toFixed(2));
  }, [value, focused]);

  const commit = (raw: string) => {
    const n = parseFloat(raw);
    if (!Number.isNaN(n) && n > 0) onCommit(round2(n));
    else setText(value.toFixed(2)); // revert invalid/empty entry
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.currency}>$</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            commit(text);
          }}
          keyboardType="decimal-pad"
          inputMode="decimal"
          selectTextOnFocus
          accessibilityLabel={label}
        />
        <View style={styles.adjButtons}>
          <Pressable style={styles.adjBtn} onPress={() => onCommit(round2(value + 0.25))} accessibilityLabel={`${label} up`}>
            <Text style={styles.adjText}>+</Text>
          </Pressable>
          <Pressable style={styles.adjBtn} onPress={() => onCommit(round2(value - 0.25))} accessibilityLabel={`${label} down`}>
            <Text style={styles.adjText}>−</Text>
          </Pressable>
        </View>
      </View>
      {showDelta && (
        <Text style={styles.delta}>
          {value > currentPrice ? '+' : ''}
          {(value - currentPrice).toFixed(2)} pts from current
        </Text>
      )}
    </View>
  );
}

export function PriceInputRow() {
  const { orderType, limitPrice, setLimitPrice, stopPrice, setStopPrice, currentPrice } = useOrder();

  if (orderType === 'market') {
    return (
      <View style={styles.marketBadge}>
        <Text style={styles.marketLabel}>FILL PRICE</Text>
        <Text style={styles.marketPrice}>Market ~{currentPrice.toLocaleString()}</Text>
        <Text style={styles.marketSub}>Fills at best available price</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(orderType === 'limit' || orderType === 'stop_limit') && (
        <PriceField label="LIMIT PRICE" value={limitPrice} onCommit={setLimitPrice} currentPrice={currentPrice} showDelta />
      )}
      {orderType === 'stop_limit' && (
        <PriceField label="STOP TRIGGER" value={stopPrice} onCommit={setStopPrice} currentPrice={currentPrice} />
      )}
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
    gap: 14,
  },
  marketBadge: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 14,
    gap: 4,
  },
  marketLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  marketPrice: {
    fontSize: 18,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
  marketSub: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  row: { gap: 8 },
  label: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  currency: {
    fontSize: 16,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontFamily: Fonts.monoBold,
    color: Colors.textPrimary,
  },
  adjButtons: {
    gap: 4,
  },
  adjBtn: {
    width: 28,
    height: 22,
    backgroundColor: Colors.bgCard,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjText: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
  delta: {
    fontSize: 11,
    fontFamily: Fonts.mono,
    color: Colors.textMuted,
  },
});
