"use client";

import { Grid3X3, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Category,
  FilterState,
  ModelTarget,
  PromptsViewMode,
  SortOption,
  Visibility,
} from "./types";

const MODEL_OPTIONS: Array<{ value: ModelTarget; label: string }> = [
  { value: "CHATGPT", label: "ChatGPT" },
  { value: "CLAUDE", label: "Claude" },
  { value: "MIDJOURNEY", label: "Midjourney" },
  { value: "GEMINI", label: "Gemini" },
  { value: "DALLE", label: "DALL·E" },
  { value: "STABLE_DIFFUSION", label: "Stable Diffusion" },
  { value: "UNIVERSAL", label: "Universal" },
];

const VISIBILITY_OPTIONS: Array<{ value: Visibility; label: string }> = [
  { value: "PUBLIC", label: "Public" },
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
];

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "top_rated", label: "Top rated" },
  { value: "most_used", label: "Most used" },
  { value: "most_forked", label: "Most forked" },
];

const ALL = "__all__";

interface PromptToolbarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: Category[];
}

export function PromptToolbar({
  filters,
  onFiltersChange,
  categories,
}: PromptToolbarProps) {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onFiltersChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.q}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Search your prompts…"
          className="pl-8"
          aria-label="Search prompts"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.length > 0 && (
          <Select
            value={filters.category_id === "" ? ALL : filters.category_id}
            onValueChange={(v) => update("category_id", v === ALL ? "" : v)}
          >
            <SelectTrigger className="w-[10rem]" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={filters.model_target === "" ? ALL : filters.model_target}
          onValueChange={(v) =>
            update("model_target", v === ALL ? "" : (v as ModelTarget))
          }
        >
          <SelectTrigger className="w-[10rem]" aria-label="Filter by model">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All models</SelectItem>
            {MODEL_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.visibility === "" ? ALL : filters.visibility}
          onValueChange={(v) =>
            update("visibility", v === ALL ? "" : (v as Visibility))
          }
        >
          <SelectTrigger className="w-[9rem]" aria-label="Filter by visibility">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All visibility</SelectItem>
            {VISIBILITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sort}
          onValueChange={(v) => update("sort", v as SortOption)}
        >
          <SelectTrigger className="w-[9rem]" aria-label="Sort prompts">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          className="inline-flex items-center gap-1 rounded-lg border border-border p-1"
          role="group"
          aria-label="Toggle prompts view"
        >
          <Button
            type="button"
            variant={filters.view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="Grid view"
            aria-pressed={filters.view === "grid"}
            onClick={() => update("view", "grid" as PromptsViewMode)}
          >
            <Grid3X3 />
          </Button>
          <Button
            type="button"
            variant={filters.view === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="List view"
            aria-pressed={filters.view === "list"}
            onClick={() => update("view", "list" as PromptsViewMode)}
          >
            <List />
          </Button>
        </div>
      </div>
    </div>
  );
}
