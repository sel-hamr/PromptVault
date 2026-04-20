import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { fetchPrompts } from "@/lib/data/prompts";
import { fetchCategories } from "@/lib/data/categories";
import { fetchTags } from "@/lib/data/tags";
import { Button } from "@/components/ui/button";
import { PromptToolbar } from "./_components/prompt-toolbar";
import { PromptList } from "./_components/prompt-list";
import type { PromptsViewMode } from "./_components/types";

type SearchParams = {
  q?: string;
  category_id?: string;
  model_target?: string;
  visibility?: string;
  sort?: string;
  view?: string;
};

type Props = { searchParams: Promise<SearchParams> };

export default async function MyPromptsPage({ searchParams }: Props) {
  const session = await auth();
  const userId = session!.user.id;

  const { q = "", category_id = "", model_target = "", visibility = "", sort = "newest", view = "grid" } =
    await searchParams;

  const hasFilters = !!(q || category_id || model_target || visibility || sort !== "newest");

  const [prompts, categories] = await Promise.all([
    fetchPrompts({ userId, q: q || undefined, category_id: category_id || undefined, model_target: model_target || undefined, visibility: visibility || undefined, sort }),
    fetchCategories(),
    fetchTags(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">My Prompts</h1>
          <p className="text-sm text-muted-foreground">
            {prompts.length} {prompts.length === 1 ? "prompt" : "prompts"}
            {hasFilters ? " matching your filters" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/compose">
            <Plus />
            New prompt
          </Link>
        </Button>
      </div>

      <PromptToolbar categories={categories} />

      <PromptList
        prompts={prompts}
        view={view as PromptsViewMode}
        hasFilters={hasFilters}
      />
    </div>
  );
}
