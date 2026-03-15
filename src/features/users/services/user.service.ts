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
  /**
   * Get all users with optional filters
   */
  const getUsers = useCallback(
    async (filters?: UserFilters): Promise<UsersListResponse> => {
      // Replace with actual condition to check if mock is enabled
      const MOCK_ENABLED = false;
      const response = await apiClient.get<UsersListResponse>(
        USER_ENDPOINTS.USERS,
        { params: filters, isMock: MOCK_ENABLED }
      );
      return response.data;
    },
    []
  );

  /**
   * Get a single user by ID
   */
  const getUserById = useCallback(
    async (id: string): Promise<AdminUser> => {
      // Replace with actual condition to check if mock is enabled
      const MOCK_ENABLED = false;
      const response = await apiClient.get(USER_ENDPOINTS.USER_BY_ID(id), {
        isMock: MOCK_ENABLED,
      });
      // Backend may return a wrapper: { message: string, data: { ...user } }
      // If so, unwrap to return the inner user object; otherwise return response.data directly.
      return response.data?.data ?? response.data;
    },
    []
  );

  /**
   * Create a new user
   */
  const createUser = useCallback(
    async (userData: CreateUserRequest): Promise<AdminUser> => {
      // Replace with actual condition to check if mock is enabled
      const MOCK_ENABLED = false;
      const response = await apiClient.post(
        USER_ENDPOINTS.CREATE_USER,
        userData,
        { isMock: MOCK_ENABLED }
      );
      return response.data;
    },
    []
  );

  /**
   * Update an existing user
   */
  const updateUser = useCallback(
    async (userData: UpdateUserRequest): Promise<AdminUser> => {
      // Replace with actual condition to check if mock is enabled
      const MOCK_ENABLED = false;
      const response = await apiClient.put<AdminUser>(
        USER_ENDPOINTS.UPDATE_USER,
        userData,
        { isMock: MOCK_ENABLED }
      );

      return response.data;
    },
    []
  );

  /**
   * Delete a user
   */
  const deleteUser = useCallback(
    async (id: string): Promise<void> => {
      // Replace with actual condition to check if mock is enabled
      const MOCK_ENABLED = false;
      await apiClient.post(
        USER_ENDPOINTS.DELETE_USER,
        { userId: id },
        { isMock: MOCK_ENABLED }
      );
    },
    []
  );

  /**
   * Reset user password
   */
  const resetUserPassword = useCallback(
    async (id: string): Promise<{ temporaryPassword: string }> => {
      const response = await fetch(USER_ENDPOINTS.RESET_PASSWORD(id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers here
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
