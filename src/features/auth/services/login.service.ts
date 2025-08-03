import apiClient from '../../../core/api';

const useLoginService = () => {
  const loginApi = async (credentials: {
    username: string;
    password: string;
  }) => {
    const res = await apiClient.post('/auth/login', credentials);
    const { data } = res.data;
    return {
      token: data.accessToken,
      user: data.user,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    };
  };
  return {
    login: async (credentials: { username: string; password: string }) => {
      const response = await loginApi(credentials);
      return response;
    },
  };
};

export default useLoginService;
