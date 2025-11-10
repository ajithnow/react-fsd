export const USER_ENDPOINTS = {
  USERS: '/api/portal-admin/users',
  CREATE_USER: '/api/portal-admin/user/create',
  USER_BY_ID: (id: string) => `/api/portal-admin/user/${id}`,
  UPDATE_USER: '/api/portal-admin/user/edit',
  DELETE_USER: '/api/portal-admin/user/delete',
  RESET_PASSWORD: (id: string) => `/api/admin/users/${id}/reset-password`,
} as const;