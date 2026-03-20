import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type StatusColor = 'green' | 'yellow' | 'red' | 'blue' | 'muted';

type Props = {
  label: string;
  status?: StatusColor;
};

const statusColors: Record<StatusColor, string> = {
  green: Colors.statusGreen,
  yellow: Colors.statusYellow,
  red: Colors.statusRed,
  blue: Colors.statusBlue,
  muted: Colors.textMuted,
};

export function PillBadge({ label, status = 'muted' }: Props) {
  const color = statusColors[status];
  return (
    <View style={[styles.pill, { borderColor: color, backgroundColor: `${color}18` }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontFamily: 'DMSans_500Medium',
    letterSpacing: 0.4,
  },
});
