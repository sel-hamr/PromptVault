"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { listPiecesAction } from "@/lib/actions/piece.actions";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { PieceCard } from "./piece-card";
import { PieceDeleteDialog } from "./piece-delete-dialog";
import { PieceDetailsDialog } from "./piece-details-dialog";
import { PieceFormDialog } from "./piece-form-dialog";
import { PieceListRow } from "./piece-list-row";
import { PieceToolbar } from "./piece-toolbar";
import type { Piece, PiecesFilterState } from "./types";

interface PiecesExplorerProps {
  userId: string;
  initialPieces: Piece[];
  ownerName: string;
}

const DEFAULT_FILTERS: PiecesFilterState = {
  q: "",
  piece_type: "",
  sort: "newest",
  view: "grid",
};

export function PiecesExplorer({
  userId,
  initialPieces,
  ownerName,
}: PiecesExplorerProps) {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [filters, setFilters] = useState<PiecesFilterState>(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Piece | undefined>();
  const [deleting, setDeleting] = useState<Piece | undefined>();
  const [viewing, setViewing] = useState<Piece | undefined>();
  const [loadError, setLoadError] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isFirstFilterRun = useRef(true);

  const hasFilters = useMemo(
    () =>
      filters.q.trim() !== "" ||
      filters.piece_type !== "" ||
      filters.sort !== "newest",
    [filters],
  );

  const refetch = useCallback(
    (next: PiecesFilterState) => {
      setLoadError(false);

      startRefresh(async () => {
        const result = await listPiecesAction({
          user_id: userId,
          include_public_with_owned: true,
          q: next.q.trim() || undefined,
          piece_type: next.piece_type || undefined,
          sort: next.sort,
          take: 100,
        });

        if (result?.data && "pieces" in result.data) {
          setPieces(result.data.pieces as Piece[]);
          return;
        }

        if (result?.serverError) {
          setPieces([]);
          setLoadError(true);
          toast.error("Failed to load pieces");
          return;
        }

        setPieces([]);
      });
    },
    [userId],
  );

  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      refetch({
        q: filters.q,
        piece_type: filters.piece_type,
        sort: filters.sort,
        view: DEFAULT_FILTERS.view,
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [filters.q, filters.piece_type, filters.sort, refetch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.closest("input") ||
          target.closest("textarea") ||
          target.isContentEditable ||
          target.closest("[contenteditable='true']"))
      ) {
        return;
      }

      event.preventDefault();
      searchInputRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (piece: Piece) => {
    setViewing(undefined);
    setEditing(piece);
    setFormOpen(true);
  };

  const openDetails = (piece: Piece) => {
    setViewing(piece);
  };

  const handleSaved = (saved: Piece) => {
    setPieces((previous) => {
      const index = previous.findIndex((piece) => piece.id === saved.id);
      if (index >= 0) {
        const next = [...previous];
        next[index] = { ...previous[index], ...saved };
        return next;
      }

      return [saved, ...previous];
    });

    refetch(filters);
    setViewing((current: Piece | undefined) =>
      current?.id === saved.id ? saved : current,
    );
  };

  const handleDeleted = (pieceId: string) => {
    setPieces((previous) => previous.filter((piece) => piece.id !== pieceId));
    setDeleting(undefined);
    setViewing((current: Piece | undefined) =>
      current?.id === pieceId ? undefined : current,
    );
  };

  const resetFilters = () => {
    setFilters((previous) => ({
      ...DEFAULT_FILTERS,
      view: previous.view,
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Pieces</h1>
        <p className="text-sm text-muted-foreground">
          {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
          {hasFilters ? " matching your filters" : " available"}
        </p>
      </header>

      <PieceToolbar
        filters={filters}
        onFiltersChange={setFilters}
        onCreateClick={openCreate}
        searchInputRef={searchInputRef}
      />

      <section className="transition-all duration-200" aria-live="polite">
        {isRefreshing ? (
          filters.view === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
          )
        ) : loadError ? (
          <ErrorState onRetry={() => refetch(filters)} />
        ) : pieces.length === 0 ? (
          <EmptyState
            hasFilters={hasFilters}
            onCreateClick={openCreate}
            onResetFilters={resetFilters}
          />
        ) : filters.view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pieces.map((piece) => (
              <PieceCard
                key={piece.id}
                piece={piece}
                onOpenDetails={openDetails}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {pieces.map((piece) => (
              <PieceListRow
                key={piece.id}
                piece={piece}
                onEdit={openEdit}
                onDelete={setDeleting}
                onOpenDetails={openDetails}
                canManage={piece.user_id === userId}
              />
            ))}
          </div>
        )}
      </section>

      {viewing && (
        <PieceDetailsDialog
          piece={viewing}
          open={!!viewing}
          onOpenChange={(open) => !open && setViewing(undefined)}
          onEdit={openEdit}
          onDelete={setDeleting}
          ownerName={
            viewing.user_id === userId
              ? ownerName
              : (viewing.user?.username ?? "Community")
          }
          canManage={viewing.user_id === userId}
        />
      )}

      <PieceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        piece={editing}
        onSaved={handleSaved}
      />

      {deleting && (
        <PieceDeleteDialog
          pieceId={deleting.id}
          pieceTitle={deleting.title}
          open={!!deleting}
          onOpenChange={(open) => !open && setDeleting(undefined)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
