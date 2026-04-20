"use client";

import { Copy, Plus, Save, Search } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Category, Tag } from "../../prompts/_components/types";
import { MarkdownEditor } from "../../prompts/[id]/edit/_components/markdown-editor";
import {
  MODELS,
  TYPE_COLORS,
  TYPE_FILTERS,
  VISIBILITIES,
  type ComposePiece,
} from "./compose-constants";
import { useComposeWorkbench } from "./use-compose-workbench";

interface ComposeWorkbenchProps {
  initialPieces: ComposePiece[];
  categories: Category[];
  tags: Tag[];
}

export function ComposeWorkbench({
  initialPieces,
  categories,
  tags,
}: ComposeWorkbenchProps) {
  const {
    editorRef,
    query,
    setQuery,
    typeFilter,
    setTypeFilter,
    content,
    setContent,
    title,
    setTitle,
    description,
    setDescription,
    modelTarget,
    setModelTarget,
    visibility,
    setVisibility,
    categoryId,
    setCategoryId,
    availableTags,
    tagIds,
    newTagName,
    setNewTagName,
    isContentEmpty,
    filteredPieces,
    isPending,
    isCreatingTag,
    insertPiece,
    appendPiece,
    toggleTag,
    handleAddTag,
    handleTagInputKeyDown,
    handleCopy,
    handleSave,
  } = useComposeWorkbench({ initialPieces, categories, tags });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Compose</h1>
          <p className="text-sm text-muted-foreground">
            Build prompts from reusable pieces and save directly to your vault.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            disabled={isContentEmpty}
          >
            <Copy className="size-4" />
            Copy preview
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending || isContentEmpty}
          >
            <Save className="size-4" />
            {isPending ? "Saving..." : "Save as prompt"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr_340px]">
        <aside className="space-y-4 rounded-xl border border-border bg-card p-4 xl:sticky xl:top-[calc(var(--header-height,57px)+1rem)] xl:h-fit">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Piece library
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Search and insert building blocks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-2">
              <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pieces"
                className="h-8 pl-7 text-xs"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as (typeof TYPE_FILTERS)[number])
              }
            >
              <SelectTrigger className="h-8 w-24 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_FILTERS.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "ALL" ? "All types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ul
            className="max-h-[60vh] space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="list"
          >
            {filteredPieces.length === 0 ? (
              <li className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                No pieces found for this filter.
              </li>
            ) : (
              filteredPieces.map((piece) => (
                <PieceCard
                  key={piece.id}
                  piece={piece}
                  onInsert={() => insertPiece(piece)}
                  onAppend={() => appendPiece(piece)}
                />
              ))
            )}
          </ul>
        </aside>

        <main className="space-y-3">
          <MarkdownEditor
            ref={editorRef}
            value={content}
            onChange={setContent}
            minHeight={580}
          />
        </main>

        <aside className="space-y-4 xl:sticky xl:top-[calc(var(--header-height,57px)+1rem)] xl:h-fit">
          <section className="space-y-3 rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Save settings
            </p>

            <div className="space-y-1">
              <Label htmlFor="compose-title" className="text-xs">
                Title
              </Label>
              <Input
                id="compose-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Prompt title"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="compose-description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="compose-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional description"
                className="min-h-16 text-xs"
              />
            </div>

            <div
              className={
                categories.length > 0 ? "flex gap-2" : "grid grid-cols-2 gap-2"
              }
            >
              <div className="space-y-1">
                <Label className="text-xs">Model</Label>
                <Select
                  value={modelTarget}
                  onValueChange={(value) =>
                    setModelTarget(value as (typeof MODELS)[number]["value"])
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Visibility</Label>
                <Select
                  value={visibility}
                  onValueChange={(value) =>
                    setVisibility(
                      value as (typeof VISIBILITIES)[number]["value"],
                    )
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIBILITIES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {categories.length > 0 && (
                <div className="space-y-1">
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={categoryId ?? "none"}
                    onValueChange={(value) =>
                      setCategoryId(value === "none" ? null : value)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No category</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-2 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Tags</Label>
              <span className="text-[11px] text-muted-foreground">
                {tagIds.length} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                value={newTagName}
                onChange={(event) => setNewTagName(event.target.value)}
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
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {availableTags.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  No tags yet. Add your first tag.
                </p>
              ) : (
                availableTags.map((tag) => {
                  const selected = tagIds.includes(tag.id);
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
    </div>
  );
}

interface PieceCardProps {
  piece: ComposePiece;
  onInsert: () => void;
  onAppend: () => void;
}

function PieceCard({ piece, onInsert, onAppend }: PieceCardProps) {
  return (
    <li className="rounded-md border border-border p-2">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="truncate text-xs font-medium">{piece.title}</span>
        <span
          className={cn(
            "ml-auto rounded px-1 py-0.5 text-[10px] font-medium",
            TYPE_COLORS[piece.piece_type] ?? TYPE_COLORS.CUSTOM,
          )}
        >
          {piece.piece_type}
        </span>
      </div>
      <p className="line-clamp-2 text-[11px] text-muted-foreground">
        {piece.content.slice(0, 90)}
        {piece.content.length > 90 ? "..." : ""}
      </p>
      <div className="mt-2 flex gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={onInsert}
        >
          <Plus className="size-3" />
          Insert
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onAppend}
        >
          Append
        </Button>
      </div>
    </li>
  );
}
