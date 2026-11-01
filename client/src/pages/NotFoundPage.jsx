import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-6">
        <BrainCircuit className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 — Page Not Found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8">
        The workforce analytics page or resource you requested could not be located.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
    </div>
  );
};
