"use client";

import { useState, useCallback, useRef } from "react";
import { useAction } from "next-safe-action/hooks";
import { Search, MoreHorizontal, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { listPiecesAction } from "@/lib/actions/piece.actions";
import type { PieceInsertHandle } from "./markdown-editor";

type Piece = {
  id: string;
  title: string;
  content: string;
  piece_type: string;
};

interface Props {
  initialPieces: Piece[];
  editorRef: React.RefObject<PieceInsertHandle | null>;
}

const PIECE_TYPES = ["PERSONA", "FORMAT", "CONSTRAINT", "CONTEXT", "TONE", "CUSTOM"] as const;

const TYPE_COLORS: Record<string, string> = {
  PERSONA: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  FORMAT: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  CONSTRAINT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  CONTEXT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  TONE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  CUSTOM: "bg-muted text-muted-foreground",
};

export function PiecesPanel({ initialPieces, editorRef }: Props) {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { execute } = useAction(listPiecesAction, {
    onSuccess: ({ data }) => {
      if (data && "pieces" in data) setPieces(data.pieces as Piece[]);
    },
  });

  const search = useCallback(
    (q: string, type: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        execute({
          q: q || undefined,
          piece_type: (type !== "ALL" ? type : undefined) as (typeof PIECE_TYPES)[number] | undefined,
          take: 50,
        });
      }, 200);
    },
    [execute],
  );

  const handleQuery = (q: string) => {
    setQuery(q);
    search(q, typeFilter);
  };

  const handleType = (t: string) => {
    setTypeFilter(t);
    search(query, t);
  };

  const insert = (piece: Piece) => editorRef.current?.insert(piece.content);
  const replace = (piece: Piece) => editorRef.current?.replace(piece.content);
  const append = (piece: Piece) => editorRef.current?.append(piece.content);

  const copy = async (piece: Piece) => {
    await navigator.clipboard.writeText(piece.content);
    setCopiedId(piece.id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const displayed =
    typeFilter === "ALL" && !query
      ? pieces
      : pieces.filter((p) => {
          const matchType = typeFilter === "ALL" || p.piece_type === typeFilter;
          const matchQ = !query || p.title.toLowerCase().includes(query.toLowerCase());
          return matchType && matchQ;
        });

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Pieces
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Search pieces…"
            className="h-8 pl-7 text-xs"
          />
        </div>
        <Select value={typeFilter} onValueChange={handleType}>
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>
            {PIECE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {displayed.length === 0 ? (
        <p className="text-xs text-muted-foreground italic py-2">
          {initialPieces.length === 0
            ? "No reusable pieces yet — create one from the Pieces page."
            : "No pieces match your search."}
        </p>
      ) : (
        <ul role="list" className="space-y-1.5">
          {displayed.map((piece) => (
            <li
              key={piece.id}
              role="listitem"
              className="flex items-start gap-2 rounded-md border border-border p-2 text-xs"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-medium truncate">{piece.title}</span>
                  <span
                    className={`shrink-0 rounded px-1 py-0.5 text-[10px] font-medium ${TYPE_COLORS[piece.piece_type] ?? TYPE_COLORS.CUSTOM}`}
                  >
                    {piece.piece_type}
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-2 font-mono text-[11px]">
                  {piece.content.slice(0, 80)}
                  {piece.content.length > 80 && "…"}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" aria-label="Piece actions">
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => insert(piece)}>
                    Insert at cursor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => replace(piece)}>
                    Replace selection
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => append(piece)}>
                    Append to end
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copy(piece)}>
                    {copiedId === piece.id ? (
                      <Check className="mr-1.5 size-3" />
                    ) : (
                      <Copy className="mr-1.5 size-3" />
                    )}
                    Copy
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
