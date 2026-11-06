import React from 'react';
import { BookOpen } from 'lucide-react';
import { CitationItem } from '@/types';

interface CitationListProps {
  citations: CitationItem[];
}

/**
 * Pure presentation helper that normalizes raw PDF filename artifacts
 * (such as trailing "Compressed" or underscores) while strictly preserving
 * the real source document title without inventing metadata.
 */
function formatArchivalTitle(rawTitle: string): string {
  if (!rawTitle) return 'Archival Source Document';
  return rawTitle
    .replace(/_/g, ' ')
    .replace(/\s+Compressed$/i, '')
    .replace(/\bLee Kwan Yew\b/gi, 'Lee Kuan Yew')
    .trim();
}

export const CitationList: React.FC<CitationListProps> = ({ citations }) => {
  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Verified Archival Sources"
      className="mt-5 pt-4 border-t border-border space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>VERIFIED ARCHIVAL SOURCES ({citations.length})</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80 tabular-nums">
          BIBLIOGRAPHIC INDEX
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {citations.map((cite, index) => {
          const indexLabel = String(index + 1).padStart(2, '0');
          const displayTitle = formatArchivalTitle(cite.document_title);
          const hasValidScore = typeof cite.score === 'number' && !Number.isNaN(cite.score);

          return (
            <div
              key={`${cite.document_title}-${cite.page_number}-${index}`}
              className="group flex flex-col justify-between rounded-sm border border-border border-l-2 border-l-primary/60 bg-secondary/45 p-3 transition-colors duration-150 hover:border-foreground/30 hover:border-l-primary hover:bg-secondary/80"
            >
              <div className="flex items-start gap-2">
                <span className="font-mono text-[11px] font-semibold text-primary tabular-nums shrink-0 mt-0.5">
                  [{indexLabel}]
                </span>
                <div
                  className="font-sans text-xs font-semibold text-foreground leading-snug break-words"
                  title={cite.document_title}
                >
                  {displayTitle}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums">
                <div className="flex flex-wrap items-center gap-1.5">
                  {cite.document_type && (
                    <span className="rounded-sm bg-background/80 border border-border/70 px-1.5 py-0.5 font-medium text-foreground/85">
                      {cite.document_type}
                    </span>
                  )}
                  {cite.year && <span>· {cite.year}</span>}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="font-semibold text-foreground/85">
                    P. {cite.page_number}
                  </span>
                  {hasValidScore && (
                    <span
                      className="text-muted-foreground"
                      title="Cosine retrieval similarity score"
                    >
                      · SIM: {cite.score.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
