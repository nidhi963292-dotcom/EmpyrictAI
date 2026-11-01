import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@empyrict.ai');
      setPassword('Admin@123');
    } else {
      setEmail('hr@empyrict.ai');
      setPassword('Admin@123');
    }
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Sign in to your Empyrict-AI analytics dashboard.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Banner */}
      <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200/60 dark:border-brand-800/60 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" /> One-Click Demo Access:
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleDemoFill('admin')}
            className="flex-1 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-brand-300 dark:border-brand-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-brand-500 hover:text-white transition-all text-center"
          >
            Admin (admin@empyrict.ai)
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('hr')}
            className="flex-1 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-brand-300 dark:border-brand-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-brand-500 hover:text-white transition-all text-center"
          >
            HR (hr@empyrict.ai)
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgot(!showForgot)}
              className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>

        {showForgot && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
            For local security, password resets can be requested from your organization administrator, or use the demo buttons above.
          </div>
        )}

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">Remember me for 30 days</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Don’t have an account yet?{' '}
        <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
          Create organization account
        </Link>
      </p>
    </div>
  );
};
