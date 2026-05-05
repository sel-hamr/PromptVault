"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import { Vault, Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

// ─── Scroll Progress Bar ───────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left"
      style={{
        scaleX: scrollYProgress,
        opacity: scrollYProgress,
        background:
          "linear-gradient(90deg, #7c3aed, #a855f7, #6366f1, #7c3aed)",
      }}
    />
  );
}

// ─── Magnetic CTA ──────────────────────────────────────────────────────────────
function MagneticCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 18 });
  const sy = useSpring(y, { stiffness: 280, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.38);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.38);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Link
        href={href}
        className="group relative inline-flex items-center overflow-hidden rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white"
        style={{ boxShadow: "0 0 20px rgba(139,92,246,0.45)" }}
      >
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 w-[35%] -skew-x-12"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.22), transparent)",
          }}
          initial={{ x: "-140%" }}
          animate={{ x: "460%" }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            repeatDelay: 1.8,
            ease: "easeInOut",
          }}
        />
        <span className="relative flex items-center gap-1.5">
          {children}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}

// ─── Nav Links with sliding pill ──────────────────────────────────────────────
const NAV = [
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
  { label: "FAQ", href: "#faq" },
];

function NavLinks() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <nav className="hidden items-center gap-0.5 md:flex">
      {NAV.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          onMouseEnter={() => setHovered(label)}
          onMouseLeave={() => setHovered(null)}
          className="relative px-3.5 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          {hovered === label && (
            <motion.span
              layoutId="navPill"
              className="absolute inset-0 rounded-lg bg-muted/80"
              initial={false}
              transition={{ type: "spring", stiffness: 480, damping: 34 }}
            />
          )}
          <span className="relative z-10">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

// ─── Logo ──────────────────────────────────────────────────────────────────────
function Logo() {
  const [hov, setHov] = useState(false);
  const chars = "PromptVault".split("");

  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label="PromptVault home"
    >
      <div className="relative">
        <motion.div
          className="absolute -inset-0.75 rounded-[11px]"
          initial={{ opacity: 0, scale: 1 }}
          animate={
            hov
              ? { opacity: [0, 0.55, 0], scale: [1, 1.55] }
              : { opacity: 0, scale: 1 }
          }
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{ background: "rgba(139,92,246,0.45)" }}
        />
        <motion.div
          className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600"
          animate={hov ? { rotate: [0, -7, 7, 0] } : { rotate: 0 }}
          transition={{ duration: 0.45 }}
          style={{ boxShadow: "0 0 16px rgba(139,92,246,0.55)" }}
        >
          <Vault className="h-3.5 w-3.5 text-white" />
        </motion.div>
      </div>
      <span className="flex text-sm font-semibold tracking-tight text-foreground">
        {chars.map((c, i) => (
          <motion.span
            key={i}
            animate={hov ? { y: [0, -4, 0] } : { y: 0 }}
            transition={{ delay: i * 0.028, duration: 0.34, ease: "easeOut" }}
          >
            {c}
          </motion.span>
        ))}
      </span>
    </Link>
  );
}

// ─── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.18 } },
  };
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: -14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <>
      <ScrollProgress />

      <header className="fixed inset-x-0 top-0 z-50">
        {/* Background + blur overlay — fades in on scroll */}
        <motion.div
          className="absolute inset-0 bg-background/90 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Main row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set(e.clientX - r.left);
            my.set(e.clientY - r.top);
          }}
          className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        >
          {/* Cursor spotlight */}
          <motion.div className="pointer-events-none absolute inset-0" />

          <motion.div variants={fadeUp} className="relative z-10">
            <Logo />
          </motion.div>

          {/* Desktop right */}
          <motion.div
            variants={fadeUp}
            className="relative z-10 hidden items-center gap-3 md:flex"
          >
            <ThemeToggle />
            <Link
              href="/login"
              className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
              <span className="absolute -bottom-0.5 left-0 h-px w-0 rounded-full bg-foreground/50 transition-all duration-200 group-hover:w-full" />
            </Link>
            <MagneticCTA href="/register">Start free</MagneticCTA>
          </motion.div>

          {/* Mobile toggle */}
          <motion.div
            variants={fadeUp}
            className="relative z-10 flex items-center gap-2 md:hidden"
          >
            <ThemeToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:text-foreground"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden"
            >
              <nav className="flex flex-col gap-1 px-6 py-4">
                {NAV.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  >
                    {label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border/40" />
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-xl bg-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Start free
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
