import React from 'react';
import {
  LayoutDashboard,
  Crosshair,
  Globe,
  History,
  Settings,
  Radio,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  missionCount: number;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ncb', label: 'NCB Charging', icon: Zap },
  { id: 'global', label: 'Global Ops', icon: Globe },
  { id: 'mission', label: 'Mission Control', icon: Crosshair },
  { id: 'history', label: 'Mission History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, missionCount }) => {
  return (
    <aside className="flex flex-col h-full bg-[#060b14] border-r border-blue-950/60 overflow-hidden min-w-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-3 border-b border-blue-950/60 shrink-0">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-900/50 shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L8 8H4L6 12L2 14L6 16L4 20H8L12 22L16 20H20L18 16L22 14L18 12L20 8H16L12 2Z" fill="white" opacity="0.9"/>
            <circle cx="12" cy="12" r="3" fill="#60a5fa"/>
          </svg>
          <div className="absolute inset-0 rounded-lg bg-blue-500/20 animate-pulse" />
        </div>
        <div className="min-w-0">
          <div className="text-white font-bold text-sm leading-tight tracking-wide truncate">AeroRescue</div>
          <div className="text-blue-400 text-[9px] font-medium tracking-widest uppercase truncate">VTOL Control</div>
        </div>
      </div>

      {/* System status */}
      <div className="mx-2 mt-2 mb-1 px-2.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="relative shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-ring" />
          </div>
          <span className="text-emerald-400 text-[10px] font-semibold tracking-wide truncate">SYSTEM ONLINE</span>
        </div>
        <div className="text-emerald-300/60 text-[9px] mt-0.5 font-mono">SIM MODE ACTIVE</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto min-h-0">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`sidebar-${id}`}
            onClick={() => onTabChange(id)}
            className={`sidebar-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all group ${
              activeTab === id
                ? 'active bg-blue-600/20 border-l-2 border-blue-400 pl-[10px] text-blue-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon size={15} className={activeTab === id ? 'text-blue-400 shrink-0' : 'text-slate-500 group-hover:text-slate-300 shrink-0'} />
            <span className="text-xs font-medium flex-1 truncate">{label}</span>
            {id === 'history' && missionCount > 0 && (
              <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center shrink-0">
                {missionCount}
              </span>
            )}
            {activeTab === id && <ChevronRight size={11} className="text-blue-400 ml-auto shrink-0" />}
          </button>
        ))}
      </nav>

      {/* Signal strength */}
      <div className="mx-2 mb-2 px-2.5 py-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 shrink-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Radio size={11} className="text-blue-400 shrink-0" />
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider truncate">Uplink Signal</span>
        </div>
        <div className="flex items-end gap-0.5 h-4">
          {[0.3, 0.5, 0.7, 0.85, 1].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-blue-500 transition-all"
              style={{ height: `${h * 100}%`, opacity: i < 5 ? 1 : 0.2 }}
            />
          ))}
        </div>
        <div className="text-blue-300 text-[9px] font-mono mt-1">99% — 2.4 GHz</div>
      </div>

      {/* Version */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-t border-blue-950/60 shrink-0">
        <Zap size={9} className="text-blue-500 shrink-0" />
        <span className="text-[9px] text-slate-600 font-mono truncate">v2.1.0-SIH · 2026</span>
      </div>
    </aside>
  );
};
