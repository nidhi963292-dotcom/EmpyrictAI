import React from 'react';
import { LucideInbox } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = LucideInbox,
  title = 'No records found',
  description = 'There is currently no data available to display.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl glass-card border border-dashed border-slate-300 dark:border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-colors"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-colors"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};
