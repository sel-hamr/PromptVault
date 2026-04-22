import { BookMarked, SearchX } from "lucide-react";
import { ReferenceCard } from "./reference-card";
import type { ReferenceWithRelations } from "@/lib/data/library";

interface ReferenceListProps {
  references: ReferenceWithRelations[];
  hasFilters: boolean;
}

export function ReferenceList({ references, hasFilters }: ReferenceListProps) {
  if (references.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          {hasFilters
            ? <SearchX className="size-7 text-muted-foreground" />
            : <BookMarked className="size-7 text-muted-foreground" />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {hasFilters ? "No references match your filters" : "No references yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {hasFilters
              ? "Try adjusting your search or filter criteria."
              : "Save your first reference to build your knowledge library."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {references.map((ref) => (
        <ReferenceCard key={ref.id} reference={ref} />
      ))}
    </div>
  );
}
