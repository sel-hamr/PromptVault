"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  fadeUp,
  fadeIn,
  scaleUp,
  staggerContainer,
} from "@/lib/motion-variants";

const PIECES = [
  {
    type: "Persona",
    content:
      "Act as a senior marketing strategist with 15 years of B2B SaaS experience",
    color: "#8b5cf6",
    colorRgb: "139,92,246",
    top: "6%",
    left: "2%",
    rotate: -4,
    floatAmount: -14,
    dur: 3.8,
    delay: 0.2,
  },
  {
    type: "Tone",
    content: "Use a friendly, conversational tone. Avoid corporate speak.",
    color: "#06b6d4",
    colorRgb: "6,182,212",
    top: "2%",
    left: "54%",
    rotate: 4,
    floatAmount: 12,
    dur: 4.2,
    delay: 0,
  },
  {
    type: "Format",
    content: "Structure as a markdown table: Feature | Benefit | Example",
    color: "#10b981",
    colorRgb: "16,185,129",
    top: "61%",
    left: "2%",
    rotate: -3,
    floatAmount: -10,
    dur: 3.5,
    delay: 0.5,
  },
  {
    type: "Constraint",
    content: "Keep under 200 words. No jargon. Be direct.",
    color: "#f59e0b",
    colorRgb: "245,158,11",
    top: "65%",
    left: "55%",
    rotate: 3,
    floatAmount: 11,
    dur: 4.6,
    delay: 0.3,
  },
  {
    type: "Context",
    content: "US small business owners, aged 30–50, non-technical",
    color: "#f43f5e",
    colorRgb: "244,63,94",
    top: "30%",
    left: "20%",
    rotate: -2,
    floatAmount: -8,
    dur: 5.0,
    delay: 0.7,
  },
];

const COMPOSER_SLOTS = [
  { label: "Persona", color: "#8b5cf6" },
  { label: "Tone", color: "#06b6d4" },
  { label: "Format", color: "#10b981" },
  { label: "Constraint", color: "#f59e0b" },
];

const ASSEMBLED_TEXT =
  "Act as a senior marketing strategist... Use a friendly, conversational tone... Structure as a markdown table... Keep under 200 words.";

const AVATARS = [
  "https://picsum.photos/32/32?random=av1",
  "https://picsum.photos/32/32?random=av2",
  "https://picsum.photos/32/32?random=av3",
  "https://picsum.photos/32/32?random=av4",
];

const HEADLINE_WORDS = ["Build prompts", "like code."];

function useCountUp(target: number, duration = 1.8, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function CountStat({
  value,
  suffix,
  label,
  shouldCount,
}: {
  value: number;
  suffix: string;
  label: string;
  shouldCount: boolean;
}) {
  const count = useCountUp(value, 1.6, shouldCount);
  return (
    <div className="text-center lg:text-left">
      <div className="text-lg font-bold tabular-nums text-foreground">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function PieceCard({
  piece,
  index,
  reduced,
}: {
  piece: (typeof PIECES)[0];
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={
        reduced
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 1, scale: 1, y: [0, piece.floatAmount, 0] }
      }
      transition={
        reduced
          ? {
              delay: 0.8 + index * 0.12,
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }
          : {
              opacity: { delay: 0.8 + index * 0.12, duration: 0.45 },
              scale: {
                delay: 0.8 + index * 0.12,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              },
              y: {
                duration: piece.dur,
                ease: "easeInOut",
                repeat: Infinity,
                delay: piece.delay + 1.4 + index * 0.12,
                repeatType: "reverse",
              },
            }
      }
      whileHover={reduced ? {} : { scale: 1.05, y: -3 }}
      className="absolute w-46 cursor-default"
      style={{ top: piece.top, left: piece.left, rotate: piece.rotate }}
      aria-hidden="true"
    >
      <div
        className="rounded-2xl border bg-card/95 p-3.5 backdrop-blur-xl"
        style={{
          borderColor: `rgba(${piece.colorRgb},0.25)`,
          boxShadow: `0 2px 16px rgba(0,0,0,0.18), 0 0 0 1px rgba(${piece.colorRgb},0.1)`,
        }}
      >
        <div className="mb-2 flex items-center gap-2">
          <div
            className="flex h-5 w-5 items-center justify-center rounded-md"
            style={{ background: `rgba(${piece.colorRgb},0.15)` }}
          >
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: piece.color }}
            />
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: piece.color }}
          >
            {piece.type}
          </span>
        </div>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground/80">
          {piece.content}
        </p>
      </div>
    </motion.div>
  );
}

