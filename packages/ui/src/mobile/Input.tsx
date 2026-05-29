import React, { useState } from 'react';
import { View, Text, TextInput, type TextInputProps, StyleSheet } from 'react-native';

export interface MobileInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, style, ...props }: MobileInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper} accessible accessibilityRole="none">
      {label && (
        <Text style={styles.label}>
          {label}
          {props.required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor="#94a3b8"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={label}
        accessibilityInvalid={!!error}
        accessibilityHint={error ?? helperText}
        {...props}
      />
      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500', color: '#334155' },
  required: { color: '#ef4444' },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  inputFocused: { borderColor: '#0284c7', borderWidth: 2 },
  inputError: { borderColor: '#ef4444' },
  errorText: { fontSize: 12, color: '#ef4444' },
  helperText: { fontSize: 12, color: '#64748b' },
});
