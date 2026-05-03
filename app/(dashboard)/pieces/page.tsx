import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { fetchPieces } from "@/lib/data/pieces";
import { PieceToolbar } from "./_components/piece-toolbar";
import { PieceList } from "./_components/piece-list";
import type { PiecesSortOption, PieceType, PiecesViewMode } from "./_components/types";

type SearchParams = {
  q?: string;
  sort?: string;
  piece_type?: string;
  view?: string;
};

type Props = { searchParams: Promise<SearchParams> };

export default async function PiecesPage({ searchParams }: Props) {
  const session = await auth();
  const userId = session?.user?.id;
  const ownerName = session?.user?.name ?? "You";

  if (!userId) return null;

  const {
    q = "",
    sort = "newest",
    piece_type = "",
    view = "grid",
  } = await searchParams;

  const hasFilters = !!(q || piece_type || sort !== "newest");

  const pieces = await fetchPieces({
    q: q || undefined,
    sort: sort as PiecesSortOption,
    piece_type: (piece_type || undefined) as PieceType | undefined,
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Pieces</h1>
        <p className="text-sm text-muted-foreground">
          {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
          {hasFilters ? " matching your filters" : " available"}
        </p>
      </header>

      <Suspense fallback={<div className="h-10" />}>
        <PieceToolbar />
      </Suspense>

      <PieceList
        pieces={pieces}
        view={view as PiecesViewMode}
        hasFilters={hasFilters}
        userId={userId}
        ownerName={ownerName}
      />
    </div>
  );
}
