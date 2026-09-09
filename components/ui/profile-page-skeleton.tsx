import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar stub */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16" />

      <div className="flex">
        {/* Fixed sidebar — desktop only */}
        <div className="hidden md:block md:fixed md:top-24 md:left-0 md:w-80 md:h-[calc(100vh-6rem)] md:bg-white md:border-r md:border-gray-200 md:shadow-sm md:overflow-y-auto">
          {/* Sidebar header */}
          <div className="p-6 border-b border-gray-200">
            <Skeleton className="h-6 w-40" />
          </div>

          {/* Sidebar nav items */}
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg">
                <Skeleton className="h-4 w-36 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile header stub */}
        <div className="md:hidden w-full">
          <div className="bg-white border-b border-gray-200 shadow-sm px-4 py-4">
            <Skeleton className="h-6 w-40" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-80">
          <div className="px-4 sm:px-8 pt-8 md:pt-28 pb-8">
            {/* Content card */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
