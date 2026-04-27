import Link from "next/link";
import { Vault } from "lucide-react";

const LINKS = {
  Product: [
    ["Features", "#features"],
    ["Pricing", "#pricing"],
    ["Changelog", "/changelog"],
  ],
  Community: [
    ["Explore Prompts", "/explore"],
    ["Top Pieces", "/pieces"],
    ["Collections", "/collections"],
  ],
  Company: [
    ["About", "/about"],
    ["Blog", "/blog"],
    ["Privacy", "/privacy"],
    ["Terms", "/terms"],
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-[0_0_16px_rgba(139,92,246,0.4)]">
                <Vault className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">PromptVault</span>
            </div>
            <p className="max-w-50 text-sm leading-relaxed text-muted-foreground">
              Build prompts like code. Store, compose, and share your AI prompt system.
            </p>
          </div>

          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {category}
              </div>
              <ul className="space-y-3">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} PromptVault. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/35">
            Made for AI power users everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
