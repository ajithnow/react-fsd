export const ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  /** Current-user identity (roles + permissions). Prefer over opaque token claims. */
  ME: '/api/auth/me',
  REFRESH: '/api/auth/refresh',
} as const;
