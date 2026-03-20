import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

type Props = {
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  height?: number;
  borderRadius?: number;
};

export function ProgressBar({
  progress,
  color = Colors.accentPrimary,
  trackColor = Colors.borderDefault,
  height = 6,
  borderRadius = 3,
}: Props) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(Math.max(progress, 0), 1), { duration: 600 });
  }, [progress]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius }]}>
      <Animated.View
        style={[styles.fill, animStyle, { backgroundColor: color, height, borderRadius }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
