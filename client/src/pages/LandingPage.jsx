import React from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Target,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  Lightbulb,
  Clock,
  Layers,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card3D } from '../components/Card3D';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Shimmering Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 shadow-3d-sm mb-6 animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-peach-400 animate-spin-slow" />
          <span>Next-Generation HR Intelligence & Retention</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-ivory-50 max-w-4xl mx-auto leading-[1.1]">
          AI-Powered Employee Intelligence for{' '}
          <span className="shimmer-text">
            Modern Enterprises
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-ivory-200/80 max-w-2xl mx-auto font-normal leading-relaxed">
          Forecast turnover risks with <strong className="text-teal-600 dark:text-teal-300 font-bold">86.05% accuracy</strong> and generate empathetic, data-backed retention roadmaps powered by <strong className="text-peach-600 dark:text-peach-300 font-bold">Groq AI</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-teal-600 via-teal-500 to-peach-400 hover:from-teal-500 hover:to-peach-300 text-white shadow-3d-md shadow-teal-600/30 hover:scale-105 transition-all duration-300"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-800 dark:text-ivory-100 border border-teal-200/80 dark:border-teal-800/60 shadow-3d-sm transition-all"
          >
            Explore Dashboard
          </Link>
        </div>

        {/* 3D INTERACTIVE HERO DEMO PREVIEW */}
        <div className="mt-16 max-w-5xl mx-auto">
          <Card3D className="glass-card rounded-3xl p-6 sm:p-10 border border-teal-200/80 dark:border-teal-800/60 shadow-3d-lg relative group">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
              {/* Left Column: Live Attrition Gauge Demo */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    High Attrition Risk Detected
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-ivory-50">
                  Alex Morgan • Senior Research Scientist
                </h3>
                <p className="text-xs text-slate-500 dark:text-teal-200/70">
                  R&D Department • 6 Years Tenure • Commute: 24 miles
                </p>

                {/* Risk Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-ivory-200">Attrition Probability</span>
                    <span className="text-rose-600 dark:text-rose-400">78.4% Leaving</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 via-peach-400 to-rose-500 transition-all duration-1000"
                      style={{ width: '78.4%' }}
                    />
                  </div>
                </div>

                {/* Top Drivers */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                    + OverTime Required
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-peach-50 dark:bg-peach-950/60 text-peach-700 dark:text-peach-300 border border-peach-200 dark:border-peach-900">
                    + Long Commute Distance
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900">
                    - High Base Income (Protective)
                  </span>
                </div>
              </div>

              {/* Right Column: AI Retention Plan Snapshot */}
              <div className="flex-1 p-5 rounded-2xl bg-teal-50/70 dark:bg-slate-850/90 border border-teal-200/70 dark:border-teal-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-peach-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-ivory-100">
                      Groq AI Strategic Retention Roadmap
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-peach-100 text-peach-800 dark:bg-peach-950 dark:text-peach-300">
                    Priority 1
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-ivory-200 leading-relaxed">
                  "Transition Alex to a hybrid 2-day remote schedule to mitigate the 24-mile commute fatigue, and balance project workload to eliminate uncompensated overtime."
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-800 text-slate-700 dark:text-teal-200 font-medium">
                    🗓 30-Day: Workload Audit
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-peach-100 dark:border-peach-900 text-slate-700 dark:text-peach-200 font-medium">
                    💼 60-Day: Career Pathing
                  </div>
                </div>
              </div>
            </div>
          </Card3D>
        </div>

        {/* Hero KPI Stat Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card3D className="glass-card rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-teal-600 dark:text-teal-400">86.05%</p>
            <p className="text-xs font-medium text-slate-500 dark:text-teal-200/70 mt-1">Prediction Accuracy</p>
          </Card3D>
          <Card3D className="glass-card rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-peach-500 dark:text-peach-300">30+</p>
            <p className="text-xs font-medium text-slate-500 dark:text-teal-200/70 mt-1">Workforce Indicators</p>
          </Card3D>
          <Card3D className="glass-card rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-teal-500 dark:text-teal-300">&lt; 1s</p>
            <p className="text-xs font-medium text-slate-500 dark:text-teal-200/70 mt-1">Inference Latency</p>
          </Card3D>
          <Card3D className="glass-card rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-peach-600 dark:text-peach-400">100%</p>
            <p className="text-xs font-medium text-slate-500 dark:text-teal-200/70 mt-1">Data-Backed Reasoning</p>
          </Card3D>
        </div>
      </section>

      {/* 2. PROBLEM STATEMENT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 text-white p-8 sm:p-14 relative overflow-hidden shadow-3d-lg border border-teal-800/40">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-peach-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-peach-300" /> The Cost of Unplanned Turnover
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-ivory-50">
              Losing top performers costs up to 200% of their annual salary.
            </h2>
            <p className="text-teal-100/80 text-sm sm:text-base leading-relaxed">
              Traditional HR operations only discover dissatisfaction during exit interviews—when it’s already too late. Empyrict-AI uncovers hidden friction points across workload, compensation, commute, and manager relationship to proactively safeguard your talent.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
            Engineered for People Leaders
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-ivory-50">
            Everything you need to predict, understand, and retain.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card3D className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-200 dark:border-teal-800">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-ivory-100">
              Calibrated ML Classification
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/70 leading-relaxed">
              Trained on comprehensive workforce parameters using Logistic Regression and Random Forest with balanced class weighting to handle real-world attrition imbalance.
            </p>
          </Card3D>

          <Card3D className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-peach-50 dark:bg-peach-950/80 text-peach-600 dark:text-peach-300 flex items-center justify-center border border-peach-200 dark:border-peach-800">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-ivory-100">
              Groq LLM Decision Support
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/70 leading-relaxed">
              Transforms dry mathematical risk probabilities into empathetic, pragmatic HR action plans with targeted 30/60/90 day retention milestones.
            </p>
          </Card3D>

          <Card3D className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-200 dark:border-teal-800">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-ivory-100">
              Explainability & Root Causes
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/70 leading-relaxed">
              No black boxes. Quantifies exact mathematical drivers—showing whether risk is triggered by overtime, commute distance, or promotion delays.
            </p>
          </Card3D>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
            Seamless Workflow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-ivory-50">
            From Employee Profile to Action Plan in Seconds
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Enter Employee Data',
              desc: 'Input 30 key parameters or upload batch CSV spreadsheets directly into the directory.'
            },
            {
              step: '02',
              title: 'ML Feature Pipeline',
              desc: 'Standardized scaling & one-hot encoding across 44 categorical features.'
            },
            {
              step: '03',
              title: 'Risk & Driver Scoring',
              desc: 'Calculates attrition probability and pinpoints top mathematical drivers.'
            },
            {
              step: '04',
              title: 'AI Retention Roadmap',
              desc: 'Groq AI synthesizes personalized managerial coaching & engagement strategies.'
            }
          ].map((item) => (
            <Card3D key={item.step} className="glass-card rounded-2xl p-6 relative">
              <span className="text-3xl font-black text-teal-500/30 dark:text-teal-400/30 block mb-2">
                {item.step}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-ivory-100 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-500 dark:text-teal-200/70 leading-relaxed">{item.desc}</p>
            </Card3D>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-peach-500 text-white p-8 sm:p-14 text-center space-y-6 shadow-3d-lg">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-ivory-50">
            Ready to empower your HR team with predictive intelligence?
          </h2>
          <p className="text-ivory-100/90 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Join modern organizations using Empyrict-AI to protect their talent and build high-retention workplace cultures.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold bg-white text-teal-900 hover:bg-ivory-100 shadow-3d-md hover:scale-105 transition-all"
            >
              Get Started Now <ArrowRight className="w-5 h-5 text-teal-600" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
