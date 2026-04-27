"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion-variants";

const LIBRARY_PIECES = [
  {
    id: "p1",
    type: "Persona",
    label: "Expert Marketer",
    content: "Act as a senior marketing strategist with 15 years of B2B SaaS experience.",
    color: "#8b5cf6",
  },
  {
    id: "p2",
    type: "Tone",
    label: "Professional",
    content: "Use a professional, confident tone. Be direct and authoritative.",
    color: "#06b6d4",
  },
  {
    id: "p3",
    type: "Format",
    label: "Bullet Points",
    content: "Structure your response as numbered bullet points with concise language.",
    color: "#10b981",
  },
  {
    id: "p4",
    type: "Constraint",
    label: "Be Concise",
    content: "Keep the total response under 150 words. Avoid filler phrases.",
    color: "#f59e0b",
  },
  {
    id: "p5",
    type: "Context",
    label: "SaaS Product",
    content: "The product is a B2B SaaS tool targeting small business owners in the US.",
    color: "#f43f5e",
  },
  {
    id: "p6",
    type: "Custom",
    label: "Call to Action",
    content: "End with a single, clear call to action that creates urgency.",
    color: "#a78bfa",
  },
];

export default function Demo() {
  const [canvas, setCanvas] = useState<typeof LIBRARY_PIECES>([]);

  const addPiece = (piece: (typeof LIBRARY_PIECES)[0]) => {
    if (!canvas.find((p) => p.id === piece.id)) {
      setCanvas((prev) => [...prev, piece]);
    }
  };

  const removePiece = (id: string) => {
    setCanvas((prev) => prev.filter((p) => p.id !== id));
  };

  const assembledPrompt = canvas.map((p) => p.content).join("\n\n");

  return (
    <section id="demo" className="bg-background py-28">
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
            Interactive Demo
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Compose prompts{" "}
            <span className="text-muted-foreground">in seconds.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-md text-base text-muted-foreground"
          >
            Click the{" "}
            <span className="font-medium text-violet-500 dark:text-violet-400">+ button</span> to
            add pieces to your canvas and watch the prompt assemble live.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-5 py-3.5">
            <div className="h-3 w-3 rounded-full bg-red-500/50" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
            <span className="ml-3 text-xs text-muted-foreground/50">
              PromptVault — Composer
            </span>
          </div>

          <div className="grid grid-cols-1 divide-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {/* Panel 1: Library */}
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Piece Library
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground/60">
                  {LIBRARY_PIECES.length} pieces
                </span>
              </div>
              <div className="space-y-2">
                {LIBRARY_PIECES.map((piece) => {
                  const added = canvas.some((p) => p.id === piece.id);
                  return (
                    <motion.div
                      key={piece.id}
                      layout
                      className={`group flex items-start gap-2.5 rounded-xl border p-3 transition-all ${
                        added
                          ? "border-border/50 bg-muted/20 opacity-40"
                          : "cursor-pointer border-border bg-background hover:bg-muted/50"
                      }`}
                      onClick={() => !added && addPiece(piece)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center gap-1.5">
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: piece.color }}
                          />
                          <span
                            className="text-[9px] font-semibold uppercase tracking-wider"
                            style={{ color: piece.color }}
                          >
                            {piece.type}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-foreground">
                          {piece.label}
                        </p>
                      </div>
                      {!added && (
                        <button className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-violet-500/30">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Panel 2: Canvas */}
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Canvas
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground/60">
                  {canvas.length} pieces
                </span>
              </div>
              <div className="min-h-70">
                {canvas.length === 0 ? (
                  <div className="flex h-70 flex-col items-center justify-center rounded-xl border border-dashed border-border text-center">
                    <div className="mb-2 text-2xl opacity-30">🧩</div>
                    <p className="text-xs text-muted-foreground/50">
                      Click pieces to add them here
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    <div className="space-y-2">
                      {canvas.map((piece) => (
                        <motion.div
                          key={piece.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.85, y: 8 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="group flex items-start gap-2 rounded-xl border border-border bg-background p-3"
                        >
                          <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/30" />
                          <div className="flex-1 min-w-0">
                            <div className="mb-1 flex items-center gap-1.5">
                              <div
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ background: piece.color }}
                              />
                              <span
                                className="text-[9px] font-semibold uppercase tracking-wider"
                                style={{ color: piece.color }}
                              >
                                {piece.type}
                              </span>
                            </div>
                            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {piece.content}
                            </p>
                          </div>
                          <button
                            onClick={() => removePiece(piece.id)}
                            className="shrink-0 rounded-md p-1 text-muted-foreground/30 opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-muted-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Panel 3: Preview */}
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Prompt Preview
                </span>
                {canvas.length > 0 && (
                  <button className="rounded-md bg-violet-500/15 px-2.5 py-1 text-[10px] font-medium text-violet-500 hover:bg-violet-500/25 transition-colors">
                    Copy
                  </button>
                )}
              </div>
              <div className="min-h-70 rounded-xl border border-border bg-muted/20 p-4">
                {canvas.length === 0 ? (
                  <div className="flex h-63 flex-col items-center justify-center text-center">
                    <p className="text-xs text-muted-foreground/40">
                      Your assembled prompt will appear here
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={assembledPrompt}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {canvas.map((piece) => (
                        <div key={piece.id}>
                          <p className="text-[11px] leading-relaxed text-muted-foreground">
                            {piece.content}
                          </p>
                          <div className="mt-2 h-px bg-border/50" />
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
              {canvas.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground/40">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
                  {canvas.length} piece{canvas.length !== 1 ? "s" : ""} ·{" "}
                  {assembledPrompt.split(" ").length} words
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
