import { FEATURE_CONSTANTS } from '@/features/constants';
import { ENV } from '@/core/utils/env.utils';
import axios from 'axios';

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
    config => {
      const token = localStorage.getItem(FEATURE_CONSTANTS.AUTH.ACCESS_TOKEN);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(
        error instanceof Error
          ? error
          : new Error(error?.message || 'Request failed')
      );
    }
  );

  // Response interceptor - Handle errors and token refresh
  client.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized with token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem(
            FEATURE_CONSTANTS.AUTH.REFRESH_TOKEN
          );

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Use a separate axios instance to avoid interceptor loops
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/api/portal-admin/refresh-token/refresh-token`,
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
          localStorage.setItem(
            FEATURE_CONSTANTS.AUTH.ACCESS_TOKEN,
            newAccessToken
          );

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request
          return client(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);

          // Clear tokens and redirect to login
          localStorage.removeItem(FEATURE_CONSTANTS.AUTH.ACCESS_TOKEN);
          localStorage.removeItem(FEATURE_CONSTANTS.AUTH.REFRESH_TOKEN);

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

        console.error(`API Error ${status}:`, data);

        // You can add more specific error handling here
        switch (status) {
          case 403:
            console.error('Forbidden: Insufficient permissions');
            break;
          case 404:
            console.error('Not found');
            break;
          case 500:
            console.error('Internal server error');
            break;
          default:
            console.error('HTTP error:', status);
        }
      } else if (error.request) {
        // Network error
        console.error('Network error - no response received');
      } else {
        console.error('Request setup error:', error.message);
      }

      return Promise.reject(
        error instanceof Error
          ? error
          : new Error(error?.data || 'An error occurred')
      );
    }
  );

  return client;
};

// Create default instance
const apiClient = createApiClient();

// Export both the factory and default instance
export { createApiClient };
export default apiClient;