import React, { useState } from 'react';
import {
  Crosshair,
  Play,
  RotateCcw,
  MapPin,
  AlertTriangle,
  Package,
  CheckCircle2,
  Clock,
  Route,
  Navigation,
  Globe,
  Pause,
  StopCircle,
  Home,
  Radio
} from 'lucide-react';
import type { Mission, LatLng } from '../types';
import { getMissionStatusInfo, formatDuration, AVAILABLE_HOMES } from '../simulation';

interface MissionControlProps {
  mission: Mission | null;
  homeLocation?: LatLng;
  onSetHomeLocation?: (loc: LatLng) => void;
  targetLocation: LatLng | null;
  isSelectingTarget: boolean;
  missionProgress: number;
  elapsedSeconds: number;
  onSetTargetMode: () => void;
  onCreateMission: () => void;
  onStartMission: () => void;
  onPauseMission: () => void;
  onResumeMission: () => void;
  onAbortMission: () => void;
  onReturnHome: () => void;
  onTriggerRadar: () => void;
  onReset: () => void;
  onGoToGlobalOps?: () => void;
}

const PHASES = [
  { key: 'idle', label: 'Pre-flight', icon: AlertTriangle },
  { key: 'launching', label: 'Launch', icon: Play },
  { key: 'en_route', label: 'En Route', icon: Navigation },
  { key: 'delivering', label: 'Delivery', icon: Package },
  { key: 'delivery_verified', label: 'Verified', icon: CheckCircle2 },
  { key: 'returning', label: 'RTH', icon: RotateCcw },
  { key: 'completed', label: 'Complete', icon: CheckCircle2 },
];

const PHASE_ORDER = ['idle', 'launching', 'en_route', 'delivering', 'delivery_verified', 'returning', 'completed'];

