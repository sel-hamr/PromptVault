import { auth } from "@/lib/auth";
import { fetchPieces } from "@/lib/data/pieces";
import { fetchCategories } from "@/lib/data/categories";
import { fetchTags } from "@/lib/data/tags";
import { ComposeWorkbench } from "./_components/compose-workbench";

export const metadata = {
  title: "Compose - PromptVault",
};

export default async function ComposePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const [pieces, categories, tags] = await Promise.all([
    fetchPieces({ sort: "newest", take: 100 }),
    fetchCategories(),
    fetchTags(100),
  ]);

  return (
    <ComposeWorkbench
      initialPieces={pieces}
      categories={categories}
      tags={tags}
    />
  );
}
