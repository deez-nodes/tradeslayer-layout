import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useOrder } from '@/context/OrderContext';

const RT_COSTS: Record<string, number> = {
  MES: 4, ES: 4, NQ: 4, MNQ: 4, RTY: 4, YM: 4,
};

export function OrderSummary() {
  const { side, orderType, quantity, symbol, limitPrice, stopLoss, takeProfit, currentPrice, submitOrder, lastOrderStatus } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const fillPrice = orderType === 'market' ? currentPrice : limitPrice;
  const commission = (RT_COSTS[symbol] ?? 4) * quantity;
  const slPoints = Math.abs(fillPrice - stopLoss);
  const tpPoints = Math.abs(takeProfit - fillPrice);
  const rr = slPoints > 0 ? (tpPoints / slPoints).toFixed(1) : '—';
  const rrNum = slPoints > 0 ? tpPoints / slPoints : 0;
  const rrGood = rrNum >= 2;
  const isBuy = side === 'buy';

  const accentColor = isBuy ? Colors.statusGreen : Colors.statusRed;
  const sideLabel = isBuy ? 'BUY' : 'SELL';

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsSubmitting(true);
    try {
      const order = await submitOrder();
      setConfirmedOrder(order);
      setShowConfirmation(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ORDER SUMMARY</Text>

      <View style={styles.summaryGrid}>
        <Row label="Symbol" value={symbol} />
        <Row label="Side" value={sideLabel} valueColor={accentColor} />
        <Row label="Type" value={orderType === 'stop_limit' ? 'Stop Limit' : orderType.charAt(0).toUpperCase() + orderType.slice(1)} />
        <Row label="Quantity" value={`${quantity} lot${quantity > 1 ? 's' : ''}`} />
        <Row label="Fill Price" value={`~$${fillPrice.toFixed(2)}`} />
        <Row label="Stop Loss" value={`$${stopLoss.toFixed(2)}`} valueColor={Colors.statusRed} />
        <Row label="Take Profit" value={`$${takeProfit.toFixed(2)}`} valueColor={Colors.statusGreen} />
        <View style={styles.divider} />
        <Row label="Commission" value={`$${commission.toFixed(2)}`} />
        <Row
          label="R : R"
          value={`1 : ${rr}`}
          valueColor={rrGood ? Colors.statusGreen : rrNum < 1 ? Colors.statusRed : Colors.statusYellow}
        />
      </View>

      {!rrGood && rrNum > 0 && (
        <View style={styles.warningBanner}>
          <Feather name="alert-triangle" size={13} color={Colors.statusYellow} />
          <Text style={styles.warningText}>R:R below 2:1 — consider adjusting levels</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.submitBtn,
          { backgroundColor: accentColor, opacity: pressed || isSubmitting ? 0.8 : 1 },
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={Colors.bgPrimary} />
        ) : (
          <>
            <Text style={styles.submitText}>CONFIRM {sideLabel}</Text>
            <Text style={styles.submitSub}>{symbol} · {quantity} lot{quantity > 1 ? 's' : ''}</Text>
          </>
        )}
      </Pressable>

      {/* Confirmation modal */}
      <Modal visible={showConfirmation} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={[styles.confirmIcon, { backgroundColor: `${accentColor}20` }]}>
              <Feather name="check" size={28} color={accentColor} />
            </View>
            <Text style={styles.confirmTitle}>Order Sent</Text>
            <Text style={styles.confirmSub}>
              {sideLabel} {quantity} {symbol} {orderType === 'market' ? '@ market' : `@ $${limitPrice.toFixed(2)}`}
            </Text>
            <View style={styles.confirmDetails}>
              <Text style={styles.confirmDetailRow}>
                <Text style={styles.confirmLabel}>SL: </Text>
                <Text style={{ color: Colors.statusRed }}>${stopLoss.toFixed(2)}</Text>
                {'  '}
                <Text style={styles.confirmLabel}>TP: </Text>
                <Text style={{ color: Colors.statusGreen }}>${takeProfit.toFixed(2)}</Text>
              </Text>
            </View>
            <Pressable
              style={[styles.confirmBtn, { borderColor: accentColor }]}
              onPress={() => setShowConfirmation(false)}
            >
              <Text style={[styles.confirmBtnText, { color: accentColor }]}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, valueColor ? { color: valueColor } : {}]}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
});

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
  summaryGrid: { gap: 10 },
  divider: { height: 1, backgroundColor: Colors.borderDefault, marginVertical: 2 },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${Colors.statusYellow}18`,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Colors.statusYellow}40`,
    padding: 10,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.statusYellow,
    flex: 1,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 2,
  },
  submitText: {
    fontSize: 15,
    fontFamily: 'DMSans_700Bold',
    color: Colors.bgPrimary,
    letterSpacing: 1.5,
  },
  submitSub: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: `${Colors.bgPrimary}aa`,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  confirmCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 340,
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  confirmTitle: {
    fontSize: 24,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
  confirmSub: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  confirmDetails: { marginTop: 4 },
  confirmDetailRow: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
  },
  confirmLabel: { color: Colors.textMuted },
  confirmBtn: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
  },
  confirmBtnText: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
  },
});
