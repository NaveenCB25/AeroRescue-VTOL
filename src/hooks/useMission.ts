import { useState, useEffect, useRef, useCallback } from 'react';
import type { Mission, MissionStatus, DroneMetrics, MissionLog, LatLng } from '../types';
import {
  haversineDistance,
  interpolateLatLng,
  bearing,
  generateMissionId,
  simulateGpsNoise,
  DEFAULT_HOME,
} from '../simulation';

// Simulation tick rate (ms)
const TICK_MS = 200;

// Phase durations (ticks)
const LAUNCH_TICKS = 15;       // ~3s
const DELIVER_TICKS = 20;      // ~4s
const VERIFY_TICKS = 15;       // ~3s

interface UseMissionReturn {
  mission: Mission | null;
  dronePos: LatLng;
  droneMetrics: DroneMetrics;
  missionLogs: MissionLog[];
  completedMissions: Mission[];
  homeLocation: LatLng;
  setHomeLocation: (loc: LatLng) => void;
  targetLocation: LatLng | null;
  isSelectingTarget: boolean;
  setTargetLocation: (loc: LatLng) => void;
  setIsSelectingTarget: (v: boolean) => void;
  createMission: (targetLabel?: string) => void;
  startMission: () => void;
  pauseMission: () => void;
  resumeMission: () => void;
  abortMission: () => void;
  returnHome: () => void;
  triggerRadarObstacle: () => void;
  resetMission: () => void;
  triggerLowBatteryTest: () => void;
  transferReservePower: () => void;
  missionProgress: number; // 0-100
  elapsedSeconds: number;
}

type SharedMissionSnapshot = {
  type: 'mission-snapshot';
  updatedAt: number;
  mission: Mission | null;
  dronePos: LatLng;
  droneMetrics: DroneMetrics;
  missionLogs: MissionLog[];
  completedMissions: Mission[];
  homeLocation: LatLng;
  targetLocation: LatLng | null;
  isSelectingTarget: boolean;
  missionProgress: number;
  elapsedSeconds: number;
};

const SHARED_MISSION_CHANNEL = 'aerorescue-vtol-mission';
const SHARED_MISSION_STORAGE = 'aerorescue-vtol-mission-state';

const restoreMissionDates = (mission: Mission | null): Mission | null => mission ? {
  ...mission,
  createdAt: new Date(mission.createdAt),
  completedAt: mission.completedAt ? new Date(mission.completedAt) : undefined,
} : null;

const restoreSnapshot = (snapshot: SharedMissionSnapshot): SharedMissionSnapshot => ({
  ...snapshot,
  mission: restoreMissionDates(snapshot.mission),
  completedMissions: snapshot.completedMissions.map(mission => restoreMissionDates(mission) as Mission),
  missionLogs: snapshot.missionLogs.map(log => ({ ...log, timestamp: new Date(log.timestamp) })),
});

function initialMetrics(): DroneMetrics {
  return {
    battery: 95,
    mainBattery: 95,
    additionalBattery: 45,
    chargingStatus: 'Standby (Low Airflow)',
    energyGeneratedWh: 14.8,
    chargePowerWatts: 0,
    turbineStatus: 'Standby (300 RPM)',
    turbineRpm: 300,
    airFlowSpeedKmh: 12,
    gpsAccuracy: 1.2,
    gpsSatellites: 12,
    altitude: 0,
    speed: 0,
    heading: 0,
    signal: 99,
    isLowBatteryAlert: false,
    radarStatus: 'Clear',
    routeSafety: 'Optimal',
    emergencyAlert: null,
  };
}

