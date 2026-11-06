import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const RefusalNotice: React.FC = () => {
  return (
    <div
      role="note"
      aria-label="Archival Record Absence Notice"
      className="mb-3.5 flex items-start gap-2.5 rounded-sm border border-border border-l-[3px] border-l-muted-foreground bg-secondary/75 px-3.5 py-2.5 text-xs"
    >
      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div className="space-y-0.5">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          ARCHIVAL RECORD ABSENCE · OUTSIDE VERIFIED CORPUS
        </div>
        <div className="font-sans text-xs font-medium text-foreground/90 leading-relaxed">
          No Documented Historical Record
        </div>
      </div>
    </div>
  );
};
