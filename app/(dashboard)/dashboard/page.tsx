import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { fetchDashboardData } from "@/lib/data/dashboard";
import { StatCards } from "./_components/stat-cards";
import { RecentPrompts } from "./_components/recent-prompts";
import { QuickActions } from "./_components/quick-actions";
import { ModelDistribution } from "./_components/model-distribution";
import { TopPrompts } from "./_components/top-prompts";
import { ActivityChart } from "./_components/activity-chart";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function firstName(name: string): string {
  return name.split(/[\s@]/)[0] ?? name;
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const userName = session!.user.name ?? session!.user.email ?? "there";

  const { stats, recentPrompts, topPrompts, modelDistribution, activityData } =
    await fetchDashboardData(userId);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {formatDate(new Date())}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {getGreeting()}, {firstName(userName)}
          </h1>
        </div>
        <Button asChild size="sm" className="shrink-0 gap-1.5">
          <Link href={ROUTES.compose}>
            <Plus className="size-4" strokeWidth={2.4} />
            New Prompt
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <StatCards stats={stats} />

      {/* Activity chart */}
      <ActivityChart data={activityData} />

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentPrompts prompts={recentPrompts} />
        </div>
        <div className="flex flex-col gap-6">
          <QuickActions />
          <ModelDistribution
            distribution={modelDistribution}
            total={stats.promptCount}
          />
        </div>
      </div>

      {/* Top performing */}
      {topPrompts.length > 0 && <TopPrompts prompts={topPrompts} />}
    </div>
  );
}
