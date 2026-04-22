"use client";

import { Controller } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MarkdownEditor } from "@/app/(dashboard)/prompts/[id]/edit/_components/markdown-editor";
import {
  useReferenceForm,
  type ReferenceTag,
} from "@/hooks/use-reference-form";
import { TYPE_OPTIONS } from "./library-constants";
import type { ReferenceWithRelations } from "@/lib/data/library";

interface ReferenceFormProps {
  reference?: ReferenceWithRelations;
  tags: ReferenceTag[];
}

export function ReferenceForm({
  reference,
  tags: initialTags,
}: ReferenceFormProps) {
  const {
    form,
    isEdit,
    isPending,
    isCreatingTag,
    availableTags,
    newTagName,
    selectedTagIds,
    setNewTagName,
    onSubmit,
    toggleTag,
    handleAddTag,
    handleTagInputKeyDown,
    handleCancel,
  } = useReferenceForm({
    reference,
    initialTags,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
        {/* Main content */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g. Server-Side Data Fetching"
            />
            {errors.title && (
              <p className="text-xs text-destructive">
                {String(errors.title.message)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="description"
              {...register("description")}
              placeholder="Short summary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>
              Content <span className="text-muted-foreground">(markdown)</span>
            </Label>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <MarkdownEditor
                  value={(field.value as string) ?? ""}
                  onChange={field.onChange}
                  error={errors.content?.message as string | undefined}
                  minHeight={420}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving…"
                : isEdit
                  ? "Update reference"
                  : "Save reference"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="flex flex-col gap-4 xl:sticky xl:top-[calc(var(--header-height,57px)+1rem)] xl:h-fit">
          {/* Settings */}
          <section className="space-y-3 rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Settings
            </p>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    value={field.value as string}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="source_url" className="text-xs">
                Source URL{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="source_url"
                {...register("source_url")}
                placeholder="https://…"
                className="h-8 text-xs"
              />
              {errors.source_url && (
                <p className="text-xs text-destructive">
                  {String(errors.source_url.message)}
                </p>
              )}
            </div>
          </section>

          {/* Tags */}
          <section className="space-y-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tags
              </p>
              <span className="text-[11px] text-muted-foreground">
                {selectedTagIds.length} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tag"
                className="h-8 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={handleAddTag}
                disabled={isCreatingTag || newTagName.trim().length === 0}
              >
                <Plus className="size-3" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {availableTags.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  No tags yet. Add your first tag above.
                </p>
              ) : (
                availableTags.map((tag) => {
                  const selected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-medium transition-colors",
                        selected
                          ? "border-transparent bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {tag.name}
                    </button>
                  );
                })
              )}
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
