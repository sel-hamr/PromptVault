"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
    preview: (
      <div className="flex h-16 flex-col overflow-hidden rounded-md border border-border bg-white">
        <div className="flex h-4 items-center gap-1 border-b border-zinc-200 bg-zinc-100 px-2">
          <span className="size-1.5 rounded-full bg-zinc-300" />
          <span className="size-1.5 rounded-full bg-zinc-300" />
          <span className="h-1.5 w-8 rounded-sm bg-zinc-200" />
        </div>
        <div className="flex flex-1 gap-1.5 p-1.5">
          <div className="w-7 rounded-sm bg-zinc-100" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-1.5 w-full rounded-sm bg-zinc-200" />
            <div className="h-1.5 w-3/4 rounded-sm bg-zinc-100" />
          </div>
        </div>
      </div>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    preview: (
      <div className="flex h-16 flex-col overflow-hidden rounded-md border border-zinc-700 bg-zinc-900">
        <div className="flex h-4 items-center gap-1 border-b border-zinc-700 bg-zinc-800 px-2">
          <span className="size-1.5 rounded-full bg-zinc-600" />
          <span className="size-1.5 rounded-full bg-zinc-600" />
          <span className="h-1.5 w-8 rounded-sm bg-zinc-700" />
        </div>
        <div className="flex flex-1 gap-1.5 p-1.5">
          <div className="w-7 rounded-sm bg-zinc-800" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-1.5 w-full rounded-sm bg-zinc-700" />
            <div className="h-1.5 w-3/4 rounded-sm bg-zinc-800" />
          </div>
        </div>
      </div>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    preview: (
      <div className="flex h-16 flex-col overflow-hidden rounded-md border border-border">
        <div className="flex h-full">
          <div className="flex flex-1 flex-col bg-white">
            <div className="flex h-4 items-center gap-1 border-b border-r border-zinc-200 bg-zinc-100 px-1.5">
              <span className="size-1.5 rounded-full bg-zinc-300" />
            </div>
            <div className="flex flex-1 gap-1 p-1.5">
              <div className="flex flex-1 flex-col gap-1">
                <div className="h-1.5 w-full rounded-sm bg-zinc-200" />
                <div className="h-1.5 w-1/2 rounded-sm bg-zinc-100" />
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col bg-zinc-900">
            <div className="flex h-4 items-center gap-1 border-b border-l border-zinc-700 bg-zinc-800 px-1.5">
              <span className="size-1.5 rounded-full bg-zinc-600" />
            </div>
            <div className="flex flex-1 gap-1 p-1.5">
              <div className="flex flex-1 flex-col gap-1">
                <div className="h-1.5 w-full rounded-sm bg-zinc-700" />
                <div className="h-1.5 w-1/2 rounded-sm bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
] as const;

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-4">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            className="flex flex-col gap-2 text-left"
          >
            <div
              className={cn(
                "w-32 overflow-hidden rounded-lg border-2 transition-all",
                active
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-foreground/30"
              )}
            >
              {opt.preview}
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex size-3.5 items-center justify-center rounded-full border-2 transition-colors",
                  active ? "border-primary bg-primary" : "border-muted-foreground/40"
                )}
              >
                {active && <span className="size-1.5 rounded-full bg-primary-foreground" />}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {opt.label}
              </span>
              <Icon className={cn("size-3", active ? "text-primary" : "text-muted-foreground/50")} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
