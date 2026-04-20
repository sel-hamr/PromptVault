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
import { useExploreFilters } from "./use-explore-filters";
import type {
  Category,
  ExploreSortOption,
  ExploreVisibility,
  ModelTarget,
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

const VISIBILITY_OPTIONS: Array<{ value: ExploreVisibility; label: string }> = [
  { value: "PUBLIC", label: "Public" },
  { value: "UNLISTED", label: "Unlisted" },
];

const SORT_OPTIONS: Array<{ value: ExploreSortOption; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "top_rated", label: "Top rated" },
  { value: "most_used", label: "Most used" },
  { value: "most_forked", label: "Most forked" },
];

const ALL = "__all__";

interface ExploreToolbarProps {
  categories: Category[];
}

export function ExploreToolbar({ categories }: ExploreToolbarProps) {
  const { q, category_id, model_target, visibility, sort, view, updateParam } =
    useExploreFilters();

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          defaultValue={q}
          onChange={(e) => updateParam("q", e.target.value)}
          placeholder="Search prompts…"
          className="pl-8"
          aria-label="Search public prompts"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.length > 0 && (
          <Select
            value={category_id || ALL}
            onValueChange={(v) =>
              updateParam("category_id", v === ALL ? "" : v)
            }
          >
            <SelectTrigger className="w-40" aria-label="Filter by category">
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
          value={model_target || ALL}
          onValueChange={(v) => updateParam("model_target", v === ALL ? "" : v)}
        >
          <SelectTrigger className="w-40" aria-label="Filter by model">
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

        <Select value={sort} onValueChange={(v) => updateParam("sort", v)}>
          <SelectTrigger className="w-36" aria-label="Sort prompts">
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
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => updateParam("view", "grid")}
          >
            <Grid3X3 />
          </Button>
          <Button
            type="button"
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => updateParam("view", "list")}
          >
            <List />
          </Button>
        </div>
      </div>
    </div>
  );
}
