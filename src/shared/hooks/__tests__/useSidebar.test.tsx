import { renderHook } from '@testing-library/react';
import { useSidebarData } from '../useSidebar';
import { useSelector } from 'react-redux';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const defaultAuthUser = {
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  roles: ['user'],
  permissions: ['dashboard:view', 'customers:view', 'settings:view'],
};

vi.mock('react-redux', () => ({
  useSelector: vi.fn((selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        user: defaultAuthUser,
        isAuthenticated: true,
      },
    })
  ),
  useDispatch: vi.fn(() => vi.fn()),
}));

const mockedUseSelector = vi.mocked(useSelector);

describe('useSidebarData', () => {
  beforeEach(() => {
    mockedUseSelector.mockImplementation(
      (selector: (state: unknown) => unknown) =>
        selector({
          auth: {
            user: defaultAuthUser,
            isAuthenticated: true,
          },
        })
    );
  });

  it('returns sidebar data for default user', () => {
    const { result } = renderHook(() => useSidebarData());
    expect(result.current).toBeDefined();
    expect(result.current.user.name).toBe('Test User');
    expect(result.current.navGroups.length).toBeGreaterThan(0);
  });

  it('returns sidebar data for admin role', () => {
    mockedUseSelector.mockImplementation(
      (selector: (state: unknown) => unknown) =>
        selector({
          auth: {
            user: {
              ...defaultAuthUser,
              role: 'admin',
              roles: ['admin'],
            },
            isAuthenticated: true,
          },
        })
    );

    const { result } = renderHook(() => useSidebarData({ userRole: 'admin' }));
    expect(result.current).toBeDefined();
    expect(result.current.user.name).toBe('Test User');
    expect(
      result.current.navGroups.some(g => g.title === 'sidebar.groups.main')
    ).toBe(true);
  });

  it('returns sidebar data for feature-specific config', () => {
    const { result } = renderHook(() =>
      useSidebarData({ feature: 'dashboard' })
    );
    expect(result.current).toBeDefined();
    expect(result.current.user.name).toBe('Test User');
    expect(result.current.navGroups.length).toBeGreaterThan(0);
  });

  it('shows all configured nav items without permission filtering', () => {
    mockedUseSelector.mockImplementation(
      (selector: (state: unknown) => unknown) =>
        selector({
          auth: {
            user: {
              ...defaultAuthUser,
              permissions: [],
            },
            isAuthenticated: true,
          },
        })
    );

    const { result } = renderHook(() => useSidebarData());
    const titles = result.current.navGroups[0].items.map(i => i.title);

    expect(titles).toContain('sidebar.home');
    expect(titles).toContain('sidebar.customers.title');
    expect(titles).toContain('sidebar.admin.userManagement');
    expect(titles).toContain('sidebar.settings.title');
  });
});
