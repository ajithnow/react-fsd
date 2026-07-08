/**
 * Unwraps API payloads that use the standard `{ message, data }` envelope.
 * Returns the inner `data` when present; otherwise returns the payload as-is.
 */
export const unwrapData = <T>(payload: T | { data?: T }): T => {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    (payload as { data?: T }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
};
