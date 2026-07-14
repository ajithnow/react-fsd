import type { AdminUser } from '@/features/users';

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  role: AdminUser['Role'];
};

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  visibility?: 'public' | 'private';
  urls?: string[];
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type NotificationSettings = {
  type: 'all' | 'mentions' | 'none';
  communicationEmails: boolean;
  marketingEmails: boolean;
  securityEmails: boolean;
};

export type UpdateNotificationSettingsRequest = {
  type?: 'all' | 'mentions' | 'none';
  communicationEmails?: boolean;
  marketingEmails?: boolean;
  securityEmails?: boolean;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiError = {
  error: string;
  details?: string[];
};
