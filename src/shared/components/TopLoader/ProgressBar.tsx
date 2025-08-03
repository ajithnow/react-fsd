import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  className?: string;
  color?: string;
  height?: number;
}

export function ProgressBar({
  className,
  color = 'hsl(var(--primary))',
  height = 3,
}: ProgressBarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;
    let startTime = 0;
    const minLoadingTime = 800; // Minimum loading time in ms

    const startProgress = () => {
      setIsLoading(true);
      setProgress(0);
      startTime = Date.now();

      // Simulate smooth progress with slower intervals
      let currentProgress = 0;
      progressTimer = setInterval(() => {
        currentProgress += Math.random() * 5 + 2; // Slower increment: 2-7% each step
        if (currentProgress >= 85) {
          currentProgress = 85; // Stop at 85% until route actually loads
          clearInterval(progressTimer);
        }
        setProgress(currentProgress);
      }, 150); // Slower interval: 150ms instead of 100ms
    };

    const completeProgress = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);

      // Complete remaining progress more slowly
      setProgress(100);
      completeTimer = setTimeout(
        () => {
          setIsLoading(false);
          setProgress(0);
        },
        Math.max(500, remainingTime)
      ); // Ensure minimum loading time

      if (progressTimer) {
        clearInterval(progressTimer);
      }
    };

    // Listen to navigation events
    const handleBeforeLoad = () => startProgress();
    const handleLoad = () => completeProgress();

    // Subscribe to router events
    const unsubscribeBeforeLoad = router.subscribe(
      'onBeforeLoad',
      handleBeforeLoad
    );
    const unsubscribeLoad = router.subscribe('onLoad', handleLoad);

    return () => {
      unsubscribeBeforeLoad();
      unsubscribeLoad();
      if (progressTimer) clearInterval(progressTimer);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [router]);

  if (!isLoading) return null;

  return (
    <div className={cn('fixed top-0 left-0 z-[60] w-full', className)}>
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-300 ease-out"
        style={{
          height: `${height}px`,
          width: `${progress}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}40, 0 0 5px ${color}60`,
        }}
      />
    </div>
  );
}
