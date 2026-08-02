import { useMemo } from 'react';
import {
  X,
  AlertOctagon,
  Activity,
  TrendingDown,
  CornerDownRight,
  Target,
  Hash,
  Clock,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import type { SessionState } from '@/context/SessionContext';
import { Colors } from '@/constants/colors';

type Severity = 'danger' | 'warn' | 'info';

type Alert = {
  key: string;
  severity: Severity;
  Icon: LucideIcon;
  title: string;
  detail: string;
};

const sevColor: Record<Severity, string> = {
  danger: Colors.statusRed,
  warn: Colors.statusYellow,
  info: Colors.statusBlue,
};

/** Live discipline alerts derived from session state (not the demo feed). */
function buildAlerts(s: SessionState): Alert[] {
  const alerts: Alert[] = [];

  if (s.pnl <= s.maxLoss) {
    alerts.push({ key: 'max-loss', severity: 'danger', Icon: AlertOctagon, title: 'Max loss hit', detail: `Session P&L $${s.pnl} is at/below your -$${Math.abs(s.maxLoss)} limit. Stop trading.` });
  }
  if (s.tiltScore >= 60) {
    alerts.push({ key: 'tilt', severity: 'danger', Icon: Activity, title: 'Tilt critical', detail: `Tilt ${s.tiltScore}/100 — step away before the next entry.` });
  } else if (s.tiltScore >= 30) {
    alerts.push({ key: 'tilt', severity: 'warn', Icon: Activity, title: 'Tilt elevated', detail: `Tilt ${s.tiltScore}/100 — slow down and re-check your plan.` });
  }
  if (s.tiltDrivers.consecLosses >= 2) {
    alerts.push({ key: 'consec', severity: 'warn', Icon: TrendingDown, title: `${s.tiltDrivers.consecLosses} consecutive losses`, detail: 'Consider a break — losing streaks compound tilt.' });
  }
  if (s.tiltDrivers.givingBack && s.pnl > s.maxLoss) {
    alerts.push({ key: 'giving-back', severity: 'warn', Icon: CornerDownRight, title: 'Giving back profits', detail: `Down from a peak of $${s.peakPnl} to $${s.pnl}.` });
  }
  if (s.pnl >= s.dailyGoal && !s.tiltDrivers.givingBack) {
    alerts.push({ key: 'at-goal', severity: 'info', Icon: Target, title: 'Daily goal reached', detail: `+$${s.pnl} vs your $${s.dailyGoal} goal. Consider banking the day.` });
  }
  if (s.trades.length >= s.maxTrades) {
    alerts.push({ key: 'max-trades', severity: 'warn', Icon: Hash, title: 'Max trades reached', detail: `${s.trades.length}/${s.maxTrades} trades taken — no fresh entries.` });
  }
  if (s.reentryCountdown != null) {
    alerts.push({ key: 'reentry', severity: 'warn', Icon: Clock, title: 'Reentry cooldown active', detail: `${s.reentryCountdown}s remaining before re-entry is allowed.` });
  }
  return alerts;
}

export function Notifications() {
  const { session } = useSession();
  const navigate = useNavigate();
  const alerts = useMemo(() => buildAlerts(session), [session]);
  const close = () => (window.history.length > 1 ? navigate(-1) : navigate('/'));

  return (
    <div className="min-h-screen overflow-y-auto bg-canvas">
      <div className="mx-auto w-full max-w-2xl px-6 py-6">
        <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
          <h1 className="text-sm font-bold uppercase tracking-[0.1em] text-fg">Notifications</h1>
          <button type="button" onClick={close} aria-label="Close notifications" className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-mute transition-colors hover:bg-panel-hi hover:text-fg">
            <X size={20} />
          </button>
        </div>

        {alerts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 pt-16 text-center">
            <CheckCircle size={32} className="text-up" />
            <p className="text-base font-bold text-fg">All clear</p>
            <p className="text-[13px] text-fg-mute">No discipline alerts right now. Trade your plan.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {alerts.map((a) => {
              const color = sevColor[a.severity];
              return (
                <div key={a.key} className="flex gap-3 rounded-xl border border-line bg-panel p-3.5" style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
                  <a.Icon size={18} color={color} className="mt-px shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold" style={{ color }}>{a.title}</span>
                    <span className="text-[13px] leading-[18px] text-fg-dim">{a.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
