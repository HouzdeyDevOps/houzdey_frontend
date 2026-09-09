import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyTypeNavSkeleton() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto py-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
      ))}
    </div>
  );
}
