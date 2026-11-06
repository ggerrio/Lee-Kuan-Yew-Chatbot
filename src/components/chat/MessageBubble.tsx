import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CitationList } from './CitationList';
import { RefusalNotice } from './RefusalNotice';
import { InferenceNotice } from './InferenceNotice';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (prompt: string, messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRetry }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isUser) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        aria-label="User Inquiry"
        className="group relative w-full rounded-sm border border-border bg-[hsl(var(--user-bubble-bg))] text-[hsl(var(--user-bubble-fg))] px-4 py-3.5 sm:px-5 sm:py-4 transition-colors"
      >
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-sm bg-foreground/60 shrink-0" />
            <span>INQUIRY SUBMITTED</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
            {message.timestamp}
          </span>
        </div>

        <div className="font-sans text-[15px] font-medium leading-relaxed text-foreground whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      aria-label="Archival Response"
      className={cn(
        'group relative w-full rounded-sm border px-4 py-4 sm:px-6 sm:py-5 transition-colors',
        message.isError
          ? 'border-destructive/40 border-l-[3px] border-l-destructive bg-destructive/5 text-foreground'
          : 'border-[hsl(var(--assistant-bubble-border))] border-l-[3px] border-l-primary bg-[hsl(var(--assistant-bubble-bg))] text-[hsl(var(--assistant-bubble-fg))]'
      )}
    >
      {/* Zone 1: Folio Header Band */}
      <div className="mb-3.5 flex items-center justify-between gap-2 border-b border-border/70 pb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {message.isError ? (
            <span className="inline-flex h-5 w-6 shrink-0 items-center justify-center rounded-sm bg-destructive/15 text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
            </span>
          ) : (
            <span className="inline-flex h-5 w-6 shrink-0 items-center justify-center rounded-sm bg-primary font-serif text-[11px] font-semibold tracking-tight text-primary-foreground select-none">
              LKY
            </span>
          )}

          <span className="font-serif text-sm font-semibold tracking-tight text-foreground">
            Lee Kuan Yew
          </span>

          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {message.id === 'msg-greeting' ? '· ARCHIVAL DOSSIER NOTE' : '· ARCHIVAL SYNTHESIS'}
          </span>

          <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
            {message.timestamp}
          </span>
        </div>

        {!message.isError && message.content && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 px-2 rounded-sm font-mono text-[10px] uppercase tracking-wider gap-1 text-muted-foreground hover:text-foreground opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            title="Copy response"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-success" />
                <span className="text-success">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Zone 2–4: Error State OR Epistemic Notices + Markdown Prose + Citations */}
      {message.isError ? (
        <div className="space-y-3">
          <div className="rounded-sm border border-destructive/30 bg-destructive/10 px-3.5 py-2.5">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-destructive mb-1">
              SYSTEM TRANSMISSION NOTICE · REQUEST FAILED
            </div>
            <div className="flex items-start gap-2 font-sans text-xs sm:text-sm text-foreground font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
              <span>{message.errorMessage || 'Failed to process request.'}</span>
            </div>
          </div>

          {message.retryPrompt && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetry(message.retryPrompt!, message.id)}
              className="h-8 gap-1.5 rounded-sm font-mono text-[11px] uppercase tracking-wider border-destructive/40 hover:bg-destructive/10 text-destructive"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry Question
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden">
          {/* Refusal Notice (is_refusal = true) */}
          {message.isRefusal && <RefusalNotice />}

          {/* Post-2015 Inference Notice (is_post_2015_inference = true) */}
          {message.isPost2015Inference && <InferenceNotice />}

          {/* Grounded Conversational Prose */}
          {message.content && <MarkdownRenderer content={message.content} />}

          {/* Verified Archival Sources (Only if not a refusal) */}
          {!message.isRefusal && message.citations && message.citations.length > 0 && (
            <CitationList citations={message.citations} />
          )}
        </div>
      )}
    </motion.article>
  );
};
