import { isAxiosError } from 'axios';
import type { ApiErrorBody } from '@/shared/types';

/** Prefer API `message`, then `Error.message`, then fallback. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;
    if (message) return message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
