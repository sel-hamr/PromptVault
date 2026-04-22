import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  Pencil,
  Scissors,
  Tag,
  Calendar,
  Zap,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { fetchReferenceById } from "@/lib/data/library";
import { Button } from "@/components/ui/button";
import { TYPE_LABELS } from "../_components/library-constants";
import { SnippetList } from "./_components/snippet-list";
import { AddSnippetForm } from "./_components/add-snippet-form";
import { SelectableContent } from "./_components/selectable-content";

type Props = { params: Promise<{ id: string }> };

export default async function ReferenceDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const reference = await fetchReferenceById(id, userId);
  if (!reference) notFound();

  const typeLabel =
    TYPE_LABELS[reference.type as keyof typeof TYPE_LABELS] ?? reference.type;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {reference.title}
          </h1>
          {reference.description && (
            <p className="text-sm text-muted-foreground">
              {reference.description}
            </p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href={`/library/${id}/edit`}>
            <Pencil className="size-3.5" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        {/* Main — selectable content */}
        <SelectableContent
          content={reference.content}
          referenceId={reference.id}
          nextOrder={reference.snippets.length}
        />

        {/* Right sidebar */}
        <aside className="flex flex-col gap-4 xl:h-fit">
          {/* Info */}
          <section className="space-y-3 rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Info
            </p>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-foreground/70">
                {typeLabel}
              </span>
            </div>

            {reference.tags.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Tag className="size-3" />
                  Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {reference.tags.map(
                    ({ tag }: { tag: { id: string; name: string } }) => (
                      <span
                        key={tag.id}
                        className="inline-flex h-5 items-center rounded-full border border-border px-2 text-[11px] text-muted-foreground"
                      >
                        #{tag.name}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}

            {reference.source_url && (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-muted-foreground">
                  Source
                </span>
                <a
                  href={reference.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-foreground hover:underline truncate"
                >
                  <ExternalLink className="size-3 shrink-0" />
                  <span className="truncate">{reference.source_url}</span>
                </a>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
              <span className="flex items-center gap-1">
                <Zap className="size-3" />
                {reference.use_count} uses
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(reference.created_at).toLocaleDateString()}
              </span>
            </div>
          </section>

          {/* Snippets */}
          <section className="space-y-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Scissors className="size-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Snippets
              </p>
              <span className="ml-auto text-[11px] text-muted-foreground">
                {reference.snippets.length}
              </span>
            </div>

            <SnippetList snippets={reference.snippets} />

            <AddSnippetForm
              referenceId={reference.id}
              nextOrder={reference.snippets.length}
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
