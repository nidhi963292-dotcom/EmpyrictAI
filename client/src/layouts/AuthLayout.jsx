import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { BrainCircuit, Sparkles, Shield, TrendingUp, Users, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card3D } from '../components/Card3D';
import { Animated3DBackground } from '../components/Animated3DBackground';

export const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ivory-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      <Animated3DBackground />

      {/* Left Column: Visual Showcase & Brand Messaging */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-teal-950 via-slate-950 to-teal-900 text-white relative overflow-hidden shadow-3d-lg">
        {/* Abstract background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-peach-300/15 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-peach-300 flex items-center justify-center text-white shadow-glow-teal group-hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight flex items-center gap-1 text-white">
                Empyrict<span className="text-teal-400 font-extrabold">AI</span>
              </span>
              <span className="text-[10px] text-teal-200/80 block tracking-widest uppercase font-bold">
                Employee Intelligence Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Center Quote / Feature Highlights with 3D Tilt Card */}
        <div className="relative z-10 my-auto py-8 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-peach-300" />
            Predictive ML + Groq LLM Decision Support
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-ivory-50">
            Stop guessing employee turnover. Start retaining exceptional talent.
          </h2>

          <p className="text-sm text-teal-100/80 leading-relaxed font-normal">
            Empyrict-AI calculates calibrated attrition risk scores and generates proactive retention roadmaps across 30 workforce indicators.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Card3D className="p-4 rounded-2xl bg-teal-900/40 border border-teal-400/20 backdrop-blur-md shadow-3d-sm">
              <TrendingUp className="w-5 h-5 text-teal-300 mb-2" />
              <p className="text-2xl font-black text-white">86.05%</p>
              <p className="text-xs text-teal-200/70 font-medium">ML Prediction Accuracy</p>
            </Card3D>
            <Card3D className="p-4 rounded-2xl bg-teal-900/40 border border-peach-300/20 backdrop-blur-md shadow-3d-sm">
              <Users className="w-5 h-5 text-peach-300 mb-2" />
              <p className="text-2xl font-black text-white">Instant</p>
              <p className="text-xs text-peach-200/70 font-medium">AI Retention Roadmaps</p>
            </Card3D>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-teal-300/60 flex items-center justify-between font-medium">
          <span>© 2026 Empyrict-AI Systems.</span>
          <span className="flex items-center gap-1.5 text-teal-200">
            <Shield className="w-3.5 h-3.5 text-teal-400" /> Enterprise-Grade Security
          </span>
        </div>
      </div>

      {/* Right Column: Form Outlet */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative">
        {/* Top bar with theme switch & mobile home logo */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-peach-300 flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="font-black text-base text-slate-900 dark:text-white">
              Empyrict<span className="text-teal-500 font-extrabold">AI</span>
            </span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl border border-teal-200 dark:border-teal-900 text-slate-600 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-slate-900 shadow-3d-sm transition-colors ml-auto"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-peach-300" /> : <Moon className="w-4 h-4 text-teal-700" />}
          </button>
        </div>

        {/* Main Auth Form Outlet */}
        <div className="max-w-md w-full mx-auto my-auto">
          <Outlet />
        </div>

        {/* Subtle bottom note */}
        <div className="text-center text-xs text-slate-400 dark:text-teal-400/60 mt-8 font-medium">
          Protected by JWT authentication and bcrypt credential encryption.
        </div>
      </div>
    </div>
  );
};
