"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BookMarked,
  Clock,
  FileText,
  Loader2,
  Puzzle,
  Search,
  Settings,
  Tag,
  ArrowRight,
  X,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { globalSearchAction } from "@/lib/actions/search.actions";
import { SETTINGS_ITEMS } from "@/constants/settings-config";

const RECENT_KEY = "global-search:recent";
const MAX_RECENT = 5;

type RecentItem = { label: string; href: string };

function getRecent(): RecentItem[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function addRecent(item: RecentItem) {
  const prev = getRecent().filter((r) => r.href !== item.href);
  localStorage.setItem(
    RECENT_KEY,
    JSON.stringify([item, ...prev].slice(0, MAX_RECENT))
  );
}

const TYPE_META = {
  prompt: {
    color: "bg-sky-500",
    bg: "bg-sky-500/8",
    text: "text-sky-500",
    label: "Prompt",
  },
  piece: {
    color: "bg-violet-500",
    bg: "bg-violet-500/8",
    text: "text-violet-500",
    label: "Piece",
  },
  reference: {
    color: "bg-emerald-500",
    bg: "bg-emerald-500/8",
    text: "text-emerald-500",
    label: "Reference",
  },
  tag: {
    color: "bg-amber-500",
    bg: "bg-amber-500/8",
    text: "text-amber-500",
    label: "Tag",
  },
  setting: {
    color: "bg-slate-500",
    bg: "bg-slate-500/8",
    text: "text-slate-500",
    label: "Setting",
  },
} as const;

function ResultItem({
  icon,
  title,
  meta,
  type,
  value,
  onSelect,
}: {
  icon: React.ReactNode;
  title: string;
  meta?: string;
  type: keyof typeof TYPE_META;
  value: string;
  onSelect: () => void;
}) {
  const m = TYPE_META[type];
  return (
    <CommandItem
      value={value}
      onSelect={onSelect}
      className={cn(
        "group relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
        "data-selected:bg-foreground/[0.05]"
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full opacity-0 transition-all duration-150 group-data-selected:opacity-100",
          m.color
        )}
      />
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
          m.bg
        )}
      >
        <span className={m.text}>{icon}</span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[0.8125rem] font-medium leading-none text-foreground">
          {title}
        </span>
        {meta && (
          <span className="truncate text-xs leading-none text-muted-foreground/70">
            {meta}
          </span>
        )}
      </div>
      <span
        className={cn(
          "shrink-0 rounded-md px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide opacity-0 transition-opacity group-data-selected:opacity-100",
          m.bg,
          m.text
        )}
      >
        {m.label}
      </span>
      <ArrowRight
        className={cn(
          "size-3.5 shrink-0 opacity-0 transition-all duration-150 group-data-selected:opacity-40",
          m.text
        )}
      />
    </CommandItem>
  );
}

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [recent, setRecent] = React.useState<RecentItem[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  const { execute, result, isPending } = useAction(globalSearchAction);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (open) {
      setRecent(getRecent());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length === 0) return;
    debounceRef.current = setTimeout(() => {
      execute({ query: query.trim() });
    }, 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, execute]);

  function navigate(label: string, href: string) {
    addRecent({ label, href });
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function close() {
    setOpen(false);
    setQuery("");
  }

  const data = result?.data;
  const trimmed = query.trim();
  const q = trimmed.toLowerCase();
  const matchedSettings =
    q.length === 0
      ? []
      : SETTINGS_ITEMS.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.keywords.some((k) => k.includes(q))
        );
  const hasResults =
    (data &&
      (data.prompts.length > 0 ||
        data.pieces.length > 0 ||
        data.references.length > 0 ||
        data.tags.length > 0)) ||
    matchedSettings.length > 0;
  const showRecent = trimmed.length === 0 && recent.length > 0;
  const showHint = trimmed.length === 0 && !showRecent;
  const showEmpty = !isPending && trimmed.length > 0 && !hasResults;
  const totalResults =
    (data
      ? data.prompts.length + data.pieces.length + data.references.length + data.tags.length
      : 0) + matchedSettings.length;

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "relative ml-auto hidden w-full max-w-sm items-center gap-2 rounded-md border border-input bg-muted/40 px-3 h-9 text-sm text-muted-foreground transition-all duration-150 md:flex lg:max-w-md",
          "hover:bg-muted/70 hover:border-foreground/20 hover:text-foreground"
        )}
      >
        <Search className="size-3.5 shrink-0" />
        <span className="flex-1 text-left truncate text-xs">Search prompts, pieces, tags…</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[0.6rem] font-medium tracking-wide md:inline-flex">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) close();
          else setOpen(true);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className={cn(
            "top-[18%] translate-y-0 max-w-[580px] p-0 gap-0 overflow-hidden",
            "border border-border/60 shadow-2xl shadow-black/20",
            "bg-popover"
          )}
        >
          {/* Accessibility labels (hidden) */}
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search across prompts, pieces, references, and tags
          </DialogDescription>

          <Command shouldFilter={false} className="rounded-none bg-transparent">
            {/* Search input row */}
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5">
              <div className="flex shrink-0 items-center justify-center">
                {isPending ? (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : (
                  <Search className="size-4 text-muted-foreground" />
                )}
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search prompts, pieces, references, tags…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Escape") close();
                }}
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
              <div className="flex shrink-0 items-center gap-1.5 pl-1 border-l border-border/60 ml-1">
                <span className="text-[0.625rem] text-muted-foreground/50 font-medium">
                  {totalResults > 0 ? `${totalResults} result${totalResults !== 1 ? "s" : ""}` : ""}
                </span>
              </div>
            </div>

            {/* Results area */}
            <CommandList className="max-h-[380px] overflow-y-auto px-2 py-2 [scrollbar-width:thin]">

              {/* Idle hint */}
              {showHint && (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-border/50 bg-muted/50">
                    <Search className="size-5 text-muted-foreground/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground/70">Search everything</p>
                    <p className="mt-1 text-xs text-muted-foreground/50">
                      Prompts · Pieces · References · Tags
                    </p>
                  </div>
                </div>
              )}

              {/* Recent searches */}
              {showRecent && (
                <CommandGroup
                  heading={
                    <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-muted-foreground/40">
                      Recent
                    </span>
                  }
                >
                  {recent.map((item) => (
                    <CommandItem
                      key={item.href}
                      value={item.href}
                      onSelect={() => navigate(item.label, item.href)}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 data-selected:bg-foreground/[0.05]"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/70">
                        <Clock className="size-3.5 text-muted-foreground/60" />
                      </span>
                      <span className="truncate text-[0.8125rem] text-foreground/80">
                        {item.label}
                      </span>
                      <ArrowRight className="ml-auto size-3.5 shrink-0 opacity-0 transition-opacity group-data-selected:opacity-30" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Loading */}
              {isPending && trimmed.length > 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground/50">
                    <Loader2 className="size-5 animate-spin" />
                    <span className="text-xs">Searching…</span>
                  </div>
                </div>
              )}

              {/* Empty */}
              {showEmpty && (
                <CommandEmpty>
                  <div className="flex flex-col items-center gap-3 py-12">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-dashed border-border/50">
                      <Search className="size-5 text-muted-foreground/30" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground/60">No results</p>
                      <p className="mt-1 text-xs text-muted-foreground/40">
                        Nothing matched &ldquo;{query}&rdquo;
                      </p>
                    </div>
                  </div>
                </CommandEmpty>
              )}

              {/* DB Results */}
              {!isPending && data && (
                <>
                  {data.prompts.length > 0 && (
                    <>
                      <CommandGroup
                        heading={
                          <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-muted-foreground/40">
                            Prompts
                          </span>
                        }
                      >
                        {data.prompts.map((p) => (
                          <ResultItem
                            key={p.id}
                            value={`prompt-${p.id}`}
                            type="prompt"
                            title={p.title}
                            meta={p.description ?? undefined}
                            icon={<FileText className="size-3.5" />}
                            onSelect={() => navigate(p.title, `/prompts/${p.id}`)}
                          />
                        ))}
                      </CommandGroup>
                      <CommandSeparator className="my-1 bg-border/40" />
                    </>
                  )}

                  {data.pieces.length > 0 && (
                    <>
                      <CommandGroup
                        heading={
                          <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-muted-foreground/40">
                            Pieces
                          </span>
                        }
                      >
                        {data.pieces.map((p) => (
                          <ResultItem
                            key={p.id}
                            value={`piece-${p.id}`}
                            type="piece"
                            title={p.title}
                            meta={p.piece_type.charAt(0) + p.piece_type.slice(1).toLowerCase()}
                            icon={<Puzzle className="size-3.5" />}
                            onSelect={() => navigate(p.title, `/pieces/${p.id}`)}
                          />
                        ))}
                      </CommandGroup>
                      <CommandSeparator className="my-1 bg-border/40" />
                    </>
                  )}

                  {data.references.length > 0 && (
                    <>
                      <CommandGroup
                        heading={
                          <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-muted-foreground/40">
                            References
                          </span>
                        }
                      >
                        {data.references.map((r) => (
                          <ResultItem
                            key={r.id}
                            value={`ref-${r.id}`}
                            type="reference"
                            title={r.title}
                            meta={r.type.charAt(0) + r.type.slice(1).toLowerCase()}
                            icon={<BookMarked className="size-3.5" />}
                            onSelect={() => navigate(r.title, `/library/${r.id}`)}
                          />
                        ))}
                      </CommandGroup>
                      <CommandSeparator className="my-1 bg-border/40" />
                    </>
                  )}

                  {data.tags.length > 0 && (
                    <>
                      <CommandGroup
                        heading={
                          <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-muted-foreground/40">
                            Tags
                          </span>
                        }
                      >
                        {data.tags.map((t) => (
                          <ResultItem
                            key={t.id}
                            value={`tag-${t.id}`}
                            type="tag"
                            title={`#${t.name}`}
                            icon={<Tag className="size-3.5" />}
                            onSelect={() =>
                              navigate(`#${t.name}`, `/library?tag_slug=${t.slug}`)
                            }
                          />
                        ))}
                      </CommandGroup>
                      {matchedSettings.length > 0 && <CommandSeparator className="my-1 bg-border/40" />}
                    </>
                  )}
                </>
              )}

              {/* Settings results — client-side, instant */}
              {matchedSettings.length > 0 && trimmed.length > 0 && (
                <CommandGroup
                  heading={
                    <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-muted-foreground/40">
                      Settings
                    </span>
                  }
                >
                  {matchedSettings.map((s) => (
                    <ResultItem
                      key={s.id}
                      value={`setting-${s.id}`}
                      type="setting"
                      title={s.title}
                      meta={s.section}
                      icon={<Settings className="size-3.5" />}
                      onSelect={() => navigate(s.title, s.href)}
                    />
                  ))}
                </CommandGroup>
              )}
            </CommandList>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-4 py-2">
              <div className="flex items-center gap-3 text-[0.625rem] text-muted-foreground/40">
                <span className="flex items-center gap-1">
                  <Kbd>↑</Kbd><Kbd>↓</Kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>↵</Kbd> select
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>ESC</Kbd> close
                </span>
              </div>
              <div className="flex items-center gap-1 text-[0.625rem] text-muted-foreground/30">
                <Kbd>⌘K</Kbd>
                <span>to toggle</span>
              </div>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center rounded border border-border/50 bg-background px-1 py-0.5 font-mono text-[0.625rem] text-muted-foreground/60">
      {children}
    </kbd>
  );
}
