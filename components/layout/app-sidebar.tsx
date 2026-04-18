"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "./vault-mark";
import { NAV_GROUPS, FOOTER_NAV, type NavItem } from "./nav-config";
import { ROUTES } from "@/constants/routes";

type AppSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
};

function initials(name?: string | null, email?: string | null) {
  const src = (name ?? email ?? "U").trim();
  const parts = src.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "U";
}

function isActive(pathname: string, href: string) {
  if (href === ROUTES.dashboard) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[0.8125rem] font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/60",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-sidebar-primary"
        />
      )}
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          active
            ? "text-sidebar-foreground"
            : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
        )}
        strokeWidth={2}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="rounded-full bg-sidebar-primary/10 px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-wide text-sidebar-primary">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function AppSidebar({ mobileOpen, onMobileClose, user }: AppSidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link
          href={ROUTES.dashboard}
          onClick={onMobileClose}
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/60"
          aria-label="PromptVault — dashboard"
        >
          <BrandLogo />
        </Link>
        <button
          type="button"
          onClick={onMobileClose}
          aria-label="Close menu"
          className="inline-flex size-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="border-b border-sidebar-border p-3">
        <Button
          asChild
          size="sm"
          className="h-9 w-full gap-1.5 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
        >
          <Link href={ROUTES.compose} onClick={onMobileClose}>
            <Plus className="size-4" strokeWidth={2.4} />
            New prompt
          </Link>
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <p className="mb-1.5 px-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-sidebar-foreground/40">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    active={isActive(pathname, item.href)}
                    onNavigate={onMobileClose}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <ul className="mb-2 space-y-0.5">
          {FOOTER_NAV.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                active={isActive(pathname, item.href)}
                onNavigate={onMobileClose}
              />
            </li>
          ))}
        </ul>
        <Link
          href={ROUTES.settings}
          onClick={onMobileClose}
          aria-label="Account"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2 py-2 transition-colors",
            "hover:bg-sidebar-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/60"
          )}
        >
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-foreground text-[0.6875rem] font-semibold text-sidebar"
          >
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              initials(user?.name, user?.email)
            )}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[0.8125rem] font-medium text-sidebar-foreground">
              {user?.name ?? "Account"}
            </span>
            {user?.email && (
              <span className="truncate text-[0.6875rem] text-sidebar-foreground/60">
                {user.email}
              </span>
            )}
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col",
          "border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
        )}
      >
        {content}
      </aside>

      {/* Mobile overlay */}
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={onMobileClose}
      />
      <aside
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
}
