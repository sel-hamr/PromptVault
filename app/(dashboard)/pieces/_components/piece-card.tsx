"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { ClipboardCheck, Copy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PIECE_TYPE_BADGE_CLASS,
  formatUpdatedDate,
  getPieceTags,
  type Piece,
} from "./types";

interface PieceCardProps {
  piece: Piece;
  onOpenDetails: (piece: Piece) => void;
}

export function PieceCard({ piece, onOpenDetails }: PieceCardProps) {
  const [copied, setCopied] = useState(false);

  const preview = piece.content.replace(/\s+/g, " ").trim().slice(0, 220);
  const variableTags = getPieceTags(piece);
  const visibleTags = variableTags.slice(0, 3);
  const overflowTags = variableTags.length - visibleTags.length;

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
      className={cn(
        "group flex h-full cursor-pointer flex-col gap-3 rounded-xl border border-border bg-card p-4",
        "transition-all duration-200 ease-out hover:border-foreground/20 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-foreground">
            {piece.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            Updated {formatUpdatedDate(piece.updated_at)}
          </p>
        </div>

        <div
          className="flex items-center gap-1"
          onClick={(event) => event.stopPropagation()}
        >
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Copy piece"
            onClick={() => void handleCopy()}
          >
            {copied ? <ClipboardCheck /> : <Copy />}
          </Button>
        </div>
      </div>

      <p className="line-clamp-3 rounded-md bg-muted/50 px-3 py-2 font-mono text-xs leading-relaxed text-muted-foreground">
        {preview}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <Badge className={PIECE_TYPE_BADGE_CLASS[piece.piece_type]}>
          {piece.piece_type}
        </Badge>

        {visibleTags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="font-mono text-[0.65rem]"
          >
            {tag}
          </Badge>
        ))}

        {overflowTags > 0 && (
          <Badge
            variant="outline"
            className="text-[0.65rem] text-muted-foreground"
          >
            +{overflowTags}
          </Badge>
        )}
      </div>

      <p className="text-[0.7rem] text-muted-foreground">
        Used {piece.use_count} {piece.use_count === 1 ? "time" : "times"}
      </p>
    </article>
  );
}
