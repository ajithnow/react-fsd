import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(
      error instanceof Error
        ? error
        : new Error(error.message || 'Request failed')
    );
  }
);

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Example: Handle 401 Unauthorized (e.g., redirect to login or refresh token)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark request as retried to prevent infinite loops

      // --- TOKEN REFRESH LOGIC (if applicable) ---
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem('authToken', newAccessToken); // Store new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login';
      }
      // --- END TOKEN REFRESH LOGIC ---

      // If not refreshing token, or refresh failed, simply reject or redirect
      // For now, just logging and rejecting the error
      console.error('API Error:', error.response.status, error.response.data);
      // You might want to trigger a global error notification here or dispatch a logout action
      if (error.response.status === 401 && !originalRequest._retry) {
        // For example, if no refresh token or refresh failed, force logout
        // EventBus.dispatch('logout'); // Custom event bus or global state update
        // history.push('/login');
      }
    }

    return Promise.reject(
      error instanceof Error
        ? error
        : new Error(error.message || 'An error occurred')
    );
  }
);

// 5. Export the configured Axios instance
// This is what your services will import and use.
export default apiClient;

// Optionally, you might export specific utility functions built on top of apiClient
// export const setAuthToken = (token: string | null) => {
//   if (token) {
//     apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete apiClient.defaults.headers.common['Authorization'];
//   }
// };
