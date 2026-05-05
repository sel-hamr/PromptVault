import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "./cache-tags";

type FetchPiecesArgs = {
  userId?: string;
  piece_type?: string;
  visibility?: string;
  q?: string;
  sort?: string;
  take?: number;
};

const pieceInclude = {
  user: { select: { id: true, username: true } },
} satisfies Prisma.PromptPieceInclude;

export type PieceWithRelations = Prisma.PromptPieceGetPayload<{
  include: typeof pieceInclude;
}>;

async function _fetchPieces({
  userId,
  piece_type,
  visibility,
  q,
  sort = "newest",
  take = 100,
}: FetchPiecesArgs): Promise<PieceWithRelations[]> {
  const where: Prisma.PromptPieceWhereInput = {
    ...(userId ? { user_id: userId } : {}),
    ...(visibility ? { visibility } : {}),
    ...(piece_type ? { piece_type } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.PromptPieceOrderByWithRelationInput =
    sort === "oldest"
      ? { created_at: "asc" }
      : sort === "updated"
        ? { updated_at: "desc" }
        : sort === "most_used"
          ? { use_count: "desc" }
          : sort === "title_asc"
            ? { title: "asc" }
            : sort === "title_desc"
              ? { title: "desc" }
              : { created_at: "desc" };

  return db.promptPiece.findMany({ where, orderBy, take, include: pieceInclude });
}

export const fetchPieces = unstable_cache(_fetchPieces, ["pieces-list"], {
  tags: [CACHE_TAGS.pieces],
  revalidate: 60,
});
