import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, s) => (
                <Skeleton key={s} className="w-4 h-4 rounded-sm" />
              ))}
            </div>
          </div>
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}
