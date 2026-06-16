import type { ComponentProps } from 'react';
import type { Feather } from '@expo/vector-icons';

export type NavItem = {
  /** Expo Router screen name within the (tabs) group. */
  name: 'index' | 'session' | 'trade' | 'cards' | 'journal';
  /** Route path used by the sidebar (router.replace) and active matching. */
  path: '/' | '/session' | '/trade' | '/cards' | '/journal';
  label: string;
  feather: ComponentProps<typeof Feather>['name'];
};

/** Single source of truth for the primary navigation (bottom tabs + sidebar). */
export const NAV_ITEMS: NavItem[] = [
  { name: 'index', path: '/', label: 'Dashboard', feather: 'activity' },
  { name: 'session', path: '/session', label: 'Session', feather: 'shield' },
  { name: 'trade', path: '/trade', label: 'Trade', feather: 'refresh-cw' },
  { name: 'cards', path: '/cards', label: 'Cards', feather: 'layers' },
  { name: 'journal', path: '/journal', label: 'Journal', feather: 'book' },
];
