import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm font-sans text-sm font-medium tracking-tight transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 select-none',
  {
    variants: {
      variant: {
        default:
          'border border-primary bg-primary text-primary-foreground shadow-none hover:bg-primary/90 active:bg-primary/95',
        destructive:
          'border border-destructive bg-destructive text-destructive-foreground shadow-none hover:bg-destructive/90 active:bg-destructive/95',
        outline:
          'border border-border bg-card text-foreground shadow-none hover:bg-surface-hover hover:border-foreground/30',
        secondary:
          'border border-border/80 bg-secondary text-secondary-foreground shadow-none hover:bg-surface-hover hover:text-foreground',
        ghost:
          'border border-transparent text-muted-foreground hover:bg-surface-hover/80 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-sm px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        icon: 'h-9 w-9 rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
