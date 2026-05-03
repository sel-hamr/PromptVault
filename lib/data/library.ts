import { cache } from "react";
import { unstable_cache } from "next/cache";
import { Prisma, ReferenceType } from "@prisma/client";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "./cache-tags";

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

async function _fetchReferences({
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

async function _fetchReferenceById(
  id: string,
  userId: string
): Promise<ReferenceWithRelations | null> {
  return db.reference.findFirst({
    where: { id, user_id: userId },
    include: referenceInclude,
  });
}

export const fetchReferences = cache(
  unstable_cache(_fetchReferences, ["library-list"], {
    tags: [CACHE_TAGS.library],
    revalidate: 60,
  })
);

export const fetchReferenceById = cache(
  unstable_cache(_fetchReferenceById, ["library-item"], {
    tags: [CACHE_TAGS.library],
    revalidate: 60,
  })
);
