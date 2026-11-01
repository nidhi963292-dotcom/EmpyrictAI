import React from 'react';
import { Card3D } from './Card3D';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = 'teal',
  loading = false
}) => {
  const colorMap = {
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200/70 dark:border-teal-800/60',
    peach: 'bg-peach-50 text-peach-700 dark:bg-peach-950/70 dark:text-peach-300 border-peach-200/70 dark:border-peach-800/60',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-400 border-rose-200/70 dark:border-rose-800/60',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/60',
    emerald: 'bg-teal-50 text-teal-600 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200/70 dark:border-teal-800/60',
    brand: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200/70 dark:border-teal-800/60'
  };

  const iconStyle = colorMap[color] || colorMap.teal;

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    );
  }

  return (
    <Card3D className="glass-card glass-card-hover rounded-2xl p-6 relative group overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-teal-200/70">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-ivory-50 mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl border shadow-3d-sm transition-transform duration-300 group-hover:scale-110 ${iconStyle}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-center text-xs text-slate-500 dark:text-ivory-300/80 gap-1.5 font-medium">
        {trend && (
          <span
            className={`font-bold flex items-center ${
              trend === 'up'
                ? 'text-rose-600 dark:text-rose-400'
                : trend === 'down'
                ? 'text-teal-600 dark:text-teal-300'
                : 'text-peach-600 dark:text-peach-400'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendLabel}
          </span>
        )}
        {subtitle && <span>{subtitle}</span>}
      </div>

      {/* 3D Bottom Glow Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500/10 via-teal-400/40 to-peach-400/20 group-hover:via-teal-400/80 transition-all duration-300" />
    </Card3D>
  );
};
