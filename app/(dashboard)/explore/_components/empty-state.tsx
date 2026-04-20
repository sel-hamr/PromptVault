import { Compass, SearchX } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        {hasFilters ? (
          <SearchX className="size-7 text-muted-foreground" />
        ) : (
          <Compass className="size-7 text-muted-foreground" />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {hasFilters
            ? "No prompts match your filters"
            : "No public prompts yet"}
        </p>
        <p className="text-sm text-muted-foreground">
          {hasFilters
            ? "Try adjusting your search or filter criteria."
            : "Public prompts will appear here as creators share them."}
        </p>
      </div>
    </div>
  );
}
