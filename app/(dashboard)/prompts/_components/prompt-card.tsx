import Link from "next/link";
import { type ElementType } from "react";
import {
  GitFork,
  Globe,
  Star,
  Zap,
  Sparkles,
  Bot,
  ImageIcon,
  Wand2,
  Palette,
  MessageSquare,
  Lock,
  EyeOff,
} from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
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
}

export function PromptCard({ prompt }: PromptCardProps) {
  const model = prompt.model_target ?? "UNIVERSAL";
  const visibility = prompt.visibility as Visibility;
  const tags = prompt.tags ?? [];
  const visibleTags = tags.slice(0, 3);
  const overflow = tags.length - visibleTags.length;
  const preview = prompt.content
    ? prompt.content.replace(/\s+/g, " ").trim().slice(0, 220)
    : null;

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
      <CopyButton
        value={prompt.content ?? ""}
        successMessage="Prompt copied"
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
      />

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
