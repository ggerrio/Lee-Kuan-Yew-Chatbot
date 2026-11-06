import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SuggestedPrompt } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface PromptCardProps {
  prompt: SuggestedPrompt;
  onClick: (promptText: string) => void;
}

const FOLIO_INDEX: Record<SuggestedPrompt['category'], string> = {
  Leadership: '01',
  Economics: '02',
  Diplomacy: '03',
  Philosophy: '04',
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick }) => {
  const indexNum = FOLIO_INDEX[prompt.category] || '01';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(prompt.promptText);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onClick(prompt.promptText)}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer rounded-sm border border-border border-l-2 border-l-primary/70 bg-card transition-colors duration-150 hover:border-foreground/30 hover:border-l-primary hover:bg-surface-hover/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <CardContent className="p-3.5 md:p-4 space-y-2">
        <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
          <div className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground tabular-nums">
            <span className="font-semibold text-primary">[{indexNum}]</span>
            <span>FOLIO // {prompt.category}</span>
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-colors duration-150 group-hover:text-primary" />
        </div>

        <h3 className="font-serif text-[15px] md:text-base font-medium leading-snug tracking-tight text-foreground transition-colors duration-150 group-hover:text-primary">
          {prompt.title}
        </h3>

        <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {prompt.description}
        </p>
      </CardContent>
    </Card>
  );
};
