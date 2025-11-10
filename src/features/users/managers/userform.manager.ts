import { useCallback } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useUserMutations } from '../queries/users.query';
import type { FormData, UpdateUserRequest } from '../models';

export function useUserFormManager(id?: string) {
  const navigate = useNavigate();

  const params = useParams({ strict: false });
  const resolvedId = id ?? (params.id as string);
  const {
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    useGetUserByIdQuery,
    suspendUser,
  } = useUserMutations();

  const {
    data: user,
    isLoading: isLoadingUser,
    error: loadError,
    refetch: refetchUser,
  } = useGetUserByIdQuery(resolvedId);

  const goBackToList = useCallback(() => {
    navigate({ to: '/users' });
  }, [navigate]);

  const handleCreate = useCallback(
    async (data: FormData) => {
      await createUser.mutateAsync(data);
      goBackToList();
    },
    [createUser, goBackToList]
  );

  const handleUpdate = useCallback(
    async (data: FormData) => {
      if (!resolvedId) {
        console.error('No id provided for update');
        return;
      }
      try {
        const payload: UpdateUserRequest = {
          userId: resolvedId,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        } as UpdateUserRequest;

        await updateUser.mutateAsync(payload);
        refetchUser();
        navigate({ to: '/users/$id', params: { id: resolvedId } });
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    },
    [resolvedId, updateUser, navigate]
  );

  const handleDelete = useCallback(async () => {
    if (!user) return;
    try {
      await deleteUser.mutateAsync(user.UserId);
      goBackToList();
    } catch (err) {
      console.error('Failed to delete user:', err);
      return;
    }
  }, [user, deleteUser, goBackToList]);

  const handleResetPassword = useCallback(async () => {
    if (!user) return;
    try {
      await resetPassword.mutateAsync(user.UserId);
    } catch (err) {
      console.error('Failed to reset password:', err);
    }
  }, [user, resetPassword]);

  const handleToggleSuspend = useCallback(async () => {
    if (!user) return;
    try {
      await suspendUser.mutateAsync({
        userId: user.UserId,
        status: !user.Status,
      });
      refetchUser();
    } catch (err) {
      console.error('Failed to toggle suspend:', err);
    }
  }, [user, suspendUser, refetchUser]);

  return {
    // data
    user,
    isLoadingUser,
    loadError,
    // create
    handleCreate,
    isCreating: createUser.isPending,
    createError: createUser.error,
    // update
    handleUpdate,
    isUpdating: updateUser.isPending,
    updateError: updateUser.error,
    // actions
    handleDelete,
    handleResetPassword,
    handleToggleSuspend,
    // navigation
    goBackToList,
  } as const;
}
