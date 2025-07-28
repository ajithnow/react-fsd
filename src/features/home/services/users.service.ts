import axios from 'axios';
import type { UserData, UsersApiResponse } from '../mocks/users.mock';

// API client configuration
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Users API service
export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  role?: string | string[];
  status?: string;
  name?: string;
}

export interface PaginationResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface UsersResponse {
  data: UserData[];
  pagination: PaginationResponse;
}

class UsersService {
  /**
   * Get users with pagination, sorting, and filtering
   */
  async getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
    try {
      const response = await apiClient.get<UsersApiResponse>('/users', {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 10,
          sortField: params.sortField,
          sortDirection: params.sortDirection,
          role: Array.isArray(params.role) ? params.role.join(',') : params.role,
          status: params.status,
          name: params.name,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch users');
      }

      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
      }
      throw error;
    }
  }

  /**
   * Get a single user by ID
   */
  async getUserById(id: number): Promise<UserData> {
    try {
      const response = await apiClient.get<{ data: UserData; success: boolean; message: string }>(`/users/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch user');
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user');
      }
      throw error;
    }
  }
}

// Export singleton instance
export const usersService = new UsersService();
export default usersService;
