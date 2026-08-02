import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Settings, Bell } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/nav';
import { cn } from '@/lib/cn';
import { Colors } from '@/constants/colors';
import { IconButton } from '@/components/ui';
import { useSession } from '@/context/SessionContext';

const statusTone: Record<string, string> = {
  active: Colors.statusGreen,
  at_goal: Colors.statusBlue,
  giving_back: Colors.statusYellow,
  max_loss: Colors.statusRed,
  stopped: Colors.textMuted,
};

function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-[#0d1220] md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-line px-5">
        <span className="font-mono text-[15px] font-bold tracking-[0.18em] text-accent">TRADESLAYER</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-fg-dim hover:bg-panel-hi hover:text-fg',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line px-5 py-4 text-[11px] text-fg-mute">
        Local-first · demo data
      </div>
    </aside>
  );
}

function TopBar() {
  const navigate = useNavigate();
  const { session } = useSession();
  const tone = statusTone[session.sessionStatus] ?? Colors.textMuted;
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
      <div className="flex items-center gap-3">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: tone, boxShadow: `0 0 8px ${tone}` }}
        />
        <span className="text-[11px] uppercase tracking-wider text-fg-mute">Session P&L</span>
        <span
          className="font-mono text-lg font-bold"
          style={{ color: session.pnl >= 0 ? Colors.statusGreen : Colors.statusRed }}
        >
          {session.pnl >= 0 ? '+' : ''}${session.pnl}
        </span>
        <span className="font-mono text-xs text-fg-mute">
          {session.trades.length} trades · tilt {session.tiltScore}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <IconButton label="Settings" onClick={() => navigate('/settings')}>
          <Settings size={18} />
        </IconButton>
        <IconButton label="Notifications" onClick={() => navigate('/notifications')}>
          <Bell size={18} />
        </IconButton>
      </div>
    </header>
  );
}

/** Desktop app frame: fixed sidebar + top bar + routed content. */
export function Shell() {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas text-fg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
