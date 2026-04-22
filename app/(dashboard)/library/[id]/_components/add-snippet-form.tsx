"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createSnippetAction } from "@/lib/actions/library.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddSnippetFormProps {
  referenceId: string;
  nextOrder: number;
}

export function AddSnippetForm({ referenceId, nextOrder }: AddSnippetFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { execute, isPending } = useAction(createSnippetAction, {
    onSuccess: () => {
      toast.success("Snippet saved");
      setTitle("");
      setContent("");
      setOpen(false);
    },
    onError: () => toast.error("Failed to save snippet"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    execute({ reference_id: referenceId, title: title.trim(), content: content.trim(), order: nextOrder });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
      >
        <Plus className="size-4" />
        Add snippet
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="snippet-title" className="text-sm">Title</Label>
        <Input
          id="snippet-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. fetchPrompts with filters"
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="snippet-content" className="text-sm">Content</Label>
        <Textarea
          id="snippet-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste the snippet content here…"
          className="min-h-32 font-mono text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending || !title.trim() || !content.trim()}>
          {isPending ? "Saving…" : "Save snippet"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => { setOpen(false); setTitle(""); setContent(""); }}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
