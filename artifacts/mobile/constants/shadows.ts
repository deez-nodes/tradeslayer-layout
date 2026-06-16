import { Platform, type ViewStyle } from 'react-native';

/**
 * Elevation tokens from the design spec. On web we emit the exact CSS box
 * shadow; on native we use RN's shadow* props (+ Android elevation).
 */
export const Shadow: { card: ViewStyle; elevated: ViewStyle } = {
  card: Platform.select({
    web: { boxShadow: '0 1px 3px rgba(0,0,0,0.3)' } as ViewStyle,
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
  }) as ViewStyle,
  elevated: Platform.select({
    web: { boxShadow: '0 8px 24px rgba(0,0,0,0.5)' } as ViewStyle,
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 12,
    },
  }) as ViewStyle,
};
