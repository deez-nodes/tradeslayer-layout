import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { loadJSON, saveJSON } from '@/lib/storage';
import { computeTilt, type TiltDrivers } from '@/lib/tilt';

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
  /** Epoch ms the trade was logged (enables fast-reentry detection). */
  at?: number;
  /** Where the entry came from. */
  source?: 'order' | 'manual';
};

/** Session lifecycle / color state, derived from P&L vs guardrails. */
export type SessionStatus = 'active' | 'at_goal' | 'giving_back' | 'max_loss' | 'stopped';

/** The persisted slice of session state. */
type StoredSession = {
  pnl: number;
  peakPnl: number;
  trades: Trade[];
  lots: number;
  instrument: string;
  dailyGoal: number;
  maxLoss: number;
  maxTrades: number;
  maxLots: number;
  regime: 'TRENDING' | 'RANGING' | 'VOLATILE' | 'CHOPPY';
  adx: number;
  hurst: number;
  /** Session manually ended or hard-stopped + acknowledged. */
  stopped: boolean;
  /** Count of reentry-cooldown overrides this session (feeds tilt). */
  reentryOverrides: number;
};

/** Everything exposed to consumers: persisted state + live/derived fields. */
export type SessionState = StoredSession & {
  reentryCountdown: number | null;
  tiltScore: number;
  tiltDrivers: TiltDrivers;
  sessionStatus: SessionStatus;
};

type SessionContextType = {
  session: SessionState;
  hydrated: boolean;
  addTrade: (trade: Omit<Trade, 'id' | 'number'>) => void;
  updateLots: (lots: number) => void;
  updateInstrument: (instrument: string) => void;
  startReentryCountdown: () => void;
  overrideReentry: () => void;
  endSession: () => void;
  resetSession: () => void;
};

const STORAGE_KEY = 'tradeslayer.session.v1';
const REENTRY_SECONDS = 120;

const seedTrades: Trade[] = [
  { id: '1', number: 1, strategy: 'Trend Continuation', instrument: 'MES', pnl: 85, time: '10:14a', duration: '4 min', lots: 2, tilt: 8, override: 0, exitType: 'TP hit' },
  { id: '2', number: 2, strategy: 'OB Scalp', instrument: 'MES', pnl: -20, time: '10:32a', duration: '1 min', lots: 1, tilt: 14, override: 0, exitType: 'SL hit' },
  { id: '3', number: 3, strategy: 'Liquidity Sweep', instrument: 'MES', pnl: 120, time: '11:05a', duration: '7 min', lots: 2, tilt: 10, override: 0, exitType: 'TP hit' },
  { id: '4', number: 4, strategy: 'Mean Reversion', instrument: 'MES', pnl: 195, time: '11:44a', duration: '12 min', lots: 2, tilt: 18, override: 1, exitType: 'TP hit' },
];

const defaultStored: StoredSession = {
  pnl: 380,
  peakPnl: 420,
  trades: seedTrades,
  lots: 2,
  instrument: 'MES',
  dailyGoal: 400,
  maxLoss: -500,
  maxTrades: 10,
  maxLots: 2,
  regime: 'TRENDING',
  adx: 31,
  hurst: 0.62,
  stopped: false,
  reentryOverrides: 0,
};

function deriveStatus(s: StoredSession): SessionStatus {
  if (s.stopped) return 'stopped';
  if (s.pnl <= s.maxLoss) return 'max_loss';
  if (s.peakPnl > 0 && s.pnl < s.peakPnl * 0.5) return 'giving_back';
  if (s.pnl >= s.dailyGoal) return 'at_goal';
  return 'active';
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<StoredSession>(defaultStored);
  const [reentryCountdown, setReentryCountdown] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hydrate from storage once on mount.
  useEffect(() => {
    let active = true;
    loadJSON<StoredSession | null>(STORAGE_KEY, null).then((saved) => {
      if (!active) return;
      if (saved) setStored({ ...defaultStored, ...saved });
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // Persist on change (after hydration, so we never clobber saved data with defaults).
  useEffect(() => {
    if (hydrated) saveJSON(STORAGE_KEY, stored);
  }, [stored, hydrated]);

  // Clear any running reentry interval on unmount.
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const addTrade = useCallback((trade: Omit<Trade, 'id' | 'number'>) => {
    setStored((prev) => {
      const newTrade: Trade = {
        ...trade,
        id: `${Date.now()}-${prev.trades.length + 1}`,
        number: prev.trades.length + 1,
        at: trade.at ?? Date.now(),
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
    setStored((prev) => ({ ...prev, lots }));
  }, []);

  const updateInstrument = useCallback((instrument: string) => {
    setStored((prev) => ({ ...prev, instrument }));
  }, []);

  const startReentryCountdown = useCallback(() => {
    if (intervalRef.current) return; // already running
    setReentryCountdown(REENTRY_SECONDS);
    intervalRef.current = setInterval(() => {
      setReentryCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const overrideReentry = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setReentryCountdown(null);
    setStored((prev) => ({ ...prev, reentryOverrides: prev.reentryOverrides + 1 }));
  }, []);

  const endSession = useCallback(() => {
    setStored((prev) => ({ ...prev, stopped: true }));
  }, []);

  const resetSession = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setReentryCountdown(null);
    setStored((prev) => ({
      ...prev,
      trades: [],
      pnl: 0,
      peakPnl: 0,
      stopped: false,
      reentryOverrides: 0,
    }));
  }, []);

  const tilt = useMemo(
    () =>
      computeTilt(stored.trades, {
        pnl: stored.pnl,
        peakPnl: stored.peakPnl,
        reentryOverrides: stored.reentryOverrides,
      }),
    [stored.trades, stored.pnl, stored.peakPnl, stored.reentryOverrides],
  );

  const sessionStatus = useMemo(() => deriveStatus(stored), [stored]);

  const session = useMemo<SessionState>(
    () => ({
      ...stored,
      reentryCountdown,
      tiltScore: tilt.score,
      tiltDrivers: tilt.drivers,
      sessionStatus,
    }),
    [stored, reentryCountdown, tilt, sessionStatus],
  );

  const value = useMemo<SessionContextType>(
    () => ({
      session,
      hydrated,
      addTrade,
      updateLots,
      updateInstrument,
      startReentryCountdown,
      overrideReentry,
      endSession,
      resetSession,
    }),
    [session, hydrated, addTrade, updateLots, updateInstrument, startReentryCountdown, overrideReentry, endSession, resetSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
