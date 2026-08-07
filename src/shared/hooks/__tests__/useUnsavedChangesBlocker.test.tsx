import { renderHook, act } from '@testing-library/react';
import { useUnsavedChangesBlocker } from '../useUnsavedChangesBlocker';
import { useNavigate, useBlocker } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { useAlertDialog } from '@/shared/components';
import { store } from '@/core/store';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
  useBlocker: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

vi.mock('@/shared/components', () => ({
  useAlertDialog: vi.fn(),
}));

vi.mock('@/core/store', () => ({
  store: { getState: vi.fn() },
}));

const createMockConfirmDialog = () => ({
  isOpen: false,
  setIsOpen: vi.fn(),
  showAlert: vi.fn(),
  hideAlert: vi.fn(),
});

type BlockCtx = { current: { pathname: string }; next: { pathname: string } };

describe('useUnsavedChangesBlocker', () => {
  let confirmDialog: ReturnType<typeof createMockConfirmDialog>;

  beforeEach(() => {
    vi.clearAllMocks();
    confirmDialog = createMockConfirmDialog();
    (useAlertDialog as vi.Mock).mockReturnValue(confirmDialog);
    (store.getState as vi.Mock).mockReturnValue({
      navigationGuard: { isDirty: false },
    });
  });

  it('does not attach beforeunload if not dirty', () => {
    (useSelector as vi.Mock).mockReturnValue(false);
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useUnsavedChangesBlocker());

    expect(addSpy).not.toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
    unmount();
    expect(removeSpy).not.toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
  });

  it('attaches beforeunload if dirty', () => {
    (useSelector as vi.Mock).mockReturnValue(true);
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useUnsavedChangesBlocker());

    expect(addSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
  });

  it('blocks a route change while dirty, opens the dialog, and handleConfirmLeave navigates', () => {
    (useSelector as vi.Mock).mockReturnValue(true);
    (store.getState as vi.Mock).mockReturnValue({
      navigationGuard: { isDirty: true },
    });
    const navigate = vi.fn();
    (useNavigate as vi.Mock).mockReturnValue(navigate);

    let shouldBlockFn: (ctx: BlockCtx) => boolean = () => false;
    (useBlocker as vi.Mock).mockImplementation(
      ({ shouldBlockFn: fn }: { shouldBlockFn: typeof shouldBlockFn }) => {
        shouldBlockFn = fn;
      }
    );

    const { result } = renderHook(() => useUnsavedChangesBlocker());

    const blocked = shouldBlockFn({
      current: { pathname: '/users/1/edit' },
      next: { pathname: '/users' },
    });

    expect(blocked).toBe(true);
    expect(confirmDialog.showAlert).toHaveBeenCalled();

    act(() => {
      result.current.handleConfirmLeave();
    });

    expect(confirmDialog.setIsOpen).toHaveBeenCalledWith(false);
    expect(navigate).toHaveBeenCalledWith({ to: '/users' });
  });

  it('does not block when the store already reports clean (post-save navigation)', () => {
    (useSelector as vi.Mock).mockReturnValue(true);
    (store.getState as vi.Mock).mockReturnValue({
      navigationGuard: { isDirty: false },
    });

    let shouldBlockFn: (ctx: BlockCtx) => boolean = () => false;
    (useBlocker as vi.Mock).mockImplementation(
      ({ shouldBlockFn: fn }: { shouldBlockFn: typeof shouldBlockFn }) => {
        shouldBlockFn = fn;
      }
    );

    renderHook(() => useUnsavedChangesBlocker());

    const blocked = shouldBlockFn({
      current: { pathname: '/users/1/edit' },
      next: { pathname: '/users' },
    });

    expect(blocked).toBe(false);
    expect(confirmDialog.showAlert).not.toHaveBeenCalled();
  });

  it('handleCancelLeave just closes the dialog', () => {
    (useSelector as vi.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useUnsavedChangesBlocker());

    act(() => {
      result.current.handleCancelLeave();
    });

    expect(confirmDialog.setIsOpen).toHaveBeenCalledWith(false);
  });
});
