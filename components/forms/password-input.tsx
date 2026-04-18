"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  showStrengthHint?: boolean;
};

const STRENGTH_LEVELS = [
  { label: "Weak",   bar: "bg-destructive" },
  { label: "Weak",   bar: "bg-destructive" },
  { label: "Fair",   bar: "bg-yellow-500"  },
  { label: "Strong", bar: "bg-primary"     },
] as const;

const RULES = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "Letter",        test: (v: string) => /[a-zA-Z]/.test(v) },
  { label: "Number",        test: (v: string) => /\d/.test(v) },
];

function PasswordStrengthHint({ value }: { value: string }) {
  if (!value) return null;

  const rules = RULES.map((r) => ({ ...r, met: r.test(value) }));
  const score = rules.filter((r) => r.met).length; // 0–3
  const { label: strengthLabel, bar: barColor } = STRENGTH_LEVELS[score];

  return (
    <div className="mt-3 space-y-2">
      {/* Progress bar — 3 equal segments */}
      <div className="flex gap-1" role="meter" aria-label={`Password strength: ${strengthLabel}`}>
        {rules.map((r, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < score ? barColor : "bg-border"
            )}
          />
        ))}
      </div>

      {/* Strength label + rule dots */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {rules.map((r) => (
            <span
              key={r.label}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors duration-200",
                r.met ? "text-foreground/70" : "text-muted-foreground/50"
              )}
            >
              <span
                className={cn(
                  "inline-block size-1.5 rounded-full transition-all duration-200",
                  r.met ? barColor : "bg-muted-foreground/30"
                )}
              />
              {r.label}
            </span>
          ))}
        </div>
        <span
          className={cn(
            "text-xs font-medium tabular-nums transition-colors duration-200",
            score === 3
              ? "text-primary"
              : score === 2
              ? "text-yellow-500"
              : "text-destructive"
          )}
        >
          {strengthLabel}
        </span>
      </div>
    </div>
  );
}

// forwardRef is required so react-hook-form's register() can attach its ref
// for uncontrolled field tracking. The internal `displayValue` state is used
// only to drive the strength hint visual — it does not control the input.
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ showStrengthHint = false, className, onChange, ...props }, ref) {
    const [show, setShow] = useState(false);
    const [displayValue, setDisplayValue] = useState("");

    return (
      <div>
        <div className="relative">
          <Input
            {...props}
            ref={ref}
            type={show ? "text" : "password"}
            onChange={(e) => {
              setDisplayValue(e.target.value);
              onChange?.(e);
            }}
            className={cn(
              "h-11 pr-11 text-[0.9rem] placeholder:text-muted-foreground/50",
              "border-border/70 bg-background",
              "focus-visible:border-foreground/30 focus-visible:ring-2 focus-visible:ring-foreground/10",
              "transition-shadow duration-150",
              className
            )}
          />
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((v) => !v)}
            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-r-lg text-muted-foreground/55 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {show ? (
              <EyeOff className="size-4" strokeWidth={1.75} />
            ) : (
              <Eye className="size-4" strokeWidth={1.75} />
            )}
          </button>
        </div>
        {showStrengthHint && <PasswordStrengthHint value={displayValue} />}
      </div>
    );
  }
);
