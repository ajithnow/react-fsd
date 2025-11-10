import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { SidebarNav } from '../components/SidebarNav/SidebarNav';
import { SETTINGS_ROUTES } from '../constants';
import { Separator } from '@/lib/shadcn/components/ui/separator';
import { User, Wrench } from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader/PageHeader';
import { useTranslation } from 'react-i18next';
import settingsLocales from '../locales/en.json';

const sidebarItems = [
  {
    title: 'Profile',
    href: SETTINGS_ROUTES.PROFILE,
    icon: <User className="h-4 w-4" />,
  },
  {
    title: 'Account',
    href: SETTINGS_ROUTES.ACCOUNT,
    icon: <Wrench className="h-4 w-4" />,
  },
];

export const SettingsLayout: React.FC = () => {
  const { t } = useTranslation('settings');
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={t('title') || settingsLocales.title}
        description={t('description') || settingsLocales.description}
      />
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-16 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl lg:pl-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
