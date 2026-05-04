"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SETTINGS_ITEMS } from "@/constants/settings-config";

export function SettingsSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const q = query.toLowerCase();
  const results =
    q.length === 0
      ? SETTINGS_ITEMS
      : SETTINGS_ITEMS.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.keywords.some((k) => k.includes(q))
        );

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md border border-input bg-muted/30 px-3 h-8 text-xs text-muted-foreground transition-colors",
          "hover:bg-muted/60 hover:border-foreground/20 hover:text-foreground"
        )}
      >
        <Search className="size-3 shrink-0" />
        <span className="flex-1 text-left truncate">Search settings…</span>
        <kbd className="hidden items-center rounded border border-border bg-background px-1 py-0.5 text-[0.6rem] font-medium tracking-wide sm:inline-flex">
          /
        </kbd>
      </button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) { setOpen(false); setQuery(""); }
          else setOpen(true);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="top-[18%] translate-y-0 max-w-md p-0 gap-0 overflow-hidden border border-border/60 shadow-2xl shadow-black/20 bg-popover"
        >
          <DialogTitle className="sr-only">Search settings</DialogTitle>
          <DialogDescription className="sr-only">
            Filter settings by keyword
          </DialogDescription>

          <Command shouldFilter={false} className="rounded-none bg-transparent">
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search settings…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setOpen(false); setQuery(""); }
                }}
              />
            </div>

            <CommandList className="max-h-64 overflow-y-auto px-2 py-2">
              <CommandEmpty>
                <p className="py-6 text-center text-sm text-muted-foreground/50">
                  No settings matched &ldquo;{query}&rdquo;
                </p>
              </CommandEmpty>

              {results.length > 0 && (
                <CommandGroup>
                  {results.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => navigate(item.href)}
                      className="flex cursor-pointer flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 data-selected:bg-foreground/[0.05]"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-[0.8125rem] font-medium text-foreground">
                          {item.title}
                        </span>
                        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[0.6rem] font-medium text-muted-foreground">
                          {item.section}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground/60">
                        {item.description}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
