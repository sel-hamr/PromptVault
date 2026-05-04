import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  danger?: boolean;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
  danger,
}: SettingsSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-card p-6",
        danger ? "border-destructive/30" : "border-border",
        className
      )}
    >
      <div className="mb-5">
        <h2
          className={cn(
            "text-sm font-semibold",
            danger ? "text-destructive" : "text-foreground"
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
