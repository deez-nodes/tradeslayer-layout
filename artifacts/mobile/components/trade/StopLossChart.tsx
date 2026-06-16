import React, { useRef, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Platform,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, { Rect, Line, Path, Circle, Text as SvgText, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { PillBadge } from '@/components/shared/PillBadge';
import { useOrder } from '@/context/OrderContext';

const CHART_HEIGHT = 220;
const LABEL_WIDTH = 70;
const NUM_CANDLES = 28;
const HANDLE_RADIUS = 10;
const DRAG_HIT_SLOP = 24;

// Generate realistic seed candles centered around a price
function generateCandles(basePrice: number, count: number) {
  const candles = [];
  let price = basePrice - 20;
  for (let i = 0; i < count; i++) {
    const move = (Math.random() - 0.44) * 8;
    const open = price;
    const close = price + move;
    const high = Math.max(open, close) + Math.random() * 4;
    const low = Math.min(open, close) - Math.random() * 4;
    candles.push({ open, high, low, close });
    price = close;
  }
  return candles;
}

const SEED_CANDLES = generateCandles(5194, NUM_CANDLES);

type DragTarget = 'sl' | 'tp' | null;

export function StopLossChart() {
  const { stopLoss, setStopLoss, takeProfit, setTakeProfit, currentPrice, side } = useOrder();
  const dragging = useRef<DragTarget>(null);

  // The chart now sizes to its container (responsive across mobile/web) and
  // measures its absolute window position on drag start — so handles map to the
  // correct price regardless of app bar, safe-area, scroll offset, or layout.
  const containerRef = useRef<View>(null);
  const chartTop = useRef(0);
  const [chartWidth, setChartWidth] = useState(0);

  const candleAreaW = Math.max(0, chartWidth - LABEL_WIDTH);
  const candleSpacing = NUM_CANDLES > 0 ? candleAreaW / NUM_CANDLES : 0;
  const candleW = candleSpacing * 0.55;
  const ready = chartWidth > 0;

  // Price range: show ±30 pts around current, expanded to fit SL/TP
  const minPrice = Math.min(currentPrice - 30, stopLoss - 5, takeProfit - 5);
  const maxPrice = Math.max(currentPrice + 30, stopLoss + 5, takeProfit + 5);
  const priceRange = maxPrice - minPrice;

  const priceToY = useCallback(
    (price: number) => {
      return CHART_HEIGHT - ((price - minPrice) / priceRange) * CHART_HEIGHT;
    },
    [minPrice, priceRange],
  );

  const yToPrice = useCallback(
    (y: number) => {
      return minPrice + ((CHART_HEIGHT - y) / CHART_HEIGHT) * priceRange;
    },
    [minPrice, priceRange],
  );

  // Stable PanResponders read the latest mapping/setters via a ref, so dragging
  // stays correct even after the price range rescales mid-drag.
  const latest = useRef({ yToPrice, setStopLoss, setTakeProfit });
  latest.current = { yToPrice, setStopLoss, setTakeProfit };

  const measureTop = useCallback(() => {
    containerRef.current?.measureInWindow((_x, y) => {
      chartTop.current = y;
    });
  }, []);

  const makeResponder = useCallback(
    (target: 'sl' | 'tp') =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          dragging.current = target;
          measureTop();
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        },
        onPanResponderMove: (_, gs) => {
          const rawY = gs.moveY - chartTop.current;
          const clampedY = Math.max(HANDLE_RADIUS, Math.min(CHART_HEIGHT - HANDLE_RADIUS, rawY));
          const newPrice = parseFloat(latest.current.yToPrice(clampedY).toFixed(2));
          if (target === 'sl') latest.current.setStopLoss(newPrice);
          else latest.current.setTakeProfit(newPrice);
        },
        onPanResponderRelease: () => {
          dragging.current = null;
          if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      }),
    [measureTop],
  );

  const slResponder = useRef(makeResponder('sl')).current;
  const tpResponder = useRef(makeResponder('tp')).current;

  const slY = priceToY(stopLoss);
  const tpY = priceToY(takeProfit);
  const cpY = priceToY(currentPrice);

  // Risk/Reward
  const slDist = Math.abs(currentPrice - stopLoss);
  const tpDist = Math.abs(takeProfit - currentPrice);
  const rr = slDist > 0 ? (tpDist / slDist).toFixed(1) : '—';

  // Price labels on right axis
  const priceLabels = useMemo(() => {
    const count = 5;
    return Array.from({ length: count }, (_, i) => {
      const price = minPrice + (priceRange * i) / (count - 1);
      return { price, y: priceToY(price) };
    });
  }, [minPrice, priceRange, priceToY]);

  // Profit zone fill path
  const buyMode = side === 'buy';
  const profitTop = buyMode ? tpY : cpY;
  const profitBot = buyMode ? cpY : tpY;
  const lossTop = buyMode ? cpY : slY;
  const lossBot = buyMode ? slY : cpY;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - chartWidth) > 0.5) setChartWidth(w);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>PRICE CHART · DRAG LEVELS</Text>
          <PillBadge label="SIMULATED" />
        </View>
        <View style={styles.rrBadge}>
          <Text style={styles.rrLabel}>R:R</Text>
          <Text style={styles.rrValue}>{rr}</Text>
        </View>
      </View>

      <View ref={containerRef} onLayout={onLayout} style={styles.chartContainer}>
        {ready && (
          <>
            <Svg width={chartWidth} height={CHART_HEIGHT}>
              {/* Background grid lines */}
              {priceLabels.map(({ y }, i) => (
                <Line
                  key={i}
                  x1={0}
                  y1={y}
                  x2={candleAreaW}
                  y2={y}
                  stroke={Colors.borderSubtle}
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                />
              ))}

              {/* Profit zone (semi-transparent) */}
              <Rect
                x={0}
                y={profitTop}
                width={candleAreaW}
                height={Math.max(0, profitBot - profitTop)}
                fill={`${Colors.statusGreen}18`}
              />

              {/* Loss zone */}
              <Rect
                x={0}
                y={lossTop}
                width={candleAreaW}
                height={Math.max(0, lossBot - lossTop)}
                fill={`${Colors.statusRed}18`}
              />

              {/* Candlesticks */}
              {SEED_CANDLES.map((c, i) => {
                const x = i * candleSpacing + candleSpacing / 2;
                const openY = priceToY(c.open);
                const closeY = priceToY(c.close);
                const highY = priceToY(c.high);
                const lowY = priceToY(c.low);
                const isBull = c.close >= c.open;
                const color = isBull ? Colors.statusGreen : Colors.statusRed;
                const bodyTop = Math.min(openY, closeY);
                const bodyH = Math.max(1, Math.abs(closeY - openY));

                return (
                  <G key={i}>
                    {/* Wick */}
                    <Line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={color}
                      strokeWidth={1}
                      opacity={0.7}
                    />
                    {/* Body */}
                    <Rect
                      x={x - candleW / 2}
                      y={bodyTop}
                      width={candleW}
                      height={bodyH}
                      fill={color}
                      opacity={0.85}
                    />
                  </G>
                );
              })}

              {/* Current price line */}
              <Line
                x1={0}
                y1={cpY}
                x2={candleAreaW}
                y2={cpY}
                stroke={Colors.textSecondary}
                strokeWidth={1}
                strokeDasharray="6 3"
              />

              {/* Stop Loss line */}
              <Line
                x1={0}
                y1={slY}
                x2={candleAreaW + 4}
                y2={slY}
                stroke={Colors.statusRed}
                strokeWidth={1.5}
                strokeDasharray="5 3"
              />

              {/* Take Profit line */}
              <Line
                x1={0}
                y1={tpY}
                x2={candleAreaW + 4}
                y2={tpY}
                stroke={Colors.statusGreen}
                strokeWidth={1.5}
                strokeDasharray="5 3"
              />

              {/* Right axis labels */}
              {priceLabels.map(({ price, y }, i) => (
                <SvgText
                  key={i}
                  x={candleAreaW + 6}
                  y={y + 4}
                  fontSize={9}
                  fill={Colors.textMuted}
                  fontFamily="JetBrainsMono_400Regular"
                >
                  {price.toFixed(0)}
                </SvgText>
              ))}

              {/* Current price label */}
              <Rect
                x={candleAreaW}
                y={cpY - 9}
                width={LABEL_WIDTH - 4}
                height={18}
                fill={Colors.bgElevated}
                rx={3}
              />
              <SvgText
                x={candleAreaW + LABEL_WIDTH / 2 - 2}
                y={cpY + 5}
                fontSize={10}
                fill={Colors.textSecondary}
                fontFamily="JetBrainsMono_700Bold"
                textAnchor="middle"
              >
                {currentPrice.toFixed(2)}
              </SvgText>

              {/* SL price label */}
              <Rect
                x={candleAreaW}
                y={slY - 9}
                width={LABEL_WIDTH - 4}
                height={18}
                fill={`${Colors.statusRed}30`}
                rx={3}
              />
              <SvgText
                x={candleAreaW + LABEL_WIDTH / 2 - 2}
                y={slY + 5}
                fontSize={10}
                fill={Colors.statusRed}
                fontFamily="JetBrainsMono_700Bold"
                textAnchor="middle"
              >
                {stopLoss.toFixed(2)}
              </SvgText>

              {/* TP price label */}
              <Rect
                x={candleAreaW}
                y={tpY - 9}
                width={LABEL_WIDTH - 4}
                height={18}
                fill={`${Colors.statusGreen}30`}
                rx={3}
              />
              <SvgText
                x={candleAreaW + LABEL_WIDTH / 2 - 2}
                y={tpY + 5}
                fontSize={10}
                fill={Colors.statusGreen}
                fontFamily="JetBrainsMono_700Bold"
                textAnchor="middle"
              >
                {takeProfit.toFixed(2)}
              </SvgText>
            </Svg>

            {/* Draggable Stop Loss handle - rendered as native view over SVG */}
            <View
              {...slResponder.panHandlers}
              style={[
                styles.handle,
                styles.slHandle,
                {
                  top: slY - HANDLE_RADIUS,
                  left: candleAreaW - HANDLE_RADIUS - 8,
                },
              ]}
              hitSlop={{ top: DRAG_HIT_SLOP, bottom: DRAG_HIT_SLOP, left: 16, right: 16 }}
            >
              <View style={styles.handleInnerSl} />
              <Text style={styles.handleLabelSl}>SL</Text>
            </View>

            {/* Draggable Take Profit handle */}
            <View
              {...tpResponder.panHandlers}
              style={[
                styles.handle,
                styles.tpHandle,
                {
                  top: tpY - HANDLE_RADIUS,
                  left: candleAreaW - HANDLE_RADIUS - 8,
                },
              ]}
              hitSlop={{ top: DRAG_HIT_SLOP, bottom: DRAG_HIT_SLOP, left: 16, right: 16 }}
            >
              <View style={styles.handleInnerTp} />
              <Text style={styles.handleLabelTp}>TP</Text>
            </View>
          </>
        )}
      </View>

      {/* Level summary row */}
      <View style={styles.levelRow}>
        <View style={styles.levelItem}>
          <View style={[styles.levelDot, { backgroundColor: Colors.statusRed }]} />
          <Text style={styles.levelKey}>Stop Loss</Text>
          <Text style={[styles.levelVal, { color: Colors.statusRed }]}>{stopLoss.toFixed(2)}</Text>
          <Text style={styles.levelDelta}>−{slDist.toFixed(1)} pts</Text>
        </View>
        <View style={styles.levelDivider} />
        <View style={styles.levelItem}>
          <View style={[styles.levelDot, { backgroundColor: Colors.statusGreen }]} />
          <Text style={styles.levelKey}>Take Profit</Text>
          <Text style={[styles.levelVal, { color: Colors.statusGreen }]}>{takeProfit.toFixed(2)}</Text>
          <Text style={styles.levelDelta}>+{tpDist.toFixed(1)} pts</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 14,
    gap: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  rrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.bgElevated,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rrLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  rrValue: {
    fontSize: 13,
    fontFamily: Fonts.monoBold,
    color: Colors.accentPrimary,
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
    height: CHART_HEIGHT,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_RADIUS * 2,
    height: HANDLE_RADIUS * 2,
    borderRadius: HANDLE_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    flexDirection: 'row',
    gap: 4,
  },
  slHandle: {
    backgroundColor: `${Colors.statusRed}30`,
    borderWidth: 2,
    borderColor: Colors.statusRed,
  },
  tpHandle: {
    backgroundColor: `${Colors.statusGreen}30`,
    borderWidth: 2,
    borderColor: Colors.statusGreen,
  },
  handleInnerSl: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.statusRed,
  },
  handleInnerTp: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.statusGreen,
  },
  handleLabelSl: {
    fontSize: 8,
    fontFamily: 'DMSans_700Bold',
    color: Colors.statusRed,
    position: 'absolute',
    top: -16,
  },
  handleLabelTp: {
    fontSize: 8,
    fontFamily: 'DMSans_700Bold',
    color: Colors.statusGreen,
    position: 'absolute',
    bottom: -16,
  },
  levelRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgElevated,
    borderRadius: 8,
    padding: 10,
    gap: 0,
  },
  levelItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  levelKey: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  levelVal: {
    fontSize: 12,
    fontFamily: Fonts.monoBold,
  },
  levelDelta: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  levelDivider: {
    width: 1,
    backgroundColor: Colors.borderDefault,
    marginHorizontal: 10,
  },
});
