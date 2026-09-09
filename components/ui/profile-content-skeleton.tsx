import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileContentSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-32 mt-8" />
    </div>
  );
}
