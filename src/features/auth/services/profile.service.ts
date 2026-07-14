import apiClient from '@/core/api';
import { ENDPOINTS } from '@/features/auth/constants';
import { toUser } from '../toUser';
import type { MeResponse, User } from '../types';

/**
 * Fetches session identity from `/me`.
 * Do not decode opaque bearer tokens for role/permissions.
 */
export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<{ data: MeResponse }>(ENDPOINTS.ME);
  return toUser(data.data);
}

const useProfileService = () => ({ getProfile });

export default useProfileService;
