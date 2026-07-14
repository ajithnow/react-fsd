// Auth token management utilities
import { storageService } from '@/shared/utils/storage.service';
import { AUTH_ROUTES } from '../constants/routes.constants';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

export const AUTH_TOKEN_KEY = AUTH_CONSTANTS.ACCESS_TOKEN;
export const AUTH_REFRESH_TOKEN_KEY = AUTH_CONSTANTS.REFRESH_TOKEN;
export const AUTH_USER_KEY = 'auth_user';

export const authStorage = {
  getToken: (): string | null => {
    return storageService.getItem<string>(AUTH_TOKEN_KEY);
  },

  setToken: (token: string): void => {
    storageService.setItem(AUTH_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return storageService.getItem<string>(AUTH_REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    storageService.setItem(AUTH_REFRESH_TOKEN_KEY, token);
  },

  removeToken: (): void => {
    storageService.removeItem(AUTH_TOKEN_KEY);
    storageService.removeItem(AUTH_USER_KEY);
  },

  clearTokens: (): void => {
    storageService.removeItem(AUTH_TOKEN_KEY);
    storageService.removeItem(AUTH_REFRESH_TOKEN_KEY);
    storageService.removeItem(AUTH_USER_KEY);
  },

  getUser: <T = unknown>(): T | null => {
    return storageService.getItem<T>(AUTH_USER_KEY);
  },

  setUser: <T = unknown>(user: T): void => {
    storageService.setItem(AUTH_USER_KEY, user);
  },
};

export const isAuthenticated = (): boolean => {
  const token = authStorage.getToken();
  return typeof token === 'string' && token.length > 0;
};

/**
 * Check if a route path is an auth route
 * @param path - The path to check
 * @returns boolean indicating if the path is an auth route
 */
export function isAuthRoute(path: string): boolean {
  const authRoutes = Object.values(AUTH_ROUTES);
  return authRoutes.some(route => path.startsWith(route));
}
