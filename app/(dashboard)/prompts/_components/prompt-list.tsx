import { EmptyState } from "./empty-state";
import { PromptCard } from "./prompt-card";
import { PromptListRow } from "./prompt-list-row";
import type { PromptWithRelations, PromptsViewMode } from "./types";

interface PromptListProps {
  prompts: PromptWithRelations[];
  view: PromptsViewMode;
  hasFilters: boolean;
}

export function PromptList({ prompts, view, hasFilters }: PromptListProps) {
  if (prompts.length === 0) return <EmptyState hasFilters={hasFilters} />;

  if (view === "list") {
    return (
      <div className="space-y-3">
        {prompts.map((p) => <PromptListRow key={p.id} prompt={p} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {prompts.map((p) => <PromptCard key={p.id} prompt={p} />)}
    </div>
  );
}
