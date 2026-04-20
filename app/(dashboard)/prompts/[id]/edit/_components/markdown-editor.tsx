"use client";

import {
  useRef,
  useMemo,
  useDeferredValue,
  useImperativeHandle,
  forwardRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import {
  tokenizeMarkdown,
  applyBold,
  applyItalic,
  applyLink,
  applyTab,
  isInsideCodeFence,
  type EditorState,
} from "@/lib/markdown";
import { MarkdownToolbar } from "./markdown-toolbar";
import styles from "./editor.module.css";

export interface PieceInsertHandle {
  insert: (text: string) => void;
  replace: (text: string) => void;
  append: (text: string) => void;
  getSelection: () => string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  minHeight?: number;
}

export const MarkdownEditor = forwardRef<PieceInsertHandle, Props>(
  function MarkdownEditor({ value, onChange, error, minHeight = 320 }, ref) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);

    const deferred = useDeferredValue(value);
    const tokens = useMemo(() => tokenizeMarkdown(deferred), [deferred]);

    const syncScroll = useCallback(() => {
      if (textareaRef.current && preRef.current) {
        preRef.current.scrollTop = textareaRef.current.scrollTop;
        preRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
    }, []);

    const applyTransform = useCallback(
      (fn: (s: EditorState) => EditorState) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const state: EditorState = {
          value: ta.value,
          selectionStart: ta.selectionStart,
          selectionEnd: ta.selectionEnd,
        };
        const next = fn(state);
        onChange(next.value);
        requestAnimationFrame(() => {
          if (!textareaRef.current) return;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(next.selectionStart, next.selectionEnd);
          syncScroll();
        });
      },
      [onChange, syncScroll],
    );

    useImperativeHandle(
      ref,
      () => ({
        insert(text: string) {
          applyTransform((s) => {
            const next = s.value.slice(0, s.selectionStart) + text + s.value.slice(s.selectionEnd);
            const pos = s.selectionStart + text.length;
            return { value: next, selectionStart: pos, selectionEnd: pos };
          });
        },
        replace(text: string) {
          applyTransform((s) => {
            const next = s.value.slice(0, s.selectionStart) + text + s.value.slice(s.selectionEnd);
            const pos = s.selectionStart + text.length;
            return { value: next, selectionStart: pos, selectionEnd: pos };
          });
        },
        append(text: string) {
          applyTransform((s) => {
            const next = s.value.trimEnd() + "\n\n" + text;
            return { value: next, selectionStart: next.length, selectionEnd: next.length };
          });
        },
        getSelection() {
          const ta = textareaRef.current;
          if (!ta) return "";
          return ta.value.slice(ta.selectionStart, ta.selectionEnd);
        },
      }),
      [applyTransform],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        const mod = e.ctrlKey || e.metaKey;
        if (mod && e.key === "b") {
          e.preventDefault();
          applyTransform(applyBold);
          return;
        }
        if (mod && e.key === "i") {
          e.preventDefault();
          applyTransform(applyItalic);
          return;
        }
        if (mod && e.key === "k") {
          e.preventDefault();
          applyTransform(applyLink);
          return;
        }
        if (e.key === "Tab") {
          const ta = e.currentTarget;
          if (isInsideCodeFence(ta.value, ta.selectionStart)) {
            e.preventDefault();
            applyTransform(applyTab);
          }
        }
      },
      [applyTransform],
    );

    return (
      <div className="space-y-0">
        <MarkdownToolbar onTransform={applyTransform} />
        <div
          className={[
            styles["editor-wrap"],
            "rounded-b-md border border-border bg-background",
            error ? "border-destructive" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ minHeight }}
        >
          <pre
            ref={preRef}
            aria-hidden="true"
            className={styles["editor-pre"]}
            style={{ minHeight }}
          >
            {tokens.map((token, i) =>
              token.className ? (
                <span key={i} className={token.className.split(" ").map((c) => styles[c] ?? c).join(" ")}>
                  {token.text}
                </span>
              ) : (
                token.text
              ),
            )}
            {/* Trailing space keeps scroll height in sync */}
            {" "}
          </pre>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            className={styles["editor-textarea"]}
            style={{ minHeight }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-label="Prompt content"
            aria-invalid={!!error}
            aria-multiline="true"
          />
        </div>
        {error && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  },
);
