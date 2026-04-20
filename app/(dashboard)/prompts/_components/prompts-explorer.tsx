"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  listPromptsAction,
  duplicatePromptAction,
} from "@/lib/actions/prompt.actions";
import { PromptToolbar } from "./prompt-toolbar";
import { PromptCard } from "./prompt-card";
import { PromptListRow } from "./prompt-list-row";
import { PromptFormDialog } from "./prompt-form-dialog";
import { PromptDeleteDialog } from "./prompt-delete-dialog";
import { EmptyState } from "./empty-state";
import type {
  Category,
  FilterState,
  PromptWithRelations,
  Tag,
} from "./types";

interface PromptsExplorerProps {
  userId: string;
  initialPrompts: PromptWithRelations[];
  categories: Category[];
  tags: Tag[];
}

const DEFAULT_FILTERS: FilterState = {
  q: "",
  category_id: "",
  model_target: "",
  visibility: "",
  sort: "newest",
  view: "grid",
};

export function PromptsExplorer({
  userId,
  initialPrompts,
  categories,
  tags,
}: PromptsExplorerProps) {
  const [prompts, setPrompts] = useState<PromptWithRelations[]>(initialPrompts);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isRefreshing, startRefresh] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PromptWithRelations | undefined>();
  const [deleting, setDeleting] = useState<PromptWithRelations | undefined>();

  const hasFilters = useMemo(
    () =>
      filters.q.trim() !== "" ||
      filters.category_id !== "" ||
      filters.model_target !== "" ||
      filters.visibility !== "" ||
      filters.sort !== "newest",
    [filters]
  );

  const refetch = (next: FilterState) => {
    startRefresh(async () => {
      const res = await listPromptsAction({
        user_id: userId,
        q: next.q.trim() || undefined,
        category_id: next.category_id || undefined,
        model_target: next.model_target || undefined,
        visibility: next.visibility || undefined,
        sort: next.sort,
        take: 50,
      });
      if (res?.data && "prompts" in res.data) {
        setPrompts(res.data.prompts as PromptWithRelations[]);
      } else if (res?.serverError) {
        toast.error("Failed to load prompts");
      }
    });
  };

  useEffect(() => {
    const id = setTimeout(() => refetch(filters), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q, filters.category_id, filters.model_target, filters.visibility, filters.sort]);

  const { execute: execDuplicate, isPending: isDuplicating } = useAction(
    duplicatePromptAction,
    {
      onSuccess: ({ data }) => {
        if (!data) return;
        if ("error" in data) {
          toast.error(data.error);
          return;
        }
        if ("prompt" in data) {
          toast.success("Prompt duplicated");
          refetch(filters);
        }
      },
      onError: () => toast.error("Failed to duplicate prompt"),
    }
  );

  const handleSaved = (saved: PromptWithRelations) => {
    setPrompts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...prev[idx], ...saved };
        return next;
      }
      return prev;
    });
    refetch(filters);
  };

  const handleDeleted = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(undefined);
  };

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (p: PromptWithRelations) => {
    setEditing(p);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">My Prompts</h1>
          <p className="text-sm text-muted-foreground">
            {prompts.length} {prompts.length === 1 ? "prompt" : "prompts"}
            {hasFilters ? " matching your filters" : ""}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          New prompt
        </Button>
      </div>

      <PromptToolbar
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
      />

      <section className="transition-all duration-200" aria-live="polite">
        {isRefreshing ? (
          filters.view === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          )
        ) : prompts.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onCreateClick={openCreate} />
        ) : filters.view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {prompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                onEdit={openEdit}
                onDuplicate={(id) => execDuplicate({ id })}
                onDelete={setDeleting}
                isDuplicating={isDuplicating}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map((p) => (
              <PromptListRow
                key={p.id}
                prompt={p}
                onEdit={openEdit}
                onDuplicate={(id) => execDuplicate({ id })}
                onDelete={setDeleting}
              />
            ))}
          </div>
        )}
      </section>

      <PromptFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        categories={categories}
        tags={tags}
        prompt={editing}
        onSaved={handleSaved}
      />

      {deleting && (
        <PromptDeleteDialog
          promptId={deleting.id}
          promptTitle={deleting.title}
          open={!!deleting}
          onOpenChange={(o) => !o && setDeleting(undefined)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
