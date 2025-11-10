import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  updateProfile,
  changePassword,
  fetchProfile,
} from '../services/settings.service';
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '../models/settings.model';
import { useToast } from '@/shared/hooks/useToast';
import { BackendErrorResponse } from '@/shared';
import { useTranslation } from 'react-i18next';
import { useRef, useCallback } from 'react';

// Query keys
export const settingsKeys = {
  all: ['settings'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
  notifications: () => [...settingsKeys.all, 'notifications'] as const,
};

// Single hook that returns all settings-related queries/mutations and helpers
export const useSettingsQueries = () => {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { t } = useTranslation('settings');

  const shownNotifications = useRef(new Set<string>());

  const notifyOnce = useCallback(
    (
      key: string,
      message: string,
      type: 'success' | 'error' | 'info' | 'warning' | 'message' = 'info'
    ) => {
      if (shownNotifications.current.has(key)) return;
      shownNotifications.current.add(key);
      notify(
        message,
        {
          position: 'bottom-right',
          duration: 2000,
        },
        type
      );
    },
    [notify]
  );

  const profileQuery = useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: async () => fetchProfile(),
    initialData: undefined,
    staleTime: 0,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: updatedProfile => {
      queryClient.setQueryData(settingsKeys.profile(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      notifyOnce(
        'profile-updated',
        t('profile.updateSuccess') || 'Profile updated',
        'success'
      );
    },
    onError: (error: BackendErrorResponse) => {
      console.error('Failed to update profile:', error);
      notify(
        error?.message || 'Failed to update profile',
        { position: 'bottom-right', duration: 2000 },
        'error'
      );
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onError: (error: BackendErrorResponse) => {
      notify(
        error?.response?.data?.message ?? t('failedToChangePassword'),
        { position: 'bottom-right', duration: 2000 },
        'error'
      );
    },
    onSuccess: () => {
      notifyOnce(
        'password-changed',
        t('account.passwordChangedSuccessfully') || 'Password changed',
        'success'
      );
    },
  });

  return {
    profileQuery,
    updateProfileMutation,
    changePasswordMutation,
    notifyOnce,
    invalidateProfile: () =>
    queryClient.invalidateQueries({ queryKey: settingsKeys.profile() }),
  };
};

