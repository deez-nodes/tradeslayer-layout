import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { useOrder } from '@/context/OrderContext';

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
        <View style={styles.row}>
          <Text style={styles.label}>LIMIT PRICE</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              style={styles.input}
              value={limitPrice.toFixed(2)}
              onChangeText={t => setLimitPrice(parseFloat(t) || currentPrice)}
              keyboardType="decimal-pad"
              selectTextOnFocus
            />
            <View style={styles.adjButtons}>
              <Pressable style={styles.adjBtn} onPress={() => setLimitPrice(+(limitPrice + 0.25).toFixed(2))}>
                <Text style={styles.adjText}>+</Text>
              </Pressable>
              <Pressable style={styles.adjBtn} onPress={() => setLimitPrice(+(limitPrice - 0.25).toFixed(2))}>
                <Text style={styles.adjText}>−</Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.delta}>
            {limitPrice > currentPrice ? '+' : ''}{(limitPrice - currentPrice).toFixed(2)} pts from current
          </Text>
        </View>
      )}

      {orderType === 'stop_limit' && (
        <View style={[styles.row, { marginTop: 12 }]}>
          <Text style={styles.label}>STOP TRIGGER</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              style={styles.input}
              value={stopPrice.toFixed(2)}
              onChangeText={t => setStopPrice(parseFloat(t) || currentPrice)}
              keyboardType="decimal-pad"
              selectTextOnFocus
            />
            <View style={styles.adjButtons}>
              <Pressable style={styles.adjBtn} onPress={() => setStopPrice(+(stopPrice + 0.25).toFixed(2))}>
                <Text style={styles.adjText}>+</Text>
              </Pressable>
              <Pressable style={styles.adjBtn} onPress={() => setStopPrice(+(stopPrice - 0.25).toFixed(2))}>
                <Text style={styles.adjText}>−</Text>
              </Pressable>
            </View>
          </View>
        </View>
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
    fontFamily: 'DMSans_700Bold',
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
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
});
