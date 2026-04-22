"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import { incrementSnippetCopyAction } from "@/lib/actions/library.actions";

interface SnippetCopyButtonProps {
  snippetId: string;
  value: string;
}

export function SnippetCopyButton({ snippetId, value }: SnippetCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { execute } = useAction(incrementSnippetCopyAction);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    execute({ id: snippetId });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy snippet">
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  );
}
