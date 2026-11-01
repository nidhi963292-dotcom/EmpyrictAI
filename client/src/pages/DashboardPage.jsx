import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  AlertTriangle,
  ShieldCheck,
  BrainCircuit,
  Sparkles,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Activity,
  BarChart3,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { MetricCard } from '../components/MetricCard';
import { RiskBadge } from '../components/RiskBadge';
import { TableSkeleton, CardSkeleton } from '../components/LoadingSkeleton';
import { EthicalDisclaimer } from '../components/EthicalDisclaimer';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activeField, setActiveField] = useState('Department');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, chartsRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getCharts()
        ]);
        setStats(statsRes.data);
        setCharts(chartsRes.data);
      } catch (err) {
        console.error('[Dashboard Error]', err);
        setError('Failed to load dashboard data. Please verify backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            HR Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time workforce attrition forecasting & AI retention decision support.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/employees/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add & Analyze Employee
          </Link>
        </div>
      </div>

      {/* Decision Support Compliance Notice */}
      <EthicalDisclaimer compact />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Workforce"
          value={stats?.totalEmployees || 0}
          subtitle="Monitored profiles"
          icon={Users}
          color="brand"
        />

        <MetricCard
          title="Employees at Risk"
          value={stats?.atRiskCount || 0}
          subtitle={`${stats?.atRiskPercentage || 0}% of active workforce`}
          icon={AlertTriangle}
          trend="up"
          trendLabel={`${stats?.highRiskCount || 0} High Priority`}
          color="rose"
        />

        <MetricCard
          title="Stable Retention"
          value={stats?.lowRiskCount || 0}
          subtitle="Low attrition likelihood"
          icon={ShieldCheck}
          trend="down"
          trendLabel="Safe Zone"
          color="emerald"
        />

        <MetricCard
          title="ML Model Accuracy"
          value={`${stats?.modelAccuracy || 86.05}%`}
          subtitle={stats?.activeModel || 'Logistic Regression'}
          icon={BrainCircuit}
          color="purple"
        />
      </div>

      {/* Charts Row 1: Risk Distribution & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Donut */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
              Attrition Risk Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Categorized by active ML risk thresholds
            </p>
          </div>

          <div className="h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.riskDistribution || []}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts?.riskDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {(charts?.riskDistribution || []).map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Multi-Field Attrition Rate Bar Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {activeField === 'Department' ? 'Department Attrition Analysis' : `${activeField} Workforce Analysis`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                At-Risk vs. Stable workforce headcount segmented by {activeField}
              </p>
            </div>

            {/* Field Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Segment by:</span>
              <select
                value={activeField}
                onChange={(e) => setActiveField(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="Department">Department</option>
                <option value="Age">Age</option>
                <option value="Attrition">Attrition</option>
                <option value="EducationField">Education Field</option>
                <option value="EmployeeCount">Employee Count</option>
                <option value="EnvironmentSatisfaction">Environment Satisfaction</option>
                <option value="Gender">Gender</option>
                <option value="JobLevel">Job Level</option>
                <option value="JobRole">Job Role</option>
                <option value="JobSatisfaction">Job Satisfaction</option>
                <option value="MonthlyIncome">Monthly Income</option>
              </select>
            </div>
          </div>

          <div className="h-72 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  charts?.fieldBreakdowns?.[activeField] ||
                  charts?.departmentBreakdown ||
                  []
                }
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#224d52" opacity={0.25} />
                <XAxis
                  dataKey="category"
                  stroke="#8db8be"
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#8db8be" fontSize={11} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0b1a1c',
                    borderColor: '#18565d',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)',
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

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Aggregated from live employee records</span>
            <Link to="/analytics" className="text-brand-500 font-semibold hover:underline flex items-center gap-1">
              View all 11 field charts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Global Attrition Drivers Banner */}
      {charts?.globalDrivers && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Top Global Machine Learning Drivers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mathematical weights computed from {charts.globalDrivers.model_name}
              </p>
            </div>
            <Link to="/analytics" className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1">
              Explore Explainability <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Positive Drivers (Risk) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                ▲ Top Factors Increasing Attrition
              </span>
              <div className="space-y-1.5">
                {(charts.globalDrivers.top_attrition_drivers || []).slice(0, 4).map((d) => (
                  <div
                    key={d.Feature}
                    className="flex justify-between items-center px-3 py-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{d.Feature}</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      +{typeof d.Importance === 'number' ? d.Importance.toFixed(3) : d.Importance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Protective Drivers (Retention) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                ▼ Top Factors Protecting Retention
              </span>
              <div className="space-y-1.5">
                {(charts.globalDrivers.top_retention_drivers || []).slice(0, 4).map((d) => (
                  <div
                    key={d.Feature}
                    className="flex justify-between items-center px-3 py-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{d.Feature}</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {typeof d.Importance === 'number' ? d.Importance.toFixed(3) : d.Importance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Row 2: Recent Predictions Table & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Predictions */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Model Inferences
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest employee risk scores processed
              </p>
            </div>
            <Link to="/predictions" className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1">
              All Predictions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <th className="py-2.5 font-semibold">Employee</th>
                  <th className="py-2.5 font-semibold">Department</th>
                  <th className="py-2.5 font-semibold">Risk Level</th>
                  <th className="py-2.5 font-semibold">Probability</th>
                  <th className="py-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {(charts?.recentPredictions || []).map((pred) => (
                  <tr key={pred._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 flex items-center gap-2.5">
                      <img
                        src={
                          pred.employeeId?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                            pred.employeeId?.name || 'Emp'
                          )}`
                        }
                        alt=""
                        className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {pred.employeeId?.name || 'Unknown'}
                        </p>
                        <p className="text-[10px] text-slate-400">{pred.employeeId?.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      {pred.employeeId?.Department || 'N/A'}
                    </td>
                    <td className="py-3">
                      <RiskBadge riskLevel={pred.riskLevel} size="sm" />
                    </td>
                    <td className="py-3">
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
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {pred.probabilityLeaving}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      {pred.employeeId?._id ? (
                        <Link
                          to={`/employees/${pred.employeeId._id}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
                        >
                          View Analysis
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Stream */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              System Audit Trail
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live activity & decision events
            </p>
          </div>

          <div className="space-y-3">
            {(charts?.recentActivity || []).slice(0, 5).map((act) => (
              <div key={act._id} className="flex items-start gap-3 text-xs pb-3 border-b border-slate-100 dark:border-slate-800/60 last:border-none">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0 shadow-sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                    {act.description}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.userName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
