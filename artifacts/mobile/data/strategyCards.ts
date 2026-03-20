export type StrategyCard = {
  id: string;
  name: string;
  subtitle: string;
  category: 'Trend' | 'Momentum' | 'Mean Rev' | 'Breakout';
  timeframes: string[];
  risk: 'Low' | 'Medium' | 'High';
  description: string;
  tier1: { label: string; checked: boolean }[];
  tier2: { label: string; weight: number; active: boolean }[];
  tier3: { label: string; checked: boolean }[];
};

export const strategyCards: StrategyCard[] = [
  {
    id: '1',
    name: 'Trend Continuation',
    subtitle: 'Scalp within confirmed trend direction',
    category: 'Trend',
    timeframes: ['Intraday', 'Swing'],
    risk: 'Low',
    description: 'Enter pullbacks to EMA within a confirmed trend. Requires regime alignment and volume confirmation.',
    tier1: [
      { label: 'EMAs stacked in direction', checked: true },
      { label: 'Higher TF aligned', checked: true },
      { label: 'Volume > 60th percentile', checked: false },
      { label: 'Thesis conviction identified', checked: true },
    ],
    tier2: [
      { label: 'No fundamental thesis', weight: 2, active: false },
      { label: 'Counter-trend on daily', weight: 1, active: false },
      { label: 'First 15 min of session', weight: 1, active: false },
      { label: 'Last trade was a loss', weight: 1, active: false },
    ],
    tier3: [
      { label: 'Enter on pullback to EMA', checked: false },
      { label: 'Stop below structure', checked: false },
      { label: 'Scale: half at entry', checked: false },
      { label: 'First target prior swing', checked: false },
      { label: 'Trail runner above VWAP', checked: false },
    ],
  },
  {
    id: '2',
    name: 'Liquidity Sweep Reversal',
    subtitle: 'Enter after sweep + reclaim of level',
    category: 'Mean Rev',
    timeframes: ['Scalp', 'Intraday'],
    risk: 'High',
    description: 'Anticipate false breakouts below key levels. Enter long after reclaim of swept level with velocity.',
    tier1: [
      { label: 'Key level clearly defined', checked: true },
      { label: 'Sweep on high volume', checked: true },
      { label: 'Reclaim confirmed', checked: true },
      { label: 'CVD divergence present', checked: false },
    ],
    tier2: [
      { label: 'Trending market (no reversal context)', weight: 2, active: false },
      { label: 'High tilt score', weight: 2, active: false },
      { label: 'Within 30min of open', weight: 1, active: false },
    ],
    tier3: [
      { label: 'Enter above reclaimed level', checked: false },
      { label: 'Stop below sweep low', checked: false },
      { label: 'Target next liquidity pool', checked: false },
      { label: 'Exit half at structure', checked: false },
    ],
  },
  {
    id: '3',
    name: 'Opening Range Breakout',
    subtitle: 'Trade breakout of first 30min range',
    category: 'Breakout',
    timeframes: ['Scalp', 'Intraday'],
    risk: 'Medium',
    description: 'Defined opening range. Enter breakout with confirmation. Best on trend days with clear bias.',
    tier1: [
      { label: 'Clear 30-min range defined', checked: true },
      { label: 'News/catalyst present', checked: false },
      { label: 'Pre-market direction clear', checked: true },
      { label: 'ATR within normal range', checked: true },
    ],
    tier2: [
      { label: 'Choppy overnight session', weight: 1, active: false },
      { label: 'Multiple failed breakouts', weight: 2, active: false },
      { label: 'IV > RV (crush risk)', weight: 1, active: false },
    ],
    tier3: [
      { label: 'Wait for clean break + retest', checked: false },
      { label: 'Size for ATR stop', checked: false },
      { label: 'First target measured move', checked: false },
      { label: 'Trail to breakeven at +1R', checked: false },
    ],
  },
  {
    id: '4',
    name: 'VWAP Reclaim',
    subtitle: 'Long after reclaim of VWAP with velocity',
    category: 'Momentum',
    timeframes: ['Scalp'],
    risk: 'Low',
    description: 'Bullish momentum setup. Price reclaims VWAP with strength after dip below.',
    tier1: [
      { label: 'Price below VWAP briefly', checked: true },
      { label: 'Reclaim on strong candle', checked: true },
      { label: 'CVD divergence bullish', checked: true },
      { label: 'Tape shows absorption', checked: false },
    ],
    tier2: [
      { label: 'Daily trend is bearish', weight: 2, active: false },
      { label: 'Multiple VWAP reclaims failed', weight: 1, active: true },
    ],
    tier3: [
      { label: 'Enter above VWAP reclaim candle', checked: false },
      { label: 'Stop below reclaim low', checked: false },
      { label: 'Target prior swing or HOD', checked: false },
    ],
  },
  {
    id: '5',
    name: 'Mean Reversion Fade',
    subtitle: 'Fade extended moves back to mean',
    category: 'Mean Rev',
    timeframes: ['Intraday'],
    risk: 'Medium',
    description: 'Fade parabolic moves. Requires regime to be ranging, not trending. Best with extreme CCI/Z-score.',
    tier1: [
      { label: 'CCI > 100 or < -100', checked: false },
      { label: 'Z-score > 2 or < -2', checked: false },
      { label: 'Regime: ranging', checked: false },
      { label: 'No news catalyst', checked: true },
    ],
    tier2: [
      { label: 'Trending regime active', weight: 3, active: false },
      { label: 'ADX > 25', weight: 2, active: false },
    ],
    tier3: [
      { label: 'Enter at Bollinger band extremes', checked: false },
      { label: 'Tight stop above/below extreme', checked: false },
      { label: 'Target VWAP or midline', checked: false },
    ],
  },
  {
    id: '6',
    name: 'POC Bounce',
    subtitle: 'Bounce from prior day Point of Control',
    category: 'Trend',
    timeframes: ['Intraday', 'Swing'],
    risk: 'Low',
    description: 'High-probability bounce from prior session POC. Works best in trending regimes with HTF confluence.',
    tier1: [
      { label: 'Price at prior day POC', checked: true },
      { label: 'HTF structure supports bounce', checked: true },
      { label: 'Volume cluster visible', checked: false },
      { label: 'No counter structure nearby', checked: true },
    ],
    tier2: [
      { label: 'POC already tested twice today', weight: 2, active: false },
      { label: 'News pending', weight: 1, active: false },
    ],
    tier3: [
      { label: 'Enter at POC with limit order', checked: false },
      { label: 'Stop 2 ATR below POC', checked: false },
      { label: 'Target session high/low', checked: false },
    ],
  },
];
