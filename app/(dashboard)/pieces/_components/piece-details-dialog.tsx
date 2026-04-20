"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PIECE_TYPE_BADGE_CLASS,
  formatUpdatedDate,
  getPieceTags,
  type Piece,
} from "./types";

interface PieceDetailsDialogProps {
  piece?: Piece;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (piece: Piece) => void;
  onDelete: (piece: Piece) => void;
  ownerName: string;
  canManage: boolean;
}

const createdDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatCreatedDate(date: Date | string): string {
  return createdDateFormatter.format(new Date(date));
}

export function PieceDetailsDialog({
  piece,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  ownerName,
  canManage,
}: PieceDetailsDialogProps) {
  if (!piece) return null;

  const variableTags = getPieceTags(piece);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-8">{piece.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className={PIECE_TYPE_BADGE_CLASS[piece.piece_type]}>
              {piece.piece_type}
            </Badge>
            <Badge variant="outline">
              {piece.visibility.charAt(0) +
                piece.visibility.slice(1).toLowerCase()}
            </Badge>
            <Badge variant="outline">Used {piece.use_count} times</Badge>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Content
            </p>
            <div className="max-h-72 overflow-auto rounded-md bg-muted/40 p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {piece.content}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Variables
            </p>
            {variableTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {variableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="font-mono text-[0.7rem]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No variables detected
              </p>
            )}
          </div>

          <dl className="grid grid-cols-1 gap-2 rounded-md border border-border p-3 text-xs text-muted-foreground sm:grid-cols-2">
            <div className="space-y-0.5">
              <dt className="font-medium text-foreground">Created</dt>
              <dd>{formatCreatedDate(piece.created_at)}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="font-medium text-foreground">Last updated</dt>
              <dd>{formatUpdatedDate(piece.updated_at)}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="font-medium text-foreground">Owner</dt>
              <dd>{ownerName}</dd>
            </div>
          </dl>
        </div>

        {canManage && (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onEdit(piece);
              }}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onOpenChange(false);
                onDelete(piece);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
