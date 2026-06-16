import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { ContentWidth } from '@/constants/layout';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { SideSelector } from '@/components/trade/SideSelector';
import { OrderTypeSelector } from '@/components/trade/OrderTypeSelector';
import { QuantityInput } from '@/components/trade/QuantityInput';
import { PriceInputRow } from '@/components/trade/PriceInputRow';
import { StopLossChart } from '@/components/trade/StopLossChart';
import { PreTradeChecklist } from '@/components/trade/PreTradeChecklist';
import { OrderSummary } from '@/components/trade/OrderSummary';
import { useOrder } from '@/context/OrderContext';

const SYMBOLS = ['MES', 'ES', 'NQ', 'MNQ', 'RTY', 'YM'];
const MAX_WIDTH = ContentWidth.column;

type TabMode = 'order' | 'positions';

export default function TradeScreen() {
  const { isWide, headerPaddingTop, contentPaddingBottom } = useResponsiveLayout();
  const { symbol, setSymbol, orders, cancelOrder, currentPrice } = useOrder();
  const [mode, setMode] = useState<TabMode>('order');

  const openOrders = orders.filter(o => o.status === 'pending' || o.status === 'filled');
  const centeredCol = isWide ? { maxWidth: MAX_WIDTH, alignSelf: 'center' as const } : undefined;

  return (
    <View style={styles.root}>
      {/* App bar */}
      <View style={[styles.appBarOuter, { paddingTop: headerPaddingTop }]}>
        <View style={[styles.appBar, { width: '100%' }, centeredCol]}>
          <View>
            <Text style={styles.appBarTitle}>ORDER TICKET</Text>
            <Text style={styles.currentPrice}>{currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
          </View>
          <View style={styles.modeSwitcher}>
            <Pressable
              style={[styles.modeBtn, mode === 'order' && styles.modeBtnActive]}
              onPress={() => setMode('order')}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === 'order' }}
            >
              <Text style={[styles.modeBtnText, mode === 'order' && styles.modeBtnTextActive]}>Order</Text>
            </Pressable>
            <Pressable
              style={[styles.modeBtn, mode === 'positions' && styles.modeBtnActive]}
              onPress={() => setMode('positions')}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === 'positions' }}
            >
              <Text style={[styles.modeBtnText, mode === 'positions' && styles.modeBtnTextActive]}>
                Positions {openOrders.length > 0 ? `(${openOrders.length})` : ''}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {mode === 'order' ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: contentPaddingBottom }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.content, { width: '100%' }, centeredCol]}>
            {/* Symbol selector */}
            <View style={styles.symbolRow}>
              {SYMBOLS.map(sym => (
                <Pressable
                  key={sym}
                  style={[styles.symbolChip, symbol === sym && styles.symbolChipActive]}
                  onPress={() => setSymbol(sym)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: symbol === sym }}
                >
                  <Text style={[styles.symbolText, symbol === sym && styles.symbolTextActive]}>
                    {sym}
                  </Text>
                </Pressable>
              ))}
            </View>

            <SideSelector />

            <View style={styles.sectionGroup}>
              <Text style={styles.sectionLabel}>ORDER TYPE</Text>
              <OrderTypeSelector />
            </View>

            <PriceInputRow />
            <QuantityInput />
            <StopLossChart />
            <PreTradeChecklist />
            <OrderSummary />
          </View>
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
                { width: '100%', paddingBottom: contentPaddingBottom },
                centeredCol,
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
                          accessibilityRole="button"
                          accessibilityLabel="Cancel order"
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
  root: { flex: 1, backgroundColor: Colors.bgPrimary },
  appBarOuter: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  appBarTitle: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  currentPrice: {
    fontSize: 22,
    fontFamily: Fonts.monoBold,
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
  scrollContent: { alignItems: 'center' },
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
