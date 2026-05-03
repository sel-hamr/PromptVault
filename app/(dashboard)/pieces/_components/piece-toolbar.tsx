"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid3X3, List, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieceFormDialog } from "./piece-form-dialog";
import { usePieceFilters } from "./use-piece-filters";
import {
  PIECE_SORT_OPTIONS,
  PIECE_TYPE_OPTIONS,
  type PieceType,
  type PiecesSortOption,
} from "./types";

const ALL = "__all__";

export function PieceToolbar() {
  const router = useRouter();
  const { q, sort, piece_type, view, updateParam } = usePieceFilters();
  const [formOpen, setFormOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(q);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep local input in sync if URL changes externally (e.g. browser back)
  useEffect(() => {
    setSearchValue(q);
  }, [q]);

  // Keyboard shortcut: "/" focuses the search input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest("input") ||
        target?.closest("textarea") ||
        target?.isContentEditable
      ) return;
      event.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => updateParam("q", value), 300);
  };

  return (
    <>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search pieces..."
            className="pl-8"
            aria-label="Search pieces"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={piece_type === "" ? ALL : piece_type}
            onValueChange={(value) =>
              updateParam("piece_type", value === ALL ? "" : value as PieceType)
            }
          >
            <SelectTrigger className="w-44" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {PIECE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => updateParam("sort", value as PiecesSortOption)}
          >
            <SelectTrigger className="w-44" aria-label="Sort pieces">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {PIECE_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div
            className="inline-flex items-center gap-1 rounded-lg border border-border p-1"
            role="group"
            aria-label="Toggle pieces view"
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

          <Button type="button" onClick={() => setFormOpen(true)} className="gap-1.5">
            <Plus />
            New Piece
          </Button>
        </div>
      </div>

      <PieceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={() => router.refresh()}
      />
    </>
  );
}
