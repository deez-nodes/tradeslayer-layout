/**
 * The TradeSlayer palette. Also expressed as Tailwind theme tokens in
 * index.css (canvas/panel/line/fg + up/down/warn/info); this object is for
 * inline/dynamic colors (status-driven text, chart series, price lines).
 */
export const Colors = {
  bgPrimary: '#0a0e1a',
  bgCard: '#111827',
  bgCardHover: '#1a2236',
  bgElevated: '#1e293b',

  borderDefault: '#1e293b',
  borderSubtle: '#162032',
  borderFocus: '#00e5a0',

  accentPrimary: '#00e5a0',
  accentPrimaryDim: 'rgba(0,229,160,0.2)',

  statusGreen: '#00e5a0',
  statusYellow: '#f5a623',
  statusRed: '#ef4444',
  statusBlue: '#3b82f6',

  catTrend: '#3b82f6',
  catMomentum: '#8b5cf6',
  catMeanRev: '#f5a623',
  catBreakout: '#00e5a0',

  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
};

export default Colors;
