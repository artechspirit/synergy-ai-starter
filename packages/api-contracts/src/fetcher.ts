/**
 * Custom fetch wrapper used by Orval-generated API client.
 * Handles: auth header injection, base URL, error envelope parsing.
 */

const API_BASE_URL =
  typeof process !== 'undefined'
    ? (process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001')
    : 'http://localhost:3001';

export type ApiError = {
  code: string;
  message: string;
  traceId: string;
  details?: Record<string, string[]>;
};

export class ApiException extends Error {
  constructor(
    public readonly status: number,
    public readonly error: ApiError,
  ) {
    super(error.message);
    this.name = 'ApiException';
  }
}

export async function customFetch<T>(
  url: string,
  options?: RequestInit & { params?: Record<string, string> },
): Promise<T> {
  const { params, ...fetchOptions } = options ?? {};

  const fullUrl = new URL(url, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => fullUrl.searchParams.set(k, v));
  }

  const response = await fetch(fullUrl.toString(), {
    ...fetchOptions,
    credentials: 'include', // send httpOnly cookies
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  const body = (await response.json()) as
    | { success: true; data: T }
    | { success: false; error: ApiError };

  if (!response.ok || !body.success) {
    throw new ApiException(
      response.status,
      body.success === false
        ? body.error
        : { code: 'INTERNAL_SERVER_ERROR', message: 'Unknown error', traceId: '' },
    );
  }

  return body.data;
}
