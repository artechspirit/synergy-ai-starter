import { z } from 'zod';

// ─── Register ──────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must not exceed 72 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase, one lowercase, and one number',
    ),
});

export type RegisterDto = z.infer<typeof registerSchema>;

// ─── Login ─────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;

// ─── Refresh Token ─────────────────────────────────────────────────────────
export const refreshTokenSchema = z.object({
  // Only used for mobile/non-cookie flows
  refreshToken: z.string().min(1).optional(),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

// ─── Token Response ────────────────────────────────────────────────────────
export const tokenResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.literal('Bearer').default('Bearer'),
  expiresIn: z.number(),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
