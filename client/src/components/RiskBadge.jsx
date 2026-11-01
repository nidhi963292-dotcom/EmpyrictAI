import React from 'react';

export const RiskBadge = ({ riskLevel, probability, size = 'md' }) => {
  const level = (riskLevel || 'Unknown').toLowerCase();

  const styles = {
    high: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60',
    medium: 'bg-peach-50 text-peach-800 border-peach-200 dark:bg-peach-950/60 dark:text-peach-300 dark:border-peach-800/60',
    low: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/60',
    pending: 'bg-ivory-100 text-slate-700 border-ivory-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700',
    unknown: 'bg-ivory-100 text-slate-700 border-ivory-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700'
  };

  const dots = {
    high: 'bg-rose-500 animate-pulse',
    medium: 'bg-peach-500',
    low: 'bg-teal-500',
    pending: 'bg-slate-400',
    unknown: 'bg-slate-400'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-bold'
  };

  const currentStyle = styles[level] || styles.unknown;
  const currentDot = dots[level] || dots.unknown;
  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-3d-sm ${currentStyle} ${currentSize}`}
    >
      <span className={`w-2 h-2 rounded-full ${currentDot}`} />
      <span>{riskLevel || 'Unknown'} Risk</span>
      {probability !== undefined && (
        <span className="opacity-80 font-normal">({probability}%)</span>
      )}
    </span>
  );
};
