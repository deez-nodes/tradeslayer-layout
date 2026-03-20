import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type Props = {
  status: 'green' | 'yellow' | 'red' | 'blue';
  size?: number;
};

const statusColors = {
  green: Colors.statusGreen,
  yellow: Colors.statusYellow,
  red: Colors.statusRed,
  blue: Colors.statusBlue,
};

export function StatusDot({ status, size = 8 }: Props) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: statusColors[status],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {},
});
