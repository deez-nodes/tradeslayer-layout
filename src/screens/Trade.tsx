import { useEffect, useState } from 'react';
import {
  Minus,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Check,
  X,
  Inbox,
} from 'lucide-react';
import { Colors } from '@/constants/colors';
import { INSTRUMENT_SYMBOLS } from '@/constants/instruments';
import { useOrder, type OrderSide, type OrderType } from '@/context/OrderContext';
import { useSession } from '@/context/SessionContext';
import { Panel, SectionLabel, StatusDot } from '@/components/ui';
import { TradeChart } from '@/components/chart/TradeChart';
import { cn } from '@/lib/cn';

const round2 = (n: number) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------------ */
/* SideSelector                                                         */
/* ------------------------------------------------------------------ */

function SideSelector() {
  const { side, setSide } = useOrder();

  const select = (s: OrderSide) => setSide(s);

  return (
    <div className="flex overflow-hidden rounded-xl border border-line">
      <button
        type="button"
        aria-pressed={side === 'buy'}
        onClick={() => select('buy')}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 border-r border-line/50 py-3.5 transition-colors"
        style={{ backgroundColor: side === 'buy' ? `${Colors.statusGreen}22` : Colors.bgCard }}
      >
        <span
          className="text-[15px] font-bold tracking-[0.1em]"
          style={{ color: side === 'buy' ? Colors.statusGreen : Colors.textMuted }}
        >
          BUY
        </span>
        {side === 'buy' && <span className="text-[10px] text-fg-mute">Long</span>}
      </button>
      <button
        type="button"
        aria-pressed={side === 'sell'}
        onClick={() => select('sell')}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 border-l border-line/50 py-3.5 transition-colors"
        style={{ backgroundColor: side === 'sell' ? `${Colors.statusRed}22` : Colors.bgCard }}
      >
        <span
          className="text-[15px] font-bold tracking-[0.1em]"
          style={{ color: side === 'sell' ? Colors.statusRed : Colors.textMuted }}
        >
          SELL
        </span>
        {side === 'sell' && <span className="text-[10px] text-fg-mute">Short</span>}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* OrderTypeSelector                                                   */
/* ------------------------------------------------------------------ */

const ORDER_TYPES: { key: OrderType; label: string; desc: string }[] = [
  { key: 'market', label: 'Market', desc: 'Fill at best price' },
  { key: 'limit', label: 'Limit', desc: 'Set your price' },
  { key: 'stop_limit', label: 'Stop Limit', desc: 'Trigger + price' },
];

function OrderTypeSelector() {
  const { orderType, setOrderType } = useOrder();

  return (
    <div className="flex gap-2">
      {ORDER_TYPES.map((t) => {
        const active = orderType === t.key;
        return (
          <button
            key={t.key}
            type="button"
            aria-pressed={active}
            onClick={() => setOrderType(t.key)}
            className={cn(
              'flex flex-1 items-center justify-center rounded-lg border py-2 transition-colors',
              active ? 'border-accent' : 'border-line bg-panel',
            )}
            style={active ? { backgroundColor: `${Colors.accentPrimary}18` } : undefined}
          >
            <span
              className="text-xs font-medium"
              style={{ color: active ? Colors.accentPrimary : Colors.textMuted }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PriceInputRow                                                       */
/* ------------------------------------------------------------------ */

function PriceField({
  label,
  value,
  onCommit,
  currentPrice,
  showDelta = false,
}: {
  label: string;
  value: number;
  onCommit: (n: number) => void;
  currentPrice: number;
  showDelta?: boolean;
}) {
  const [text, setText] = useState(value.toFixed(2));
  const [focused, setFocused] = useState(false);

  // Reflect external changes (+/- buttons, symbol switch) only while not editing,
  // so the user can freely type partial values like "5210." without it snapping.
  useEffect(() => {
    if (!focused) setText(value.toFixed(2));
  }, [value, focused]);

  const commit = (raw: string) => {
    const n = parseFloat(raw);
    if (!Number.isNaN(n) && n > 0) onCommit(round2(n));
    else setText(value.toFixed(2)); // revert invalid/empty entry
  };

  return (
    <div className="flex flex-col gap-2">
      <SectionLabel>{label}</SectionLabel>
      <div className="flex items-center gap-2 rounded-[10px] border border-line bg-elevated px-3 py-2">
        <span className="text-base font-medium text-fg-mute">$</span>
        <input
          className="min-w-0 flex-1 bg-transparent font-mono text-[22px] font-bold text-fg outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => {
            setFocused(true);
            e.target.select();
          }}
          onBlur={() => {
            setFocused(false);
            commit(text);
          }}
          inputMode="decimal"
          aria-label={label}
        />
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onCommit(round2(value + 0.25))}
            aria-label={`${label} up`}
            className="flex h-[22px] w-7 items-center justify-center rounded-[5px] border border-line bg-panel text-sm font-bold text-fg transition-colors hover:bg-panel-hi"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => onCommit(round2(value - 0.25))}
            aria-label={`${label} down`}
            className="flex h-[22px] w-7 items-center justify-center rounded-[5px] border border-line bg-panel text-sm font-bold text-fg transition-colors hover:bg-panel-hi"
          >
            −
          </button>
        </div>
      </div>
      {showDelta && (
        <span className="font-mono text-[11px] text-fg-mute">
          {value > currentPrice ? '+' : ''}
          {(value - currentPrice).toFixed(2)} pts from current
        </span>
      )}
    </div>
  );
}

function PriceInputRow() {
  const { orderType, limitPrice, setLimitPrice, stopPrice, setStopPrice, currentPrice } = useOrder();

  if (orderType === 'market') {
    return (
      <Panel className="flex flex-col gap-1 p-3.5">
        <SectionLabel>FILL PRICE</SectionLabel>
        <span className="text-lg font-bold text-fg">Market ~{currentPrice.toLocaleString()}</span>
        <span className="text-[11px] text-fg-mute">Fills at best available price</span>
      </Panel>
    );
  }

  return (
    <Panel className="flex flex-col gap-3.5 p-3.5">
      {(orderType === 'limit' || orderType === 'stop_limit') && (
        <PriceField
          label="LIMIT PRICE"
          value={limitPrice}
          onCommit={setLimitPrice}
          currentPrice={currentPrice}
          showDelta
        />
      )}
      {orderType === 'stop_limit' && (
        <PriceField
          label="STOP TRIGGER"
          value={stopPrice}
          onCommit={setStopPrice}
          currentPrice={currentPrice}
        />
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* QuantityInput                                                       */
/* ------------------------------------------------------------------ */

const PERCENTS = [25, 50, 75, 100];

function QuantityInput() {
  const { quantity, setQuantity, maxLots } = useOrder();

  const setPercent = (pct: number) => {
    const q = Math.max(1, Math.round((pct / 100) * maxLots));
    setQuantity(q);
  };

  const increment = () => setQuantity(Math.min(quantity + 1, maxLots));
  const decrement = () => setQuantity(Math.max(quantity - 1, 1));

  const stepBtn =
    'flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-elevated text-fg transition-colors hover:bg-panel-hi disabled:opacity-40 disabled:hover:bg-elevated';

  return (
    <Panel className="flex flex-col gap-3 p-3.5">
      <SectionLabel>QUANTITY</SectionLabel>

      {/* Stepper */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={stepBtn}
          onClick={decrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus size={16} style={{ color: quantity <= 1 ? Colors.textMuted : Colors.textPrimary }} />
        </button>

        <div className="flex flex-1 items-baseline justify-center gap-1.5">
          <input
            className="w-12 min-w-12 bg-transparent text-center font-mono text-[36px] font-bold text-fg outline-none"
            value={String(quantity)}
            onChange={(e) => {
              const n = parseInt(e.target.value) || 1;
              setQuantity(Math.min(Math.max(n, 1), maxLots));
            }}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            maxLength={2}
            aria-label="Quantity"
          />
          <span className="text-sm text-fg-mute">lots</span>
        </div>

        <button
          type="button"
          className={stepBtn}
          onClick={increment}
          disabled={quantity >= maxLots}
          aria-label="Increase quantity"
        >
          <Plus size={16} style={{ color: quantity >= maxLots ? Colors.textMuted : Colors.textPrimary }} />
        </button>
      </div>

      {/* Percent quick buttons */}
      <div className="flex gap-2">
        {PERCENTS.map((pct) => {
          const isActive = quantity === Math.max(1, Math.round((pct / 100) * maxLots));
          return (
            <button
              key={pct}
              type="button"
              onClick={() => setPercent(pct)}
              className={cn(
                'flex flex-1 items-center justify-center rounded-lg border py-2 transition-colors',
                isActive ? 'border-accent' : 'border-line bg-elevated',
              )}
              style={isActive ? { backgroundColor: `${Colors.accentPrimary}20` } : undefined}
            >
              <span
                className="text-[13px] font-medium"
                style={{ color: isActive ? Colors.accentPrimary : Colors.textMuted }}
              >
                {pct}%
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-fg-mute">Max: {maxLots} lots</span>
        <div className="flex gap-1">
          {Array.from({ length: maxLots }).map((_, i) => (
            <span
              key={i}
              className="h-1 w-5 rounded-full"
              style={{ backgroundColor: i < quantity ? Colors.accentPrimary : Colors.borderDefault }}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* PreTradeChecklist                                                   */
/* ------------------------------------------------------------------ */

type CheckStatus = 'pass' | 'warn' | 'fail';
type Check = { key: string; status: CheckStatus; label: string; detail: string };

const statusMeta: Record<
  CheckStatus,
  { color: string; Icon: typeof CheckCircle }
> = {
  pass: { color: Colors.statusGreen, Icon: CheckCircle },
  warn: { color: Colors.statusYellow, Icon: AlertTriangle },
  fail: { color: Colors.statusRed, Icon: XCircle },
};

/**
 * Pre-trade discipline gate (spec's Pre-Trade Checklist). Surfaces a live
 * pass/caution/block read across tilt, reentry lock, trade count, loss room,
 * and the order's R:R — using the same R:R math as OrderSummary so the two
 * never disagree. Informational (doesn't block submit); the trader decides.
 */
function PreTradeChecklist() {
  const { orderType, limitPrice, stopLoss, takeProfit, currentPrice } = useOrder();
  const { session } = useSession();

  // R:R — identical formula to OrderSummary.
  const fillPrice = orderType === 'market' ? currentPrice : limitPrice;
  const slPoints = Math.abs(fillPrice - stopLoss);
  const tpPoints = Math.abs(takeProfit - fillPrice);
  const rr = slPoints > 0 ? tpPoints / slPoints : 0;

  const tiltStatus: CheckStatus =
    session.tiltScore < 30 ? 'pass' : session.tiltScore < 60 ? 'warn' : 'fail';
  const rrStatus: CheckStatus = rr >= 2 ? 'pass' : rr >= 1 ? 'warn' : 'fail';

  const checks: Check[] = [
    {
      key: 'tilt',
      status: tiltStatus,
      label: 'Tilt under control',
      detail: `${session.tiltScore}/100`,
    },
    {
      key: 'reentry',
      status: session.reentryCountdown == null ? 'pass' : 'fail',
      label: 'No reentry cooldown',
      detail: session.reentryCountdown == null ? 'Clear' : `${session.reentryCountdown}s left`,
    },
    {
      key: 'trades',
      status: session.trades.length < session.maxTrades ? 'pass' : 'fail',
      label: 'Trades remaining',
      detail: `${session.trades.length}/${session.maxTrades}`,
    },
    {
      key: 'loss',
      status: session.pnl > session.maxLoss ? 'pass' : 'fail',
      label: 'Above max loss',
      detail: session.pnl > session.maxLoss ? 'Within limit' : 'Limit hit',
    },
    {
      key: 'rr',
      status: rrStatus,
      label: 'R:R ≥ 2:1',
      detail: rr > 0 ? `1 : ${rr.toFixed(1)}` : '—',
    },
  ];

  const overall: CheckStatus = checks.some((c) => c.status === 'fail')
    ? 'fail'
    : checks.some((c) => c.status === 'warn')
      ? 'warn'
      : 'pass';
  const overallLabel =
    overall === 'fail' ? 'NOT CLEAR' : overall === 'warn' ? 'CAUTION' : 'CLEAR TO TRADE';
  const overallColor = statusMeta[overall].color;

  return (
    <Panel className="flex flex-col gap-2.5 p-4">
      <div className="flex items-center justify-between">
        <SectionLabel>PRE-TRADE CHECKLIST</SectionLabel>
        <span
          className="rounded-full border px-2 py-[3px] text-[10px] font-bold tracking-wide"
          style={{
            color: overallColor,
            backgroundColor: `${overallColor}1f`,
            borderColor: `${overallColor}55`,
          }}
        >
          {overallLabel}
        </span>
      </div>

      {checks.map((c) => {
        const meta = statusMeta[c.status];
        const Icon = meta.Icon;
        return (
          <div key={c.key} className="flex items-center gap-2.5">
            <Icon size={15} style={{ color: meta.color }} />
            <span className="flex-1 text-[13px] text-fg-dim">{c.label}</span>
            <span className="font-mono text-[13px] font-bold" style={{ color: meta.color }}>
              {c.detail}
            </span>
          </div>
        );
      })}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* OrderSummary                                                        */
/* ------------------------------------------------------------------ */

const RT_COSTS: Record<string, number> = {
  MES: 4,
  ES: 4,
  NQ: 4,
  MNQ: 4,
  RTY: 4,
  YM: 4,
};

function SummaryRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-fg-dim">{label}</span>
      <span className="font-mono text-[13px] font-bold text-fg" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </span>
    </div>
  );
}

function OrderSummary() {
  const {
    side,
    orderType,
    quantity,
    symbol,
    limitPrice,
    stopLoss,
    takeProfit,
    currentPrice,
    submitOrder,
  } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fillPrice = orderType === 'market' ? currentPrice : limitPrice;
  const commission = (RT_COSTS[symbol] ?? 4) * quantity;
  const slPoints = Math.abs(fillPrice - stopLoss);
  const tpPoints = Math.abs(takeProfit - fillPrice);
  const rr = slPoints > 0 ? (tpPoints / slPoints).toFixed(1) : '—';
  const rrNum = slPoints > 0 ? tpPoints / slPoints : 0;
  const rrGood = rrNum >= 2;
  const isBuy = side === 'buy';

  const accentColor = isBuy ? Colors.statusGreen : Colors.statusRed;
  const sideLabel = isBuy ? 'BUY' : 'SELL';

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitOrder();
      setShowConfirmation(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Panel className="flex flex-col gap-3.5 p-4">
      <SectionLabel>ORDER SUMMARY</SectionLabel>

      <div className="flex flex-col gap-2.5">
        <SummaryRow label="Symbol" value={symbol} />
        <SummaryRow label="Side" value={sideLabel} valueColor={accentColor} />
        <SummaryRow
          label="Type"
          value={
            orderType === 'stop_limit'
              ? 'Stop Limit'
              : orderType.charAt(0).toUpperCase() + orderType.slice(1)
          }
        />
        <SummaryRow label="Quantity" value={`${quantity} lot${quantity > 1 ? 's' : ''}`} />
        <SummaryRow label="Fill Price" value={`~$${fillPrice.toFixed(2)}`} />
        <SummaryRow label="Stop Loss" value={`$${stopLoss.toFixed(2)}`} valueColor={Colors.statusRed} />
        <SummaryRow label="Take Profit" value={`$${takeProfit.toFixed(2)}`} valueColor={Colors.statusGreen} />
        <div className="my-0.5 h-px bg-line" />
        <SummaryRow label="Commission" value={`$${commission.toFixed(2)}`} />
        <SummaryRow
          label="R : R"
          value={`1 : ${rr}`}
          valueColor={rrGood ? Colors.statusGreen : rrNum < 1 ? Colors.statusRed : Colors.statusYellow}
        />
      </div>

      {!rrGood && rrNum > 0 && (
        <div
          className="flex items-center gap-2 rounded-lg border p-2.5"
          style={{
            backgroundColor: `${Colors.statusYellow}18`,
            borderColor: `${Colors.statusYellow}40`,
          }}
        >
          <AlertTriangle size={13} style={{ color: Colors.statusYellow }} />
          <span className="flex-1 text-xs" style={{ color: Colors.statusYellow }}>
            R:R below 2:1 — consider adjusting levels
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        aria-label={`Confirm ${sideLabel} ${quantity} ${symbol}`}
        className="flex flex-col items-center gap-0.5 rounded-xl py-4 transition-opacity hover:opacity-90 disabled:opacity-80"
        style={{ backgroundColor: accentColor }}
      >
        {isSubmitting ? (
          <span className="text-[15px] font-bold tracking-[0.1em]" style={{ color: Colors.bgPrimary }}>
            …
          </span>
        ) : (
          <>
            <span className="text-[15px] font-bold tracking-[0.1em]" style={{ color: Colors.bgPrimary }}>
              CONFIRM {sideLabel}
            </span>
            <span className="text-[11px]" style={{ color: `${Colors.bgPrimary}aa` }}>
              {symbol} · {quantity} lot{quantity > 1 ? 's' : ''}
            </span>
          </>
        )}
      </button>

      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="flex w-full max-w-[340px] flex-col items-center gap-3 rounded-[20px] border border-line bg-elevated p-7 shadow-2xl">
            <div
              className="mb-1 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <Check size={28} style={{ color: accentColor }} />
            </div>
            <span className="text-2xl font-bold text-fg">Order Sent</span>
            <span className="text-center text-sm text-fg-dim">
              {sideLabel} {quantity} {symbol}{' '}
              {orderType === 'market' ? '@ market' : `@ $${limitPrice.toFixed(2)}`}
            </span>
            <div className="mt-1 text-sm text-fg-dim">
              <span>
                <span className="text-fg-mute">SL: </span>
                <span style={{ color: Colors.statusRed }}>${stopLoss.toFixed(2)}</span>
                {'  '}
                <span className="text-fg-mute">TP: </span>
                <span style={{ color: Colors.statusGreen }}>${takeProfit.toFixed(2)}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="mt-2 rounded-xl border-2 px-10 py-3"
              style={{ borderColor: accentColor }}
            >
              <span className="text-base font-bold" style={{ color: accentColor }}>
                Done
              </span>
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Positions panel                                                     */
/* ------------------------------------------------------------------ */

function PositionsPanel() {
  const { orders, cancelOrder } = useOrder();
  const openOrders = orders.filter((o) => o.status === 'pending' || o.status === 'filled');

  return (
    <Panel className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <SectionLabel>POSITIONS{openOrders.length > 0 ? ` (${openOrders.length})` : ''}</SectionLabel>
      </div>

      {openOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2.5 py-10">
          <Inbox size={36} style={{ color: Colors.textMuted }} />
          <span className="text-lg font-bold text-fg-dim">No positions</span>
          <span className="text-center text-[13px] text-fg-mute">Place an order to see it here</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {openOrders.map((order) => {
            const isBuy = order.side === 'buy';
            const sideColor = isBuy ? Colors.statusGreen : Colors.statusRed;
            const statusColor =
              order.status === 'filled'
                ? Colors.statusGreen
                : order.status === 'cancelled'
                  ? Colors.textMuted
                  : Colors.statusYellow;

            return (
              <div key={order.id} className="flex flex-col gap-2.5 rounded-xl border border-line bg-panel p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-md border px-[7px] py-[3px] text-[10px] font-bold tracking-[0.05em]"
                      style={{
                        color: sideColor,
                        backgroundColor: `${sideColor}20`,
                        borderColor: `${sideColor}50`,
                      }}
                    >
                      {order.side.toUpperCase()}
                    </span>
                    <span className="text-base font-bold text-fg">{order.symbol}</span>
                    <span className="text-xs text-fg-dim">
                      {order.quantity} lot{order.quantity > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusDot color={statusColor} size={6} />
                    <span className="text-xs font-medium" style={{ color: statusColor }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-fg-dim">
                    {order.type === 'market' ? 'Market' : `Limit $${order.limitPrice?.toFixed(2)}`}
                  </span>
                  <span className="text-xs text-fg-mute">·</span>
                  {order.stopLoss && (
                    <span className="text-xs" style={{ color: Colors.statusRed }}>
                      SL ${order.stopLoss.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-fg-mute">·</span>
                  {order.takeProfit && (
                    <span className="text-xs" style={{ color: Colors.statusGreen }}>
                      TP ${order.takeProfit.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-fg-mute">
                    {new Date(order.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {order.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => cancelOrder(order.id)}
                      aria-label="Cancel order"
                      className="flex items-center gap-1 rounded-md border px-2.5 py-[5px] transition-colors"
                      style={{
                        borderColor: `${Colors.statusRed}50`,
                        backgroundColor: `${Colors.statusRed}10`,
                      }}
                    >
                      <X size={12} style={{ color: Colors.statusRed }} />
                      <span className="text-[11px] font-medium" style={{ color: Colors.statusRed }}>
                        Cancel
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Trade screen                                                        */
/* ------------------------------------------------------------------ */

export function Trade() {
  const { symbol, setSymbol, currentPrice } = useOrder();

  return (
    <div className="min-h-screen overflow-y-auto bg-canvas">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-line pb-4">
          <div>
            <h1 className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute">
              Order Ticket
            </h1>
            <p className="mt-0.5 font-mono text-[22px] font-bold text-fg">
              {currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Two columns */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* LEFT — order form */}
          <div className="flex w-full flex-col gap-2.5 lg:w-[440px] lg:flex-none">
            {/* Symbol selector */}
            <div className="flex flex-wrap gap-2">
              {INSTRUMENT_SYMBOLS.map((sym) => {
                const active = symbol === sym;
                return (
                  <button
                    key={sym}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSymbol(sym)}
                    className={cn(
                      'rounded-lg border px-3.5 py-[7px] transition-colors',
                      active ? 'border-accent' : 'border-line bg-panel',
                    )}
                    style={active ? { backgroundColor: `${Colors.accentPrimary}18` } : undefined}
                  >
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: active ? Colors.accentPrimary : Colors.textMuted }}
                    >
                      {sym}
                    </span>
                  </button>
                );
              })}
            </div>

            <SideSelector />

            <div className="flex flex-col gap-2">
              <SectionLabel>ORDER TYPE</SectionLabel>
              <OrderTypeSelector />
            </div>

            <PriceInputRow />
            <QuantityInput />
            <PreTradeChecklist />
            <OrderSummary />
          </div>

          {/* RIGHT — chart + positions */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <Panel className="p-2">
              <div style={{ height: 460 }}>
                <TradeChart height={460} />
              </div>
            </Panel>
            <PositionsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