export function useMission(): UseMissionReturn {
  const [mission, setMission] = useState<Mission | null>(null);
  const [dronePos, setDronePos] = useState<LatLng>(DEFAULT_HOME);
  const [droneMetrics, setDroneMetrics] = useState<DroneMetrics>(initialMetrics());
  const [missionLogs, setMissionLogs] = useState<MissionLog[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Mission[]>([]);
  const [homeLocation, setHomeLocation] = useState<LatLng>(DEFAULT_HOME);
  const [targetLocation, setTargetLocation] = useState<LatLng | null>(null);
  const [isSelectingTarget, setIsSelectingTarget] = useState(false);
  const [missionProgress, setMissionProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const syncChannelRef = useRef<BroadcastChannel | null>(null);
  const syncReadyRef = useRef(false);
  const applyingRemoteSnapshotRef = useRef(false);
  const latestSnapshotRef = useRef<SharedMissionSnapshot | null>(null);
  const latestSnapshotAtRef = useRef(0);

  // Simulation state refs
  const simState = useRef({
    status: 'idle' as MissionStatus,
    phaseTick: 0,
    enRouteTick: 0,
    returnTick: 0,
    globalTick: 0,
    elapsed: 0,
    enRouteTicksTotal: 0,
    returnTicksTotal: 0,
    totalTicks: 0,
    isPaused: false,
    radarTriggered: false,
    radarResolved: false,
  });

  const addLog = useCallback((event: string, type: MissionLog['type'] = 'info') => {
    setMissionLogs(prev => [
      { timestamp: new Date(), event, type },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const stopSimulation = useCallback(() => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
  }, []);

  const updateStatus = useCallback((m: Mission, status: MissionStatus): Mission => {
    return { ...m, status };
  }, []);

  const createMission = useCallback((targetLabel?: string) => {
    if (!targetLocation) return;
    const dist = haversineDistance(homeLocation, targetLocation);
    const newMission: Mission = {
      id: generateMissionId(),
      name: targetLabel || 'Emergency Rescue Mission',
      createdAt: new Date(),
      status: 'idle',
      homeLocation: homeLocation,
      targetLocation,
      targetLabel: targetLabel || 'Target Zone',
      distanceKm: +dist.toFixed(2),
      payloadDelivered: false,
    };
    setMission(newMission);
    setDronePos(homeLocation);
    setDroneMetrics(initialMetrics());
    setMissionLogs([]);
    setMissionProgress(0);
    setElapsedSeconds(0);
    
    simState.current = {
      status: 'idle',
      phaseTick: 0,
      enRouteTick: 0,
      returnTick: 0,
      globalTick: 0,
      elapsed: 0,
      enRouteTicksTotal: Math.max(50, Math.round((dist / 60) * 3600 / (TICK_MS / 1000))),
      returnTicksTotal: Math.max(50, Math.round((dist / 60) * 3600 / (TICK_MS / 1000))),
      totalTicks: 0,
      isPaused: false,
      radarTriggered: false,
      radarResolved: false,
    };
    simState.current.totalTicks = LAUNCH_TICKS + simState.current.enRouteTicksTotal + DELIVER_TICKS + VERIFY_TICKS + simState.current.returnTicksTotal;

    addLog(`Mission ${newMission.id} created`, 'info');
    addLog(`Target: ${newMission.targetLabel} (${dist.toFixed(2)} km away)`, 'info');
    addLog('Pre-flight checks complete — awaiting launch command', 'success');
  }, [targetLocation, addLog]);

  const startSimulationLoop = useCallback(() => {
    if (simulationRef.current) return; // already running

    simulationRef.current = setInterval(() => {
      const state = simState.current;
      if (state.isPaused) return;

      if (['completed', 'aborted'].includes(state.status)) {
        stopSimulation();
        return;
      }

      state.globalTick++;
      state.elapsed += TICK_MS / 1000;
      setElapsedSeconds(Math.round(state.elapsed));
      setMissionProgress(Math.min(99, Math.round((state.globalTick / state.totalTicks) * 100)));

      const home = homeLocation;
      const target = targetLocation!;

      // Update metrics every tick
      setDroneMetrics(prev => {
        const batteryDrain =
          state.status === 'idle' || state.status === 'completed' ? 0 :
          state.status === 'delivering' || state.status === 'delivery_verified' ? 0.04 :
          0.08;
        const currentMain = prev.mainBattery ?? prev.battery;
        const newMainBattery = Math.max(0, +(currentMain - batteryDrain).toFixed(2));
        const isLowAlert = newMainBattery <= 30;

        const isFlying = ['launching', 'en_route', 'delivering', 'returning', 'returning_home_early'].includes(state.status);
        const targetAlt = state.status === 'launching' ? 75 : ['returning', 'returning_home_early'].includes(state.status) && state.returnTick > state.returnTicksTotal * 0.85 ? 5 : 75;
        const altDelta = targetAlt - prev.altitude;
        const newAlt = isFlying ? +(prev.altitude + altDelta * 0.15 + (Math.random() - 0.5) * 1.5).toFixed(1) : 0;

        const targetSpeed = state.status === 'en_route' ? 58 + (Math.random() - 0.5) * 6
          : ['returning', 'returning_home_early'].includes(state.status) ? 55 + (Math.random() - 0.5) * 5
          : state.status === 'launching' ? 10 + state.phaseTick * 2
          : 0;
        const newSpeed = isFlying ? +(prev.speed + (targetSpeed - prev.speed) * 0.2).toFixed(1) : 0;

        // NCB Top Wind Turbine & Additional Battery Simulation
        const airFlowSpeedKmh = +(newSpeed + (isFlying ? 15 : 5) + (Math.random() - 0.5) * 2).toFixed(1);
        const turbineRpm = isFlying ? Math.round(newSpeed * 42 + 400 + Math.random() * 50) : 320;
        const chargePowerWatts = isFlying && newSpeed > 5 ? +(newSpeed * 0.65 + (Math.random() - 0.5) * 2).toFixed(1) : 0;
        const addedEnergyWh = (chargePowerWatts * (TICK_MS / 3600000));
        const newEnergyGeneratedWh = +(prev.energyGeneratedWh + addedEnergyWh).toFixed(3);
        const newAdditionalBattery = Math.min(100, +(prev.additionalBattery + (chargePowerWatts * 0.003)).toFixed(2));

        const chargingStatus = isFlying && chargePowerWatts > 5
          ? 'Active Charging'
          : newAdditionalBattery >= 100
          ? 'Battery Full'
          : 'Standby (Low Airflow)';

        const turbineStatus = isFlying && newSpeed > 5
          ? `Active (${turbineRpm.toLocaleString()} RPM)`
          : `Standby (${turbineRpm} RPM)`;

        return {
          ...prev,
          battery: newMainBattery,
          mainBattery: newMainBattery,
          additionalBattery: newAdditionalBattery,
          chargingStatus,
          energyGeneratedWh: newEnergyGeneratedWh,
          chargePowerWatts,
          turbineStatus,
          turbineRpm,
          airFlowSpeedKmh,
          gpsAccuracy: simulateGpsNoise(1.2),
          gpsSatellites: 11 + Math.floor(Math.random() * 3),
          altitude: newAlt,
          speed: newSpeed,
          signal: Math.max(80, Math.min(100, prev.signal + (Math.random() - 0.5) * 2)),
          isLowBatteryAlert: isLowAlert,
          heading: (() => {
            if (state.status === 'en_route') return +bearing(home, target).toFixed(1);
            if (['returning', 'returning_home_early'].includes(state.status)) {
               return +bearing(dronePos, home).toFixed(1);
            }
            return prev.heading;
          })(),
        };
      });

      // Radar processing
      if (state.radarTriggered && !state.radarResolved) {
         state.radarResolved = true;
         addLog('📡 RADAR: Obstacle detected in flight path!', 'warning');
         setDroneMetrics(prev => ({ ...prev, radarStatus: 'Obstacle Detected', routeSafety: 'Compromised', emergencyAlert: 'Obstacle Detected' }));
         
         setTimeout(() => {
            if (simState.current.status === 'en_route' && !simState.current.isPaused) {
               addLog('🔄 RADAR: Recalculating route...', 'info');
               setTimeout(() => {
                  if (simState.current.status === 'en_route' && !simState.current.isPaused) {
                     addLog('❌ RADAR: No safe route available. Returning home.', 'error');
                     simState.current.status = 'returning_home_early';
                     setMission(prev => prev ? updateStatus(prev, 'returning_home_early') : prev);
                     setDroneMetrics(prev => ({ ...prev, radarStatus: 'Returning', routeSafety: 'Aborted due to Obstacle', emergencyAlert: 'Mission Aborted - No Safe Route' }));
                  }
               }, 2000);
            }
         }, 2000);
      }

      // Phase transitions
      if (state.status === 'launching') {
        state.phaseTick++;
        if (state.phaseTick >= LAUNCH_TICKS) {
          state.status = 'en_route';
          state.phaseTick = 0;
          state.enRouteTick = 0;
          addLog('Altitude reached — proceeding to target', 'info');
          addLog(`Heading: ${bearing(home, target).toFixed(0)}°`, 'info');
          setMission(prev => prev ? updateStatus(prev, 'en_route') : prev);
        }
      } else if (state.status === 'en_route') {
        state.enRouteTick++;
        const t = Math.min(1, state.enRouteTick / state.enRouteTicksTotal);
        setDronePos(interpolateLatLng(home, target, t));
        if (state.enRouteTick >= state.enRouteTicksTotal) {
          state.status = 'delivering';
          state.phaseTick = 0;
          addLog('📍 Target reached — initiating payload delivery', 'info');
          setMission(prev => prev ? updateStatus(prev, 'delivering') : prev);
          setDronePos(target);
        }
      } else if (state.status === 'delivering') {
        state.phaseTick++;
        if (state.phaseTick >= DELIVER_TICKS) {
          state.status = 'delivery_verified';
          state.phaseTick = 0;
          addLog('✅ Payload delivered successfully', 'success');
          addLog('🔍 Verifying delivery via onboard sensors...', 'info');
          setMission(prev => prev ? { ...updateStatus(prev, 'delivery_verified'), payloadDelivered: true } : prev);
        }
      } else if (state.status === 'delivery_verified') {
        state.phaseTick++;
        if (state.phaseTick >= VERIFY_TICKS) {
          state.status = 'returning';
          state.phaseTick = 0;
          state.returnTick = 0;
          addLog('✔ DELIVERY VERIFIED — initiating Return-to-Home', 'success');
          addLog(`RTH heading: ${bearing(target, home).toFixed(0)}°`, 'info');
          setMission(prev => prev ? updateStatus(prev, 'returning') : prev);
        }
      } else if (['returning', 'returning_home_early'].includes(state.status)) {
        state.returnTick++;
        // If returning early, interpolate from current pos, else from target
        const startPos = state.status === 'returning_home_early' ? dronePos : target;
        const t = Math.min(1, state.returnTick / state.returnTicksTotal);
        setDronePos(interpolateLatLng(startPos, home, t));
        if (state.returnTick >= state.returnTicksTotal) {
          state.status = 'completed';
          stopSimulation();
          setDronePos(home);
          setMissionProgress(100);
          const completedAt = new Date();
          setMission(prev => {
            if (!prev) return prev;
            const completed = { ...prev, status: 'completed' as MissionStatus, completedAt, durationSeconds: Math.round(state.elapsed) };
            setCompletedMissions(hist => [completed, ...hist]);
            return completed;
          });
          addLog('🏠 Drone landed at home base', 'success');
          addLog('🎉 Mission completed successfully', 'success');
          setDroneMetrics(prev => ({ ...prev, altitude: 0, speed: 0 }));
        }
      }
    }, TICK_MS);
  }, [targetLocation, stopSimulation, addLog, updateStatus, dronePos]);

  const startMission = useCallback(() => {
    if (!mission || !targetLocation) return;
    simState.current.status = 'launching';
    setMission(prev => prev ? { ...prev, status: 'launching' } : prev);
    addLog('🚀 Launch sequence initiated', 'info');
    addLog('Drone motors spooling up...', 'info');
    startSimulationLoop();
  }, [mission, targetLocation, addLog, startSimulationLoop]);

  const pauseMission = useCallback(() => {
     simState.current.isPaused = true;
     setMission(prev => prev ? { ...prev, status: 'paused' } : prev);
     addLog('⏸ Mission Paused', 'warning');
  }, [addLog]);

  const resumeMission = useCallback(() => {
     simState.current.isPaused = false;
     setMission(prev => prev ? { ...prev, status: simState.current.status } : prev);
     addLog('▶ Mission Resumed', 'success');
  }, [addLog]);

  const abortMission = useCallback(() => {
     simState.current.status = 'aborted';
     simState.current.isPaused = false;
     setMission(prev => prev ? { ...prev, status: 'aborted' } : prev);
     addLog('🛑 Mission Aborted by Commander', 'error');
     stopSimulation();
  }, [addLog, stopSimulation]);

  const returnHome = useCallback(() => {
     if (['completed', 'aborted', 'returning', 'returning_home_early', 'idle'].includes(simState.current.status)) return;
     simState.current.status = 'returning_home_early';
     simState.current.isPaused = false;
     simState.current.returnTick = 0;
     setMission(prev => prev ? { ...prev, status: 'returning_home_early' } : prev);
     addLog('↩ Initiating Emergency Return-To-Home', 'warning');
     if (!simulationRef.current) startSimulationLoop();
  }, [addLog, startSimulationLoop]);

  const triggerRadarObstacle = useCallback(() => {
     if (simState.current.status === 'en_route') {
        simState.current.radarTriggered = true;
        simState.current.radarResolved = false;
     } else {
        addLog('Radar test can only be triggered while en route.', 'warning');
     }
  }, [addLog]);

  const resetMission = useCallback(() => {
    stopSimulation();
    setMission(null);
    setDronePos(homeLocation);
    setDroneMetrics(initialMetrics());
    setMissionLogs([]);
    setMissionProgress(0);
    setElapsedSeconds(0);
    setTargetLocation(null);
  }, [stopSimulation, homeLocation]);

  const triggerLowBatteryTest = useCallback(() => {
    setDroneMetrics(prev => ({
      ...prev,
      battery: 22,
      mainBattery: 22,
      isLowBatteryAlert: true,
      emergencyAlert: 'LOW BATTERY',
    }));
    addLog('⚠️ LOW BATTERY WARNING SIMULATED — Main Battery at 22%', 'warning');
    addLog('LOW BATTERY → CHECK ADDITIONAL BATTERY → RETURN HOME if needed.', 'warning');
  }, [addLog]);

  const transferReservePower = useCallback(() => {
    setDroneMetrics(prev => {
      const avail = prev.additionalBattery;
      const needed = 100 - prev.mainBattery;
      const transferAmount = Math.min(avail, needed, 30);
      const newMain = +(prev.mainBattery + transferAmount).toFixed(1);
      const newAdd = +(prev.additionalBattery - transferAmount).toFixed(1);
      return {
        ...prev,
        battery: newMain,
        mainBattery: newMain,
        additionalBattery: newAdd,
        isLowBatteryAlert: newMain <= 30,
        emergencyAlert: newMain > 30 ? null : prev.emergencyAlert,
      };
    });
    addLog('⚡ Energy transfer initiated: Reserve battery power routed to Main Battery', 'success');
  }, [addLog]);

  // Browser-only shared state: one tab can command the simulation while another mirrors it.
  // The simulation itself stays local to the commanding tab; snapshots make monitoring tabs read live data.
  useEffect(() => {
    const applySnapshot = (incoming: SharedMissionSnapshot) => {
      if (!incoming || incoming.updatedAt < latestSnapshotAtRef.current) return;
      const snapshot = restoreSnapshot(incoming);
      latestSnapshotAtRef.current = snapshot.updatedAt;
      applyingRemoteSnapshotRef.current = true;
      setMission(snapshot.mission);
      setDronePos(snapshot.dronePos);
      setDroneMetrics(snapshot.droneMetrics);
      setMissionLogs(snapshot.missionLogs);
      setCompletedMissions(snapshot.completedMissions);
      setHomeLocation(snapshot.homeLocation);
      setTargetLocation(snapshot.targetLocation);
      setIsSelectingTarget(snapshot.isSelectingTarget);
      setMissionProgress(snapshot.missionProgress);
      setElapsedSeconds(snapshot.elapsedSeconds);
    };

    try {
      const stored = localStorage.getItem(SHARED_MISSION_STORAGE);
      if (stored) applySnapshot(JSON.parse(stored) as SharedMissionSnapshot);
    } catch {
      // Storage may be unavailable in private or restricted browser contexts.
    }

    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(SHARED_MISSION_CHANNEL);
      syncChannelRef.current = channel;
      channel.onmessage = event => {
        const message = event.data as SharedMissionSnapshot | { type: 'request-mission-snapshot' };
        if (message?.type === 'mission-snapshot') applySnapshot(message);
        if (message?.type === 'request-mission-snapshot' && latestSnapshotRef.current) {
          channel.postMessage(latestSnapshotRef.current);
        }
      };
      channel.postMessage({ type: 'request-mission-snapshot' });
    }

    // Do not broadcast a blank initial state from a newly opened monitoring tab.
    const readyTimer = window.setTimeout(() => { syncReadyRef.current = true; }, 100);
    return () => {
      window.clearTimeout(readyTimer);
      syncChannelRef.current?.close();
      syncChannelRef.current = null;
    };
  }, []);

  useEffect(() => {
    const snapshot: SharedMissionSnapshot = {
      type: 'mission-snapshot',
      updatedAt: Date.now(),
      mission,
      dronePos,
      droneMetrics,
      missionLogs,
      completedMissions,
      homeLocation,
      targetLocation,
      isSelectingTarget,
      missionProgress,
      elapsedSeconds,
    };
    latestSnapshotRef.current = snapshot;

    if (!syncReadyRef.current) return;
    if (applyingRemoteSnapshotRef.current) {
      applyingRemoteSnapshotRef.current = false;
      return;
    }

    latestSnapshotAtRef.current = snapshot.updatedAt;
    try {
      localStorage.setItem(SHARED_MISSION_STORAGE, JSON.stringify(snapshot));
    } catch {
      // Live BroadcastChannel synchronization can continue without persistent storage.
    }
    syncChannelRef.current?.postMessage(snapshot);
  }, [mission, dronePos, droneMetrics, missionLogs, completedMissions, homeLocation, targetLocation, isSelectingTarget, missionProgress, elapsedSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, []);

  return {
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
  };
}
