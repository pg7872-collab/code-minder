import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code2,
  Flame,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const streak = user?.stats?.currentStreak || 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Code Minder
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  AI Pro
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Actions, Streaks, User Menu */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Coding Streak Pill */}
          <div
            title={`${streak} Day Streak! Keep the momentum going.`}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold cursor-default"
          >
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{streak}d Streak</span>
          </div>

          {/* Target Role Tag (Desktop) */}
          {user?.targetRole && (
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span className="truncate max-w-[150px]">{user.targetRole}</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-300" />}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
            >
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user?.name || 'User')}`
                }
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full border border-indigo-500/40 bg-slate-800 object-cover"
              />
              <span className="hidden sm:inline-block text-sm font-medium text-slate-200">
                {user?.name?.split(' ')[0] || 'Developer'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111827] border border-slate-700/80 shadow-2xl py-2 z-20 text-sm">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>Developer Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    <span>Settings & Target Role</span>
                  </Link>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
