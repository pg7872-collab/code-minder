import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
    error: {
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/80',
      text: 'text-rose-200',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
    },
    info: {
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-950/80',
      text: 'text-indigo-200',
      icon: Info,
      iconColor: 'text-indigo-400',
    },
  };

  const current = typeConfig[type] || typeConfig.info;
  const Icon = current.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-md">
      <div
        className={`flex items-start space-x-3 p-4 rounded-xl border ${current.border} ${current.bg} backdrop-blur-md shadow-xl text-sm`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${current.iconColor}`} />
        <div className={`flex-1 ${current.text}`}>{message}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
