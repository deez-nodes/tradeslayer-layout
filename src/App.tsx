import { Routes, Route } from 'react-router-dom';
import { SessionProvider } from '@/context/SessionContext';
import { OrderProvider } from '@/context/OrderContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Shell } from '@/components/Shell';
import { HardStopOverlay } from '@/components/session/HardStopOverlay';
import { Dashboard } from '@/screens/Dashboard';
import { Trade } from '@/screens/Trade';
import { Session } from '@/screens/Session';
import { Journal } from '@/screens/Journal';
import { Cards } from '@/screens/Cards';
import { Settings } from '@/screens/Settings';
import { Notifications } from '@/screens/Notifications';

export function App() {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <OrderProvider>
          <Routes>
            <Route element={<Shell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/session" element={<Session />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/cards" element={<Cards />} />
            </Route>
            {/* Full-screen overlay routes */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
          <HardStopOverlay />
        </OrderProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
