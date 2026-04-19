import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PromptNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <FileQuestion className="size-12 text-muted-foreground" aria-hidden />
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Prompt not found</h1>
        <p className="text-sm text-muted-foreground">
          This prompt doesn&rsquo;t exist or you don&rsquo;t have access to it.
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/prompts">Back to prompts</Link>
      </Button>
    </div>
  );
}
