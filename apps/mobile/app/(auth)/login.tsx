import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { loginSchema, type LoginDto } from '@repo/validation';
import { Button, Input } from '@repo/ui/mobile';
import { customFetch, ApiException } from '@repo/api-contracts';
import { useI18n } from '@/lib/i18n';

const TOKEN_KEY = 'access_token';

export default function LoginScreen() {
  const { t } = useI18n();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      const result = await customFetch<{ accessToken: string }>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await SecureStore.setItemAsync(TOKEN_KEY, result.accessToken);
      router.replace('/(tabs)/home');
    } catch (err) {
      if (err instanceof ApiException) {
        setError('root', { message: t(`error.${err.error.code}`) });
      } else {
        setError('root', { message: t('error.INTERNAL_SERVER_ERROR') });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>⚡</Text>
          </View>
          <Text style={styles.title}>Synergy AI Starter</Text>
          <Text style={styles.subtitle}>{t('auth.login')}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.password')}
                placeholder={t('auth.passwordPlaceholder')}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.password?.message}
                secureTextEntry
                autoComplete="current-password"
              />
            )}
          />

          {errors.root && (
            <Text style={styles.errorText} accessibilityRole="alert">
              {errors.root.message}
            </Text>
          )}

          <Button
            label={t('auth.login')}
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            size="lg"
          />
        </View>

        <Text style={styles.footer}>
          {t('auth.noAccount')}{' '}
          <Text
            style={styles.link}
            onPress={() => router.push('/(auth)/register')}
            accessibilityRole="link"
          >
            {t('auth.register')}
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: '#0284c7', alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: { fontSize: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#64748b' },
  form: { gap: 16, marginBottom: 24 },
  errorText: { fontSize: 13, color: '#ef4444', textAlign: 'center' },
  footer: { textAlign: 'center', fontSize: 14, color: '#64748b' },
  link: { color: '#0284c7', fontWeight: '600' },
});
