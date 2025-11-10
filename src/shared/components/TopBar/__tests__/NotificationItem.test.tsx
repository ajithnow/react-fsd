import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationItem } from '../NotificationItem';

const mockUnreadNotification = {
  id: '1',
  title: 'Test Notification',
  message: 'This is a test message',
  time: '2 minutes ago',
  read: false,
};

const mockReadNotification = {
  id: '2',
  title: 'Read Notification',
  message: 'This is a read message',
  time: '1 hour ago',
  read: true,
};

describe('NotificationItem', () => {
  it('should render notification content', () => {
    render(<NotificationItem notification={mockUnreadNotification} />);
    
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
    expect(screen.getByText('2 minutes ago')).toBeInTheDocument();
  });

  it('should show unread indicator for unread notifications', () => {
    render(<NotificationItem notification={mockUnreadNotification} />);
    
    const unreadIndicator = document.querySelector('.bg-blue-500');
    expect(unreadIndicator).toBeInTheDocument();
  });

  it('should not show unread indicator for read notifications', () => {
    render(<NotificationItem notification={mockReadNotification} />);
    
    const unreadIndicator = document.querySelector('.bg-blue-500');
    expect(unreadIndicator).not.toBeInTheDocument();
  });

  it('should show mark as read button only for unread notifications on hover', async () => {
    const user = userEvent.setup();
    render(<NotificationItem notification={mockUnreadNotification} />);
    
    const card = screen.getByText('Test Notification').closest('.group');
    await user.hover(card!);
    
    expect(document.querySelector('.lucide-check')).toBeInTheDocument();
  });

  it('should not show mark as read button for read notifications', async () => {
    const user = userEvent.setup();
    render(<NotificationItem notification={mockReadNotification} />);
    
    const card = screen.getByText('Read Notification').closest('.group');
    await user.hover(card!);
    
    expect(screen.queryByRole('button', { name: /check/i })).not.toBeInTheDocument();
  });

  it('should always show dismiss button on hover', async () => {
    const user = userEvent.setup();
    render(<NotificationItem notification={mockUnreadNotification} />);
    
    const card = screen.getByText('Test Notification').closest('.group');
    await user.hover(card!);
    
    expect(document.querySelector('.lucide-x')).toBeInTheDocument();
  });

  it('should call onMarkAsRead when mark as read button is clicked', async () => {
    const user = userEvent.setup();
    const onMarkAsRead = jest.fn();
    render(<NotificationItem notification={mockUnreadNotification} onMarkAsRead={onMarkAsRead} />);
    
    const card = screen.getByText('Test Notification').closest('.group');
    await user.hover(card!);
    
    const markAsReadButton = document.querySelector('.lucide-check')!.closest('button')!;
    await user.click(markAsReadButton);
    
    expect(onMarkAsRead).toHaveBeenCalledWith('1');
  });

  it('should call onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();
    render(<NotificationItem notification={mockUnreadNotification} onDismiss={onDismiss} />);
    
    const card = screen.getByText('Test Notification').closest('.group');
    await user.hover(card!);
    
    const dismissButton = document.querySelector('.lucide-x')!.closest('button')!;
    await user.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledWith('1');
  });

  it('should apply correct styling for unread notifications', () => {
    render(<NotificationItem notification={mockUnreadNotification} />);
    
    const card = screen.getByText('Test Notification').closest('.bg-blue-50\\/50');
    expect(card).toBeInTheDocument();
  });

  it('should not apply unread styling for read notifications', () => {
    render(<NotificationItem notification={mockReadNotification} />);
    
    const card = screen.getByText('Read Notification').closest('.bg-blue-50\\/50');
    expect(card).not.toBeInTheDocument();
  });
});