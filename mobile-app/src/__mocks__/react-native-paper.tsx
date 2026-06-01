// Mock for react-native-paper
import React from 'react';
import { View, Text as RNText, TouchableOpacity } from 'react-native';

export const Card: any = ({ children, onPress, style }: any) => (
  <TouchableOpacity onPress={onPress} style={style}>{children}</TouchableOpacity>
);
Card.Content = ({ children }: any) => <View>{children}</View>;

export const Text: any = ({ children, style, _variant, numberOfLines }: any) => (
  <RNText style={style} numberOfLines={numberOfLines}>{children}</RNText>
);

export const IconButton = ({ onPress, icon, testID }: any) => (
  <TouchableOpacity onPress={onPress} testID={testID || icon} />
);

export const Button = ({ children, onPress, loading, disabled }: any) => (
  <TouchableOpacity onPress={onPress} disabled={disabled || loading}>
    <RNText>{children}</RNText>
  </TouchableOpacity>
);

export const Provider = ({ children }: any) => <>{children}</>;
