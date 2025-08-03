import { useMutation } from '@tanstack/react-query';
import authService from '../services';

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: (refreshToken: string) =>
      authService.useLogoutService().logout(refreshToken),
  });
};
