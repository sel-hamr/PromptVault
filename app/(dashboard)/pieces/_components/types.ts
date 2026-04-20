import type { listPiecesAction } from "@/lib/actions/piece.actions";

type ListPiecesResult = NonNullable<
  Awaited<ReturnType<typeof listPiecesAction>>
>["data"];

export type Piece = NonNullable<
  NonNullable<ListPiecesResult>["pieces"]
>[number];

export type PieceType = Piece["piece_type"];

export type PiecesSortOption =
  | "newest"
  | "oldest"
  | "updated"
  | "most_used"
  | "title_asc"
  | "title_desc";

export type PiecesViewMode = "grid" | "list";

export interface PiecesFilterState {
  q: string;
  piece_type: PieceType | "";
  sort: PiecesSortOption;
  view: PiecesViewMode;
}

export const PIECE_TYPE_OPTIONS: Array<{ value: PieceType; label: string }> = [
  { value: "PERSONA", label: "Persona" },
  { value: "FORMAT", label: "Format" },
  { value: "CONSTRAINT", label: "Constraint" },
  { value: "CONTEXT", label: "Context" },
  { value: "TONE", label: "Tone" },
  { value: "CUSTOM", label: "Custom" },
];

export const PIECE_SORT_OPTIONS: Array<{
  value: PiecesSortOption;
  label: string;
}> = [
  { value: "newest", label: "Newest" },
  { value: "updated", label: "Recently updated" },
  { value: "oldest", label: "Oldest" },
  { value: "most_used", label: "Most used" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
];

export const PIECE_TYPE_BADGE_CLASS: Record<PieceType, string> = {
  PERSONA:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
  FORMAT: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
  CONSTRAINT:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  CONTEXT:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  TONE: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  CUSTOM: "bg-muted text-muted-foreground",
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatUpdatedDate(date: Date | string): string {
  return dateFormatter.format(new Date(date));
}

function isVariableLike(value: unknown): value is { name: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof (value as Record<string, unknown>).name === "string"
  );
}

export function getPieceTags(piece: Piece): string[] {
  if (!Array.isArray(piece.variables)) return [];

  return piece.variables
    .filter(isVariableLike)
    .map((variable) => variable.name.trim())
    .filter((name) => name.length > 0)
    .slice(0, 4)
    .map((name) => `{{${name}}}`);
}
