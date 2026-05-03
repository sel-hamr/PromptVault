"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeUp, scaleUp, staggerContainer, staggerSlow } from "@/lib/motion-variants";

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Indie hacker & AI builder",
    avatar: "AR",
    avatarColor: "#8b5cf6",
    quote:
      "I used 4 different apps to manage my prompts. PromptVault replaced all of them. The Composer is genuinely magic.",
    stars: 5,
  },
  {
    name: "Sarah Chen",
    role: "Content strategist @ Vercel",
    avatar: "SC",
    avatarColor: "#06b6d4",
    quote:
      "The concept of 'prompt pieces' changed how I think about AI workflows. I have a tone piece that I reuse in every single prompt.",
    stars: 5,
  },
  {
    name: "Marcus Webb",
    role: "Freelance developer",
    avatar: "MW",
    avatarColor: "#10b981",
    quote:
      "Forked a great code-review prompt from the community and customized it for TypeScript. Saved me hours.",
    stars: 5,
  },
  {
    name: "Priya Nair",
    role: "Marketing lead @ early-stage startup",
    avatar: "PN",
    avatarColor: "#f59e0b",
    quote:
      "We shared brand voice pieces with our whole team. Everyone's outputs are consistent now. Can't believe this didn't exist before.",
    stars: 5,
  },
  {
    name: "Tom Okafor",
    role: "PhD student, AI research",
    avatar: "TO",
    avatarColor: "#f43f5e",
    quote:
      "Version history alone is worth it. I can see exactly how my research prompts evolved over 6 months of iteration.",
    stars: 5,
  },
  {
    name: "Lena Müller",
    role: "UX writer & educator",
    avatar: "LM",
    avatarColor: "#a78bfa",
    quote:
      "Private by default was a dealbreaker for me with other tools. My prompt work is sensitive — I need full control over what I share.",
    stars: 5,
  },
];

export default function Testimonials() {
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
            className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400"
          >
            Social Proof
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Loved by{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI power users.
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-md text-base text-muted-foreground"
          >
            Join hundreds of developers, marketers, and creators who&apos;ve taken
            control of their prompt workflows.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={scaleUp}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{
                    background: `${t.avatarColor}35`,
                    border: `1px solid ${t.avatarColor}30`,
                    color: t.avatarColor,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
