import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { SIDEBAR_WIDTH, Space, Radius } from '@/constants/layout';
import { NAV_ITEMS, type NavItem } from '@/constants/nav';

/**
 * Desktop/wide-web left navigation. Rendered as a sibling of the tab navigator
 * (the bottom bar is hidden in this mode), so it drives routing via expo-router
 * directly — decoupled from React Navigation's bottom-tab internals.
 */
export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Feather name="activity" size={16} color={Colors.bgPrimary} />
        </View>
        <View>
          <Text style={styles.brand}>TRADESLAYER</Text>
          <Text style={styles.brandSub}>PRO</Text>
        </View>
      </View>

      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavRow
            key={item.name}
            item={item}
            active={isActive(pathname, item.path)}
            onPress={() => router.replace(item.path)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Discipline over impulse.</Text>
      </View>
    </View>
  );
}

function isActive(pathname: string, path: NavItem['path']): boolean {
  if (path === '/') return pathname === '/' || pathname === '/index';
  return pathname === path || pathname.startsWith(`${path}/`);
}

function NavRow({
  item,
  active,
  onPress,
}: {
  item: NavItem;
  active: boolean;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const tint = active ? Colors.accentPrimary : hovered ? Colors.textPrimary : Colors.textMuted;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={item.label}
      style={[
        styles.navRow,
        (active || hovered) && styles.navRowActive,
        active && styles.navRowSelected,
      ]}
    >
      {active && <View style={styles.activeBar} />}
      <Feather name={item.feather} size={18} color={tint} />
      <Text style={[styles.navLabel, { color: tint }]}>{item.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: Colors.tabBarBg,
    borderRightWidth: 1,
    borderRightColor: Colors.tabBarBorder,
    paddingVertical: Space.xxl,
    paddingHorizontal: Space.md,
    justifyContent: 'flex-start',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    paddingHorizontal: Space.sm,
    marginBottom: Space.xxxl,
  },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
    color: Colors.accentPrimary,
    letterSpacing: 1.5,
  },
  brandSub: {
    fontSize: 9,
    fontFamily: 'DMSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 3,
  },
  nav: { gap: Space.xs },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    paddingVertical: Space.md,
    paddingHorizontal: Space.md,
    borderRadius: Radius.md,
  },
  navRowActive: { backgroundColor: Colors.bgCardHover },
  navRowSelected: { backgroundColor: Colors.accentPrimaryDim },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentPrimary,
  },
  navLabel: {
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: Space.sm,
    paddingTop: Space.lg,
  },
  footerText: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
