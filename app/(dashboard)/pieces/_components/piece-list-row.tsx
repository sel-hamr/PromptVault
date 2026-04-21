"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import {
  ClipboardCheck,
  Copy,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PIECE_TYPE_BADGE_CLASS,
  formatUpdatedDate,
  getPieceTags,
  type Piece,
} from "./types";

interface PieceListRowProps {
  piece: Piece;
  onEdit: (piece: Piece) => void;
  onDelete: (piece: Piece) => void;
  onOpenDetails: (piece: Piece) => void;
  canManage: boolean;
}

export function PieceListRow({
  piece,
  onEdit,
  onDelete,
  onOpenDetails,
  canManage,
}: PieceListRowProps) {
  const [copied, setCopied] = useState(false);

  const preview = piece.content.replace(/\s+/g, " ").trim().slice(0, 180);
  const variableTags = getPieceTags(piece);

  const handleCopy = async (event?: MouseEvent<HTMLElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    try {
      await navigator.clipboard.writeText(piece.content);
      setCopied(true);
      toast.success("Piece copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Failed to copy piece");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenDetails(piece);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails(piece)}
      onKeyDown={handleKeyDown}
      className="rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-semibold tracking-tight">
              {piece.title}
            </h3>
            <Badge className={PIECE_TYPE_BADGE_CLASS[piece.piece_type]}>
              {piece.piece_type}
            </Badge>
          </div>

          <p className="line-clamp-2 text-xs text-muted-foreground">
            {preview}
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            {variableTags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="font-mono text-[0.65rem]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div
          className="flex items-center gap-2 md:pl-4"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="text-right text-[0.7rem] text-muted-foreground">
            <p>Updated {formatUpdatedDate(piece.updated_at)}</p>
            <p>Used {piece.use_count}</p>
          </div>

          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Copy piece"
            onClick={() => void handleCopy()}
          >
            {copied ? <ClipboardCheck /> : <Copy />}
          </Button>

          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Open piece actions"
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40! min-w-40">
                <DropdownMenuItem onClick={() => onEdit(piece)}>
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void handleCopy()}>
                  <Copy />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(piece)}
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </article>
  );
}
