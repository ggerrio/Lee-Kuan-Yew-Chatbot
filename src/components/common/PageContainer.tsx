import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  maxWidth = 'lg',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-3xl',
    lg: 'max-w-4xl',
    xl: 'max-w-5xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full h-full px-5 py-6 md:px-8 md:py-10 bg-background text-foreground',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
};
