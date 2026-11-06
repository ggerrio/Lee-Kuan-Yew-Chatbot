import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  className,
  action,
}) => {
  return (
    <div
      className={cn(
        'flex items-start justify-between border-t-2 border-t-foreground/80 border-b border-b-border pt-4 pb-4 mb-6',
        className
      )}
    >
      <div>
        <div className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-primary mb-1">
          ARCHIVAL RECORD FOLIO
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="font-sans text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  );
};
