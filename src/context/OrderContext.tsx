import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useSession } from '@/context/SessionContext';
import { instrumentPrice, defaultLevels } from '@/constants/instruments';

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit' | 'stop_limit';
export type OrderStatus = 'idle' | 'pending' | 'filled' | 'rejected' | 'cancelled';

export type Order = {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  status: OrderStatus;
  filledAt?: number;
  pnl?: number;
  timestamp: number;
  /** Filled locally without a real broker backend (no VITE_BACKEND). */
  simulated?: boolean;
};

type OrderContextType = {
  symbol: string;
  setSymbol: (s: string) => void;
  side: OrderSide;
  setSide: (s: OrderSide) => void;
  orderType: OrderType;
  setOrderType: (t: OrderType) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  limitPrice: number;
  setLimitPrice: (p: number) => void;
  stopPrice: number;
  setStopPrice: (p: number) => void;
  stopLoss: number;
  setStopLoss: (p: number) => void;
  takeProfit: number;
  setTakeProfit: (p: number) => void;
  maxLots: number;
  currentPrice: number;
  orders: Order[];
  submitOrder: () => Promise<Order>;
  cancelOrder: (id: string) => void;
  lastOrderStatus: OrderStatus;
};

const MAX_LOTS = 5;
const INITIAL_LEVELS = defaultLevels('MES');
const BACKEND = import.meta.env.VITE_BACKEND
  ? import.meta.env.VITE_BACKEND.replace(/\/+$/, '')
  : null;

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { addTrade, session } = useSession();

  const [symbol, setSymbolState] = useState('MES');
  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(INITIAL_LEVELS.limitPrice);
  const [stopPrice, setStopPrice] = useState(INITIAL_LEVELS.stopPrice);
  const [stopLoss, setStopLoss] = useState(INITIAL_LEVELS.stopLoss);
  const [takeProfit, setTakeProfit] = useState(INITIAL_LEVELS.takeProfit);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrderStatus, setLastOrderStatus] = useState<OrderStatus>('idle');
  const orderSeq = useRef(0);

  const currentPrice = instrumentPrice(symbol);

  // Switching instruments rebases the order levels to the new price so an
  // NQ/YM ticket isn't seeded with MES-scale prices.
  const setSymbol = useCallback((s: string) => {
    setSymbolState(s);
    const levels = defaultLevels(s);
    setLimitPrice(levels.limitPrice);
    setStopPrice(levels.stopPrice);
    setStopLoss(levels.stopLoss);
    setTakeProfit(levels.takeProfit);
  }, []);

  const submitOrder = useCallback(async (): Promise<Order> => {
    setLastOrderStatus('pending');

    const base: Order = {
      id: `order-${Date.now()}-${orderSeq.current++}`,
      symbol,
      side,
      type: orderType,
      quantity,
      limitPrice: orderType !== 'market' ? limitPrice : undefined,
      stopPrice: orderType === 'stop_limit' ? stopPrice : undefined,
      stopLoss,
      takeProfit,
      status: 'pending',
      timestamp: Date.now(),
    };

    setOrders((prev) => [base, ...prev]);

    const settle = (next: Order) => {
      setOrders((prev) => prev.map((o) => (o.id === base.id ? next : o)));
      setLastOrderStatus(next.status);
      // Bridge a fill into the session/journal as an executed entry. P&L is
      // unrealized (0) — entries open a position; realized P&L + position close
      // is future work (no broker exit reporting wired).
      if (next.status === 'filled') {
        addTrade({
          strategy: `${next.side === 'buy' ? 'Long' : 'Short'} ${
            next.type === 'market' ? 'Market' : next.type === 'limit' ? 'Limit' : 'Stop'
          }`,
          instrument: next.symbol,
          pnl: 0,
          time: new Date(next.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          duration: '—',
          lots: next.quantity,
          tilt: session.tiltScore,
          override: 0,
          exitType: 'Manual',
          at: next.timestamp,
          source: 'order',
        });
      }
      return next;
    };

    // No backend configured → transparent local simulation (clearly flagged).
    if (!BACKEND) {
      return settle({ ...base, status: 'filled', filledAt: Date.now(), simulated: true });
    }

    // Real backend (e.g. Schwabdev) → surface true outcome; never fake a fill.
    try {
      const response = await fetch(`${BACKEND}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: base.symbol,
          side: base.side,
          orderType: base.type,
          quantity: base.quantity,
          limitPrice: base.limitPrice,
          stopPrice: base.stopPrice,
          stopLoss: base.stopLoss,
          takeProfit: base.takeProfit,
        }),
      });
      if (response.ok) {
        return settle({ ...base, status: 'filled', filledAt: Date.now() });
      }
      return settle({ ...base, status: 'rejected' });
    } catch {
      return settle({ ...base, status: 'rejected' });
    }
  }, [symbol, side, orderType, quantity, limitPrice, stopPrice, stopLoss, takeProfit, currentPrice, addTrade, session.tiltScore]);

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id && o.status === 'pending' ? { ...o, status: 'cancelled' } : o)),
    );
  }, []);

  return (
    <OrderContext.Provider
      value={{
        symbol, setSymbol,
        side, setSide,
        orderType, setOrderType,
        quantity, setQuantity,
        limitPrice, setLimitPrice,
        stopPrice, setStopPrice,
        stopLoss, setStopLoss,
        takeProfit, setTakeProfit,
        maxLots: MAX_LOTS,
        currentPrice,
        orders,
        submitOrder,
        cancelOrder,
        lastOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
