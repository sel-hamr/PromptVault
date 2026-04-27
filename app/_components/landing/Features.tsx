"use client";

import { motion } from "framer-motion";
import { Puzzle, Layers, GitFork, Lock, Tag, FolderOpen } from "lucide-react";
import { fadeUp, scaleUp, staggerContainer, staggerSlow } from "@/lib/motion-variants";

const FEATURES = [
  {
    icon: Puzzle,
    label: "Prompt Pieces",
    description:
      "Create reusable building blocks — Persona, Tone, Format, Constraint, Context. Write once, compose everywhere.",
    color: "#8b5cf6",
    span: "lg:col-span-2 lg:row-span-2",
    large: true,
  },
  {
    icon: Layers,
    label: "Prompt Composer",
    description:
      "Drag, drop, and arrange pieces into complete prompts with a live preview.",
    color: "#06b6d4",
    span: "",
    large: false,
  },
  {
    icon: GitFork,
    label: "Fork & Remix",
    description:
      "Fork any public prompt into your library. Adapt it, improve it — your changes stay private.",
    color: "#10b981",
    span: "",
    large: false,
  },
  {
    icon: Lock,
    label: "Private by Default",
    description:
      "Every prompt starts private. Share what you want, keep the rest yours.",
    color: "#f59e0b",
    span: "",
    large: false,
  },
  {
    icon: Tag,
    label: "Tags & Search",
    description:
      "Full-text search across titles, content, and tags. Find any prompt instantly.",
    color: "#f43f5e",
    span: "",
    large: false,
  },
  {
    icon: FolderOpen,
    label: "Collections",
    description:
      "Curate sets of related prompts. Your SEO toolkit, interview kit, onboarding pack.",
    color: "#a78bfa",
    span: "",
    large: false,
  },
];

function FeatureCard({ feature }: { feature: (typeof FEATURES)[0] }) {
  const Icon = feature.icon;
  return (
    <motion.div
      variants={scaleUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-7 ${feature.span}`}
    >
      <div
        className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: `${feature.color}18` }}
      >
        <Icon className="h-5 w-5" style={{ color: feature.color }} />
      </div>

      <h3 className="mb-2.5 text-base font-semibold text-foreground">
        {feature.label}
      </h3>
      <p
        className={`leading-relaxed text-muted-foreground ${
          feature.large ? "text-base" : "text-sm"
        }`}
      >
        {feature.description}
      </p>

      {feature.large && (
        <div className="mt-7 rounded-xl border border-border bg-muted/30 p-4">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">
            Piece types
          </div>
          <div className="flex flex-wrap gap-2">
            {["Persona", "Tone", "Format", "Constraint", "Context", "Custom"].map((t) => (
              <span
                key={t}
                className="rounded-md px-2.5 py-1 text-xs font-medium"
                style={{
                  background: `${feature.color}14`,
                  color: `${feature.color}cc`,
                  border: `1px solid ${feature.color}22`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Corner glow on hover */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${feature.color}10, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="bg-muted/30 py-28">
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
            Core Features
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Everything you need to{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              own your prompts.
            </span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2"
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.label} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
