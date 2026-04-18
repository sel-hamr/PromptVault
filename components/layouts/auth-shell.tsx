"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Sparkles, MousePointer2, Plus, Hash, GitFork, Star } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
};

type Piece = {
  type: "PERSONA" | "FORMAT" | "CONSTRAINT" | "TONE";
  title: string;
  preview: string;
};

const PIECES: Piece[] = [
  {
    type: "PERSONA",
    title: "Senior strategist",
    preview: "Act as a marketing strategist with 15 years…",
  },
  {
    type: "FORMAT",
    title: "Markdown table",
    preview: "Output as a table with columns: Feature, Benefit…",
  },
  {
    type: "CONSTRAINT",
    title: "Under 200 words",
    preview: "Keep the response concise. Avoid jargon…",
  },
];

const TYPE_COLOR: Record<Piece["type"], string> = {
  PERSONA: "bg-background/15",
  FORMAT: "bg-background/15",
  CONSTRAINT: "bg-background/15",
  TONE: "bg-background/15",
};

function VaultMark() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <path
        d="M3 3h7l3 3v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="8" cy="9" r="1.6" fill="currentColor" />
      <path d="M8 10.6V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PromptCard({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0);
  const [assembled, setAssembled] = useState<number[]>([]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % PIECES.length;
        setAssembled((prev) => {
          // Reset assembly when starting a new cycle
          if (next === 0) return [0];
          return prev.includes(next) ? prev : [...prev, next];
        });
        return next;
      });
    }, 2000);
    // Kick off with the first piece assembled
    setAssembled([0]);
    return () => window.clearInterval(id);
  }, [reduced]);

  const cursorY = active * 64 + 14;

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-auto w-full max-w-md"
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0], rotate: [-1.4, -0.6, -1.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "relative rounded-2xl p-4",
          "border border-background/10 bg-background/[0.04] backdrop-blur-md",
          "shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
        )}
      >
        {/* Header: editor chrome */}
        <div className="mb-3 flex items-center gap-2">
          <span className="flex items-center gap-1 text-[0.7rem] font-semibold text-background/70">
            <GitFork className="size-3" strokeWidth={2.4} />
            compose
          </span>
          <span className="text-background/25">/</span>
          <span className="text-[0.7rem] font-medium text-background/50">untitled-prompt</span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-background/15 bg-background/10 px-2 py-0.5 text-[0.6rem] font-semibold text-background/80">
            <span className="relative flex size-1.5">
              <motion.span
                animate={reduced ? undefined : { opacity: [0.2, 0.8, 0.2], scale: [1, 2.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-background"
              />
              <span className="relative inline-block size-1.5 rounded-full bg-background" />
            </span>
            CLAUDE
          </span>
        </div>

        {/* Piece library */}
        <div className="relative space-y-2">
          {PIECES.map((piece, i) => {
            const isActive = active === i;
            const isAssembled = assembled.includes(i);
            return (
              <motion.div
                key={piece.title}
                animate={{
                  backgroundColor: isActive
                    ? "color-mix(in oklab, var(--background) 14%, transparent)"
                    : "color-mix(in oklab, var(--background) 4%, transparent)",
                  borderColor: isActive
                    ? "color-mix(in oklab, var(--background) 28%, transparent)"
                    : "color-mix(in oklab, var(--background) 8%, transparent)",
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "relative flex h-[56px] items-center gap-3 overflow-hidden rounded-lg border p-3"
                )}
              >
                {/* Shimmer on active */}
                {!reduced && isActive && (
                  <motion.span
                    aria-hidden
                    initial={{ x: "-120%" }}
                    animate={{ x: "220%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--background)_18%,transparent),transparent)]"
                  />
                )}

                {/* Type chip */}
                <span
                  className={cn(
                    "flex h-6 min-w-[4.25rem] shrink-0 items-center justify-center rounded-md px-2",
                    "text-[0.6rem] font-bold tracking-[0.08em]",
                    TYPE_COLOR[piece.type],
                    "text-background/85"
                  )}
                >
                  {piece.type}
                </span>

                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[0.75rem] font-semibold leading-tight text-background/90">
                    {piece.title}
                  </span>
                  <span className="block truncate text-[0.65rem] leading-tight text-background/45">
                    {piece.preview}
                  </span>
                </div>

                <motion.span
                  animate={{
                    backgroundColor: isAssembled
                      ? "color-mix(in oklab, var(--background) 92%, transparent)"
                      : "color-mix(in oklab, var(--background) 10%, transparent)",
                    color: isAssembled
                      ? "var(--foreground)"
                      : "color-mix(in oklab, var(--background) 70%, transparent)",
                  }}
                  transition={{ duration: 0.35 }}
                  className="flex size-6 shrink-0 items-center justify-center rounded-md"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isAssembled ? "added" : "plus"}
                      initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isAssembled ? (
                        <svg viewBox="0 0 12 12" className="size-3" fill="none">
                          <path
                            d="M2.5 6.2l2.3 2.3L9.5 3.8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <Plus className="size-3" strokeWidth={2.6} />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
              </motion.div>
            );
          })}

          {/* Looping cursor */}
          {!reduced && (
            <motion.div
              aria-hidden
              initial={false}
              animate={{ y: cursorY }}
              transition={{ type: "spring", stiffness: 170, damping: 20, mass: 0.6 }}
              className="pointer-events-none absolute right-0 top-0 flex items-center gap-1.5"
            >
              <motion.div
                animate={{ scale: [1, 0.82, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", times: [0, 0.12, 0.25] }}
                className="flex items-center gap-1.5"
              >
                <MousePointer2 className="size-4 -rotate-12 fill-background text-background drop-shadow" />
                <span className="rounded-md bg-background px-2 py-0.5 text-[0.65rem] font-semibold text-foreground shadow-lg">
                  compose
                </span>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Footer: tags + stats */}
        <div className="mt-3 flex items-center gap-2 border-t border-background/10 pt-3">
          <span className="inline-flex items-center gap-0.5 rounded-full bg-background/10 px-2 py-0.5 text-[0.6rem] font-medium text-background/70">
            <Hash className="size-2.5" strokeWidth={2.5} />
            copywriting
          </span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-background/10 px-2 py-0.5 text-[0.6rem] font-medium text-background/70">
            <Hash className="size-2.5" strokeWidth={2.5} />
            marketing
          </span>
          <span className="ml-auto flex items-center gap-2.5 text-[0.65rem] font-medium text-background/55">
            <span className="flex items-center gap-0.5">
              <Star className="size-2.5 fill-current" strokeWidth={0} />
              4.8
            </span>
            <span className="flex items-center gap-0.5">
              <GitFork className="size-2.5" strokeWidth={2.4} />
              214
            </span>
          </span>
        </div>
      </motion.div>

      {!reduced && (
        <motion.div
          aria-hidden
          animate={{ opacity: [0.3, 0.55, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-x-8 -bottom-6 -z-10 h-16 rounded-full bg-background/20 blur-2xl"
        />
      )}
    </motion.div>
  );
}

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.01 } }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div className="grid min-h-svh w-full bg-background lg:grid-cols-[1fr_1.1fr]">
      {/* ── Left: form panel ─────────────────────────────────── */}
      <div className="relative flex flex-col">
        <header className="relative flex items-center justify-between px-7 py-6 md:px-10">
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-2.5 rounded-md",
              "transition-opacity hover:opacity-60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            )}
            aria-label="PromptVault — home"
          >
            <span
              aria-hidden
              className={cn(
                "flex size-[1.625rem] shrink-0 items-center justify-center rounded-[6px]",
                "bg-foreground text-background"
              )}
            >
              <VaultMark />
            </span>
            <span className="text-[0.9375rem] font-bold tracking-[-0.03em] text-foreground">
              PromptVault
            </span>
          </Link>

          <p className="text-[0.8125rem] text-muted-foreground">
            Need help?{" "}
            <Link
              href={ROUTES.support}
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              Contact us
            </Link>
          </p>
        </header>

        <main className="relative flex flex-1 items-center justify-center px-7 pb-14 pt-6 md:px-10">
          <div className="w-full max-w-[23rem]">
            <motion.div {...fadeUp(0)} className="mb-8">
              <h1
                className={cn(
                  "text-[2.25rem] font-bold leading-[1.08] tracking-[-0.04em] text-foreground",
                  "sm:text-[2.5rem]"
                )}
              >
                {title}
              </h1>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.07)}>{children}</motion.div>

            <motion.p
              {...fadeUp(0.14)}
              className="mt-7 text-center text-[0.8125rem] text-muted-foreground"
            >
              {footer}
            </motion.p>
          </div>
        </main>

        <footer className="relative px-7 pb-5 md:px-10 lg:hidden">
          <div className="flex items-center gap-4 text-[0.75rem] text-muted-foreground/60">
            <span>&copy; {new Date().getFullYear()} PromptVault</span>
            <Link href={ROUTES.privacy} className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href={ROUTES.terms} className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </footer>
      </div>

      {/* ── Right: inset dark panel ──────────────────────────── */}
      <aside className="relative hidden lg:block lg:p-5">
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-[2.25rem]",
            "bg-foreground text-background"
          )}
        >
          {/* Subtle dot pattern */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 opacity-[0.08]",
              "[background-image:radial-gradient(var(--background)_1px,transparent_1px)]",
              "[background-size:22px_22px]"
            )}
          />

          {/* Soft radial glow */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0",
              "[background:radial-gradient(ellipse_60%_50%_at_80%_15%,color-mix(in_oklab,var(--background)_14%,transparent),transparent_70%)]"
            )}
          />

          <div className="relative flex h-full flex-col p-10 xl:p-14">
            {/* Top: brand tagline pill */}
            <motion.div
              {...fadeUp(0.05)}
              className={cn(
                "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5",
                "border border-background/15 bg-background/5 backdrop-blur-sm",
                "text-[0.75rem] font-medium text-background/80"
              )}
            >
              <Sparkles className="size-3.5" strokeWidth={2} />
              GitHub for prompts
            </motion.div>

            {/* Middle: editorial headline */}
            <div className="mt-10 max-w-[30rem]">
              <motion.h2
                {...fadeUp(0.15)}
                className={cn(
                  "text-balance text-[2.75rem] font-bold leading-[1.02] tracking-[-0.04em]",
                  "xl:text-[3.25rem]"
                )}
              >
                Compose prompts
                <br />
                <span className="text-background/55">like building blocks.</span>
              </motion.h2>

              <motion.p
                {...fadeUp(0.22)}
                className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-background/65"
              >
                Save reusable pieces — personas, formats, constraints — then drag them together. Fork what works. Share the rest.
              </motion.p>
            </div>

            {/* Bottom: animated composer mockup */}
            <PromptCard reduced={shouldReduceMotion} />

            <motion.div
              {...fadeUp(0.5)}
              className="mt-8 flex items-center justify-between text-[0.75rem] text-background/45"
            >
              <span>&copy; {new Date().getFullYear()} PromptVault</span>
              <div className="flex items-center gap-5">
                <Link href={ROUTES.privacy} className="transition-colors hover:text-background">
                  Privacy
                </Link>
                <Link href={ROUTES.terms} className="transition-colors hover:text-background">
                  Terms
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </aside>
    </div>
  );
}
