import {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '../models/settings.model';
import { useSettingsQueries } from '../queries/settings.queries';

export const useSettingsManager = () => {
  const { profileQuery, updateProfileMutation, changePasswordMutation } =
    useSettingsQueries();

  const updateProfile = (data: UpdateProfileRequest) => {
    updateProfileMutation.mutateAsync(data);
    return {
      loading: updateProfileMutation.isPending,
      error: updateProfileMutation.error,
      data: updateProfileMutation.data,
    };
  };

  const changePassword = async (
    data: ChangePasswordRequest,
    resetForm: () => void
  ) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      resetForm();
    } catch (error) {
      console.error('Change password error:', error);
      throw error; // Re-throw to handle in the component
    }
  };

  return {
    profileQuery,
    isProfileLoading: profileQuery.isLoading,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    errors: {
      updateProfileError: updateProfileMutation.error,
      changePasswordError: changePasswordMutation.error,
    },
    updateProfile,
    changePassword,
  } as const;
};
