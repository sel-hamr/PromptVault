"use client";

import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Mail, Clock, MessageSquare, Send } from "lucide-react";

import { contactFormSchema, type ContactFormInput } from "@/lib/validators";
import { sendContactEmailAction } from "@/lib/actions/contact.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { fadeUp, scaleUp, staggerContainer, staggerSlow } from "@/lib/motion-variants";
import { cn } from "@/lib/utils";

const INFO_CARDS = [
  {
    icon: Mail,
    label: "Email",
    value: "selhamr9@gmail.com",
    color: "#8b5cf6",
    colorRgb: "139,92,246",
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within 24 hours",
    color: "#06b6d4",
    colorRgb: "6,182,212",
  },
  {
    icon: MessageSquare,
    label: "Support",
    value: "Feature requests welcome",
    color: "#10b981",
    colorRgb: "16,185,129",
  },
];

export default function Contact() {
  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const { execute, isPending } = useAction(sendContactEmailAction, {
    onSuccess: ({ data }) => {
      if (data && "success" in data && data.success) {
        toast.success("Message sent! I'll get back to you soon.");
        form.reset();
      }
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <section id="contact" className="relative overflow-hidden bg-background py-28">
      {/* Background glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 110%, rgba(139,92,246,0.13) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 10% 20%, rgba(6,182,212,0.07) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.07) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 30% at 50% 0%, var(--background) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-sm font-semibold text-violet-500 dark:text-violet-300"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Contact
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Have a question?{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 35%, #06b6d4 75%, #22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Let&rsquo;s talk.
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-lg text-base text-muted-foreground"
          >
            Send a message and I&rsquo;ll get back to you as soon as possible.
          </motion.p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
          {/* Left — info cards */}
          <motion.div
            variants={staggerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-4"
          >
            {INFO_CARDS.map((card) => (
              <motion.div
                key={card.label}
                variants={fadeUp}
                whileHover={{
                  y: -4,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-lg"
                style={{
                  boxShadow: `0 1px 3px rgba(0,0,0,0.08)`,
                }}
              >
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `rgba(${card.colorRgb},0.12)`,
                    border: `1px solid rgba(${card.colorRgb},0.2)`,
                  }}
                >
                  <card.icon
                    className="h-5 w-5"
                    style={{ color: card.color }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: card.color }}
                  >
                    {card.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {card.value}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Decorative quote */}
            <motion.div
              variants={fadeUp}
              className="mt-2 rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;Whether it&rsquo;s a bug, a feature idea, or just to say hi — I read every message.&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
                <span className="text-xs font-semibold text-foreground">
                  PromptVault Team
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — form card */}
          <motion.div
            variants={scaleUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 shadow-xl"
              style={{
                boxShadow:
                  "0 4px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Subtle inner glow top-right */}
              <div
                className="pointer-events-none absolute right-0 top-0 h-48 w-48 opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 100% 0%, rgba(139,92,246,0.18), transparent 70%)",
                }}
                aria-hidden="true"
              />

              <form
                className="relative grid gap-5"
                noValidate
                onSubmit={(e) => void form.handleSubmit((v) => execute(v))(e)}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="contact-name"
                    label="Name"
                    placeholder="Your name"
                    error={form.formState.errors.name?.message}
                    registration={form.register("name")}
                  />
                  <Field
                    id="contact-email"
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    error={form.formState.errors.email?.message}
                    registration={form.register("email")}
                  />
                </div>

                <Field
                  id="contact-subject"
                  label="Subject"
                  placeholder="What's this about?"
                  error={form.formState.errors.subject?.message}
                  registration={form.register("subject")}
                />

                <div className="grid gap-1.5">
                  <Label
                    htmlFor="contact-message"
                    className="text-[0.8375rem] font-medium"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Tell me what's on your mind..."
                    className={cn(
                      "resize-none text-[0.9rem] placeholder:text-muted-foreground/40",
                      "border-border/60 bg-background/70",
                      "focus-visible:border-violet-500/40 focus-visible:ring-2 focus-visible:ring-violet-500/15",
                      "transition-all duration-200",
                      form.formState.errors.message && "border-destructive",
                    )}
                    {...form.register("message")}
                  />
                  {form.formState.errors.message && (
                    <p className="text-[0.775rem] text-destructive">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className={cn(
                    "group relative mt-1 flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl",
                    "bg-violet-600 text-sm font-semibold text-white",
                    "shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_4px_24px_rgba(139,92,246,0.35)]",
                    "transition-all duration-300",
                    "hover:bg-violet-500 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.7),0_8px_40px_rgba(139,92,246,0.55)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
                  {/* Shimmer sweep */}
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/12 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                    aria-hidden="true"
                  />
                  {isPending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Field helper ─────────────────────────────────────────────── */
function Field({
  id,
  label,
  placeholder,
  type = "text",
  autoComplete,
  error,
  registration,
}: {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm<ContactFormInput>>["register"]>;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-[0.8375rem] font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={cn(
          "h-11 text-[0.9rem] placeholder:text-muted-foreground/40",
          "border-border/60 bg-background/70",
          "focus-visible:border-violet-500/40 focus-visible:ring-2 focus-visible:ring-violet-500/15",
          "transition-all duration-200",
          error && "border-destructive",
        )}
        {...registration}
      />
      {error && (
        <p className="text-[0.775rem] text-destructive">{error}</p>
      )}
    </div>
  );
}
