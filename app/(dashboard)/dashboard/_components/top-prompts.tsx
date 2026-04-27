import Link from "next/link";
import { GitFork, Star, Zap } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import type { DashboardPrompt } from "@/lib/data/dashboard";

const MODEL_LABELS: Record<string, string> = {
  CHATGPT: "ChatGPT",
  CLAUDE: "Claude",
  MIDJOURNEY: "Midjourney",
  GEMINI: "Gemini",
  DALLE: "DALL-E",
  STABLE_DIFFUSION: "Stable Diffusion",
  UNIVERSAL: "Universal",
};

const RANK_STYLES = [
  "border-amber-400/50 bg-amber-500/5",
  "border-slate-300/50 bg-slate-500/5 dark:border-slate-600/50",
  "border-orange-300/50 bg-orange-500/5",
];

const RANK_LABELS = ["1st", "2nd", "3rd"];

export function TopPrompts({ prompts }: { prompts: DashboardPrompt[] }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">Top Performing</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt, i) => (
          <div
            key={prompt.id}
            className={cn(
              "group relative flex flex-col gap-3 rounded-xl border p-4",
              RANK_STYLES[i] ?? "border-border bg-card",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/8 text-[0.625rem] font-bold tabular-nums text-foreground/60">
                  {RANK_LABELS[i]}
                </span>
                <span className="rounded bg-background/60 px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground ring-1 ring-border/60">
                  {MODEL_LABELS[prompt.model_target] ?? prompt.model_target}
                </span>
              </div>
              <CopyButton
                value={prompt.content ?? ""}
                successMessage="Copied"
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
              />
            </div>

            <div className="flex-1">
              <Link
                href={`/prompts/${prompt.id}`}
                className="line-clamp-2 text-sm font-semibold leading-snug hover:underline focus-visible:outline-none focus-visible:underline"
              >
                {prompt.title}
              </Link>
              {prompt.description && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {prompt.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-border/50 pt-3 text-[0.6875rem] tabular-nums text-muted-foreground">
              <span className="inline-flex items-center gap-1" title="Uses">
                <Zap className="size-3" aria-hidden />
                {prompt.use_count.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1" title="Forks">
                <GitFork className="size-3" aria-hidden />
                {prompt.fork_count.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1" title="Rating">
                <Star className="size-3" aria-hidden />
                {prompt.avg_rating.toFixed(1)}
                <span className="text-muted-foreground/50">
                  ({prompt.rating_count})
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
