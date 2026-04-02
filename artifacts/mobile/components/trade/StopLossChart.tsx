import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Rect, Line, Path, Circle, Text as SvgText, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useOrder } from '@/context/OrderContext';

const SCREEN_W = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_W - 32; // full width minus container padding
const CHART_HEIGHT = 220;
const LABEL_WIDTH = 70;
const CANDLE_AREA_W = CHART_WIDTH - LABEL_WIDTH;
const NUM_CANDLES = 28;
const CANDLE_SPACING = CANDLE_AREA_W / NUM_CANDLES;
const CANDLE_W = CANDLE_SPACING * 0.55;
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
  const chartY = useRef(0);

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

  const slY = priceToY(stopLoss);
  const tpY = priceToY(takeProfit);
  const cpY = priceToY(currentPrice);

  // Risk/Reward
  const slDist = Math.abs(currentPrice - stopLoss);
  const tpDist = Math.abs(takeProfit - currentPrice);
  const rr = slDist > 0 ? (tpDist / slDist).toFixed(1) : '—';

  // PanResponder for SL handle
  const slResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragging.current = 'sl';
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },
      onPanResponderMove: (_, gs) => {
        const rawY = gs.moveY - chartY.current;
        const clampedY = Math.max(HANDLE_RADIUS, Math.min(CHART_HEIGHT - HANDLE_RADIUS, rawY));
        const newPrice = parseFloat(yToPrice(clampedY).toFixed(2));
        setStopLoss(newPrice);
      },
      onPanResponderRelease: () => {
        dragging.current = null;
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    }),
  ).current;

  // PanResponder for TP handle
  const tpResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragging.current = 'tp';
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },
      onPanResponderMove: (_, gs) => {
        const rawY = gs.moveY - chartY.current;
        const clampedY = Math.max(HANDLE_RADIUS, Math.min(CHART_HEIGHT - HANDLE_RADIUS, rawY));
        const newPrice = parseFloat(yToPrice(clampedY).toFixed(2));
        setTakeProfit(newPrice);
      },
      onPanResponderRelease: () => {
        dragging.current = null;
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    }),
  ).current;

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

  return (
    <View
      style={styles.wrapper}
      onLayout={e => {
        chartY.current = e.nativeEvent.layout.y;
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>PRICE CHART · DRAG LEVELS</Text>
        <View style={styles.rrBadge}>
          <Text style={styles.rrLabel}>R:R</Text>
          <Text style={styles.rrValue}>{rr}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Background grid lines */}
          {priceLabels.map(({ y }, i) => (
            <Line
              key={i}
              x1={0}
              y1={y}
              x2={CANDLE_AREA_W}
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
            width={CANDLE_AREA_W}
            height={Math.max(0, profitBot - profitTop)}
            fill={`${Colors.statusGreen}18`}
          />

          {/* Loss zone */}
          <Rect
            x={0}
            y={lossTop}
            width={CANDLE_AREA_W}
            height={Math.max(0, lossBot - lossTop)}
            fill={`${Colors.statusRed}18`}
          />

          {/* Candlesticks */}
          {SEED_CANDLES.map((c, i) => {
            const x = i * CANDLE_SPACING + CANDLE_SPACING / 2;
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
                  x={x - CANDLE_W / 2}
                  y={bodyTop}
                  width={CANDLE_W}
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
            x2={CANDLE_AREA_W}
            y2={cpY}
            stroke={Colors.textSecondary}
            strokeWidth={1}
            strokeDasharray="6 3"
          />

          {/* Stop Loss line */}
          <Line
            x1={0}
            y1={slY}
            x2={CANDLE_AREA_W + 4}
            y2={slY}
            stroke={Colors.statusRed}
            strokeWidth={1.5}
            strokeDasharray="5 3"
          />

          {/* Take Profit line */}
          <Line
            x1={0}
            y1={tpY}
            x2={CANDLE_AREA_W + 4}
            y2={tpY}
            stroke={Colors.statusGreen}
            strokeWidth={1.5}
            strokeDasharray="5 3"
          />

          {/* Right axis labels */}
          {priceLabels.map(({ price, y }, i) => (
            <SvgText
              key={i}
              x={CANDLE_AREA_W + 6}
              y={y + 4}
              fontSize={9}
              fill={Colors.textMuted}
              fontFamily="DMSans_400Regular"
            >
              {price.toFixed(0)}
            </SvgText>
          ))}

          {/* Current price label */}
          <Rect
            x={CANDLE_AREA_W}
            y={cpY - 9}
            width={LABEL_WIDTH - 4}
            height={18}
            fill={Colors.bgElevated}
            rx={3}
          />
          <SvgText
            x={CANDLE_AREA_W + LABEL_WIDTH / 2 - 2}
            y={cpY + 5}
            fontSize={10}
            fill={Colors.textSecondary}
            fontFamily="DMSans_700Bold"
            textAnchor="middle"
          >
            {currentPrice.toFixed(2)}
          </SvgText>

          {/* SL price label */}
          <Rect
            x={CANDLE_AREA_W}
            y={slY - 9}
            width={LABEL_WIDTH - 4}
            height={18}
            fill={`${Colors.statusRed}30`}
            rx={3}
          />
          <SvgText
            x={CANDLE_AREA_W + LABEL_WIDTH / 2 - 2}
            y={slY + 5}
            fontSize={10}
            fill={Colors.statusRed}
            fontFamily="DMSans_700Bold"
            textAnchor="middle"
          >
            {stopLoss.toFixed(2)}
          </SvgText>

          {/* TP price label */}
          <Rect
            x={CANDLE_AREA_W}
            y={tpY - 9}
            width={LABEL_WIDTH - 4}
            height={18}
            fill={`${Colors.statusGreen}30`}
            rx={3}
          />
          <SvgText
            x={CANDLE_AREA_W + LABEL_WIDTH / 2 - 2}
            y={tpY + 5}
            fontSize={10}
            fill={Colors.statusGreen}
            fontFamily="DMSans_700Bold"
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
              left: CANDLE_AREA_W - HANDLE_RADIUS - 8,
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
              left: CANDLE_AREA_W - HANDLE_RADIUS - 8,
            },
          ]}
          hitSlop={{ top: DRAG_HIT_SLOP, bottom: DRAG_HIT_SLOP, left: 16, right: 16 }}
        >
          <View style={styles.handleInnerTp} />
          <Text style={styles.handleLabelTp}>TP</Text>
        </View>
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
    fontFamily: 'DMSans_700Bold',
    color: Colors.accentPrimary,
  },
  chartContainer: {
    position: 'relative',
    width: CHART_WIDTH,
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
    fontFamily: 'DMSans_700Bold',
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
