import { ENDPOINTS as AUTH_ENDPOINTS } from '@/features/auth/constants/endpoints.constants';
import { USER_ENDPOINTS } from '@/features/users/constants/endpoints.constants';

export const API_ENDPOINTS = {
  AUTH: {
    ...AUTH_ENDPOINTS,
    LOGIN_LEGACY: AUTH_ENDPOINTS.LOGIN,
    REFRESH_TOKEN: AUTH_ENDPOINTS.REFRESH,
  },
  USERS: USER_ENDPOINTS,
} as const;
