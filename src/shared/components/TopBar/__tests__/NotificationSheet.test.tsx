import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationSheet } from '../NotificationSheet';

const mockNotifications = [
  {
    id: '1',
    title: 'Test Notification',
    message: 'This is a test message',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    title: 'Read Notification',
    message: 'This is a read message',
    time: '1 hour ago',
    read: true,
  },
];

const mockAllReadNotifications = [
  {
    id: '1',
    title: 'Read Notification 1',
    message: 'This is a read message',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '2',
    title: 'Read Notification 2',
    message: 'This is another read message',
    time: '2 hours ago',
    read: true,
  },
];

describe('NotificationSheet', () => {
  it('should render notification trigger with unread count indicator', () => {
    render(<NotificationSheet notifications={mockNotifications} />);
    
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
    expect(trigger.querySelector('.bg-red-500')).toBeInTheDocument();
  });

  it('should not show unread indicator when all notifications are read', () => {
    render(<NotificationSheet notifications={mockAllReadNotifications} />);
    
    const trigger = screen.getByRole('button');
    expect(trigger.querySelector('.bg-red-500')).not.toBeInTheDocument();
  });

  it('should not show unread indicator when no notifications', () => {
    render(<NotificationSheet notifications={[]} />);
    
    const trigger = screen.getByRole('button');
    expect(trigger.querySelector('.bg-red-500')).not.toBeInTheDocument();
  });

  it('should open sheet and display notifications when clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationSheet notifications={mockNotifications} />);
    
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('Read Notification')).toBeInTheDocument();
  });

  it('should show empty state when no notifications', async () => {
    const user = userEvent.setup();
    render(<NotificationSheet notifications={[]} />);
    
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    
    expect(screen.getByText('No notifications')).toBeInTheDocument();
    expect(screen.getByText("You're all caught up!")).toBeInTheDocument();
  });

  it('should show mark all as read button when there are unread notifications', async () => {
    const user = userEvent.setup();
    render(<NotificationSheet notifications={mockNotifications} />);
    
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    
    expect(screen.getByText('Mark all as read')).toBeInTheDocument();
  });

  it('should not show mark all as read button when all notifications are read', async () => {
    const user = userEvent.setup();
    render(<NotificationSheet notifications={mockAllReadNotifications} />);
    
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    
    expect(screen.queryByText('Mark all as read')).not.toBeInTheDocument();
  });

  it('should call onMarkAllAsRead when mark all as read button is clicked', async () => {
    const user = userEvent.setup();
    const onMarkAllAsRead = jest.fn();
    render(<NotificationSheet notifications={mockNotifications} onMarkAllAsRead={onMarkAllAsRead} />);
    
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    
    const markAllButton = screen.getByText('Mark all as read');
    await user.click(markAllButton);
    
    expect(onMarkAllAsRead).toHaveBeenCalled();
  });

  it('should call onMarkAsRead when mark as read button is clicked', async () => {
    const user = userEvent.setup();
    const onMarkAsRead = jest.fn();
    render(<NotificationSheet notifications={mockNotifications} onMarkAsRead={onMarkAsRead} />);
    
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    
    const notification = screen.getByText('Test Notification').closest('div');
    await user.hover(notification!);
    
    // Wait for buttons to appear and find the check button
    await user.click(document.querySelector('.lucide-check')!.closest('button')!);
    
    expect(onMarkAsRead).toHaveBeenCalledWith('1');
  });

  it('should call onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();
    render(<NotificationSheet notifications={mockNotifications} onDismiss={onDismiss} />);
    
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    
    const notification = screen.getByText('Test Notification').closest('div');
    await user.hover(notification!);
    
    // Wait for buttons to appear and find the X button
    await user.click(document.querySelector('.lucide-x')!.closest('button')!);
    
    expect(onDismiss).toHaveBeenCalledWith('1');
  });

  it('should call onSeeAll when see all button is clicked', async () => {
    const user = userEvent.setup();
    const onSeeAll = jest.fn();
    render(<NotificationSheet notifications={mockNotifications} onSeeAll={onSeeAll} />);
    
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    
    const seeAllButton = screen.getByText('See all notifications');
    await user.click(seeAllButton);
    
    expect(onSeeAll).toHaveBeenCalled();
  });

  it('should not show see all button when no notifications', async () => {
    const user = userEvent.setup();
    render(<NotificationSheet notifications={[]} />);
    
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    
    expect(screen.queryByText('See all notifications')).not.toBeInTheDocument();
  });

  it('should render with default empty notifications array', () => {
    render(<NotificationSheet />);
    
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
    expect(trigger.querySelector('.bg-red-500')).not.toBeInTheDocument();
  });
});