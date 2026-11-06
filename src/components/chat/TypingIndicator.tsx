import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div
      aria-live="polite"
      className="flex items-center gap-2 px-1 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
    >
      <span className="h-1.5 w-1.5 rounded-sm bg-primary animate-pulse motion-reduce:animate-none" />
      <span>SEARCHING ARCHIVAL INDEX &amp; SYNTHESIZING RESPONSE...</span>
    </div>
  );
};
