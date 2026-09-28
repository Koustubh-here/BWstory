import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';

export default function IconButton({ name, size = 22, color = colors.ink, onPress, style, accessibilityLabel }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || name}
      accessibilityState={{ disabled: !onPress }}
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && onPress && styles.pressed]}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.55 },
});
