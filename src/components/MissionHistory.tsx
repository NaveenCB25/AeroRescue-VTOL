import React from 'react';
import { History, CheckCircle2, Clock, Route, Package } from 'lucide-react';
import type { Mission } from '../types';
import { formatDuration } from '../simulation';

interface MissionHistoryProps {
  missions: Mission[];
}

export const MissionHistory: React.FC<MissionHistoryProps> = ({ missions }) => {
  if (missions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-600">
        <History size={32} strokeWidth={1} />
        <div className="text-center">
          <div className="text-sm font-medium text-slate-500">No completed missions</div>
          <div className="text-xs text-slate-600 mt-1">Complete your first mission to see history</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-white">Mission History</h2>
        <span className="text-xs font-semibold text-slate-400 px-2 py-1 bg-slate-800/60 rounded-lg">
          {missions.length} mission{missions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-blue-400 font-mono">{missions.length}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Total</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {missions.filter(m => m.payloadDelivered).length}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Delivered</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-purple-400 font-mono">
            {missions.reduce((sum, m) => sum + m.distanceKm * 2, 0).toFixed(1)}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">km flown</div>
        </div>
      </div>

      {/* Mission list */}
      {missions.map((mission) => (
        <div
          key={mission.id}
          className="glass-card p-4 border-l-4 transition-all hover:scale-[1.01]"
          style={{ borderLeftColor: '#10b981' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span className="text-sm font-bold text-white truncate">{mission.name}</span>
              </div>
              <div className="text-xs font-mono text-slate-500 mb-2">{mission.id}</div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={10} className="text-slate-500" />
                  <span>{formatDuration(mission.durationSeconds ?? 0)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Route size={10} className="text-slate-500" />
                  <span>{(mission.distanceKm * 2).toFixed(2)} km</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Package size={10} className={mission.payloadDelivered ? 'text-emerald-500' : 'text-red-500'} />
                  <span className={mission.payloadDelivered ? 'text-emerald-400' : 'text-red-400'}>
                    {mission.payloadDelivered ? 'Delivered ✓' : 'Not delivered'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>🎯</span>
                  <span className="truncate">{mission.targetLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                COMPLETED
              </span>
              <span className="text-[10px] text-slate-600 font-mono">
                {mission.completedAt?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
