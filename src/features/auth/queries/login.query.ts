import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../services/login.service';

export const useLoginMutation = () => {
  return useMutation({ mutationFn: loginApi });
};