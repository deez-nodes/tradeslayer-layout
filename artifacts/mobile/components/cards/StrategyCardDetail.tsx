import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { Shadow } from '@/constants/shadows';
import { StrategyCard } from '@/data/strategyCards';
import { useSession } from '@/context/SessionContext';

type Props = {
  card: StrategyCard;
  visible: boolean;
  onClose: () => void;
};

const categoryColors: Record<string, string> = {
  Trend: Colors.catTrend,
  Momentum: Colors.catMomentum,
  'Mean Rev': Colors.catMeanRev,
  Breakout: Colors.catBreakout,
};

export function StrategyCardDetail({ card, visible, onClose }: Props) {
  const { session, addTrade } = useSession();
  const [tier1, setTier1] = useState(card.tier1);
  const [tier2, setTier2] = useState(card.tier2);
  const [tier3, setTier3] = useState(card.tier3);

  // Open a journal entry from this card: an executed entry at the session's
  // current instrument/lots, P&L unrealized (0) until an exit is recorded —
  // mirroring how OrderContext bridges a filled order into the journal.
  const handleLogTrade = () => {
    addTrade({
      strategy: card.name,
      instrument: session.instrument,
      pnl: 0,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration: '—',
      lots: session.lots,
      tilt: session.tiltScore,
      override: 0,
      exitType: 'Manual',
      at: Date.now(),
      source: 'manual',
    });
    onClose();
    router.navigate('/journal');
  };

  const catColor = categoryColors[card.category] ?? Colors.accentPrimary;
  const t1Score = tier1.filter(t => t.checked).length;
  const t2Weight = tier2.filter(t => t.active).reduce((a, b) => a + b.weight, 0);
  const t1Status = t1Score >= tier1.length * 0.75 ? 'green' : t1Score >= tier1.length * 0.5 ? 'yellow' : 'red';
  const t2Status = t2Weight === 0 ? 'green' : t2Weight <= 2 ? 'yellow' : 'red';
  const t1Color = t1Status === 'green' ? Colors.statusGreen : t1Status === 'yellow' ? Colors.statusYellow : Colors.statusRed;
  const t2Color = t2Status === 'green' ? Colors.statusGreen : t2Status === 'yellow' ? Colors.statusYellow : Colors.statusRed;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={onClose} accessibilityRole="button" accessibilityLabel="Back">
            <Feather name="arrow-left" size={20} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>{card.name}</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.regimeBanner, { borderLeftColor: catColor }]}>
            <Text style={styles.regimeLabel}>Regime compatible</Text>
            <Text style={[styles.regimeValue, { color: catColor }]}>{session.regime} — Aligned</Text>
          </View>

          {/* Tier 1 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>TIER 1 — CONDITIONS</Text>
              <Text style={[styles.sectionScore, { color: t1Color }]}>{t1Score}/{tier1.length} met</Text>
            </View>
            {tier1.map((item, i) => (
              <Pressable
                key={i}
                style={styles.checkRow}
                onPress={() => {
                  const next = [...tier1];
                  next[i] = { ...next[i], checked: !next[i].checked };
                  setTier1(next);
                }}
              >
                <View style={[styles.checkbox, item.checked && { backgroundColor: Colors.accentPrimary, borderColor: Colors.accentPrimary }]}>
                  {item.checked && <Feather name="check" size={11} color={Colors.bgPrimary} />}
                </View>
                <Text style={[styles.checkLabel, { color: item.checked ? Colors.textPrimary : Colors.textSecondary }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tier 2 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>TIER 2 — RED FLAGS</Text>
              <Text style={[styles.sectionScore, { color: t2Color }]}>Weight: {t2Weight}</Text>
            </View>
            {tier2.map((item, i) => (
              <Pressable
                key={i}
                style={styles.checkRow}
                onPress={() => {
                  const next = [...tier2];
                  next[i] = { ...next[i], active: !next[i].active };
                  setTier2(next);
                }}
              >
                <View style={[styles.checkbox, item.active && { backgroundColor: Colors.statusRed, borderColor: Colors.statusRed }]}>
                  {item.active && <Feather name="x" size={11} color="#fff" />}
                </View>
                <Text style={[styles.checkLabel, { color: item.active ? Colors.statusRed : Colors.textSecondary }]}>
                  {item.label}
                </Text>
                <View style={styles.spacer} />
                <Text style={[styles.weight, { color: item.active ? Colors.statusRed : Colors.textMuted }]}>
                  ×{item.weight}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tier 3 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TIER 3 — EXECUTION</Text>
            {tier3.map((item, i) => (
              <Pressable
                key={i}
                style={styles.checkRow}
                onPress={() => {
                  const next = [...tier3];
                  next[i] = { ...next[i], checked: !next[i].checked };
                  setTier3(next);
                }}
              >
                <View style={[styles.checkbox, item.checked && { backgroundColor: Colors.statusBlue, borderColor: Colors.statusBlue }]}>
                  {item.checked && <Feather name="check" size={11} color="#fff" />}
                </View>
                <Text style={[styles.checkLabel, { color: item.checked ? Colors.textPrimary : Colors.textSecondary }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Cross-cutting */}
          <View style={styles.crossSection}>
            <Text style={styles.sectionTitle}>CROSS-CUTTING</Text>
            <View style={styles.crossGrid}>
              <View style={styles.crossItem}>
                <Text style={styles.crossLabel}>Tilt</Text>
                <Text style={[styles.crossValue, { color: session.tiltScore < 30 ? Colors.statusGreen : Colors.statusYellow }]}>
                  {session.tiltScore}
                </Text>
              </View>
              <View style={styles.crossItem}>
                <Text style={styles.crossLabel}>Reentry</Text>
                <Text style={[styles.crossValue, { color: Colors.statusGreen }]}>
                  {session.reentryCountdown === null ? 'Clear' : `${session.reentryCountdown}s`}
                </Text>
              </View>
              <View style={styles.crossItem}>
                <Text style={styles.crossLabel}>Trades</Text>
                <Text style={styles.crossValue}>{session.trades.length}/{session.maxTrades}</Text>
              </View>
            </View>
          </View>

          <Pressable style={styles.ctaButton} onPress={handleLogTrade} accessibilityRole="button" accessibilityLabel="Log trade with this card">
            <Text style={styles.ctaText}>LOG TRADE WITH THIS CARD</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    ...Shadow.elevated,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
  scroll: { flex: 1 },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  regimeBanner: {
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderLeftWidth: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regimeLabel: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  regimeValue: {
    fontSize: 13,
    fontFamily: 'DMSans_700Bold',
  },
  section: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 14,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  sectionScore: {
    fontSize: 12,
    fontFamily: Fonts.monoBold,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 32,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabel: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    flex: 1,
  },
  spacer: { flex: 1 },
  weight: {
    fontSize: 11,
    fontFamily: Fonts.monoBold,
  },
  crossSection: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 14,
    gap: 12,
  },
  crossGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  crossItem: {
    alignItems: 'center',
    gap: 4,
  },
  crossLabel: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
  crossValue: {
    fontSize: 18,
    fontFamily: Fonts.monoBold,
    color: Colors.textPrimary,
  },
  ctaButton: {
    backgroundColor: Colors.accentPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  ctaText: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
    color: Colors.bgPrimary,
    letterSpacing: 1,
  },
});
