import { useCallback, useEffect, useRef } from 'react';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { UseUnsavedChangesBlockerProps } from '../models';



export function useUnsavedChangesBlocker({
  isDirty,
  confirmDialog,
}: UseUnsavedChangesBlockerProps) {
  const navigate = useNavigate();
  const forceNavigateRef = useRef(false);
  const pendingNextPathRef = useRef<string | null>(null);

  // Warn on browser refresh/close
  useEffect(() => {
    if (!isDirty) return;
    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [isDirty]);

  const handleConfirmLeave = useCallback(() => {
    forceNavigateRef.current = true;
    confirmDialog.setIsOpen(false);

    if (pendingNextPathRef.current) {
      navigate({ to: pendingNextPathRef.current });
      pendingNextPathRef.current = null;
    }
  }, [confirmDialog, navigate]);

  // Cancel leave
  const handleCancelLeave = useCallback(() => {
    pendingNextPathRef.current = null;
    confirmDialog.setIsOpen(false);
  }, [confirmDialog]);

  const setPendingNextPath = (path: string) => {
    pendingNextPathRef.current = path;
  };

  // Intercept route transitions
  useBlocker({
    shouldBlockFn: ctx => {
      if (forceNavigateRef.current) {
        forceNavigateRef.current = false;
        return false;
      }

      const currentPath = ctx.current?.pathname || ctx.current?.fullPath;
      const nextPath = ctx.next?.pathname || ctx.next?.fullPath;

      if (!isDirty) return false;

      if (currentPath && nextPath && currentPath !== nextPath) {
        if (!pendingNextPathRef.current) {
          pendingNextPathRef.current = nextPath;
        }
        if (!confirmDialog.isOpen) {
          confirmDialog.showAlert();
        }
        return true;
      }
      return false;
    },
  });

  return {
    handleConfirmLeave,
    handleCancelLeave,
    setPendingNextPath,
  };
}
