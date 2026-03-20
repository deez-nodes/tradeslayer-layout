import React, { createContext, useContext, useState, useCallback } from 'react';

export type Trade = {
  id: string;
  number: number;
  strategy: string;
  instrument: string;
  pnl: number;
  time: string;
  duration: string;
  lots: number;
  tilt: number;
  override: number;
  exitType: 'TP hit' | 'SL hit' | 'Manual';
};

export type SessionState = {
  pnl: number;
  peakPnl: number;
  trades: Trade[];
  tiltScore: number;
  reentryCountdown: number | null;
  lots: number;
  instrument: string;
  dailyGoal: number;
  maxLoss: number;
  maxTrades: number;
  maxLots: number;
  regime: 'TRENDING' | 'RANGING' | 'VOLATILE' | 'CHOPPY';
  adx: number;
  hurst: number;
};

type SessionContextType = {
  session: SessionState;
  addTrade: (trade: Omit<Trade, 'id' | 'number'>) => void;
  updateLots: (lots: number) => void;
  updateInstrument: (instrument: string) => void;
  startReentryCountdown: () => void;
  resetSession: () => void;
};

const defaultSession: SessionState = {
  pnl: 380,
  peakPnl: 420,
  trades: [
    {
      id: '1',
      number: 1,
      strategy: 'Trend Continuation',
      instrument: 'MES',
      pnl: 85,
      time: '10:14a',
      duration: '4 min',
      lots: 2,
      tilt: 8,
      override: 0,
      exitType: 'TP hit',
    },
    {
      id: '2',
      number: 2,
      strategy: 'OB Scalp',
      instrument: 'MES',
      pnl: -20,
      time: '10:32a',
      duration: '1 min',
      lots: 1,
      tilt: 14,
      override: 0,
      exitType: 'SL hit',
    },
    {
      id: '3',
      number: 3,
      strategy: 'Liquidity Sweep',
      instrument: 'MES',
      pnl: 120,
      time: '11:05a',
      duration: '7 min',
      lots: 2,
      tilt: 10,
      override: 0,
      exitType: 'TP hit',
    },
    {
      id: '4',
      number: 4,
      strategy: 'Mean Reversion',
      instrument: 'MES',
      pnl: 195,
      time: '11:44a',
      duration: '12 min',
      lots: 2,
      tilt: 18,
      override: 1,
      exitType: 'TP hit',
    },
  ],
  tiltScore: 18,
  reentryCountdown: null,
  lots: 2,
  instrument: 'MES',
  dailyGoal: 400,
  maxLoss: -500,
  maxTrades: 10,
  maxLots: 2,
  regime: 'TRENDING',
  adx: 31,
  hurst: 0.62,
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>(defaultSession);

  const addTrade = useCallback((trade: Omit<Trade, 'id' | 'number'>) => {
    setSession(prev => {
      const newTrade: Trade = {
        ...trade,
        id: Date.now().toString(),
        number: prev.trades.length + 1,
      };
      const newPnl = prev.pnl + trade.pnl;
      return {
        ...prev,
        trades: [...prev.trades, newTrade],
        pnl: newPnl,
        peakPnl: Math.max(prev.peakPnl, newPnl),
      };
    });
  }, []);

  const updateLots = useCallback((lots: number) => {
    setSession(prev => ({ ...prev, lots }));
  }, []);

  const updateInstrument = useCallback((instrument: string) => {
    setSession(prev => ({ ...prev, instrument }));
  }, []);

  const startReentryCountdown = useCallback(() => {
    setSession(prev => ({ ...prev, reentryCountdown: 102 }));
    const interval = setInterval(() => {
      setSession(prev => {
        if (prev.reentryCountdown === null || prev.reentryCountdown <= 0) {
          clearInterval(interval);
          return { ...prev, reentryCountdown: null };
        }
        return { ...prev, reentryCountdown: prev.reentryCountdown - 1 };
      });
    }, 1000);
  }, []);

  const resetSession = useCallback(() => {
    setSession({ ...defaultSession, trades: [], pnl: 0, peakPnl: 0, tiltScore: 0 });
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, addTrade, updateLots, updateInstrument, startReentryCountdown, resetSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
