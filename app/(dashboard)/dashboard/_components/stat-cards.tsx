import { FileText, GitFork, Puzzle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/lib/data/dashboard";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            iconBg,
          )}
        >
          <Icon className={cn("size-4", iconColor)} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

export function StatCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="My Prompts"
        value={stats.promptCount}
        icon={FileText}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
      />
      <StatCard
        label="Prompt Pieces"
        value={stats.pieceCount}
        icon={Puzzle}
        iconBg="bg-purple-500/10"
        iconColor="text-purple-500"
      />
      <StatCard
        label="Total Uses"
        value={stats.totalUses}
        icon={Zap}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-500"
      />
      <StatCard
        label="Forks Received"
        value={stats.totalForks}
        icon={GitFork}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
      />
    </div>
  );
}
