"use client";

import { useState, useRef, useCallback } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Scissors } from "lucide-react";
import { createSnippetAction } from "@/lib/actions/library.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SelectionPopover {
  text: string;
  top: number;
  left: number;
}

interface SelectableContentProps {
  content: string;
  referenceId: string;
  nextOrder: number;
}

export function SelectableContent({ content, referenceId, nextOrder }: SelectableContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<SelectionPopover | null>(null);
  const [title, setTitle] = useState("");

  const { execute, isPending } = useAction(createSnippetAction, {
    onSuccess: () => {
      toast.success("Snippet saved");
      setPopover(null);
      setTitle("");
    },
    onError: () => toast.error("Failed to save snippet"),
  });

  const dismiss = useCallback(() => {
    setPopover(null);
    setTitle("");
  }, []);

  const handlePointerUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !containerRef.current) return;

    const range = sel.getRangeAt(0);
    if (!containerRef.current.contains(range.commonAncestorContainer)) return;

    const selectedText = sel.toString().trim();
    if (!selectedText) return;

    const rect = range.getBoundingClientRect();
    const suggestedTitle = selectedText.split("\n").find((l) => l.trim()) ?? "";

    setTitle(suggestedTitle.slice(0, 80));
    setPopover({
      text: selectedText,
      top: rect.bottom + window.scrollY + 8,
      left: Math.max(8, Math.min(rect.left + window.scrollX, window.innerWidth - 320)),
    });
  }, []);

  const handleSave = () => {
    if (!popover || !title.trim()) return;
    execute({
      reference_id: referenceId,
      title: title.trim(),
      content: popover.text,
      order: nextOrder,
    });
  };

  return (
    <>
      <div
        ref={containerRef}
        onPointerUp={handlePointerUp}
        className="rounded-lg border border-border bg-muted/20 p-6"
      >
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
          {content}
        </pre>
        <p className="mt-3 text-[11px] text-muted-foreground/60 select-none">
          Select any text above to save it as a snippet.
        </p>
      </div>

      {popover && (
        <>
          {/* Backdrop to dismiss on outside click */}
          <div className="fixed inset-0 z-40" onPointerDown={dismiss} />

          <div
            className="fixed z-50 w-72 rounded-lg border border-border bg-card shadow-lg p-3 flex flex-col gap-2"
            style={{ top: popover.top, left: popover.left }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Scissors className="size-3" />
              Save as snippet
            </div>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Snippet title"
              className="h-7 text-xs"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") dismiss();
              }}
            />

            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={handleSave}
                disabled={isPending || !title.trim()}
              >
                {isPending ? "Saving…" : "Save"}
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={dismiss}>
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
