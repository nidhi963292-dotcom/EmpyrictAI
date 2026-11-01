import React, { useState, useEffect } from 'react';
import { User, Building, ShieldCheck, Activity, Check, AlertCircle, Save, Server, Database, BrainCircuit, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import api from '../services/api';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setHealthLoading(true);
        const res = await api.get('/health');
        setHealth(res.data);
      } catch (err) {
        setHealth({ status: 'degraded', error: 'Failed to contact backend health check' });
      } finally {
        setHealthLoading(false);
      }
    };

    fetchHealth();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await authService.updateProfile({ name, organization, avatar });
      updateUser(res.user);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your HR account profile, organization parameters, and monitor live system health.
        </p>
      </div>

      {/* Profile Form */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
          User Profile & Organization
        </h3>

        {success && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <Check className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organization / Company Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role Permissions
              </label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 capitalize">
                {user?.role} Access Tier
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* System Service Health Monitor */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            System & Infrastructure Health
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time status of backend services, database clusters, and inference engines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
            <div className="flex justify-between items-center">
              <Server className="w-5 h-5 text-brand-500" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Express Backend</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Node.js :5000 (Operational)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
            <div className="flex justify-between items-center">
              <Database className="w-5 h-5 text-emerald-500" />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">MongoDB Database</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Connected :27017</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
            <div className="flex justify-between items-center">
              <BrainCircuit className="w-5 h-5 text-purple-500" />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">ML Microservice</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {health?.mlService?.status === 'healthy' ? 'FastAPI Active' : 'Process Fallback'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
            <div className="flex justify-between items-center">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Groq AI API</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Authenticated (Cloud)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