function ComposerMockup({ reduced }: { reduced: boolean }) {
  const [shimmer, setShimmer] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShimmer(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        reduced ? {} : { y: -4, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }
      }
      className="absolute left-1/2 top-1/2 w-60 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      style={{
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
      aria-label="PromptVault Composer interface mockup"
    >
      <div className="flex items-center gap-1.5 border-b border-border/40 bg-muted/30 px-3.5 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] font-medium text-muted-foreground/60">
          PromptVault — Composer
        </span>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center gap-1.5">
          <Layers className="h-3 w-3 text-violet-400/70" aria-hidden="true" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-violet-400/70">
            Active pieces
          </span>
        </div>

        <div className="space-y-1.5">
          {COMPOSER_SLOTS.map(({ label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 1.0 + i * 0.1,
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex h-7 items-center gap-2 rounded-lg bg-muted/60 px-2.5"
            >
              <div
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="text-[10px] font-medium text-muted-foreground/80">
                {label}
              </span>
              <div className="ml-auto h-1 w-10 rounded-full bg-muted-foreground/10" />
            </motion.div>
          ))}
        </div>

        <div className="mt-3 rounded-lg border border-border/40 bg-background/60 p-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <div className="h-1 w-1 rounded-full bg-violet-400/50" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-violet-400/50">
              Assembled output
            </span>
          </div>
          <div className="relative overflow-hidden">
            <p className="text-[9.5px] leading-relaxed text-muted-foreground/70">
              {ASSEMBLED_TEXT}
            </p>
            <motion.div
              initial={{ x: "-110%" }}
              animate={shimmer ? { x: "110%" } : { x: "-110%" }}
              transition={
                shimmer
                  ? {
                      duration: 1.1,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 3.5,
                    }
                  : {}
              }
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(139,92,246,0.18) 50%, transparent 70%)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ConnectionLines({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      overflow="visible"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(139,92,246,0.35)" />
        </marker>
      </defs>
      {[
        {
          x1: "24%",
          y1: "15%",
          x2: "40%",
          y2: "42%",
          color: "rgba(139,92,246,0.3)",
          delay: 1.4,
        },
        {
          x1: "73%",
          y1: "12%",
          x2: "58%",
          y2: "42%",
          color: "rgba(6,182,212,0.3)",
          delay: 1.6,
        },
        {
          x1: "22%",
          y1: "72%",
          x2: "40%",
          y2: "56%",
          color: "rgba(16,185,129,0.3)",
          delay: 1.8,
        },
        {
          x1: "72%",
          y1: "75%",
          x2: "58%",
          y2: "58%",
          color: "rgba(245,158,11,0.3)",
          delay: 2.0,
        },
      ].map((line, i) => (
        <motion.line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={line.color}
          strokeWidth="1"
          strokeDasharray="4 4"
          markerEnd="url(#arrowhead)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: line.delay, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

function ScanBeam({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.5) 40%, rgba(6,182,212,0.5) 60%, transparent)",
        }}
        initial={{ top: "0%", opacity: 0 }}
        animate={{ top: ["0%", "100%", "0%"], opacity: [0, 0.7, 0.7, 0] }}
        transition={{
          duration: 4.5,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 2,
          delay: 2.5,
          times: [0, 0.45, 0.55, 1],
        }}
      />
    </motion.div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion() ?? false;
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [headlinePhase, setHeadlinePhase] = useState<0 | 1>(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t1 = setTimeout(() => setHeadlinePhase(1), 900);
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    const t2 = setTimeout(() => {
      clearInterval(blink);
      setCursorVisible(false);
    }, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(blink);
    };
  }, [reduced]);

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-background"
      aria-label="Hero section"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 dark:opacity-100"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.025" />
      </svg>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.09) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 70% 0%, rgba(139,92,246,0.14) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 10% 90%, rgba(6,182,212,0.09) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(139,92,246,0) 0deg, rgba(139,92,246,0.06) 60deg, rgba(6,182,212,0.06) 120deg, rgba(16,185,129,0.04) 180deg, rgba(139,92,246,0) 360deg)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-12 px-6 pb-16 pt-24 lg:flex-row lg:gap-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400 backdrop-blur-sm transition-colors hover:border-violet-500/50 hover:bg-violet-500/15"
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Public beta — free to start
            <span
              className="h-1.5 w-1.5 rounded-full bg-violet-400 opacity-80"
              aria-hidden="true"
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl font-black leading-[1.03] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-[78px]"
          >
            {HEADLINE_WORDS[0]}
            <br />
            <span
              className="relative inline-block"
              style={{
                background:
                  "linear-gradient(125deg, #a78bfa 0%, #8b5cf6 35%, #06b6d4 75%, #22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% 100%",
                animation: reduced
                  ? "none"
                  : "shimmer-slide 3s linear infinite",
              }}
            >
              {HEADLINE_WORDS[1]}
            </span>
            <AnimatePresence>
              {!reduced && headlinePhase === 0 && cursorVisible && (
                <motion.span
                  key="cursor"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.05em] rounded-sm bg-violet-400 align-middle"
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl"
          >
            Store, compose, and reuse prompts using modular building blocks.
            <br className="hidden sm:block" />
            Fork public prompts. Build your personal prompt system.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <motion.div
              whileHover={reduced ? {} : { scale: 1.04 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >
              <Link
                href="/register"
                className={cn(
                  "group relative flex min-h-[44px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl sm:w-auto",
                  "bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white",
                  "shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_4px_24px_rgba(139,92,246,0.35)]",
                  "transition-shadow duration-300",
                  "hover:shadow-[0_0_0_1px_rgba(139,92,246,0.7),0_8px_40px_rgba(139,92,246,0.55)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  reduced
                    ? ""
                    : "animate-[pulse-glow_2.8s_ease-in-out_infinite]",
                )}
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/12 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                  aria-hidden="true"
                />
                Start building free
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={scaleUp}
          initial="hidden"
          animate="visible"
          className="relative hidden w-full flex-1 lg:block"
          style={{ height: 500, minWidth: 340, maxWidth: 500 }}
          aria-hidden="true"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 280px 260px at 50% 50%, rgba(139,92,246,0.1), transparent)",
            }}
          />

          <ConnectionLines reduced={reduced} />

          <ComposerMockup reduced={reduced} />

          {PIECES.map((piece, i) => (
            <PieceCard
              key={piece.type}
              piece={piece}
              index={i}
              reduced={reduced}
            />
          ))}

          <ScanBeam reduced={reduced} />
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="block w-full lg:hidden"
          aria-hidden="true"
        >
          <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="flex items-center gap-1.5 border-b border-border/40 bg-muted/30 px-3.5 py-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[10px] font-medium text-muted-foreground/60">
                PromptVault — Composer
              </span>
            </div>
            <div className="p-4">
              <div className="space-y-1.5">
                {COMPOSER_SLOTS.map(({ label, color }) => (
                  <div
                    key={label}
                    className="flex h-7 items-center gap-2 rounded-lg bg-muted/60 px-2.5"
                  >
                    <div
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ background: color }}
                    />
                    <span className="text-[10px] font-medium text-muted-foreground/80">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-border/40 bg-background/60 p-3">
                <p className="text-[9.5px] leading-relaxed text-muted-foreground/70">
                  {ASSEMBLED_TEXT}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />

      <style>{`
        @keyframes shimmer-slide {
          0% { background-position: 0% center; }
          100% { background-position: -200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(139,92,246,0.5), 0 4px 24px rgba(139,92,246,0.35); }
          50% { box-shadow: 0 0 0 1px rgba(139,92,246,0.7), 0 8px 40px rgba(139,92,246,0.6); }
        }
      `}</style>
    </section>
  );
}
