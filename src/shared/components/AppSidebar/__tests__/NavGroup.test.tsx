import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NavGroup } from '../NavGroup';
import { NavItem, NavCollapsible, NavLink } from '../appSidebar.models';
import { Home, Settings, Users } from 'lucide-react';

// Mock TanStack Router
jest.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => {
    // Handle asChild prop properly - don't pass it to DOM
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onClick, asChild, ...restProps } = props;
    return (
      <a
        href={to}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        {...restProps}
      >
        {children}
      </a>
    );
  },
  useRouterState: jest.fn(config => {
    if (config?.select) {
      return config.select({
        location: {
          pathname: '/dashboard',
          href: '/dashboard',
        },
      });
    }
    return {
      location: {
        pathname: '/dashboard',
        href: '/dashboard',
      },
    };
  }),
}));

// Mock shadcn/ui components
jest.mock('@/lib/shadcn/components/ui/sidebar', () => ({
  SidebarGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group-label">{children}</div>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <ul data-testid="sidebar-menu">{children}</ul>
  ),
  SidebarMenuButton: ({
    children,
    asChild,
    isActive,
    tooltip,
    className,
    ...props
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
    className?: string;
    [key: string]: unknown;
  }) => {
    // Don't spread asChild, isActive, tooltip to avoid React warnings
    const { onClick, ...restProps } = props;
    return (
      <button
        data-testid="sidebar-menu-button"
        className={className}
        title={tooltip}
        data-active={isActive}
        data-as-child={asChild}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        {...restProps}
      >
        {children}
      </button>
    );
  },
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
  SidebarMenuSub: ({ children }: { children: React.ReactNode }) => (
    <ul data-testid="sidebar-menu-sub">{children}</ul>
  ),
  SidebarMenuSubButton: ({
    children,
    asChild,
    isActive,
    ...props
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    isActive?: boolean;
    [key: string]: unknown;
  }) => {
    // Don't spread asChild, isActive to avoid React warnings
    const { onClick, ...restProps } = props;
    return (
      <button
        data-testid="sidebar-menu-sub-button"
        data-active={isActive}
        data-as-child={asChild}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        {...restProps}
      >
        {children}
      </button>
    );
  },
  SidebarMenuSubItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="sidebar-menu-sub-item">{children}</li>
  ),
  useSidebar: jest.fn(() => ({
    isMobile: false,
    state: 'expanded',
    open: true,
    setOpen: jest.fn(),
    openMobile: false,
    setOpenMobile: jest.fn(),
    toggleSidebar: jest.fn(),
  })),
}));

// Mock dropdown menu components
jest.mock('@/lib/shadcn/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="dropdown-menu-item" {...props}>
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-label">{children}</div>
  ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-menu-separator" />,
  DropdownMenuTrigger: ({
    children,
    asChild,
    ...props
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    [key: string]: unknown;
  }) => {
    // When asChild is true, render children directly without wrapping in button
    if (asChild) {
      return (
        <div data-testid="dropdown-menu-trigger" {...props}>
          {children}
        </div>
      );
    }

    const { onClick, ...restProps } = props;
    return (
      <button
        data-testid="dropdown-menu-trigger"
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        {...restProps}
      >
        {children}
      </button>
    );
  },
}));

// Mock NavBadge component
jest.mock('../NavBadge', () => ({
  NavBadge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="nav-badge">{children}</span>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronRight: () => <svg data-testid="chevron-right-icon" />,
  Home: () => <svg data-testid="home-icon" />,
  Settings: () => <svg data-testid="settings-icon" />,
  Users: () => <svg data-testid="users-icon" />,
}));

