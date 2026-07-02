import { Skeleton } from '@/app/app/_components/common/skeleton';

export function StatCardSkeleton() {
  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-24 h-6 rounded-full" />
      </div>
      <div className="mt-auto space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-16 h-9" />
      </div>
    </div>
  );
}
