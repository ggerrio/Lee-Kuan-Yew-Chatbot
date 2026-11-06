import React from 'react';
import { ChatMessage } from '@/types';
import { MessageBubble } from './MessageBubble';
import { EmptyState } from './EmptyState';
import { TypingIndicator } from './TypingIndicator';
import { LoadingSkeleton } from './LoadingSkeleton';
import { useAutoScroll } from '@/hooks/useAutoScroll';

interface ChatContainerProps {
  messages: ChatMessage[];
  isGenerating?: boolean;
  onSelectPrompt: (promptText: string) => void;
  onRetry?: (prompt: string, messageId: string) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isGenerating,
  onSelectPrompt,
  onRetry,
}) => {
  // A session is in its initial discovery state when no user inquiry has been submitted yet
  // (either messages is empty after clearMessages, or contains only the initial 'msg-greeting').
  const hasUserInquiries = messages.some((m) => m.role === 'user');
  const showDiscoveryState =
    messages.length === 0 ||
    (!hasUserInquiries && messages.length === 1 && messages[0].id === 'msg-greeting');

  const containerRef = useAutoScroll<HTMLDivElement>([
    hasUserInquiries ? messages : null,
    isGenerating,
  ]);

  React.useEffect(() => {
    if (showDiscoveryState && !isGenerating && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [showDiscoveryState, isGenerating, containerRef]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5"
    >
      <div className="mx-auto w-full max-w-3xl space-y-5">
        {showDiscoveryState && <EmptyState onSelectPrompt={onSelectPrompt} />}

        {messages.length > 0 && (
          <div className="space-y-5">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} onRetry={onRetry} />
            ))}
          </div>
        )}

        {isGenerating && (
          <div className="space-y-3 pt-1">
            <LoadingSkeleton />
            <TypingIndicator />
          </div>
        )}
      </div>
    </div>
  );
};
