import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Filter, Calendar, ChevronLeft, ChevronRight, Eye, AlertCircle } from 'lucide-react';
import { predictionService } from '../services/predictionService';
import { RiskBadge } from '../components/RiskBadge';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';

export const PredictionsPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [riskLevel, setRiskLevel] = useState('All');
  const [predictionFilter, setPredictionFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const res = await predictionService.getAllPredictions({
        page,
        limit: 12,
        riskLevel,
        prediction: predictionFilter
      });
      setPredictions(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('[Predictions Page Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [page, riskLevel, predictionFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Prediction History & Inference Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete audit trail of machine learning predictions across monitored workforce profiles.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2">
          <select
            value={riskLevel}
            onChange={(e) => {
              setRiskLevel(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>

          <select
            value={predictionFilter}
            onChange={(e) => {
              setPredictionFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="All">All Outcomes</option>
            <option value="Yes">Predicted To Leave (Yes)</option>
            <option value="No">Predicted To Stay (No)</option>
          </select>
        </div>
      </div>

      {/* Predictions Table */}
      {loading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : predictions.length === 0 ? (
        <EmptyState
          icon={BrainCircuit}
          title="No prediction records found"
          description="No predictions match the selected filter criteria."
          actionText="View Employees"
          actionLink="/employees"
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 dark:bg-slate-850/75 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Employee</th>
                  <th className="py-3.5 px-4 font-semibold">Department</th>
                  <th className="py-3.5 px-4 font-semibold">Risk Classification</th>
                  <th className="py-3.5 px-4 font-semibold">Probability</th>
                  <th className="py-3.5 px-4 font-semibold">Analyzed On</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
                {predictions.map((pred) => (
                  <tr key={pred._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={
                          pred.employeeId?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                            pred.employeeId?.name || 'Emp'
                          )}`
                        }
                        alt=""
                        className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {pred.employeeId?.name || 'Unknown Employee'}
                        </p>
                        <p className="text-[11px] text-slate-400">{pred.employeeId?.employeeId}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {pred.employeeId?.Department || 'N/A'}
                    </td>

                    <td className="py-3.5 px-4">
                      <RiskBadge riskLevel={pred.riskLevel} />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pred.probabilityLeaving >= 70
                                ? 'bg-rose-500'
                                : pred.probabilityLeaving >= 30
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pred.probabilityLeaving}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {pred.probabilityLeaving}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(pred.createdAt).toLocaleDateString()} {new Date(pred.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {pred.employeeId?._id && (
                        <Link
                          to={`/employees/${pred.employeeId._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {(page - 1) * 12 + 1}–{Math.min(page * 12, total)} of {total} inferences
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Page {page} of {totalPages || 1}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
