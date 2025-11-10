import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentSection } from '../components/ContentSection/ContentSection';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/lib/shadcn/components/ui/form';
import { Input } from '@/lib/shadcn/components/ui/input';
import { Button } from '@/lib/shadcn/components/ui/button';
import { useTranslation } from 'react-i18next';
import settingsLocales from '../locales/en.json';
import { changePasswordSchema, ChangePasswordFormValues } from '../schema';
import { useSettingsManager } from '../managers/settings.manager';

export const AccountPage: React.FC = () => {
  const { t } = useTranslation('settings');
  const { changePassword, isChangePasswordLoading, errors } =
    useSettingsManager();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    changePassword(data, form.reset);
  };

  return (
    <ContentSection
      title={t('account.title') || settingsLocales.account.title}
      desc={t('account.desc') || settingsLocales.account.desc}
    >
      <Form {...form}>
        {errors.changePasswordError?.response?.data?.message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">
              {errors.changePasswordError?.response?.data?.message}
            </p>
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="currentPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('account.form.currentPassword') ||
                    settingsLocales.account.form.currentPassword}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your current password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('account.form.newPassword') ||
                    settingsLocales.account.form.newPassword}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your new password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('account.form.confirmPassword') ||
                    settingsLocales.account.form.confirmPassword}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isChangePasswordLoading}
            className="w-full"
          >
            {isChangePasswordLoading
              ? t('account.form.changing') ||
                settingsLocales.account.form.changing
              : t('account.form.changeButton') ||
                settingsLocales.account.form.changeButton}
          </Button>
        </form>
      </Form>
    </ContentSection>
  );
};
