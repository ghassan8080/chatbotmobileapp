// Mock for react-native-paper
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const Card: any = ({ children, onPress, style }: any) => (
  <TouchableOpacity onPress={onPress} style={style}>{children}</TouchableOpacity>
);
Card.Content = ({ children }: any) => <View>{children}</View>;

export const Text: any = ({ children, style, variant, numberOfLines }: any) => (
  <Text style={style} numberOfLines={numberOfLines}>{children}</Text>
);

export const IconButton = ({ onPress, icon, testID }: any) => (
  <TouchableOpacity onPress={onPress} testID={testID || icon} />
);

export const Button = ({ children, onPress, loading, disabled }: any) => (
  <TouchableOpacity onPress={onPress} disabled={disabled || loading}>
    <Text>{children}</Text>
  </TouchableOpacity>
);

export const Provider = ({ children }: any) => <>{children}</>;
