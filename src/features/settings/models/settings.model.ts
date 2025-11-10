import { AdminUser } from '@/features/users';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: AdminUser['Role'];
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  visibility?: 'public' | 'private';
  urls?: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationSettings {
  type: 'all' | 'mentions' | 'none';
  communicationEmails: boolean;
  marketingEmails: boolean;
  securityEmails: boolean;
}

export interface UpdateNotificationSettingsRequest {
  type?: 'all' | 'mentions' | 'none';
  communicationEmails?: boolean;
  marketingEmails?: boolean;
  securityEmails?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: string[];
}
