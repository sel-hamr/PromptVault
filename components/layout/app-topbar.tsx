"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppBreadcrumb } from "./app-breadcrumb";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearch } from "./global-search";

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

      <GlobalSearch />

      <ThemeToggle className="ml-2 shrink-0" />
    </header>
  );
}
