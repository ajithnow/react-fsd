import * as React from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../lib/shadcn/components/ui/alert-dialog';

export interface SharedAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  children?: React.ReactNode;
  confirmDisabled?: boolean;
  showLoading?: boolean | null;
}

export function SharedAlertDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  children,
  confirmDisabled = false,
  showLoading = false
}: Readonly<SharedAlertDialogProps>) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {children && <div className="py-4">{children}</div>}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={!!showLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            type="button"
            disabled={confirmDisabled}
             className={
              variant === 'destructive'
                ? 'bg-destructive text-white hover:bg-destructive/90 border-transparent'
                : undefined
            }
          >
            {
              showLoading
                ? <Loader2 className="animate-spin" />
                : <>{confirmText}</>
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
