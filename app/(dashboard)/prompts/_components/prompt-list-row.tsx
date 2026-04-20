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
import type { PromptWithRelations, Visibility } from "./types";

const MODEL_ICON: Record<string, ElementType> = {
  CHATGPT: MessageSquare,
  CLAUDE: Sparkles,
  MIDJOURNEY: ImageIcon,
  GEMINI: Bot,
  DALLE: Wand2,
  STABLE_DIFFUSION: Palette,
  UNIVERSAL: Globe,
};

const MODEL_LABEL: Record<string, string> = {
  CHATGPT: "ChatGPT",
  CLAUDE: "Claude",
  MIDJOURNEY: "Midjourney",
  GEMINI: "Gemini",
  DALLE: "DALL·E",
  STABLE_DIFFUSION: "Stable Diffusion",
  UNIVERSAL: "Universal",
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

interface PromptListRowProps {
  prompt: PromptWithRelations;
}

export function PromptListRow({ prompt }: PromptListRowProps) {
  const model = prompt.model_target ?? "UNIVERSAL";
  const ModelIcon = MODEL_ICON[model] ?? Globe;
  const visibility = prompt.visibility;
  const VisibilityIcon = VISIBILITY_ICON[visibility];
  const tags = prompt.tags ?? [];
  const visibleTags = tags.slice(0, 3);
  const overflow = tags.length - visibleTags.length;
  const preview = prompt.content
    ? prompt.content.replace(/\s+/g, " ").trim().slice(0, 180)
    : null;

  return (
    <Link
      href={`/prompts/${prompt.id}`}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex-row md:items-start"
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold tracking-tight">
            {prompt.title}
          </h3>
          {prompt.category && (
            <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[0.6875rem] text-foreground/70">
              {prompt.category.name}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 text-[0.6875rem] text-muted-foreground"
            title={VISIBILITY_LABEL[visibility]}
          >
            <VisibilityIcon className="size-3 shrink-0" aria-hidden />
            {VISIBILITY_LABEL[visibility]}
          </span>
          <span className="inline-flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
            <ModelIcon className="size-3 shrink-0" aria-hidden />
            {MODEL_LABEL[model] ?? model}
          </span>
        </div>

        {prompt.description && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {prompt.description}
          </p>
        )}

        {preview && (
          <p className="line-clamp-2 font-mono text-[0.72rem] text-muted-foreground/70">
            {preview}
          </p>
        )}

        {visibleTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] text-muted-foreground/80">
            {visibleTags.map(({ tag }) => (
              <span key={tag.id}>#{tag.name}</span>
            ))}
            {overflow > 0 && (
              <span className="text-muted-foreground/60">+{overflow}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:pl-4">
        <div className="text-right text-[0.7rem] tabular-nums text-muted-foreground">
          <p className="inline-flex items-center gap-1">
            <Zap className="size-3" aria-hidden />
            {(prompt.use_count ?? 0).toLocaleString()}
          </p>
          <p className="inline-flex items-center gap-1 ml-2">
            <GitFork className="size-3" aria-hidden />
            {(prompt.fork_count ?? 0).toLocaleString()}
          </p>
          <p className="inline-flex items-center gap-1 ml-2">
            <Star className="size-3" aria-hidden />
            {(prompt.avg_rating ?? 0).toFixed(1)}
          </p>
        </div>

        <CopyButton value={prompt.content ?? ""} successMessage="Prompt copied" />
      </div>
    </Link>
  );
}
