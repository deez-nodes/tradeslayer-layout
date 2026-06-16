import { useState, useMemo } from 'react';
import { Search, X, Layers, Bookmark, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Colors } from '@/constants/colors';
import { strategyCards, type StrategyCard } from '@/data/strategyCards';
import { useSession } from '@/context/SessionContext';
import { cn } from '@/lib/cn';

const CATEGORIES = ['All', 'Trend', 'Momentum', 'Mean Rev', 'Breakout'] as const;

const categoryColors: Record<string, string> = {
  Trend: Colors.catTrend,
  Momentum: Colors.catMomentum,
  'Mean Rev': Colors.catMeanRev,
  Breakout: Colors.catBreakout,
};

const riskColors: Record<string, string> = {
  Low: Colors.statusGreen,
  Medium: Colors.statusYellow,
  High: Colors.statusRed,
};

function StrategyCardItem({ card, onPress }: { card: StrategyCard; onPress: () => void }) {
  const catColor = categoryColors[card.category] ?? Colors.textMuted;
  const riskColor = riskColors[card.risk] ?? Colors.textMuted;
  const tier1Met = card.tier1.filter((t) => t.checked).length;
  const tier2Weight = card.tier2.filter((t) => t.active).reduce((a, b) => a + b.weight, 0);

  return (
    <button
      type="button"
      aria-label={card.name}
      onClick={onPress}
      className="flex flex-col gap-1.5 rounded-[10px] border border-line bg-panel p-3.5 text-left transition-colors hover:bg-panel-hi"
      style={{ borderLeftWidth: 3, borderLeftColor: catColor }}
    >
      <div className="flex items-center gap-1.5">
        <span className="inline-block rounded-full" style={{ width: 6, height: 6, backgroundColor: catColor }} />
        <span className="text-[10px] font-medium tracking-[0.8px] text-fg-mute">{card.category.toUpperCase()}</span>
        <span className="flex-1" />
        <Bookmark size={16} color={Colors.textMuted} />
      </div>

      <p className="text-base font-bold text-fg">{card.name}</p>
      <p className="truncate text-xs text-fg-dim">{card.subtitle}</p>

      <div className="mt-1 flex items-center justify-between">
        <div className="flex gap-1.5">
          {card.timeframes.map((tf) => (
            <span key={tf} className="rounded-md bg-elevated px-2 py-[3px] text-[11px] text-fg-dim">
              {tf}
            </span>
          ))}
        </div>
        <span
          className="rounded-md border px-2 py-[3px] text-[11px] font-medium"
          style={{ color: riskColor, borderColor: `${riskColor}50`, backgroundColor: `${riskColor}15` }}
        >
          {card.risk}
        </span>
      </div>

      <div className="mt-0.5 flex items-center gap-2">
        <span className="font-mono text-[11px] text-fg-mute">
          T1: {tier1Met}/{card.tier1.length}
        </span>
        <span className="inline-block bg-line" style={{ width: 1, height: 10 }} />
        <span
          className="font-mono text-[11px]"
          style={{ color: tier2Weight > 0 ? Colors.statusYellow : Colors.statusGreen }}
        >
          Flags: {tier2Weight}
        </span>
      </div>
    </button>
  );
}

