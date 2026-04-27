"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion-variants";

const PIECES = [
  {
    type: "Persona",
    content: "Act as a senior marketing strategist with 15 years of B2B experience",
    color: "#8b5cf6",
    top: "4%", left: "0%", rotate: -5,
    floatAmount: -14, dur: 3.8, delay: 0.2,
  },
  {
    type: "Tone",
    content: "Use a friendly, conversational tone. Avoid corporate speak.",
    color: "#06b6d4",
    top: "0%", left: "56%", rotate: 4,
    floatAmount: 12, dur: 4.2, delay: 0,
  },
  {
    type: "Format",
    content: "Structure as a markdown table: Feature | Benefit | Example",
    color: "#10b981",
    top: "63%", left: "1%", rotate: -3,
    floatAmount: -10, dur: 3.5, delay: 0.5,
  },
  {
    type: "Constraint",
    content: "Keep under 200 words. No jargon. Be direct.",
    color: "#f59e0b",
    top: "67%", left: "57%", rotate: 3,
    floatAmount: 11, dur: 4.6, delay: 0.3,
  },
  {
    type: "Context",
    content: "US small business owners, aged 30–50, non-technical",
    color: "#f43f5e",
    top: "31%", left: "21%", rotate: -2,
    floatAmount: -8, dur: 5.0, delay: 0.7,
  },
];

function PieceCard({ piece, index }: { piece: (typeof PIECES)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, piece.floatAmount, 0],
      }}
      transition={{
        opacity: { delay: 0.9 + index * 0.14, duration: 0.45 },
        scale: { delay: 0.9 + index * 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        y: {
          duration: piece.dur,
          ease: "easeInOut",
          repeat: Infinity,
          delay: piece.delay + 1.2 + index * 0.14,
          repeatType: "reverse",
        },
      }}
      whileHover={{ scale: 1.06, zIndex: 20 }}
      className="absolute w-44 cursor-default rounded-xl border border-border bg-card/80 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl"
      style={{ top: piece.top, left: piece.left, rotate: piece.rotate }}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: piece.color }} />
        <span
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: piece.color }}
        >
          {piece.type}
        </span>
      </div>
      <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
        {piece.content}
      </p>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Top radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 55% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-16 px-6 pt-24 pb-16 lg:flex-row">
        {/* Text content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium text-violet-500 dark:text-violet-300"
          >
            <Sparkles className="h-3 w-3" />
            Now in public beta — free to start
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-black leading-[1.03] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-[80px]"
          >
            Build prompts
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              like code.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground lg:text-xl"
          >
            Store, compose, and reuse prompts using modular building blocks.
            Fork public prompts. Build your personal prompt system — finally.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(139,92,246,0.35)] transition-all hover:bg-violet-500 hover:shadow-[0_0_48px_rgba(139,92,246,0.55)]"
            >
              Start building free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/explore"
              className="rounded-xl border border-border px-6 py-3.5 text-sm font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
            >
              Explore public prompts
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-8 lg:justify-start"
          >
            {[
              { value: "2,400+", label: "Prompts created" },
              { value: "580+", label: "Active users" },
              { value: "900+", label: "Public pieces" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center lg:text-left">
                <div className="text-lg font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating piece cards visual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative w-full flex-1 lg:mt-0"
          style={{ height: 480, minWidth: 340, maxWidth: 480 }}
        >
          {/* Central composer mockup */}
          <div className="absolute left-1/2 top-1/2 w-52 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-dashed border-violet-500/25 bg-violet-500/[0.03] p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-center gap-1.5">
              <div className="h-1 w-1 rounded-full bg-violet-400/40" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-400/50">
                Composer
              </span>
              <div className="h-1 w-1 rounded-full bg-violet-400/40" />
            </div>
            <div className="space-y-2">
              {[
                { label: "Persona", color: "#8b5cf6" },
                { label: "Format", color: "#10b981" },
                { label: "Constraint", color: "#f59e0b" },
              ].map(({ label, color }) => (
                <div
                  key={label}
                  className="flex h-6 items-center gap-2 rounded-md bg-muted/50 px-2.5"
                >
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] text-muted-foreground/50">{label}</span>
                </div>
              ))}
              <div className="mt-3 rounded-md border border-border bg-muted/30 p-2">
                <p className="text-[9px] leading-relaxed text-muted-foreground/40">
                  Act as a senior marketing strategist... Use a markdown table...
                  Keep under 200 words.
                </p>
              </div>
            </div>
          </div>

          {PIECES.map((piece, i) => (
            <PieceCard key={piece.type} piece={piece} index={i} />
          ))}

          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: "radial-gradient(circle 220px at 50% 50%, rgba(139,92,246,0.08), transparent)",
            }}
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
