import React from 'react';
import { Calendar, Clock, Bookmark, ExternalLink } from 'lucide-react';
import { PlatformBadge } from '../common/Badge.jsx';
import { CountdownTimer } from './CountdownTimer.jsx';

export const ContestCard = ({ contest, onToggleBookmark }) => {
  const startDate = new Date(contest.startTime);
  const formattedDate = startDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const durationHours = (contest.durationSeconds / 3600).toFixed(1).replace('.0', '');

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <PlatformBadge platform={contest.platform} />
          <button
            onClick={() => onToggleBookmark(contest)}
            className={`p-1.5 rounded-lg border transition-colors ${
              contest.isBookmarked
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
            }`}
            title={contest.isBookmarked ? 'Bookmarked' : 'Bookmark this contest'}
          >
            <Bookmark
              className={`w-4 h-4 ${contest.isBookmarked ? 'fill-indigo-400' : ''}`}
            />
          </button>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-3">
          {contest.title}
        </h4>

        {/* Details */}
        <div className="space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {formattedDate} at {formattedTime}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Duration: {durationHours} hours</span>
          </div>
        </div>
      </div>

      {/* Footer Countdown & Link */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <CountdownTimer targetDate={contest.startTime} endDate={contest.endTime} />
        </div>

        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-xs font-semibold text-slate-300 transition-colors"
        >
          <span>Register / Enter</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
