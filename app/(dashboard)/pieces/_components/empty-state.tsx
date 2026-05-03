"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Puzzle, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieceFormDialog } from "./piece-form-dialog";

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);

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
        <Button asChild type="button" variant="outline">
          <Link href="/pieces">Clear filters</Link>
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
      <Button type="button" onClick={() => setFormOpen(true)}>
        Create your first piece
      </Button>

      <PieceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
