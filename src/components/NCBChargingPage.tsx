import React, { useState } from 'react';
import {
  Wind,
  Zap,
  Cpu,
  BatteryCharging,
  Battery,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react';
import type { DroneMetrics } from '../types';

interface NCBChargingPageProps {
  metrics: DroneMetrics;
  onTriggerLowBattery: () => void;
  onTransferReservePower: () => void;
}

export const NCBChargingPage: React.FC<NCBChargingPageProps> = ({
  metrics,
  onTriggerLowBattery,
  onTransferReservePower,
}) => {
  const [customWindSpeed, setCustomWindSpeed] = useState<number>(metrics.airFlowSpeedKmh || 45);
  const [activeTabMode, setActiveTabMode] = useState<'overview' | 'architecture' | 'simulator'>('overview');

  const mainBat = metrics.mainBattery ?? metrics.battery ?? 95;
  const addBat = metrics.additionalBattery ?? 45;
  const isLowBat = mainBat <= 30 || metrics.isLowBatteryAlert;

  // Calculated values based on slider or live simulation
  const effectiveAirFlow = metrics.speed > 5 ? metrics.airFlowSpeedKmh : customWindSpeed;
  const calculatedRpm = Math.round(effectiveAirFlow * 48 + 320);
  const calculatedPower = +(effectiveAirFlow * 0.65).toFixed(1);

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-[#060b14] text-slate-100 p-4 gap-4">
      {/* HEADER BANNER */}
      <div className="glass-card p-6 border-blue-900/50 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-cyan-950/40 relative overflow-hidden">
        {/* Background glow & turbine motif */}
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                NCB TECHNOLOGY
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/30">
                CONCEPT SIMULATION
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide flex items-center gap-3">
              AUTOMATIC TOP CHARGING SYSTEM
              <Wind className="text-cyan-400 animate-spin" style={{ animationDuration: `${Math.max(1, 10 - effectiveAirFlow / 10)}s` }} size={24} />
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl">
              Simulated airflow harvesting top wind turbine generator powering a dual-battery architecture.
            </p>
          </div>

          {/* Nav pills */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTabMode('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTabMode === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Energy Flow & Status
            </button>
            <button
              onClick={() => setActiveTabMode('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTabMode === 'architecture' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hardware Diagram
            </button>
            <button
              onClick={() => setActiveTabMode('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTabMode === 'simulator' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Test Lab
            </button>
          </div>
        </div>

        {/* MANDATORY DISCLAIMER BOX */}
        <div className="mt-4 p-3 rounded-lg bg-slate-900/90 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-2.5">
          <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Software Simulation Disclaimer:</strong> This feature is strictly a software concept simulation for evaluating auxiliary energy harvesting ideas. It does NOT claim real physical charging performance, aerodynamic efficiency, or continuous infinite flight.
          </div>
        </div>
      </div>

      {/* SYSTEM LOW BATTERY WARNING (EXPLICIT USER REQUIREMENT) */}
      {isLowBat && (
        <div className="p-4 rounded-xl bg-red-950/90 border-2 border-red-500 text-red-100 shadow-2xl shadow-red-950/80 flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white font-bold">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-xs text-red-400 font-extrabold uppercase tracking-widest">Main Battery Low Warning</div>
              <div className="text-base font-extrabold font-mono text-white tracking-wider">
                LOW BATTERY → CHECK ADDITIONAL BATTERY → RETURN HOME if needed.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onTransferReservePower}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
            >
              <Zap size={14} /> Transfer Reserve Power ({addBat.toFixed(0)}%)
            </button>
          </div>
        </div>
      )}

      {/* ENERGY-FLOW DIAGRAM SECTION (REQUIRED: Air Flow → Wind Turbine → Charge Controller → Additional Battery) */}
      <div className="glass-card p-6 border-blue-950/60 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              NCB Energy Flow Schematic
            </h2>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Flow Rate: <span className="text-cyan-400 font-bold">{calculatedPower} W</span>
          </div>
        </div>

        {/* FLOW CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* STEP 1: AIR FLOW */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col gap-3 relative group hover:border-cyan-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300">STAGE 1</span>
              <Wind size={18} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Input</div>
              <div className="text-lg font-black text-white">Air Flow</div>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex justify-between font-mono">
                <span>Speed:</span>
                <span className="text-cyan-300 font-bold">{effectiveAirFlow.toFixed(1)} km/h</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Source:</span>
                <span className="text-slate-300">Drone Motion & Wind</span>
              </div>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block z-20 text-cyan-400">
              <ArrowRight size={20} className="animate-pulse" />
            </div>
          </div>

          {/* STEP 2: WIND TURBINE */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 flex flex-col gap-3 relative group hover:border-blue-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300">STAGE 2</span>
              <RefreshCw size={18} className="text-blue-400 animate-spin" style={{ animationDuration: `${Math.max(0.5, 8 - calculatedRpm / 500)}s` }} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Harvesting</div>
              <div className="text-lg font-black text-white">Wind Turbine</div>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex justify-between font-mono">
                <span>Rotor Speed:</span>
                <span className="text-blue-300 font-bold">{calculatedRpm.toLocaleString()} RPM</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Generator:</span>
                <span className="text-slate-300">Top Mag-Lev 3-Phase</span>
              </div>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block z-20 text-blue-400">
              <ArrowRight size={20} className="animate-pulse" />
            </div>
          </div>

          {/* STEP 3: CHARGE CONTROLLER */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex flex-col gap-3 relative group hover:border-indigo-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300">STAGE 3</span>
              <Cpu size={18} className="text-indigo-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Regulation</div>
              <div className="text-lg font-black text-white">Charge Controller</div>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex justify-between font-mono">
                <span>Regulation:</span>
                <span className="text-indigo-300 font-bold">MPPT Active</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Output Rate:</span>
                <span className="text-slate-300">{calculatedPower} W</span>
              </div>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block z-20 text-indigo-400">
              <ArrowRight size={20} className="animate-pulse" />
            </div>
          </div>

          {/* STEP 4: ADDITIONAL BATTERY */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex flex-col gap-3 relative group hover:border-emerald-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">STAGE 4</span>
              <BatteryCharging size={18} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Storage</div>
              <div className="text-lg font-black text-white">Additional Battery</div>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex justify-between font-mono">
                <span>Charge Level:</span>
                <span className="text-emerald-300 font-bold">{addBat.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Status:</span>
                <span className="text-emerald-400 font-semibold">Receiving Charge</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DUAL BATTERY COMPARISON & TELEMETRY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MAIN BATTERY CARD */}
        <div className="glass-card p-5 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                  <Battery size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Main Battery (Running)</h3>
                  <p className="text-[11px] text-slate-400">Supplies power to VTOL motors, sensors & flight control</p>
                </div>
              </div>
              <span className="font-mono text-xl font-extrabold text-white">{mainBat.toFixed(0)}%</span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  mainBat <= 30 ? 'bg-red-500 animate-pulse' : mainBat <= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${mainBat}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500">Discharge Rate</div>
                <div className="font-mono text-slate-200 font-bold">18.4 A</div>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500">Voltage Output</div>
                <div className="font-mono text-slate-200 font-bold">22.2 V (6S LiPo)</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Role: Flight & Propulsion Power</span>
            {isLowBat ? (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <AlertTriangle size={12} /> Low Power Warning
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> Normal Discharge
              </span>
            )}
          </div>
        </div>

        {/* ADDITIONAL BATTERY CARD */}
        <div className="glass-card p-5 border-cyan-950/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Additional Battery (Charging)</h3>
                  <p className="text-[11px] text-slate-400">Charges automatically using top wind energy harvesting</p>
                </div>
              </div>
              <span className="font-mono text-xl font-extrabold text-cyan-400">{addBat.toFixed(0)}%</span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 rounded-full"
                style={{ width: `${addBat}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500">Charging Rate</div>
                <div className="font-mono text-cyan-300 font-bold">+{calculatedPower} W</div>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500">Accumulated Energy</div>
                <div className="font-mono text-cyan-300 font-bold">{(metrics.energyGeneratedWh || 14.8).toFixed(1)} Wh</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Role: Reserve & Wind Energy Storage</span>
            <button
              onClick={onTransferReservePower}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline"
            >
              Route Power to Main Battery →
            </button>
          </div>
        </div>
      </div>

      {/* HARDWARE ARCHITECTURE DIAGRAM / INTERACTIVE LAB */}
      {activeTabMode === 'architecture' && (
        <div className="glass-card p-6 border-blue-950/60 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-400" />
            NCB Hardware Architecture Concept (Top Wind Turbine Mounting)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/80 p-6 rounded-xl border border-slate-800">
            {/* Top View Schematic Representation */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-xl border border-slate-800 text-center relative overflow-hidden">
              <div className="text-xs font-bold text-slate-400 uppercase mb-4">Top View — Airflow & Charging</div>
              <div className="relative w-48 h-48 rounded-full border-2 border-dashed border-cyan-500/40 flex items-center justify-center">
                {/* Rotors */}
                <div className="absolute top-2 left-2 w-10 h-10 rounded-full border border-slate-600 bg-slate-800/80" />
                <div className="absolute top-2 right-2 w-10 h-10 rounded-full border border-slate-600 bg-slate-800/80" />
                <div className="absolute bottom-2 left-2 w-10 h-10 rounded-full border border-slate-600 bg-slate-800/80" />
                <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full border border-slate-600 bg-slate-800/80" />
                {/* Central Top Turbine */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/30 animate-spin" style={{ animationDuration: '6s' }}>
                  <Wind size={28} className="text-white" />
                  <span className="text-[9px] font-black text-cyan-200 uppercase mt-1">Top Turbine</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 max-w-xs">
                Airflow directed into central top turbine converts kinetic energy into electrical energy during forward flight.
              </p>
            </div>

            {/* Side View Schematic Representation */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase mb-4">Side View — Working Mechanism</div>
              <div className="w-full max-w-xs p-4 bg-slate-900 rounded-xl border border-blue-900/50 space-y-3">
                <div className="p-2 bg-cyan-950/60 rounded border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2">
                  <Wind size={14} /> Top Wind Turbine Generator (Airflow Intake)
                </div>
                <div className="p-2 bg-indigo-950/60 rounded border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center gap-2">
                  <Cpu size={14} /> Charge Controller (Regulator)
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 bg-emerald-950/60 rounded border border-emerald-500/40 text-emerald-300 font-bold">
                    Main Battery (Running)
                  </div>
                  <div className="p-2 bg-blue-950/60 rounded border border-blue-500/40 text-blue-300 font-bold">
                    Additional Battery (Charging)
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 max-w-xs">
                Integrated dual-battery controller isolates main motor power while auto-charging secondary battery pod.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE TEST LAB */}
      {activeTabMode === 'simulator' && (
        <div className="glass-card p-6 border-blue-950/60 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders size={16} className="text-cyan-400" />
            NCB Simulation Controls & Stress Test
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            {/* Airflow slider */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Simulated Air Flow Speed:</span>
                <span className="text-cyan-400 font-mono font-bold text-sm">{customWindSpeed} km/h</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={customWindSpeed}
                onChange={e => setCustomWindSpeed(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 km/h (Hover/Idle)</span>
                <span>50 km/h (Cruise)</span>
                <span>100 km/h (Max Airflow)</span>
              </div>
            </div>

            {/* Test buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onTriggerLowBattery}
                className="w-full py-2.5 px-4 rounded-lg bg-red-900/40 hover:bg-red-800/60 border border-red-500/50 text-red-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <AlertTriangle size={15} /> Simulate Low Main Battery (Trigger LOW BATTERY Prompt)
              </button>

              <button
                onClick={onTransferReservePower}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/50 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Zap size={15} /> Transfer Reserve Energy to Main Battery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
