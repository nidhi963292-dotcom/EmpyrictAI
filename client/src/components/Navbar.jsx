import React from 'react';
import { Menu, Sun, Moon, Sparkles, User, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ setIsMobileOpen }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 sticky top-0 z-30 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-b border-teal-100/70 dark:border-teal-900/40 flex items-center justify-between px-4 sm:px-6 shadow-3d-sm transition-all duration-300">
      {/* Left: Mobile hamburger & live badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 shadow-3d-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-spin-slow" />
            ML + Groq AI Live
          </span>
        </div>
      </div>

      {/* Right: Theme Toggle & User Profile */}
      <div className="flex items-center gap-3">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl text-slate-600 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-slate-800 border border-teal-200/60 dark:border-teal-800/60 transition-all duration-200 shadow-3d-sm"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-peach-300" /> : <Moon className="w-4 h-4 text-teal-700" />}
        </button>

        {/* User quick pill */}
        {user && (
          <div className="flex items-center gap-2.5 pl-2">
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
              }
              alt={user.name}
              className="w-8 h-8 rounded-full border border-teal-500/40 bg-teal-100 dark:bg-slate-800"
            />
            <span className="hidden md:inline-block text-xs font-bold text-slate-800 dark:text-ivory-100">
              {user.name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
