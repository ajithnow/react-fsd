import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

export interface SidebarNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ items, className }) => {
  const { pathname } = useLocation();

  return (
    <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2', className)}>
      {items.map(item => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
              active
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};
