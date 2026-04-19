export type EditorState = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export type Token = { text: string; className: string };

function wrapSelection(
  state: EditorState,
  before: string,
  after: string = before,
): EditorState {
  const { value, selectionStart, selectionEnd } = state;
  const selected = value.slice(selectionStart, selectionEnd);
  const next =
    value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
  return {
    value: next,
    selectionStart: selectionStart + before.length,
    selectionEnd: selectionEnd + before.length,
  };
}

function prefixCurrentLine(state: EditorState, prefix: string): EditorState {
  const { value, selectionStart, selectionEnd } = state;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const lineContent = value.slice(lineStart);
  const existingMatch = lineContent.match(/^(#{1,6} |- |- \[[ x]\] |\d+\. |> )/);
  if (existingMatch) {
    const existing = existingMatch[0];
    const replaced =
      value.slice(0, lineStart) + prefix + value.slice(lineStart + existing.length);
    const diff = prefix.length - existing.length;
    return { value: replaced, selectionStart: selectionStart + diff, selectionEnd: selectionEnd + diff };
  }
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  return {
    value: next,
    selectionStart: selectionStart + prefix.length,
    selectionEnd: selectionEnd + prefix.length,
  };
}

export function applyHeading(state: EditorState, level: 1 | 2 | 3): EditorState {
  return prefixCurrentLine(state, "#".repeat(level) + " ");
}

export function applyBold(state: EditorState): EditorState {
  return wrapSelection(state, "**");
}

export function applyItalic(state: EditorState): EditorState {
  return wrapSelection(state, "*");
}

export function applyStrike(state: EditorState): EditorState {
  return wrapSelection(state, "~~");
}

export function applyInlineCode(state: EditorState): EditorState {
  return wrapSelection(state, "`");
}

export function applyCodeBlock(state: EditorState): EditorState {
  const { value, selectionStart, selectionEnd } = state;
  const selected = value.slice(selectionStart, selectionEnd) || "code";
  const block = "\n```\n" + selected + "\n```\n";
  const next = value.slice(0, selectionStart) + block + value.slice(selectionEnd);
  const inner = selectionStart + 5;
  return { value: next, selectionStart: inner, selectionEnd: inner + selected.length };
}

export function applyQuote(state: EditorState): EditorState {
  const { value, selectionStart, selectionEnd } = state;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const rawLineEnd = value.indexOf("\n", selectionEnd);
  const lineEnd = rawLineEnd === -1 ? value.length : rawLineEnd;
  const lines = value.slice(lineStart, lineEnd).split("\n");
  const prefixed = lines.map((l) => "> " + l).join("\n");
  const next = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
  const linesBeforeCursor = value.slice(lineStart, selectionStart).split("\n").length;
  const added = 2 * linesBeforeCursor;
  return { value: next, selectionStart: selectionStart + added, selectionEnd: selectionEnd + added };
}

export function applyBulletList(state: EditorState): EditorState {
  return prefixCurrentLine(state, "- ");
}

export function applyOrderedList(state: EditorState): EditorState {
  return prefixCurrentLine(state, "1. ");
}

export function applyTaskList(state: EditorState): EditorState {
  return prefixCurrentLine(state, "- [ ] ");
}

export function applyLink(state: EditorState): EditorState {
  const { value, selectionStart, selectionEnd } = state;
  const selected = value.slice(selectionStart, selectionEnd);
  const insert = selected ? `[${selected}](url)` : "[text](url)";
  const next = value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
  const urlStart = selectionStart + (selected ? selected.length + 3 : 7);
  return { value: next, selectionStart: urlStart, selectionEnd: urlStart + 3 };
}

export function applyTable(state: EditorState): EditorState {
  const { value, selectionStart } = state;
  const table =
    "\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n";
  const next = value.slice(0, selectionStart) + table + value.slice(selectionStart);
  return { value: next, selectionStart: selectionStart + table.length, selectionEnd: selectionStart + table.length };
}

export function applyHr(state: EditorState): EditorState {
  const { value, selectionStart } = state;
  const hr = "\n\n---\n\n";
  const next = value.slice(0, selectionStart) + hr + value.slice(selectionStart);
  return { value: next, selectionStart: selectionStart + hr.length, selectionEnd: selectionStart + hr.length };
}

export function applyTab(state: EditorState): EditorState {
  const { value, selectionStart, selectionEnd } = state;
  const next = value.slice(0, selectionStart) + "  " + value.slice(selectionEnd);
  return { value: next, selectionStart: selectionStart + 2, selectionEnd: selectionStart + 2 };
}

export function isInsideCodeFence(value: string, caret: number): boolean {
  const before = value.slice(0, caret);
  const fences = before.match(/^```/gm) ?? [];
  return fences.length % 2 === 1;
}

export function extractVariables(content: string): string[] {
  const re = /\{\{\s*([A-Za-z_]\w*)\s*\}\}/g;
  return Array.from(new Set(Array.from(content.matchAll(re), (m) => m[1])));
}

// ────────────────────────────────────────────────────────────
// Tokenizer for the syntax-colored overlay
// ────────────────────────────────────────────────────────────

export function tokenizeMarkdown(text: string): Token[] {
  const tokens: Token[] = [];
  const lines = text.split("\n");
  let inFence = false;
  let fenceAccum = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const suffix = i < lines.length - 1 ? "\n" : "";

    if (/^```/.test(line)) {
      if (!inFence) {
        inFence = true;
        fenceAccum = line + suffix;
      } else {
        fenceAccum += line + suffix;
        tokens.push({ text: fenceAccum, className: "t-fence" });
        fenceAccum = "";
        inFence = false;
      }
      continue;
    }

    if (inFence) {
      fenceAccum += line + suffix;
      continue;
    }

    tokens.push(...tokenizeLine(line));
    if (suffix) tokens.push({ text: "\n", className: "" });
  }

  if (fenceAccum) tokens.push({ text: fenceAccum, className: "t-fence" });

  return tokens;
}

function tokenizeLine(line: string): Token[] {
  const headingMatch = line.match(/^(#{1,6}) /);
  if (headingMatch) {
    return [{ text: line, className: `t-heading t-h${headingMatch[1].length}` }];
  }
  if (/^> /.test(line)) return [{ text: line, className: "t-quote" }];
  if (/^---$/.test(line)) return [{ text: line, className: "t-hr" }];
  if (/^\|/.test(line)) return [{ text: line, className: "t-table" }];

  const listMatch = line.match(/^(\s*(?:- \[[ x]\] |- |\d+\. ))/);
  if (listMatch) {
    const marker = listMatch[0];
    return [{ text: marker, className: "t-list" }, ...tokenizeInline(line.slice(marker.length))];
  }

  return tokenizeInline(line);
}

function tokenizeInline(text: string): Token[] {
  const patterns: { re: RegExp; cls: string }[] = [
    { re: /\{\{\s*[A-Za-z_]\w*\s*\}\}/, cls: "t-variable" },
    { re: /\*\*[^*\n]+\*\*/, cls: "t-bold" },
    { re: /(?<!\*)\*[^*\n]+\*(?!\*)/, cls: "t-italic" },
    { re: /~~[^~\n]+~~/, cls: "t-strike" },
    { re: /`[^`\n]+`/, cls: "t-code" },
    { re: /\[[^\]\n]+\]\([^)\s\n]+\)/, cls: "t-link" },
  ];

  const tokens: Token[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliest: { index: number; match: RegExpExecArray; cls: string } | null = null;

    for (const { re, cls } of patterns) {
      const m = new RegExp(re.source).exec(remaining);
      if (m !== null && (earliest === null || m.index < earliest.index)) {
        earliest = { index: m.index, match: m, cls };
      }
    }

    if (!earliest) {
      tokens.push({ text: remaining, className: "" });
      break;
    }

    if (earliest.index > 0) {
      tokens.push({ text: remaining.slice(0, earliest.index), className: "" });
    }
    tokens.push({ text: earliest.match[0], className: earliest.cls });
    remaining = remaining.slice(earliest.index + earliest.match[0].length);
  }

  return tokens;
}
