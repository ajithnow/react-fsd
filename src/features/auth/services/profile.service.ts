import apiClient from '@/core/api';
import { ENDPOINTS } from '@/features/auth/constants';
import { toUser } from '../toUser';
import type { MeResponse, User } from '../types';

/**
 * Fetches session identity from `/me`.
 * Do not decode opaque bearer tokens for role/permissions.
 */
const useProfileService = () => {
  const getProfile = async (): Promise<User> => {
    const { data } = await apiClient.get<{ data: MeResponse }>(ENDPOINTS.ME);
    return toUser(data.data);
  };

  return { getProfile };
};

export default useProfileService;
