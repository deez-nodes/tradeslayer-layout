import { AlertTriangle, Info, AlertCircle, type LucideIcon } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { Colors } from '@/constants/colors';
import { Panel, SectionLabel, PillBadge, ProgressBar } from '@/components/ui';
import { PriceChart } from '@/components/chart/PriceChart';

/** Market regime banner (Layer 0) — color-coded by session.regime. */
function RegimeBadge() {
  const { session } = useSession();

  const regimeColors: Record<string, string> = {
    TRENDING: Colors.statusGreen,
    RANGING: Colors.statusBlue,
    VOLATILE: Colors.statusYellow,
    CHOPPY: Colors.statusRed,
  };

  const color = regimeColors[session.regime] ?? Colors.textMuted;

  return (
    <div
      className="flex h-16 flex-col justify-center gap-1 rounded-[10px] border px-4"
      style={{ borderColor: `${color}40`, backgroundColor: `${color}12` }}
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-lg font-bold tracking-[0.083em]" style={{ color }}>
          {session.regime}
        </span>
        <span className="flex-1" />
        <span className="font-mono text-[13px] font-medium text-fg-dim">ADX {session.adx}</span>
        <span className="h-3 w-px" style={{ backgroundColor: Colors.borderDefault }} />
        <span className="font-mono text-[13px] font-medium text-fg-dim">H {session.hurst}</span>
      </div>
      <span className="text-[11px] tracking-[0.025em] text-fg-mute">Market Regime · Layer 0</span>
    </div>
  );
}

