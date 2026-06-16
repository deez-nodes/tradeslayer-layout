import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Breakpoints, WEB_TABBAR_HEIGHT, Space } from '@/constants/layout';

export type NavMode = 'bottom' | 'sidebar';

export type ResponsiveLayout = {
  width: number;
  height: number;
  isWeb: boolean;
  /** Web viewport wide enough for the sidebar shell + multi-column content. */
  isWide: boolean;
  /** Web viewport at the widest tier (roomy multi-column dashboard). */
  isUltrawide: boolean;
  navMode: NavMode;
  /** Top padding for a screen's app bar (clears the OS status bar on native). */
  headerPaddingTop: number;
  /** Bottom padding for scroll content so it clears the active nav. */
  contentPaddingBottom: number;
};

/**
 * Single source of truth for responsive behavior. Native always renders the
 * phone layout; only web opts into the wide/sidebar tiers. Centralizes the
 * status-bar / tab-bar padding math that used to be duplicated (as magic
 * numbers) across every screen.
 */
export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const isWide = isWeb && width >= Breakpoints.wide;
  const isUltrawide = isWeb && width >= Breakpoints.ultrawide;
  const navMode: NavMode = isWide ? 'sidebar' : 'bottom';

  const headerPaddingTop = isWeb ? Space.xl : insets.top + Space.sm;

  // Sidebar mode has no bottom bar; narrow web keeps the 84px classic bar.
  const contentPaddingBottom = isWide
    ? Space.xxl
    : isWeb
      ? WEB_TABBAR_HEIGHT + Space.xxl
      : insets.bottom + 80;

  return {
    width,
    height,
    isWeb,
    isWide,
    isUltrawide,
    navMode,
    headerPaddingTop,
    contentPaddingBottom,
  };
}
