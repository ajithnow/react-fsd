import React from 'react';
import { useTranslation } from 'react-i18next';
import { SharedAlertDialog } from '@/shared/components';
import type { UserActionDialogProps } from '../../models/user.model';

export const UserActionDialog: React.FC<UserActionDialogProps> = ({
  type,
  open,
  onOpenChange,
  user,
  onConfirm,
}) => {
  const { t } = useTranslation('users');

  const getConfig = () => {
    switch (type) {
      case 'delete':
        return {
          title: t('users.detail.deleteTitle'),
          description: t('users.detail.deleteDescription'),
          confirmText: t('users.detail.deleteConfirm'),
          variant: 'destructive' as const,
        };
      case 'reset':
        return {
          title: t('users.detail.resetTitle'),
          description: t('users.detail.resetPasswordDescription'),
          confirmText: t('users.detail.resetConfirm'),
          variant: 'default' as const,
        };
      case 'suspend':
      default:
        return {
          title: user?.Status
            ? t('users.detail.suspendTitle')
            : t('users.detail.unsuspendTitle'),
          description: user?.Status
            ? t('users.detail.suspendDescription')
            : t('users.detail.unsuspendDescription'),
          confirmText: user?.Status
            ? t('users.detail.suspendConfirm')
            : t('users.detail.unsuspendConfirm'),
          variant: user?.Status
            ? ('destructive' as const)
            : ('default' as const),
        };
    }
  };

  const cfg = getConfig();

  return (
    <SharedAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={cfg.title}
      description={cfg.description}
      confirmText={cfg.confirmText}
      cancelText={t('users.cancel')}
      variant={cfg.variant}
      onConfirm={onConfirm}
    >
      <div className="text-sm">
        <p className="mb-2">
          {user ? `${user.FirstName} ${user.LastName}` : ''}
        </p>
        {user?.Email && (
          <p className="text-sm text-muted-foreground">{user.Email}</p>
        )}
      </div>
    </SharedAlertDialog>
  );
};

export default UserActionDialog;
