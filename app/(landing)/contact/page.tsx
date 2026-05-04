import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ContactForm } from "./_components/contact-form";

export const metadata: Metadata = {
  title: "Contact — PromptVault",
  description: "Get in touch with the PromptVault team.",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 90% 80%, rgba(6,182,212,0.07) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.06) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl px-6 py-24">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-sm font-semibold text-violet-500 dark:text-violet-300">
            Contact
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Get in{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 35%, #06b6d4 75%, #22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              touch
            </span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Have a question, idea, or feedback? Fill out the form and I&rsquo;ll
            get back to you within 24 hours.
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 shadow-xl"
          style={{
            boxShadow:
              "0 4px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Inner glow */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-48 w-48 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 100% 0%, rgba(139,92,246,0.18), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
