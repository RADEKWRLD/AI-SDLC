"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

// Custom theme matching the design system warm tones
const codeTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: "var(--foreground)",
    fontFamily: "var(--font-mono), monospace",
    fontSize: "0.85em",
    lineHeight: 1.6,
  },
  'pre[class*="language-"]': {
    color: "var(--foreground)",
    fontFamily: "var(--font-mono), monospace",
    fontSize: "0.85em",
    lineHeight: 1.6,
    padding: "1.25rem",
    margin: 0,
    overflow: "auto",
    background: "var(--secondary)",
    borderRadius: "0.75rem",
  },
  comment: { color: "var(--muted-foreground)" },
  prolog: { color: "var(--muted-foreground)" },
  doctype: { color: "var(--muted-foreground)" },
  cdata: { color: "var(--muted-foreground)" },
  punctuation: { color: "var(--foreground)", opacity: 0.7 },
  property: { color: "#e06c60" },
  tag: { color: "#e06c60" },
  boolean: { color: "#d19a66" },
  number: { color: "#d19a66" },
  constant: { color: "#d19a66" },
  symbol: { color: "#d19a66" },
  deleted: { color: "#e06c60" },
  selector: { color: "#98c379" },
  "attr-name": { color: "#d19a66" },
  string: { color: "#98c379" },
  char: { color: "#98c379" },
  builtin: { color: "#56b6c2" },
  inserted: { color: "#98c379" },
  operator: { color: "#56b6c2" },
  entity: { color: "#d19a66" },
  url: { color: "#56b6c2" },
  "attr-value": { color: "#98c379" },
  keyword: { color: "#c678dd" },
  function: { color: "#61afef" },
  "class-name": { color: "#e5c07b" },
  regex: { color: "#d19a66" },
  important: { color: "#c678dd", fontWeight: "bold" },
  variable: { color: "#e06c60" },
};

interface MarkdownRendererProps {
  children: string;
  className?: string;
  compact?: boolean;
}

export function MarkdownRenderer({ children, className, compact }: MarkdownRendererProps) {
  const components: Components = {
    code({ className: codeClassName, children: codeChildren, ...props }) {
      const match = /language-(\w+)/.exec(codeClassName || "");
      const codeString = String(codeChildren).replace(/\n$/, "");

      // Inline code
      if (!match) {
        return (
          <code className="md-inline-code" {...props}>
            {codeChildren}
          </code>
        );
      }

      // Code block with syntax highlighting
      return (
        <div className="md-code-block">
          <div className="md-code-header">
            <span className="md-code-lang">{match[1]}</span>
          </div>
          <SyntaxHighlighter
            style={codeTheme}
            language={match[1]}
            PreTag="div"
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    },
    table({ children: tableChildren }) {
      return (
        <div className="md-table-wrap">
          <table>{tableChildren}</table>
        </div>
      );
    },
    blockquote({ children: bqChildren }) {
      return <blockquote className="md-blockquote">{bqChildren}</blockquote>;
    },
    a({ href, children: linkChildren }) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {linkChildren}
        </a>
      );
    },
  };

  return (
    <div className={cn("md-content", compact && "md-compact", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
