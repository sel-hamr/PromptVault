"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion-variants";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-background py-32">
      {/* Radial glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(139,92,246,0.14) 0%, transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 80%, rgba(6,182,212,0.07) 0%, transparent 60%)",
        }}
      />
      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-sm font-medium text-violet-500 dark:text-violet-300"
          >
            Free to start · No card required
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Start building your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 60%, #10b981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              prompt system
            </span>{" "}
            today.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            Stop rewriting prompts from scratch. Join hundreds of AI power users
            who&apos;ve organized their workflows with PromptVault.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all hover:bg-violet-500 hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]"
            >
              Get started for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/explore"
              className="rounded-xl border border-border px-8 py-4 text-base font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
            >
              Browse public prompts
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-6 text-sm text-muted-foreground/50">
            Free plan includes unlimited prompts · No credit card required
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