describe('NavGroup', () => {
  const mockNavLinkItem: NavLink = {
    title: 'Home',
    url: '/',
    icon: Home,
    badge: '5',
  };

  const mockNavCollapsibleItem: NavCollapsible = {
    title: 'Settings',
    icon: Settings,
    items: [
      {
        title: 'Profile',
        url: '/profile',
        icon: Users,
      },
      {
        title: 'Preferences',
        url: '/preferences',
      },
    ],
  };

  const mockNavGroup = {
    title: 'Test Group',
    items: [mockNavLinkItem, mockNavCollapsibleItem] as NavItem[],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render nav group with title', () => {
    render(<NavGroup {...mockNavGroup} />);

    expect(screen.getByTestId('sidebar-group')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-group-label')).toBeInTheDocument();
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('should render simple nav link items', () => {
    const simpleGroup = {
      title: 'Simple Group',
      items: [mockNavLinkItem],
    };

    render(<NavGroup {...simpleGroup} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('nav-badge')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render collapsible nav items with sub-items', async () => {
    const collapsibleGroup = {
      title: 'Collapsible Group',
      items: [mockNavCollapsibleItem],
    };

    render(<NavGroup {...collapsibleGroup} />);

    expect(screen.getByText('Collapsible Group')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();

    // Click to expand the collapsible item
    const settingsButton = screen.getByText('Settings').closest('button');
    expect(settingsButton).not.toBeNull();
    fireEvent.click(settingsButton!);

    // Sub-items should be rendered after expansion
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Preferences')).toBeInTheDocument();
    });
  });

  it('should render nav items without icons', () => {
    const itemWithoutIcon: NavLink = {
      title: 'No Icon Item',
      url: '/no-icon',
    };

    const groupWithoutIcons = {
      title: 'No Icons Group',
      items: [itemWithoutIcon],
    };

    render(<NavGroup {...groupWithoutIcons} />);

    expect(screen.getByText('No Icon Item')).toBeInTheDocument();
    expect(screen.queryByTestId('home-icon')).not.toBeInTheDocument();
  });

  it('should render nav items without badges', () => {
    const itemWithoutBadge: NavLink = {
      title: 'No Badge Item',
      url: '/no-badge',
      icon: Home,
    };

    const groupWithoutBadges = {
      title: 'No Badges Group',
      items: [itemWithoutBadge],
    };

    render(<NavGroup {...groupWithoutBadges} />);

    expect(screen.getByText('No Badge Item')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-badge')).not.toBeInTheDocument();
  });

  it('should handle empty items array', () => {
    const emptyGroup = {
      title: 'Empty Group',
      items: [],
    };

    render(<NavGroup {...emptyGroup} />);

    expect(screen.getByTestId('sidebar-group')).toBeInTheDocument();
    expect(screen.getByText('Empty Group')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
  });

  it('should render multiple nav items correctly', () => {
    render(<NavGroup {...mockNavGroup} />);

    const menuItems = screen.getAllByTestId('sidebar-menu-item');
    expect(menuItems).toHaveLength(2);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render sub-items for collapsible items', async () => {
    const collapsibleGroup = {
      title: 'Collapsible',
      items: [mockNavCollapsibleItem],
    };

    render(<NavGroup {...collapsibleGroup} />);

    // Click to expand the collapsible item
    const settingsButton = screen.getByText('Settings').closest('button');
    expect(settingsButton).not.toBeNull();
    fireEvent.click(settingsButton!);

    await waitFor(() => {
      expect(screen.getByTestId('sidebar-menu-sub')).toBeInTheDocument();

      const subItems = screen.getAllByTestId('sidebar-menu-sub-item');
      expect(subItems).toHaveLength(2);

      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Preferences')).toBeInTheDocument();
    });
  });

  it('should render sub-items with icons when provided', async () => {
    const collapsibleGroup = {
      title: 'Collapsible with Icons',
      items: [mockNavCollapsibleItem],
    };

    render(<NavGroup {...collapsibleGroup} />);

    // Click to expand the collapsible item
    const settingsButton = screen.getByText('Settings').closest('button');
    expect(settingsButton).not.toBeNull();
    fireEvent.click(settingsButton!);

    // Profile sub-item has an icon
    await waitFor(() => {
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    });
  });

  it('should handle mixed item types in the same group', async () => {
    render(<NavGroup {...mockNavGroup} />);

    // Should render both link and collapsible items
    expect(screen.getByText('Home')).toBeInTheDocument(); // Link item
    expect(screen.getByText('Settings')).toBeInTheDocument(); // Collapsible item

    // Click to expand the collapsible item
    const settingsButton = screen.getByText('Settings').closest('button');
    expect(settingsButton).not.toBeNull();
    fireEvent.click(settingsButton!);

    // Sub-items should be visible after expansion
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument(); // Sub-item
      expect(screen.getByText('Preferences')).toBeInTheDocument(); // Sub-item
    });
  });
});
