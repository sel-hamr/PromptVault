import Link from "next/link";
import { Blocks, Compass, FileText, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

const ACTIONS = [
  {
    label: "Compose",
    description: "Build a new prompt",
    href: ROUTES.compose,
    icon: Blocks,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    label: "My Pieces",
    description: "Browse your toolkit",
    href: ROUTES.pieces,
    icon: Puzzle,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    label: "My Prompts",
    description: "Manage your library",
    href: ROUTES.prompts,
    icon: FileText,
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-500",
  },
  {
    label: "Explore",
    description: "Discover community",
    href: ROUTES.explore,
    icon: Compass,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
] as const;

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col gap-2.5 rounded-lg p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-md",
                  action.iconBg,
                )}
              >
                <Icon
                  className={cn("size-4", action.iconColor)}
                  strokeWidth={1.8}
                />
              </div>
              <div>
                <p className="text-xs font-semibold">{action.label}</p>
                <p className="text-[0.625rem] text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
