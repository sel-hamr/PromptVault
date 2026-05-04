import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} PromptVault. All rights reserved.
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/register" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Register
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Login
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
