import apiClient from '../../../core/api';

const useLoginService = () => {
  const loginApi = async (credentials: {
    username: string;
    password: string;
  }) => {
    const res = await apiClient.post('/auth/login', credentials);
    const { data } = res.data;
    const token = data.accessToken;
    return { token };
  };
  return {
    login: async (credentials: { username: string; password: string }) => {
      const response = await loginApi(credentials);
      return response;
    },
  };
};

export default useLoginService;
