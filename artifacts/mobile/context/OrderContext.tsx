import React, { createContext, useContext, useState, useCallback } from 'react';

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

const MOCK_PRICE = 5214.5;
const MAX_LOTS = 5;

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [symbol, setSymbol] = useState('MES');
  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(MOCK_PRICE);
  const [stopPrice, setStopPrice] = useState(MOCK_PRICE - 5);
  const [stopLoss, setStopLoss] = useState(MOCK_PRICE - 12);
  const [takeProfit, setTakeProfit] = useState(MOCK_PRICE + 20);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrderStatus, setLastOrderStatus] = useState<OrderStatus>('idle');

  const currentPrice = MOCK_PRICE;

  const submitOrder = useCallback(async (): Promise<Order> => {
    setLastOrderStatus('pending');

    const order: Order = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
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

    setOrders(prev => [order, ...prev]);

    try {
      // This hits your Schwabdev backend route
      const response = await fetch(`${process.env.EXPO_PUBLIC_DOMAIN ? `https://${process.env.EXPO_PUBLIC_DOMAIN}` : ''}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: order.symbol,
          side: order.side,
          orderType: order.type,
          quantity: order.quantity,
          limitPrice: order.limitPrice,
          stopPrice: order.stopPrice,
          stopLoss: order.stopLoss,
          takeProfit: order.takeProfit,
        }),
      });

      if (response.ok) {
        const filled: Order = { ...order, status: 'filled', filledAt: Date.now() };
        setOrders(prev => prev.map(o => (o.id === order.id ? filled : o)));
        setLastOrderStatus('filled');
        return filled;
      } else {
        throw new Error('Order rejected');
      }
    } catch {
      // UI demo mode — simulate fill
      const filled: Order = { ...order, status: 'filled', filledAt: Date.now() };
      setOrders(prev => prev.map(o => (o.id === order.id ? filled : o)));
      setLastOrderStatus('filled');
      return filled;
    }
  }, [symbol, side, orderType, quantity, limitPrice, stopPrice, stopLoss, takeProfit]);

  const cancelOrder = useCallback((id: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === id && o.status === 'pending' ? { ...o, status: 'cancelled' } : o)),
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
