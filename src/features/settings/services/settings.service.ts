import { User } from '@/features/auth/models/auth.model';
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiResponse,
} from '../models/settings.model';
import apiClient from '@/core/api';

// Toggle this or wire into env/feature flag when mocks are desired
const MOCK_ENABLED = false;

export const fetchProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/api/portal-admin/user/profile/self', {
    isMock: MOCK_ENABLED,
  });
  // axios responses may wrap data inside data.data depending on backend
  return (response.data && (response.data.data ?? response.data));
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const response = await apiClient.put<ApiResponse<UserProfile>>('/api/portal-admin/profile', data, {
    isMock: MOCK_ENABLED,
  });
  return (response.data && (response.data.data ?? response.data));
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  const { confirmPassword, currentPassword, newPassword } = data;
  if (newPassword !== confirmPassword) throw new Error('New password and confirmation do not match');

  const payload = { NewPassword: newPassword, OldPassword: currentPassword };

  // Use the portal-admin endpoint used by backend
  const response = await apiClient.post('/api/portal-admin/change-password', payload, {
    isMock: MOCK_ENABLED,
  });
  if (response.status >= 400) {
    const err = response.data;
    throw new Error(err?.error || 'Failed to change password');
  }
};
