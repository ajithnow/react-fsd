import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppSidebar } from '../AppSidebar';
import { SidebarData, NavItem, User } from '../appSidebar.models';
import { Home, Settings, Users } from 'lucide-react';

// Mock the shadcn/ui sidebar components
jest.mock('@/lib/shadcn/components/ui/sidebar', () => ({
  Sidebar: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="sidebar" {...props}>
      {children}
    </div>
  ),
  SidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-content">{children}</div>
  ),
  SidebarFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-footer">{children}</div>
  ),
  SidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-header">{children}</div>
  ),
  SidebarRail: () => <div data-testid="sidebar-rail" />,
}));

// Mock the Command icon from lucide-react
jest.mock('lucide-react', () => ({
  Command: () => <svg data-testid="command-icon" />,
  Home: () => <svg data-testid="home-icon" />,
  Settings: () => <svg data-testid="settings-icon" />,
  Users: () => <svg data-testid="users-icon" />,
}));

// Mock the NavGroup component
jest.mock('../NavGroup', () => ({
  NavGroup: ({ title, items }: { title: string; items: NavItem[] }) => (
    <div data-testid={`nav-group-${title.toLowerCase()}`}>
      <h3>{title}</h3>
      {items.map((item: NavItem, index: number) => (
        <div key={index} data-testid={`nav-item-${item.title.toLowerCase()}`}>
          {item.title}
        </div>
      ))}
    </div>
  ),
}));

// Mock the NavUser component
jest.mock('../NavUser', () => ({
  NavUser: ({ user }: { user: User }) => (
    <div data-testid="nav-user">
      <span data-testid="user-name">{user.name}</span>
      <span data-testid="user-email">{user.email}</span>
    </div>
  ),
}));

// Mock the default data
jest.mock('../data', () => ({
  sidebarData: {
    user: {
      name: 'Default User',
      email: 'default@example.com',
      avatar: '/default-avatar.jpg',
    },
    navGroups: [
      {
        title: 'Default Group',
        items: [
          {
            title: 'Default Item',
            url: '/default',
          },
        ],
      },
    ],
  },
}));

describe('AppSidebar', () => {
  const mockSidebarData: SidebarData = {
    user: {
      name: 'Test User',
      email: 'test@example.com',
      avatar: '/test-avatar.jpg',
    },
    navGroups: [
      {
        title: 'General',
        items: [
          {
            title: 'Home',
            url: '/',
            icon: Home,
          },
          {
            title: 'Users',
            url: '/users',
            icon: Users,
          },
        ],
      },
      {
        title: 'Settings',
        items: [
          {
            title: 'Settings',
            icon: Settings,
            items: [
              {
                title: 'Profile',
                url: '/profile',
              },
            ],
          },
        ],
      },
    ],
  };

  it('should render the sidebar with default structure', () => {
    render(<AppSidebar />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-rail')).toBeInTheDocument();
  });

  it('should render the header with app branding', () => {
    render(<AppSidebar />);

    expect(screen.getByText('React FSD')).toBeInTheDocument();
    expect(screen.getByText('Feature Sliced Design')).toBeInTheDocument();
    expect(screen.getByTestId('command-icon')).toBeInTheDocument();
  });

  it('should render with default data when no data prop is provided', () => {
    render(<AppSidebar />);

    // Should use default data
    expect(screen.getByTestId('nav-group-default group')).toBeInTheDocument();
    expect(screen.getByTestId('nav-user')).toBeInTheDocument();
    expect(screen.getByTestId('user-name')).toHaveTextContent('Default User');
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'default@example.com'
    );
  });

  it('should render with custom data when data prop is provided', () => {
    render(<AppSidebar data={mockSidebarData} />);

    // Should render nav groups
    expect(screen.getByTestId('nav-group-general')).toBeInTheDocument();
    expect(screen.getByTestId('nav-group-settings')).toBeInTheDocument();

    // Should render nav items
    expect(screen.getByTestId('nav-item-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-users')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-settings')).toBeInTheDocument();

    // Should render user data
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'test@example.com'
    );
  });

  it('should pass through additional props to Sidebar component', () => {
    render(<AppSidebar className="custom-class" data-custom="test" />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('custom-class');
    expect(sidebar).toHaveAttribute('data-custom', 'test');
  });

  it('should render multiple nav groups correctly', () => {
    render(<AppSidebar data={mockSidebarData} />);

    // Should render both groups
    const generalGroup = screen.getByTestId('nav-group-general');
    const settingsGroup = screen.getByTestId('nav-group-settings');

    expect(generalGroup).toBeInTheDocument();
    expect(settingsGroup).toBeInTheDocument();

    // Should have correct titles
    expect(generalGroup).toHaveTextContent('General');
    expect(settingsGroup).toHaveTextContent('Settings');
  });

  it('should handle empty nav groups array', () => {
    const emptyData: SidebarData = {
      user: mockSidebarData.user,
      navGroups: [],
    };

    render(<AppSidebar data={emptyData} />);

    // Should still render sidebar structure
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
    expect(screen.getByTestId('nav-user')).toBeInTheDocument();

    // Should not render any nav groups
    expect(screen.queryByTestId('nav-group-general')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-group-settings')).not.toBeInTheDocument();
  });

  it('should render sidebar with collapsible icon variant and inset variant by default', () => {
    render(<AppSidebar />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('collapsible', 'icon');
    expect(sidebar).toHaveAttribute('variant', 'inset');
  });

  it('should override default sidebar props when provided', () => {
    render(<AppSidebar collapsible="offcanvas" variant="sidebar" />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('collapsible', 'offcanvas');
    expect(sidebar).toHaveAttribute('variant', 'sidebar');
  });

  it('should render nav groups in the correct order', () => {
    const orderedData: SidebarData = {
      user: mockSidebarData.user,
      navGroups: [
        { title: 'First Group', items: [] },
        { title: 'Second Group', items: [] },
        { title: 'Third Group', items: [] },
      ],
    };

    render(<AppSidebar data={orderedData} />);

    const groups = screen.getAllByTestId(/nav-group-/);
    expect(groups).toHaveLength(3);
    expect(groups[0]).toHaveAttribute('data-testid', 'nav-group-first group');
    expect(groups[1]).toHaveAttribute('data-testid', 'nav-group-second group');
    expect(groups[2]).toHaveAttribute('data-testid', 'nav-group-third group');
  });
});