/** A single market-context metric tile. */
function ContextTile({
  label,
  value,
  subtitle,
  trend = 'neutral',
}: {
  label: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const trendColor =
    trend === 'up'
      ? Colors.statusGreen
      : trend === 'down'
        ? Colors.statusRed
        : Colors.textSecondary;

  return (
    <div className="flex h-[76px] flex-col justify-between rounded-[10px] border border-line bg-panel p-3">
      <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">{label}</span>
      <span className="font-mono text-[17px] font-bold text-fg">{value}</span>
      <span className="text-[11px]" style={{ color: trendColor }}>
        {subtitle}
      </span>
    </div>
  );
}

type Signal = {
  label: string;
  value: string;
  status: 'bull' | 'bear' | 'neutral';
};

const signals: Signal[] = [
  { label: 'CVD', value: '+2.4K', status: 'bull' },
  { label: 'MACD', value: 'bull', status: 'bull' },
  { label: 'CCI', value: '72', status: 'bull' },
  { label: 'Z-Score', value: '-0.3', status: 'neutral' },
  { label: 'RSI', value: '58', status: 'neutral' },
  { label: 'Vol', value: 'High', status: 'bull' },
];

/** Horizontal strip of indicator chips (Layer 2). */
function SignalStrip() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <SectionLabel>SIGNALS · LAYER 2</SectionLabel>
        <PillBadge label="SIMULATED" tone="muted" />
      </div>
      <div className="flex gap-2 overflow-x-auto pr-1">
        {signals.map((sig) => {
          const color =
            sig.status === 'bull'
              ? Colors.statusGreen
              : sig.status === 'bear'
                ? Colors.statusRed
                : Colors.textMuted;
          return (
            <div
              key={sig.label}
              className="flex min-w-[64px] flex-col items-center gap-0.5 rounded-lg border bg-panel px-2.5 py-1.5"
              style={{ borderColor: `${color}40` }}
            >
              <span className="text-[10px] font-medium tracking-[0.08em] text-fg-mute">{sig.label}</span>
              <span className="font-mono text-[13px] font-bold" style={{ color }}>
                {sig.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Session P&L vs daily goal with progress bar. */
function SessionBar() {
  const { session } = useSession();
  const progress = Math.max(0, Math.min(session.pnl / session.dailyGoal, 1));
  const isPositive = session.pnl >= 0;
  const color =
    session.pnl >= session.dailyGoal
      ? Colors.statusBlue
      : session.pnl < 0
        ? Colors.statusRed
        : Colors.statusGreen;

  return (
    <div className="flex flex-col gap-2 rounded-[10px] border border-line bg-panel p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">SESSION</span>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-lg font-bold" style={{ color }}>
            {isPositive ? '+' : ''}${session.pnl}
          </span>
          <span className="text-xs text-fg-dim">{session.trades.length} trades</span>
        </div>
      </div>
      <ProgressBar value={progress} color={color} height={5} />
      <span className="text-right text-[11px] text-fg-mute">Goal: ${session.dailyGoal}</span>
    </div>
  );
}

/** Compact tilt meter (0–100) with status label. */
function TiltMeterCompact() {
  const { session } = useSession();
  const score = session.tiltScore;
  const progress = score / 100;
  const color =
    score < 30 ? Colors.statusGreen : score < 60 ? Colors.statusYellow : Colors.statusRed;
  const status = score < 30 ? 'CLEAR' : score < 60 ? 'CAUTION' : 'DANGER';

  return (
    <div className="flex flex-col gap-2 rounded-[10px] border border-line bg-panel p-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">TILT</span>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {score}/100
        </span>
        <span className="flex-1" />
        <span className="text-[11px] font-medium tracking-[0.08em]" style={{ color }}>
          {status}
        </span>
      </div>
      <ProgressBar value={progress} color={color} height={4} />
    </div>
  );
}

type Alert = {
  id: string;
  type: 'warning' | 'info' | 'caution';
  message: string;
};

const alerts: Alert[] = [
  { id: '1', type: 'warning', message: 'H&S forming on 15m' },
  { id: '2', type: 'info', message: 'Pearson corr SPY: 0.91' },
  { id: '3', type: 'caution', message: 'TRIN 1.4 — breadth weak' },
  { id: '4', type: 'info', message: 'VWAP reclaim confirmed' },
];

const alertConfig: Record<Alert['type'], { color: string; Icon: LucideIcon }> = {
  warning: { color: Colors.statusYellow, Icon: AlertTriangle },
  info: { color: Colors.statusBlue, Icon: Info },
  caution: { color: Colors.statusRed, Icon: AlertCircle },
};

/** Demo discipline/market alert feed. */
function AlertFeed() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <SectionLabel>ALERTS</SectionLabel>
        <PillBadge label="SIMULATED" tone="muted" />
      </div>
      <div className="flex flex-col gap-1.5">
        {alerts.map((alert) => {
          const { color, Icon } = alertConfig[alert.type];
          return (
            <div
              key={alert.id}
              className="flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2.5"
              style={{ borderLeftColor: color, borderLeftWidth: 3 }}
            >
              <Icon size={13} color={color} className="shrink-0" />
              <span className="flex-1 text-[13px] text-fg-dim">{alert.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Market-context grid (Layer 1) — hardcoded demo values. */
function ContextGrid() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <SectionLabel>CONTEXT · LAYER 1</SectionLabel>
        <PillBadge label="SIMULATED" tone="muted" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <ContextTile label="VWAP" value="5,214.50" subtitle="▲ Above" trend="up" />
        <ContextTile label="IV / RV" value="0.87" subtitle="Compressed" trend="neutral" />
        <ContextTile label="POC" value="5,208.25" subtitle="Prev Session" trend="neutral" />
        <ContextTile label="ATR" value="12.5" subtitle="Normal" trend="neutral" />
      </div>
    </div>
  );
}

export function Dashboard() {
  const { session } = useSession();

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-fg">Dashboard</h1>
      </div>

      <Panel className="p-4">
        <PriceChart symbol={session.instrument} height={380} />
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <RegimeBadge />
          <ContextGrid />
          <SignalStrip />
        </div>
        <div className="flex flex-col gap-4">
          <SessionBar />
          <TiltMeterCompact />
          <AlertFeed />
        </div>
      </div>
    </div>
  );
}
