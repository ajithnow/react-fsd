export const ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  /** Current-user identity (role + permissions). Prefer over opaque JWT claims. */
  ME: '/api/auth/me',
  REFRESH: '/api/auth/refresh',
} as const;
