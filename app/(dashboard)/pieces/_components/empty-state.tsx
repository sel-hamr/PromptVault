"use client";

import { Puzzle, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasFilters: boolean;
  onCreateClick: () => void;
  onResetFilters: () => void;
}

export function EmptyState({
  hasFilters,
  onCreateClick,
  onResetFilters,
}: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <SearchX className="size-7 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">No pieces match your filters</p>
          <p className="text-sm text-muted-foreground">
            Try a different keyword, category, or sort option.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onResetFilters}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Puzzle className="size-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">No pieces yet</p>
        <p className="text-sm text-muted-foreground">
          Build your first reusable snippet to speed up prompt writing.
        </p>
      </div>
      <Button type="button" onClick={onCreateClick}>
        Create your first piece
      </Button>
    </div>
  );
}
