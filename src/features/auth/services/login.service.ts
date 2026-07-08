import apiClient from '@/core/api';
import { ENDPOINTS } from '@/features/auth/constants';

const useLoginService = () => {
  const loginApi = async (credentials: {
    username: string;
    password: string;
  }) => {
    // Replace with actual condition to check if mock is enabled
    const MOCK_ENABLED = false;
    const { data } = await apiClient.post(
      ENDPOINTS.LOGIN,
      credentials,
      { isMock: MOCK_ENABLED }
    );

    const tokens = data?.data?.tokens;
    const userData = data?.data?.user;

    return {
      token: tokens?.AccessToken ?? tokens?.accessToken,
      user: {
        Email: userData?.Email ?? userData?.email,
        FirstName: userData?.FirstName ?? userData?.firstName,
        LastName: userData?.LastName ?? userData?.lastName,
        Role: userData?.Role ?? userData?.role,
        Name: `${userData?.FirstName ?? userData?.firstName ?? ''} ${userData?.LastName ?? userData?.lastName ?? ''}`.trim(),
        permissions: userData?.permissions,
      },
      refreshToken: tokens?.RefreshToken ?? tokens?.refreshToken,
      expiresIn: tokens?.AccessTokenExpiry ?? tokens?.accessTokenExpiry,
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
