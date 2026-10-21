import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  Trophy,
  FileText,
  Bot,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'DSA Tracker', path: '/questions', icon: Code2 },
  { name: 'Contests', path: '/contests', icon: Trophy },
  { name: 'Resume Analyzer', path: '/resume', icon: FileText, badge: 'AI' },
  { name: 'AI Interview', path: '/interviews', icon: Bot, badge: 'AI' },
  { name: 'Profile & Stats', path: '/profile', icon: UserCheck },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const totalSolved = user?.stats?.totalSolved || 0;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between py-4">
      {/* Navigation Links */}
      <div className="space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Quick Metric / Promo */}
      <div className="px-3 pt-4 border-t border-slate-800">
        {!isCollapsed ? (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-[#111827] border border-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                DSA Progress
              </span>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {totalSolved} solved
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, (totalSolved / 150) * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Target: 150 Core Patterns</p>
          </div>
        ) : (
          <div className="flex justify-center" title={`${totalSolved} problems solved`}>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xs font-mono font-bold text-indigo-400">
              {totalSolved}
            </div>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex justify-end mt-3">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-16 bottom-0 z-30 bg-[#0B0F19] border-r border-slate-800 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-[#0B0F19] border-r border-slate-800 shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
