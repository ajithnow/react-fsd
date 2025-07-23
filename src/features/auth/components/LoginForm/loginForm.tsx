import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/lib/shadcn/components/ui/form";
import { Input } from '@/lib/shadcn/components/ui/input';
import { Button } from '@/lib/shadcn/components/ui/button';
import type { LoginFormProps, LoginFormValues } from '../../models/auth.model';
import useAuthSchema from '../../schema/auth.schema';
import { useTranslation } from 'react-i18next';

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const {t} = useTranslation('auth');
  const { login: loginSchema } = useAuthSchema(t);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = (data: LoginFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login.usernameLabel')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('login.usernamePlaceholder')}
                  autoComplete="username"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login.passwordLabel')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t('login.passwordPlaceholder')}
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? t('login.loadingButton') : t('login.loginButton')}
        </Button>
      </form>
    </Form>
  );
};