import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      
      {/* Content skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-1/3 mt-2" />
      </div>
    </div>
  );
} 