import type {
  DeepPartial,
  ChartOptions,
  CandlestickSeriesPartialOptions,
  CandlestickData,
  UTCTimestamp,
} from 'lightweight-charts';
import { Colors } from '@/constants/colors';

/** Dark chart chrome matching the TradeSlayer terminal palette. */
export const chartBaseOptions: DeepPartial<ChartOptions> = {
  autoSize: true,
  layout: {
    background: { color: 'transparent' },
    textColor: Colors.textMuted,
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    attributionLogo: false,
  },
  grid: {
    vertLines: { color: Colors.borderSubtle },
    horzLines: { color: Colors.borderSubtle },
  },
  rightPriceScale: { borderColor: Colors.borderDefault },
  timeScale: { borderColor: Colors.borderDefault, timeVisible: true, secondsVisible: false },
};

export const candleOptions: CandlestickSeriesPartialOptions = {
  upColor: Colors.statusGreen,
  downColor: Colors.statusRed,
  borderUpColor: Colors.statusGreen,
  borderDownColor: Colors.statusRed,
  wickUpColor: Colors.statusGreen,
  wickDownColor: Colors.statusRed,
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Deterministic demo OHLC seeded from the instrument price — stable per symbol
 * (no flicker on re-render/StrictMode), clearly labeled SIMULATED in the UI.
 * Times are UTCTimestamp seconds, strictly ascending & unique (per the v5
 * data-model foot-gun).
 */
export function generateCandles(
  seedPrice: number,
  count = 120,
  stepSec = 60,
): CandlestickData<UTCTimestamp>[] {
  let s = Math.floor(seedPrice * 100) % 2147483647;
  if (s <= 0) s += 2147483646;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;

  const nowSec = Math.floor(Date.now() / 1000);
  const start = nowSec - count * stepSec;
  const vol = seedPrice * 0.0012;
  let price = seedPrice * 0.995;

  const out: CandlestickData<UTCTimestamp>[] = [];
  for (let i = 0; i < count; i++) {
    const open = price;
    const close = Math.max(0.01, open + (rand() - 0.48) * vol);
    const high = Math.max(open, close) + rand() * vol * 0.6;
    const low = Math.min(open, close) - rand() * vol * 0.6;
    out.push({
      time: (start + i * stepSec) as UTCTimestamp,
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
    });
    price = close;
  }
  return out;
}
