"use client";

import { useDeferredValue, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { extractVariables } from "@/lib/markdown";

interface Props {
  content: string;
}

export function VariablesList({ content }: Props) {
  const deferred = useDeferredValue(content);
  const vars = useMemo(() => extractVariables(deferred), [deferred]);

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Detected variables
      </p>
      {vars.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {vars.map((v) => (
            <Badge key={v} variant="outline" className="font-mono text-xs">
              {"{{"}{v}{"}}"}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          Use {"{{variableName}}"} in content to define variables
        </p>
      )}
    </div>
  );
}
