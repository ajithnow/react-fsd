import apiClient from '../../../core/api';
import { ENDPOINTS } from '../constants';
import { authStorage } from '../utils';

const useLogoutService = () => {
  const logoutApi = async (data: { refreshToken: string }) => {
    const token = authStorage.getToken();

    const res = await apiClient.post(ENDPOINTS.LOGOUT, data, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return res.data;
  };

  return {
    logout: async (refreshToken: string = '') => {
      const response = await logoutApi({ refreshToken });
      return response;
    },
  };
};

export default useLogoutService;
