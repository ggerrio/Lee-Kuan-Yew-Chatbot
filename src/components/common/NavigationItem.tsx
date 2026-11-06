import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  to,
  icon,
  label,
  className,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-sm border-l-2 px-3 py-2 font-sans text-xs font-medium transition-colors duration-150 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          isActive
            ? 'border-l-primary bg-card text-foreground font-semibold'
            : 'border-l-transparent text-muted-foreground hover:border-l-border hover:bg-surface-hover/70 hover:text-foreground',
          className
        )
      }
    >
      <span className="h-3.5 w-3.5 shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
};
