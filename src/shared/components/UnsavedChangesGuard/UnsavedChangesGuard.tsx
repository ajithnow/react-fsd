import React from 'react';
import { useTranslation } from 'react-i18next';
import { SharedAlertDialog } from '../AlertDialog/SharedAlertDialog';
import { useUnsavedChangesBlocker } from '@/shared/hooks/useUnsavedChangesBlocker';

/**
 * Mounted once (see `GlobalLayout`). Blocks navigation app-wide while any
 * form reports itself dirty via `useReportFormDirty` — no per-page wiring.
 */
export const UnsavedChangesGuard: React.FC = () => {
  const { t } = useTranslation('shared');
  const { isOpen, hideAlert, handleConfirmLeave, handleCancelLeave } =
    useUnsavedChangesBlocker();

  return (
    <SharedAlertDialog
      open={isOpen}
      onOpenChange={hideAlert}
      title={t('unsavedChanges.title')}
      description={t('unsavedChanges.description')}
      confirmText={t('unsavedChanges.confirm')}
      cancelText={t('unsavedChanges.cancel')}
      onConfirm={handleConfirmLeave}
      onCancel={handleCancelLeave}
      variant="destructive"
    />
  );
};
