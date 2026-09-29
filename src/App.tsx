import { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { MetricCards } from './components/MetricCards';
import { MissionMap } from './components/MissionMap';
import { MissionControl } from './components/MissionControl';
import { MissionLogPanel } from './components/MissionLogPanel';
import { MissionHistory } from './components/MissionHistory';
import { GlobalDestinationSelector } from './components/GlobalDestinationSelector';
import { NCBChargingPage } from './components/NCBChargingPage';
import { SettingsPage } from './components/SettingsPage';
import { DashboardOverview } from './components/DashboardOverview';
import { useMission } from './hooks/useMission';
import { useMissionAlerts } from './hooks/useMissionAlerts';
import { formatTime } from './simulation';
import type { LatLng } from './types';

const tabFromHash = () => {
  const tab = window.location.hash.replace(/^#\/?/, '');
  return tab === 'mission-control' ? 'mission' : tab || 'dashboard';
};

const hashFromTab = (tab: string) => tab === 'mission' ? 'mission-control' : tab;

function App() {
  const [activeTab, setActiveTab] = useState(tabFromHash);
  const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()));
  const previousMissionStatus = useRef<string | null>(null);
  const previousRadarStatus = useRef<string | null>(null);
  const previousLowBattery = useRef<boolean | null>(null);
  const previousChargingStatus = useRef<string | null>(null);
  const { announce } = useMissionAlerts();

  const {
    mission,
    dronePos,
    droneMetrics,
    missionLogs,
    completedMissions,
    homeLocation,
    setHomeLocation,
    targetLocation,
    isSelectingTarget,
    setTargetLocation,
    setIsSelectingTarget,
    createMission,
    startMission,
    pauseMission,
    resumeMission,
    abortMission,
    returnHome,
    triggerRadarObstacle,
    resetMission,
    triggerLowBatteryTest,
    transferReservePower,
    missionProgress,
    elapsedSeconds,
  } = useMission();

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Each workspace has a stable URL so COMMAND and MONITOR can be opened side by side.
  useEffect(() => {
    const syncTabFromUrl = () => setActiveTab(tabFromHash());
    window.addEventListener('hashchange', syncTabFromUrl);
    return () => window.removeEventListener('hashchange', syncTabFromUrl);
  }, []);

  const selectTab = useCallback((tab: string) => {
    const hash = `#/${hashFromTab(tab)}`;
    if (window.location.hash !== hash) window.location.hash = hash;
    setActiveTab(tab);
  }, []);

  // Handle target location selection
  const handleTargetSelected = useCallback((latlng: LatLng) => {
    setTargetLocation(latlng);
    setIsSelectingTarget(false);
    announce('Destination selected', 'Destination selected. Review the mission setup and create the mission when ready.', 'info');
  }, [setTargetLocation, setIsSelectingTarget, announce]);

  // Handle set active target from Global Ops tab
  const handleGlobalTargetSet = useCallback((location: LatLng) => {
    setTargetLocation(location);
    selectTab('dashboard');
    announce('Destination selected', 'Global destination selected and ready for mission planning.', 'info');
  }, [setTargetLocation, selectTab, announce]);

  // Handle create mission
  const handleCreateMission = useCallback(() => {
    createMission();
  }, [createMission]);

  const handleStartMission = useCallback(() => {
    startMission();
    announce('Mission launch', 'Mission launch initiated. Drone motors are starting.', 'success');
  }, [startMission, announce]);

  const handlePauseResumeMission = useCallback(() => {
    if (mission?.status === 'paused') {
      resumeMission();
      announce('Mission resumed', 'Mission resumed. Autonomous flight is continuing.', 'success');
    } else {
      pauseMission();
      announce('Mission paused', 'Mission paused. The drone is holding its current mission state.', 'warning');
    }
  }, [mission?.status, pauseMission, resumeMission, announce]);

  const handleReturnHome = useCallback(() => {
    returnHome();
    announce('Return to home', 'Return to home initiated. The drone is returning to base.', 'warning');
  }, [returnHome, announce]);

  const handleAbortMission = useCallback(() => {
    abortMission();
    announce('Emergency abort', 'Emergency abort activated. Mission has been stopped by the commander.', 'critical');
  }, [abortMission, announce]);

  const handleSetTargetMode = useCallback(() => {
    setIsSelectingTarget(true);
  }, [setIsSelectingTarget]);

  // Simulation-originated events, such as radar hazards and automatic return-home, also receive alerts.
  useEffect(() => {
    const status = mission?.status ?? 'idle';
    const previous = previousMissionStatus.current;
    previousMissionStatus.current = status;
    if (activeTab !== 'mission' || previous === null || previous === status) return;

    if (status === 'returning_home_early') announce('Safety return home', 'No safe route is available. The drone is returning to home base.', 'critical');
    if (status === 'returning') announce('Return to home', 'Delivery verified. The drone is returning to home base.', 'info');
    if (status === 'completed') announce('Mission complete', 'Mission complete. Drone has landed safely at home base.', 'success');
  }, [mission?.status, activeTab, announce]);

  useEffect(() => {
    const radarStatus = droneMetrics.radarStatus ?? 'Clear';
    const previous = previousRadarStatus.current;
    previousRadarStatus.current = radarStatus;
    if (activeTab === 'mission' && previous && previous !== radarStatus && radarStatus === 'Obstacle Detected') {
      announce('Radar warning', 'Warning. Obstacle detected in the current flight path. Checking route safety.', 'critical');
    }
  }, [droneMetrics.radarStatus, activeTab, announce]);

  useEffect(() => {
    const isLow = Boolean(droneMetrics.isLowBatteryAlert || droneMetrics.mainBattery <= 30);
    const previous = previousLowBattery.current;
    previousLowBattery.current = isLow;
    if (activeTab === 'mission' && previous === false && isLow) {
      announce('Low battery warning', `Warning. Main battery is low at ${droneMetrics.mainBattery.toFixed(0)} percent. Check additional battery and return home if required.`, 'critical');
    }
  }, [droneMetrics.isLowBatteryAlert, droneMetrics.mainBattery, activeTab, announce]);

  useEffect(() => {
    const chargingStatus = droneMetrics.chargingStatus;
    const previous = previousChargingStatus.current;
    previousChargingStatus.current = chargingStatus;
    if (activeTab !== 'mission' || !previous || previous === chargingStatus) return;

    if (chargingStatus === 'Active Charging') {
      announce('NCB charging active', `NCB automatic top charging is active. Additional battery is ${droneMetrics.additionalBattery.toFixed(0)} percent.`, 'success');
    }
    if (previous === 'Active Charging' && chargingStatus !== 'Active Charging') {
      announce('NCB charging standby', 'NCB charging has moved to standby because airflow is low.', 'info');
    }
  }, [droneMetrics.chargingStatus, droneMetrics.additionalBattery, activeTab, announce]);

  return (
    <div className="dashboard-grid">
      {/* Sidebar — spans full height on left */}
      <div className="row-span-2 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={selectTab}
          missionCount={completedMissions.length}
        />
      </div>

      {/* Top Header */}
      <div className="overflow-hidden">
        <TopHeader
          missionStatus={mission?.status ?? 'idle'}
          currentTime={currentTime}
        />
      </div>

      {/* Main content area */}
      <main className="overflow-hidden bg-[#080c14] relative">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(37,99,235,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {activeTab === 'ncb' ? (
          /* NCB Technology — Automatic Top Charging System */
          <div className="h-full overflow-hidden">
            <NCBChargingPage
              metrics={droneMetrics}
              onTriggerLowBattery={triggerLowBatteryTest}
              onTransferReservePower={transferReservePower}
            />
          </div>
        ) : activeTab === 'global' ? (
          /* Global Destination & Airspace Selector Tab */
          <div className="h-full overflow-hidden">
            <GlobalDestinationSelector
              homeLocation={homeLocation}
              onSetAsActiveTarget={handleGlobalTargetSet}
            />
          </div>
        ) : activeTab === 'history' ? (
          /* History Tab */
          <div className="h-full overflow-y-auto p-5">
            <MissionHistory missions={completedMissions} />
          </div>
        ) : activeTab === 'settings' ? (
          <SettingsPage />
        ) : activeTab === 'settings-placeholder' ? (
          /* Settings Tab (placeholder) */
          <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-600">
            <div className="text-6xl">⚙️</div>
            <div className="text-lg font-semibold text-slate-400">Settings</div>
            <div className="text-sm text-slate-600 text-center max-w-xs">
              System configuration panel — available in production release
            </div>
          </div>
        ) : activeTab === 'dashboard' ? (
          <DashboardOverview
            mission={mission}
            metrics={droneMetrics}
            missionProgress={missionProgress}
            homeLocation={homeLocation}
            targetLocation={targetLocation}
            dronePos={dronePos}
            completedMissions={completedMissions}
            onNewMission={() => selectTab('mission')}
          />
        ) : (
          /* Mission Control — detailed command and control workspace */
          <div className="h-full overflow-y-auto overflow-x-hidden">
            
            {/* LEFT PANEL: Commander / Mission Control (Large Main Area) */}
            <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 p-4 min-w-0">
              {/* Mission Control Header */}
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                  <h1 className="text-lg font-bold text-slate-200 tracking-widest uppercase">
                    Command & Control
                  </h1>
                </div>
                
                {/* Simulation Disclaimer */}
                <div className="text-[9px] text-amber-500/80 border border-amber-900/40 bg-amber-950/20 px-2 py-1 rounded flex items-center">
                  <strong>SIMULATION:</strong>&nbsp;Radar, NCB charging & autonomous control are concept features.
                </div>
              </div>

              {/* Mission Control Layout: Top row for actions, Middle for Metrics, Bottom for Logs */}
              <div className="flex flex-col gap-5 min-w-0">
                
                {/* Actions & Status Column */}
                <div className="w-full flex flex-col gap-3 min-w-0">
                  <div className="glass-card p-4 sm:p-5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Commander / Mission Control</span>
                    </div>
                    <MissionControl
                      mission={mission}
                      homeLocation={homeLocation}
                      onSetHomeLocation={setHomeLocation}
                      targetLocation={targetLocation}
                      isSelectingTarget={isSelectingTarget}
                      missionProgress={missionProgress}
                      elapsedSeconds={elapsedSeconds}
                      onSetTargetMode={handleSetTargetMode}
                      onCreateMission={handleCreateMission}
                      onStartMission={handleStartMission}
                      onPauseMission={handlePauseResumeMission}
                      onResumeMission={handlePauseResumeMission}
                      onAbortMission={handleAbortMission}
                      onReturnHome={handleReturnHome}
                      onTriggerRadar={triggerRadarObstacle}
                      onReset={resetMission}
                      onGoToGlobalOps={() => selectTab('global')}
                    />
                  </div>
                </div>

                {/* Metrics & Logs Column */}
                <div className="flex flex-col gap-3 min-w-0">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Flight Telemetry & NCB Status</span>
                    </div>
                    <MetricCards metrics={droneMetrics} />
                  </div>
                  <div className="h-[300px]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Detailed Mission Log</span>
                    </div>
                    <div className="h-[260px]"><MissionLogPanel logs={missionLogs} /></div>
                  </div>
                </div>
                
              </div>
            </div>

            {/* RIGHT PANEL: Monitoring Map (Smaller Area) */}
            <div className="mx-auto w-full max-w-[1500px] flex flex-col gap-3 px-4 pb-8 bg-[#060910]">
              
              <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Monitoring Map</span>
              </div>

              <div className="mission-control-map relative rounded-xl overflow-hidden border border-slate-800/60 shadow-lg shadow-black/50">
                <MissionMap
                  homeLocation={homeLocation}
                  targetLocation={targetLocation}
                  dronePos={dronePos}
                  mission={mission}
                  isSelectingTarget={isSelectingTarget}
                  radarStatus={droneMetrics.radarStatus}
                  onTargetSelected={handleTargetSelected}
                />

                {/* Map overlay labels */}
                <div className="absolute top-3 right-3 z-[999] flex flex-col gap-2">
                  <div className="glass-card px-3 py-2.5 space-y-1.5">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Legend</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <div className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500 shrink-0" />
                      Home Base
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <div className="w-3 h-3 rounded-full bg-blue-500/40 border border-blue-500 shrink-0" />
                      Drone
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500 shrink-0" />
                      Target
                    </div>
                    {droneMetrics.radarStatus && droneMetrics.radarStatus !== 'Clear' && (
                       <div className="flex items-center gap-2 text-[10px] text-slate-400">
                         <div className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500 shrink-0" />
                         Obstacle
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
