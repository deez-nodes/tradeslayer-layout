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
    name: 'Pullback To EMA',
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
    name: 'Stop Run Acceleration',
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
    name: 'Momentum Scalping',
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
    name: 'Support & Resistance Fade',
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
    name: 'Session Volume Profile Bounce',
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
  {
    id: '7',
    name: 'Absorption Exhaustion Spoof',
    subtitle: 'Identify passive absorption and spoofing orders on tape',
    category: 'Momentum',
    timeframes: ['Scalp'],
    risk: 'Medium',
    description: 'Trade reversals when passive orders absorb aggressive flow at critical levels, coupled with spoofing shifts.',
    tier1: [
      { label: 'Heavy volume at level without price progression', checked: true },
      { label: 'Large passive orders appearing on Bookmap', checked: true },
      { label: 'Exhaustion on aggressive market orders', checked: false },
    ],
    tier2: [
      { label: 'No key level nearby', weight: 1, active: false },
      { label: 'High market velocity against the setup', weight: 2, active: false },
    ],
    tier3: [
      { label: 'Enter upon passive absorb confirmation', checked: false },
      { label: 'Tight stop behind absorb wall', checked: false },
    ],
  },
  {
    id: '8',
    name: 'Cumulative Volume Delta',
    subtitle: 'Spot aggressive buyer/seller divergences on CVD',
    category: 'Momentum',
    timeframes: ['Scalp', 'Intraday'],
    risk: 'Low',
    description: 'Leverage net aggressive transaction flow to identify breakouts and trend strength.',
    tier1: [
      { label: 'Price makes new high but CVD lower high', checked: true },
      { label: 'Price makes new low but CVD higher low', checked: true },
      { label: 'CVD slope aligns with price direction', checked: true },
    ],
    tier2: [
      { label: 'Flat volume profile', weight: 1, active: false },
      { label: 'Late session low participation', weight: 2, active: false },
    ],
    tier3: [
      { label: 'Enter on divergence confirmation', checked: false },
      { label: 'Stop below divergence swing', checked: false },
    ],
  },
  {
    id: '9',
    name: 'Iceberg Order Strategy',
    subtitle: 'Identify and trade alongside hidden institutional block orders',
    category: 'Mean Rev',
    timeframes: ['Scalp', 'Intraday'],
    risk: 'Low',
    description: 'Detect hidden liquidity clusters and trade in the direction of institutional limit order blocks.',
    tier1: [
      { label: 'Hidden size detected on tape', checked: true },
      { label: 'Passive iceberg buy/sell delta divergence', checked: true },
      { label: 'Repeated executions at price level', checked: false },
    ],
    tier2: [
      { label: 'Thin liquidity environment', weight: 1, active: false },
      { label: 'High volatility news event', weight: 2, active: false },
    ],
    tier3: [
      { label: 'Enter directly in front of iceberg', checked: false },
      { label: 'Stop below iceberg block level', checked: false },
    ],
  },
  {
    id: '10',
    name: 'Volume Imbalance',
    subtitle: 'Spot structural gaps and imbalances on footprint charts',
    category: 'Trend',
    timeframes: ['Scalp'],
    risk: 'Medium',
    description: 'Locate aggressive buyer/seller diagonal imbalances on footprint and trade their breakouts.',
    tier1: [
      { label: 'Diagonal bid/ask ratio > 400%', checked: true },
      { label: 'Imbalance zone retested successfully', checked: true },
      { label: 'Volume spike on imbalance creation', checked: false },
    ],
    tier2: [
      { label: 'Sideways consolidation phase', weight: 1, active: false },
      { label: 'Low participant count', weight: 1, active: false },
    ],
    tier3: [
      { label: 'Enter on retest of imbalance zone', checked: false },
      { label: 'Stop below imbalance candle', checked: false },
    ],
  },
  {
    id: '11',
    name: 'Large Lots Tracker',
    subtitle: 'Monitor aggressive block trades of institutional size',
    category: 'Trend',
    timeframes: ['Intraday'],
    risk: 'Low',
    description: 'Track real-time institutional activity and align with heavy institutional aggressors.',
    tier1: [
      { label: 'Market orders > 25 lots executing', checked: true },
      { label: 'Directional bias in block trades', checked: true },
    ],
    tier2: [
      { label: 'Low volume session overall', weight: 2, active: false },
    ],
    tier3: [
      { label: 'Enter in block direction', checked: false },
      { label: 'Stop below block cluster low', checked: false },
    ],
  },
  {
    id: '12',
    name: 'Liquidity Regime',
    subtitle: 'Map liquidity distribution to determine optimal tactics',
    category: 'Trend',
    timeframes: ['Intraday', 'Swing'],
    risk: 'Low',
    description: 'Evaluate depth of market liquidity and passive book layout to classify market states.',
    tier1: [
      { label: 'Liquidity depth meets target percentile', checked: true },
      { label: 'Ranging or trending regime identified', checked: true },
    ],
    tier2: [
      { label: 'Unstable liquidity depth variance', weight: 1, active: false },
    ],
    tier3: [
      { label: 'Enter aligned with regime classification', checked: false },
      { label: 'Stop outside high liquidity nodes', checked: false },
    ],
  },
  {
    id: '13',
    name: 'Liquidity Tracker Pro',
    subtitle: 'Real-time depth and passive order book tracker',
    category: 'Mean Rev',
    timeframes: ['Scalp', 'Intraday'],
    risk: 'Medium',
    description: 'Leverage professional order book depth tracking to gauge buy/sell pressure and target blocks.',
    tier1: [
      { label: 'Order book imbalance ratio > 2:1', checked: true },
      { label: 'Heavy liquidity blocks defending level', checked: true },
    ],
    tier2: [
      { label: 'Highly active news catalyst', weight: 3, active: false },
    ],
    tier3: [
      { label: 'Enter long at high liquidity block support', checked: false },
      { label: 'Stop below passive block support', checked: false },
    ],
  },
  {
    id: '14',
    name: 'Volume Bubbles',
    subtitle: 'Spot high volume transaction bubbles on sub-minute charts',
    category: 'Breakout',
    timeframes: ['Scalp'],
    risk: 'High',
    description: 'Locate massive transactional volume clusters on tape and trade breakouts of those specific ranges.',
    tier1: [
      { label: 'Volume bubble size exceeds threshold', checked: true },
      { label: 'Breakout of volume bubble high/low', checked: true },
    ],
    tier2: [
      { label: 'Low volatility overnight session', weight: 1, active: false },
    ],
    tier3: [
      { label: 'Enter on bubble breakout retest', checked: false },
      { label: 'Stop opposite side of bubble cluster', checked: false },
    ],
  },
];
