import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { ContentWidth, Space } from '@/constants/layout';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

type ScreenProps = {
  /** App-bar content (a row is provided; you fill it). */
  header: React.ReactNode;
  /** Optional non-scrolling region directly under the app bar (e.g. search). */
  subHeader?: React.ReactNode;
  children: React.ReactNode;
  /** Wrap children in a ScrollView (default true). */
  scroll?: boolean;
  /** Centered content-column max width on web. */
  maxWidth?: number;
  /** Padding/gap applied to the centered content column. */
  contentStyle?: StyleProp<ViewStyle>;
  /** Keep taps working while a keyboard is up. */
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
};

/**
 * Standard screen chrome: a full-bleed app bar (with a centered inner row on
 * wide web), an optional sub-header, and a centered, max-width content column.
 * Replaces the per-screen `paddingTop: isWeb ? 67` / `paddingBottom: isWeb ?
 * 34 + 84` magic numbers with one responsive source of truth.
 */
export function Screen({
  header,
  subHeader,
  children,
  scroll = true,
  maxWidth = ContentWidth.column,
  contentStyle,
  keyboardShouldPersistTaps = 'handled',
}: ScreenProps) {
  const { headerPaddingTop, contentPaddingBottom, isWide } = useResponsiveLayout();

  const centered: StyleProp<ViewStyle> = [
    styles.column,
    { width: '100%', maxWidth },
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.appBarOuter, { paddingTop: headerPaddingTop }]}>
        <View style={[styles.appBarInner, isWide && { maxWidth, alignSelf: 'center' }]}>
          {header}
        </View>
      </View>

      {subHeader != null && (
        <View style={styles.subHeaderOuter}>
          <View style={[styles.subHeaderInner, isWide && { maxWidth, alignSelf: 'center' }]}>
            {subHeader}
          </View>
        </View>
      )}

      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: contentPaddingBottom },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          <View style={[centered, contentStyle]}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.flexFill, { paddingBottom: contentPaddingBottom }]}>
          <View style={[centered, styles.flexFill, contentStyle]}>{children}</View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPrimary },
  appBarOuter: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  appBarInner: {
    width: '100%',
    paddingHorizontal: Space.lg,
    paddingBottom: Space.md,
  },
  subHeaderOuter: { width: '100%' },
  subHeaderInner: { width: '100%' },
  scroll: { flex: 1 },
  scrollContent: { alignItems: 'center' },
  column: { alignSelf: 'center', padding: Space.lg, gap: Space.md },
  flexFill: { flex: 1 },
});
