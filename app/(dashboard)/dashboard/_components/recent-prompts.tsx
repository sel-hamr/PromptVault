import Link from "next/link";
import { ArrowRight, GitFork, Star, Zap } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
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

const VISIBILITY_STYLES: Record<string, string> = {
  PUBLIC: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  PRIVATE: "bg-muted text-muted-foreground",
  UNLISTED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function RecentPrompts({ prompts }: { prompts: DashboardPrompt[] }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold">Recent Prompts</h2>
        <Link
          href={ROUTES.prompts}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {prompts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <p className="text-sm font-medium">No prompts yet</p>
          <p className="text-xs text-muted-foreground">
            Create your first prompt to get started.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {prompts.map((prompt) => (
            <li key={prompt.id}>
              <div className="group relative flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-muted/30">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/prompts/${prompt.id}`}
                      className="text-sm font-medium leading-none hover:underline focus-visible:outline-none focus-visible:underline"
                    >
                      {prompt.title}
                    </Link>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[0.625rem] font-medium",
                        VISIBILITY_STYLES[prompt.visibility] ??
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {prompt.visibility.toLowerCase()}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
                      {MODEL_LABELS[prompt.model_target] ?? prompt.model_target}
                    </span>
                  </div>

                  {prompt.description && (
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {prompt.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-[0.6875rem] tabular-nums text-muted-foreground">
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
                    </span>
                    {prompt.category && (
                      <span className="rounded bg-muted/70 px-1.5 py-0.5">
                        {prompt.category.name}
                      </span>
                    )}
                  </div>
                </div>

                <CopyButton
                  value={prompt.content ?? ""}
                  successMessage="Copied"
                  className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
