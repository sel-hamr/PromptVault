"use client";

import type { RefObject } from "react";
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
import {
  PIECE_SORT_OPTIONS,
  PIECE_TYPE_OPTIONS,
  type PieceType,
  type PiecesFilterState,
  type PiecesSortOption,
} from "./types";

const ALL = "__all__";

interface PieceToolbarProps {
  filters: PiecesFilterState;
  onFiltersChange: (next: PiecesFilterState) => void;
  onCreateClick: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function PieceToolbar({
  filters,
  onFiltersChange,
  onCreateClick,
  searchInputRef,
}: PieceToolbarProps) {
  const update = <K extends keyof PiecesFilterState>(
    key: K,
    value: PiecesFilterState[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          value={filters.q}
          onChange={(event) => update("q", event.target.value)}
          placeholder="Search pieces..."
          className="pl-8"
          aria-label="Search pieces"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.piece_type === "" ? ALL : filters.piece_type}
          onValueChange={(value) =>
            update("piece_type", value === ALL ? "" : (value as PieceType))
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
          value={filters.sort}
          onValueChange={(value) => update("sort", value as PiecesSortOption)}
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
            variant={filters.view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="Grid view"
            aria-pressed={filters.view === "grid"}
            onClick={() => update("view", "grid")}
          >
            <Grid3X3 />
          </Button>
          <Button
            type="button"
            variant={filters.view === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="List view"
            aria-pressed={filters.view === "list"}
            onClick={() => update("view", "list")}
          >
            <List />
          </Button>
        </div>

        <Button type="button" onClick={onCreateClick} className="gap-1.5">
          <Plus />
          New Piece
        </Button>
      </div>
    </div>
  );
}
