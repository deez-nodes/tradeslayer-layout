import { Activity, Shield, RefreshCw, Layers, BookOpen, type LucideIcon } from 'lucide-react';

export type NavItem = {
  /** Route path used by the sidebar (NavLink) and active matching. */
  path: '/' | '/session' | '/trade' | '/cards' | '/journal';
  label: string;
  Icon: LucideIcon;
};

/** Single source of truth for the primary (sidebar) navigation. */
export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard', Icon: Activity },
  { path: '/session', label: 'Session', Icon: Shield },
  { path: '/trade', label: 'Trade', Icon: RefreshCw },
  { path: '/cards', label: 'Cards', Icon: Layers },
  { path: '/journal', label: 'Journal', Icon: BookOpen },
];
