import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background" />
      <div className="absolute -left-20 top-1/3 h-56 w-56 rounded-full bg-muted-foreground/10 blur-3xl" />
      <div className="absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>

        <div className="my-6 h-px w-full bg-border/70" />

        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        <Skeleton className="mt-6 h-4 w-36" />
      </div>
    </div>
  );
}
