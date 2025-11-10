import React from 'react';
import { Button } from '@/lib/shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/shadcn/components/ui/card';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
}) => {
  return (
    <Card
      className={cn(
        'group transition-colors hover:bg-muted/30 gap-1',
        !notification.read && 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
      )}
    >
      <CardHeader className="pb-0">
        <div className="flex items-start gap-3">
          {!notification.read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-sm font-semibold leading-tight">{notification.title}</CardTitle>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-green-100 hover:text-green-700"
                    onClick={() => onMarkAsRead?.(notification.id)}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-red-100 hover:text-red-700"
                  onClick={() => onDismiss?.(notification.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 pb-0">
        <div className="flex gap-1">
          <div className="w-2 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-2 font-medium">
              {notification.time}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};