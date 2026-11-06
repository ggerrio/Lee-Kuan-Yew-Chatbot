import React from 'react';
import { cn } from '@/lib/utils';

interface SuggestionChipProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const SuggestionChip: React.FC<SuggestionChipProps> = ({
  label,
  onClick,
  icon,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border border-border bg-secondary/60 px-3 py-1.5 font-mono text-[11px] font-medium tracking-wider uppercase text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none',
        className
      )}
    >
      {icon && <span className="text-primary shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
