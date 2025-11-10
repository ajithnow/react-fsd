import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { UserPlus, Users } from 'lucide-react';

import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/lib/shadcn/components/ui/card';
import { Button } from '@/lib/shadcn/components/ui';

import { PageHeader } from '@/shared/components';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  
  const actions = [
    {
      title: t('dashboard.quickActions.createUser.title', 'Create User'),
      description: t('dashboard.quickActions.createUser.description', 'Add a new user to the system'),
      icon: UserPlus,
      action: () => navigate({ to: '/users/create' }),
    },
    {
      title: t('dashboard.quickActions.manageUsers.title', 'Manage Users'),
      description: t('dashboard.quickActions.manageUsers.description', 'View and manage all users'),
      icon: Users,
      action: () => navigate({ to: '/users' }),
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={t('dashboard.title', 'Dashboard')}
        description={t(
          'dashboard.subtitle',
          "Welcome back! Here's an overview of your application."
        )}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t('dashboard.welcome.title', 'Welcome to Admin Dashboard')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.welcome.description', 'Manage your application and users from this central dashboard.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.welcome.content', 'This is your boilerplate admin dashboard. Customize it to fit your needs by adding new features and components.')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t('dashboard.quickActions.title', 'Quick Actions')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.quickActions.subtitle', 'Common tasks')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {actions.map((action, index) => (
                <Button
                  key={`action-${index}`}
                  variant="outline"
                  className="cursor-pointer h-auto p-3 flex items-center gap-3 border-border hover:bg-accent hover:border-primary/50 transition-all duration-200"
                  onClick={action.action}
                >
                  <action.icon className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      {action.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t('dashboard.stats.users', 'Total Users')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-</div>
            <p className="text-sm text-muted-foreground mt-2">
              {t('dashboard.stats.usersDescription', 'Registered users in the system')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t('dashboard.stats.active', 'Active Today')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-</div>
            <p className="text-sm text-muted-foreground mt-2">
              {t('dashboard.stats.activeDescription', 'Users active today')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t('dashboard.stats.new', 'New This Week')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-</div>
            <p className="text-sm text-muted-foreground mt-2">
              {t('dashboard.stats.newDescription', 'New users this week')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
