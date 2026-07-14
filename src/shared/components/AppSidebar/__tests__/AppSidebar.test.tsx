import { render, screen } from '@testing-library/react';
import { AppSidebar } from '../AppSidebar';
import { SidebarData, NavItem, User } from '../appSidebar.types';
import { Home, Settings, Users } from 'lucide-react';

vi.mock('@/lib/shadcn/components/ui/sidebar', () => ({
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

vi.mock('lucide-react', () => ({
  Command: () => <svg data-testid="command-icon" />,
  Home: () => <svg data-testid="home-icon" />,
  Settings: () => <svg data-testid="settings-icon" />,
  Users: () => <svg data-testid="users-icon" />,
}));

vi.mock('../NavGroup', () => ({
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

vi.mock('../NavUser', () => ({
  NavUser: ({ user }: { user: User }) => (
    <div data-testid="nav-user">
      <span data-testid="user-name">{user.name}</span>
      <span data-testid="user-email">{user.email}</span>
    </div>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, fallback?: string) => fallback ?? key }),
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
          { title: 'Home', url: '/', icon: Home },
          { title: 'Users', url: '/users', icon: Users },
        ],
      },
      {
        title: 'Settings',
        items: [
          {
            title: 'Settings',
            icon: Settings,
            items: [{ title: 'Profile', url: '/profile' }],
          },
        ],
      },
    ],
  };

  it('should render the sidebar structure', () => {
    render(<AppSidebar data={mockSidebarData} />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-rail')).toBeInTheDocument();
  });

  it('should render with provided data', () => {
    render(<AppSidebar data={mockSidebarData} />);

    expect(screen.getByTestId('nav-group-general')).toBeInTheDocument();
    expect(screen.getByTestId('nav-group-settings')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-users')).toBeInTheDocument();
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'test@example.com'
    );
  });

  it('should pass through additional props to Sidebar', () => {
    render(
      <AppSidebar
        data={mockSidebarData}
        className="custom-class"
        data-custom="test"
      />
    );

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('custom-class');
    expect(sidebar).toHaveAttribute('data-custom', 'test');
  });

  it('should handle empty nav groups', () => {
    render(
      <AppSidebar data={{ user: mockSidebarData.user, navGroups: [] }} />
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('nav-user')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-group-general')).not.toBeInTheDocument();
  });

  it('should use default collapsible and variant attributes', () => {
    render(<AppSidebar data={mockSidebarData} />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('collapsible', 'icon');
    expect(sidebar).toHaveAttribute('variant', 'inset');
  });
});
