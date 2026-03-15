import { FEATURE_CONSTANTS } from '@/features/constants';
import { ENV } from '@/core/utils/env.utils';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from './endpoints';
import { storageService } from '@/shared/utils/storage.service';
import { logger } from '@/core/services/logger.service';

const API_BASE_URL = ENV.API_BASE_URL;
const MOCK_API_BASE_URL = ENV.MOCK_API_BASE_URL;

// Create the base API client factory
const createApiClient = ({ isMock = false } = {}) => {
  const client = axios.create({
    baseURL: isMock ? MOCK_API_BASE_URL : API_BASE_URL, 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = storageService.getItem<string>(FEATURE_CONSTANTS.AUTH.ACCESS_TOKEN);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors and token refresh
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized with token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = storageService.getItem<string>(
            FEATURE_CONSTANTS.AUTH.REFRESH_TOKEN
          );

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Use a separate axios instance to avoid interceptor loops
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

          // Update stored token
          storageService.setItem(
            FEATURE_CONSTANTS.AUTH.ACCESS_TOKEN,
            newAccessToken
          );

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request
          return client(originalRequest);
        } catch (refreshError) {
          logger.error('Token refresh failed', refreshError, 'API');

          // Clear tokens and redirect to login
          storageService.removeItem(FEATURE_CONSTANTS.AUTH.ACCESS_TOKEN);
          storageService.removeItem(FEATURE_CONSTANTS.AUTH.REFRESH_TOKEN);

          // Redirect to login - you might want to use your router here
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }

          return Promise.reject(new Error('Authentication failed'));
        }
      }

      // Handle other HTTP errors
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        logger.error(`API Error ${status}`, data, 'API');

        // You can add more specific error handling here
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
        // Network error
        logger.error('Network error - no response received', null, 'API');
      } else {
        logger.error('Request setup error', error.message, 'API');
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create default instance
const apiClient = createApiClient();

// Export both the factory and default instance
export { createApiClient };
export default apiClient;