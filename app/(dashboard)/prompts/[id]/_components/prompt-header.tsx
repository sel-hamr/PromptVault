import {
  Globe,
  Lock,
  EyeOff,
  MessageSquare,
  Sparkles,
  ImageIcon,
  Bot,
  Wand2,
  Palette,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PromptDetail } from "./types";
import type { ElementType } from "react";
import type { Visibility } from "../../_components/types";

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

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(date),
  );
}

interface PromptHeaderProps {
  prompt: PromptDetail;
}

export function PromptHeader({ prompt }: PromptHeaderProps) {
  const model = prompt.model_target ?? "UNIVERSAL";
  const ModelIcon = MODEL_ICON[model] ?? Globe;
  const visibility = prompt.visibility as Visibility;
  const VisibilityIcon = VISIBILITY_ICON[visibility];

  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-balance leading-tight">
          {prompt.title}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs">
          <ModelIcon className="size-3.5 opacity-70" aria-hidden />
          <span className="sr-only">Model: </span>
          {MODEL_LABEL[model] ?? model}
        </Badge>
        <Badge
          variant="outline"
          className="gap-1.5 px-2.5 py-1 text-xs bg-card"
        >
          <VisibilityIcon className="size-3.5 opacity-70" aria-hidden />
          <span className="sr-only">Visibility: </span>
          {VISIBILITY_LABEL[visibility]}
        </Badge>
      </div>

      {prompt.description && (
        <p className="text-base text-muted-foreground leading-relaxed max-w-prose">
          {prompt.description}
        </p>
      )}

      <Separator className="my-6 opacity-50" />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground/80">
        <span className="flex items-center gap-1.5">
          <span>By</span>
          <span className="font-semibold text-foreground">
            {prompt.user.username}
          </span>
        </span>
        <span
          title={`Created ${formatDate(prompt.created_at)}`}
          className="flex items-center gap-1.5"
        >
          <span className="size-1 rounded-full bg-border" />
          {formatDate(prompt.created_at)}
        </span>
        {prompt.updated_at > prompt.created_at && (
          <span
            title={`Updated ${formatDate(prompt.updated_at)}`}
            className="flex items-center gap-1.5"
          >
            <span className="size-1 rounded-full bg-border" />
            Updated {formatDate(prompt.updated_at)}
          </span>
        )}
        {prompt.version_count > 1 && (
          <span className="flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-border" />v
            {prompt.version_count}
          </span>
        )}
      </div>
    </header>
  );
}
