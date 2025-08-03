import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './../useMobile';

// Create a more robust matchMedia mock
const createMatchMediaMock = (matches: boolean) => {
  return jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // Setup matchMedia mock
    window.matchMedia = createMatchMediaMock(window.innerWidth < 768);
  });

  afterEach(() => {
    // Restore original state
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
    window.innerWidth = originalInnerWidth;
  });

  it('returns true when window.innerWidth is less than MOBILE_BREAKPOINT', () => {
    window.innerWidth = 500;
    window.matchMedia = createMatchMediaMock(true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false when window.innerWidth is greater than or equal to MOBILE_BREAKPOINT', () => {
    window.innerWidth = 900;
    window.matchMedia = createMatchMediaMock(false);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('updates when window.innerWidth changes and triggers matchMedia change', () => {
    window.innerWidth = 900;
    let changeHandler: (() => void) | undefined;
    
    window.matchMedia = jest.fn().mockImplementation((query: string) => {
      return {
        matches: window.innerWidth < 768,
        media: query,
        addEventListener: (
          _event: string,
          cb: EventListenerOrEventListenerObject
        ) => {
          changeHandler = cb as () => void;
        },
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        onchange: null,
        dispatchEvent: jest.fn(),
      } as unknown as MediaQueryList;
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    window.innerWidth = 500;
    act(() => {
      if (changeHandler) changeHandler();
    });
    expect(result.current).toBe(true);
  });
});
