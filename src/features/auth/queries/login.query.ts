import { useMutation } from '@tanstack/react-query';
import authService from '../services';

export const useLoginMutation = () => {
  return useMutation({ mutationFn: authService.useLoginService().login });
};