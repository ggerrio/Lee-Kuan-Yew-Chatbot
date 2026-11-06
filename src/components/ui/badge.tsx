import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider tabular-nums transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-ring',
  {
    variants: {
      variant: {
        default:
          'border-primary/80 bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'border-border bg-secondary text-secondary-foreground hover:bg-surface-hover',
        destructive:
          'border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15',
        outline:
          'border-border bg-card/60 text-muted-foreground',
        success:
          'border-success/35 bg-success/10 text-success',
        warning:
          'border-warning/35 bg-warning/10 text-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
