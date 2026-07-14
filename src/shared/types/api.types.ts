import type { AxiosError } from 'axios';

/** Standard API error payload. */
export type ApiErrorBody = {
  message?: string;
};

/** Common `{ data: T }` success envelope. */
export type ApiEnvelope<T> = {
  data: T;
  success?: boolean;
  message?: string;
};

export type ApiErrorResponse = AxiosError<ApiErrorBody>;
