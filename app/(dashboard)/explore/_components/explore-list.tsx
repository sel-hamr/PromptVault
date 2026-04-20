import { EmptyState } from "@/app/(dashboard)/explore/_components/empty-state";
import { ExploreCard } from "@/app/(dashboard)/explore/_components/explore-card";
import { ExploreListRow } from "@/app/(dashboard)/explore/_components/explore-list-row";
import type {
  ExploreViewMode,
  PromptWithRelations,
} from "@/app/(dashboard)/explore/_components/types";

interface ExploreListProps {
  prompts: PromptWithRelations[];
  view: ExploreViewMode;
  hasFilters: boolean;
}

export function ExploreList({ prompts, view, hasFilters }: ExploreListProps) {
  if (prompts.length === 0) return <EmptyState hasFilters={hasFilters} />;

  if (view === "list") {
    return (
      <div className="space-y-3">
        {prompts.map((prompt) => (
          <ExploreListRow key={prompt.id} prompt={prompt} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {prompts.map((prompt) => (
        <ExploreCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
