import React from 'react';
import { Bell, Wifi, Clock, Shield } from 'lucide-react';
import type { MissionStatus } from '../types';
import { getMissionStatusInfo } from '../simulation';

interface TopHeaderProps {
  missionStatus: MissionStatus;
  currentTime: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ missionStatus, currentTime }) => {
  const statusInfo = getMissionStatusInfo(missionStatus);
  const isActive = !['idle', 'completed'].includes(missionStatus);

  return (
    <header className="flex items-center justify-between px-4 h-full bg-[#060b14]/90 backdrop-blur-md border-b border-blue-950/60 z-10 min-w-0 overflow-hidden gap-2">
      {/* Left: Title */}
      <div className="flex items-center gap-3 shrink-0 min-w-0">
        <div className="min-w-0">
          <h1 className="text-white font-bold text-sm leading-tight tracking-wide truncate">
            Mission Control Dashboard
          </h1>
          <p className="text-slate-500 text-[10px] font-medium hidden sm:block">AeroRescue-VTOL Operator Interface</p>
        </div>

        {/* Simulation mode badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 status-active" />
          <span className="text-amber-300 text-[10px] font-bold tracking-widest uppercase">
            Sim Mode
          </span>
        </div>
      </div>

      {/* Center: Mission Status */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 shrink-0"
        style={{
          color: statusInfo.color,
          backgroundColor: statusInfo.bgColor,
          borderColor: `${statusInfo.color}40`,
          boxShadow: isActive ? `0 0 15px ${statusInfo.color}25` : 'none',
        }}
      >
        {isActive && (
          <div
            className="w-1.5 h-1.5 rounded-full status-active"
            style={{ backgroundColor: statusInfo.color }}
          />
        )}
        <span className="text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">{statusInfo.label}</span>
      </div>

      {/* Right: Status indicators */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Clock */}
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-slate-500" />
          <span className="text-slate-300 text-[11px] font-mono">{currentTime}</span>
        </div>

        {/* Connection quality */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-800/60">
          <Wifi size={12} className="text-emerald-400" />
          <span className="text-emerald-400 text-[10px] font-semibold">CONNECTED</span>
        </div>

        {/* Security indicator */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-800/60">
          <Shield size={12} className="text-blue-400" />
          <span className="text-blue-400 text-[10px] font-semibold">SECURE</span>
        </div>

        {/* Notifications */}
        <button
          id="notifications-btn"
          className="relative p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
          aria-label="Notifications"
        >
          <Bell size={14} />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>
      </div>
    </header>
  );
};
