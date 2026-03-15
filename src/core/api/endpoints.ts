import { ENDPOINTS as AUTH_ENDPOINTS } from '@/features/auth/constants/endpoints.constants';
import { USER_ENDPOINTS } from '@/features/users/constants/endpoints.constants';

export const API_ENDPOINTS = {
  AUTH: {
    ...AUTH_ENDPOINTS,
    LOGIN_LEGACY: '/api/auth/login',
    REFRESH_TOKEN: '/api/portal-admin/refresh-token/refresh-token',
  },
  USERS: USER_ENDPOINTS,
  // Add other feature endpoints here as they are discovered/created
} as const;
