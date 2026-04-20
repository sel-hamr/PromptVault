import type { fetchCategories } from "@/lib/data/categories";
import type { ExplorePromptWithRelations } from "@/lib/data/explore-prompts";

export type PromptWithRelations = ExplorePromptWithRelations;

export type Category = Awaited<ReturnType<typeof fetchCategories>>[number];

export type ExploreSortOption =
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

export type ExploreVisibility = "PUBLIC" | "UNLISTED";

export type ExploreViewMode = "grid" | "list";
