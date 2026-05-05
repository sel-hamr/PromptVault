"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

type TransitionVariant =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "rectangle"
  | "star";

function polygonCollapsed(cx: number, cy: number, n: number) {
  return `polygon(${Array.from({ length: n }, () => `${cx}px ${cy}px`).join(", ")})`;
}

function getClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  r: number,
  vw: number,
  vh: number,
): [string, string] {
  switch (variant) {
    case "circle":
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${r}px at ${cx}px ${cy}px)`,
      ];
    case "square": {
      const h = Math.max(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) * 1.05;
      const end = [
        `${cx - h}px ${cy - h}px`,
        `${cx + h}px ${cy - h}px`,
        `${cx + h}px ${cy + h}px`,
        `${cx - h}px ${cy + h}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case "triangle": {
      const s = r * 2.2;
      const dx = (Math.sqrt(3) / 2) * s;
      const pts = [
        `${cx}px ${cy - s}px`,
        `${cx + dx}px ${cy + 0.5 * s}px`,
        `${cx - dx}px ${cy + 0.5 * s}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 3), `polygon(${pts})`];
    }
    case "diamond": {
      const R = r * Math.SQRT2;
      const pts = [
        `${cx}px ${cy - R}px`,
        `${cx + R}px ${cy}px`,
        `${cx}px ${cy + R}px`,
        `${cx - R}px ${cy}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${pts})`];
    }
    case "hexagon": {
      const R = r * Math.SQRT2;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        return `${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`;
      }).join(", ");
      return [polygonCollapsed(cx, cy, 6), `polygon(${pts})`];
    }
    case "rectangle": {
      const hw = Math.max(cx, vw - cx);
      const hh = Math.max(cy, vh - cy);
      const pts = [
        `${cx - hw}px ${cy - hh}px`,
        `${cx + hw}px ${cy - hh}px`,
        `${cx + hw}px ${cy + hh}px`,
        `${cx - hw}px ${cy + hh}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${pts})`];
    }
    case "star": {
      const R = r * Math.SQRT2 * 1.03;
      const inner = 0.42;
      const star = (radius: number) => {
        const pts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const oa = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          pts.push(
            `${cx + radius * Math.cos(oa)}px ${cy + radius * Math.sin(oa)}px`,
          );
          const ia = oa + Math.PI / 5;
          pts.push(
            `${cx + radius * inner * Math.cos(ia)}px ${cy + radius * inner * Math.sin(ia)}px`,
          );
        }
        return `polygon(${pts.join(", ")})`;
      };
      return [star(Math.max(2, R * 0.025)), star(R)];
    }
    default:
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${r}px at ${cx}px ${cy}px)`,
      ];
  }
}

interface ThemeToggleProps {
  className?: string;
  duration?: number;
  variant?: TransitionVariant;
  fromCenter?: boolean;
}

export function ThemeToggle({
  className,
  duration = 600,
  variant = "circle",
  fromCenter = false,
}: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = "theme-vt-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        ::view-transition-old(root), ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        html[data-magicui-theme-vt="active"]::view-transition-group(root) {
          animation-duration: var(--magicui-theme-toggle-vt-duration);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;

    let cx: number, cy: number;
    if (fromCenter) {
      cx = vw / 2;
      cy = vh / 2;
    } else {
      const { top, left, width, height } = button.getBoundingClientRect();
      cx = left + width / 2;
      cy = top + height / 2;
    }

    const maxRadius = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy));

    const applyTheme = () => {
      const next = !isDark;
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", next ? "dark" : "light");
      setIsDark(next);
    };

    if (typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const root = document.documentElement;
    root.dataset.magicuiThemeVt = "active";
    root.style.setProperty(
      "--magicui-theme-toggle-vt-duration",
      `${duration}ms`,
    );

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });

    transition.finished.finally(() => {
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
    });

    transition.ready.then(() => {
      const [from, to] = getClipPaths(variant, cx, cy, maxRadius, vw, vh);
      document.documentElement.animate(
        { clipPath: [from, to] },
        {
          duration,
          easing: variant === "star" ? "linear" : "ease-in-out",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }, [isDark, variant, fromCenter, duration]);

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-foreground/70 hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