function StrategyCardDetail({ card, onClose }: { card: StrategyCard; onClose: () => void }) {
  const { session, addTrade } = useSession();
  const navigate = useNavigate();
  const [tier1, setTier1] = useState(card.tier1);
  const [tier2, setTier2] = useState(card.tier2);
  const [tier3, setTier3] = useState(card.tier3);

  // Open a journal entry from this card: an executed entry at the session's
  // current instrument/lots, P&L unrealized (0) until an exit is recorded —
  // mirroring how OrderContext bridges a filled order into the journal.
  const handleLogTrade = () => {
    addTrade({
      strategy: card.name,
      instrument: session.instrument,
      pnl: 0,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration: '—',
      lots: session.lots,
      tilt: session.tiltScore,
      override: 0,
      exitType: 'Manual',
      at: Date.now(),
      source: 'manual',
    });
    onClose();
    navigate('/journal');
  };

  const catColor = categoryColors[card.category] ?? Colors.accentPrimary;
  const t1Score = tier1.filter((t) => t.checked).length;
  const t2Weight = tier2.filter((t) => t.active).reduce((a, b) => a + b.weight, 0);
  const t1Status = t1Score >= tier1.length * 0.75 ? 'green' : t1Score >= tier1.length * 0.5 ? 'yellow' : 'red';
  const t2Status = t2Weight === 0 ? 'green' : t2Weight <= 2 ? 'yellow' : 'red';
  const t1Color = t1Status === 'green' ? Colors.statusGreen : t1Status === 'yellow' ? Colors.statusYellow : Colors.statusRed;
  const t2Color = t2Status === 'green' ? Colors.statusGreen : t2Status === 'yellow' ? Colors.statusYellow : Colors.statusRed;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={card.name}
      >
        <div className="flex items-center border-b border-line px-4 pb-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg transition-colors hover:bg-panel-hi"
          >
            <ArrowLeft size={20} />
          </button>
          <p className="flex-1 truncate text-center text-base font-bold text-fg">{card.name}</p>
          <span className="w-8" />
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto p-4 pb-10">
          <div
            className="flex items-center justify-between rounded-lg border border-line bg-panel px-3 py-2.5"
            style={{ borderLeftWidth: 3, borderLeftColor: catColor }}
          >
            <span className="text-xs text-fg-mute">Regime compatible</span>
            <span className="text-[13px] font-bold" style={{ color: catColor }}>
              {session.regime} — Aligned
            </span>
          </div>

          {/* Tier 1 */}
          <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-panel p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[1px] text-fg-mute">TIER 1 — CONDITIONS</span>
              <span className="font-mono text-xs font-bold" style={{ color: t1Color }}>
                {t1Score}/{tier1.length} met
              </span>
            </div>
            {tier1.map((item, i) => (
              <button
                type="button"
                key={i}
                className="flex min-h-[32px] items-center gap-2.5 text-left"
                onClick={() => {
                  const next = [...tier1];
                  next[i] = { ...next[i], checked: !next[i].checked };
                  setTier1(next);
                }}
              >
                <span
                  className="flex h-[18px] w-[18px] items-center justify-center rounded"
                  style={{
                    borderWidth: 1.5,
                    borderStyle: 'solid',
                    borderColor: item.checked ? Colors.accentPrimary : Colors.borderDefault,
                    backgroundColor: item.checked ? Colors.accentPrimary : 'transparent',
                  }}
                >
                  {item.checked && <Check size={11} color={Colors.bgPrimary} />}
                </span>
                <span className="flex-1 text-[13px]" style={{ color: item.checked ? Colors.textPrimary : Colors.textSecondary }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Tier 2 */}
          <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-panel p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[1px] text-fg-mute">TIER 2 — RED FLAGS</span>
              <span className="font-mono text-xs font-bold" style={{ color: t2Color }}>
                Weight: {t2Weight}
              </span>
            </div>
            {tier2.map((item, i) => (
              <button
                type="button"
                key={i}
                className="flex min-h-[32px] items-center gap-2.5 text-left"
                onClick={() => {
                  const next = [...tier2];
                  next[i] = { ...next[i], active: !next[i].active };
                  setTier2(next);
                }}
              >
                <span
                  className="flex h-[18px] w-[18px] items-center justify-center rounded"
                  style={{
                    borderWidth: 1.5,
                    borderStyle: 'solid',
                    borderColor: item.active ? Colors.statusRed : Colors.borderDefault,
                    backgroundColor: item.active ? Colors.statusRed : 'transparent',
                  }}
                >
                  {item.active && <X size={11} color="#fff" />}
                </span>
                <span className="flex-1 text-[13px]" style={{ color: item.active ? Colors.statusRed : Colors.textSecondary }}>
                  {item.label}
                </span>
                <span className="flex-1" />
                <span className="font-mono text-[11px] font-bold" style={{ color: item.active ? Colors.statusRed : Colors.textMuted }}>
                  ×{item.weight}
                </span>
              </button>
            ))}
          </div>

          {/* Tier 3 */}
          <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-panel p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-[1px] text-fg-mute">TIER 3 — EXECUTION</span>
            {tier3.map((item, i) => (
              <button
                type="button"
                key={i}
                className="flex min-h-[32px] items-center gap-2.5 text-left"
                onClick={() => {
                  const next = [...tier3];
                  next[i] = { ...next[i], checked: !next[i].checked };
                  setTier3(next);
                }}
              >
                <span
                  className="flex h-[18px] w-[18px] items-center justify-center rounded"
                  style={{
                    borderWidth: 1.5,
                    borderStyle: 'solid',
                    borderColor: item.checked ? Colors.statusBlue : Colors.borderDefault,
                    backgroundColor: item.checked ? Colors.statusBlue : 'transparent',
                  }}
                >
                  {item.checked && <Check size={11} color="#fff" />}
                </span>
                <span className="flex-1 text-[13px]" style={{ color: item.checked ? Colors.textPrimary : Colors.textSecondary }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Cross-cutting */}
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-panel p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-[1px] text-fg-mute">CROSS-CUTTING</span>
            <div className="flex justify-between">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-fg-mute">Tilt</span>
                <span
                  className="font-mono text-lg font-bold"
                  style={{ color: session.tiltScore < 30 ? Colors.statusGreen : Colors.statusYellow }}
                >
                  {session.tiltScore}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-fg-mute">Reentry</span>
                <span className="font-mono text-lg font-bold" style={{ color: Colors.statusGreen }}>
                  {session.reentryCountdown === null ? 'Clear' : `${session.reentryCountdown}s`}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-fg-mute">Trades</span>
                <span className="font-mono text-lg font-bold text-fg">
                  {session.trades.length}/{session.maxTrades}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogTrade}
            aria-label="Log trade with this card"
            className="mt-1 rounded-xl py-4 text-center text-sm font-bold tracking-[1px]"
            style={{ backgroundColor: Colors.accentPrimary, color: Colors.bgPrimary }}
          >
            LOG TRADE WITH THIS CARD
          </button>
        </div>
      </div>
    </div>
  );
}

export function Cards() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return strategyCards.filter((card) => {
      const matchCat = activeCategory === 'All' || card.category === activeCategory;
      const matchSearch =
        !search ||
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const selectedCard = strategyCards.find((c) => c.id === selectedCardId) ?? null;

  return (
    <div className="min-h-screen overflow-y-auto bg-canvas">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-xl font-bold text-fg">Strategy Cards</h1>
            <p className="mt-0.5 text-xs text-fg-mute">{strategyCards.length} trading playbooks</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-[10px] border border-line bg-panel px-3 py-2">
          <Search size={15} color={Colors.textMuted} />
          <input
            className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-mute focus:outline-none"
            placeholder="Search strategies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search.length > 0 && (
            <button type="button" onClick={() => setSearch('')} aria-label="Clear search" className="text-fg-mute hover:text-fg">
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                  active ? 'border-accent text-accent' : 'border-line bg-panel text-fg-mute hover:bg-panel-hi',
                )}
                style={active ? { backgroundColor: `${Colors.accentPrimary}20` } : undefined}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 pt-16">
            <Layers size={32} color={Colors.textMuted} />
            <p className="text-sm text-fg-mute">No strategies match</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((card) => (
              <StrategyCardItem key={card.id} card={card} onPress={() => setSelectedCardId(card.id)} />
            ))}
          </div>
        )}
      </div>

      {selectedCard && <StrategyCardDetail card={selectedCard} onClose={() => setSelectedCardId(null)} />}
    </div>
  );
}
