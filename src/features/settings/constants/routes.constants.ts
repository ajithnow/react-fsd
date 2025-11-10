export const SETTINGS_ROUTES = {
  ROOT: '/settings',
  PROFILE: '/settings/profile',
  ACCOUNT: '/settings/account',
  NOTIFICATIONS: '/settings/notifications',
} as const;

export type SettingsRoutePath = typeof SETTINGS_ROUTES[keyof typeof SETTINGS_ROUTES];
