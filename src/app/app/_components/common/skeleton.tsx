import { cn } from '@/app/app/_util/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded bg-white/5 border border-glass-border', className)} />
  );
}
