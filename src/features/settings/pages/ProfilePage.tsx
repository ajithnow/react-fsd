import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentSection } from '../components/ContentSection/ContentSection';
import { Input } from '@/lib/shadcn/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/lib/shadcn/components/ui/form';
import { useTranslation } from 'react-i18next';
import settingsLocales from '../locales/en.json';
import { toast } from 'sonner';
import { profileSchema, ProfileFormValues } from '../schema';
import { useSettingsManager } from '../managers/settings.manager';

export const ProfilePage: React.FC = () => {
  const {  updateProfile, errors, profileQuery } =
    useSettingsManager();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '', email: '', role: '' },
  });
  const { t } = useTranslation('settings');

  useEffect(() => {
    if (profileQuery.data) {
      form.reset({
        firstName: profileQuery.data.FirstName,
        lastName: profileQuery.data.LastName,
        email: profileQuery.data.Email,
        role: profileQuery.data.Role,
      });
    }
  }, [profileQuery.data, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      updateProfile(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    }
  };

  if (profileQuery.isLoading) {
    return <div>{t('profile.loading', 'Loading...')}</div>;
  }

  return (
    <ContentSection
      title={t('profile.title') || settingsLocales.profile.title}
      desc={t('profile.desc') || settingsLocales.profile.desc}
    >
      <Form {...form}>
        {errors.updateProfileError?.response?.data?.message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">
              {errors.updateProfileError?.response?.data?.message}
            </p>
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="firstName"
              control={form.control}
              disabled={true}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.form.firstName')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('profile.form.firstName')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              disabled={true}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.form.lastName')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('profile.form.lastName')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('profile.form.email') ||
                    settingsLocales.profile.form.email}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormDescription>Your email cannot be changed.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            name="role"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('profile.form.role') || settingsLocales.profile.form.role}
                </FormLabel>
                <FormControl>
                  <Input disabled value={field.value} />
                </FormControl>
                <FormDescription>Your role cannot be changed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ContentSection>
  );
};
