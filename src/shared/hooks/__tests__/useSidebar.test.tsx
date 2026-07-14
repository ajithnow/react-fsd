import { renderHook } from '@testing-library/react';
import { useSidebarData, getSidebarData, assembleSidebarItems } from '../useSidebar';
import { useSelector } from 'react-redux';
import { sidebarRegistry, type SidebarConfig } from '@/core/registry';
import { Home, Users } from 'lucide-react';
import { setRbacEnabled } from '@/shared/lib/rbac';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { ns?: string }) =>
      options?.ns ? `${options.ns}:${key}` : key,
  }),
}));

const defaultAuthUser = {
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  roles: ['user'],
  permissions: [] as string[],
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

const sampleContributions: SidebarConfig[] = [
  {
    id: 'shell',
    group: 'main',
    order: 0,
    items: [
      { id: 'home', labelKey: 'sidebar.home', link: '/', icon: Home, order: 0 },
    ],
  },
  {
    id: 'users',
    group: 'main',
    order: 20,
    items: [
      {
        id: 'users',
        labelKey: 'nav.users',
        ns: 'users',
        link: '/users',
        icon: Users,
        order: 0,
        permission: 'users:read',
      },
    ],
  },
];

describe('assembleSidebarItems', () => {
  it('merges contributions by group and sorts by order', () => {
    const groups = assembleSidebarItems([
      sampleContributions[1],
      sampleContributions[0],
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].items.map(i => i.id)).toEqual(['home', 'users']);
  });
});

describe('getSidebarData', () => {
  beforeEach(() => {
    setRbacEnabled(true);
  });

  afterEach(() => {
    setRbacEnabled(undefined);
  });

  it('builds nav from contributions the user can access', () => {
    const data = getSidebarData({
      customUser: {
        ...defaultAuthUser,
        permissions: ['users:read'],
      } as never,
      translate: (key, options) =>
        options?.ns ? `${options.ns}:${key}` : key,
      contributions: sampleContributions,
    });

    expect(data.user.name).toBe('Test User');
    expect(data.navGroups[0].items.map(i => i.title)).toEqual([
      'shared:sidebar.home',
      'users:nav.users',
    ]);
  });

  it('hides gated items when the user lacks permission', () => {
    const data = getSidebarData({
      customUser: defaultAuthUser as never,
      translate: (key, options) =>
        options?.ns ? `${options.ns}:${key}` : key,
      contributions: sampleContributions,
    });

    expect(data.navGroups[0].items.map(i => i.title)).toEqual([
      'shared:sidebar.home',
    ]);
  });
});

describe('useSidebarData', () => {
  beforeEach(() => {
    setRbacEnabled(true);
    sidebarRegistry._reset();
    sidebarRegistry.register(sampleContributions);
    mockedUseSelector.mockImplementation(
      (selector: (state: unknown) => unknown) =>
        selector({
          auth: {
            user: { ...defaultAuthUser, permissions: ['users:read'] },
            isAuthenticated: true,
          },
        })
    );
  });

  afterEach(() => {
    setRbacEnabled(undefined);
    sidebarRegistry._reset();
  });

  it('returns sidebar data from the registry', () => {
    const { result } = renderHook(() => useSidebarData());
    expect(result.current).toBeDefined();
    expect(result.current.user.name).toBe('Test User');
    expect(result.current.navGroups.length).toBeGreaterThan(0);
    expect(result.current.navGroups[0].items.map(i => i.title)).toContain(
      'users:nav.users'
    );
  });
});
