import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive';

export interface MobileBadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default:     { bg: '#0284c7', text: '#ffffff' },
  secondary:   { bg: '#f1f5f9', text: '#0f172a' },
  success:     { bg: '#f0fdf4', text: '#15803d' },
  warning:     { bg: '#fffbeb', text: '#b45309' },
  destructive: { bg: '#fef2f2', text: '#b91c1c' },
};

export function Badge({ label, variant = 'default' }: MobileBadgeProps) {
  const vs = variantStyles[variant];
  return (
    <View style={[styles.badge, { backgroundColor: vs.bg }]}>
      <Text style={[styles.text, { color: vs.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  text: { fontSize: 12, fontWeight: '600' },
});
