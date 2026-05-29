import { z } from 'zod';

// ─── Standard API Envelope ─────────────────────────────────────────────────
export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  traceId: z.string(),
  details: z.record(z.array(z.string())).optional(),
});

export const apiMetaSchema = z.object({
  cursor: z.string().nullable(),
  hasMore: z.boolean(),
  total: z.number().optional(),
});

export function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      data: dataSchema,
      meta: apiMetaSchema.optional(),
    }),
    z.object({
      success: z.literal(false),
      error: apiErrorSchema,
    }),
  ]);
}

// ─── Common field validators ────────────────────────────────────────────────
export const uuidSchema = z.string().uuid('Invalid UUID');

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationDto = z.infer<typeof paginationSchema>;

// ─── Error codes (match AI_CONTEXT.md §9) ──────────────────────────────────
export const ERROR_CODES = {
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_EXPIRED_TOKEN: 'AUTH_EXPIRED_TOKEN',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  DB_CONFLICT: 'DB_CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  EXTERNAL_SERVICE_DOWN: 'EXTERNAL_SERVICE_DOWN',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
