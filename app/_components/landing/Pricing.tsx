"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { fadeUp, slideLeft, slideRight, staggerContainer } from "@/lib/motion-variants";

const FREE_FEATURES = [
  "Unlimited private prompts",
  "Unlimited prompt pieces",
  "Prompt Composer",
  "Public / private / unlisted visibility",
  "Tags & full-text search",
  "Copy-to-clipboard",
  "Fork public prompts",
  "3 collections",
];

const PRO_FEATURES = [
  "Everything in Free",
  "AI-powered tag suggestions",
  "Prompt quality scoring",
  "Improvement suggestions",
  "Unlimited collections",
  "Full version history",
  "Analytics & usage stats",
  "Priority support",
  "Early access to new features",
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-muted/30 py-28">
      <div className="mx-auto max-w-5xl px-6">
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
            Pricing
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Start free.{" "}
            <span className="text-muted-foreground">
              Upgrade when you&apos;re ready.
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-md text-base text-muted-foreground"
          >
            No credit card required. The core tool is free forever.
          </motion.p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Free */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col rounded-2xl border border-border bg-card p-8"
          >
            <div className="mb-7">
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Free
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-foreground">$0</span>
                <span className="mb-1 text-sm text-muted-foreground">/ forever</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                The full prompt management experience, no strings attached.
              </p>
            </div>
            <ul className="mb-8 flex-1 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Check className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="rounded-xl border border-border py-3.5 text-center text-sm font-semibold text-foreground/70 transition-all hover:border-foreground/30 hover:text-foreground"
            >
              Get started free
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-violet-500/30 bg-violet-500/[0.04] p-8 shadow-[0_0_60px_rgba(139,92,246,0.08)]"
          >
            <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1">
              <Sparkles className="h-3 w-3 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-white">
                Most Popular
              </span>
            </div>
            <div className="mb-7">
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400">
                Pro
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-foreground">$9</span>
                <span className="mb-1 text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                AI superpowers + unlimited everything for serious prompt builders.
              </p>
            </div>
            <ul className="mb-8 flex-1 space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                    <Check className="h-3 w-3 text-violet-500 dark:text-violet-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="rounded-xl bg-violet-600 py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.35)] transition-all hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.55)]"
            >
              Start Pro free for 14 days
            </Link>
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)",
              }}
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-xs text-muted-foreground/50"
        >
          All plans include SSL, 99.9% uptime, and data export. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}
