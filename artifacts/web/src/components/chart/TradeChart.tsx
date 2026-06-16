import { useEffect, useRef } from 'react';
import {
  createChart,
  CandlestickSeries,
  createTextWatermark,
  LineStyle,
  type ISeriesApi,
  type IPriceLine,
} from 'lightweight-charts';
import { chartBaseOptions, candleOptions, generateCandles } from './chartTheme';
import { instrumentInfo } from '@/constants/instruments';
import { useOrder } from '@/context/OrderContext';
import { Colors } from '@/constants/colors';

/**
 * Order-bound candlestick chart for the Trade screen. Renders the SL / TP /
 * entry levels as chart price lines, kept in sync with the order ticket inputs.
 * (Drag-the-line-on-chart is a fast-follow; levels are set via the inputs.)
 */
export function TradeChart({ height = 420 }: { height?: number }) {
  const { symbol, currentPrice, orderType, limitPrice, stopLoss, takeProfit } = useOrder();
  const ref = useRef<HTMLDivElement | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const linesRef = useRef<IPriceLine[]>([]);

  // Create chart + series; regenerate demo candles when the symbol changes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chart = createChart(el, chartBaseOptions);
    const series = chart.addSeries(CandlestickSeries, candleOptions);
    series.setData(generateCandles(instrumentInfo(symbol).price));
    createTextWatermark(chart.panes()[0], {
      horzAlign: 'center',
      vertAlign: 'center',
      lines: [{ text: 'SIMULATED', color: 'rgba(100,116,139,0.14)', fontSize: 30, fontStyle: 'bold' }],
    });
    chart.timeScale().fitContent();
    seriesRef.current = series;
    linesRef.current = [];
    return () => {
      seriesRef.current = null;
      linesRef.current = [];
      chart.remove();
    };
  }, [symbol]);

  // Sync the SL / TP / entry price lines with the order inputs.
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    linesRef.current.forEach((l) => series.removePriceLine(l));
    const entry = orderType === 'market' ? currentPrice : limitPrice;
    linesRef.current = [
      series.createPriceLine({ price: entry, color: Colors.statusBlue, lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: 'ENTRY' }),
      series.createPriceLine({ price: stopLoss, color: Colors.statusRed, lineWidth: 1, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: 'SL' }),
      series.createPriceLine({ price: takeProfit, color: Colors.statusGreen, lineWidth: 1, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: 'TP' }),
    ];
  }, [orderType, currentPrice, limitPrice, stopLoss, takeProfit, symbol]);

  return <div ref={ref} style={{ height, width: '100%' }} />;
}
