import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, createTextWatermark } from 'lightweight-charts';
import { chartBaseOptions, candleOptions, generateCandles } from './chartTheme';
import { instrumentInfo } from '@/constants/instruments';

/**
 * Read-only candlestick price chart (dashboard hero). Created once per symbol
 * in a layout effect; `autoSize` fills the panel via ResizeObserver; cleaned up
 * with `chart.remove()`. Data is labeled-SIMULATED demo OHLC.
 */
export function PriceChart({ symbol, height = 360 }: { symbol: string; height?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chart = createChart(el, chartBaseOptions);
    const series = chart.addSeries(CandlestickSeries, candleOptions);
    series.setData(generateCandles(instrumentInfo(symbol).price));
    createTextWatermark(chart.panes()[0], {
      horzAlign: 'center',
      vertAlign: 'center',
      lines: [{ text: `${symbol} · SIMULATED`, color: 'rgba(100,116,139,0.16)', fontSize: 34, fontStyle: 'bold' }],
    });
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [symbol]);

  return <div ref={ref} style={{ height, width: '100%' }} />;
}
