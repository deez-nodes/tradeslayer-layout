import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { StrategyCard } from '@/data/strategyCards';

type Props = {
  card: StrategyCard;
  onPress: () => void;
};

const categoryColors: Record<string, string> = {
  Trend: Colors.catTrend,
  Momentum: Colors.catMomentum,
  'Mean Rev': Colors.catMeanRev,
  Breakout: Colors.catBreakout,
};

const riskColors: Record<string, string> = {
  Low: Colors.statusGreen,
  Medium: Colors.statusYellow,
  High: Colors.statusRed,
};

export function StrategyCardItem({ card, onPress }: Props) {
  const catColor = categoryColors[card.category] ?? Colors.textMuted;
  const riskColor = riskColors[card.risk] ?? Colors.textMuted;
  const tier1Met = card.tier1.filter(t => t.checked).length;
  const tier2Weight = card.tier2.filter(t => t.active).reduce((a, b) => a + b.weight, 0);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.85 : 1, borderLeftColor: catColor }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: catColor }]} />
        <Text style={styles.category}>{card.category.toUpperCase()}</Text>
        <View style={styles.spacer} />
        <Feather name="bookmark" size={16} color={Colors.textMuted} />
      </View>

      <Text style={styles.name}>{card.name}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>{card.subtitle}</Text>

      <View style={styles.footer}>
        <View style={styles.tags}>
          {card.timeframes.map(tf => (
            <View key={tf} style={styles.tag}>
              <Text style={styles.tagText}>{tf}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.riskBadge, { borderColor: `${riskColor}50`, backgroundColor: `${riskColor}15` }]}>
          <Text style={[styles.riskText, { color: riskColor }]}>{card.risk}</Text>
        </View>
      </View>

      <View style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>T1: {tier1Met}/{card.tier1.length}</Text>
        <View style={styles.scoreDivider} />
        <Text style={[styles.scoreLabel, { color: tier2Weight > 0 ? Colors.statusYellow : Colors.statusGreen }]}>
          Flags: {tier2Weight}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderLeftWidth: 3,
    padding: 14,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  category: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  spacer: { flex: 1 },
  name: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textSecondary,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  riskText: {
    fontSize: 11,
    fontFamily: 'DMSans_500Medium',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  scoreLabel: {
    fontSize: 11,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  scoreDivider: {
    width: 1,
    height: 10,
    backgroundColor: Colors.borderDefault,
  },
});
