import { constantsRegistry } from '@/core/registry';
import { ENV } from '@/core/utils/env.utils';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from './endpoints';
import { storageService } from '@/shared/utils/storage.service';
import { logger } from '@/core/services/logger.service';

const API_BASE_URL = ENV.API_BASE_URL;

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
      const constants = constantsRegistry.getAll() as Record<string, Record<string, string> | undefined>;
      const authConstants = constants.AUTH as Record<string, string> | undefined;
      const token = storageService.getItem<string>(authConstants?.ACCESS_TOKEN || 'accessToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      const constants = constantsRegistry.getAll() as Record<string, Record<string, string> | undefined>;
      const authConstants = constants.AUTH as Record<string, string> | undefined;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = storageService.getItem<string>(
            authConstants?.REFRESH_TOKEN || 'refreshToken'
          );

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const refreshResponse = await axios.post(
            `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const newAccessToken = refreshResponse.data?.accessToken;

          if (!newAccessToken) {
            throw new Error('Invalid refresh response');
          }

          storageService.setItem(
            authConstants?.ACCESS_TOKEN || 'accessToken',
            newAccessToken
          );

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return client(originalRequest);
        } catch (refreshError) {
          logger.error('Token refresh failed', refreshError, 'API');

          storageService.removeItem(authConstants?.ACCESS_TOKEN || 'accessToken');
          storageService.removeItem(authConstants?.REFRESH_TOKEN || 'refreshToken');

          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }

          return Promise.reject(new Error('Authentication failed'));
        }
      }

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        logger.error(`API Error ${status}`, data, 'API');

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
