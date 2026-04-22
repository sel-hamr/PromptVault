"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLibraryFilters } from "./use-library-filters";
import { TYPE_OPTIONS } from "./library-constants";

const ALL = "__all__";

interface LibraryToolbarProps {
  tags: { id: string; name: string; slug: string }[];
}

export function LibraryToolbar({ tags }: LibraryToolbarProps) {
  const { q, type, tag_slug, updateParam } = useLibraryFilters();

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          defaultValue={q}
          onChange={(e) => updateParam("q", e.target.value)}
          placeholder="Search references…"
          className="pl-8"
          aria-label="Search references"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={type || ALL}
          onValueChange={(v) => updateParam("type", v === ALL ? "" : v)}
        >
          <SelectTrigger className="w-[9rem]" aria-label="Filter by type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {tags.length > 0 && (
          <Select
            value={tag_slug || ALL}
            onValueChange={(v) => updateParam("tag_slug", v === ALL ? "" : v)}
          >
            <SelectTrigger className="w-[9rem]" aria-label="Filter by tag">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All tags</SelectItem>
              {tags.map((t) => (
                <SelectItem key={t.id} value={t.slug}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
