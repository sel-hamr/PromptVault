"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Vault, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
      aria-label="Toggle theme"
    >
      <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "flex justify-center px-6 pt-4" : ""
      }`}
    >
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "flex w-full max-w-6xl items-center justify-between rounded-2xl border border-border bg-background/90 px-5 py-3 shadow-lg backdrop-blur-xl"
            : "mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 shadow-[0_0_16px_rgba(139,92,246,0.5)] transition-shadow group-hover:shadow-[0_0_24px_rgba(139,92,246,0.7)]">
            <Vault className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            PromptVault
          </span>
        </Link>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white shadow-[0_0_16px_rgba(139,92,246,0.3)] transition-all hover:bg-violet-500 hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]"
          >
            Start free
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex items-center justify-center text-muted-foreground hover:text-foreground"
            onClick={() => setOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute top-full mt-2 w-full max-w-6xl rounded-2xl border border-border bg-background/95 px-5 py-4 shadow-xl backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="text-center text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-violet-600 py-2.5 text-center text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Start free
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
