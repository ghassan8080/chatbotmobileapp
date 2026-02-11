/**
 * ScreenHeader Component
 * Consistent header bar with safe area handling for all screens
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const ScreenHeader = ({
  title,
  leftAction,
  rightAction,
  backgroundColor = COLORS.primary,
  titleColor = COLORS.white,
  elevated = true,
}) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
  const topPadding = Math.max(insets.top, statusBarHeight, 20);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, paddingTop: topPadding + 8 },
        elevated && styles.elevated,
      ]}
    >
      <View style={styles.content}>
        {/* Left Action */}
        <View style={styles.actionContainer}>
          {leftAction && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={leftAction.onPress}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {leftAction.icon && (
                <Ionicons
                  name={leftAction.icon}
                  size={22}
                  color={titleColor}
                  style={leftAction.label ? styles.actionIcon : null}
                />
              )}
              {leftAction.label && (
                <Text style={[styles.actionLabel, { color: titleColor }]}>
                  {leftAction.label}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>

        {/* Right Action */}
        <View style={styles.actionContainer}>
          {rightAction && (
            <TouchableOpacity
              style={[styles.actionButton, styles.rightButton]}
              onPress={rightAction.onPress}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {rightAction.icon && (
                <Ionicons
                  name={rightAction.icon}
                  size={22}
                  color={rightAction.textColor || titleColor}
                  style={rightAction.label ? styles.actionIcon : null}
                />
              )}
              {rightAction.label && (
                <Text style={[styles.actionLabel, { color: rightAction.textColor || titleColor }]}>
                  {rightAction.label}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  elevated: {
    elevation: 5,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  actionContainer: {
    minWidth: 80,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  rightButton: {
    alignSelf: 'flex-end',
  },
  actionIcon: {
    marginRight: 6,
  },
  actionLabel: {
    fontWeight: '700',
    fontSize: 13,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default ScreenHeader;
