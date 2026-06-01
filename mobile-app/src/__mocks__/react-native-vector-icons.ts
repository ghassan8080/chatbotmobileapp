// Mock for react-native-vector-icons
import React from 'react';
import { Text } from 'react-native';
const Icon = ({ name }: { name: string }) => React.createElement(Text, null, name);
export default Icon;
