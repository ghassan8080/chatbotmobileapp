/**
 * LoadingSpinner Component
 * Displays a loading indicator with optional text and pulsing animation
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { COLORS } from '../constants/colors';

const LoadingSpinner = ({ size = 'large', color = COLORS.primary, text }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (text) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [text]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size={size} color={color} />
        {text && (
          <Animated.Text style={[styles.text, { opacity: pulseAnim }]}>
            {text}
          </Animated.Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 48,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
});

export default LoadingSpinner;
