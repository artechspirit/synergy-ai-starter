import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface MobileButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  label: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: '#0284c7' },
    text: { color: '#ffffff' },
  },
  secondary: {
    container: { backgroundColor: '#f1f5f9' },
    text: { color: '#0f172a' },
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#cbd5e1' },
    text: { color: '#0f172a' },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: '#0f172a' },
  },
  destructive: {
    container: { backgroundColor: '#ef4444' },
    text: { color: '#ffffff' },
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    text: { fontSize: 12, fontWeight: '500' },
  },
  md: {
    container: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    text: { fontSize: 14, fontWeight: '500' },
  },
  lg: {
    container: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    text: { fontSize: 16, fontWeight: '600' },
  },
};

export function Button({
  variant = 'default',
  size = 'md',
  isLoading = false,
  label,
  style,
  textStyle,
  disabled,
  ...props
}: MobileButtonProps) {
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
        },
        vStyle.container,
        sStyle.container,
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={vStyle.text.color as string} />
      ) : (
        <Text style={[vStyle.text, sStyle.text, textStyle]}>{label}</Text>
      )}
    </Pressable>
  );
}
