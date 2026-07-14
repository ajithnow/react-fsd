import { AuthLayoutProps } from '../types';
import { useTranslation } from 'react-i18next';
import logoImage from '@/assets/images/logo.svg';

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { t } = useTranslation('auth');
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground items-center justify-center">
        <div className="max-w-md text-center">
          <img
            src={logoImage}
            alt=""
            className="mx-auto mb-4 size-24 rounded-2xl shadow-sm"
          />
          <h1 className="text-4xl font-bold mb-4">{t('login.welcomeText')}</h1>
          <p className="text-lg opacity-90">{t('login.welcomeSubText')}</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-3 text-center lg:hidden">
            <img
              src={logoImage}
              alt=""
              className="size-14 rounded-xl"
            />
            <h1 className="text-3xl font-bold">{t('login.welcomeText')}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
