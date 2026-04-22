import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { fetchReferences } from "@/lib/data/library";
import { fetchTags } from "@/lib/data/tags";
import { Button } from "@/components/ui/button";
import { LibraryToolbar } from "./_components/library-toolbar";
import { ReferenceList } from "./_components/reference-list";

type SearchParams = {
  q?: string;
  type?: string;
  tag_slug?: string;
  page?: string;
};

type Props = { searchParams: Promise<SearchParams> };

export default async function LibraryPage({ searchParams }: Props) {
  const session = await auth();
  const userId = session!.user.id;

  const { q = "", type = "", tag_slug = "", page = "1" } = await searchParams;
  const hasFilters = !!(q || type || tag_slug);

  const [{ items, total }, tags] = await Promise.all([
    fetchReferences({
      userId,
      q: q || undefined,
      type: type || undefined,
      tag_slug: tag_slug || undefined,
      page: Number(page),
    }),
    fetchTags(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">References</h1>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "reference" : "references"}
            {hasFilters ? " matching your filters" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/library/new">
            <Plus />
            New reference
          </Link>
        </Button>
      </div>

      <LibraryToolbar tags={tags} />

      <ReferenceList references={items} hasFilters={hasFilters} />
    </div>
  );
}
