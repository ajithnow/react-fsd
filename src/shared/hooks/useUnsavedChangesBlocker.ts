import { useCallback, useEffect, useRef } from 'react';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { useAlertDialog } from '@/shared/components';
import { selectIsFormDirty } from '@/shared/store/navigationGuard.slice';
import { store } from '@/core/store';

/**
 * App-wide unsaved-changes guard. Reads dirty state from Redux (set by any
 * form via `useReportFormDirty`), blocks in-app navigation and browser
 * unload while dirty, and owns its own confirm dialog state. Mounted once by
 * `UnsavedChangesGuard` — do not call this per-page.
 */
export function useUnsavedChangesBlocker() {
  const isDirty = useSelector(selectIsFormDirty);
  const navigate = useNavigate();
  const confirmDialog = useAlertDialog();
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
      void navigate({ to: pendingNextPathRef.current });
      pendingNextPathRef.current = null;
    }
  }, [confirmDialog, navigate]);

  const handleCancelLeave = useCallback(() => {
    pendingNextPathRef.current = null;
    confirmDialog.setIsOpen(false);
  }, [confirmDialog]);

  // Intercept route transitions
  useBlocker({
    shouldBlockFn: ctx => {
      if (forceNavigateRef.current) {
        forceNavigateRef.current = false;
        return false;
      }

      // Read the store directly rather than the closed-over `isDirty`: a
      // caller may dispatch `setFormDirty(false)` and navigate in the same
      // tick (e.g. after a successful save), before this hook re-renders.
      if (!selectIsFormDirty(store.getState())) return false;

      const currentPath = ctx.current?.pathname || ctx.current?.fullPath;
      const nextPath = ctx.next?.pathname || ctx.next?.fullPath;

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
    isOpen: confirmDialog.isOpen,
    hideAlert: confirmDialog.hideAlert,
    handleConfirmLeave,
    handleCancelLeave,
  };
}
