import { useMemo } from 'react';
import { createApiClient } from '@/core/api';
import { ENDPOINTS } from '@/features/auth/constants';

const useLoginService = () => {
  const clients = useMemo(
    () => ({
      real: createApiClient({ isMock: false }),
      mock: createApiClient({ isMock: true }),
    }),
    []
  );
  const loginApi = async (credentials: {
    username: string;
    password: string;
  }) => {
    // Replace with actual condition to check if mock is enabled
    const MOCK_ENABLED = false;
    const apiClient = MOCK_ENABLED ? clients.mock : clients.real;
    const { data } = await apiClient.post(
      ENDPOINTS.LOGIN,
      credentials
    );
    return {
      token: data?.data?.tokens?.AccessToken,
      user: {
        Email: data?.data?.user?.Email,
        FirstName: data?.data?.user?.FirstName,
        LastName: data?.data?.user?.LastName,
        Role: data?.data?.user?.Role,
        Name: `${data?.data?.user?.FirstName} ${data?.data?.user?.LastName}`,
      },
      refreshToken: data?.data?.tokens?.RefreshToken,
      expiresIn: data?.data?.tokens?.AccessTokenExpiry,
    };
  };
  return {
    login: async (credentials: { username: string; password: string }) => {
      const [response] = await Promise.all([loginApi(credentials)]);
      return response;
    },
  };
};

export default useLoginService;
