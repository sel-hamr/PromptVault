import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPromptAction } from "@/lib/actions/prompt.actions";
import { listCategoriesAction } from "@/lib/actions/category.actions";
import { listTagsAction } from "@/lib/actions/tag.actions";
import { listPiecesAction } from "@/lib/actions/piece.actions";
import { PromptEditForm } from "./_components/prompt-edit-form";
import type { PromptDetail } from "../_components/types";
import type { Category, Tag } from "../../_components/types";
import type { EditPiece } from "./_components/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const result = await getPromptAction({ id });
  const prompt = result?.data && "prompt" in result.data ? result.data.prompt : null;
  return {
    title: prompt ? `Edit: ${prompt.title} — PromptVault` : "Edit prompt — PromptVault",
    robots: { index: false },
  };
}

export default async function EditPromptPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id!;

  const [promptRes, categoriesRes, tagsRes, piecesRes] = await Promise.all([
    getPromptAction({ id }),
    listCategoriesAction(),
    listTagsAction({ take: 100 }),
    listPiecesAction({ user_id: userId, take: 50 }),
  ]);

  const prompt =
    promptRes?.data && "prompt" in promptRes.data
      ? (promptRes.data.prompt as PromptDetail)
      : null;

  if (!prompt || prompt.user_id !== userId) notFound();

  const categories: Category[] =
    categoriesRes?.data && "categories" in categoriesRes.data
      ? (categoriesRes.data.categories as Category[])
      : [];

  const tags: Tag[] =
    tagsRes?.data && "tags" in tagsRes.data ? (tagsRes.data.tags as Tag[]) : [];

  const initialPieces: EditPiece[] =
    piecesRes?.data && "pieces" in piecesRes.data
      ? (piecesRes.data.pieces as EditPiece[])
      : [];

  return (
    <PromptEditForm
      prompt={prompt}
      categories={categories}
      tags={tags}
      initialPieces={initialPieces}
    />
  );
}
