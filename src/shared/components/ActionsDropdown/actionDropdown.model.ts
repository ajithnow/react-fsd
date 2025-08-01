export interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  separator?: boolean; // Add separator before this item
  onClick: () => void;
}

export interface ActionsDropdownProps {
  actions: ActionItem[];
  buttonVariant?: 'ghost' | 'outline' | 'default';
  buttonSize?: 'sm' | 'default' | 'lg';
  align?: 'start' | 'center' | 'end';
  className?: string;
  disabled?: boolean;
  triggerIcon?: React.ReactNode;
  'aria-label'?: string;
}