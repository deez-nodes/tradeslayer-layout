/**
 * Tilt scoring — turns real session behavior into the 0–100 "tilt" score and
 * its three drivers (the spec's Consec Losses / Giving Back / Fast Reentry).
 *
 * Pure and structural (no React, no Trade import) so it's trivially testable
 * and free of circular deps. Replaces the previously hardcoded `tiltScore: 18`
 * and the always-green driver chips.
 */

export type TiltDrivers = {
  /** Trailing consecutive losing trades. */
  consecLosses: number;
  /** P&L has fallen below 50% of the session peak. */
  givingBack: boolean;
  /** Re-entered inside the cooldown (override) or <60s after the prior trade. */
  fastReentry: boolean;
};

export type TiltResult = {
  score: number;
  drivers: TiltDrivers;
};

type TiltTrade = { pnl: number; at?: number; override?: number };

type TiltContext = {
  pnl: number;
  peakPnl: number;
  /** Count of reentry-cooldown overrides this session. */
  reentryOverrides?: number;
};

const FAST_REENTRY_MS = 60_000;

export function computeTilt(trades: TiltTrade[], ctx: TiltContext): TiltResult {
  // Trailing consecutive losses.
  let consecLosses = 0;
  for (let i = trades.length - 1; i >= 0; i--) {
    if (trades[i].pnl < 0) consecLosses++;
    else break;
  }

  const givingBack = ctx.peakPnl > 0 && ctx.pnl < ctx.peakPnl * 0.5;

  const reentryOverrides = ctx.reentryOverrides ?? 0;
  let fastReentry = reentryOverrides > 0;
  if (!fastReentry && trades.length >= 2) {
    const last = trades[trades.length - 1].at;
    const prev = trades[trades.length - 2].at;
    if (last != null && prev != null && last - prev < FAST_REENTRY_MS) {
      fastReentry = true;
    }
  }

  const totalOverrides =
    trades.reduce((n, t) => n + (t.override ?? 0), 0) + reentryOverrides;

  // Weighted, monotonic contributions (clamped to 0–100).
  const consecPts = [0, 12, 28, 45][Math.min(consecLosses, 3)];
  const givingBackPts = givingBack ? 22 : 0;
  const fastReentryPts = fastReentry ? 18 : 0;
  const overridePts = Math.min(totalOverrides * 8, 20);

  const score = Math.max(
    0,
    Math.min(100, consecPts + givingBackPts + fastReentryPts + overridePts),
  );

  return { score, drivers: { consecLosses, givingBack, fastReentry } };
}
