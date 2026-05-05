"use client";

import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Layers,
  Search,
  Bell,
  Settings,
  ChevronRight,
  Star,
  GitFork,
  Tag,
  Puzzle,
  Zap,
  BookOpen,
  Home,
  Plus,
  MoreHorizontal,
  Check,
  ArrowRight,
  Sparkles,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "@/lib/motion-variants";

// ---------------------------------------------------------------------------
// Static fake data
// ---------------------------------------------------------------------------

const SIDEBAR_ITEMS = [
  { icon: Home, label: "Dashboard", active: false },
  { icon: Layers, label: "Composer", active: true },
  { icon: Puzzle, label: "Piece Library", active: false },
  { icon: BookOpen, label: "My Prompts", active: false },
  { icon: GitFork, label: "Explore", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const PIECE_LIBRARY = [
  { type: "Persona", color: "#8b5cf6", rgb: "139,92,246", label: "Senior SaaS Strategist" },
  { type: "Tone", color: "#06b6d4", rgb: "6,182,212", label: "Conversational & Direct" },
  { type: "Format", color: "#10b981", rgb: "16,185,129", label: "Markdown Table" },
  { type: "Constraint", color: "#f59e0b", rgb: "245,158,11", label: "Under 200 Words" },
  { type: "Context", color: "#f43f5e", rgb: "244,63,94", label: "B2B SaaS Audience" },
];

const PROMPT_CARDS = [
  {
    title: "Marketing Copy Expert",
    pieces: ["Persona", "Tone", "Constraint"],
    pieceColors: ["#8b5cf6", "#06b6d4", "#f59e0b"],
    stars: 128,
    forks: 34,
    tags: ["marketing", "copywriting"],
    hot: true,
  },
  {
    title: "Code Review Assistant",
    pieces: ["Persona", "Format", "Context"],
    pieceColors: ["#8b5cf6", "#10b981", "#f43f5e"],
    stars: 94,
    forks: 21,
    tags: ["code", "review"],
    hot: false,
  },
  {
    title: "Product Spec Writer",
    pieces: ["Tone", "Format", "Constraint"],
    pieceColors: ["#06b6d4", "#10b981", "#f59e0b"],
    stars: 67,
    forks: 15,
    tags: ["product", "docs"],
    hot: false,
  },
];

const COMPOSER_ACTIVE_PIECES = [
  { type: "Persona", color: "#8b5cf6", rgb: "139,92,246", text: "Senior SaaS Strategist" },
  { type: "Tone", color: "#06b6d4", rgb: "6,182,212", text: "Conversational & Direct" },
  { type: "Format", color: "#10b981", rgb: "16,185,129", text: "Markdown Table" },
];

const MOBILE_PROMPTS = [
  { title: "Marketing Copy Expert", tag: "Persona", tagColor: "#8b5cf6", stars: 128 },
  { title: "Code Review Assistant", tag: "Format", tagColor: "#10b981", stars: 94 },
  { title: "SEO Optimizer", tag: "Tone", tagColor: "#06b6d4", stars: 61 },
];

// ---------------------------------------------------------------------------
// Callout label component
// ---------------------------------------------------------------------------

function Callout({
  label,
  description,
  side = "right",
  className,
  delay = 0,
}: {
  label: string;
  description: string;
  side?: "left" | "right";
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "right" ? 16 : -16, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("absolute z-20 flex items-start gap-2 pointer-events-none", className)}
    >
      {side === "left" && (
        <div className="mt-2.5 h-px w-6 bg-gradient-to-l from-violet-500/60 to-transparent" />
      )}
      <div
        className="rounded-xl border bg-card/90 px-3 py-2 backdrop-blur-md shadow-lg"
        style={{
          borderColor: "rgba(139,92,246,0.25)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(139,92,246,0.12)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
            {label}
          </span>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground/80 leading-relaxed max-w-[110px]">
          {description}
        </p>
      </div>
      {side === "right" && (
        <div className="mt-2.5 h-px w-6 bg-gradient-to-r from-violet-500/60 to-transparent" />
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Desktop browser mockup inner UI
// ---------------------------------------------------------------------------

function DesktopDashboardUI() {
  const [activePrompt, setActivePrompt] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActivePrompt((p) => (p + 1) % PROMPT_CARDS.length);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex h-full overflow-hidden" role="presentation" aria-hidden="true">
      {/* Sidebar */}
      <div className="flex w-[130px] flex-shrink-0 flex-col border-r border-border/50 bg-muted/20">
        {/* Brand */}
        <div className="flex items-center gap-2 px-3 py-3 border-b border-border/30">
          <div
            className="flex h-5 w-5 items-center justify-center rounded-md"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
            }}
          >
            <Layers className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-foreground/90">PromptVault</span>
        </div>
        {/* Nav */}
        <nav className="flex-1 space-y-0.5 p-2">
          {SIDEBAR_ITEMS.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2 py-1.5 cursor-default",
                active
                  ? "bg-violet-500/15 text-violet-400"
                  : "text-muted-foreground/60 hover:text-foreground/80",
              )}
            >
              <Icon className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="text-[9px] font-medium">{label}</span>
            </div>
          ))}
        </nav>
        {/* User avatar */}
        <div className="flex items-center gap-1.5 border-t border-border/30 px-3 py-2">
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 flex-shrink-0" />
          <span className="text-[8px] text-muted-foreground/60">@alex.dev</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 border-b border-border/40 bg-background/50 px-3 py-2">
          <div className="flex flex-1 items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5">
            <Search className="h-2.5 w-2.5 text-muted-foreground/50 flex-shrink-0" />
            <span className="text-[9px] text-muted-foreground/40">Search prompts…</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bell className="h-3 w-3 text-muted-foreground/40" />
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400" />
          </div>
        </div>

        {/* Body: two-column layout */}
        <div className="flex flex-1 gap-0 overflow-hidden">
          {/* Left: Prompt list */}
          <div className="flex w-[210px] flex-shrink-0 flex-col border-r border-border/40 bg-background/30 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
              <span className="text-[9px] font-semibold text-foreground/70 uppercase tracking-wider">
                My Prompts
              </span>
              <button className="flex items-center gap-0.5 rounded-md bg-violet-500/15 px-1.5 py-0.5">
                <Plus className="h-2 w-2 text-violet-400" />
                <span className="text-[8px] font-medium text-violet-400">New</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden space-y-0 p-2">
              {PROMPT_CARDS.map((card, i) => (
                <motion.div
                  key={card.title}
                  animate={{
                    backgroundColor:
                      i === activePrompt
                        ? "rgba(139,92,246,0.1)"
                        : "transparent",
                    borderColor:
                      i === activePrompt
                        ? "rgba(139,92,246,0.3)"
                        : "rgba(255,255,255,0.05)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="mb-1.5 cursor-default rounded-xl border p-2.5"
                >
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <span className="text-[9px] font-semibold text-foreground/90 leading-tight">
                      {card.title}
                    </span>
                    {card.hot && (
                      <div className="flex-shrink-0 flex items-center gap-0.5 rounded-md bg-amber-500/15 px-1 py-0.5">
                        <Zap className="h-1.5 w-1.5 text-amber-400" />
                        <span className="text-[7px] font-bold text-amber-400">HOT</span>
                      </div>
                    )}
                  </div>
                  {/* Piece dots */}
                  <div className="flex items-center gap-1 mb-1.5">
                    {card.pieceColors.map((c, ci) => (
                      <div
                        key={ci}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: c }}
                      />
                    ))}
                    <span className="ml-0.5 text-[7.5px] text-muted-foreground/50">
                      {card.pieces.length} pieces
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-[7.5px] text-muted-foreground/50">
                      <Star className="h-1.5 w-1.5" />
                      {card.stars}
                    </span>
                    <span className="flex items-center gap-0.5 text-[7.5px] text-muted-foreground/50">
                      <GitFork className="h-1.5 w-1.5" />
                      {card.forks}
                    </span>
                    <div className="flex gap-0.5 ml-auto">
                      {card.tags.slice(0, 1).map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-muted/60 px-1 py-px text-[7px] text-muted-foreground/60"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Composer */}
          <div className="flex flex-1 flex-col overflow-hidden bg-background/20">
            <div className="flex items-center gap-1.5 border-b border-border/30 px-3 py-2">
              <Layers className="h-2.5 w-2.5 text-violet-400/80" />
              <span className="text-[9px] font-semibold text-foreground/80">
                Composer — Marketing Copy Expert
              </span>
              <div className="ml-auto flex items-center gap-1">
                <div className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 flex items-center gap-0.5">
                  <Check className="h-2 w-2 text-emerald-400" />
                  <span className="text-[7.5px] font-medium text-emerald-400">Saved</span>
                </div>
                <Copy className="h-2.5 w-2.5 text-muted-foreground/40" />
                <MoreHorizontal className="h-2.5 w-2.5 text-muted-foreground/40" />
              </div>
            </div>

            <div className="flex flex-1 gap-0 overflow-hidden">
              {/* Active pieces list */}
              <div className="w-[130px] flex-shrink-0 border-r border-border/30 p-2 space-y-1.5">
                <span className="block text-[8px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
                  Active Pieces
                </span>
                {COMPOSER_ACTIVE_PIECES.map(({ type, color, rgb, text }) => (
                  <div
                    key={type}
                    className="rounded-lg p-1.5 cursor-default"
                    style={{
                      background: `rgba(${rgb},0.08)`,
                      border: `1px solid rgba(${rgb},0.2)`,
                    }}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <div
                        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />
                      <span
                        className="text-[7.5px] font-bold uppercase tracking-wider"
                        style={{ color }}
                      >
                        {type}
                      </span>
                    </div>
                    <p className="text-[7.5px] text-muted-foreground/70 leading-tight line-clamp-2">
                      {text}
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-center rounded-lg border border-dashed border-border/40 py-2 cursor-default">
                  <Plus className="h-2.5 w-2.5 text-muted-foreground/30" />
                </div>
              </div>

              {/* Assembled output */}
              <div className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-2.5 w-2.5 text-violet-400/70" />
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-violet-400/70">
                    Assembled Output
                  </span>
                </div>
                <div
                  className="flex-1 overflow-hidden rounded-xl border border-border/40 bg-muted/20 p-3 relative"
                >
                  <p className="text-[8.5px] leading-relaxed text-muted-foreground/80">
                    <span className="text-violet-300/90">Act as</span> a senior SaaS marketing
                    strategist with 15+ years of B2B experience.{" "}
                    <span className="text-cyan-300/90">Use</span> a friendly, conversational tone —
                    avoid corporate jargon.{" "}
                    <span className="text-emerald-300/90">Structure</span> your response as a
                    markdown table with columns: Feature | Benefit | Example.{" "}
                    <span className="text-amber-300/90">Keep</span> the total response under 200
                    words and lead with the most impactful point.
                  </p>
                  {/* Blinking cursor */}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                    className="inline-block h-2.5 w-0.5 rounded-sm bg-violet-400/70 ml-0.5 translate-y-0.5"
                  />
                  {/* Token count badge */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-background/60 px-1.5 py-0.5 border border-border/30">
                    <Zap className="h-1.5 w-1.5 text-amber-400/80" />
                    <span className="text-[7px] text-muted-foreground/60">~47 tokens</span>
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex items-center gap-1.5">
                  <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-violet-600 py-1.5 shadow-[0_2px_12px_rgba(139,92,246,0.4)]">
                    <Copy className="h-2 w-2 text-white/90" />
                    <span className="text-[8px] font-semibold text-white">Copy Prompt</span>
                  </button>
                  <button className="flex items-center justify-center gap-1 rounded-lg border border-border/50 bg-muted/30 px-2 py-1.5">
                    <GitFork className="h-2 w-2 text-muted-foreground/60" />
                    <span className="text-[8px] text-muted-foreground/60">Fork</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Piece library drawer strip on far right */}
      <div className="hidden xl:flex w-[110px] flex-shrink-0 flex-col border-l border-border/40 bg-muted/10">
        <div className="border-b border-border/30 px-2 py-2">
          <div className="flex items-center gap-1">
            <Puzzle className="h-2.5 w-2.5 text-muted-foreground/50" />
            <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Pieces
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-1 p-1.5 overflow-hidden">
          {PIECE_LIBRARY.map(({ type, color, rgb, label }) => (
            <div
              key={type}
              className="rounded-lg p-1.5 cursor-default"
              style={{
                background: `rgba(${rgb},0.07)`,
                border: `1px solid rgba(${rgb},0.18)`,
              }}
            >
              <div
                className="text-[7px] font-bold uppercase tracking-wider mb-0.5"
                style={{ color }}
              >
                {type}
              </div>
              <div className="text-[7px] text-muted-foreground/60 leading-tight line-clamp-2">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop browser frame
// ---------------------------------------------------------------------------

function DesktopMockup({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      animate={
        reduced
          ? {}
          : {
              y: [0, -10, 0],
              transition: {
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              },
            }
      }
      className="relative w-full"
      aria-label="PromptVault desktop app mockup"
      role="img"
    >
      {/* Glow under mockup */}
      <div
        className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 h-16 w-3/4 blur-2xl rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(139,92,246,0.35) 0%, rgba(6,182,212,0.2) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Browser chrome */}
      <div
        className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl"
        style={{
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {/* Title bar */}
        <div className="flex h-9 items-center gap-2 border-b border-border/50 bg-muted/40 px-4">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[0_0_4px_rgba(255,95,87,0.5)]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[0_0_4px_rgba(255,189,46,0.4)]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840] shadow-[0_0_4px_rgba(40,200,64,0.4)]" />
          </div>
          {/* Address bar */}
          <div className="mx-3 flex flex-1 items-center gap-2 rounded-lg bg-background/50 border border-border/30 px-3 py-1 max-w-xs">
            <div className="h-2 w-2 rounded-full bg-emerald-400/60 flex-shrink-0" />
            <span className="text-[10px] text-muted-foreground/60 font-mono">
              app.promptvault.io/composer
            </span>
          </div>
          {/* Window controls strip */}
          <div className="ml-auto flex items-center gap-2">
            <div className="h-1.5 w-10 rounded-full bg-muted-foreground/10" />
            <div className="h-1.5 w-6 rounded-full bg-muted-foreground/10" />
          </div>
        </div>
        {/* App content */}
        <div style={{ height: 360 }}>
          <DesktopDashboardUI />
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Mobile phone inner UI
// ---------------------------------------------------------------------------

function MobileAppUI() {
  return (
    <div
      className="flex h-full flex-col overflow-hidden bg-background"
      role="presentation"
      aria-hidden="true"
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 pt-1 pb-1">
        <span className="text-[7px] font-semibold text-foreground/70">9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-px items-end">
            {[3, 4, 5, 5].map((h, i) => (
              <div
                key={i}
                className="w-0.5 rounded-sm bg-foreground/70"
                style={{ height: h }}
              />
            ))}
          </div>
          <svg viewBox="0 0 16 12" className="h-2 w-2.5 fill-foreground/70">
            <path d="M8 2.4C10.5 2.4 12.7 3.5 14.2 5.2L16 3.3C14 1.2 11.2 0 8 0S2 1.2 0 3.3l1.8 1.9C3.3 3.5 5.5 2.4 8 2.4zm0 3.2c1.5 0 2.8.6 3.8 1.6L13.6 5.4C12.2 3.9 10.2 3 8 3S3.8 3.9 2.4 5.4l1.8 1.8C5.2 6.2 6.5 5.6 8 5.6zm0 3.2c.7 0 1.3.3 1.8.7L8 12l-1.8-2.5c.5-.4 1.1-.7 1.8-.7z" />
          </svg>
          <div
            className="h-2 rounded-sm border border-foreground/50"
            style={{ width: 16 }}
          >
            <div
              className="h-full rounded-sm bg-foreground/70"
              style={{ width: "80%" }}
            />
          </div>
        </div>
      </div>

      {/* App header */}
      <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <div
            className="flex h-5 w-5 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
            }}
          >
            <Layers className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-foreground/90">PromptVault</span>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-3 w-3 text-muted-foreground/60" />
          <Bell className="h-3 w-3 text-muted-foreground/60" />
        </div>
      </div>

      {/* Greeting */}
      <div className="px-3 pt-2 pb-1">
        <p className="text-[8px] text-muted-foreground/60">Good morning, Alex</p>
        <p className="text-[10px] font-bold text-foreground/90">My Prompts</p>
      </div>

      {/* Quick stats pills */}
      <div className="flex gap-1.5 px-3 pb-2 overflow-hidden">
        {[
          { label: "12 Prompts", color: "#8b5cf6" },
          { label: "48 Pieces", color: "#06b6d4" },
          { label: "3 Shared", color: "#10b981" },
        ].map(({ label, color }) => (
          <div
            key={label}
            className="rounded-lg px-2 py-1 flex-shrink-0"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}30`,
            }}
          >
            <span className="text-[7.5px] font-semibold" style={{ color }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Prompt cards */}
      <div className="flex-1 space-y-1.5 overflow-hidden px-3">
        {MOBILE_PROMPTS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/60 p-2.5"
          >
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${p.tagColor}18`, border: `1px solid ${p.tagColor}30` }}
            >
              <Puzzle className="h-3 w-3" style={{ color: p.tagColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold text-foreground/90 truncate">{p.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className="rounded px-1 py-px text-[6.5px] font-bold uppercase tracking-wide"
                  style={{
                    color: p.tagColor,
                    background: `${p.tagColor}15`,
                  }}
                >
                  {p.tag}
                </span>
                <span className="flex items-center gap-0.5 text-[7px] text-muted-foreground/50">
                  <Star className="h-1.5 w-1.5" />
                  {p.stars}
                </span>
              </div>
            </div>
            <ChevronRight className="h-3 w-3 flex-shrink-0 text-muted-foreground/30" />
          </motion.div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="mt-auto flex items-center justify-around border-t border-border/40 bg-card/60 px-2 py-2">
        {[
          { icon: Home, label: "Home", active: false },
          { icon: Layers, label: "Compose", active: true },
          { icon: Puzzle, label: "Pieces", active: false },
          { icon: BookOpen, label: "Explore", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={cn(
              "flex flex-col items-center gap-0.5",
              active ? "text-violet-400" : "text-muted-foreground/40",
            )}
          >
            <Icon className="h-3 w-3" />
            <span className="text-[6px] font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile phone frame
// ---------------------------------------------------------------------------

function PhoneMockup({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      animate={
        reduced
          ? {}
          : {
              y: [0, -7, 0],
              rotate: [0.5, -0.5, 0.5],
              transition: {
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1.2,
              },
            }
      }
      className="relative"
      aria-label="PromptVault mobile app mockup"
      role="img"
    >
      {/* Phone glow */}
      <div
        className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 h-12 w-4/5 blur-xl rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(6,182,212,0.4) 0%, rgba(139,92,246,0.2) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Phone outer frame */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 160,
          height: 310,
          borderRadius: 28,
          background: "linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
          padding: "2px",
        }}
      >
        {/* Inner bezel */}
        <div
          className="relative h-full w-full overflow-hidden bg-background"
          style={{ borderRadius: 26 }}
        >
          {/* Dynamic island */}
          <div
            className="absolute left-1/2 top-2 z-10 -translate-x-1/2"
            style={{
              width: 52,
              height: 13,
              borderRadius: 7,
              background: "#0a0a0a",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
            }}
          />
          {/* Screen content */}
          <div className="h-full pt-4">
            <MobileAppUI />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Feature callouts (floating labels around mockups)
// ---------------------------------------------------------------------------

function FeatureTag({
  label,
  color,
  delay,
  className,
}: {
  label: string;
  color: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "absolute z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold pointer-events-none",
        className,
      )}
      style={{
        background: `${color}12`,
        border: `1px solid ${color}30`,
        color,
        boxShadow: `0 4px 16px ${color}20`,
      }}
    >
      <div
        className="h-1.5 w-1.5 rounded-full animate-pulse"
        style={{ background: color }}
      />
      {label}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Section
// ---------------------------------------------------------------------------

export default function AppPreview() {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Parallax tilt for the desktop mockup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], reduced ? [0, 0] : [3, -3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], reduced ? [0, 0] : [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-24"
      aria-label="App preview section"
    >
      {/* Background: dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.08) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.13) 0%, rgba(6,182,212,0.07) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[600px] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 0% 100%, rgba(6,182,212,0.1) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-[400px] w-[500px] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, rgba(139,92,246,0.1) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16 flex flex-col items-center text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400 backdrop-blur-sm"
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Live product demo
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-[54px]"
          >
            See{" "}
            <span
              style={{
                background:
                  "linear-gradient(125deg, #a78bfa 0%, #8b5cf6 35%, #06b6d4 80%, #22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              PromptVault
            </span>{" "}
            in action
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Build modular prompts from reusable pieces. Compose, preview, and ship
            — all in one workspace that works beautifully on any device.
          </motion.p>
        </motion.div>

        {/* Mockups stage */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-end justify-center"
          style={{ perspective: 1200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* ---- Desktop mockup ---- */}
          <motion.div
            style={{ rotateX, rotateY }}
            className="relative w-full max-w-4xl"
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          >
            <DesktopMockup reduced={reduced} />

            {/* Floating callout: Composer */}
            <Callout
              label="Composer"
              description="Drag pieces together to build powerful prompts"
              side="left"
              className="-left-4 top-[30%] -translate-x-full hidden lg:flex"
              delay={0.9}
            />

            {/* Floating callout: Piece Library */}
            <Callout
              label="Piece Library"
              description="Reusable building blocks: Persona, Tone, Format…"
              side="right"
              className="-right-4 top-[55%] translate-x-full hidden lg:flex"
              delay={1.1}
            />

            {/* Feature tags above the mockup */}
            <FeatureTag
              label="Piece Library"
              color="#8b5cf6"
              delay={0.7}
              className="-top-4 left-[8%]"
            />
            <FeatureTag
              label="Live Preview"
              color="#10b981"
              delay={0.85}
              className="-top-4 left-1/2 -translate-x-1/2"
            />
            <FeatureTag
              label="1-click Copy"
              color="#06b6d4"
              delay={1.0}
              className="-top-4 right-[8%]"
            />
          </motion.div>

          {/* ---- Mobile mockup ---- */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 40, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-2 -bottom-6 z-10 hidden sm:block"
          >
            <PhoneMockup reduced={reduced} />

            {/* Mobile callout */}
            <Callout
              label="Mobile-first"
              description="Full access on iOS & Android"
              side="left"
              className="-left-3 top-1/3 -translate-x-full hidden lg:flex"
              delay={1.3}
            />
          </motion.div>
        </motion.div>

        {/* Bottom feature highlights strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: Puzzle,
              color: "#8b5cf6",
              rgb: "139,92,246",
              title: "Modular Pieces",
              description:
                "Snap together Persona, Tone, Format, and Constraint blocks into complete prompts.",
            },
            {
              icon: Zap,
              color: "#06b6d4",
              rgb: "6,182,212",
              title: "Instant Composer",
              description:
                "Watch your prompt assemble in real time. Copy to clipboard in one click.",
            },
            {
              icon: GitFork,
              color: "#10b981",
              rgb: "16,185,129",
              title: "Fork & Remix",
              description:
                "Fork any public prompt, tweak it, keep the credit chain intact — like OSS for prompts.",
            },
          ].map(({ icon: Icon, color, rgb, title, description }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:bg-card/80"
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              }}
            >
              {/* Hover glow */}
              <div
                className="pointer-events-none absolute -top-px left-0 right-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
                }}
                aria-hidden="true"
              />
              <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: `rgba(${rgb},0.12)`,
                  border: `1px solid rgba(${rgb},0.25)`,
                }}
              >
                <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-sm font-bold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                Learn more <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Section fade-out to next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
