export const BOOKING_ROUTES = {
  LIST: '/bookings',
} as const;

export type BookingRoutePath =
  (typeof BOOKING_ROUTES)[keyof typeof BOOKING_ROUTES];
