import { useMemo, useState } from 'react';
import { Filter, BookOpen, CheckCircle } from 'lucide-react';
import { useSession, type Trade } from '@/context/SessionContext';
import { Panel } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { cn } from '@/lib/cn';

type FilterKey = 'all' | 'wins' | 'losses' | 'open' | 'overrides';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'wins', label: 'Wins' },
  { key: 'losses', label: 'Losses' },
  { key: 'open', label: 'Open' },
  { key: 'overrides', label: 'Overrides' },
];

function matchesFilter(t: Trade, f: FilterKey): boolean {
  switch (f) {
    case 'wins':
      return t.pnl > 0;
    case 'losses':
      return t.pnl < 0;
    case 'open':
      return t.pnl === 0;
    case 'overrides':
      return t.override > 0;
    default:
      return true;
  }
}

/** A single logged-trade row (ported from TradeLogEntry.tsx). */
function TradeLogEntry({ trade }: { trade: Trade }) {
  const isWin = trade.pnl > 0;
  const pnlColor = isWin ? Colors.statusGreen : Colors.statusRed;

  return (
    <div className="flex flex-col gap-1.5 rounded-[10px] border border-line bg-panel p-3.5">
      <div className="flex items-center gap-2">
        <span className="min-w-[24px] font-mono text-xs text-fg-mute">#{trade.number}</span>
        <span className="truncate text-sm font-bold text-fg">{trade.strategy}</span>
        <div className="flex-1" />
        <span className="mr-1 text-xs font-medium text-fg-dim">{trade.instrument}</span>
        <span className="font-mono text-base font-bold" style={{ color: pnlColor }}>
          {isWin ? '+' : ''}${trade.pnl}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[11px] text-fg-mute">{trade.time}</span>
        <span className="text-[11px] text-fg-mute">·</span>
        <span className="font-mono text-[11px] text-fg-mute">{trade.duration}</span>
        <span className="text-[11px] text-fg-mute">·</span>
        <span className="font-mono text-[11px] text-fg-mute">{trade.lots} lots</span>
      </div>

      <div className="mt-0.5 flex items-center gap-2.5">
        <span className="font-mono text-[11px] text-fg-mute">Tilt: {trade.tilt}</span>
        <span className="font-mono text-[11px] text-fg-mute">Override: {trade.override}</span>
        <div className="flex-1" />
        <div
          className="rounded-md px-2 py-0.5"
          style={{ backgroundColor: isWin ? `${Colors.statusGreen}20` : `${Colors.statusRed}20` }}
        >
          <span className="text-[11px] font-medium" style={{ color: pnlColor }}>
            {trade.exitType}
          </span>
        </div>
      </div>
    </div>
  );
}

const DAYS = ['M', 'T', 'W', 'T', 'F'];

type Heat = 'green' | 'yellow' | 'red' | 'empty';

const heatColors: Record<Heat, string> = {
  green: Colors.statusGreen,
  yellow: Colors.statusYellow,
  red: Colors.statusRed,
  empty: Colors.borderDefault,
};

/** Map an epoch to a Mon–Fri column index (0–4), or -1 for the weekend. */
function weekdayIndex(epoch: number): number {
  const d = new Date(epoch).getDay(); // 0 Sun … 6 Sat
  return d >= 1 && d <= 5 ? d - 1 : -1;
}

/**
 * Weekly P&L heat map, derived from the logged trades (no hardcoded values).
 * Trades are bucketed by the weekday of their timestamp and each day is colored
 * by its net P&L: green (up), red (down), yellow (scratch), empty (no trades).
 * Storage holds the current session only, so in practice this lights up today's
 * column — the structure is ready for multi-day history.
 */
function WeeklyHeatMap() {
  const { session } = useSession();

  const heat = useMemo<Heat[]>(() => {
    const net = [0, 0, 0, 0, 0];
    const count = [0, 0, 0, 0, 0];
    for (const t of session.trades) {
      const idx = weekdayIndex(t.at ?? Date.now());
      if (idx < 0) continue;
      net[idx] += t.pnl;
      count[idx] += 1;
    }
    return net.map((n, i) =>
      count[i] === 0 ? 'empty' : n > 0 ? 'green' : n < 0 ? 'red' : 'yellow',
    );
  }, [session.trades]);

  return (
    <div className="flex justify-around rounded-xl border border-line bg-panel p-4">
      {DAYS.map((day, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-fg-mute">{day}</span>
          <div
            className="h-10 w-10 rounded-lg border"
            style={{ backgroundColor: `${heatColors[heat[i]]}40`, borderColor: heatColors[heat[i]] }}
          />
        </div>
      ))}
    </div>
  );
}

