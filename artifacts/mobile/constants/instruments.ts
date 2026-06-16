/**
 * Per-instrument reference data: indicative last price, typical avg win/loss
 * (per lot, in dollars), and round-turn commission per lot.
 *
 * Centralizes what used to be scattered/constant: OrderContext's single
 * MOCK_PRICE (5214.5 for every symbol) and CommissionCalc's local tables.
 * avgLoss defaults to avgWin (a ~1:1 baseline) — real edge comes from R:R > 1,
 * and this baseline reproduces the spec's "Break-even WR ≈ 52%" for MES.
 */
export type InstrumentInfo = {
  symbol: string;
  /** Indicative current price (no live feed wired yet). */
  price: number;
  /** Typical winning trade size, $ per lot. */
  avgWin: number;
  /** Typical losing trade size, $ per lot. */
  avgLoss: number;
  /** Round-turn commission + fees, $ per lot. */
  rtCostPerLot: number;
};

export const INSTRUMENTS: Record<string, InstrumentInfo> = {
  MES: { symbol: 'MES', price: 5214.5, avgWin: 83, avgLoss: 83, rtCostPerLot: 4 },
  ES: { symbol: 'ES', price: 5214.5, avgWin: 415, avgLoss: 415, rtCostPerLot: 4 },
  NQ: { symbol: 'NQ', price: 18500, avgWin: 800, avgLoss: 800, rtCostPerLot: 4 },
  MNQ: { symbol: 'MNQ', price: 18500, avgWin: 80, avgLoss: 80, rtCostPerLot: 4 },
  RTY: { symbol: 'RTY', price: 2100, avgWin: 500, avgLoss: 500, rtCostPerLot: 4 },
  YM: { symbol: 'YM', price: 39800, avgWin: 430, avgLoss: 430, rtCostPerLot: 4 },
};

export const INSTRUMENT_SYMBOLS = Object.keys(INSTRUMENTS);

export function instrumentInfo(symbol: string): InstrumentInfo {
  return INSTRUMENTS[symbol] ?? INSTRUMENTS.MES;
}

export function instrumentPrice(symbol: string): number {
  return instrumentInfo(symbol).price;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Default order levels around an instrument's price (proportional, so they
 * scale sensibly from MES to NQ/YM rather than using fixed MES-sized points). */
export function defaultLevels(symbol: string) {
  const p = instrumentPrice(symbol);
  return {
    limitPrice: round2(p),
    stopPrice: round2(p * 0.999),
    stopLoss: round2(p * 0.9977),
    takeProfit: round2(p * 1.004),
  };
}
