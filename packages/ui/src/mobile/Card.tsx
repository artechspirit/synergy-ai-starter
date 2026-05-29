import React from 'react';
import { View, Text, type ViewProps, StyleSheet } from 'react-native';

export interface MobileCardProps extends ViewProps {
  title?: string;
  description?: string;
}

export function Card({ title, description, children, style, ...props }: MobileCardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {(title || description) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: { marginBottom: 12, gap: 4 },
  title: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  description: { fontSize: 14, color: '#64748b' },
});