/** Labeled summary cell. */
function SummaryItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="text-[10px] text-fg-mute">{label}</span>
      <span className="font-mono text-lg font-bold text-fg" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

export function Journal() {
  const { session } = useSession();

  const winCount = session.trades.filter(t => t.pnl > 0).length;
  const totalTrades = session.trades.length;
  // Win rate over *decided* trades only — open/scratch entries (pnl === 0,
  // e.g. order fills awaiting an exit) don't count for or against it.
  const decidedTrades = session.trades.filter(t => t.pnl !== 0).length;
  const winRate = decidedTrades > 0 ? ((winCount / decidedTrades) * 100).toFixed(0) : '0';
  const commissionTotal = session.trades.reduce((acc, t) => acc + t.lots * 4, 0);
  const overrides = session.trades.filter(t => t.override > 0).length + session.reentryOverrides;
  const tiltPeak = Math.max(...session.trades.map(t => t.tilt), 0);

  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<FilterKey>('all');
  const visibleTrades = useMemo(
    () => session.trades.filter(t => matchesFilter(t, filter)),
    [session.trades, filter],
  );
  const activeFilterLabel = FILTERS.find(f => f.key === filter)?.label ?? 'Filter';

  return (
    <div className="min-h-screen overflow-y-auto bg-canvas">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <h1 className="text-sm font-bold uppercase tracking-[0.1em] text-fg">Journal</h1>
          <button
            type="button"
            onClick={() => setShowFilter(v => !v)}
            aria-label="Filter trades"
            aria-expanded={showFilter}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors hover:bg-panel-hi"
          >
            <Filter size={16} color={filter !== 'all' ? Colors.accentPrimary : Colors.textMuted} />
            <span
              className="text-[13px] font-medium"
              style={{ color: filter !== 'all' ? Colors.accentPrimary : Colors.textMuted }}
            >
              {filter === 'all' ? 'Filter' : activeFilterLabel}
            </span>
          </button>
        </div>

        {/* Filter chips */}
        {showFilter && (
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                    active
                      ? 'border-accent bg-accent/[0.125] text-accent'
                      : 'border-line bg-panel text-fg-mute hover:bg-panel-hi',
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* LEFT: today header + filtered trade list */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            <p className="text-[13px] font-bold text-fg-dim">
              Today — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>

            {session.trades.length === 0 ? (
              <div className="flex flex-col items-center gap-2.5 pt-10">
                <BookOpen size={32} color={Colors.textMuted} />
                <span className="text-sm text-fg-mute">No trades logged today</span>
              </div>
            ) : visibleTrades.length === 0 ? (
              <div className="flex flex-col items-center gap-2.5 pt-10">
                <Filter size={28} color={Colors.textMuted} />
                <span className="text-sm text-fg-mute">No trades match this filter</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {visibleTrades.map(trade => (
                  <TradeLogEntry key={trade.id} trade={trade} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: session summary + weekly heat map */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-px flex-1 bg-line" />
              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">
                Session Summary
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <Panel className="flex flex-col gap-3 p-3.5">
              <div className="flex justify-between">
                <SummaryItem label="Trades" value={`${totalTrades}`} />
                <SummaryItem label="Win Rate" value={`${winRate}%`} color={Colors.statusGreen} />
                <SummaryItem
                  label="Net P&L"
                  value={`${session.pnl >= 0 ? '+' : ''}$${session.pnl}`}
                  color={session.pnl >= 0 ? Colors.statusGreen : Colors.statusRed}
                />
              </div>
              <div className="h-px bg-line" />
              <div className="flex justify-between">
                <SummaryItem
                  label="Overrides"
                  value={`${overrides}`}
                  color={overrides > 0 ? Colors.statusYellow : Colors.textSecondary}
                />
                <SummaryItem
                  label="Tilt Peak"
                  value={`${tiltPeak}`}
                  color={tiltPeak > 60 ? Colors.statusRed : tiltPeak > 30 ? Colors.statusYellow : Colors.statusGreen}
                />
                <SummaryItem label="Commission" value={`$${commissionTotal}`} />
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={13} color={Colors.statusGreen} />
                <span className="text-xs font-medium" style={{ color: Colors.statusGreen }}>
                  Green day profile: MATCH
                </span>
              </div>
            </Panel>

            <div className="flex items-center gap-2.5">
              <div className="h-px flex-1 bg-line" />
              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">
                Weekly Heat Map
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <WeeklyHeatMap />
          </div>
        </div>
      </div>
    </div>
  );
}
