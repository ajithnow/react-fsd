import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, User, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob dark:bg-purple-700"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob dark:bg-yellow-700" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob dark:bg-pink-700" style={{animationDelay: '4s'}}></div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border border-white/20 bg-white/70 backdrop-blur-xl dark:bg-slate-900/70 dark:border-slate-700/50 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <CardHeader className="space-y-6 text-center pb-8 pt-8">
          <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 shadow-2xl ring-4 ring-blue-500/20 animate-pulse">
            <Lock className="h-9 w-9 text-white drop-shadow-sm" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent tracking-tight">
              {t('login.title', 'Welcome Back')}
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-base font-medium">
              {t('login.subtitle', 'Sign in to your account to continue')}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      {t('login.usernameLabel')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder={t('login.usernamePlaceholder')}
                          autoComplete="username"
                          disabled={isLoading}
                          className="h-14 pl-4 pr-4 text-base bg-white/60 dark:bg-slate-800/60 border-2 border-slate-200/70 dark:border-slate-700/70 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl transition-all duration-300 hover:shadow-md hover:border-blue-300 focus:shadow-lg placeholder:text-slate-400 group-hover:bg-white/80 dark:group-hover:bg-slate-800/80"
                          {...field}
                        />
                        <div className="absolute inset-0 rounded-xl ring-0 ring-blue-500/20 transition-all duration-300 group-focus-within:ring-4 pointer-events-none"></div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-purple-500" />
                      {t('login.passwordLabel')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t('login.passwordPlaceholder')}
                          autoComplete="current-password"
                          disabled={isLoading}
                          className="h-14 pl-4 pr-14 text-base bg-white/60 dark:bg-slate-800/60 border-2 border-slate-200/70 dark:border-slate-700/70 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl transition-all duration-300 hover:shadow-md hover:border-purple-300 focus:shadow-lg placeholder:text-slate-400 group-hover:bg-white/80 dark:group-hover:bg-slate-800/80"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          disabled={isLoading}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 disabled:cursor-not-allowed hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500/30 rounded-lg p-1"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                        <div className="absolute inset-0 rounded-xl ring-0 ring-purple-500/20 transition-all duration-300 group-focus-within:ring-4 pointer-events-none"></div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />

              <div className="space-y-6 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold text-base shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:hover:scale-100 rounded-xl ring-0 hover:ring-4 hover:ring-blue-500/20 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      {t('login.loadingButton', 'Signing in...')}
                    </>
                  ) : (
                    <span className="relative z-10">{t('login.loginButton', 'Sign In')}</span>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-300/60 dark:border-slate-600/60" />
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg px-4 py-2 font-medium hover:scale-105 active:scale-95"
                  >
                    {t('login.forgotPassword', 'Forgot your password?')}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};