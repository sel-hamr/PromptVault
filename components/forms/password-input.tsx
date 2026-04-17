"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  showStrengthHint?: boolean;
};

function PasswordStrengthHint({ value }: { value: string }) {
  const rules = [
    { label: "8+ chars", met: value.length >= 8 },
    { label: "Letter", met: /[a-zA-Z]/.test(value) },
    { label: "Number", met: /\d/.test(value) },
  ];

  if (!value) return null;

  return (
    <div className="mt-2 flex items-center gap-3">
      {rules.map((r) => (
        <span
          key={r.label}
          className={cn(
            "flex items-center gap-1 text-[0.72rem] transition-colors duration-200",
            r.met ? "text-foreground/70" : "text-muted-foreground/45"
          )}
        >
          {r.met ? (
            <Check className="size-3 text-foreground/60" strokeWidth={2.5} />
          ) : (
            <X className="size-3 text-muted-foreground/35" strokeWidth={2.5} />
          )}
          {r.label}
        </span>
      ))}
    </div>
  );
}

export function PasswordInput({ showStrengthHint = false, className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div>
      <div className="relative">
        <Input
          {...props}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            props.onChange?.(e);
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
      {showStrengthHint && <PasswordStrengthHint value={value} />}
    </div>
  );
}
