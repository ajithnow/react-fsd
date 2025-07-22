import apiClient from '../../../core/api';

export const loginApi = async (credentials: { username: string; password: string }) => {
  const res = await apiClient.post('/auth/login', credentials);
  const { token } = res.data;
  return { token };
};