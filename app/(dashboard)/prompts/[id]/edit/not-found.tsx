import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditPromptNotFound() {
  return (
    <div className="container max-w-7xl py-16 flex flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">Prompt not found</h1>
      <p className="text-muted-foreground max-w-sm">
        This prompt does not exist or you do not have permission to edit it.
      </p>
      <Button asChild variant="outline">
        <Link href="/prompts">Back to prompts</Link>
      </Button>
    </div>
  );
}
