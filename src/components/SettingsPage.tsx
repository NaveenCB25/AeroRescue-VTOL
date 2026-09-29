import { useState } from 'react';
import { BatteryCharging, Check, ChevronRight, Gauge, Radar, RotateCcw, Save, ShieldCheck, SlidersHorizontal, Wind } from 'lucide-react';

type ToggleKey = 'autoReturnHome' | 'geofenceProtection' | 'ncbSystem' | 'autoCharging' | 'chargingSimulation' | 'radarDetection' | 'detection360' | 'obstacleDetection' | 'autoRerouting' | 'noSafeRouteRth' | 'simulationMode' | 'windSimulation' | 'obstacleSimulation' | 'batterySimulation' | 'lowBattery' | 'radarWarning' | 'unsafeRoute' | 'gpsWarning';
type SettingsState = Record<ToggleKey, boolean> & { safeReturnBattery: number; additionalBattery: number };

const defaultSettings: SettingsState = {
  safeReturnBattery: 25, autoReturnHome: true, geofenceProtection: true,
  ncbSystem: true, autoCharging: true, additionalBattery: 49, chargingSimulation: true,
  radarDetection: true, detection360: true, obstacleDetection: true, autoRerouting: true, noSafeRouteRth: true,
  simulationMode: true, windSimulation: true, obstacleSimulation: true, batterySimulation: true,
  lowBattery: true, radarWarning: true, unsafeRoute: true, gpsWarning: true,
};

const groups: Array<{ title: string; subtitle: string; icon: typeof ShieldCheck; accent: string; controls: Array<{ label: string; key: ToggleKey }> }> = [
  { title: 'Mission Safety', subtitle: 'Failsafe and flight-boundary controls', icon: ShieldCheck, accent: 'emerald', controls: [{ label: 'Auto Return-to-Home', key: 'autoReturnHome' }, { label: 'Geofence Protection', key: 'geofenceProtection' }] },
  { title: 'NCB Technology', subtitle: 'Power reserve and autonomous charging', icon: BatteryCharging, accent: 'cyan', controls: [{ label: 'NCB System', key: 'ncbSystem' }, { label: 'Auto Charging', key: 'autoCharging' }, { label: 'Charging Simulation', key: 'chargingSimulation' }] },
  { title: 'Radar & Smart Navigation', subtitle: 'Obstacle awareness and route decisions', icon: Radar, accent: 'blue', controls: [{ label: 'Radar Detection', key: 'radarDetection' }, { label: '360° Detection', key: 'detection360' }, { label: 'Obstacle Detection', key: 'obstacleDetection' }, { label: 'Auto Rerouting', key: 'autoRerouting' }, { label: 'No Safe Route → RTH', key: 'noSafeRouteRth' }] },
  { title: 'Simulation', subtitle: 'Scenario inputs for mission testing', icon: Wind, accent: 'violet', controls: [{ label: 'Simulation Mode', key: 'simulationMode' }, { label: 'Wind Simulation', key: 'windSimulation' }, { label: 'Obstacle Simulation', key: 'obstacleSimulation' }, { label: 'Battery Simulation', key: 'batterySimulation' }] },
  { title: 'Alerts', subtitle: 'Operator warning notifications', icon: Gauge, accent: 'amber', controls: [{ label: 'Low Battery', key: 'lowBattery' }, { label: 'Radar Warning', key: 'radarWarning' }, { label: 'Unsafe Route', key: 'unsafeRoute' }, { label: 'GPS Warning', key: 'gpsWarning' }] },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return <button type="button" aria-label={enabled ? 'Disable setting' : 'Enable setting'} aria-pressed={enabled} onClick={onChange} className={`relative h-5 w-9 rounded-full border transition-colors ${enabled ? 'border-emerald-400/60 bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-slate-600 bg-slate-800'}`}><span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`} /></button>;
}

function RangeSetting({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div className="flex min-h-14 items-center gap-4 py-2.5"><span className="min-w-32 text-sm text-slate-300">{label}</span><input aria-label={label} type="range" min="10" max="80" value={value} onChange={event => onChange(Number(event.target.value))} className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 accent-blue-500" /><span className="w-10 text-right font-mono text-xs font-bold text-blue-300">{value}%</span></div>;
}

export function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => { setSettings(current => ({ ...current, [key]: value })); setSaved(false); };
  const accentClasses: Record<string, string> = { emerald: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/10', cyan: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/10', blue: 'text-blue-400 border-blue-500/25 bg-blue-500/10', violet: 'text-violet-400 border-violet-500/25 bg-violet-500/10', amber: 'text-amber-400 border-amber-500/25 bg-amber-500/10' };

  return <div className="h-full overflow-y-auto p-4 md:p-6"><div className="mx-auto max-w-6xl pb-6">
    <header className="mb-5 flex flex-col gap-4 border-b border-slate-800/80 pb-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400"><SlidersHorizontal size={13} /> System Configuration</div><h1 className="text-xl font-bold tracking-wide text-slate-100">Flight Systems Settings</h1><p className="mt-1 text-xs text-slate-500">Configure autonomous safety, navigation, simulation, and operator alerts.</p></div><div className="flex items-center gap-2 self-start rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400 sm:self-auto"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_#34d399]" /> System online</div></header>
    <div className="grid gap-4 lg:grid-cols-2">{groups.map(group => { const Icon = group.icon; return <section key={group.title} className="glass-card overflow-hidden"><div className="flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/25 px-4 py-3"><div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${accentClasses[group.accent]}`}><Icon size={16} /></div><div><h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">{group.title}</h2><p className="mt-0.5 text-[10px] text-slate-500">{group.subtitle}</p></div></div><div className="divide-y divide-slate-800/60 px-4">{group.title === 'Mission Safety' && <RangeSetting label="Safe Return Battery" value={settings.safeReturnBattery} onChange={value => update('safeReturnBattery', value)} />}{group.title === 'NCB Technology' && <RangeSetting label="Additional Battery" value={settings.additionalBattery} onChange={value => update('additionalBattery', value)} />}{group.controls.map(control => <div key={control.key} className="flex h-12 items-center justify-between gap-3"><span className="text-sm text-slate-300">{control.label}</span><div className="flex items-center gap-3"><span className={`text-[10px] font-bold ${settings[control.key] ? 'text-emerald-400' : 'text-slate-500'}`}>{settings[control.key] ? 'ON' : 'OFF'}</span><Toggle enabled={settings[control.key]} onChange={() => update(control.key, !settings[control.key])} /></div></div>)}</div></section>; })}</div>
    <footer className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-800/80 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className={`flex items-center gap-1.5 text-xs transition-colors ${saved ? 'text-emerald-400' : 'text-slate-600'}`}>{saved ? <><Check size={14} /> Configuration saved to this session</> : <><ChevronRight size={14} /> Changes are pending</>}</p><div className="flex gap-2"><button type="button" onClick={() => { setSettings(defaultSettings); setSaved(false); }} className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-slate-500 hover:text-white"><RotateCcw size={14} /> Reset</button><button type="button" onClick={() => setSaved(true)} className="btn-mission flex items-center gap-2 rounded-md border border-blue-400/50 bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-950/50"><Save size={14} /> Save Settings</button></div></footer>
  </div></div>;
}
