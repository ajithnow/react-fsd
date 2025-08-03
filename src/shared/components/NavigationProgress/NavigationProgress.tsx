import { useEffect, useRef } from 'react';
import { useRouterState } from '@tanstack/react-router';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';

interface NavigationProgressProps {
  color?: string;
  height?: number;
  shadow?: boolean;
}

export function NavigationProgress({
  color = 'hsl(var(--primary))',
  height = 3,
  shadow = true,
}: NavigationProgressProps = {}) {
  const ref = useRef<LoadingBarRef>(null);
  const state = useRouterState();

  useEffect(() => {
    if (state.status === 'pending') {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [state.status]);

  return <LoadingBar color={color} ref={ref} shadow={shadow} height={height} />;
}
