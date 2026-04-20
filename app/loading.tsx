import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 bg-linear-to-br from-muted/70 via-background to-primary/5" />
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-muted-foreground/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative w-full max-w-xl rounded-3xl border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <div className="mt-8 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
