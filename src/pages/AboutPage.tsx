import React from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Award, FileText, Globe, Layers, User } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <PageContainer maxWidth="md" className="overflow-y-auto">
      <SectionTitle
        title="About Lee Kuan Yew AI Chatbot"
        subtitle="An interactive RAG application trained on official memoirs, speeches, and archival records."
      />

      <div className="space-y-6">
        <Card className="border-l-2 border-l-primary/75">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              SECTION 01 // MANDATE &amp; METHODOLOGY
            </div>
            <CardTitle className="text-lg flex items-center gap-2.5">
              <Award className="h-4 w-4 text-primary shrink-0" />
              <span>Project Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 font-sans text-sm text-foreground/90 leading-relaxed space-y-3">
            <p>
              This application offers an AI-powered conversational experience preserving the governance philosophy, strategic economic decisions, and foreign policy perspectives of Singapore’s founding Prime Minister, <strong className="font-semibold text-foreground">Lee Kuan Yew</strong>.
            </p>
            <p className="text-muted-foreground">
              By combining high-density Retrieval-Augmented Generation (RAG) with Google Gemini, the chatbot delivers factually grounded answers anchored directly in historical literature.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-2 border-l-primary/75">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              SECTION 02 // PROVENANCE &amp; ENGINEERING
            </div>
            <CardTitle className="text-lg flex items-center gap-2.5">
              <User className="h-4 w-4 text-primary shrink-0" />
              <span>Project Author &amp; Submission</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 font-sans text-sm text-foreground/90 leading-relaxed space-y-2.5">
            <p>
              Developed by <strong className="font-semibold text-foreground">Gerrio Pratama</strong> for the <em>&ldquo;What Would Lee Kuan Yew Do?&rdquo;</em> challenge.
            </p>
            <p className="text-muted-foreground">
              Built with a production-ready RAG architecture combining FastAPI, custom vector retrieval over 5,772 ingested document chunks, and an evaluation metrics framework.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-2 border-l-primary/75">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              SECTION 03 // PRIMARY SOURCE INDEX
            </div>
            <CardTitle className="text-lg flex items-center gap-2.5">
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <span>Knowledge Base Corpus</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-sm border border-border bg-secondary/45 flex items-start gap-3">
              <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-semibold text-primary">[01]</span>
                  <span className="font-serif font-medium text-sm text-foreground">Memoirs</span>
                </div>
                <div className="font-sans text-xs text-muted-foreground leading-relaxed">
                  The Singapore Story &amp; From Third World to First
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-sm border border-border bg-secondary/45 flex items-start gap-3">
              <Globe className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-semibold text-primary">[02]</span>
                  <span className="font-serif font-medium text-sm text-foreground">Speeches &amp; Addresses</span>
                </div>
                <div className="font-sans text-xs text-muted-foreground leading-relaxed">
                  Parliamentary debates and international summits
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-sm border border-border bg-secondary/45 flex items-start gap-3">
              <Layers className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-semibold text-primary">[03]</span>
                  <span className="font-serif font-medium text-sm text-foreground">Transcribed Interviews</span>
                </div>
                <div className="font-sans text-xs text-muted-foreground leading-relaxed">
                  Global media &amp; diplomatic conversations
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-sm border border-border bg-secondary/45 flex items-start gap-3">
              <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-semibold text-primary">[04]</span>
                  <span className="font-serif font-medium text-sm text-foreground">Published Essays</span>
                </div>
                <div className="font-sans text-xs text-muted-foreground leading-relaxed">
                  Articles on governance &amp; international affairs
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground border-t border-border pt-4">
          <span>Built by Gerrio Pratama</span>
          <Badge variant="outline">Version 1.0.0</Badge>
        </div>
      </div>
    </PageContainer>
  );
};
