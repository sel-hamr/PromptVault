import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { fetchReferenceById } from "@/lib/data/library";
import { fetchTags } from "@/lib/data/tags";
import { ReferenceForm } from "../../_components/reference-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditReferencePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const [reference, tags] = await Promise.all([
    fetchReferenceById(id, userId),
    fetchTags(),
  ]);

  if (!reference) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Reference</h1>
        <p className="text-sm text-muted-foreground">{reference.title}</p>
      </div>

      <ReferenceForm reference={reference} tags={tags} />
    </div>
  );
}
