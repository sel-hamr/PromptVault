import { fetchCategories } from "@/lib/data/categories";
import { fetchExplorePrompts } from "@/lib/data/explore-prompts";
import { ExploreList } from "@/app/(dashboard)/explore/_components/explore-list";
import { ExploreToolbar } from "@/app/(dashboard)/explore/_components/explore-toolbar";
import type {
  ExploreSortOption,
  ExploreViewMode,
} from "@/app/(dashboard)/explore/_components/types";

type SearchParams = {
  q?: string;
  category_id?: string;
  model_target?: string;
  visibility?: string;
  sort?: string;
  view?: string;
};

type Props = { searchParams: Promise<SearchParams> };

export const metadata = {
  title: "Explore - PromptVault",
};

export default async function ExplorePage({ searchParams }: Props) {
  const {
    q = "",
    category_id = "",
    model_target = "",
    visibility = "PUBLIC",
    sort = "newest",
    view = "grid",
  } = await searchParams;

  const hasFilters =
    q.trim() !== "" ||
    category_id !== "" ||
    model_target !== "" ||
    visibility !== "PUBLIC" ||
    sort !== "newest";

  const [prompts, categories] = await Promise.all([
    fetchExplorePrompts({
      q: q || undefined,
      category_id: category_id || undefined,
      model_target: model_target || undefined,
      visibility,
      sort: sort as ExploreSortOption,
    }),
    fetchCategories(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Explore Prompts
        </h1>
        <p className="text-sm text-muted-foreground">
          {prompts.length} {prompts.length === 1 ? "prompt" : "prompts"}
          {hasFilters ? " matching your filters" : " from the community"}
        </p>
      </div>

      <ExploreToolbar categories={categories} />

      <ExploreList
        prompts={prompts}
        view={view as ExploreViewMode}
        hasFilters={hasFilters}
      />
    </div>
  );
}
