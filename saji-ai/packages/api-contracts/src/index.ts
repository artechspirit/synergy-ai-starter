// API contract placeholders for SajiAI
export interface BaseApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
export const API_VERSION = "v1";
export const BASE_API_URL = `/api/${API_VERSION}`;
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 210,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
