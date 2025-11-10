import { toast } from 'sonner';

export function useToast() {
  const defaultOptions = {
    duration: 1000,
    closeButton: true,
    richColors: true,
    position: 'top-right' as const,
  };
  function notify(
    message: string,
    options?: Parameters<typeof toast>[1],
    type: 'info' | 'success' | 'error' | 'warning' | 'message' = 'message'
  ) {
    return toast[type](message, {
      ...defaultOptions,
      ...options,
    });
  }

  return { notify };
}
