import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Filter, Eye, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';
import { aiService } from '../services/aiService';
import { RiskBadge } from '../components/RiskBadge';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { EthicalDisclaimer } from '../components/EthicalDisclaimer';

export const AiInsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [total, setTotal] = useState(0);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await aiService.getAllInsights({
        priority: priorityFilter,
        limit: 15
      });
      setInsights(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('[AI Insights Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [priorityFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-500" /> Groq AI Decision Support Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Data-backed employee retention blueprints and managerial recommendations.
          </p>
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      {/* Mandatory Decision Support Compliance Banner */}
      <EthicalDisclaimer />

      {/* Insights Cards Feed */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : insights.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No AI insights generated yet"
          description="Generate your first AI-driven HR retention report by analyzing an employee profile."
          actionText="Go to Employees"
          actionLink="/employees"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((item) => (
            <div
              key={item._id}
              className="glass-card rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* Employee Header Strip */}
                <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.employeeId?.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          item.employeeId?.name || 'Emp'
                        )}`
                      }
                      alt=""
                      className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.employeeId?.name || 'Employee Profile'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {item.employeeId?.employeeId} • {item.employeeId?.JobRole}
                      </p>
                    </div>
                  </div>

                  <RiskBadge
                    riskLevel={item.priority || item.employeeId?.currentPrediction?.riskLevel}
                    size="sm"
                  />
                </div>

                {/* Summary Box */}
                <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  <p className="font-bold text-purple-800 dark:text-purple-300 mb-1">Executive Summary:</p>
                  {item.summary}
                </div>

                {/* Recommended Actions Preview */}
                {item.recommendedActions && (
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                      Key Recommendations:
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed whitespace-pre-line">
                      {item.recommendedActions}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                {item.employeeId?._id && (
                  <Link
                    to={`/employees/${item.employeeId._id}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Full Dossier <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
