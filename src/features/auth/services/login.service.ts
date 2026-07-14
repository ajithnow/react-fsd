import apiClient from '@/core/api';
import { ENDPOINTS } from '@/features/auth/constants';
import type { LoginCredentials, LoginResponse } from '../types';

const useLoginService = () => {
  const login = async (
    credentials: LoginCredentials
  ): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(ENDPOINTS.LOGIN, {
      email: credentials.email,
      password: credentials.password,
    });
    return data;
  };

  return { login };
};

export default useLoginService;
