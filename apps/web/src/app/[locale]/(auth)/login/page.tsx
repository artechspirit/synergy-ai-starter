'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { loginSchema, type LoginDto } from '@repo/validation';
import { Button } from '@repo/ui/web';
import { Input } from '@repo/ui/web';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/web';
import { customFetch, ApiException } from '@repo/api-contracts';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tError = useTranslations('error');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      await customFetch('/api/v1/auth/login', {
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
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <CardTitle>Synergy AI Starter</CardTitle>
          <CardDescription>{t('login')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="login-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            <Input
              id="login-email"
              type="email"
              label={t('email')}
              placeholder={t('emailPlaceholder')}
              autoComplete="email"
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              id="login-password"
              type="password"
              label={t('password')}
              placeholder={t('passwordPlaceholder')}
              autoComplete="current-password"
              error={errors.password?.message}
              required
              {...register('password')}
            />

            {errors.root && (
              <p role="alert" className="text-sm text-error-500">
                {errors.root.message}
              </p>
            )}

            <Button
              id="login-submit"
              type="submit"
              isLoading={isSubmitting}
              size="lg"
              className="mt-2 w-full"
            >
              {t('login')}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-neutral-500">
            {t('noAccount')}{' '}
            <Link
              href="/register"
              className="font-medium text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {t('register')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
