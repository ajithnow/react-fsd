import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import apiClient from '@/core/api';
import useProfileService from '../profile.service';
import { ENDPOINTS } from '../../constants';
import { ROLES } from '@/shared/lib/rbac';
import { AUTH_PERMISSIONS } from '../../constants/permissions.constants';

vi.mock('@/core/api');
const mockApiClient = apiClient as Mocked<typeof apiClient>;

describe('Profile Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProfile maps the me endpoint response to a session user', async () => {
    mockApiClient.get.mockResolvedValue({
      data: {
        data: {
          id: '42',
          firstName: 'Ada',
          lastName: 'Admin',
          email: 'ada@example.com',
          role: ROLES.ADMIN,
        },
      },
    });

    const { getProfile } = useProfileService();
    const user = await getProfile();

    expect(mockApiClient.get).toHaveBeenCalledWith(ENDPOINTS.ME);
    expect(user.email).toBe('ada@example.com');
    expect(user.role).toBe(ROLES.ADMIN);
    expect(user.permissions).toContain(AUTH_PERMISSIONS.ADMIN_DASHBOARD);
  });
});
