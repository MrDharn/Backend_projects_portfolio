import React from 'react';

export default function AdminMetrics({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <span className="text-xs text-slate-400">Total Unique Visitors</span>
        <div className="text-2xl font-bold text-cyan-400 mt-1">
          {metrics.metrics?.totalVisitors || 0}
        </div>
      </div>
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <span className="text-xs text-slate-400">Total Asset Downloads</span>
        <div className="text-2xl font-bold text-emerald-400 mt-1">
          {metrics.metrics?.totalDownloads || 0}
        </div>
      </div>
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <span className="text-xs text-slate-400">Unread Messages</span>
        <div className="text-2xl font-bold text-amber-400 mt-1">
          {metrics.metrics?.unreadMessages || 0}
        </div>
      </div>
    </div>
  );
}