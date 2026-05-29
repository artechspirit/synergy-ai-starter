import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { ERROR_CODES } from '@repo/validation';

interface ErrorBody {
  code?: string;
  message?: string;
  details?: Record<string, string[]>;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const traceId = uuidv4();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ERROR_CODES.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let details: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse() as string | ErrorBody;
      if (typeof body === 'string') {
        message = body;
      } else {
        code = body.code ?? this.codeFromStatus(status);
        message = body.message ?? exception.message;
        details = body.details;
      }
    } else {
      this.logger.error({
        msg: 'Unhandled exception',
        traceId,
        error: exception instanceof Error ? exception.message : String(exception),
        stack: exception instanceof Error ? exception.stack : undefined,
      });
    }

    res.status(status).json({
      success: false,
      error: { code, message, traceId, ...(details ? { details } : {}) },
    });
  }

  private codeFromStatus(status: number): string {
    const map: Record<number, string> = {
      400: ERROR_CODES.VALIDATION_FAILED,
      401: ERROR_CODES.AUTH_INVALID_TOKEN,
      403: ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS,
      404: ERROR_CODES.NOT_FOUND,
      409: ERROR_CODES.DB_CONFLICT,
      429: ERROR_CODES.RATE_LIMITED,
    };
    return map[status] ?? ERROR_CODES.INTERNAL_SERVER_ERROR;
  }
}
