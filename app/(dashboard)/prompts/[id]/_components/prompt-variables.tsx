import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const variableSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  default: z.string().optional(),
});

const variablesSchema = z.array(variableSchema);

interface PromptVariablesProps {
  variables: unknown;
}

export function PromptVariables({ variables }: PromptVariablesProps) {
  const parsed = variablesSchema.safeParse(variables);
  const items = parsed.success ? parsed.data : [];

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <caption className="sr-only">Prompt variables</caption>
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="pb-2 pr-4 font-medium">Name</th>
              <th className="pb-2 pr-4 font-medium">Label</th>
              <th className="pb-2 font-medium">Default</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {items.map((v) => (
              <tr key={v.name}>
                <td className="py-2 pr-4 font-mono text-xs font-medium">
                  {"{{"}
                  {v.name}
                  {"}}"}
                </td>
                <td className="py-2 pr-4 text-xs text-muted-foreground">
                  {v.label ?? <span className="italic">—</span>}
                </td>
                <td className="py-2 text-xs text-muted-foreground">
                  {v.default ?? <span className="italic">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
