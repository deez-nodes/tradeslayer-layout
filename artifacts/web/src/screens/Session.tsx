import { useEffect, useMemo, useState } from 'react';
import {
  RefreshCcw,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Circle,
  XCircle,
  Activity,
  CornerDownRight,
  AlertOctagon,
  StopCircle,
  Info,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSession, type SessionStatus } from '@/context/SessionContext';
import { INSTRUMENT_SYMBOLS, instrumentInfo } from '@/constants/instruments';
import { Colors } from '@/constants/colors';
import { Panel, ProgressBar, Stat } from '@/components/ui';
import { cn } from '@/lib/cn';

// ── SessionPnl ──────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { color: string; badge: string | null }> = {
  active: { color: Colors.statusGreen, badge: null },
  at_goal: { color: Colors.statusBlue, badge: 'AT GOAL — consider stopping' },
  giving_back: { color: Colors.statusYellow, badge: 'GIVING BACK — protect the day' },
  max_loss: { color: Colors.statusRed, badge: 'MAX LOSS — session over' },
  stopped: { color: Colors.textMuted, badge: 'SESSION ENDED' },
};

function SessionPnl() {
  const { session } = useSession();
  const { pnl, peakPnl, trades, dailyGoal, maxTrades, sessionStatus } = session;

  const isPositive = pnl >= 0;
  const { color: accentColor, badge } = STATUS_META[sessionStatus] ?? STATUS_META.active;
  const progress = Math.max(0, Math.min(pnl / dailyGoal, 1));

  return (
    <Panel
      className="flex flex-col gap-2.5 p-5"
      style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}0a` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">
          SESSION P&L
        </span>
        {badge && (
          <span
            className="rounded-md border px-1.5 py-0.5 text-[9px] font-medium tracking-[0.05em]"
            style={{
              color: accentColor,
              backgroundColor: `${accentColor}20`,
              borderColor: `${accentColor}50`,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <span className="font-mono text-[40px] font-bold leading-[44px]" style={{ color: accentColor }}>
        {isPositive ? '+' : ''}${pnl}
      </span>
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-fg-dim">Peak: ${peakPnl}</span>
        <span className="h-2.5 w-px bg-line" />
        <span className="text-xs text-fg-dim">
          Trades: {trades.length}/{maxTrades}
        </span>
        <span className="h-2.5 w-px bg-line" />
        <span className="text-xs text-fg-dim">Goal: ${dailyGoal}</span>
      </div>
      <ProgressBar value={progress} color={accentColor} height={6} />
    </Panel>
  );
}

// ── TiltMeterFull ───────────────────────────────────────────────────────────

function TiltMeterFull() {
  const { session } = useSession();
  const score = session.tiltScore;
  const { consecLosses, givingBack, fastReentry } = session.tiltDrivers;
  const color =
    score < 30 ? Colors.statusGreen : score < 60 ? Colors.statusYellow : Colors.statusRed;
  const label = score < 30 ? 'Green — Clear to trade' : score < 60 ? 'Caution' : 'Danger — Stop';

  const driverColor = (bad: boolean) => (bad ? Colors.statusRed : Colors.statusGreen);

  return (
    <Panel className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">
          TILT SCORE
        </span>
        <span
          className="flex items-center gap-1.5 rounded-full border px-2 py-[3px]"
          style={{ backgroundColor: `${color}20`, borderColor: `${color}50` }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[11px] font-medium" style={{ color }}>
            {label}
          </span>
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-mono text-[48px] font-bold leading-[52px]" style={{ color }}>
          {score}
        </span>
        <span className="text-xl text-fg-mute">/100</span>
      </div>

      <ProgressBar value={score / 100} color={color} height={8} />

      <div className="mt-1 flex justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-fg-mute">Consec Losses</span>
          <span className="font-mono text-sm font-bold" style={{ color: driverColor(consecLosses > 0) }}>
            {consecLosses}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-fg-mute">Giving Back</span>
          <span className="font-mono text-sm font-bold" style={{ color: driverColor(givingBack) }}>
            {givingBack ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-fg-mute">Fast Reentry</span>
          <span className="font-mono text-sm font-bold" style={{ color: driverColor(fastReentry) }}>
            {fastReentry ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </Panel>
  );
}

// ── ReentryCountdown ────────────────────────────────────────────────────────

const TOTAL_SECONDS = 120;

function ReentryCountdown() {
  const { session, startReentryCountdown, overrideReentry } = useSession();
  const { reentryCountdown } = session;

  if (reentryCountdown === null) {
    return (
      <button
        type="button"
        onClick={startReentryCountdown}
        className="flex items-center gap-2 rounded-xl border border-line bg-panel p-3.5 text-left transition-colors hover:bg-panel-hi"
      >
        <Clock size={14} color={Colors.textMuted} />
        <span className="text-xs text-fg-mute">Reentry timer — tap to start</span>
      </button>
    );
  }

  const mins = Math.floor(reentryCountdown / 60);
  const secs = reentryCountdown % 60;
  const progress = reentryCountdown / TOTAL_SECONDS;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div
      className="flex flex-col gap-2.5 rounded-xl border bg-panel p-3.5"
      style={{ borderColor: `${Colors.statusYellow}40` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">
          REENTRY COUNTDOWN
        </span>
        <span className="font-mono text-[22px] font-bold" style={{ color: Colors.statusYellow }}>
          {timeStr}
        </span>
      </div>
      <ProgressBar value={progress} color={Colors.statusYellow} height={6} />
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-fg-mute">remaining</span>
        <button
          type="button"
          onClick={overrideReentry}
          aria-label="Override reentry cooldown (logged)"
          className="flex items-center gap-1 text-[11px] font-medium text-fg-mute transition-colors hover:text-fg"
        >
          <span>Override (logged)</span>
          <ArrowRight size={12} color={Colors.textMuted} />
        </button>
      </div>
    </div>
  );
}

// ── CommissionCalc ──────────────────────────────────────────────────────────

const GOOD_COST_PCT = 6; // commission drag this share of an avg win or less = healthy

function CommissionCalc() {
  const { session, updateLots, updateInstrument } = useSession();
  const instrument = session.instrument;
  const numLots = Math.max(1, session.lots);

  const [lotsText, setLotsText] = useState(String(numLots));
  useEffect(() => {
    setLotsText(String(Math.max(1, session.lots)));
  }, [session.lots]);

  const info = instrumentInfo(instrument);
  const rtCostTotal = info.rtCostPerLot * numLots;

  // Cost/Win is lot-independent (both commission and win scale with lots):
  // rtCostPerLot / avgWinPerLot. For MES: 4 / 83 = 4.8% (matches spec).
  const costPct = (info.rtCostPerLot / info.avgWin) * 100;

  // Break-even win rate with commission drag, solving
  //   WR·(avgWin − rt) = (1 − WR)·(avgLoss + rt)  ⇒  WR = (avgLoss + rt)/(avgWin + avgLoss).
  // With the ~1:1 baseline (avgLoss ≈ avgWin) this yields ≈52% for MES.
  const breakevenWR = ((info.avgLoss + info.rtCostPerLot) / (info.avgWin + info.avgLoss)) * 100;

  const isGood = costPct <= GOOD_COST_PCT;

  const onLotsChange = (t: string) => {
    setLotsText(t);
    const n = parseInt(t, 10);
    if (!Number.isNaN(n) && n > 0) updateLots(n);
  };

  return (
    <Panel className="flex flex-col gap-3.5 p-4">
      <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">
        COMMISSION CHECK
      </span>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-fg-dim">Lots</span>
          <input
            value={lotsText}
            onChange={(e) => onLotsChange(e.target.value)}
            onBlur={() => setLotsText(String(numLots))}
            inputMode="numeric"
            maxLength={2}
            onFocus={(e) => e.target.select()}
            aria-label="Lots"
            className="w-20 rounded-lg border border-line bg-elevated px-3 py-2 font-mono text-base font-bold text-fg outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-fg-dim">Instrument</span>
          <div className="flex flex-wrap gap-1.5">
            {INSTRUMENT_SYMBOLS.map((ins) => {
              const active = instrument === ins;
              return (
                <button
                  key={ins}
                  type="button"
                  onClick={() => updateInstrument(ins)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-md border px-2.5 py-[5px] text-xs font-medium transition-colors',
                    active
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-line bg-elevated text-fg-mute hover:bg-panel-hi',
                  )}
                >
                  {ins}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[10px] text-fg-mute">RT Cost</span>
          <span className="font-mono text-[15px] font-bold text-fg">${rtCostTotal.toFixed(2)}</span>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[10px] text-fg-mute">Cost/Win</span>
          <span
            className="font-mono text-[15px] font-bold"
            style={{ color: isGood ? Colors.statusGreen : Colors.statusRed }}
          >
            {costPct.toFixed(1)}% {isGood ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[10px] text-fg-mute">BE Win Rate</span>
          <span className="font-mono text-[15px] font-bold text-fg">{breakevenWR.toFixed(0)}%</span>
        </div>
      </div>
    </Panel>
  );
}

// ── GuardrailStatus ─────────────────────────────────────────────────────────

type GuardrailItem = {
  label: string;
  limit: string;
  value: string;
  status: 'ok' | 'warn' | 'danger' | 'neutral';
};

function GuardrailStatus() {
  const { session } = useSession();

  const items: GuardrailItem[] = [
    {
      label: 'Daily goal',
      limit: `$${session.dailyGoal}`,
      value: `$${session.pnl}`,
      status: session.pnl >= session.dailyGoal ? 'ok' : 'neutral',
    },
    {
      label: 'Max loss',
      limit: `$${session.maxLoss}`,
      value: `$${session.pnl}`,
      status: session.pnl <= session.maxLoss ? 'danger' : 'ok',
    },
    {
      label: 'Max trades',
      limit: `${session.maxTrades}`,
      value: `${session.trades.length}/${session.maxTrades}`,
      status: session.trades.length >= session.maxTrades ? 'danger' : 'ok',
    },
    {
      label: 'Max lots',
      limit: `${session.maxLots}`,
      value: `${session.lots}`,
      status: session.lots > session.maxLots ? 'warn' : 'ok',
    },
    {
      label: 'Walk-away',
      limit: '50% of peak',
      value: session.peakPnl > 0 ? `${((session.pnl / session.peakPnl) * 100).toFixed(0)}%` : '—',
      status: session.peakPnl > 0 && session.pnl < session.peakPnl * 0.5 ? 'warn' : 'ok',
    },
  ];

  return (
    <Panel className="flex flex-col gap-3 p-4">
      <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">
        GUARDRAILS
      </span>
      <div className="flex flex-col gap-2.5">
        {items.map((item) => {
          const color =
            item.status === 'ok'
              ? Colors.statusGreen
              : item.status === 'warn'
                ? Colors.statusYellow
                : item.status === 'neutral'
                  ? Colors.textMuted
                  : Colors.statusRed;
          const Icon =
            item.status === 'ok'
              ? CheckCircle
              : item.status === 'warn'
                ? AlertTriangle
                : item.status === 'neutral'
                  ? Circle
                  : XCircle;
          return (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-[100px] text-[13px] text-fg-dim">{item.label}</span>
              <span className="w-[60px] font-mono text-[13px] font-medium text-fg">{item.limit}</span>
              <span className="flex-1" />
              <span className="mr-1 font-mono text-[13px] font-bold" style={{ color }}>
                {item.value}
              </span>
              <Icon size={14} color={color} />
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ── SessionSummary ──────────────────────────────────────────────────────────

const statusBanner: Record<SessionStatus, { color: string; icon: LucideIcon; text: string }> = {
  active: { color: Colors.statusBlue, icon: Activity, text: 'Session in progress' },
  at_goal: { color: Colors.statusGreen, icon: CheckCircle, text: 'Goal reached — consider banking the day' },
  giving_back: { color: Colors.statusYellow, icon: CornerDownRight, text: 'Giving back — protect your profits' },
  max_loss: { color: Colors.statusRed, icon: AlertOctagon, text: 'Max loss hit — stop for the day' },
  stopped: { color: Colors.textMuted, icon: StopCircle, text: 'Session ended' },
};

/**
 * End-of-session rollup (spec's Session Summary). Computes win rate, net P&L,
 * overrides, tilt peak, and commission from the logged trades — the same
 * figures as the Journal's summary — plus a status banner and an End-session
 * action that locks the day (Reset, in the header, starts a fresh session).
 */
function SessionSummary() {
  const { session, endSession } = useSession();

  const stats = useMemo(() => {
    const trades = session.trades;
    const decided = trades.filter((t) => t.pnl !== 0).length;
    const wins = trades.filter((t) => t.pnl > 0).length;
    const winRate = decided > 0 ? Math.round((wins / decided) * 100) : 0;
    const overrides = trades.filter((t) => t.override > 0).length + session.reentryOverrides;
    const tiltPeak = Math.max(session.tiltScore, ...trades.map((t) => t.tilt), 0);
    const commission = trades.reduce(
      (acc, t) => acc + t.lots * instrumentInfo(t.instrument).rtCostPerLot,
      0,
    );
    return { count: trades.length, winRate, overrides, tiltPeak, commission };
  }, [session.trades, session.reentryOverrides, session.tiltScore]);

  const banner = statusBanner[session.sessionStatus];
  const BannerIcon = banner.icon;

  return (
    <Panel className="flex flex-col gap-3 p-4">
      <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">
        SESSION SUMMARY
      </span>

      <div
        className="flex items-center gap-2 rounded-lg border px-3 py-2.5"
        style={{ backgroundColor: `${banner.color}14`, borderColor: `${banner.color}40` }}
      >
        <BannerIcon size={15} color={banner.color} />
        <span className="flex-1 text-[13px] font-medium" style={{ color: banner.color }}>
          {banner.text}
        </span>
      </div>

      <div className="flex justify-between">
        <Stat label="Trades" value={`${stats.count}`} />
        <Stat label="Win Rate" value={`${stats.winRate}%`} color={Colors.statusGreen} />
        <Stat
          label="Net P&L"
          value={`${session.pnl >= 0 ? '+' : ''}$${session.pnl}`}
          color={session.pnl >= 0 ? Colors.statusGreen : Colors.statusRed}
        />
      </div>
      <div className="h-px bg-line" />
      <div className="flex justify-between">
        <Stat
          label="Overrides"
          value={`${stats.overrides}`}
          color={stats.overrides > 0 ? Colors.statusYellow : Colors.textSecondary}
        />
        <Stat
          label="Tilt Peak"
          value={`${stats.tiltPeak}`}
          color={
            stats.tiltPeak > 60
              ? Colors.statusRed
              : stats.tiltPeak > 30
                ? Colors.statusYellow
                : Colors.statusGreen
          }
        />
        <Stat label="Commission" value={`$${stats.commission}`} />
      </div>

      {session.stopped ? (
        <div className="flex items-center gap-1.5">
          <Info size={13} color={Colors.textMuted} />
          <span className="text-xs text-fg-mute">
            Session ended — use Reset above to start a new one.
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={endSession}
          aria-label="End session"
          className="flex items-center justify-center gap-2 rounded-[10px] border border-line bg-canvas py-3 text-[13px] font-medium text-fg-dim transition-colors hover:bg-panel-hi"
        >
          <StopCircle size={15} color={Colors.textSecondary} />
          <span>End Session</span>
        </button>
      )}
    </Panel>
  );
}

// ── Session screen ──────────────────────────────────────────────────────────

export function Session() {
  const { resetSession } = useSession();

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-bold uppercase tracking-[0.1em] text-fg">Session Control</h1>
        <button
          type="button"
          onClick={resetSession}
          aria-label="Reset session"
          className="flex items-center gap-1.5 text-[13px] font-medium text-fg-mute transition-colors hover:text-fg"
        >
          <span>Reset</span>
          <RefreshCcw size={14} color={Colors.textMuted} />
        </button>
      </div>

      <SessionPnl />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TiltMeterFull />
        <ReentryCountdown />
        <CommissionCalc />
        <GuardrailStatus />
        <SessionSummary />
      </div>
    </div>
  );
}
