import React from 'react';
import { Button } from '@/lib/shadcn/components/ui/button';
import { ScrollArea } from '@/lib/shadcn/components/ui/scroll-area';
import { Bell } from 'lucide-react';
import { ExtendedSheet } from '../ExtendedSheet';
import { NotificationItem } from './NotificationItem';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationSheetProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (id: string) => void;
  onSeeAll?: () => void;
}

export const NotificationSheet: React.FC<NotificationSheetProps> = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onSeeAll,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const trigger = (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
      )}
    </Button>
  );

  return (
    <ExtendedSheet trigger={trigger} title="Notifications">
      {unreadCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllAsRead}
          className="mb-4"
        >
          Mark all as read
        </Button>
      )}
      <div className="flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 h-full">
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">
                  No notifications
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDismiss={onDismiss}
                />
              ))
            )}
          </div>
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <Button variant="outline" className="w-full" onClick={onSeeAll}>
              See all notifications
            </Button>
          </div>
        )}
      </div>
    </ExtendedSheet>
  );
};