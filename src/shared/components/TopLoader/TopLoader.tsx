import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface TopLoaderProps {
  color?: string;
  height?: number;
  speed?: number;
  className?: string;
}

export function TopLoader({
  color = 'hsl(var(--primary))',
  height = 3,
  speed = 300, // Slower default speed
  className,
}: TopLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    const handleRouteStart = () => {
      setIsLoading(true);
      setProgress(0);

      // Simulate loading progress with smaller increments
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) return prev; // Stop at 85% instead of 90%
          return prev + Math.random() * 8 + 2; // Smaller random increment: 2-10%
        });
      }, speed);
    };

    const handleRouteComplete = () => {
      setProgress(100);
      completeTimer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 400); // Longer completion delay

      if (progressTimer) clearInterval(progressTimer);
    };

    // Listen to router state changes
    const unsubscribe = router.subscribe('onBeforeLoad', () => {
      handleRouteStart();
    });

    // Listen for route load completion
    const unsubscribeComplete = router.subscribe('onLoad', () => {
      handleRouteComplete();
    });

    return () => {
      unsubscribe();
      unsubscribeComplete();
      if (progressTimer) clearInterval(progressTimer);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [router, speed]);

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-50 transition-all duration-200 ease-out',
        className
      )}
      style={{
        height: `${height}px`,
        width: `${progress}%`,
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`,
      }}
    />
  );
}
