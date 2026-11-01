import React from 'react';

export const TableSkeleton = ({ rows = 5, cols = 6 }) => (
  <div className="w-full animate-pulse space-y-3">
    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-12 bg-slate-100 dark:bg-slate-850 rounded-xl w-full flex items-center px-4 gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="h-4 bg-slate-200 dark:bg-slate-800 rounded flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
    <div className="h-24 bg-slate-100 dark:bg-slate-850 rounded-xl w-full" />
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
  </div>
);
