import { PieceCard } from "./piece-card";
import { PieceListRow } from "./piece-list-row";
import { EmptyState } from "./empty-state";
import type { Piece, PiecesViewMode } from "./types";

interface PieceListProps {
  pieces: Piece[];
  view: PiecesViewMode;
  hasFilters: boolean;
  userId: string;
  ownerName: string;
}

export function PieceList({ pieces, view, hasFilters, userId, ownerName }: PieceListProps) {
  if (pieces.length === 0) {
    return <EmptyState hasFilters={hasFilters} />;
  }

  if (view === "list") {
    return (
      <div className="space-y-3">
        {pieces.map((piece) => (
          <PieceListRow
            key={piece.id}
            piece={piece}
            userId={userId}
            ownerName={ownerName}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {pieces.map((piece) => (
        <PieceCard
          key={piece.id}
          piece={piece}
          userId={userId}
          ownerName={ownerName}
        />
      ))}
    </div>
  );
}
