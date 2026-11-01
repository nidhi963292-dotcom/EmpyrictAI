import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BrainCircuit, Sun, Moon, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Animated3DBackground } from '../components/Animated3DBackground';

export const PublicLayout = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 dark:bg-slate-950 text-slate-900 dark:text-ivory-50 relative transition-colors duration-300">
      {/* 3D Animated Background */}
      <Animated3DBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-teal-100/80 dark:border-teal-900/40 shadow-3d-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-peach-300 flex items-center justify-center text-white shadow-glow-teal group-hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900 dark:text-ivory-50">
              Empyrict<span className="text-teal-500 dark:text-teal-400 font-extrabold">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-teal-100/75">
            <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">How It Works</a>
            <a href="#ai-insights" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">AI Insights</a>
            <a href="#benefits" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">Benefits</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl border border-teal-200/70 dark:border-teal-800/60 text-slate-600 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-slate-900 shadow-3d-sm transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-peach-300" /> : <Moon className="w-4 h-4 text-teal-700" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white shadow-3d-md shadow-teal-600/30 transition-all"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-2xl text-sm font-semibold text-slate-700 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white shadow-3d-md shadow-teal-600/30 hover:scale-105 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-teal-100 dark:border-teal-900/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl py-12 text-sm text-slate-500 dark:text-teal-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-peach-300 flex items-center justify-center text-white">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="font-black text-base text-slate-900 dark:text-ivory-50">
                Empyrict<span className="text-teal-500 dark:text-teal-400 font-extrabold">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-teal-200/70 max-w-sm leading-relaxed">
              Enterprise predictive workforce analytics and AI employee retention decision-support system.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-600 dark:text-teal-400 pt-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              Enterprise Data Security & Privacy Guaranteed
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-ivory-100 mb-3 text-xs uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-teal-500">Dashboard</Link></li>
              <li><Link to="/employees" className="hover:text-teal-500">Employee Directory</Link></li>
              <li><Link to="/predictions" className="hover:text-teal-500">Prediction Engine</Link></li>
              <li><Link to="/ai-insights" className="hover:text-teal-500">Groq AI Retention</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-ivory-100 mb-3 text-xs uppercase tracking-wider">
              Security & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="cursor-pointer hover:text-teal-500">Ethical AI Guidelines</span></li>
              <li><span className="cursor-pointer hover:text-teal-500">Privacy Policy</span></li>
              <li><span className="cursor-pointer hover:text-teal-500">Terms of Service</span></li>
              <li><span className="cursor-pointer hover:text-teal-500">Audit Compliance</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-teal-100 dark:border-teal-900/30 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-teal-400/60 gap-4">
          <p>© 2026 Empyrict-AI Systems. All rights reserved.</p>
          <p>Engineered with Oceanic Teal & Warm Sand Palette.</p>
        </div>
      </footer>
    </div>
  );
};
