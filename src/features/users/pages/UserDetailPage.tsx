import React, { useCallback, useMemo } from 'react';
import {
  useCanGoBack,
  useNavigate,
  useParams,
  useRouter,
} from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  //  Shield,
  PauseCircle,
  Play,
} from 'lucide-react';
import { Button } from '@/lib/shadcn/components/ui/button';
import { Badge } from '@/lib/shadcn/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/lib/shadcn/components/ui/card';

import { useUserFormManager } from '@/features/users/managers/userform.manager';
import { useAlertDialog } from '@/shared/components';
import { UserActionDialog } from '@/features/users/components/UserActionDialogs/UserActionDialogs';
import { getUserTypeData } from '@/features/users';
import { authStorage } from '@/features/auth/utils';

export const UserDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const params = useParams({ strict: false });
  const id = params.id as string;
  const { t } = useTranslation('users');

  const typeData = useMemo(() => getUserTypeData(t), [t]);

  const {
    user,
    isLoadingUser: isLoading,
    loadError: error,
    handleDelete,
    handleResetPassword,
    handleToggleSuspend,
  } = useUserFormManager(id);

  const suspendDialog = useAlertDialog();

  const handleGoBack = () => {
    if (canGoBack) {
      router.history.back();
    } else {
      router.navigate({ to: '/users' });
    }
  };

  const handleEdit = () => {
    navigate({ to: '/users/$id/edit', params: { id } });
  };

  const checkSameUser = useCallback((email: string) => {
    const user = authStorage.getUser() as { Email?: string } | undefined;
    return user?.Email === email;
  }, []);

  const deleteDialog = useAlertDialog();

  const resetDialog = useAlertDialog();

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
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('users.backToUser')}
          </Button>
        </div>
        <div className="text-center p-8">
          <div className="text-red-600">{t('users.failedToLoadDetails')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleGoBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-lg font-semibold text-slate-700">
                {user.FirstName?.[0] ?? 'U'}
                {user.LastName?.[0] ?? ''}
              </div>

              <div>
                <h1 className="text-2xl font-semibold leading-tight">
                  {user.FirstName} {user.LastName}
                </h1>
                <p className="text-sm text-muted-foreground">{user.Email}</p>
                <div className="mt-2 flex items-center gap-2">
                  {(() => {
                    const info = typeData[user.Role as keyof typeof typeData];
                    return (
                      <Badge className={info?.className}>
                        {info?.label ?? user.Role}
                      </Badge>
                    );
                  })()}

                  {user.Status ? (
                    <Badge className="bg-emerald-100 text-emerald-800">
                      {t('users.active')}
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-100 text-rose-800">
                      {t('users.suspended')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!checkSameUser(user.Email) && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('users.editUser')}</span>
              </Button>
              {/* <Button variant="outline" onClick={() => resetDialog.showAlert()}>
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">
                {t('users.resetPassword')}
              </span>
            </Button> */}
              <Button
                variant="outline"
                onClick={() => suspendDialog.showAlert()}
              >
                {user.Status ? (
                  <span className="flex items-center">
                    <PauseCircle className="h-4 w-4 mr-2" />{' '}
                    <span className="hidden sm:inline">
                      {t('users.suspendUser')}
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Play className="h-4 w-4 mr-2" />{' '}
                    <span className="hidden sm:inline">
                      {t('users.unsuspendUser')}
                    </span>
                  </span>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteDialog.showAlert()}
                className="bg-rose-600 hover:bg-rose-700 text-white border-transparent"
                aria-label={t('users.deleteUser')}
              >
                <Trash2 className="h-4 w-4 mr-2 text-white" />
                <span className="hidden sm:inline">
                  {t('users.deleteUser')}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t('users.detail.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('users.form.firstName')}
                  </p>
                  <p className="font-medium">{user.FirstName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('users.form.lastName')}
                  </p>
                  <p className="font-medium">{user.LastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('users.form.email')}
                  </p>
                  <p className="font-medium">{user.Email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('users.role')}
                  </p>
                  <p className="font-medium">
                    {typeData[user.Role]?.label ?? user.Role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t('users.detail.metadata')}</CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col justify-between">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">
                    {t('users.detail.userId')}
                  </p>
                  <p className="font-mono text-xs break-all">{user.UserId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('users.role')}</p>
                  <div>
                    {(() => {
                      const info = typeData[user.Role as keyof typeof typeData];
                      return (
                        <Badge className={info?.className}>
                          {info?.label ?? user.Role}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('users.status')}</p>
                  <p className="font-medium">
                    {user.Status ? t('users.active') : t('users.suspended')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
