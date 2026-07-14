import React from 'react';
import { useLoginMutation } from '../queries/login.query';
import { useLoginManager } from '../managers/login.manager';
import { LoginForm } from '../components';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import { useTranslation } from 'react-i18next';
import type { LoginCredentials } from '../types';

export const LoginPage: React.FC = () => {
  const { mutateAsync: login, isPending: isLoading } = useLoginMutation();
  const { onLoginSuccess, onLoginError } = useLoginManager();

  const { t } = useTranslation('auth');
  useDocumentTitle(t('login.pageTitle'), 'Admin Dashboard - Login');

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const tokens = await login(credentials);
      await onLoginSuccess(tokens);
    } catch (error) {
      onLoginError(error);
    }
  };

  return (
    <>
      <div className="text-center mb-3">
        <h1 className="text-2xl font-bold">{t('login.welcomeBack')}</h1>
        <p className="text-muted-foreground mt-2">{t('login.signInPrompt')}</p>
      </div>

      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </>
  );
};
