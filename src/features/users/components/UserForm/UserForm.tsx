import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/shadcn/components/ui/form';
import { Input } from '@/lib/shadcn/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/shadcn/components/ui/select';
import { Button } from '@/lib/shadcn/components/ui/button';
import { Card, CardContent } from '@/lib/shadcn/components/ui/card';
import { UserFormProps, UserFormSchema, FormData } from '@/features/users';
import { SharedAlertDialog, useAlertDialog } from '@/shared/components';
import { authStorage } from '@/features/auth/utils';
import { ROLES } from '@/features/rbac';

export const UserForm: React.FC<
  UserFormProps & { onDirtyChange?: (dirty: boolean) => void }
> = ({
  user,
  onSubmit,
  isLoading = false,
  error,
  className,
  translate,
  onDirtyChange,
}) => {
  const { userSchema } = UserFormSchema();
  const { isOpen, showAlert, hideAlert } = useAlertDialog();
  const loggedUser = authStorage.getUser() as { Email?: string } | undefined;

  const checkSameUser = useCallback(
    (email?: string) => loggedUser?.Email === email,
    [loggedUser]
  );

  const isAdmin = useCallback(() => user?.Role === ROLES.SUPER_ADMIN, [user]);

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: user?.FirstName ?? '',
      lastName: user?.LastName ?? '',
      email: user?.Email ?? '',
      role: user?.Role,
    },
  });

  const isEditing = !!user;

  const handleConfirmUpdate = () => {
    const data = form.getValues();
    hideAlert();
    onSubmit(data);
  };

  const buttonText = React.useMemo(() => {
    if (isLoading) return translate('users.form.saving');
    if (isEditing) return translate('users.form.updateUser');
    return translate('users.form.createUser');
  }, [isLoading, isEditing, translate]);

useEffect(() => {
  onDirtyChange?.(form.formState.isDirty);
}, [form.formState.isDirty, onDirtyChange]);

  return (
    <>
      <Card className={className}>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => showAlert())}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate('users.form.firstName')}*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={translate('users.form.enterFirstName')}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="min-h-[1.25rem]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate('users.form.lastName')}*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={translate('users.form.enterLastName')}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="min-h-[1.25rem]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate('users.form.email')}*</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={translate('users.form.enterEmail')}
                          {...field}
                          disabled={isLoading || isEditing}
                        />
                      </FormControl>
                      <div className="min-h-[1rem]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

  {/* Password */}
                {/* <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translate('users.form.password')}*</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={translate('users.form.enterPassword')}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Hide if user is super admin */}
                {!isAdmin() && (
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>{translate('users.form.role')}*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={translate(
                                    'users.form.selectRole'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="POWER_ADMIN">
                                {translate('users.form.powerUser')}
                              </SelectItem>
                              <SelectItem value="NORMAL_USER">
                                {translate('users.form.normalUser')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="min-h-[1rem]">
                            <FormMessage />
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !form.formState.isValid ||
                    checkSameUser(user?.Email)
                  }
                  className="min-w-[120px]"
                >
                  {buttonText}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Alert Dialog */}
      <SharedAlertDialog
        open={isOpen}
        onOpenChange={hideAlert}
        title={
          isEditing
            ? translate('users.form.updateUser')
            : translate('users.form.createUser')
        }
        description={
          isEditing
            ? translate('users.confirmUpdateUser')
            : translate('users.confirmCreateUser')
        }
        confirmText={
          isEditing ? translate('users.update') : translate('users.create')
        }
        cancelText={translate('users.cancel')}
        onConfirm={handleConfirmUpdate}
      />
    </>
  );
};
