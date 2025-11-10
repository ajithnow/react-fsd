import React, { useState } from 'react';
import { useCanGoBack, useParams, useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { UserForm } from '../components';
import { UserActionDialog } from '@/features/users/components/UserActionDialogs/UserActionDialogs';
import {
  useAlertDialog,
  PageHeader,
  SharedAlertDialog,
} from '@/shared/components';
import { useUserFormManager } from '@/features/users/managers/userform.manager';
import type { FormData } from '../models';
import { useUnsavedChangesBlocker } from '@/shared';

export const UserEditPage: React.FC = () => {
  const params = useParams({ strict: false });
  const { t } = useTranslation('users');
  const id = params.id as string;
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const deleteDialog = useAlertDialog();
  const resetDialog = useAlertDialog();
  const suspendDialog = useAlertDialog();

  const confirmDialog = useAlertDialog();
  const [isDirty, setIsDirty] = useState(false);

  const { handleConfirmLeave, handleCancelLeave } = useUnsavedChangesBlocker({
    isDirty: isDirty,
    confirmDialog,
  });
  const { isOpen: isAlertOpen, hideAlert } = confirmDialog;

  const handleGoBack = () => {
    if (canGoBack) {
      router.history.back();
    } else {
      router.navigate({ to: '/users' });
    }
  };

  const {
    user,
    isLoadingUser: isLoading,
    loadError: error,
    handleUpdate,
    handleDelete,
    handleResetPassword,
    handleToggleSuspend,
  } = useUserFormManager(id);

  const handleSubmit = async (data: FormData) => {
    handleConfirmLeave();
    await handleUpdate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center p-8">
          <div className="text-muted-foreground">{t('users.loadingUser')}</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            className="p-2 text-sm text-muted-foreground"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('users.backToUser')}
          </button>
        </div>
        <div className="text-center p-8">
          <div className="text-red-600">{t('users.failedToLoadDetails')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={t('users.editUser')}
        description={t('users.updateInformation', { entity: user.FirstName })}
        action={{
          label: t('users.backToUser'),
          onClick: handleGoBack,
          icon: <ArrowLeft className="h-4 w-4 mr-2" />,
        }}
      />

      <div>
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          isLoading={false}
          error={undefined}
          translate={t}
          onDirtyChange={setIsDirty}
        />
      </div>

      <SharedAlertDialog
        open={isAlertOpen}
        onOpenChange={hideAlert}
        title={t('users.discardChange')}
        description={t('users.discardChangeDesc')}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
        variant="destructive"
        confirmText={t('users.discard')}
      />

      {/* Action Dialogs */}
      <UserActionDialog
        type="delete"
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.setIsOpen}
        user={user}
        onConfirm={handleDelete}
      />

      <UserActionDialog
        type="reset"
        open={resetDialog.isOpen}
        onOpenChange={resetDialog.setIsOpen}
        user={user}
        onConfirm={handleResetPassword}
      />

      <UserActionDialog
        type="suspend"
        open={suspendDialog.isOpen}
        onOpenChange={suspendDialog.setIsOpen}
        user={user}
        onConfirm={handleToggleSuspend}
      />
    </div>
  );
};
