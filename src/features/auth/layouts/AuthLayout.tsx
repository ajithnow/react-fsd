import { AuthLayoutProps } from '../models/auth.model';
import { useTranslation } from 'react-i18next';
import logoImage from '@/assets/images/logo.png';

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { t } = useTranslation('auth');
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground items-center justify-center">
        <div className="max-w-md text-center">
          <img
            src={logoImage}
            alt="Application Logo"
            className="mx-auto mb-4"
            width={'100px'}
          />
          <h1 className="text-4xl font-bold mb-4">{t('login.welcomeText')}</h1>
          <p className="text-lg opacity-90">{t('login.welcomeSubText')}</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold">{t('login.welcomeText')}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
