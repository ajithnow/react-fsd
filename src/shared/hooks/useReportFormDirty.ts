import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFormDirty } from '@/shared/store/navigationGuard.slice';
import type { AppDispatch } from '@/core/store';

/**
 * Reports a form's dirty state into the global navigation guard so
 * `UnsavedChangesGuard` can block navigation app-wide. Resets to `false` on
 * unmount so leaving the page never leaves a stale dirty flag behind.
 */
export function useReportFormDirty(isDirty: boolean) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setFormDirty(isDirty));
  }, [isDirty, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setFormDirty(false));
    };
  }, [dispatch]);
}
