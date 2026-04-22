export const TYPE_OPTIONS = [
  { value: "DOC", label: "Doc" },
  { value: "SKILL", label: "Skill" },
  { value: "AGENT", label: "Agent" },
  { value: "PATTERN", label: "Pattern" },
  { value: "DECISION", label: "Decision" },
] as const;

export type ReferenceTypeOption = (typeof TYPE_OPTIONS)[number]["value"];

export const TYPE_LABELS = Object.fromEntries(
  TYPE_OPTIONS.map((o) => [o.value, o.label])
) as Record<ReferenceTypeOption, string>;
