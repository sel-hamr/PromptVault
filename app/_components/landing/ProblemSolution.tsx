"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { fadeUp, slideLeft, slideRight, staggerContainer } from "@/lib/motion-variants";

const PROBLEMS = [
  "Prompts buried in 12 different notes apps",
  "Rewriting the same persona instructions daily",
  "Copy-pasting from old ChatGPT threads",
  "No way to share a prompt with your team",
  "Starting from scratch every single time",
];

const SOLUTIONS = [
  "Every prompt stored, tagged, and searchable",
  "Reusable pieces: write once, compose forever",
  "A personal library that grows with you",
  "Share publicly or keep it completely private",
  "Assemble prompts from your own building blocks",
];

export default function ProblemSolution() {
  return (
    <section className="bg-background py-28">
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
            className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-violet-500 dark:text-violet-400"
          >
            Why PromptVault
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Your current workflow{" "}
            <span className="text-muted-foreground">is broken.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground"
          >
            AI power users spend hours recreating prompts they&apos;ve already
            written. There&apos;s a better way.
          </motion.p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Before */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative overflow-hidden rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-8"
          >
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/15">
                <X className="h-3.5 w-3.5 text-destructive" />
              </div>
              <span className="text-sm font-semibold text-destructive">
                Without PromptVault
              </span>
            </div>
            <ul className="space-y-3.5">
              {PROBLEMS.map((prob, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
                    <X className="h-2.5 w-2.5 text-destructive/70" />
                  </div>
                  <span className="text-sm text-muted-foreground">{prob}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-8"
          >
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <span className="text-sm font-semibold text-emerald-500">
                With PromptVault
              </span>
            </div>
            <ul className="space-y-3.5">
              {SOLUTIONS.map((sol, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                    <Check className="h-2.5 w-2.5 text-emerald-500/80" />
                  </div>
                  <span className="text-sm text-muted-foreground">{sol}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
