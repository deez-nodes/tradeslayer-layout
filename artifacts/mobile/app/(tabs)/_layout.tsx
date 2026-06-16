import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { OrderProvider } from '@/context/OrderContext';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { SideNav } from '@/components/shared/SideNav';
import { HardStopOverlay } from '@/components/session/HardStopOverlay';

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'chart.xyaxis.line', selected: 'chart.xyaxis.line' }} />
        <Label>Dashboard</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="session">
        <Icon sf={{ default: 'shield', selected: 'shield.fill' }} />
        <Label>Session</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="trade">
        <Icon sf={{ default: 'arrow.up.arrow.down.circle', selected: 'arrow.up.arrow.down.circle.fill' }} />
        <Label>Trade</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cards">
        <Icon sf={{ default: 'square.stack', selected: 'square.stack.fill' }} />
        <Label>Cards</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journal">
        <Icon sf={{ default: 'book', selected: 'book.fill' }} />
        <Label>Journal</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout({ hideTabBar = false }: { hideTabBar?: boolean }) {
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  const TabIcon = ({
    sfSymbol,
    featherName,
    color,
    size,
  }: {
    sfSymbol: SymbolViewProps['name'];
    featherName: string;
    color: string;
    size: number;
  }) => {
    if (isIOS) {
      return <SymbolView name={sfSymbol} tintColor={color} size={size} />;
    }
    return <Feather name={featherName as any} size={size} color={color} />;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accentPrimary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: hideTabBar
          ? { display: 'none' }
          : {
              position: 'absolute',
              backgroundColor: isIOS ? 'transparent' : Colors.tabBarBg,
              borderTopWidth: 1,
              borderTopColor: Colors.tabBarBorder,
              elevation: 0,
              height: isWeb ? 84 : 56,
              paddingBottom: isWeb ? 34 : 0,
            },
        tabBarLabelStyle: {
          fontFamily: 'DMSans_500Medium',
          fontSize: 10,
          marginTop: 2,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={90}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: Colors.tabBarBg }]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <TabIcon sfSymbol="chart.xyaxis.line" featherName="activity" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="session"
        options={{
          title: 'Session',
          tabBarIcon: ({ color, size }) => (
            <TabIcon sfSymbol="shield.fill" featherName="shield" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: 'Trade',
          tabBarIcon: ({ color, size }) => (
            <TabIcon sfSymbol="arrow.up.arrow.down.circle.fill" featherName="refresh-cw" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color, size }) => (
            <TabIcon sfSymbol="square.stack.fill" featherName="layers" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color: col, size }) => (
            <TabIcon sfSymbol="book.fill" featherName="book" color={col} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

/**
 * Web/Android shell. On wide web we promote the bottom tab bar to a left
 * sidebar (the tab navigator stays mounted for routing, its bar hidden); on
 * narrow web/Android it stays a classic bottom tab bar.
 */
function ResponsiveShell() {
  const { isWide } = useResponsiveLayout();
  return (
    <View style={styles.shell}>
      {isWide && <SideNav />}
      <View style={styles.shellMain}>
        <ClassicTabLayout hideTabBar={isWide} />
      </View>
    </View>
  );
}

function TabNavigation() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ResponsiveShell />;
}

export default function TabLayout() {
  return (
    <OrderProvider>
      <TabNavigation />
      <HardStopOverlay />
    </OrderProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.bgPrimary,
  },
  // minWidth: 0 lets the flex child shrink instead of overflowing on web.
  shellMain: { flex: 1, minWidth: 0 },
});
