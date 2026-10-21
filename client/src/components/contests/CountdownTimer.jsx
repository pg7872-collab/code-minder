import React, { useState, useEffect } from 'react';

export const CountdownTimer = ({ targetDate, endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTime());

  function calculateTime() {
    const now = new Date().getTime();
    const start = new Date(targetDate).getTime();
    const end = endDate ? new Date(endDate).getTime() : start + 2 * 3600 * 1000;

    if (now < start) {
      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      return { status: 'UPCOMING', days, hours, minutes, seconds };
    } else if (now >= start && now <= end) {
      return { status: 'LIVE' };
    } else {
      return { status: 'COMPLETED' };
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, endDate]);

  if (timeLeft.status === 'LIVE') {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold animate-pulse">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        <span>LIVE NOW</span>
      </span>
    );
  }

  if (timeLeft.status === 'COMPLETED') {
    return (
      <span className="text-xs font-medium text-slate-500">Ended</span>
    );
  }

  return (
    <div className="flex items-center space-x-1 font-mono text-xs font-semibold text-cyan-400">
      {timeLeft.days > 0 && (
        <span className="bg-slate-900 border border-slate-700/80 px-1.5 py-0.5 rounded">
          {timeLeft.days}d
        </span>
      )}
      <span className="bg-slate-900 border border-slate-700/80 px-1.5 py-0.5 rounded">
        {String(timeLeft.hours).padStart(2, '0')}h
      </span>
      <span>:</span>
      <span className="bg-slate-900 border border-slate-700/80 px-1.5 py-0.5 rounded">
        {String(timeLeft.minutes).padStart(2, '0')}m
      </span>
      <span>:</span>
      <span className="bg-slate-900 border border-slate-700/80 px-1.5 py-0.5 rounded">
        {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    </div>
  );
};
