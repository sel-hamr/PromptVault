import { ModelTarget, Prisma, Visibility } from "@prisma/client";
import { db } from "@/lib/db";

type FetchPromptsArgs = {
  userId?: string;
  q?: string;
  category_id?: string;
  model_target?: string;
  visibility?: string;
  sort?: string;
  take?: number;
};

const isModelTarget = (value: string): value is ModelTarget =>
  Object.values(ModelTarget).includes(value as ModelTarget);

const isVisibility = (value: string): value is Visibility =>
  Object.values(Visibility).includes(value as Visibility);

const promptInclude = {
  user: { select: { id: true, username: true } },
  category: true,
  tags: { include: { tag: true } },
} satisfies Prisma.PromptInclude;

export type PromptWithRelations = Prisma.PromptGetPayload<{
  include: typeof promptInclude;
}>;

export async function fetchPrompts({
  userId,
  q,
  category_id,
  model_target,
  visibility,
  sort = "newest",
  take = 50,
}: FetchPromptsArgs): Promise<PromptWithRelations[]> {
  const where: Prisma.PromptWhereInput = {
    ...(userId ? { user_id: userId } : {}),
    ...(category_id ? { category_id } : {}),
    ...(model_target && isModelTarget(model_target) ? { model_target } : {}),
    ...(visibility && isVisibility(visibility) ? { visibility } : {}),
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
