"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "@/lib/motion-variants";

// ─── Data ────────────────────────────────────────────────────────────────────

const ACCENT_COLORS = [
  { color: "#8b5cf6", rgb: "139,92,246" },   // violet
  { color: "#06b6d4", rgb: "6,182,212" },    // cyan
  { color: "#10b981", rgb: "16,185,129" },   // emerald
  { color: "#f59e0b", rgb: "245,158,11" },   // amber
  { color: "#f43f5e", rgb: "244,63,94" },    // rose
] as const;

const FAQS = [
  {
    q: "What is a Prompt Piece?",
    a: "A reusable building block for prompts. Each piece has a type (Persona, Tone, Format, Constraint, Context) and content. You create pieces once and compose them into complete prompts — like LEGO bricks for your AI workflow.",
  },
  {
    q: "Is PromptVault free to use?",
    a: "Yes, we're in public beta and completely free to start. No credit card required. We plan to keep a generous free tier permanently so individuals and small teams always have a home for their prompts.",
  },
  {
    q: "How does forking work?",
    a: "Any public prompt can be forked into your private library with one click. Your fork is fully independent — edits you make don't affect the original, and the original author can't see your changes.",
  },
  {
    q: "Are my prompts private by default?",
    a: "Yes. Every prompt and piece you create is private unless you explicitly choose to share it publicly. You remain in full control of visibility at all times.",
  },
  {
    q: "Can I use PromptVault with any AI model?",
    a: "Absolutely. PromptVault is model-agnostic — it stores and composes prompts as plain text. Use the output with GPT-4, Claude, Gemini, Mistral, or any other LLM of your choice.",
  },
  {
    q: "What's the Composer?",
    a: "The Composer is a workspace where you drag, drop, and arrange your pieces into a complete prompt. It shows a live assembled preview you can copy to your clipboard with one click.",
  },
  {
    q: "Can I collaborate with my team?",
    a: "Team features — shared libraries and role-based access — are on our roadmap. Today you can share individual prompts publicly and your teammates can fork them into their own private libraries.",
  },
  {
    q: "How do I get started?",
    a: "Sign up for free, create your first Piece (try a Persona), then head to the Composer and assemble it into a full prompt. Most users build their first complete prompt in under 5 minutes.",
  },
] as const;

// ─── Split into two columns ───────────────────────────────────────────────────

const LEFT_FAQS = FAQS.slice(0, 4);
const RIGHT_FAQS = FAQS.slice(4);

// ─── Single FAQ item ──────────────────────────────────────────────────────────

