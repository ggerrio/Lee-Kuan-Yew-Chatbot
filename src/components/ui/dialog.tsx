import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity animate-in fade-in-0 duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          'relative z-50 w-full max-w-lg rounded-md border border-border bg-card p-6 text-card-foreground shadow-[0_8px_30px_rgba(24,24,22,0.12)] animate-in fade-in-0 duration-150',
          className
        )}
      >
        <div className="flex items-start justify-between border-b border-border pb-3.5 mb-4">
          <div>
            <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">{title}</h2>
            {description && (
              <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-sm -mr-1 -mt-1">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="font-sans text-sm">{children}</div>
      </div>
    </div>
  );
};
