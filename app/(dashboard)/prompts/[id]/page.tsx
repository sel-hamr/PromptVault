import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getPromptAction } from "@/lib/actions/prompt.actions";
import { listCategoriesAction } from "@/lib/actions/category.actions";
import { listTagsAction } from "@/lib/actions/tag.actions";
import { Separator } from "@/components/ui/separator";
import { PromptHeader } from "./_components/prompt-header";
import { PromptActions } from "./_components/prompt-actions";
import { PromptContentBlock } from "./_components/prompt-content-block";
import { PromptStats } from "./_components/prompt-stats";
import { PromptForkedFrom } from "./_components/prompt-forked-from";
import type { Category, Tag } from "../_components/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const result = await getPromptAction({ id });
  const prompt =
    result?.data && "prompt" in result.data ? result.data.prompt : null;

  if (!prompt || prompt.visibility === "PRIVATE") {
    return { title: "Prompt — PromptVault", robots: { index: false } };
  }

  return {
    title: `${prompt.title} — PromptVault`,
    description: prompt.description ?? undefined,
  };
}

export default async function PromptDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const [result, categoriesRes, tagsRes] = await Promise.all([
    getPromptAction({ id }),
    listCategoriesAction(),
    listTagsAction({ take: 100 }),
  ]);

  const prompt =
    result?.data && "prompt" in result.data
      ? result.data.prompt
      : null;

  if (!prompt) notFound();
  if (prompt.visibility === "PRIVATE" && prompt.user_id !== userId) notFound();

  const isOwner = prompt.user_id === userId;
  const canFork = !isOwner && prompt.visibility !== "PRIVATE";

  const categories: Category[] =
    categoriesRes?.data && "categories" in categoriesRes.data
      ? categoriesRes.data.categories
      : [];

  const tags: Tag[] =
    tagsRes?.data && "tags" in tagsRes.data ? tagsRes.data.tags : [];

  const promptTags = prompt.tags ?? [];

  return (
    <div className="container max-w-7xl py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <article className="min-w-0 space-y-8">
          <PromptHeader prompt={prompt} />
          <PromptContentBlock content={prompt.content} promptId={prompt.id} />
          {/* <PromptVariables variables={prompt.variables} /> */}
          {prompt.forked_from_id && prompt.forked_from && (
            <PromptForkedFrom parent={prompt.forked_from} />
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <PromptActions
            prompt={prompt}
            isOwner={isOwner}
            canFork={canFork}
            categories={categories}
            tags={tags}
          />

          <PromptStats prompt={prompt} />

          {/* Category & Tags */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Category
              </p>
              {prompt.category ? (
                <Link
                  href={`/prompts?category=${prompt.category.slug}`}
                  className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80 hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {prompt.category.name}
                </Link>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Uncategorized
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Tags
              </p>
              {promptTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {promptTags.map(({ tag }) => (
                    <Link
                      key={tag.id}
                      href={`/prompts?tag=${tag.slug}`}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No tags</p>
              )}
            </div>
          </div>

          {/* Author */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Author
            </p>
            <p className="text-sm font-medium">{prompt.user.username}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
