import { LogOut } from 'lucide-react';
import { Button } from '../../../../shared/components/Button';
import { useLogoutManager } from '../../managers/logout.manager';

interface LogoutButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export const LogoutButton = ({
  variant = 'ghost',
  size = 'sm',
  showIcon = true,
  showText = true,
  className = '',
}: LogoutButtonProps) => {
  const { logoutUser, isPending, canLogout } = useLogoutManager();

  if (!canLogout) {
    return null;
  }

  const handleLogout = async () => {
    if (isPending) return;

    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isPending}
      className={className}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {showText && (
        <span className={showIcon ? 'ml-2' : ''}>
          {isPending ? 'Logging out...' : 'Logout'}
        </span>
      )}
    </Button>
  );
};
