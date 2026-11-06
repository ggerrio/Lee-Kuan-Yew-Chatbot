import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string | number;
  className?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  onClick,
  badge,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full items-center justify-between rounded-sm border-l-2 px-3 py-2 font-sans text-xs font-medium transition-colors duration-150 text-left select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        active
          ? 'border-l-primary bg-card text-foreground font-semibold'
          : 'border-l-transparent text-muted-foreground hover:border-l-border hover:bg-surface-hover/70 hover:text-foreground',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-colors duration-150',
            active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          )}
        >
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      {badge !== undefined && (
        <span className="ml-2 shrink-0 rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
          {badge}
        </span>
      )}
    </button>
  );
};
