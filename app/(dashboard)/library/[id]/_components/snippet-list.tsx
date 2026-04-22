import type { Snippet } from "@prisma/client";
import { SnippetCopyButton } from "./snippet-copy-button";

interface SnippetListProps {
  snippets: Snippet[];
}

export function SnippetList({ snippets }: SnippetListProps) {
  if (snippets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No snippets yet. Highlight key blocks from the content and save them as snippets for quick access.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {snippets.map((snippet) => (
        <div key={snippet.id} className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h4 className="text-sm font-medium">{snippet.title}</h4>
            <SnippetCopyButton snippetId={snippet.id} value={snippet.content} />
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-muted-foreground leading-relaxed">
            {snippet.content}
          </pre>
        </div>
      ))}
    </div>
  );
}
