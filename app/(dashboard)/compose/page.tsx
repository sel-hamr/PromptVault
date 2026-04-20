import { auth } from "@/lib/auth";
import { listPiecesAction } from "@/lib/actions/piece.actions";
import { listCategoriesAction } from "@/lib/actions/category.actions";
import { listTagsAction } from "@/lib/actions/tag.actions";
import type { Category, Tag } from "../prompts/_components/types";
import { ComposeWorkbench } from "./_components/compose-workbench";

interface ComposePiece {
  id: string;
  title: string;
  content: string;
  piece_type: string;
}

export const metadata = {
  title: "Compose - PromptVault",
};

export default async function ComposePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const [piecesRes, categoriesRes, tagsRes] = await Promise.all([
    listPiecesAction({ take: 100, sort: "newest" }),
    listCategoriesAction(),
    listTagsAction({ take: 100 }),
  ]);

  const initialPieces: ComposePiece[] =
    piecesRes?.data && "pieces" in piecesRes.data
      ? piecesRes.data.pieces
      : [];

  const categories: Category[] =
    categoriesRes?.data && "categories" in categoriesRes.data
      ? categoriesRes.data.categories
      : [];

  const tags: Tag[] =
    tagsRes?.data && "tags" in tagsRes.data ? tagsRes.data.tags : [];

  return (
    <ComposeWorkbench
      initialPieces={initialPieces}
      categories={categories}
      tags={tags}
    />
  );
}
