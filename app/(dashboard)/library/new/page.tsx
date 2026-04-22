import { fetchTags } from "@/lib/data/tags";
import { ReferenceForm } from "../_components/reference-form";

export default async function NewReferencePage() {
  const tags = await fetchTags();

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">New Reference</h1>
        <p className="text-sm text-muted-foreground">
          Save a doc, pattern, skill, or decision to your personal library.
        </p>
      </div>

      <ReferenceForm tags={tags} />
    </div>
  );
}
