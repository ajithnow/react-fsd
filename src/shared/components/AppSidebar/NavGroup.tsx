import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/shadcn/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/lib/shadcn/components/ui/sidebar';
import { NavBadge } from './NavBadge';
import type {
  NavGroup as NavGroupType,
  NavItem,
  NavLink,
  NavCollapsible,
} from './appSidebar.models';

function checkIsActive(href: string, item: NavItem): boolean {
  if ('url' in item && item.url) {
    if (item.url === '/') {
      return href === '/';
    }
    return href.startsWith(item.url as string);
  }

  if ('items' in item && item.items) {
    return item.items.some(subItem => checkIsActive(href, subItem as NavItem));
  }

  return false;
}

interface SidebarMenuLinkProps {
  item: NavLink;
  href: string;
}

const SidebarMenuLink: React.FC<SidebarMenuLinkProps> = ({ item, href }) => {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

interface SidebarMenuCollapsibleProps {
  item: NavCollapsible;
  href: string;
}

const SidebarMenuCollapsible: React.FC<SidebarMenuCollapsibleProps> = ({
  item,
  href,
}) => {
  const { setOpenMobile } = useSidebar();
  const [isOpen, setIsOpen] = React.useState(checkIsActive(href, item));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setIsOpen(!isOpen)}
        tooltip={item.title}
        className={`${isOpen ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
        <ChevronRight
          className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
        />
      </SidebarMenuButton>
      {isOpen && (
        <SidebarMenuSub>
          {item.items.map(subItem => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton
                asChild
                isActive={checkIsActive(href, subItem as NavItem)}
              >
                <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                  {subItem.icon && <subItem.icon />}
                  <span>{subItem.title}</span>
                  {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsedDropdown: React.FC<SidebarMenuCollapsibleProps> = ({
  item,
  href,
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(href, item)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map(sub => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                to={sub.url}
                className={`${checkIsActive(href, sub as NavItem) ? 'bg-secondary' : ''}`}
              >
                {sub.icon && <sub.icon />}
                <span className="max-w-52 text-wrap">{sub.title}</span>
                {sub.badge && (
                  <span className="ml-auto text-xs">{sub.badge}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export const NavGroup: React.FC<NavGroupType> = ({ title, items }) => {
  const { isMobile, state } = useSidebar();

  // Use useRouterState to get reactive pathname
  const pathname = useRouterState({
    select: state => state.location.pathname,
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => {
          const key = `${item.title}-${'url' in item ? item.url : 'collapsible'}`;

          if (!('items' in item) || !item.items) {
            return (
              <SidebarMenuLink
                key={key}
                item={item as NavLink}
                href={pathname}
              />
            );
          }

          if (state === 'collapsed' && !isMobile) {
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item as NavCollapsible}
                href={pathname}
              />
            );
          }

          return (
            <SidebarMenuCollapsible
              key={key}
              item={item as NavCollapsible}
              href={pathname}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
