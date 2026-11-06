import React from 'react';
import { Square, ArrowUp, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

interface ChatFooterProps {
  input: string;
  onChangeInput: (text: string) => void;
  onSend: (text: string) => void;
  isGenerating?: boolean;
  onStop?: () => void;
}

export const ChatFooter: React.FC<ChatFooterProps> = ({
  input,
  onChangeInput,
  onSend,
  isGenerating,
  onStop,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isGenerating) {
        onSend(input.trim());
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onSend(input.trim());
    }
  };

  return (
    <footer className="border-t border-border bg-secondary/50 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5 shrink-0">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-1.5">
        <div className="relative flex items-center gap-2 rounded-sm border border-border bg-card px-2.5 py-1.5 sm:px-3 sm:py-2 transition-colors duration-150 focus-within:border-primary focus-within:ring-1 focus-within:ring-ring/30">
          {/* Archival Inquiry Prefix */}
          <div className="hidden sm:flex items-center h-7 px-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground select-none shrink-0 border-r border-border/70 pr-2.5">
            INQUIRY
          </div>

          {/* Multiline Text Input */}
          <textarea
            value={input}
            onChange={(e) => onChangeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Submit an inquiry on governance, economic strategy, foreign policy, or bilingualism..."
            rows={1}
            className="flex-1 max-h-32 h-7 sm:min-h-[30px] resize-none overflow-y-auto bg-transparent px-1 py-1 font-sans text-xs sm:text-sm text-foreground leading-snug placeholder:text-muted-foreground placeholder:truncate focus:outline-none"
          />

          {/* Action Button: Send or Stop */}
          {isGenerating ? (
            <Tooltip content="Interrupt Synthesis">
              <Button
                type="button"
                size="sm"
                onClick={onStop}
                variant="destructive"
                className="h-7 sm:h-8 px-2.5 shrink-0 rounded-sm font-mono text-[10px] uppercase tracking-wider gap-1.5"
              >
                <Square className="h-3 w-3 fill-current" />
                <span className="hidden sm:inline">Stop</span>
              </Button>
            </Tooltip>
          ) : (
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim()}
              className="h-7 sm:h-8 px-2.5 sm:px-3 shrink-0 rounded-sm bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-wider gap-1.5 transition-colors disabled:opacity-40"
            >
              <span className="hidden sm:inline">Submit</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 px-0.5 font-mono text-[9px] sm:text-[10px] tracking-tight text-muted-foreground">
          <span className="flex items-center gap-1 truncate">
            <CornerDownLeft className="h-2.5 w-2.5 opacity-70 hidden sm:inline shrink-0" />
            <span className="hidden sm:inline">ENTER TO SUBMIT · SHIFT + ENTER FOR NEW LINE</span>
            <span className="sm:hidden">ENTER TO SUBMIT INQUIRY</span>
          </span>
          <span className="uppercase shrink-0">CORPUS: 1959–2015</span>
        </div>
      </form>
    </footer>
  );
};
