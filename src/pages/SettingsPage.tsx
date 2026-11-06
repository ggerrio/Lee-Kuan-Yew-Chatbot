import React from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Monitor, Cpu, Database, ShieldCheck, Layers } from 'lucide-react';
import { Theme } from '@/types';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { id: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <PageContainer maxWidth="md" className="overflow-y-auto">
      <SectionTitle
        title="Settings & Preferences"
        subtitle="Manage appearance, system parameters, and application configuration"
      />

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card className="border-l-2 border-l-primary/75">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              SECTION 01 // READING SURFACE PALETTE
            </div>
            <CardTitle className="text-lg">Appearance &amp; Theme</CardTitle>
            <CardDescription>Select your preferred visual mode for the interface.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {themes.map((t) => (
              <Button
                key={t.id}
                variant={theme === t.id ? 'default' : 'outline'}
                onClick={() => setTheme(t.id)}
                className="w-full gap-2 rounded-sm font-mono text-xs uppercase tracking-wider"
              >
                {t.icon}
                <span>{t.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* AI Model & System Settings */}
        <Card className="border-l-2 border-l-primary/75">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              SECTION 02 // ARCHIVAL RETRIEVAL SPECIFICATIONS
            </div>
            <CardTitle className="text-lg">AI Engine &amp; Vector Architecture</CardTitle>
            <CardDescription>Active production RAG pipeline and archival retrieval specifications.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
              <div className="flex items-center gap-2.5 font-sans text-sm font-medium text-foreground">
                <Cpu className="h-4 w-4 text-primary shrink-0" />
                <span>Primary LLM Provider</span>
              </div>
              <Badge variant="outline">Google Gemini 3.5 Flash-Lite</Badge>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
              <div className="flex items-center gap-2.5 font-sans text-sm font-medium text-foreground">
                <Layers className="h-4 w-4 text-primary shrink-0" />
                <span>Dense Embedding Model</span>
              </div>
              <Badge variant="outline">BAAI/bge-small-en-v1.5 (384-d)</Badge>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
              <div className="flex items-center gap-2.5 font-sans text-sm font-medium text-foreground">
                <Database className="h-4 w-4 text-primary shrink-0" />
                <span>Vector Retrieval Engine</span>
              </div>
              <Badge variant="outline">In-Memory NumPy BLAS (.npz)</Badge>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 font-sans text-sm font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                <span>Fact Grounding Guardrails</span>
              </div>
              <Badge variant="success">Strict Context + Temporal Gate</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
