import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const EmptyState = ({
  icon = 'file-tray-outline',
  iconColor = COLORS.gray[300],
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={80} color={COLORS.primaryLight} />
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAction}
          activeOpacity={0.8}
        >
          {actionIcon && (
            <Ionicons
              name={actionIcon}
              size={20}
              color={COLORS.white}
              style={styles.actionButtonIcon}
            />
          )}
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray[50], // Very subtle bg
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    // Removed contrasty shadow for a softer look
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 260,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16, // Matching global radius
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default EmptyState;
