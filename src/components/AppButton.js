/**
 * AppButton Component
 * Unified button with multiple variants and states
 * Variants: primary, secondary, danger, ghost
 * States: loading, disabled
 */

import React, { useRef } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  View,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const VARIANT_STYLES = {
  primary: {
    bg: COLORS.primary,
    text: COLORS.white,
    border: 'transparent',
    shadow: COLORS.primary,
  },
  secondary: {
    bg: COLORS.gray[100],
    text: COLORS.text.primary,
    border: COLORS.gray[300],
    shadow: COLORS.gray[400],
  },
  danger: {
    bg: COLORS.error,
    text: COLORS.white,
    border: 'transparent',
    shadow: COLORS.error,
  },
  ghost: {
    bg: 'transparent',
    text: COLORS.primary,
    border: COLORS.primary,
    shadow: 'transparent',
  },
  success: {
    bg: COLORS.success,
    text: COLORS.white,
    border: 'transparent',
    shadow: COLORS.success,
  },
};

const SIZE_STYLES = {
  small: {
    button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, minHeight: 48 },
    text: { fontSize: 14 },
    iconSize: 16,
  },
  medium: {
    button: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, minHeight: 50 },
    text: { fontSize: 16 },
    iconSize: 20,
  },
  large: {
    button: { paddingVertical: 18, paddingHorizontal: 24, borderRadius: 16, minHeight: 58 },
    text: { fontSize: 18 },
    iconSize: 22,
  },
};

const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  size = 'medium',
  fullWidth = true,
  style,
  textStyle
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const vs = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.medium;
  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, fullWidth && styles.fullWidth]}>
      <Pressable
        style={({ pressed }) => [
          styles.base,
          sizeStyle.button,
          {
            backgroundColor: vs.bg,
            borderColor: vs.border,
            shadowColor: vs.shadow,
            opacity: pressed ? 0.9 : 1,
          },
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator size="small" color={vs.text} />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={sizeStyle.iconSize}
                color={vs.text}
                style={styles.iconLeft}
              />
            )}
            <Text
              style={[
                styles.text,
                sizeStyle.text,
                { color: vs.text },
                textStyle
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={sizeStyle.iconSize}
                color={vs.text}
                style={styles.iconRight}
              />
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.55,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default AppButton;
