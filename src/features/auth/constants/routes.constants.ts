import { createModuleRoutes } from '../../../shared/utils/route.utils';

export const AUTH_ROUTES = createModuleRoutes('auth', {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ROOT: '/',
} as const);