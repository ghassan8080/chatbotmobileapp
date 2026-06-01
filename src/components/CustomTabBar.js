/**
 * CustomTabBar Component
 * Pixel-perfect bottom tab bar matching the Stitch "Amethyst Gallery" design.
 * Active tab: circular purple (#6a1cf6) elevated button.
 * Inactive tabs: gray icon + Arabic label.
 * RTL layout: Profile (حسابي) | Orders (طلباتي) | Home (الرئيسية)
 */

import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';

const TAB_CONFIG = [
  {
    name: 'Profile',
    label: 'حسابي',
    icon: 'person-outline',
    iconActive: 'person',
  },
  {
    name: 'ChatRequests',
    label: 'استفسارات',
    icon: 'chatbubble-ellipses-outline',
    iconActive: 'chatbubble-ellipses',
  },
  {
    name: 'Orders',
    label: 'طلباتي',
    icon: 'receipt-outline',
    iconActive: 'receipt',
  },
  {
    name: 'Home',
    label: 'الرئيسية',
    icon: 'home-outline',
    iconActive: 'home',
  },
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom || 12 }]}>
      <View style={styles.container}>
        {/* RTL order: Profile | Orders (active) | Home */}
        {TAB_CONFIG.map((tab) => {
          if (tab.name === 'ChatRequests' && !user?.store_name) return null;

          // Find the matching route from React Nav state
          const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
          if (routeIndex === -1) return null;

          const route = state.routes[routeIndex];
          const isFocused = state.index === routeIndex;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          if (isFocused) {
            // Active tab — circular purple pill
            return (
              <TouchableOpacity
                key={tab.name}
                accessibilityRole="button"
                accessibilityState={{ selected: true }}
                accessibilityLabel={tab.label}
                onPress={onPress}
                style={styles.activeTabWrapper}
                activeOpacity={0.85}
              >
                <View style={styles.activeCircle}>
                  <Ionicons name={tab.iconActive} size={24} color="#ffffff" />
                </View>
                <Text style={styles.activeLabel}>{tab.label}</Text>
              </TouchableOpacity>
            );
          }

          // Inactive tab
          return (
            <TouchableOpacity
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={{ selected: false }}
              accessibilityLabel={tab.label}
              onPress={onPress}
              style={styles.inactiveTab}
              activeOpacity={0.7}
            >
              <Ionicons name={tab.icon} size={22} color="#9b8aad" />
              <Text style={styles.inactiveLabel}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#38274c',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 16,
    // Subtle top border
    borderTopWidth: 1,
    borderTopColor: 'rgba(106, 28, 246, 0.06)',
  },
  container: {
    flexDirection: 'row',          // RTL device flips: Profile left, Home right (visually correct)
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  // ── Active State ──────────────────────────────────────
  activeTabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6a1cf6',
    alignItems: 'center',
    justifyContent: 'center',
    // Elevated purple glow
    shadowColor: '#6a1cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 4,
  },
  activeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6a1cf6',
    textAlign: 'center',
  },
  // ── Inactive State ────────────────────────────────────
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    minWidth: 64,
  },
  inactiveLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9b8aad',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default CustomTabBar;
