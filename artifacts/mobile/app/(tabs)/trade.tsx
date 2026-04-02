import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SideSelector } from '@/components/trade/SideSelector';
import { OrderTypeSelector } from '@/components/trade/OrderTypeSelector';
import { QuantityInput } from '@/components/trade/QuantityInput';
import { PriceInputRow } from '@/components/trade/PriceInputRow';
import { StopLossChart } from '@/components/trade/StopLossChart';
import { OrderSummary } from '@/components/trade/OrderSummary';
import { useOrder } from '@/context/OrderContext';

const SYMBOLS = ['MES', 'ES', 'NQ', 'MNQ', 'RTY', 'YM'];

type TabMode = 'order' | 'positions';

export default function TradeScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { symbol, setSymbol, orders, cancelOrder, currentPrice } = useOrder();
  const [mode, setMode] = useState<TabMode>('order');

  const openOrders = orders.filter(o => o.status === 'pending' || o.status === 'filled');

  return (
    <View style={[styles.root, { backgroundColor: Colors.bgPrimary }]}>
      {/* App bar */}
      <View style={[styles.appBar, { paddingTop: isWeb ? 67 : insets.top + 8 }]}>
        <View>
          <Text style={styles.appBarTitle}>ORDER TICKET</Text>
          <Text style={styles.currentPrice}>{currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.modeSwitcher}>
          <Pressable
            style={[styles.modeBtn, mode === 'order' && styles.modeBtnActive]}
            onPress={() => setMode('order')}
          >
            <Text style={[styles.modeBtnText, mode === 'order' && styles.modeBtnTextActive]}>Order</Text>
          </Pressable>
          <Pressable
            style={[styles.modeBtn, mode === 'positions' && styles.modeBtnActive]}
            onPress={() => setMode('positions')}
          >
            <Text style={[styles.modeBtnText, mode === 'positions' && styles.modeBtnTextActive]}>
              Positions {openOrders.length > 0 ? `(${openOrders.length})` : ''}
            </Text>
          </Pressable>
        </View>
      </View>

      {mode === 'order' ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 90 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Symbol selector */}
          <View style={styles.symbolRow}>
            {SYMBOLS.map(sym => (
              <Pressable
                key={sym}
                style={[styles.symbolChip, symbol === sym && styles.symbolChipActive]}
                onPress={() => setSymbol(sym)}
              >
                <Text style={[styles.symbolText, symbol === sym && styles.symbolTextActive]}>
                  {sym}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Buy / Sell */}
          <SideSelector />

          {/* Order type */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>ORDER TYPE</Text>
            <OrderTypeSelector />
          </View>

          {/* Price inputs */}
          <PriceInputRow />

          {/* Quantity + percent quick values */}
          <QuantityInput />

          {/* Chart with draggable SL / TP */}
          <StopLossChart />

          {/* Order summary + submit */}
          <OrderSummary />
        </ScrollView>
      ) : (
        <View style={styles.positionsContainer}>
          {openOrders.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="inbox" size={36} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No positions</Text>
              <Text style={styles.emptySub}>Place an order to see it here</Text>
            </View>
          ) : (
            <FlatList
              data={openOrders}
              keyExtractor={o => o.id}
              contentContainerStyle={[
                styles.positionsList,
                { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 80 },
              ]}
              renderItem={({ item: order }) => {
                const isBuy = order.side === 'buy';
                const sideColor = isBuy ? Colors.statusGreen : Colors.statusRed;
                const statusColor =
                  order.status === 'filled'
                    ? Colors.statusGreen
                    : order.status === 'cancelled'
                    ? Colors.textMuted
                    : Colors.statusYellow;

                return (
                  <View style={styles.positionCard}>
                    <View style={styles.positionHeader}>
                      <View style={styles.positionLeft}>
                        <View style={[styles.sideTag, { backgroundColor: `${sideColor}20`, borderColor: `${sideColor}50` }]}>
                          <Text style={[styles.sideTagText, { color: sideColor }]}>
                            {order.side.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.positionSymbol}>{order.symbol}</Text>
                        <Text style={styles.positionQty}>{order.quantity} lot{order.quantity > 1 ? 's' : ''}</Text>
                      </View>
                      <View style={styles.positionRight}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.positionStatus, { color: statusColor }]}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.positionMeta}>
                      <Text style={styles.positionMetaText}>
                        {order.type === 'market' ? 'Market' : `Limit $${order.limitPrice?.toFixed(2)}`}
                      </Text>
                      <Text style={styles.positionMetaDot}>·</Text>
                      {order.stopLoss && (
                        <Text style={[styles.positionMetaText, { color: Colors.statusRed }]}>
                          SL ${order.stopLoss.toFixed(2)}
                        </Text>
                      )}
                      <Text style={styles.positionMetaDot}>·</Text>
                      {order.takeProfit && (
                        <Text style={[styles.positionMetaText, { color: Colors.statusGreen }]}>
                          TP ${order.takeProfit.toFixed(2)}
                        </Text>
                      )}
                    </View>

                    <View style={styles.positionFooter}>
                      <Text style={styles.positionTime}>
                        {new Date(order.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      {order.status === 'pending' && (
                        <Pressable
                          style={styles.cancelBtn}
                          onPress={() => cancelOrder(order.id)}
                        >
                          <Feather name="x" size={12} color={Colors.statusRed} />
                          <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  appBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  appBarTitle: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  currentPrice: {
    fontSize: 22,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    overflow: 'hidden',
  },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  modeBtnActive: {
    backgroundColor: Colors.bgElevated,
  },
  modeBtnText: {
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  modeBtnTextActive: {
    color: Colors.textPrimary,
  },
  scroll: { flex: 1 },
  content: { padding: 12, gap: 10 },
  symbolRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symbolChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.bgCard,
  },
  symbolChipActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: `${Colors.accentPrimary}18`,
  },
  symbolText: {
    fontSize: 13,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textMuted,
  },
  symbolTextActive: {
    color: Colors.accentPrimary,
  },
  sectionGroup: { gap: 8 },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  positionsContainer: { flex: 1 },
  positionsList: { padding: 12, gap: 10 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textSecondary,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  positionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 14,
    gap: 10,
  },
  positionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  positionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sideTag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  sideTagText: {
    fontSize: 10,
    fontFamily: 'DMSans_700Bold',
    letterSpacing: 0.8,
  },
  positionSymbol: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
  positionQty: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
  },
  positionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  positionStatus: {
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
  },
  positionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  positionMetaText: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
  },
  positionMetaDot: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  positionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  positionTime: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: `${Colors.statusRed}50`,
    backgroundColor: `${Colors.statusRed}10`,
  },
  cancelText: {
    fontSize: 11,
    fontFamily: 'DMSans_500Medium',
    color: Colors.statusRed,
  },
});
