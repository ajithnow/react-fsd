import { constantsRegistry } from '@/core/registry';
import { ENV } from '@/core/utils/env.utils';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from './endpoints';
import { storageService } from '@/shared/utils/storage.service';
import { logger } from '@/core/services/logger.service';
import { AUTH_CONSTANTS } from '@/features/auth/constants/auth.constants';
import type { LoginResponse } from '@/features/auth/types';

const API_BASE_URL = ENV.API_BASE_URL;

const AUTH_PATHS_SKIP_REFRESH = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REFRESH_TOKEN,
  API_ENDPOINTS.AUTH.LOGOUT,
];

const getAuthStorageKeys = () => {
  const constants = constantsRegistry.getAll() as Record<
    string,
    Record<string, string> | undefined
  >;
  const authConstants = constants.AUTH as Record<string, string> | undefined;
  return {
    accessToken: authConstants?.ACCESS_TOKEN || AUTH_CONSTANTS.ACCESS_TOKEN,
    refreshToken: authConstants?.REFRESH_TOKEN || AUTH_CONSTANTS.REFRESH_TOKEN,
  };
};

const shouldSkipRefresh = (url?: string): boolean => {
  if (!url) return false;
  return AUTH_PATHS_SKIP_REFRESH.some((path) => url.includes(path));
};

const createApiClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken } = getAuthStorageKeys();
      const token = storageService.getItem<string>(accessToken);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      const { accessToken, refreshToken: refreshKey } = getAuthStorageKeys();
      const requestUrl = originalRequest?.url ?? '';

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !shouldSkipRefresh(requestUrl)
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = storageService.getItem<string>(refreshKey);

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const { data } = await axios.post<LoginResponse>(
            `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          storageService.setItem(accessToken, data.accessToken);

          if (data.refreshToken) {
            storageService.setItem(refreshKey, data.refreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          return client(originalRequest);
        } catch (refreshError) {
          logger.error('Token refresh failed', refreshError, 'API');

          storageService.removeItem(accessToken);
          storageService.removeItem(refreshKey);

          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.startsWith('/auth/')
          ) {
            window.location.href = '/auth/login';
          }

          return Promise.reject(new Error('Authentication failed'));
        }
      }

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        logger.error(`API Error ${status}`, responseData, 'API');

        switch (status) {
          case 403:
            logger.warn('Forbidden: Insufficient permissions', null, 'API');
            break;
          case 404:
            logger.warn('Not found', null, 'API');
            break;
          case 500:
            logger.error('Internal server error', null, 'API');
            break;
          default:
            logger.info(`HTTP status ${status}`, null, 'API');
        }
      } else if (error.request) {
        logger.error('Network error - no response received', null, 'API');
      } else {
        logger.error('Request setup error', error.message, 'API');
      }

      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

export { createApiClient };
export default apiClient;
