import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { useOrder, OrderType } from '@/context/OrderContext';

const TYPES: { key: OrderType; label: string; desc: string }[] = [
  { key: 'market', label: 'Market', desc: 'Fill at best price' },
  { key: 'limit', label: 'Limit', desc: 'Set your price' },
  { key: 'stop_limit', label: 'Stop Limit', desc: 'Trigger + price' },
];

export function OrderTypeSelector() {
  const { orderType, setOrderType } = useOrder();

  return (
    <View style={styles.container}>
      {TYPES.map(t => (
        <Pressable
          key={t.key}
          style={[styles.chip, orderType === t.key && styles.chipActive]}
          onPress={() => setOrderType(t.key)}
          accessibilityRole="button"
          accessibilityState={{ selected: orderType === t.key }}
        >
          <Text style={[styles.label, orderType === t.key && styles.labelActive]}>{t.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
  },
  chipActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: `${Colors.accentPrimary}18`,
  },
  label: {
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  labelActive: {
    color: Colors.accentPrimary,
  },
});
