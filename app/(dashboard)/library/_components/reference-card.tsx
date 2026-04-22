import Link from "next/link";
import { Scissors, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { TYPE_LABELS } from "./library-constants";
import type { ReferenceWithRelations } from "@/lib/data/library";

interface ReferenceCardProps {
  reference: ReferenceWithRelations;
}

export function ReferenceCard({ reference }: ReferenceCardProps) {
  const tags = reference.tags ?? [];
  const visibleTags = tags.slice(0, 3);
  const overflow = tags.length - visibleTags.length;
  const preview = reference.description
    ? reference.description
    : reference.content.replace(/[#*`>\-_]/g, "").replace(/\s+/g, " ").trim().slice(0, 160);

  return (
    <Link
      href={`/library/${reference.id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 relative",
        "text-card-foreground transition-colors",
        "hover:border-foreground/20 hover:bg-card/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-foreground">
            {reference.title}
          </h3>
          <span className="shrink-0 inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[0.6875rem] text-foreground/70">
            {TYPE_LABELS[reference.type] ?? reference.type}
          </span>
        </div>
        {preview && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{preview}</p>
        )}
      </div>

      {visibleTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] text-muted-foreground">
          {visibleTags.map(({ tag }) => (
            <span key={tag.id} className="text-muted-foreground/80">
              #{tag.name}
            </span>
          ))}
          {overflow > 0 && (
            <span className="text-muted-foreground/60">+{overflow}</span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center gap-4 border-t border-border/70 pt-3 text-[0.6875rem] tabular-nums text-muted-foreground">
        <span className="inline-flex items-center gap-1" title="Uses">
          <Zap className="size-3" aria-hidden />
          {(reference.use_count ?? 0).toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1" title="Snippets">
          <Scissors className="size-3" aria-hidden />
          {reference.snippets.length}
        </span>
      </div>
    </Link>
  );
}
