import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const codeText = String(children).replace(/\n$/, '');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (match) {
    return (
      <div className="my-4 overflow-hidden rounded-sm border border-border bg-[hsl(var(--code-block-bg))]">
        <div className="flex items-center justify-between border-b border-border bg-[hsl(var(--code-block-header))] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>EXCERPT // {match[1]}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 px-2 rounded-sm font-mono text-[10px] uppercase tracking-wider gap-1.5 text-muted-foreground hover:text-foreground hover:bg-background/50"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-success" />
                <span className="text-success">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
        <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-foreground">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <code
      className="rounded-sm border border-border/60 bg-secondary px-1.5 py-0.5 font-mono text-xs font-medium text-primary"
      {...props}
    >
      {children}
    </code>
  );
};

interface MarkdownRendererProps {
  content: string;
}

interface ParsedBlock {
  type: 'markdown' | 'table';
  content?: string;
  headers?: string[];
  rows?: string[][];
}

function parsePipeRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes('|') || !trimmed.includes('-')) return false;
  const cells = parsePipeRow(trimmed);
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
}

/**
 * Splits markdown content into standard CommonMark segments and GFM pipe-table blocks
 * (ignoring fenced code blocks) so tables render as structured HTML tables without
 * requiring external remark-gfm dependencies.
 */
function splitMarkdownAndTables(markdown: string): ParsedBlock[] {
  const lines = markdown.split('\n');
  const blocks: ParsedBlock[] = [];
  let mdBuffer: string[] = [];
  let inCodeFence = false;
  let i = 0;

  const flushMarkdown = () => {
    if (mdBuffer.length > 0) {
      blocks.push({ type: 'markdown', content: mdBuffer.join('\n') });
      mdBuffer = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      mdBuffer.push(line);
      i++;
      continue;
    }

    if (
      !inCodeFence &&
      line.trim().startsWith('|') &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      flushMarkdown();
      const headers = parsePipeRow(line);
      i += 2; // skip header and separator row
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(parsePipeRow(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    mdBuffer.push(line);
    i++;
  }

  flushMarkdown();
  return blocks;
}

const markdownComponents = {
  code: CodeBlock,
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 w-full overflow-x-auto rounded-sm border border-border bg-card/50">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
};

const inlineMarkdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  code: CodeBlock,
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const blocks = splitMarkdownAndTables(content);

  return (
    <div className="markdown-content">
      {blocks.map((block, idx) => {
        if (block.type === 'table' && block.headers && block.rows) {
          return (
            <div
              key={`table-${idx}`}
              className="my-4 w-full overflow-x-auto rounded-sm border border-border bg-card/50"
            >
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {block.headers.map((header, hIdx) => (
                      <th key={`th-${hIdx}`}>
                        <ReactMarkdown components={inlineMarkdownComponents}>
                          {header}
                        </ReactMarkdown>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr key={`tr-${rIdx}`}>
                      {row.map((cell, cIdx) => (
                        <td key={`td-${cIdx}`}>
                          <ReactMarkdown components={inlineMarkdownComponents}>
                            {cell}
                          </ReactMarkdown>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <ReactMarkdown key={`md-${idx}`} components={markdownComponents}>
            {block.content || ''}
          </ReactMarkdown>
        );
      })}
    </div>
  );
};
