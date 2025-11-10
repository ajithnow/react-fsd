import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/shadcn/components/ui/card';
import type { LoginFormProps, LoginFormValues } from '../../models/auth.model';
import useAuthSchema from '../../schema/auth.schema';
import { useTranslation } from 'react-i18next';

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation('auth');
  const { login: loginSchema } = useAuthSchema(t);
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className=" flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-semibold tracking-tight">
            {t('login.title', 'Welcome Back')}
          </CardTitle>
          <CardDescription>
            {t('login.subtitle', 'Sign in to your account to continue')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
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
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('login.passwordPlaceholder')}
                          autoComplete="current-password"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={togglePasswordVisibility}
                          disabled={isLoading}
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t('login.loginButton', 'Sign In')}
                </Button>

                {/* <div className="text-center">
                  <Button
                    type="button"
                    variant="default"
                    size="lg"
                    disabled={true}
                  >
                    {t('login.forgotPassword', 'Forgot your password?')}
                  </Button>
                </div> */}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};