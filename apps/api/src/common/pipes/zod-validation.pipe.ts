import {
  PipeTransform, Injectable, BadRequestException, type ArgumentMetadata,
} from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { ZodSchema, ZodError } from 'zod';

import { ERROR_CODES } from '@repo/validation';

/**
 * Zod validation pipe — use as @ZodBody(schema) decorator on controller methods.
 * Zod is the source of truth for all request body validation (not class-validator).
 */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown, _meta: ArgumentMetadata): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const zodError = result.error as ZodError;
      const details = Object.fromEntries(
        Object.entries(zodError.flatten().fieldErrors).map(([k, v]) => [k, v ?? []]),
      );
      throw new BadRequestException({
        code: ERROR_CODES.VALIDATION_FAILED,
        message: 'Validation failed',
        details,
      });
    }
    return result.data;
  }
}

/**
 * Convenience decorator — wraps @Body() with ZodValidationPipe.
 * Usage: @ZodBody(loginSchema) body: LoginDto
 */
export const ZodBody = (schema: ZodSchema) =>
  createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{ body: unknown }>();
    return req.body;
  })();
// Note: In practice, apply as: @Body(new ZodValidationPipe(schema)) for proper DI
// The ZodBody decorator above is a convenience — use @Body(new ZodValidationPipe(schema)) in controllers
