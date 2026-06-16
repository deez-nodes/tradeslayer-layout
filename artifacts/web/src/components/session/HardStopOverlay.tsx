import { AlertOctagon, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { Colors } from '@/constants/colors';
import { Stat } from '@/components/ui';

/**
 * Global hard-stop. When session P&L breaches the daily max loss, a blocking
 * "SESSION OVER" overlay appears. Acknowledging ends the session (status →
 * 'stopped'), which clears the 'max_loss' condition and dismisses the overlay.
 */
export function HardStopOverlay() {
  const { session, endSession } = useSession();
  const navigate = useNavigate();

  if (session.sessionStatus !== 'max_loss') return null;

  const tiltPeak = Math.max(session.tiltScore, ...session.trades.map((t) => t.tilt), 0);
  const close = () => endSession();
  const viewJournal = () => {
    endSession();
    navigate('/journal');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(2,4,10,0.88)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border bg-elevated p-7 text-center shadow-2xl"
        style={{ borderColor: `${Colors.statusRed}55` }}
      >
        <div
          className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: `${Colors.statusRed}20` }}
        >
          <AlertOctagon size={34} color={Colors.statusRed} />
        </div>
        <h2 className="text-2xl font-bold tracking-wide text-down">SESSION OVER</h2>
        <p className="text-sm text-fg-dim">Daily max loss reached</p>

        <div className="mt-4 mb-1 flex w-full items-center justify-between">
          <Stat label="Net P&L" value={`${session.pnl >= 0 ? '+' : ''}$${session.pnl}`} color={Colors.statusRed} />
          <div className="h-7 w-px bg-line" />
          <Stat label="Trades" value={`${session.trades.length}`} />
          <div className="h-7 w-px bg-line" />
          <Stat label="Tilt peak" value={`${tiltPeak}`} color={tiltPeak > 60 ? Colors.statusRed : Colors.textPrimary} />
        </div>

        <p className="mt-3 text-[13px] text-fg-mute">Review your journal entry before tomorrow.</p>

        <button
          type="button"
          onClick={viewJournal}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold tracking-wide"
          style={{ color: Colors.bgPrimary }}
        >
          <BookOpen size={15} color={Colors.bgPrimary} />
          VIEW JOURNAL
        </button>
        <button
          type="button"
          onClick={close}
          className="mt-1 w-full py-2.5 text-sm font-medium text-fg-mute transition-colors hover:text-fg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
