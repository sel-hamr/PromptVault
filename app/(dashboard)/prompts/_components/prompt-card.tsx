"use client";

import Link from "next/link";
import { useState, type ElementType, type MouseEvent } from "react";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Copy,
  ClipboardCheck,
  Pencil,
  Trash2,
  Star,
  GitFork,
  Zap,
  Sparkles,
  Bot,
  ImageIcon,
  Wand2,
  Palette,
  Globe,
  MessageSquare,
  Lock,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { PromptWithRelations, Visibility } from "./types";

const MODEL_LABEL: Record<string, string> = {
  CHATGPT: "ChatGPT",
  CLAUDE: "Claude",
  MIDJOURNEY: "Midjourney",
  GEMINI: "Gemini",
  DALLE: "DALL·E",
  STABLE_DIFFUSION: "Stable Diffusion",
  UNIVERSAL: "Universal",
};

const MODEL_ICON: Record<string, ElementType> = {
  CHATGPT: MessageSquare,
  CLAUDE: Sparkles,
  MIDJOURNEY: ImageIcon,
  GEMINI: Bot,
  DALLE: Wand2,
  STABLE_DIFFUSION: Palette,
  UNIVERSAL: Globe,
};

const VISIBILITY_ICON: Record<Visibility, ElementType> = {
  PUBLIC: Globe,
  PRIVATE: Lock,
  UNLISTED: EyeOff,
};

const VISIBILITY_LABEL: Record<Visibility, string> = {
  PUBLIC: "Public",
  PRIVATE: "Private",
  UNLISTED: "Unlisted",
};

interface PromptCardProps {
  prompt: PromptWithRelations;
  onEdit: (prompt: PromptWithRelations) => void;
  onDuplicate: (id: string) => void;
  onDelete: (prompt: PromptWithRelations) => void;
  isDuplicating?: boolean;
}

export function PromptCard({
  prompt,
  onEdit,
  onDuplicate,
  onDelete,
  isDuplicating,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const model = prompt.model_target ?? "UNIVERSAL";
  const ModelIcon = MODEL_ICON[model] ?? Globe;
  const visibility = prompt.visibility as Visibility;
  const VisibilityIcon = VISIBILITY_ICON[visibility];

  const tags = prompt.tags ?? [];
  const visibleTags = tags.slice(0, 3);
  const overflow = tags.length - visibleTags.length;

  const preview = prompt.content
    ? prompt.content.replace(/\s+/g, " ").trim().slice(0, 220)
    : null;

  const stop = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCopy = async (e: MouseEvent) => {
    stop(e);
    if (!prompt.content) return;
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success("Prompt copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Failed to copy prompt");
    }
  };

  return (
    <Link
      href={`/prompts/${prompt.id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 relative",
        "text-card-foreground transition-colors",
        "hover:border-foreground/20 hover:bg-card/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {/* <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <ModelIcon className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{MODEL_LABEL[model] ?? model}</span>
          <span aria-hidden className="text-muted-foreground/40">
            ·
          </span>
          <span
            className="inline-flex items-center gap-1"
            title={VISIBILITY_LABEL[visibility]}
          >
            <VisibilityIcon className="size-3 shrink-0" aria-hidden />
            <span>{VISIBILITY_LABEL[visibility]}</span>
          </span>
        </div> */}

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Copy prompt"
        onClick={handleCopy}
        className={cn(
          "text-muted-foreground hover:text-foreground absolute top-2 right-2",
          copied && "text-primary",
        )}
      >
        {copied ? <ClipboardCheck /> : <Copy />}
      </Button>

      <div className="space-y-1">
        <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-foreground">
          {prompt.title}
        </h3>
        {prompt.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {prompt.description}
          </p>
        )}
      </div>

      {preview && (
        <p className="line-clamp-3 rounded-md bg-muted/50 px-3 py-2 font-mono text-[0.75rem] leading-relaxed text-muted-foreground">
          {preview}
        </p>
      )}

      {(visibleTags.length > 0 || prompt.category) && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] text-muted-foreground">
          {prompt.category && (
            <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-foreground/70">
              {prompt.category.name}
            </span>
          )}
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
          {(prompt.use_count ?? 0).toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1" title="Forks">
          <GitFork className="size-3" aria-hidden />
          {(prompt.fork_count ?? 0).toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1" title="Rating">
          <Star className="size-3" aria-hidden />
          {(prompt.avg_rating ?? 0).toFixed(1)}
          <span className="text-muted-foreground/50">
            ({prompt.rating_count ?? 0})
          </span>
        </span>
      </div>
    </Link>
  );
}
