'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { registerSchema, type RegisterDto } from '@repo/validation';
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/web';
import { customFetch, ApiException } from '@repo/api-contracts';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const tError = useTranslations('error');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterDto) => {
    try {
      await customFetch('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiException) {
        const message = tError(err.error.code as Parameters<typeof tError>[0]);
        setError('root', { message });
      } else {
        setError('root', { message: tError('INTERNAL_SERVER_ERROR') });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <CardTitle>Synergy AI Starter</CardTitle>
          <CardDescription>{t('register')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form id="register-form" onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Input
              id="register-name"
              type="text"
              label={t('name')}
              placeholder={t('namePlaceholder')}
              autoComplete="name"
              error={errors.name?.message}
              required
              {...register('name')}
            />
            <Input
              id="register-email"
              type="email"
              label={t('email')}
              placeholder={t('emailPlaceholder')}
              autoComplete="email"
              error={errors.email?.message}
              required
              {...register('email')}
            />
            <Input
              id="register-password"
              type="password"
              label={t('password')}
              placeholder={t('passwordPlaceholder')}
              autoComplete="new-password"
              error={errors.password?.message}
              helperText="Min. 8 characters with uppercase, lowercase, and number"
              required
              {...register('password')}
            />

            {errors.root && (
              <p role="alert" className="text-sm text-error-500">{errors.root.message}</p>
            )}

            <Button id="register-submit" type="submit" isLoading={isSubmitting} size="lg" className="mt-2 w-full">
              {t('register')}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-neutral-500">
            {t('alreadyHaveAccount')}{' '}
            <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              {t('login')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
