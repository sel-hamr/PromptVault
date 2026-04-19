import { auth } from "@/lib/auth";
import { listPromptsAction } from "@/lib/actions/prompt.actions";
import { listCategoriesAction } from "@/lib/actions/category.actions";
import { listTagsAction } from "@/lib/actions/tag.actions";
import { PromptsExplorer } from "./_components/prompts-explorer";
import type {
  Category,
  PromptWithRelations,
  Tag,
} from "./_components/types";

export default async function MyPromptsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [promptsRes, categoriesRes, tagsRes] = await Promise.all([
    listPromptsAction({ user_id: userId, sort: "newest", take: 50 }),
    listCategoriesAction(),
    listTagsAction({ take: 100 }),
  ]);

  const initialPrompts: PromptWithRelations[] =
    promptsRes?.data && "prompts" in promptsRes.data
      ? (promptsRes.data.prompts as PromptWithRelations[])
      : [];

  const categories: Category[] =
    categoriesRes?.data && "categories" in categoriesRes.data
      ? (categoriesRes.data.categories as Category[])
      : [];

  const tags: Tag[] =
    tagsRes?.data && "tags" in tagsRes.data
      ? (tagsRes.data.tags as Tag[])
      : [];

  return (
    <PromptsExplorer
      userId={userId}
      initialPrompts={initialPrompts}
      categories={categories}
      tags={tags}
    />
  );
}
