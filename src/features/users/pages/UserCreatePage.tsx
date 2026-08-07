import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { UserForm } from '../components';
import { useUserFormManager } from '@/features/users/managers/userform.manager';
import { PageHeader } from '@/shared/components';

import type { ApiErrorResponse } from '@/shared/types';
import { useCanGoBack, useRouter } from '@tanstack/react-router';

export const UserCreatePage: React.FC = () => {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const { t } = useTranslation('users');
  const { handleCreate, isCreating, createError } = useUserFormManager();

  const handleGoBack = () => {
    if (canGoBack) {
      router.history.back();
    } else {
      void router.navigate({ to: '/users' });
    }
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
        onSubmit={handleCreate}
        isLoading={isCreating}
        error={(createError as ApiErrorResponse)?.response?.data?.message}
        translate={t}
      />
    </div>
  );
};
