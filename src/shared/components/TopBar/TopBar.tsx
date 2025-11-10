import React from 'react';
import { SidebarTrigger } from '@/lib/shadcn/components/ui/sidebar';
import { Separator } from '@/lib/shadcn/components/ui/separator';
import { LanguageSwitcher } from '../LanguageSwitcher';
// import { NotificationSheet } from './NotificationSheet';

export const TopBar: React.FC = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex flex-1 items-center gap-2"></div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        {/* <NotificationSheet
          notifications={[
            {
              id: '1',
              title: 'New user registered',
              message: 'John Doe has joined your application',
              time: '2 minutes ago',
              read: false,
            },
            {
              id: '2',
              title: 'System update',
              message: 'Your system has been updated successfully',
              time: '1 hour ago',
              read: true,
            },
            {
              id: '3',
              title: 'New comment on your post',
              message: 'Alice commented on your post "Hello World"',
              time: '3 hours ago',
              read: false,
            },
            {
              id: '4',
              title: 'New order received',
              message: 'You have received a new order from John Doe',
              time: '1 day ago',
              read: true,
            },
            {
              id: '5',
              title: 'New message received',
              message: 'You have received a new message from Jane Smith',
              time: '2 days ago',
              read: false,
            },
            {
              id: '6',
              title: 'New user registered',
              message: 'John Doe has joined your application',
              time: '2 minutes ago',
              read: false,
            },
            {
              id: '7',
              title: 'System update',
              message: 'Your system has been updated successfully',
              time: '1 hour ago',
              read: true,
            },
            {
              id: '8',
              title: 'New comment on your post',
              message: 'Alice commented on your post "Hello World"',
              time: '3 hours ago',
              read: false,
            },
            {
              id: '9',
              title: 'New order received',
              message: 'You have received a new order from John Doe',
              time: '1 day ago',
              read: true,
            },
            {
              id: '10',
              title: 'New message received',
              message: 'You have received a new message from Jane Smith',
              time: '2 days ago',
              read: false,
            },
          ]}
          onSeeAll={() => console.log('Navigate to notifications page')}
        /> */}
      </div>
    </header>
  );
};
