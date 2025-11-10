
import { useNavigate } from '@tanstack/react-router';

export function useAppNavigate() {
  const navigate = useNavigate();
  const goTo = (
    to: string,
  ) => {
    navigate({to});
  };

  return { goTo };
}


