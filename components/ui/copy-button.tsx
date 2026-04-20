"use client";

import { useState, type MouseEvent } from "react";
import { ClipboardCheck, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
}

export function CopyButton({
  value,
  successMessage = "Copied!",
  errorMessage = "Failed to copy",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(successMessage);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error(errorMessage);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Copy to clipboard"
      onClick={handleCopy}
      className={cn(copied && "text-primary", className)}
    >
      {copied ? <ClipboardCheck /> : <Copy />}
    </Button>
  );
}
