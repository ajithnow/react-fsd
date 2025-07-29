import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users.service';

export interface UsersQueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  role?: string[];
  status?: string;
  name?: string;
}

export const useUsersQuery = (params: UsersQueryParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
