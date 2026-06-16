import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { ContentWidth, Space } from '@/constants/layout';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Screen } from '@/components/shared/Screen';
import { RegimeBadge } from '@/components/dashboard/RegimeBadge';
import { ContextTile } from '@/components/dashboard/ContextTile';
import { SignalStrip } from '@/components/dashboard/SignalStrip';
import { SessionBar } from '@/components/dashboard/SessionBar';
import { TiltMeterCompact } from '@/components/dashboard/TiltMeterCompact';
import { AlertFeed } from '@/components/dashboard/AlertFeed';

export default function DashboardScreen() {
  const { isWide } = useResponsiveLayout();

  const contextGrid = (
    <>
      <View style={styles.sectionLabel}>
        <Text style={styles.sectionLabelText}>CONTEXT · LAYER 1</Text>
      </View>
      <View style={styles.contextGrid}>
        <View style={styles.contextRow}>
          <ContextTile label="VWAP" value="5,214.50" subtitle="▲ Above" trend="up" />
          <ContextTile label="IV / RV" value="0.87" subtitle="Compressed" trend="neutral" />
        </View>
        <View style={styles.contextRow}>
          <ContextTile label="POC" value="5,208.25" subtitle="Prev Session" trend="neutral" />
          <ContextTile label="ATR" value="12.5" subtitle="Normal" trend="neutral" />
        </View>
      </View>
    </>
  );

  return (
    <Screen
      maxWidth={ContentWidth.dashboard}
      header={
        <View style={styles.appBar}>
          <Text style={styles.brand}>TRADESLAYER</Text>
          <View style={styles.actions}>
            <Pressable style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Settings">
              <Feather name="settings" size={18} color={Colors.textMuted} />
            </Pressable>
            <Pressable style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Notifications">
              <Feather name="bell" size={18} color={Colors.textMuted} />
            </Pressable>
          </View>
        </View>
      }
    >
      {isWide ? (
        // Wide web: two-column HUD — market context left, session/risk right.
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <RegimeBadge />
            {contextGrid}
            <SignalStrip />
          </View>
          <View style={styles.col}>
            <SessionBar />
            <TiltMeterCompact />
            <AlertFeed />
          </View>
        </View>
      ) : (
        <>
          <RegimeBadge />
          {contextGrid}
          <SignalStrip />
          <SessionBar />
          <TiltMeterCompact />
          <AlertFeed />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    color: Colors.accentPrimary,
    letterSpacing: 2,
  },
  actions: { flexDirection: 'row', gap: Space.xs },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  twoCol: {
    flexDirection: 'row',
    gap: Space.lg,
    alignItems: 'flex-start',
  },
  col: { flex: 1, minWidth: 0, gap: Space.md },
  sectionLabel: { marginTop: Space.xs },
  sectionLabelText: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  contextGrid: { gap: Space.sm },
  contextRow: { flexDirection: 'row', gap: Space.sm },
});
