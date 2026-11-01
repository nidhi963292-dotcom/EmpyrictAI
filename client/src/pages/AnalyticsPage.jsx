import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Filter,
  Users,
  Grid
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { CardSkeleton } from '../components/LoadingSkeleton';

export const AnalyticsPage = () => {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState('Age');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getCharts();
        setCharts(res.data);
      } catch (err) {
        console.error('[Analytics Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const fieldBreakdowns = charts?.fieldBreakdowns || {};
  const globalDrivers = charts?.globalDrivers || {};

  // List of all requested fields with clean titles and icons/descriptions
  const allFields = [
    { key: 'Age', label: 'Age', desc: 'Attrition across age brackets' },
    { key: 'Attrition', label: 'Attrition', desc: 'Overall risk ratio & workforce retention' },
    { key: 'Department', label: 'Department', desc: 'R&D, Sales, Human Resources' },
    { key: 'EducationField', label: 'Education Field', desc: 'Life Sciences, Medical, Marketing, etc.' },
    { key: 'EmployeeCount', label: 'Employee Count', desc: 'Workforce distribution across units' },
    { key: 'EnvironmentSatisfaction', label: 'Environment Satisfaction', desc: 'Ratings 1 (Low) to 4 (Very High)' },
    { key: 'Gender', label: 'Gender', desc: 'Female vs Male retention rates' },
    { key: 'JobLevel', label: 'Job Level', desc: 'Seniority tiers (Level 1 to 5)' },
    { key: 'JobRole', label: 'Job Role', desc: '9 specialized organizational roles' },
    { key: 'JobSatisfaction', label: 'Job Satisfaction', desc: 'Ratings 1 (Low) to 4 (Very High)' },
    { key: 'MonthlyIncome', label: 'Monthly Income', desc: 'Salary brackets (< $3k to $15k+)' }
  ];

  const currentFieldData = fieldBreakdowns[selectedField] || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-brand-500" /> Multi-Field Workforce Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore individual employee attrition distributions across all 11 key demographic, role, and satisfaction metrics.
        </p>
      </div>

      {/* FEATURED: INTERACTIVE MULTI-FIELD EXPLORER */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" /> Interactive Field Explorer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any of the 11 fields below to inspect real-time workforce breakdowns and risk ratios.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Selected Field:</span>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-brand-600 dark:text-brand-400 focus:ring-2 focus:ring-brand-500/50"
            >
              {allFields.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {allFields.map((f) => {
            const isActive = selectedField === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setSelectedField(f.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Selected Field Chart & Data Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Main Bar Chart */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {selectedField} Attrition Analysis (Stable vs. At Risk)
              </span>
              <span className="text-slate-400">Green = Stable • Red = At Risk</span>
            </div>

            <div className="h-80 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentFieldData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#224d52" opacity={0.25} />
                  <XAxis
                    dataKey="category"
                    stroke="#8db8be"
                    fontSize={11}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis stroke="#8db8be" fontSize={11} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#0b1a1c',
                      borderColor: '#18565d',
                      borderRadius: '14px',
                      color: '#fdfbf7',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="safe" name="Stable" fill="#2a8693" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="atRisk" name="At Risk" fill="#e05353" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Segment Statistics Table */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-teal-300/80">
              {selectedField} Category Summary
            </span>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {currentFieldData.map((item) => (
                <div
                  key={item.category}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-teal-100 dark:border-teal-900/40 text-xs space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-ivory-100">{item.category}</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                        item.attritionRate > 30
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                      }`}
                    >
                      {item.attritionRate}% At Risk
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-teal-200/70">
                    <span>Total: <strong>{item.total}</strong></span>
                    <span>Stable: <strong className="text-teal-600 dark:text-teal-300">{item.safe}</strong></span>
                    <span>At-Risk: <strong className="text-rose-600 dark:text-rose-400">{item.atRisk}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ALL 11 FIELDS GRID VIEW */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Grid className="w-4 h-4 text-brand-500" /> All 11 Parameter Breakdown Charts
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Side-by-side view comparing retention across each demographic, organizational, and job satisfaction parameter.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allFields.map((field) => {
            const data = fieldBreakdowns[field.key] || [];
            return (
              <div
                key={field.key}
                className={`glass-card rounded-2xl p-5 space-y-3 transition-all duration-200 ${
                  selectedField === field.key ? 'ring-2 ring-teal-500 shadow-3d-md' : 'hover:shadow-3d-md'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{field.label}</h3>
                    <p className="text-[11px] text-slate-400">{field.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40">
                    {data.length} categories
                  </span>
                </div>

                <div className="h-52 my-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#224d52" opacity={0.2} />
                      <XAxis
                        dataKey="category"
                        stroke="#8db8be"
                        fontSize={9}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                      />
                      <YAxis stroke="#8db8be" fontSize={9} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: '#0b1a1c',
                          borderColor: '#18565d',
                          borderRadius: '12px',
                          color: '#fdfbf7',
                          fontSize: '11px'
                        }}
                      />
                      <Bar dataKey="safe" name="Stable" fill="#2a8693" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="atRisk" name="At Risk" fill="#e05353" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Stable vs. At Risk</span>
                  <button
                    onClick={() => {
                      setSelectedField(field.key);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-brand-500 font-semibold hover:underline text-[10px]"
                  >
                    Focus in Explorer ↑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ML MODEL EXPLAINABILITY COEFFICIENTS TABLE */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Machine Learning Feature Contribution Weights
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global standardized coefficients ({globalDrivers.model_name || 'Logistic Regression'}) indicating directional influence on employee turnover log-odds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Positive Weights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              ▲ High Positive Weights (Increases Attrition Odds)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-2 font-semibold">Rank</th>
                    <th className="py-2 font-semibold">Feature Name</th>
                    <th className="py-2 font-semibold text-right">Impact Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {(globalDrivers.top_attrition_drivers || []).map((d, i) => (
                    <tr key={d.Feature} className="hover:bg-rose-50/30 dark:hover:bg-rose-950/20">
                      <td className="py-2.5 font-mono text-slate-400">#{i + 1}</td>
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">{d.Feature}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                        +{typeof d.Importance === 'number' ? d.Importance.toFixed(4) : d.Importance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Negative Weights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              ▼ High Negative Weights (Protects Retention)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-2 font-semibold">Rank</th>
                    <th className="py-2 font-semibold">Feature Name</th>
                    <th className="py-2 font-semibold text-right">Impact Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {(globalDrivers.top_retention_drivers || []).map((d, i) => (
                    <tr key={d.Feature} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20">
                      <td className="py-2.5 font-mono text-slate-400">#{i + 1}</td>
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">{d.Feature}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {typeof d.Importance === 'number' ? d.Importance.toFixed(4) : d.Importance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
