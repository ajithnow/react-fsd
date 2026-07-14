import apiClient from '@/core/api';
import { useCallback } from 'react';
import type {
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
  UsersListResponse,
  UserFilters,
} from '../models';
import { USER_ENDPOINTS } from '@/features/users';

export const useUserService = () => {
  const getUsers = useCallback(
    async (filters?: UserFilters): Promise<UsersListResponse> => {
      const response = await apiClient.get<UsersListResponse>(
        USER_ENDPOINTS.USERS,
        { params: filters }
      );
      return response.data;
    },
    []
  );

  const getUserById = useCallback(async (id: string): Promise<AdminUser> => {
    const response = await apiClient.get(USER_ENDPOINTS.USER_BY_ID(id));
    return response.data?.data ?? response.data;
  }, []);

  const createUser = useCallback(
    async (userData: CreateUserRequest): Promise<AdminUser> => {
      const response = await apiClient.post(
        USER_ENDPOINTS.CREATE_USER,
        userData
      );
      return response.data;
    },
    []
  );

  const updateUser = useCallback(
    async (userData: UpdateUserRequest): Promise<AdminUser> => {
      const response = await apiClient.put<AdminUser>(
        USER_ENDPOINTS.UPDATE_USER,
        userData
      );
      return response.data;
    },
    []
  );

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    await apiClient.post(USER_ENDPOINTS.DELETE_USER, { userId: id });
  }, []);

  const resetUserPassword = useCallback(
    async (id: string): Promise<{ temporaryPassword: string }> => {
      const response = await fetch(USER_ENDPOINTS.RESET_PASSWORD(id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to reset password: ${response.statusText}`);
      }

      return response.json();
    },
    []
  );

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    suspendUser: updateUser,
  };
};
