import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { UserForm } from '../components';
import { useUserFormManager } from '@/features/users/managers/userform.manager';
import {
  PageHeader,
  SharedAlertDialog,
  useAlertDialog,
} from '@/shared/components';

import type { FormData } from '../models';
import { BackendErrorResponse } from '@/shared/models/common.model';
import { useUnsavedChangesBlocker } from '@/shared';
import { useCanGoBack, useRouter } from '@tanstack/react-router';

export const UserCreatePage: React.FC = () => {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const { t } = useTranslation('users');
  const { handleCreate, isCreating, createError } = useUserFormManager();

  const [isDirty, setIsDirty] = useState(false);
  const confirmDialog = useAlertDialog();

  const { handleConfirmLeave, handleCancelLeave } = useUnsavedChangesBlocker({
    isDirty,
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

  const handleSubmit = async (data: FormData) => {
    handleConfirmLeave();
    await handleCreate(data);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={t('users.title')}
        description={t('users.subtitle')}
        action={{
          label: t('users.backToUser'),
          onClick: handleGoBack,
          icon: <ArrowLeft className="h-4 w-4 mr-2" />,
        }}
      />

      <UserForm
        onSubmit={handleSubmit}
        isLoading={isCreating}
        error={(createError as BackendErrorResponse)?.response?.data?.Message}
        translate={t}
        onDirtyChange={setIsDirty}
      />

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
    </div>
  );
};
