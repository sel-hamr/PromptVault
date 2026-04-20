import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-border/70 bg-card/85 p-4 shadow-sm backdrop-blur-sm sm:p-6">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-muted/70 via-background/80 to-primary/5" />
      <div className="absolute -right-24 -top-24 -z-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 -z-10 h-64 w-64 rounded-full bg-muted-foreground/10 blur-3xl" />

      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
