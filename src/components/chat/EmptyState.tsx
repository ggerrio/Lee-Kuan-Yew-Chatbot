import React from 'react';
import { SuggestedPrompt } from '@/types';
import { PromptCard } from './PromptCard';

const SAMPLE_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'p-1',
    category: 'Leadership',
    title: 'Principles of Effective Governance',
    description: 'What key leadership principles were critical during Singapore’s foundational years?',
    promptText: 'What key leadership principles guided your administration in building Singapore into a global financial center?',
  },
  {
    id: 'p-2',
    category: 'Economics',
    title: 'Economic Transformation Strategy',
    description: 'How did Singapore transition from a third-world port to a first-world economy?',
    promptText: 'Explain the economic strategy Singapore used to attract foreign investment and build world-class infrastructure.',
  },
  {
    id: 'p-3',
    category: 'Diplomacy',
    title: 'Small State Geopolitics',
    description: 'How should a small nation navigate rivalry between major global superpowers?',
    promptText: 'How can a small state maintain sovereignty and economic relevance amidst geopolitical competition?',
  },
  {
    id: 'p-4',
    category: 'Philosophy',
    title: 'Pragmatism & Meritocracy',
    description: 'Why is meritocracy essential for anti-corruption and institutional excellence?',
    promptText: 'Why did you consider meritocracy and pragmatism non-negotiable for public service?',
  },
];

interface EmptyStateProps {
  onSelectPrompt: (promptText: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  return (
    <section
      aria-label="Archival Dossier Index"
      className="w-full max-w-3xl mx-auto pt-1 pb-2 space-y-4 animate-in fade-in-0 duration-200"
    >
      {/* Editorial Dossier Masthead */}
      <div className="border-t-2 border-t-foreground/85 border-b border-b-border pt-3.5 pb-3.5 space-y-2 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          <span className="text-primary font-semibold">
            SINGAPORE HISTORICAL DIGITAL ARCHIVE · SERIES 1959–2015
          </span>
          <span className="tabular-nums">REF // CANONICAL CORPUS</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-[28px] md:text-[30px] font-normal tracking-tight text-foreground leading-tight">
          Lee Kuan Yew AI Persona
        </h2>

        <p className="font-sans text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Ask questions regarding governance, economic strategy, diplomacy, and nation-building based on Lee Kuan Yew’s memoirs and public speeches.
        </p>
      </div>

      {/* Curated Discovery Folios */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          <span>CURATED INQUIRY FOLIOS</span>
          <span className="tabular-nums">[04 ENTRIES]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full text-left">
          {SAMPLE_PROMPTS.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onClick={onSelectPrompt} />
          ))}
        </div>
      </div>

      {/* Archival Provenance Footer Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-xs bg-primary shrink-0" />
          <span>Factually Grounded</span>
        </div>
        <span className="hidden sm:inline text-border">·</span>
        <div className="flex items-center gap-2">
          <span>Historical Speeches</span>
        </div>
        <span className="hidden sm:inline text-border">·</span>
        <div className="flex items-center gap-2">
          <span>Global Geopolitics</span>
        </div>
      </div>
    </section>
  );
};
