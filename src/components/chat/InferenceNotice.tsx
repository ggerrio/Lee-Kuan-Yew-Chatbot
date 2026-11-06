import React from 'react';
import { Clock } from 'lucide-react';

export const InferenceNotice: React.FC = () => {
  return (
    <div
      role="note"
      aria-label="Historical Boundary Notice"
      className="mb-3.5 flex items-start gap-2.5 rounded-sm border border-warning/35 border-l-[3px] border-l-warning bg-warning/10 px-3.5 py-2.5 text-xs"
    >
      <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
      <div className="space-y-0.5">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-warning">
          HISTORICAL BOUNDARY NOTICE · POST-2015 EXTRAPOLATION
        </div>
        <div className="font-sans text-xs font-medium text-foreground/90 leading-relaxed">
          Inference — Based on documented principles, not a direct historical statement
        </div>
      </div>
    </div>
  );
};
