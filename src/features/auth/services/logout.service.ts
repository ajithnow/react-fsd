import apiClient from '../../../core/api';
import { authStorage } from '../utils';

const useLogoutService = () => {
  const logoutApi = async (data: { AdminRefreshToken: string }) => {
    const token = authStorage.getToken();

    const res = await apiClient.post('/api/portal-admin/logout', data, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return res.data;
  };

  return {
    logout: async (AdminRefreshToken: string = '') => {
      const response = await logoutApi({ AdminRefreshToken });
      return response;
    },
  };
};

export default useLogoutService;
