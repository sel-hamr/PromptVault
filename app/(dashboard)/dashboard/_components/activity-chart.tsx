"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ActivityPoint } from "@/lib/data/dashboard";

const chartConfig = {
  prompts: { label: "Prompts", color: "hsl(217 91% 60%)" },
  pieces: { label: "Pieces", color: "hsl(262 83% 58%)" },
  forks: { label: "Forks received", color: "hsl(142 71% 45%)" },
} satisfies ChartConfig;

function formatAxisDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface ActivityChartProps {
  data: ActivityPoint[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const totalPrompts = data.reduce((s, d) => s + d.prompts, 0);
  const totalPieces = data.reduce((s, d) => s + d.pieces, 0);
  const totalForks = data.reduce((s, d) => s + d.forks, 0);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-1 border-b border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Activity</h2>
          <p className="text-xs text-muted-foreground">Last 14 days</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="size-2 shrink-0 rounded-full bg-[hsl(217_91%_60%)]" />
            <span className="text-muted-foreground">Prompts</span>
            <span className="font-semibold tabular-nums">{totalPrompts}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 shrink-0 rounded-full bg-[hsl(262_83%_58%)]" />
            <span className="text-muted-foreground">Pieces</span>
            <span className="font-semibold tabular-nums">{totalPieces}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 shrink-0 rounded-full bg-[hsl(142_71%_45%)]" />
            <span className="text-muted-foreground">Forks received</span>
            <span className="font-semibold tabular-nums">{totalForks}</span>
          </span>
        </div>
      </div>

      <div className="px-2 pb-4 pt-4">
        <ChartContainer config={chartConfig} className="h-52 w-full">
          <AreaChart data={data} margin={{ left: 4, right: 4, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="gradPrompts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPieces" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradForks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              tickFormatter={formatAxisDate}
              interval={1}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              allowDecimals={false}
              width={24}
            />

            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(val) => formatAxisDate(val as string)}
                  indicator="dot"
                />
              }
            />

            <Area
              type="monotone"
              dataKey="prompts"
              stroke="hsl(217 91% 60%)"
              strokeWidth={2}
              fill="url(#gradPrompts)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="pieces"
              stroke="hsl(262 83% 58%)"
              strokeWidth={2}
              fill="url(#gradPieces)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="forks"
              stroke="hsl(142 71% 45%)"
              strokeWidth={2}
              fill="url(#gradForks)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
