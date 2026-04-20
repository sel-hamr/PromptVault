import { Skeleton } from "@/components/ui/skeleton";

export default function PromptDetailLoading() {
  return (
    <div className="container max-w-6xl py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main column */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-px w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          </div>

          {/* Content block */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-16" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>

          {/* Variables */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4 space-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="rounded-lg border border-border p-4 space-y-3">
            <Skeleton className="h-4 w-10" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3.5 w-14" />
                  <Skeleton className="h-5 w-10" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border p-4 space-y-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <div className="flex gap-1.5 flex-wrap">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
