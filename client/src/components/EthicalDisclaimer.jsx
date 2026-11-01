import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export const EthicalDisclaimer = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs">
        <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Decision Support Notice:</strong> AI recommendations are advisory and must be reviewed by qualified HR personnel.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/60 dark:border-amber-900/50 text-slate-800 dark:text-slate-200 shadow-sm">
      <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 shrink-0">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
          Responsible AI & Compliance Disclaimer
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          Machine Learning predictions and Groq AI-generated retention insights serve strictly as advisory decision-support tools. They are designed to assist HR leaders in identifying opportunities for positive employee engagement and support. They must <strong>never</strong> be used as the sole basis for adverse employment decisions (such as termination, demotion, or disciplinary action).
        </p>
      </div>
    </div>
  );
};
