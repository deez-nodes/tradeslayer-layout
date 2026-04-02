import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { RegimeBadge } from '@/components/dashboard/RegimeBadge';
import { ContextTile } from '@/components/dashboard/ContextTile';
import { SignalStrip } from '@/components/dashboard/SignalStrip';
import { SessionBar } from '@/components/dashboard/SessionBar';
import { TiltMeterCompact } from '@/components/dashboard/TiltMeterCompact';
import { AlertFeed } from '@/components/dashboard/AlertFeed';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.root, { backgroundColor: Colors.bgPrimary }]}>
      {/* App bar */}
      <View style={[styles.appBar, { paddingTop: isWeb ? 67 : insets.top + 8 }]}>
        <Text style={styles.brand}>TRADESLAYER</Text>
        <View style={styles.actions}>
          <Pressable style={styles.iconBtn}>
            <Feather name="settings" size={18} color={Colors.textMuted} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Feather name="bell" size={18} color={Colors.textMuted} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Layer 0 - Regime */}
        <RegimeBadge />

        {/* Layer 1 - Context 2×2 grid */}
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

        {/* Layer 2 - Signals */}
        <SignalStrip />

        {/* Session snapshot */}
        <SessionBar />

        {/* Tilt compact */}
        <TiltMeterCompact />

        {/* Alert feed */}
        <AlertFeed />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  brand: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    color: Colors.accentPrimary,
    letterSpacing: 2,
  },
  actions: { flexDirection: 'row', gap: 4 },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  sectionLabel: { marginTop: 4 },
  sectionLabelText: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  contextGrid: { gap: 8 },
  contextRow: { flexDirection: 'row', gap: 8 },
});
