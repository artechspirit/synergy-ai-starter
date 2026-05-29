/**
 * Zod env validation untuk apps/api (NestJS).
 * Crash-fast jika ada env yang hilang atau salah format.
 * Import di apps/api/src/config/env.config.ts
 */
import { z } from 'zod';

const apiEnvSchema = z.object({
  // Runtime
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),

  // JWT RS256 Keys — generate via: node scripts/generate-keys.mjs
  JWT_PRIVATE_KEY: z
    .string()
    .min(100, 'JWT_PRIVATE_KEY must be a valid RSA private key (PEM format)'),
  JWT_PUBLIC_KEY: z
    .string()
    .min(100, 'JWT_PUBLIC_KEY must be a valid RSA public key (PEM format)'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // CORS
  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((val: string) => val.split(',')),

  // Redis (optional, required if BullMQ is enabled)
  REDIS_URL: z.string().url().optional(),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

/**
 * Parse and validate env vars. Crashes the process with a clear error if invalid.
 */
export function validateApiEnv(config: Record<string, unknown>): ApiEnv {
  const result = apiEnvSchema.safeParse(config);
  if (!result.success) {
    console.error('❌  Invalid environment variables:');
    console.error(
      result.error.flatten().fieldErrors,
    );
    process.exit(1);
  }
  return result.data;
}
