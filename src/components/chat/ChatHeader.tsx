import React from 'react';
import { BookOpen, Trash2, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useSidebar } from '@/hooks/useSidebar';

interface ChatHeaderProps {
  title: string;
  onNewChat: () => void;
  onClearChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  onNewChat,
  onClearChat,
}) => {
  const { sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/90 px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-sm shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Toggle Navigation"
            title="Expand Archival Ledger"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-secondary text-primary shrink-0">
            <BookOpen className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-baseline gap-2.5 min-w-0">
            <h1 className="font-serif text-base md:text-lg font-medium truncate tracking-tight text-foreground">
              {title}
            </h1>
            <Badge variant="outline" className="hidden sm:inline-flex">
              CORPUS: 1959–2015 · RAG
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="hidden sm:inline-flex gap-1.5 h-8 px-2.5 font-mono text-[11px] uppercase tracking-wider"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Inquiry</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearChat}
          title="Clear current session transcript"
          aria-label="Clear messages"
          className="h-8 w-8 rounded-sm text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
};
