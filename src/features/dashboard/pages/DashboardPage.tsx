import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/lib/shadcn/components/ui/card';
import { BarChart3, Users, DollarSign, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation('dashboard');

  const stats = [
    {
      title: t('dashboard.stats.totalUsers', 'Total Users'),
      value: '2,543',
      change: '+12%',
      icon: Users,
    },
    {
      title: t('dashboard.stats.revenue', 'Revenue'),
      value: '$45,231',
      change: '+8%',
      icon: DollarSign,
    },
    {
      title: t('dashboard.stats.analytics', 'Analytics'),
      value: '12,234',
      change: '+15%',
      icon: BarChart3,
    },
    {
      title: t('dashboard.stats.growth', 'Growth'),
      value: '+23%',
      change: '+4%',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('dashboard.title', 'Dashboard')}
        </h1>
        <p className="text-muted-foreground">
          {t(
            'dashboard.subtitle',
            "Welcome back! Here's an overview of your application."
          )}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span>{' '}
                {t('dashboard.stats.fromLastMonth', 'from last month')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>
              {t('dashboard.recentActivity.title', 'Recent Activity')}
            </CardTitle>
            <CardDescription>
              {t(
                'dashboard.recentActivity.subtitle',
                'You have 3 new notifications.'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t(
                      'dashboard.recentActivity.newUserRegistered',
                      'New user registered'
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'dashboard.recentActivity.timeAgo.minutes',
                      '{{count}} minutes ago',
                      { count: 2 }
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t(
                      'dashboard.recentActivity.paymentCompleted',
                      'Payment completed'
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'dashboard.recentActivity.timeAgo.minutes',
                      '{{count}} minutes ago',
                      { count: 5 }
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t(
                      'dashboard.recentActivity.systemUpdateAvailable',
                      'System update available'
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'dashboard.recentActivity.timeAgo.hour',
                      '{{count}} hour ago',
                      { count: 1 }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              {t('dashboard.quickActions.title', 'Quick Actions')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.quickActions.subtitle', 'Commonly used features')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-accent rounded-md">
              {t('dashboard.quickActions.createNewUser', 'Create new user')}
            </button>
            <button className="w-full text-left p-2 hover:bg-accent rounded-md">
              {t('dashboard.quickActions.generateReport', 'Generate report')}
            </button>
            <button className="w-full text-left p-2 hover:bg-accent rounded-md">
              {t('dashboard.quickActions.viewAnalytics', 'View analytics')}
            </button>
            <button className="w-full text-left p-2 hover:bg-accent rounded-md">
              {t('dashboard.quickActions.manageSettings', 'Manage settings')}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
