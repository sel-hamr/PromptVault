import { Star, GitFork, Zap, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PromptDetail } from "./types";

interface PromptStatsProps {
  prompt: PromptDetail;
}

export function PromptStats({ prompt }: PromptStatsProps) {
  const stats = [
    {
      label: "Rating",
      value: `${prompt.avg_rating.toFixed(1)} (${prompt.rating_count})`,
      icon: Star,
      title: `${prompt.avg_rating.toFixed(1)} average from ${prompt.rating_count} ratings`,
    },
    {
      label: "Uses",
      value: prompt.use_count.toLocaleString(),
      icon: Zap,
      title: `Used ${prompt.use_count} times`,
    },
    {
      label: "Forks",
      value: prompt.fork_count.toLocaleString(),
      icon: GitFork,
      title: `Forked ${prompt.fork_count} times`,
    },
    {
      label: "Versions",
      value: prompt.version_count.toLocaleString(),
      icon: BookOpen,
      title: `${prompt.version_count} versions`,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, title }) => (
          <div key={label} className="flex flex-col gap-0.5" title={title}>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className="size-3" aria-hidden />
              {label}
            </div>
            <span className="text-sm font-semibold tabular-nums">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
