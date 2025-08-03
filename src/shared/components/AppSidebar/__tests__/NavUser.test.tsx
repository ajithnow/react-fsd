import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NavUser } from '../NavUser';
import { User } from '../appSidebar.models';

// Mock TanStack Router
jest.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
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
}));

// Mock the logout manager
const mockLogoutUser = jest.fn();
jest.mock('../../../../features/auth/managers/logout.manager', () => ({
  useLogoutManager: jest.fn(() => ({
    logoutUser: mockLogoutUser,
    isPending: false,
    canLogout: true,
    quickLogout: jest.fn(),
    error: null,
  })),
}));

// Mock shadcn/ui components
jest.mock('@/lib/shadcn/components/ui/sidebar', () => ({
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <ul data-testid="sidebar-menu">{children}</ul>
  ),
  SidebarMenuButton: ({
    children,
    asChild,
    isActive,
    tooltip,
    size,
    className,
    ...props
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
    size?: string;
    className?: string;
    [key: string]: unknown;
  }) => {
    // Don't spread asChild, isActive, tooltip, size to avoid React warnings
    const { onClick, ...restProps } = props;
    return (
      <button
        data-testid="sidebar-menu-button"
        className={className}
        title={tooltip}
        data-active={isActive}
        data-size={size}
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
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-group">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onSelect,
    asChild,
    ...props
  }: {
    children: React.ReactNode;
    onSelect?: () => void;
    asChild?: boolean;
    [key: string]: unknown;
  }) => {
    // When asChild is true, render children directly without wrapping
    if (asChild) {
      return (
        <div data-testid="dropdown-menu-item" {...props}>
          {children}
        </div>
      );
    }

    return (
      <div data-testid="dropdown-menu-item" onClick={onSelect} {...props}>
        {children}
      </div>
    );
  },
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

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronsUpDown: () => <svg data-testid="chevrons-up-down-icon" />,
  User: () => <svg data-testid="user-icon" />,
  CreditCard: () => <svg data-testid="credit-card-icon" />,
  Bell: () => <svg data-testid="bell-icon" />,
  LogOut: () => <svg data-testid="logout-icon" />,
  Sparkles: () => <svg data-testid="sparkles-icon" />,
}));

describe('NavUser', () => {
  const mockUser: User = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatars/john.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render user information', () => {
    render(<NavUser user={mockUser} />);

    expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-menu-item')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('should display user name and email', () => {
    render(<NavUser user={mockUser} />);

    // User name and email appear twice (in trigger and in dropdown)
    const userNames = screen.getAllByText('John Doe');
    const userEmails = screen.getAllByText('john@example.com');

    expect(userNames).toHaveLength(2);
    expect(userEmails).toHaveLength(2);
  });

  it('should render dropdown menu with user options', () => {
    render(<NavUser user={mockUser} />);

    expect(screen.getByTestId('dropdown-menu-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('chevrons-up-down-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('user-icon')).toHaveLength(3); // One in trigger, one in dropdown label, one in account item
  });

  it('should render dropdown menu content with all menu items', () => {
    render(<NavUser user={mockUser} />);

    // User info section
    expect(screen.getByTestId('dropdown-menu-label')).toBeInTheDocument();
    const userNames = screen.getAllByText('John Doe');
    const userEmails = screen.getAllByText('john@example.com');
    expect(userNames).toHaveLength(2);
    expect(userEmails).toHaveLength(2);

    // Menu items
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();

    // Icons
    expect(screen.getAllByTestId('user-icon')).toHaveLength(3); // Trigger + dropdown label + account item = 3 total
    expect(screen.getByTestId('credit-card-icon')).toBeInTheDocument();
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });

  it('should render separators between menu sections', () => {
    render(<NavUser user={mockUser} />);

    const separators = screen.getAllByTestId('dropdown-menu-separator');
    expect(separators).toHaveLength(3); // 3 separators in the actual component
  });

  it('should render menu groups', () => {
    render(<NavUser user={mockUser} />);

    const menuGroups = screen.getAllByTestId('dropdown-menu-group');
    expect(menuGroups).toHaveLength(2);
  });

  it('should handle logout click', async () => {
    render(<NavUser user={mockUser} />);

    const logoutItem = screen.getByText('Log out');
    fireEvent.click(logoutItem);

    await waitFor(() => {
      expect(mockLogoutUser).toHaveBeenCalled();
    });
  });

  it('should render account link correctly', () => {
    render(<NavUser user={mockUser} />);

    const accountLink = screen.getByText('Account').closest('a');
    expect(accountLink).toHaveAttribute('href', '/settings/account');
  });

  it('should render billing link correctly', () => {
    render(<NavUser user={mockUser} />);

    const billingLink = screen.getByText('Billing').closest('a');
    expect(billingLink).toHaveAttribute('href', '/settings');
  });

  it('should render notifications link correctly', () => {
    render(<NavUser user={mockUser} />);

    const notificationsLink = screen.getByText('Notifications').closest('a');
    expect(notificationsLink).toHaveAttribute(
      'href',
      '/settings/notifications'
    );
  });

  it('should render upgrade item without link', () => {
    render(<NavUser user={mockUser} />);

    const upgradeItem = screen.getByText('Upgrade to Pro');
    expect(upgradeItem).toBeInTheDocument();
    // Upgrade to Pro is not a link, it's just a menu item
    const upgradeLink = upgradeItem.closest('a');
    expect(upgradeLink).toBeNull();
  });

  it('should handle user with different name and email', () => {
    const userWithDifferentInfo: User = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '/avatars/jane.jpg',
    };

    render(<NavUser user={userWithDifferentInfo} />);

    const userNames = screen.getAllByText('Jane Smith');
    const userEmails = screen.getAllByText('jane@example.com');
    expect(userNames).toHaveLength(2);
    expect(userEmails).toHaveLength(2);
  });

  it('should handle user with long name and email', () => {
    const userWithLongInfo: User = {
      name: 'Very Long User Name That Might Overflow',
      email: 'very.long.email.address@example.com',
      avatar: '/avatars/long.jpg',
    };

    render(<NavUser user={userWithLongInfo} />);

    const userNames = screen.getAllByText(
      'Very Long User Name That Might Overflow'
    );
    const userEmails = screen.getAllByText(
      'very.long.email.address@example.com'
    );
    expect(userNames).toHaveLength(2);
    expect(userEmails).toHaveLength(2);
  });

  it('should use UserIcon for avatar display', () => {
    render(<NavUser user={mockUser} />);

    // Should render UserIcon instead of img
    const userIcons = screen.getAllByTestId('user-icon');
    expect(userIcons.length).toBeGreaterThan(0);
  });
});
