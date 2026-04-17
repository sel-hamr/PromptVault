import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={cn(
          "h-11 w-full gap-2 text-[0.875rem] font-medium",
          "border-border/60 bg-background hover:bg-muted/60",
          "dark:border-border dark:bg-input/20 dark:hover:bg-input/35",
          "shadow-[0_1px_0_color-mix(in_oklab,var(--foreground)_4%,transparent)]",
          "transition-all duration-150"
        )}
      >
        <GoogleIcon className="size-4 shrink-0" />
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={cn(
          "h-11 w-full gap-2 text-[0.875rem] font-medium",
          "border-border/60 bg-background hover:bg-muted/60",
          "dark:border-border dark:bg-input/20 dark:hover:bg-input/35",
          "shadow-[0_1px_0_color-mix(in_oklab,var(--foreground)_4%,transparent)]",
          "transition-all duration-150"
        )}
      >
        <GitHubIcon className="size-4 shrink-0" />
        GitHub
      </Button>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.8 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"
      />
      <path
        fill="#4285F4"
        d="M21.8 12.3c0-.6-.1-1.1-.2-1.6H12v3.9h5.5c-.2 1.1-.9 2.1-2 2.8l3.2 2.5c1.9-1.8 3.1-4.4 3.1-7.6z"
      />
      <path
        fill="#FBBC05"
        d="M6 14.1c-.2-.6-.3-1.3-.3-2.1s.1-1.4.3-2.1L2.7 7.4C2.1 8.8 1.8 10.3 1.8 12s.3 3.2.9 4.6L6 14.1z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.6 0 4.8-.9 6.5-2.4l-3.2-2.5c-.9.6-2 .9-3.3.9-2.6 0-4.8-1.7-5.5-4.1L3.3 16c1.5 3.2 4.8 5.5 8.7 5.5z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.76 1.19 1.76 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.6.23 2.78.11 3.07.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.26 5.68.41.35.78 1.05.78 2.12v3.14c0 .31.21.68.8.56 4.57-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
