"use client";

import { useState, useMemo } from "react";
import { Copy, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { incrementPromptUseAction } from "@/lib/actions/prompt.actions";
import { cn } from "@/lib/utils";

interface PromptContentBlockProps {
  content: string;
  promptId: string;
}

export function PromptContentBlock({
  content,
  promptId,
}: PromptContentBlockProps) {
  const [copied, setCopied] = useState(false);
  const { execute: execIncrementUse } = useAction(incrementPromptUseAction);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard");
      execIncrementUse({ id: promptId });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Process content to highlight {{variables}} and split into lines
  const lines = useMemo(() => {
    return content.split("\n").map((line, lineIndex) => {
      // Split by {{variable}} pattern
      const parts = line.split(/(\{\{[^}]+\}\})/g);

      return (
        <div key={lineIndex} className="table-row">
          <span className="table-cell break-all">
            {parts.map((part, partIndex) => {
              if (part.startsWith("{{") && part.endsWith("}}")) {
                return (
                  <span
                    key={partIndex}
                    className="inline-flex mx-[1px] px-1 bg-blue-500/10 text-blue-600 dark:bg-amber-400/10 dark:text-amber-300 rounded-sm font-medium"
                  >
                    {part}
                  </span>
                );
              }
              return (
                <span
                  key={partIndex}
                  className="text-zinc-800 dark:text-zinc-300"
                >
                  {part}
                </span>
              );
            })}
          </span>
        </div>
      );
    });
  }, [content]);

  return (
    <div className="group relative rounded-xl border border-border bg-zinc-50/50 dark:bg-zinc-950/50 shadow-sm overflow-hidden flex flex-col">
      {/* Editor Header / Title bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-white dark:bg-zinc-900/80">
        <div className="flex items-center gap-2">
          {/* macOS style traffic lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <span className="text-xs font-medium text-muted-foreground select-none">
            prompt.txt
          </span>
        </div>

        <button
          onClick={handleCopy}
          disabled={copied}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 justify-center py-1 text-xs font-medium transition-all duration-200",
            copied
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground",
          )}
          aria-label={copied ? "Copied" : "Copy prompt content"}
        >
          {copied ? (
            <ClipboardCheck className="size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Editor Body */}
      <div className="relative p-4 flex-1 overflow-x-auto selection:bg-blue-200/40 dark:selection:bg-blue-500/30">
        <div className="table w-full border-collapse font-mono text-sm leading-relaxed">
          {lines}
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
