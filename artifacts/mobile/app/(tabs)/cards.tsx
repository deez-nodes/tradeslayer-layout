import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { strategyCards } from '@/data/strategyCards';
import { StrategyCardItem } from '@/components/cards/StrategyCardItem';
import { StrategyCardDetail } from '@/components/cards/StrategyCardDetail';

const CATEGORIES = ['All', 'Trend', 'Momentum', 'Mean Rev', 'Breakout'] as const;

export default function CardsScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return strategyCards.filter(card => {
      const matchCat = activeCategory === 'All' || card.category === activeCategory;
      const matchSearch =
        !search ||
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const selectedCard = strategyCards.find(c => c.id === selectedCardId) ?? null;

  return (
    <View style={[styles.root, { backgroundColor: Colors.bgPrimary }]}>
      {/* App bar */}
      <View style={[styles.appBar, { paddingTop: isWeb ? 67 : insets.top + 8 }]}>
        <View>
          <Text style={styles.appBarTitle}>Strategy Cards</Text>
          <Text style={styles.appBarSub}>{strategyCards.length} trading playbooks</Text>
        </View>
        <View style={styles.appBarActions}>
          <Feather name="edit-2" size={18} color={Colors.textMuted} />
          <Feather name="trending-up" size={18} color={Colors.textMuted} />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Feather name="search" size={15} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search strategies..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Feather name="x" size={15} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map(cat => (
          <Pressable
            key={cat}
            style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Card list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="layers" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No strategies match</Text>
          </View>
        ) : (
          filtered.map(card => (
            <StrategyCardItem
              key={card.id}
              card={card}
              onPress={() => setSelectedCardId(card.id)}
            />
          ))
        )}
      </ScrollView>

      {selectedCard && (
        <StrategyCardDetail
          card={selectedCard}
          visible={!!selectedCardId}
          onClose={() => setSelectedCardId(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  appBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  appBarTitle: {
    fontSize: 20,
    fontFamily: 'DMSans_700Bold',
    color: Colors.textPrimary,
  },
  appBarSub: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
    marginTop: 2,
  },
  appBarActions: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textPrimary,
  },
  categoryScroll: { flexGrow: 0 },
  categoryContent: {
    paddingHorizontal: 12,
    gap: 8,
    paddingBottom: 10,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.bgCard,
  },
  catChipActive: {
    borderColor: Colors.accentPrimary,
    backgroundColor: `${Colors.accentPrimary}20`,
  },
  catText: {
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
  },
  catTextActive: { color: Colors.accentPrimary },
  scroll: { flex: 1 },
  content: { padding: 12, gap: 10 },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
  },
});