export const MissionControl: React.FC<MissionControlProps> = ({
  mission,
  homeLocation,
  onSetHomeLocation,
  targetLocation,
  isSelectingTarget,
  missionProgress,
  elapsedSeconds,
  onSetTargetMode,
  onCreateMission,
  onStartMission,
  onPauseMission,
  onResumeMission,
  onAbortMission,
  onReturnHome,
  onTriggerRadar,
  onReset,
  onGoToGlobalOps,
}) => {
  const [missionName, setMissionName] = useState('Emergency Rescue Mission');
  const [targetLabel, setTargetLabel] = useState('Target Zone Alpha');

  const statusInfo = getMissionStatusInfo(mission?.status ?? 'idle');
  const currentPhaseIdx = PHASE_ORDER.indexOf(mission?.status ?? 'idle');
  const canCreate = !!targetLocation && !mission;
  const canStart = !!mission && mission.status === 'idle';
  const isActive = mission && !['idle', 'completed', 'aborted'].includes(mission.status);
  const isCompleted = mission?.status === 'completed';
  const isPaused = mission?.status === 'paused';
  const canReturnHome = isActive && !['returning', 'returning_home_early', 'paused'].includes(mission?.status || '');
  const isEnRoute = mission?.status === 'en_route';

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">
      {/* Mission status badge */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-500"
        style={{
          backgroundColor: statusInfo.bgColor,
          borderColor: `${statusInfo.color}30`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: statusInfo.color,
              boxShadow: `0 0 8px ${statusInfo.color}`,
              animation: isActive ? 'status-pulse 1.5s ease-in-out infinite' : 'none',
            }}
          />
          <span className="text-sm font-bold tracking-widest" style={{ color: statusInfo.color }}>
            {statusInfo.label}
          </span>
        </div>
        {mission && (
          <span className="text-xs font-mono text-slate-400">{mission.id}</span>
        )}
      </div>

      {/* Mission progress bar */}
      {mission && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Mission Progress</span>
            <span className="font-mono">{missionProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${missionProgress}%`,
                background: `linear-gradient(90deg, #2563eb, #60a5fa)`,
                boxShadow: '0 0 8px rgba(96,165,250,0.4)',
              }}
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock size={11} />
            <span className="font-mono">Elapsed: {formatDuration(elapsedSeconds)}</span>
            {mission.distanceKm && (
              <>
                <Route size={11} className="ml-2" />
                <span className="font-mono">{mission.distanceKm} km</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Phase stepper */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-1 min-w-max">
          {PHASES.map((phase, idx) => {
            const isDone = currentPhaseIdx > idx;
            const isCurrent = currentPhaseIdx === idx && mission;
            const Icon = phase.icon;
            return (
              <React.Fragment key={phase.key}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300"
                    style={{
                      backgroundColor: isDone ? '#10b981' : isCurrent ? statusInfo.bgColor : 'transparent',
                      borderColor: isDone ? '#10b981' : isCurrent ? statusInfo.color : '#1e293b',
                      boxShadow: isCurrent ? `0 0 12px ${statusInfo.color}40` : 'none',
                    }}
                  >
                    <Icon
                      size={12}
                      style={{
                        color: isDone ? '#fff' : isCurrent ? statusInfo.color : '#334155',
                      }}
                    />
                  </div>
                  <span
                    className="text-[9px] font-semibold tracking-wide uppercase"
                    style={{
                      color: isDone ? '#10b981' : isCurrent ? statusInfo.color : '#334155',
                    }}
                  >
                    {phase.label}
                  </span>
                </div>
                {idx < PHASES.length - 1 && (
                  <div
                    className="h-px flex-1 min-w-[12px] transition-all duration-500"
                    style={{
                      backgroundColor: idx < currentPhaseIdx ? '#10b981' : '#1e293b',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mission setup — only show when no mission */}
      {!mission && (
        <div className="space-y-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/50">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mission Setup</div>

          {/* Mission name */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium block mb-1">
              Mission Name
            </label>
            <input
              id="input-mission-name"
              type="text"
              value={missionName}
              onChange={e => setMissionName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium placeholder-slate-600"
              placeholder="Enter mission name..."
            />
          </div>

          {/* Homebase Selection */}
          {homeLocation && onSetHomeLocation && (
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium block mb-1">
                Homebase Selection
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
                value={AVAILABLE_HOMES.find(h => h.lat === homeLocation.lat && h.lng === homeLocation.lng)?.id || AVAILABLE_HOMES[0].id}
                onChange={e => {
                  const selected = AVAILABLE_HOMES.find(h => h.id === e.target.value);
                  if (selected) {
                    onSetHomeLocation({ lat: selected.lat, lng: selected.lng });
                  }
                }}
              >
                {AVAILABLE_HOMES.map(home => (
                  <option key={home.id} value={home.id}>
                    {home.name} ({home.lat.toFixed(2)}, {home.lng.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Target label */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium block mb-1">
              Target Label
            </label>
            <input
              id="input-target-label"
              type="text"
              value={targetLabel}
              onChange={e => setTargetLabel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium placeholder-slate-600"
              placeholder="e.g. Flood Zone A..."
            />
          </div>

          {/* Target location button */}
          <button
            id="btn-select-target"
            onClick={onSetTargetMode}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
              isSelectingTarget
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : targetLocation
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-blue-500/40 hover:text-blue-300'
            }`}
          >
            <MapPin size={14} className={isSelectingTarget ? 'text-amber-400' : targetLocation ? 'text-emerald-400' : 'text-slate-500'} />
            {isSelectingTarget
              ? 'Click map to place target...'
              : targetLocation
              ? `Target set: ${targetLocation.lat.toFixed(3)}°, ${targetLocation.lng.toFixed(3)}°`
              : 'Select Target Location on Map'}
          </button>

          {/* Global Ops Button */}
          {onGoToGlobalOps && !mission && (
            <button
              onClick={onGoToGlobalOps}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-blue-950/30 border border-blue-900/50 text-blue-300 hover:bg-blue-900/40 hover:border-blue-500/40 transition-all group"
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Globe size={13} className="text-blue-400 group-hover:animate-spin-slow" />
                Select Global Target...
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold bg-blue-500/20 px-1.5 py-0.5 rounded border border-blue-500/30 text-blue-400">
                Future Feature
              </span>
            </button>
          )}
        </div>
      )}

      {/* Delivery verified banner */}
      {mission?.status === 'delivery_verified' && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-pulse">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <div>
            <div className="text-emerald-300 font-bold text-sm">✔ DELIVERY VERIFIED</div>
            <div className="text-emerald-400/70 text-xs">Payload confirmed at target site</div>
          </div>
        </div>
      )}

      {/* Completed banner */}
      {isCompleted && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <CheckCircle2 size={20} className="text-blue-400 shrink-0" />
          <div>
            <div className="text-blue-300 font-bold text-sm">Mission Completed</div>
            <div className="text-blue-400/70 text-xs">
              Duration: {formatDuration(elapsedSeconds)} · {mission?.distanceKm} km covered
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-2 mt-auto">
        {/* Create mission */}
        {!mission && (
          <button
            id="btn-create-mission"
            onClick={() => onCreateMission()}
            disabled={!canCreate}
            className={`btn-mission w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all border ${
              canCreate
                ? 'bg-blue-600/80 hover:bg-blue-600 border-blue-500/50 text-white shadow-lg shadow-blue-900/30'
                : 'bg-slate-800/50 border-slate-700/30 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Crosshair size={16} />
            Create Mission
          </button>
        )}

        {/* Start mission */}
        {canStart && (
          <button
            id="btn-start-mission"
            onClick={onStartMission}
            className="btn-mission w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-500/40 text-white shadow-lg shadow-blue-900/40 transition-all"
          >
            <Play size={16} className="fill-white" />
            START MISSION
          </button>
        )}

        {/* Active Mission Controls */}
        {isActive && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={isPaused ? onResumeMission : onPauseMission}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 text-slate-200 transition-all"
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              
              <button
                onClick={onAbortMission}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-400 transition-all"
              >
                <StopCircle size={14} />
                Abort
              </button>
            </div>
            
            <button
              onClick={onReturnHome}
              disabled={!canReturnHome}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                canReturnHome
                  ? 'bg-orange-600/20 hover:bg-orange-600/30 border-orange-500/30 text-orange-400'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Home size={14} />
              Return Home (RTH)
            </button>
            
            <button
              onClick={onTriggerRadar}
              disabled={!isEnRoute}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                isEnRoute
                  ? 'bg-amber-600/20 hover:bg-amber-600/30 border-amber-500/30 text-amber-400'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Radio size={14} />
              Simulate Radar Obstacle
            </button>
          </div>
        )}

        {/* Reset */}
        {(mission || targetLocation) && !isActive && (
          <button
            id="btn-reset-mission"
            onClick={onReset}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all border-red-900/40 text-red-400/70 hover:bg-red-900/10 hover:text-red-400 hover:border-red-500/30`}
          >
            <RotateCcw size={12} />
            {isCompleted || mission?.status === 'aborted' ? 'New Mission' : 'Reset'}
          </button>
        )}
      </div>
    </div>
  );
};
