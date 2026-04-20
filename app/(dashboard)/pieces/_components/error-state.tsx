"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Could not load pieces</p>
        <p className="text-sm text-muted-foreground">
          Please check your connection and try again.
        </p>
      </div>
      <Button type="button" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
