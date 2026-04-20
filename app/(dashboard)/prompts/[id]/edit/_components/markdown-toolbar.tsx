"use client";

import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Code2,
  Quote,
  List,
  ListOrdered,
  ListChecks,
  Link,
  Table,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { EditorState } from "@/lib/markdown";
import {
  applyHeading,
  applyBold,
  applyItalic,
  applyStrike,
  applyInlineCode,
  applyCodeBlock,
  applyQuote,
  applyBulletList,
  applyOrderedList,
  applyTaskList,
  applyLink,
  applyTable,
  applyHr,
} from "@/lib/markdown";

interface Props {
  onTransform: (fn: (s: EditorState) => EditorState) => void;
}

const groups = [
  [
    { icon: Heading1, label: "Heading 1", fn: (s: EditorState) => applyHeading(s, 1) },
    { icon: Heading2, label: "Heading 2", fn: (s: EditorState) => applyHeading(s, 2) },
    { icon: Heading3, label: "Heading 3", fn: (s: EditorState) => applyHeading(s, 3) },
  ],
  [
    { icon: Bold, label: "Bold (Ctrl+B)", fn: applyBold },
    { icon: Italic, label: "Italic (Ctrl+I)", fn: applyItalic },
    { icon: Strikethrough, label: "Strikethrough", fn: applyStrike },
  ],
  [
    { icon: Code, label: "Inline code", fn: applyInlineCode },
    { icon: Code2, label: "Code block", fn: applyCodeBlock },
    { icon: Quote, label: "Blockquote", fn: applyQuote },
  ],
  [
    { icon: List, label: "Bullet list", fn: applyBulletList },
    { icon: ListOrdered, label: "Ordered list", fn: applyOrderedList },
    { icon: ListChecks, label: "Task list", fn: applyTaskList },
  ],
  [
    { icon: Link, label: "Link (Ctrl+K)", fn: applyLink },
    { icon: Table, label: "Table", fn: applyTable },
    { icon: Minus, label: "Horizontal rule", fn: applyHr },
  ],
];

export function MarkdownToolbar({ onTransform }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-md border border-b-0 border-border bg-muted/50 px-2 py-1.5">
      {groups.map((group, gi) => (
        <span key={gi} className="flex items-center gap-0.5">
          {gi > 0 && <Separator orientation="vertical" className="mx-1 h-4" />}
          {group.map(({ icon: Icon, label, fn }) => (
            <Button
              key={label}
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              aria-label={label}
              title={label}
              onClick={() => onTransform(fn)}
            >
              <Icon className="size-3.5" aria-hidden />
            </Button>
          ))}
        </span>
      ))}
    </div>
  );
}
