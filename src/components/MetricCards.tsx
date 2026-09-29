import React from 'react';
import { Battery, Zap, Wind, Mountain, Gauge, TrendingUp, TrendingDown, AlertTriangle, Cpu, Radio, ShieldAlert, Target } from 'lucide-react';
import type { DroneMetrics } from '../types';
import { getBatteryColor } from '../simulation';

interface MetricCardsProps {
  metrics: DroneMetrics;
}

interface CardProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  subLabel?: string;
  subValue?: string;
  accentColor: string;
  trend?: 'up' | 'down' | 'stable';
  children?: React.ReactNode;
}

const MetricCard: React.FC<CardProps> = ({
  id, icon, label, value, unit, subLabel, subValue, accentColor, trend, children
}) => (
  <div
    id={id}
    className="glass-card p-3 flex flex-col gap-2 relative overflow-hidden group transition-all duration-300 hover:scale-[1.01]"
    style={{ borderColor: `${accentColor}33` }}
  >
    {/* Background glow */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ background: `radial-gradient(circle at 20% 20%, ${accentColor}12, transparent 60%)` }}
    />

    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 min-w-0">
        <div
          className="p-1.5 rounded-lg shrink-0"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {icon}
        </div>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">{label}</span>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 shrink-0 ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
          {trend === 'up' ? <TrendingUp size={11} /> : trend === 'down' ? <TrendingDown size={11} /> : null}
        </div>
      )}
    </div>

    {/* Main value */}
    <div className="flex items-end gap-1">
      <span
        className="data-value text-2xl font-bold leading-none"
        style={{ color: accentColor, fontFamily: 'JetBrains Mono, monospace' }}
      >
        {value}
      </span>
      {unit && <span className="text-slate-500 text-xs font-medium mb-0.5 truncate">{unit}</span>}
    </div>

    {/* Sub info */}
    {subLabel && (
      <div className="flex items-center justify-between text-[10px] gap-1">
        <span className="text-slate-500 truncate">{subLabel}</span>
        <span className="text-slate-300 font-mono shrink-0">{subValue}</span>
      </div>
    )}

    {/* Custom children (e.g., battery bar) */}
    {children}

    {/* Decorative corner */}
    <div
      className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-full opacity-5 pointer-events-none"
      style={{ backgroundColor: accentColor }}
    />
  </div>
);

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const mainBat = metrics.mainBattery ?? metrics.battery ?? 95;
  const addBat = metrics.additionalBattery ?? 45;
  const mainBatteryColor = getBatteryColor(mainBat);

  return (
    <div className="flex flex-col gap-2.5">
      {/* EMERGENCY ALERTS */}
      {metrics.emergencyAlert && (
        <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/80 text-red-200 shadow-lg shadow-red-950/50 animate-pulse">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span className="text-xs font-extrabold tracking-wider text-red-300 uppercase">SYSTEM CRITICAL ALERT</span>
          </div>
          <div className="text-[11px] font-bold font-mono text-red-100 leading-tight">
            {metrics.emergencyAlert}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {/* Main Battery */}
        <MetricCard
          id="card-main-battery"
          icon={<Battery size={14} />}
          label="Main Battery %"
          value={mainBat.toFixed(0)}
          unit="%"
          subLabel="Powers Drone"
          subValue={`${Math.round((mainBat / 100) * 26)} min`}
          accentColor={mainBatteryColor}
          trend={mainBat > 80 ? 'stable' : 'down'}
        >
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${mainBat}%`,
                backgroundColor: mainBatteryColor,
                boxShadow: `0 0 8px ${mainBatteryColor}60`,
              }}
            />
          </div>
        </MetricCard>

        {/* Additional Battery */}
        <MetricCard
          id="card-add-battery"
          icon={<Zap size={14} />}
          label="Additional Battery %"
          value={addBat.toFixed(0)}
          unit="%"
          subLabel="Simulated Charge"
          subValue={metrics.chargingStatus === 'Active Charging' ? '⚡ Charging' : 'Standby'}
          accentColor="#06b6d4"
          trend={metrics.chargingStatus === 'Active Charging' ? 'up' : 'stable'}
        >
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${addBat}%`,
                backgroundColor: '#06b6d4',
                boxShadow: '0 0 8px #06b6d460',
              }}
            />
          </div>
        </MetricCard>

        {/* Charging Status & Energy Generated */}
        <MetricCard
          id="card-charging-status"
          icon={<Cpu size={14} />}
          label="Charging Status"
          value={metrics.chargingStatus ? (metrics.chargingStatus.startsWith('Active') ? 'Active' : 'Standby') : 'Standby'}
          unit=""
          subLabel="Sim. Energy Generated"
          subValue={`${(metrics.energyGeneratedWh ?? 14.8).toFixed(1)} Wh`}
          accentColor="#3b82f6"
          trend={metrics.chargingStatus === 'Active Charging' ? 'up' : 'stable'}
        >
          <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono bg-slate-900/60 px-2 py-0.5 rounded">
            <span>Power Rate:</span>
            <span className="text-blue-300 font-bold">{(metrics.chargePowerWatts ?? 0).toFixed(1)} W</span>
          </div>
        </MetricCard>

        {/* Wind / Turbine Status */}
        <MetricCard
          id="card-turbine-status"
          icon={<Wind size={14} />}
          label="Wind/Turbine Status"
          value={metrics.turbineRpm ?? 300}
          unit="RPM"
          subLabel="Simulated Air Flow"
          subValue={`${(metrics.airFlowSpeedKmh ?? 12).toFixed(0)} km/h`}
          accentColor="#10b981"
          trend={(metrics.turbineRpm ?? 300) > 1000 ? 'up' : 'stable'}
        >
          <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono bg-slate-900/60 px-2 py-0.5 rounded">
            <span>Status:</span>
            <span className="text-emerald-300 font-bold truncate">{metrics.turbineStatus ?? 'Standby'}</span>
          </div>
        </MetricCard>

        {/* Altitude */}
        <MetricCard
          id="card-altitude"
          icon={<Mountain size={14} />}
          label="Altitude"
          value={metrics.altitude.toFixed(0)}
          unit="m AGL"
          subLabel="Vert. Speed"
          subValue={`${metrics.altitude > 5 ? '+' : ''}${(metrics.speed * 0.05).toFixed(1)} m/s`}
          accentColor="#a78bfa"
        />

        {/* Speed */}
        <MetricCard
          id="card-speed"
          icon={<Gauge size={14} />}
          label="Speed"
          value={metrics.speed.toFixed(1)}
          unit="km/h"
          subLabel="Heading"
          subValue={`${metrics.heading.toFixed(0)}°`}
          accentColor="#f59e0b"
        />

        {/* GPS Status */}
        <MetricCard
          id="card-gps"
          icon={<Target size={14} />}
          label="Drone GPS"
          value={metrics.gpsSatellites}
          unit="Sats"
          subLabel="Accuracy"
          subValue={`±${metrics.gpsAccuracy.toFixed(1)}m`}
          accentColor="#6366f1"
          trend={metrics.gpsSatellites >= 12 ? 'up' : 'down'}
        />

        {/* Radar Detection Status */}
        <MetricCard
          id="card-radar"
          icon={<Radio size={14} />}
          label="Radar Status"
          value={metrics.radarStatus === 'Obstacle Detected' ? 'DETECT' : metrics.radarStatus === 'Returning' ? 'RTH' : 'CLEAR'}
          unit=""
          subLabel="Obstacle Avoidance"
          subValue={metrics.radarStatus === 'Clear' ? 'Monitoring' : 'Active'}
          accentColor={metrics.radarStatus === 'Clear' ? '#10b981' : '#ef4444'}
          trend={metrics.radarStatus === 'Clear' ? 'stable' : 'down'}
        >
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-blue-900/40 border border-blue-500/30 text-[8px] font-bold text-blue-300 uppercase tracking-wider">
            Future System
          </div>
        </MetricCard>

        {/* Route Safety */}
        <MetricCard
          id="card-route-safety"
          icon={<ShieldAlert size={14} />}
          label="Route Safety"
          value={metrics.routeSafety === 'Optimal' ? 'SAFE' : 'RISK'}
          unit=""
          subLabel="Condition"
          subValue={metrics.routeSafety || 'Optimal'}
          accentColor={metrics.routeSafety === 'Optimal' ? '#34d399' : '#f97316'}
          trend={metrics.routeSafety === 'Optimal' ? 'stable' : 'down'}
        />
      </div>
    </div>
  );
};


