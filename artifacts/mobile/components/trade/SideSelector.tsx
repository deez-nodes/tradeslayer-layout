import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useOrder, OrderSide } from '@/context/OrderContext';

export function SideSelector() {
  const { side, setSide } = useOrder();

  const select = (s: OrderSide) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSide(s);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.btn, styles.buyBtn, side === 'buy' && styles.buyActive]}
        onPress={() => select('buy')}
      >
        <Text style={[styles.label, side === 'buy' && styles.buyLabel]}>BUY</Text>
        {side === 'buy' && <Text style={styles.subLabel}>Long</Text>}
      </Pressable>
      <Pressable
        style={[styles.btn, styles.sellBtn, side === 'sell' && styles.sellActive]}
        onPress={() => select('sell')}
      >
        <Text style={[styles.label, side === 'sell' && styles.sellLabel]}>SELL</Text>
        {side === 'sell' && <Text style={styles.subLabel}>Short</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: Colors.bgCard,
  },
  buyBtn: {
    borderRightWidth: 0.5,
    borderRightColor: Colors.borderDefault,
  },
  sellBtn: {
    borderLeftWidth: 0.5,
    borderLeftColor: Colors.borderDefault,
  },
  buyActive: {
    backgroundColor: `${Colors.statusGreen}22`,
  },
  sellActive: {
    backgroundColor: `${Colors.statusRed}22`,
  },
  label: {
    fontSize: 15,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  buyLabel: { color: Colors.statusGreen },
  sellLabel: { color: Colors.statusRed },
  subLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
});
