import React from 'react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { PageContainer } from '@/components/common/PageContainer';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer maxWidth="sm" className="flex flex-col items-center justify-center text-center">
      <div className="w-full rounded-sm border border-border border-t-2 border-t-primary bg-card p-6 sm:p-8 shadow-none">
        <div className="mb-3 inline-flex items-center gap-2 rounded-sm border border-warning/35 bg-warning/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-warning">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>ERR // 404 · UNINDEXED ROUTE</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-foreground mb-2.5">
          404 - Page Not Found
        </h1>

        <p className="font-sans text-sm text-muted-foreground mb-6 leading-relaxed">
          The route you accessed does not exist in the Lee Kuan Yew Chatbot application.
        </p>

        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'gap-2 rounded-sm font-mono text-xs uppercase tracking-wider'
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Chat Interface</span>
        </Link>
      </div>
    </PageContainer>
  );
};
