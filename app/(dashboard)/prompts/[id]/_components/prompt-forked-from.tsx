import Link from "next/link";
import { GitFork } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ForkedFromParent {
  id: string;
  title: string;
  user: { id: string; username: string };
}

interface PromptForkedFromProps {
  parent: ForkedFromParent;
}

export function PromptForkedFrom({ parent }: PromptForkedFromProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <GitFork
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <div className="min-w-0 text-sm">
          <span className="text-muted-foreground">Forked from </span>
          <Link
            href={`/prompts/${parent.id}`}
            className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            {parent.title}
          </Link>
          <span className="text-muted-foreground">
            {" "}
            by {parent.user.username}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
