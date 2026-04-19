import type { listPromptsAction } from "@/lib/actions/prompt.actions";
import type { listCategoriesAction } from "@/lib/actions/category.actions";
import type { listTagsAction } from "@/lib/actions/tag.actions";

type ListPromptsResult = NonNullable<
  Awaited<ReturnType<typeof listPromptsAction>>
>["data"];

export type PromptWithRelations = NonNullable<
  NonNullable<ListPromptsResult>["prompts"]
>[number];

type ListCategoriesResult = NonNullable<
  Awaited<ReturnType<typeof listCategoriesAction>>
>["data"];

export type Category = NonNullable<
  NonNullable<ListCategoriesResult>["categories"]
>[number];

type ListTagsResult = NonNullable<
  Awaited<ReturnType<typeof listTagsAction>>
>["data"];

export type Tag = NonNullable<NonNullable<ListTagsResult>["tags"]>[number];

export type SortOption =
  | "newest"
  | "oldest"
  | "top_rated"
  | "most_forked"
  | "most_used";

export type ModelTarget =
  | "CHATGPT"
  | "CLAUDE"
  | "MIDJOURNEY"
  | "GEMINI"
  | "DALLE"
  | "STABLE_DIFFUSION"
  | "UNIVERSAL";

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

export type PromptsViewMode = "grid" | "list";

export interface FilterState {
  q: string;
  category_id: string;
  model_target: ModelTarget | "";
  visibility: Visibility | "";
  sort: SortOption;
  view: PromptsViewMode;
}
