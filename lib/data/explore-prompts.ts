import { ModelTarget, Prisma, Visibility } from "@prisma/client";
import { db } from "@/lib/db";

type ExploreSortOption =
  | "newest"
  | "oldest"
  | "top_rated"
  | "most_forked"
  | "most_used";

type FetchExplorePromptsArgs = {
  q?: string;
  category_id?: string;
  model_target?: string;
  visibility?: string;
  sort?: ExploreSortOption;
  take?: number;
};

const isModelTarget = (value: string): value is ModelTarget =>
  Object.values(ModelTarget).includes(value as ModelTarget);

const isVisibility = (value: string): value is Visibility =>
  Object.values(Visibility).includes(value as Visibility);

function resolveExploreVisibility(value?: string): Visibility {
  if (!value || !isVisibility(value)) return Visibility.PUBLIC;
  if (value === Visibility.PRIVATE) return Visibility.PUBLIC;
  return value;
}

const promptInclude = {
  user: { select: { id: true, username: true } },
  category: true,
  tags: { include: { tag: true } },
} satisfies Prisma.PromptInclude;

export type ExplorePromptWithRelations = Prisma.PromptGetPayload<{
  include: typeof promptInclude;
}>;

export async function fetchExplorePrompts({
  q,
  category_id,
  model_target,
  visibility,
  sort = "newest",
  take = 60,
}: FetchExplorePromptsArgs): Promise<ExplorePromptWithRelations[]> {
  const where: Prisma.PromptWhereInput = {
    visibility: resolveExploreVisibility(visibility),
    ...(category_id ? { category_id } : {}),
    ...(model_target && isModelTarget(model_target) ? { model_target } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.PromptOrderByWithRelationInput =
    sort === "oldest"
      ? { created_at: "asc" }
      : sort === "top_rated"
        ? { avg_rating: "desc" }
        : sort === "most_forked"
          ? { fork_count: "desc" }
          : sort === "most_used"
            ? { use_count: "desc" }
            : { created_at: "desc" };

  return db.prompt.findMany({ where, orderBy, take, include: promptInclude });
}
