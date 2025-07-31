import React from 'react';
import { PermissionGuard } from '../../../core/rbac';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '../../../lib/shadcn/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../../lib/shadcn/components/ui/dropdown-menu";
import { ActionItem, ActionsDropdownProps } from './actionDropdown.model';

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  actions,
  buttonVariant = 'ghost',
  buttonSize = 'default',
  align = 'end',
  className = '',
  disabled = false,
  triggerIcon,
  'aria-label': ariaLabel = 'Open actions menu',
}) => {
  const renderAction = (action: ActionItem) => {
    const actionItem = (
      <React.Fragment key={action.id}>
        {action.separator && <DropdownMenuSeparator />}
        <DropdownMenuItem 
          onClick={action.onClick}
          className={
            action.variant === 'destructive' 
              ? 'text-red-600 focus:text-red-600 focus:bg-red-50' 
              : ''
          }
        >
          {action.label}
          {action.icon && (
            <DropdownMenuShortcut>
              {action.icon}
            </DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
      </React.Fragment>
    );

    // If the action has a permission requirement, wrap it in PermissionGuard
    if (action.permission) {
      return (
        <PermissionGuard key={action.id} permission={action.permission}>
          {actionItem}
        </PermissionGuard>
      );
    }

    return actionItem;
  };

  const buttonSizeClasses = {
    sm: 'h-6 w-6 p-0',
    default: 'h-8 w-8 p-0',
    lg: 'h-10 w-10 p-0',
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          disabled={disabled}
          className={`
            data-[state=open]:bg-muted 
            transition-all duration-200 hover:scale-105
            ${buttonSizeClasses[buttonSize as keyof typeof buttonSizeClasses]}
            ${className}
          `}
          aria-label={ariaLabel}
        >
          {triggerIcon || <DotsHorizontalIcon className="h-4 w-4" />}
          <span className="sr-only">{ariaLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-[160px]">
        {actions.map(renderAction)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsDropdown;
