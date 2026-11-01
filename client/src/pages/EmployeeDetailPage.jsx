import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Clock,
  DollarSign,
  Briefcase,
  MapPin,
  HeartHandshake,
  Calendar,
  Building,
  Award,
  RefreshCw
} from 'lucide-react';
import { employeeService } from '../services/employeeService';
import { predictionService } from '../services/predictionService';
import { aiService } from '../services/aiService';
import { RiskBadge } from '../components/RiskBadge';
import { CardSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import { EthicalDisclaimer } from '../components/EthicalDisclaimer';

export const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predictLoading, setPredictLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const res = await employeeService.getEmployeeById(id);
      setData(res.data);
    } catch (err) {
      setError('Failed to load employee profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const handleRunPrediction = async () => {
    try {
      setPredictLoading(true);
      await predictionService.predictEmployee(id);
      await fetchEmployeeData();
    } catch (err) {
      alert('Prediction failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setPredictLoading(false);
    }
  };

  const handleGenerateAiInsight = async () => {
    try {
      setAiLoading(true);
      await aiService.generateInsight(id);
      await fetchEmployeeData();
    } catch (err) {
      alert('AI Insight generation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!data?.employee) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Employee not found.</p>
        <Link to="/employees" className="text-brand-500 font-semibold hover:underline mt-2 inline-block">
          Return to Employee Directory
        </Link>
      </div>
    );
  }

  const { employee, predictions = [], aiInsights = [] } = data;
  const latestPrediction = predictions[0] || null;
  const latestInsight = aiInsights[0] || null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Navigation & Profile Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/employees"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3.5">
            <img
              src={
                employee.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(employee.name)}`
              }
              alt={employee.name}
              className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {employee.name}
                </h1>
                <RiskBadge
                  riskLevel={employee.currentPrediction?.riskLevel}
                  probability={employee.currentPrediction?.probabilityLeaving}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {employee.employeeId} • {employee.JobRole} ({employee.Department})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/employees/${employee._id}/edit`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Profile
          </Link>

          <button
            onClick={handleRunPrediction}
            disabled={predictLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            {predictLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <BrainCircuit className="w-3.5 h-3.5" />
            )}
            Run Prediction
          </button>
        </div>
      </div>

      {/* Decision Support Banner */}
      <EthicalDisclaimer compact />

      {/* Two Column ML + Groq Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML PREDICTION DOSSIER */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  ML Attrition Risk Forecast
                </h3>
                <p className="text-[11px] text-slate-400">
                  Model: {latestPrediction?.modelVersion || 'Logistic Regression v1.0'}
                </p>
              </div>
            </div>

            <RiskBadge
              riskLevel={latestPrediction?.riskLevel || employee.currentPrediction?.riskLevel}
              size="lg"
            />
          </div>

          {latestPrediction ? (
            <div className="space-y-5">
              {/* Probability Visual Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Probability of Leaving</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {latestPrediction.probabilityLeaving}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      latestPrediction.probabilityLeaving >= 70
                        ? 'bg-rose-500'
                        : latestPrediction.probabilityLeaving >= 30
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${latestPrediction.probabilityLeaving}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0% (Safe)</span>
                  <span>30% (Moderate)</span>
                  <span>70%+ (High Alert)</span>
                </div>
              </div>

              {/* Baseline ML Recommendation */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Baseline Recommendation:</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {latestPrediction.recommendation}
                </p>
              </div>

              {/* Top Quantitative Drivers (Explainability) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Individual Feature Attribution
                </h4>

                {/* Risk Drivers */}
                {latestPrediction.topRiskDrivers && latestPrediction.topRiskDrivers.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                      ▲ Primary Factors Increasing Attrition Score:
                    </p>
                    <div className="space-y-1">
                      {latestPrediction.topRiskDrivers.slice(0, 4).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-xs"
                        >
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {typeof item === 'string' ? item : item.feature}
                          </span>
                          {item.contribution && (
                            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                              +{item.contribution}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Protective Drivers */}
                {latestPrediction.topProtectiveFactors && latestPrediction.topProtectiveFactors.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ▼ Factors Supporting Retention:
                    </p>
                    <div className="space-y-1">
                      {latestPrediction.topProtectiveFactors.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs"
                        >
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {typeof item === 'string' ? item : item.feature}
                          </span>
                          {item.contribution && (
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {item.contribution}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-slate-400">No predictions have been recorded for this employee yet.</p>
              <button
                onClick={handleRunPrediction}
                disabled={predictLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
              >
                Run First Prediction
              </button>
            </div>
          )}
        </div>

        {/* GROQ AI RETENTION ROADMAP */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-5 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Groq AI Retention Strategy
                </h3>
                <p className="text-[11px] text-slate-400">
                  Model: openai/gpt-oss-20b (Reasoning Layer)
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerateAiInsight}
              disabled={aiLoading}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              title="Re-generate AI retention analysis"
            >
              {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </button>
          </div>

          {latestInsight ? (
            <div className="space-y-4 text-xs leading-relaxed overflow-y-auto max-h-[480px] pr-1">
              {/* Summary / Priority */}
              <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                <p className="font-bold text-purple-800 dark:text-purple-300 text-xs mb-1">
                  Executive HR Summary:
                </p>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {latestInsight.summary}
                </p>
              </div>

              {/* Key Risk Factors */}
              {latestInsight.keyRiskFactors && (
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Identified Risk Factors:
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 whitespace-pre-line">
                    {latestInsight.keyRiskFactors}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {latestInsight.recommendedActions && (
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Recommended HR Actions:
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 whitespace-pre-line">
                    {latestInsight.recommendedActions}
                  </div>
                </div>
              )}

              {/* Retention Strategy Roadmap */}
              {latestInsight.retentionStrategy && (
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Personalized Retention Strategy:
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 whitespace-pre-line">
                    {latestInsight.retentionStrategy}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-slate-400">No AI Retention Analysis generated yet.</p>
              <button
                onClick={handleGenerateAiInsight}
                disabled={aiLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              >
                Generate AI Retention Strategy
              </button>
            </div>
          )}

          <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <span>Generated: {latestInsight?.createdAt ? new Date(latestInsight.createdAt).toLocaleString() : 'N/A'}</span>
            <span>Decision Support Protocol</span>
          </div>
        </div>
      </div>

      {/* DETAILED 30-METRIC WORKFORCE ATTRIBUTES */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
          Workforce Attributes & Feature Snapshot
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Age & Gender</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.Age} yrs • {employee.Gender}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Marital Status</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.MaritalStatus}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Department</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.Department}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Job Role & Level</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.JobRole} (Lvl {employee.JobLevel})</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Monthly Income</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">${employee.MonthlyIncome?.toLocaleString()}/mo</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Salary Hike</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">+{employee.PercentSalaryHike}%</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">OverTime</p>
            <p className={`font-bold mt-0.5 ${employee.OverTime === 'Yes' ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
              {employee.OverTime}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Commute Distance</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.DistanceFromHome} km</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Job Satisfaction</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.JobSatisfaction}/4</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Environment Satisfaction</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.EnvironmentSatisfaction}/4</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Work-Life Balance</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.WorkLifeBalance}/4</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-slate-400 text-[11px]">Years at Company / Role</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{employee.YearsAtCompany} yrs / {employee.YearsInCurrentRole} yrs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
