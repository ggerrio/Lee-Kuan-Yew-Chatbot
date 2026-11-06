import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, className, ...props }) => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      className={cn(
        'relative flex h-8 w-8 shrink-0 overflow-hidden rounded-sm border border-border bg-secondary flex items-center justify-center font-mono font-medium text-xs text-muted-foreground select-none',
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          onError={() => setHasError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        fallback
      )}
    </div>
  );
};
