import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserService } from '../services';
import {
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
} from '../models';
import { useToast } from '@/shared/hooks/useToast';
import { useTranslation } from 'react-i18next';
import { BackendErrorResponse } from '@/shared';

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: UserFilters) =>
    [...USER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...USER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.details(), id] as const,
} as const;

/**
 * Hook that returns all user mutations
 */
export function useUserMutations() {
  const service = useUserService();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { t } = useTranslation('users');

  const invalidateLists = () =>
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });

  const notification = (
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' | 'message'
  ) => {
    notify(
      message,
      {
        position: 'bottom-right',
        duration: 2000,
      },
      type
    );
  };

  return {
    createUser: useMutation({
      mutationFn: (userData: CreateUserRequest) => service.createUser(userData),
      onSuccess: () => {
        notification(
          t('users.userActionNotificationSuccess', {
            action: t('users.creation'),
          }),
          'success'
        );
        invalidateLists();
      },
      onError: (error: BackendErrorResponse) => {
        notification(error.response?.data?.message || error.message, 'error');
      },
    }),

    updateUser: useMutation({
      mutationFn: (userData: UpdateUserRequest) => service.updateUser(userData),
      onSuccess: (updatedUser: AdminUser) => {
        queryClient.setQueryData(
          USER_QUERY_KEYS.detail(updatedUser.UserId),
          updatedUser
        );
        invalidateLists();
      },
    }),

    suspendUser: useMutation({
      mutationFn: (userData: UpdateUserRequest) =>
        service.suspendUser(userData),
      onSuccess: (_response, variables) => {
        const actionText = !variables?.status
          ? t('users.suspension')
          : t('users.unSuspension');
        notification(
          t('users.userActionNotificationSuccess', { action: actionText }),
          'info'
        );
        invalidateLists();
      },
    }),

    deleteUser: useMutation({
      mutationFn: (id: string) => service.deleteUser(id),
      onSuccess: (_, deletedId) => {
        queryClient.removeQueries({
          queryKey: USER_QUERY_KEYS.detail(deletedId),
        });
        notification(
          t('users.userActionNotificationSuccess', { action: 'deleted' }),
          'success'
        );
        invalidateLists();
      },
    }),

    resetPassword: useMutation({
      mutationFn: (id: string) => service.resetUserPassword(id),
      onSuccess: () => {
        notification(t('users.passwordResetSuccess'), 'success');
      },
    }),

    useListUsersQuery: (filters?: UserFilters) => {
      return useQuery({
        queryKey: USER_QUERY_KEYS.list(filters),
        queryFn: () => service.getUsers(filters),
        staleTime: 5 * 60 * 1000,
      });
    },
    useGetUserByIdQuery: (id: string) => {
      return useQuery({
        queryKey: USER_QUERY_KEYS.detail(id),
        queryFn: () => service.getUserById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
      });
    }
  };
}
