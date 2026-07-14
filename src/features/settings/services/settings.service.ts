import { User } from '@/features/auth/models/auth.model';
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiResponse,
} from '../models/settings.model';
import apiClient from '@/core/api';
import authService from '@/features/auth/services';
import { ENDPOINTS as AUTH_ENDPOINTS } from '@/features/auth/constants';

/**
 * Settings profile read — delegates to auth getProfile so session identity
 * and settings stay on the same adaptable me endpoint.
 */
export const fetchProfile = async (): Promise<User> => {
  const { getProfile } = authService.useProfileService();
  return getProfile();
};

export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<UserProfile> => {
  const response = await apiClient.put<ApiResponse<UserProfile>>(
    AUTH_ENDPOINTS.ME,
    data
  );
  return response.data && (response.data.data ?? response.data);
};

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<void> => {
  const { confirmPassword, currentPassword, newPassword } = data;
  if (newPassword !== confirmPassword) {
    throw new Error('New password and confirmation do not match');
  }

  const payload = { NewPassword: newPassword, OldPassword: currentPassword };

  const response = await apiClient.post('/api/auth/change-password', payload);
  if (response.status >= 400) {
    const err = response.data;
    throw new Error(err?.error || 'Failed to change password');
  }
};
