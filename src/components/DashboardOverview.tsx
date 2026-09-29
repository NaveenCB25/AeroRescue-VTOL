import React from 'react';
import { Activity, Battery, Crosshair, MapPin, Navigation, Radar, Route, Satellite, Wind, Zap } from 'lucide-react';
import type { DroneMetrics, LatLng, Mission } from '../types';
import { getBatteryColor, getMissionStatusInfo } from '../simulation';
import { MissionMap } from './MissionMap';

interface DashboardOverviewProps {
  mission: Mission | null;
  metrics: DroneMetrics;
  missionProgress: number;
  homeLocation: LatLng;
  targetLocation: LatLng | null;
  dronePos: LatLng;
  completedMissions: Mission[];
  onNewMission: () => void;
}

const StatusTile: React.FC<{ icon: React.ReactNode; label: string; value: string; detail?: string; color: string }> = ({ icon, label, value, detail, color }) => (
  <div className="glass-card p-3 min-w-0">
    <div className="flex items-center gap-2 text-slate-500">
      <span style={{ color }}>{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider truncate">{label}</span>
    </div>
    <div className="mt-2 flex items-baseline gap-1 min-w-0">
      <span className="text-lg leading-none font-bold font-mono truncate" style={{ color }}>{value}</span>
    </div>
    {detail && <div className="mt-1 text-[10px] text-slate-500 truncate">{detail}</div>}
  </div>
);

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  mission, metrics, missionProgress, homeLocation, targetLocation, dronePos, completedMissions, onNewMission,
}) => {
  const status = getMissionStatusInfo(mission?.status ?? 'idle');
  const mainBattery = metrics.mainBattery ?? metrics.battery;
  const recent = completedMissions[0];
  const destination = mission?.targetLabel || (targetLocation ? 'Target selected — ready to configure' : 'No destination selected');
  const radarClear = metrics.radarStatus === 'Clear' || !metrics.radarStatus;

  return (
    <div className="h-full overflow-y-auto p-4 dashboard-overview">
      <div className="mx-auto max-w-[1500px] space-y-3">
        <header className="flex items-center justify-between gap-4 border-b border-slate-800/60 pb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="text-[10px] font-bold tracking-[0.18em] text-emerald-400 uppercase">System Online</span>
            </div>
            <h1 className="mt-1 text-lg font-bold tracking-widest text-slate-200 uppercase">Drone Monitoring Overview</h1>
            <p className="text-[11px] text-slate-500">Current aircraft, mission and energy status</p>
          </div>
          <button onClick={onNewMission} className="btn-mission shrink-0 flex items-center gap-2 rounded-lg border border-blue-500/50 bg-blue-600/80 px-3.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-900/30 hover:bg-blue-600">
            <Crosshair size={15} /> New Mission
          </button>
        </header>

        <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
          <StatusTile icon={<Activity size={14} />} label="Mission Status" value={status.label} detail={mission?.id || 'No active mission'} color={status.color} />
          <StatusTile icon={<Battery size={14} />} label="Main Battery" value={`${mainBattery.toFixed(0)}%`} detail="Primary flight power" color={getBatteryColor(mainBattery)} />
          <StatusTile icon={<Zap size={14} />} label="Additional Battery" value={`${metrics.additionalBattery.toFixed(0)}%`} detail="NCB reserve energy" color="#22d3ee" />
          <StatusTile icon={<Zap size={14} />} label="NCB Charging" value={metrics.chargingStatus.startsWith('Active') ? 'ACTIVE' : 'STANDBY'} detail={`${metrics.chargePowerWatts.toFixed(1)} W simulated input`} color={metrics.chargingStatus.startsWith('Active') ? '#34d399' : '#60a5fa'} />
          <StatusTile icon={<Radar size={14} />} label="Radar Status" value={radarClear ? 'CLEAR' : 'WARNING'} detail={radarClear ? 'Route monitoring active' : metrics.radarStatus} color={radarClear ? '#34d399' : '#f59e0b'} />
          <StatusTile icon={<Satellite size={14} />} label="GPS Status" value={`${metrics.gpsSatellites} SATS`} detail={`Accuracy ±${metrics.gpsAccuracy.toFixed(1)} m`} color="#818cf8" />
          <StatusTile icon={<Navigation size={14} />} label="Altitude" value={`${metrics.altitude.toFixed(0)} m`} detail="Above ground level" color="#c084fc" />
          <StatusTile icon={<Wind size={14} />} label="Speed" value={`${metrics.speed.toFixed(1)} km/h`} detail={`Heading ${metrics.heading.toFixed(0)}°`} color="#fbbf24" />
        </section>

        <section className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-slate-400"><MapPin size={14} className="text-blue-400" /><span className="text-[10px] font-bold uppercase tracking-wider">Current Mission / Destination</span></div>
                <div className="mt-2 truncate text-sm font-semibold text-slate-200">{destination}</div>
                <div className="mt-1 text-[11px] text-slate-500">{mission ? `${mission.distanceKm} km planned route` : 'Use New Mission to open the command screen.'}</div>
              </div>
              <Navigation size={24} className="shrink-0 text-blue-500/60" />
            </div>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-[11px] text-slate-500"><span className="font-semibold uppercase tracking-wider">Mission Progress</span><span className="font-mono">{mission ? missionProgress : 0}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500" style={{ width: `${mission ? missionProgress : 0}%` }} /></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800/70 pt-3">
              <div><div className="text-[10px] uppercase tracking-wider text-slate-500">Route Safety</div><div className="mt-1 text-xs font-bold text-emerald-400">{metrics.routeSafety || 'Optimal'}</div></div>
              <div><div className="text-[10px] uppercase tracking-wider text-slate-500">Emergency Alerts</div><div className={`mt-1 text-xs font-bold ${metrics.emergencyAlert ? 'text-red-400' : 'text-emerald-400'}`}>{metrics.emergencyAlert || 'None'}</div></div>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-800/60 px-4 py-3"><Route size={14} className="text-blue-400" /><span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Recent Mission Summary</span></div>
            <div className="p-4 text-xs">
              {recent ? <><div className="font-semibold text-slate-200 truncate">{recent.name}</div><div className="mt-2 grid grid-cols-2 gap-y-2 text-slate-500"><span>Mission ID</span><span className="font-mono text-right text-slate-300">{recent.id}</span><span>Route</span><span className="text-right text-slate-300">{recent.distanceKm} km</span><span>Result</span><span className="text-right font-semibold text-emerald-400">Completed</span></div></> : <div className="py-3 text-center text-slate-500">No completed missions yet.</div>}
            </div>
          </div>
        </section>

        <section className="glass-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/60 px-4 py-3"><div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Monitoring Map</span></div><span className="text-[10px] text-slate-500">Overview only</span></div>
          <div className="dashboard-map"><MissionMap homeLocation={homeLocation} targetLocation={targetLocation} dronePos={dronePos} mission={mission} isSelectingTarget={false} radarStatus={metrics.radarStatus} onTargetSelected={() => undefined} /></div>
        </section>
      </div>
    </div>
  );
};
