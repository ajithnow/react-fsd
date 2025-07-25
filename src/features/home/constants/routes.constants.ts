import { createModuleRoutes } from '../../../shared/utils/route.utils';

export const HOME_ROUTES = createModuleRoutes('home', {
  INDEX: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const);

