import * as React from 'react';

import { cn } from '../shared/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800', className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
