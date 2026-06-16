/**
 * Layout tokens + responsive breakpoints.
 *
 * The app's primary target is a ~412dp phone column. On web we keep that
 * single-column feel on narrow viewports, but above `wide` we promote the
 * bottom tab bar to a left sidebar and let content breathe in a centered,
 * max-width column (and the Dashboard reflows into multiple columns).
 */

export const Breakpoints = {
  /** At/above this width (web only) we switch to the sidebar shell. */
  wide: 900,
  /** At/above this width the Dashboard uses its widest multi-column grid. */
  ultrawide: 1280,
} as const;

/** Left navigation sidebar width on wide web. */
export const SIDEBAR_WIDTH = 232;

/** Bottom tab bar height on narrow web (matches the classic tab bar). */
export const WEB_TABBAR_HEIGHT = 84;

/** Max content-column widths, centered within the available area on web. */
export const ContentWidth = {
  /** Single-column screens (Session, Cards, Journal, Trade). */
  column: 720,
  /** The Dashboard's multi-column HUD. */
  dashboard: 1080,
} as const;

/** 4px-based spacing scale (mirrors the design spec tokens). */
export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Corner radii. */
export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;
