import React from 'react';
import { Skeleton } from '@/lib/shadcn/components/ui/skeleton';

export interface PageSkeletonProps {
  headerLines?: number;
  subtitleLines?: number;
  actions?: number;
  rows?: number;
  cols?: number;
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({
  headerLines = 1,
  subtitleLines = 1,
  actions = 2,
  rows = 6,
  cols = 2,
}) => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          {Array.from({ length: headerLines }).map((_, i) => (
            <Skeleton key={`h-${i}`} className="h-6 w-48" />
          ))}
          {Array.from({ length: subtitleLines }).map((_, i) => (
            <Skeleton key={`s-${i}`} className="h-4 w-72" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: actions }).map((_, i) => (
            <Skeleton key={`a-${i}`} className="h-8 w-24" />
          ))}
        </div>
      </div>

      <div>
        <div className={`grid gap-6 md:grid-cols-${cols}`}>
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={`r-${i}`} className="h-10 w-full" />
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
