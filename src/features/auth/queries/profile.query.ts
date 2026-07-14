import { useQuery } from '@tanstack/react-query';
import authService from '../services';
import { isAuthenticated } from '../utils';

export const PROFILE_QUERY_KEY = ['auth', 'profile'] as const;

export const useProfileQuery = (enabled = true) => {
  const { getProfile } = authService.useProfileService();

  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
    enabled: enabled && isAuthenticated(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