function FAQItem({
  faq,
  index,
  globalIndex,
  isOpen,
  onToggle,
  isVisible,
  reduced,
}: {
  faq: { q: string; a: string };
  index: number;
  globalIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  isVisible: boolean;
  reduced: boolean;
}) {
  const accent = ACCENT_COLORS[globalIndex % ACCENT_COLORS.length];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 24 }
      }
      transition={{
        duration: 0.55,
        delay: isVisible ? index * 0.08 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "group w-full text-left",
          "rounded-2xl border bg-card/95 backdrop-blur-xl",
          "transition-all duration-300",
          isOpen
            ? "border-border/80 shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
            : "border-border/50 hover:border-border/70 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]",
        )}
        style={{
          boxShadow: isOpen
            ? `0 8px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(${accent.rgb},0.12), inset 0 1px 0 rgba(255,255,255,0.04)`
            : undefined,
        }}
      >
        {/* Colored left border accent */}
        <div className="flex items-start gap-0 overflow-hidden rounded-2xl">
          <div
            className="w-[3px] self-stretch flex-shrink-0 rounded-l-2xl transition-all duration-300"
            style={{
              background: isOpen
                ? `linear-gradient(180deg, ${accent.color}, rgba(${accent.rgb},0.3))`
                : `rgba(${accent.rgb},0.25)`,
            }}
            aria-hidden="true"
          />

          <div className="flex-1 px-5 py-5">
            {/* Question row */}
            <div className="flex items-center justify-between gap-4">
              <span
                className={cn(
                  "text-sm font-semibold leading-snug transition-colors duration-200 sm:text-[15px]",
                  isOpen ? "text-foreground" : "text-foreground/85 group-hover:text-foreground",
                )}
              >
                {faq.q}
              </span>

              {/* Animated +/× icon */}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: reduced ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors duration-200 group-hover:border-border"
                style={
                  isOpen
                    ? {
                        background: `rgba(${accent.rgb},0.12)`,
                        borderColor: `rgba(${accent.rgb},0.35)`,
                        color: accent.color,
                      }
                    : undefined
                }
                aria-hidden="true"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M5 1V9M1 5H9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.span>
            </div>

            {/* Animated answer */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: {
                      duration: reduced ? 0 : 0.32,
                      ease: [0.16, 1, 0.3, 1],
                    },
                    opacity: {
                      duration: reduced ? 0 : 0.22,
                      delay: isOpen ? 0.06 : 0,
                    },
                  }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FAQ() {
  const reduced = useReducedMotion() ?? false;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver — same pattern as Hero's stats
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  function handleToggle(globalIndex: number) {
    setOpenIndex((prev) => (prev === globalIndex ? null : globalIndex));
  }

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-background py-28"
      aria-labelledby="faq-heading"
    >
      {/* Dot-grid background overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.09) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Ambient glow — top-right violet */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(139,92,246,0.11) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Ambient glow — bottom-left cyan */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 5% 100%, rgba(6,182,212,0.08) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom fade-out into next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* ── Section header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400"
          >
            FAQ
          </motion.p>

          <motion.h2
            id="faq-heading"
            variants={fadeUp}
            className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Got questions?{" "}
            <span className="text-muted-foreground">We have answers.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Everything you need to know about PromptVault. Can't find an
            answer?{" "}
            <a
              href="mailto:selhamr9@gmail.com"
              className="font-medium text-violet-400 underline-offset-2 hover:underline"
            >
              Reach out to us.
            </a>
          </motion.p>
        </motion.div>

        {/* ── Two-column FAQ grid ── */}
        <div ref={sectionRef} className="grid gap-3 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-3">
          {/* Left column — items 0–3 */}
          <div className="flex flex-col gap-3">
            {LEFT_FAQS.map((faq, i) => (
              <FAQItem
                key={faq.q}
                faq={faq}
                index={i}
                globalIndex={i}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
                isVisible={sectionVisible}
                reduced={reduced}
              />
            ))}
          </div>

          {/* Right column — items 4–7 */}
          <div className="flex flex-col gap-3">
            {RIGHT_FAQS.map((faq, i) => {
              const gi = i + 4;
              return (
                <FAQItem
                  key={faq.q}
                  faq={faq}
                  index={i}
                  globalIndex={gi}
                  isOpen={openIndex === gi}
                  onToggle={() => handleToggle(gi)}
                  isVisible={sectionVisible}
                  reduced={reduced}
                />
              );
            })}
          </div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center"
        >
          <span className="text-sm text-muted-foreground">
            Still have questions?
          </span>
          <div className="flex items-center gap-3">
            <span
              className="hidden h-px w-8 bg-border/60 sm:block"
              aria-hidden="true"
            />
            <a
              href="/register"
              className={cn(
                "group relative inline-flex min-h-[40px] items-center gap-2 overflow-hidden rounded-xl",
                "bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white",
                "shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_4px_20px_rgba(139,92,246,0.3)]",
                "transition-shadow duration-300",
                "hover:shadow-[0_0_0_1px_rgba(139,92,246,0.7),0_8px_36px_rgba(139,92,246,0.5)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/12 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                aria-hidden="true"
              />
              Try PromptVault free
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path
                  d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
