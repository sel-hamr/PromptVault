"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ModelStat } from "@/lib/data/dashboard";

const MODEL_LABELS: Record<string, string> = {
  CHATGPT: "ChatGPT",
  CLAUDE: "Claude",
  MIDJOURNEY: "Midjourney",
  GEMINI: "Gemini",
  DALLE: "DALL-E",
  STABLE_DIFFUSION: "Stable Diffusion",
  UNIVERSAL: "Universal",
};

const MODEL_COLORS: Record<string, string> = {
  CHATGPT: "hsl(142 71% 45%)",
  CLAUDE: "hsl(25 95% 53%)",
  MIDJOURNEY: "hsl(262 83% 58%)",
  GEMINI: "hsl(217 91% 60%)",
  DALLE: "hsl(346 87% 61%)",
  STABLE_DIFFUSION: "hsl(239 84% 67%)",
  UNIVERSAL: "hsl(215 16% 57%)",
};

// Static config so ChartContainer can resolve CSS variables — no dynamic key access needed.
const chartConfig = {
  chatgpt: { label: "ChatGPT", color: "hsl(142 71% 45%)" },
  claude: { label: "Claude", color: "hsl(25 95% 53%)" },
  midjourney: { label: "Midjourney", color: "hsl(262 83% 58%)" },
  gemini: { label: "Gemini", color: "hsl(217 91% 60%)" },
  dalle: { label: "DALL-E", color: "hsl(346 87% 61%)" },
  stable_diffusion: { label: "Stable Diffusion", color: "hsl(239 84% 67%)" },
  universal: { label: "Universal", color: "hsl(215 16% 57%)" },
} as unknown;

interface ModelDistributionProps {
  distribution: ModelStat[];
  total: number;
}

export function ModelDistribution({
  distribution,
  total,
}: ModelDistributionProps) {
  if (distribution.length === 0) return null;

  const chartData = distribution.map(({ model, count }) => ({
    name: MODEL_LABELS[model] ?? model,
    value: count,
    fill: MODEL_COLORS[model] ?? "hsl(215 16% 57%)",
  }));

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold">By Model</h2>
      </div>

      <div className="flex flex-col items-center gap-3 px-5 pb-5 pt-3">
        {/* Donut chart with CSS-positioned centre label — avoids recharts Label any-typing */}
        <div className="relative w-full max-w-55">
          <ChartContainer config={chartConfig} className="h-45 w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={80}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-bold tabular-nums leading-none">
              {total}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              {total === 1 ? "prompt" : "prompts"}
            </span>
          </div>
        </div>

        <ul className="w-full space-y-1.5">
          {chartData.map(({ name, value, fill }) => (
            <li
              key={name}
              className="flex items-center justify-between text-xs"
            >
              <span className="flex items-center gap-2 font-medium">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: fill }}
                />
                {name}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
