import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'indigo',
  trend,
}) => {
  const accentClasses = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/40',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/40',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/40',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/40',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:border-rose-500/40',
  };

  const currentAccent = accentClasses[accentColor] || accentClasses.indigo;

  return (
    <div className="group relative bg-[#111827] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-black/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-1 font-mono tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border transition-colors ${currentAccent}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center text-xs text-slate-400">
          {trend && (
            <span className="text-emerald-400 font-semibold mr-1.5 flex items-center">
              {trend}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};
