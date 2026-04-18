"use client";

import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppBreadcrumb } from "./app-breadcrumb";

type AppTopbarProps = {
  onMenuClick: () => void;
};

export function AppTopbar({ onMenuClick }: AppTopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6"
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="inline-flex size-9 items-center justify-center rounded-md text-foreground/70 hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <AppBreadcrumb className="hidden md:block" />

      <div className="relative ml-auto hidden w-full max-w-sm md:flex lg:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search prompts, pieces, tags…"
          className={cn(
            "h-9 w-full rounded-md border border-input bg-muted/40 pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          )}
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground md:inline-flex">
          ⌘K
        </kbd>
      </div>
    </header>
  );
}
