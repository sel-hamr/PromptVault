import { cn } from "@/lib/utils";

export function VaultMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn("size-3.5", className)}
    >
      <path
        d="M3 3h7l3 3v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="8" cy="9" r="1.6" fill="currentColor" />
      <path
        d="M8 10.6V12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BrandLogo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-foreground",
        className
      )}
    >
      <span
        aria-hidden
        className="flex size-[1.625rem] shrink-0 items-center justify-center rounded-[6px] bg-foreground text-background"
      >
        <VaultMark />
      </span>
      {!compact && (
        <span className="text-[0.9375rem] font-bold tracking-[-0.03em]">
          PromptVault
        </span>
      )}
    </span>
  );
}
