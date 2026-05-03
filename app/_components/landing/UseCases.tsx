"use client";

import { motion } from "framer-motion";
import { fadeUp, scaleUp, staggerContainer, staggerSlow } from "@/lib/motion-variants";

const USE_CASES = [
  {
    emoji: "👨‍💻",
    role: "Developers",
    headline: "Ship faster with consistent prompts",
    example:
      "Maintain a library of code-review, refactoring, and PR-description prompts your whole team reuses.",
    tags: ["Code review", "Refactoring", "Debugging"],
    color: "#8b5cf6",
  },
  {
    emoji: "📣",
    role: "Marketers",
    headline: "Generate on-brand content at scale",
    example:
      "Build persona + tone + format pieces for your brand voice. Compose any campaign in 30 seconds.",
    tags: ["Copywriting", "SEO", "Email campaigns"],
    color: "#06b6d4",
  },
  {
    emoji: "✍️",
    role: "Writers",
    headline: "Never lose a good prompt again",
    example:
      "Store your best story-structuring, character-development, and editing prompts in one searchable place.",
    tags: ["Story structure", "Editing", "Ideation"],
    color: "#10b981",
  },
  {
    emoji: "🎓",
    role: "Educators & Students",
    headline: "Build better learning experiences",
    example:
      "Create reusable prompt templates for Socratic tutoring, quiz generation, and concept explanations.",
    tags: ["Tutoring", "Quiz gen", "Explanations"],
    color: "#f59e0b",
  },
];

export default function UseCases() {
  return (
    <section id="community" className="bg-muted/30 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400"
          >
            Use Cases
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Built for anyone who{" "}
            <span className="text-muted-foreground">uses AI daily.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {USE_CASES.map((uc) => (
            <motion.div
              key={uc.role}
              variants={scaleUp}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/50 text-2xl">
                {uc.emoji}
              </div>
              <div
                className="mb-1 text-xs font-semibold uppercase tracking-widest"
                style={{ color: uc.color }}
              >
                {uc.role}
              </div>
              <h3 className="mb-3 text-base font-bold leading-snug text-foreground">
                {uc.headline}
              </h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {uc.example}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {uc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: `${uc.color}12`,
                      color: `${uc.color}bb`,
                      border: `1px solid ${uc.color}20`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
