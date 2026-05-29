/**
 * Zod env validation untuk apps/web (Next.js).
 * Crash-fast jika ada env yang hilang atau salah format.
 */
import { z } from 'zod';

const webEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // API base URL
  NEXT_PUBLIC_API_URL: z
    .string()
    .url('NEXT_PUBLIC_API_URL must be a valid URL')
    .default('http://localhost:3001'),

  // App URL (used for CORS, cookies, etc.)
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .default('http://localhost:3000'),

  // i18n default locale
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['en', 'id']).default('en'),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export function validateWebEnv(config: Record<string, unknown>): WebEnv {
  const result = webEnvSchema.safeParse(config);
  if (!result.success) {
    console.error('❌  Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}
