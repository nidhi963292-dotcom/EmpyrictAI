import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BrainCircuit,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Add Employee', path: '/employees/new', icon: UserPlus },
    { name: 'Predictions', path: '/predictions', icon: BrainCircuit },
    { name: 'AI Insights', path: '/ai-insights', icon: Sparkles },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-teal-100/80 dark:border-teal-900/40 shadow-3d-md transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo & Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-teal-100/70 dark:border-teal-900/40">
          <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-peach-300 flex items-center justify-center text-white shadow-glow-teal shrink-0 group-hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-black text-base tracking-tight text-slate-900 dark:text-ivory-50 flex items-center gap-1">
                  Empyrict<span className="text-teal-500 dark:text-teal-400 font-extrabold">AI</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-teal-700/60 dark:text-teal-300/60">
                  Enterprise HR
                </span>
              </div>
            )}
          </NavLink>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-3d-sm shadow-teal-600/30'
                      : 'text-slate-600 dark:text-teal-100/70 hover:bg-teal-50/80 dark:hover:bg-teal-950/40 hover:text-teal-700 dark:hover:text-teal-200'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-teal-100/70 dark:border-teal-900/40 space-y-2">
          {user && !isCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-teal-50/70 dark:bg-slate-850/80 border border-teal-200/60 dark:border-teal-800/40 shadow-3d-sm">
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
                }
                alt={user.name}
                className="w-9 h-9 rounded-full bg-teal-200 dark:bg-slate-700 shrink-0 border border-teal-400/40"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-ivory-50 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-teal-300/70 truncate capitalize flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-500" />
                  {user.role} • {user.organization || 'HR'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
