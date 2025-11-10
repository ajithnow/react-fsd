import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/lib/shadcn/components/ui/alert';
import { UserDataTable } from '../components';
import { useUserTableLogic } from '../managers/users.manager';
import { PageHeader, useAlertDialog } from '@/shared/components';
import { UserActionDialog } from '../components/UserActionDialogs/UserActionDialogs';
import type { AdminUser } from '../models';
export const UsersListPage: React.FC = () => {
  const { t } = useTranslation('users');
  const {
    users,
    loading,
    error,
    pagination,
    currentFilters,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    onFilterChange,
    onDelete,
    onResetPassword,
    onSuspend: managerOnSuspend,
    onCreate,
    onView,
    onEdit,
  } = useUserTableLogic();

  // Dialog state for suspend/unsuspend from the list
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const suspendDialog = useAlertDialog();

  // Delete dialog state for list actions
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const deleteDialog = useAlertDialog();

  // Reset password dialog state for list actions
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const resetDialog = useAlertDialog();

  const handleRequestSuspend = (user: AdminUser) => {
    setSelectedUser(user);
    suspendDialog.showAlert();
  };

  const handleRequestDelete = (user: AdminUser) => {
    setDeleteTarget(user);
    deleteDialog.showAlert();
  };

  const handleRequestReset = (user: AdminUser) => {
    setResetTarget(user);
    resetDialog.showAlert();
  };

  const handleConfirmSuspend = async () => {
    if (!selectedUser) return;
    try {
      await managerOnSuspend(selectedUser);
    } catch (err) {
      // keep console logging similar to other handlers
      console.error('Failed to toggle suspend from list (confirm):', err);
    } finally {
      setSelectedUser(null);
      suspendDialog.hideAlert();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await onDelete(deleteTarget);
    } catch (err) {
      console.error('Delete from list (confirm) failed:', err);
    } finally {
      setDeleteTarget(null);
      deleteDialog.hideAlert();
    }
  };

  const handleConfirmReset = async () => {
    if (!resetTarget) return;
    try {
      await onResetPassword(resetTarget);
    } catch (err) {
      console.error('Reset password from list (confirm) failed:', err);
    } finally {
      setResetTarget(null);
      resetDialog.hideAlert();
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={t('users.managementTitle')}
        description={t('users.managementDescription')}
        action={{
          label: t('users.addNewAdmin'),
          onClick: onCreate,
          icon: <Plus className="mr-1 h-4 w-4" />,
        }}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{t('users.failedToLoadUsers')}</AlertDescription>
        </Alert>
      )}

      <UserDataTable
        users={users}
        onClickUser={onView}
        loading={loading}
        pagination={pagination}
        currentFilters={currentFilters}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
        onView={onView}
        onEdit={onEdit}
        onDelete={handleRequestDelete}
        onResetPassword={handleRequestReset}
        onSuspend={handleRequestSuspend}
      />

      <UserActionDialog
        type="suspend"
        open={suspendDialog.isOpen}
        onOpenChange={suspendDialog.setIsOpen}
        user={selectedUser}
        onConfirm={handleConfirmSuspend}
      />

      <UserActionDialog
        type="reset"
        open={resetDialog.isOpen}
        onOpenChange={resetDialog.setIsOpen}
        user={resetTarget}
        onConfirm={handleConfirmReset}
      />

      <UserActionDialog
        type="delete"
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.setIsOpen}
        user={deleteTarget}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
