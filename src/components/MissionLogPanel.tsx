import React, { useRef, useEffect } from 'react';
import { Terminal, Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { MissionLog } from '../types';
import { formatTime } from '../simulation';

interface MissionLogPanelProps {
  logs: MissionLog[];
}

const iconMap = {
  info: <Info size={11} className="text-blue-400 shrink-0 mt-0.5" />,
  success: <CheckCircle2 size={11} className="text-emerald-400 shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={11} className="text-amber-400 shrink-0 mt-0.5" />,
  error: <XCircle size={11} className="text-red-400 shrink-0 mt-0.5" />,
};

const colorMap = {
  info: 'text-slate-300',
  success: 'text-emerald-300',
  warning: 'text-amber-300',
  error: 'text-red-300',
};

export const MissionLogPanel: React.FC<MissionLogPanelProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/60">
        <Terminal size={14} className="text-blue-400" />
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Mission Log</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-slate-500 font-mono">{logs.length} events</span>
        </div>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5" id="mission-log-container">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-600">
            <Terminal size={20} />
            <span className="text-xs">Awaiting mission events...</span>
          </div>
        ) : (
          [...logs].reverse().map((log, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-[11px] group"
              style={{
                animation: idx === 0 ? 'count-up 0.2s ease-out' : 'none',
              }}
            >
              {iconMap[log.type]}
              <div className="flex-1 min-w-0">
                <span className="text-slate-600 font-mono mr-2">{formatTime(log.timestamp)}</span>
                <span className={`${colorMap[log.type]} font-medium`}>{log.event}</span>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
