"use client";

import { FileText, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasFilters: boolean;
  onCreateClick: () => void;
}

export function EmptyState({ hasFilters, onCreateClick }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <SearchX className="size-7 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">No prompts match your filters</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <FileText className="size-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">No prompts yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first prompt to get started.
        </p>
      </div>
      <Button onClick={onCreateClick}>Create your first prompt</Button>
    </div>
  );
}
