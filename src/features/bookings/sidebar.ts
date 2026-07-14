import { Calendar } from 'lucide-react';
import type { SidebarConfig } from '@/core/registry';
import { BOOKING_ROUTES, BOOKING_PERMISSIONS } from './constants';

export const bookingsSidebar: SidebarConfig = {
  id: 'bookings',
  group: 'main',
  order: 30,
  items: [
    {
      id: 'bookings',
      labelKey: 'nav.bookings',
      ns: 'bookings',
      link: BOOKING_ROUTES.LIST,
      icon: Calendar,
      order: 0,
      permission: BOOKING_PERMISSIONS.READ,
    },
  ],
};
