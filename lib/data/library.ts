import { Prisma, ReferenceType } from "@prisma/client";
import { db } from "@/lib/db";

const referenceInclude = {
  tags: { include: { tag: true } },
  snippets: { orderBy: { order: "asc" as const } },
} satisfies Prisma.ReferenceInclude;

export type ReferenceWithRelations = Prisma.ReferenceGetPayload<{
  include: typeof referenceInclude;
}>;

type FetchReferencesArgs = {
  userId: string;
  q?: string;
  type?: string;
  tag_slug?: string;
  page?: number;
  take?: number;
};

const isReferenceType = (value: string): value is ReferenceType =>
  Object.values(ReferenceType).includes(value as ReferenceType);

export async function fetchReferences({
  userId,
  q,
  type,
  tag_slug,
  page = 1,
  take = 20,
}: FetchReferencesArgs): Promise<{ items: ReferenceWithRelations[]; total: number }> {
  const where: Prisma.ReferenceWhereInput = {
    user_id: userId,
    ...(type && isReferenceType(type) ? { type } : {}),
    ...(tag_slug ? { tags: { some: { tag: { slug: tag_slug } } } } : {}),
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

  const [items, total] = await Promise.all([
    db.reference.findMany({
      where,
      include: referenceInclude,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * take,
      take,
    }),
    db.reference.count({ where }),
  ]);

  return { items, total };
}

export async function fetchReferenceById(
  id: string,
  userId: string
): Promise<ReferenceWithRelations | null> {
  return db.reference.findFirst({
    where: { id, user_id: userId },
    include: referenceInclude,
  });
}
