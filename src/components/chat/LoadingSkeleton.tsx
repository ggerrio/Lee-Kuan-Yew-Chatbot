import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Retrieving archival passages"
      className="w-full rounded-sm border border-[hsl(var(--assistant-bubble-border))] border-l-[3px] border-l-primary/70 bg-[hsl(var(--assistant-bubble-bg))] px-4 py-4 sm:px-6 sm:py-5"
    >
      <div className="mb-3.5 flex items-center justify-between border-b border-border/70 pb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-5 w-6 shrink-0 items-center justify-center rounded-sm bg-primary/85 font-serif text-[11px] font-semibold tracking-tight text-primary-foreground select-none">
            LKY
          </span>
          <span className="font-serif text-sm font-semibold tracking-tight text-foreground">
            Lee Kuan Yew
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            · ARCHIVAL RETRIEVAL
          </span>
        </div>
      </div>

      <div className="space-y-2.5 py-1 animate-pulse motion-reduce:animate-none">
        <div className="h-3 w-11/12 rounded-sm bg-secondary" />
        <div className="h-3 w-full rounded-sm bg-secondary/85" />
        <div className="h-3 w-4/5 rounded-sm bg-secondary/70" />
        <div className="h-3 w-3/5 rounded-sm bg-secondary/55" />
      </div>
    </div>
  );
};
