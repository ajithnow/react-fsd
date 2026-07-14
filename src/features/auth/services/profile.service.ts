import apiClient from '@/core/api';
import { ENDPOINTS } from '@/features/auth/constants';
import { mapProfileToUser } from '../mappers/profile.mapper';
import type { User } from '../models/auth.model';

/**
 * Fetches the authenticated user's session profile.
 *
 * Use this instead of decoding JWT role claims — Identity bearer tokens are
 * opaque; role/permissions belong on a me/profile endpoint.
 *
 * Adaptability:
 * - Change `ENDPOINTS.ME` for your API path
 * - Call `setProfileMapper` for a project-specific response shape
 * - Call `setRolePermissions` when the API returns role only
 */
const useProfileService = () => {
  const getProfile = async (): Promise<User> => {
    const { data } = await apiClient.get(ENDPOINTS.ME);
    return mapProfileToUser(data);
  };

  return { getProfile };
};

export default useProfileService;
