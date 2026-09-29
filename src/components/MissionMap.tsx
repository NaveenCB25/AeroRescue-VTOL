import React, { useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMapEvents,
  Tooltip,
} from 'react-leaflet';
import L from 'leaflet';
import type { LatLng, Mission } from '../types';
import { MapPin, Info } from 'lucide-react';

// Fix default marker icon issue with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom SVG icons
function createSvgIcon(svgContent: string, size = 36): L.DivIcon {
  return L.divIcon({
    html: svgContent,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    tooltipAnchor: [0, -size / 2 - 4],
  });
}

const homeIcon = createSvgIcon(`
  <div style="filter: drop-shadow(0 0 8px rgba(16,185,129,0.8)); width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
      <path d="M16 8L8 15H11V23H14V18H18V23H21V15H24L16 8Z" fill="#10b981"/>
    </svg>
  </div>
`, 36);

const droneIcon = createSvgIcon(`
  <div style="filter: drop-shadow(0 0 12px rgba(96,165,250,0.9)); width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="18" fill="rgba(37,99,235,0.2)" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="19" cy="19" r="18" fill="none" stroke="#93c5fd" stroke-width="0.5" opacity="0.5"/>
      <!-- Drone body -->
      <rect x="16" y="16" width="6" height="6" rx="1.5" fill="#60a5fa"/>
      <!-- Arms -->
      <line x1="10" y1="10" x2="16" y2="16" stroke="#93c5fd" stroke-width="1.5"/>
      <line x1="28" y1="10" x2="22" y2="16" stroke="#93c5fd" stroke-width="1.5"/>
      <line x1="10" y1="28" x2="16" y2="22" stroke="#93c5fd" stroke-width="1.5"/>
      <line x1="28" y1="28" x2="22" y2="22" stroke="#93c5fd" stroke-width="1.5"/>
      <!-- Rotors -->
      <circle cx="10" cy="10" r="3.5" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="28" cy="10" r="3.5" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="10" cy="28" r="3.5" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="28" cy="28" r="3.5" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
      <!-- Center dot -->
      <circle cx="19" cy="19" r="2" fill="#bfdbfe"/>
    </svg>
  </div>
`, 40);

const targetIcon = createSvgIcon(`
  <div style="filter: drop-shadow(0 0 8px rgba(239,68,68,0.8)); width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="8" fill="none" stroke="#ef4444" stroke-width="1"/>
      <circle cx="16" cy="16" r="3" fill="#ef4444"/>
      <line x1="16" y1="5" x2="16" y2="11" stroke="#ef4444" stroke-width="1.5"/>
      <line x1="16" y1="21" x2="16" y2="27" stroke="#ef4444" stroke-width="1.5"/>
      <line x1="5" y1="16" x2="11" y2="16" stroke="#ef4444" stroke-width="1.5"/>
      <line x1="21" y1="16" x2="27" y2="16" stroke="#ef4444" stroke-width="1.5"/>
    </svg>
  </div>
`, 36);

const pendingTargetIcon = createSvgIcon(`
  <div style="filter: drop-shadow(0 0 8px rgba(245,158,11,0.8)); width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 2"/>
      <circle cx="16" cy="16" r="8" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 2"/>
      <circle cx="16" cy="16" r="3" fill="#f59e0b"/>
    </svg>
  </div>
`, 36);

// Map click handler component
interface MapClickHandlerProps {
  isSelectingTarget: boolean;
  onTargetSelected: (latlng: LatLng) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ isSelectingTarget, onTargetSelected }) => {
  useMapEvents({
    click(e) {
      if (isSelectingTarget) {
        onTargetSelected({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};



interface MissionMapProps {
  homeLocation: LatLng;
  targetLocation: LatLng | null;
  dronePos: LatLng;
  mission: Mission | null;
  isSelectingTarget: boolean;
  radarStatus?: string;
  onTargetSelected: (latlng: LatLng) => void;
}

export const MissionMap: React.FC<MissionMapProps> = ({
  homeLocation,
  targetLocation,
  dronePos,
  mission,
  isSelectingTarget,
  radarStatus,
  onTargetSelected,
}) => {
  const missionStatus = mission?.status ?? 'idle';
  const isFlying = ['en_route', 'returning', 'launching'].includes(missionStatus);

  // Build path line
  const flightPath = useMemo(() => {
    if (!targetLocation) return null;
    return [
      [homeLocation.lat, homeLocation.lng] as [number, number],
      [targetLocation.lat, targetLocation.lng] as [number, number],
    ];
  }, [homeLocation, targetLocation]);

  // Drone trail (simplified)
  const droneTrail = useMemo((): [number, number][] => {
    if (!isFlying || !targetLocation) return [];
    return [
      [homeLocation.lat, homeLocation.lng],
      [dronePos.lat, dronePos.lng],
    ];
  }, [dronePos, isFlying, homeLocation, targetLocation]);

  // Compute obstacle location (slightly ahead of drone on the way to target)
  const obstacleLocation = useMemo(() => {
     if (radarStatus && radarStatus !== 'Clear' && targetLocation) {
        // Interpolate 10% towards target from current drone pos
        const t = 0.1;
        return {
           lat: dronePos.lat + (targetLocation.lat - dronePos.lat) * t,
           lng: dronePos.lng + (targetLocation.lng - dronePos.lng) * t
        };
     }
     return null;
  }, [radarStatus, dronePos, targetLocation]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-blue-950/60">
      {/* Map overlay — selecting target hint */}
      {isSelectingTarget && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-4 py-2.5 bg-amber-500/90 backdrop-blur-md rounded-full shadow-lg">
          <MapPin size={14} className="text-white" />
          <span className="text-white text-xs font-semibold tracking-wide">Click on the map to set target location</span>
        </div>
      )}

      {/* Selecting cursor style */}
      {isSelectingTarget && (
        <style>{`.leaflet-container { cursor: crosshair !important; }`}</style>
      )}

      <MapContainer
        center={[homeLocation.lat, homeLocation.lng]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        {/* Dark tile layer — Stadia Maps (free, no API key needed) */}
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={20}
        />

        <MapClickHandler isSelectingTarget={isSelectingTarget} onTargetSelected={onTargetSelected} />


        {/* Planned flight path (dashed) */}
        {flightPath && !mission && (
          <Polyline
            positions={flightPath}
            pathOptions={{
              color: '#f59e0b',
              weight: 2,
              opacity: 0.6,
              dashArray: '8 6',
            }}
          />
        )}

        {/* Active flight path */}
        {flightPath && mission && (
          <Polyline
            positions={flightPath}
            pathOptions={{
              color: '#1e3a5f',
              weight: 2,
              opacity: 0.4,
              dashArray: '6 5',
            }}
          />
        )}

        {/* Drone trail */}
        {droneTrail.length > 1 && (
          <Polyline
            positions={droneTrail}
            pathOptions={{
              color: '#60a5fa',
              weight: 3,
              opacity: 0.8,
            }}
          />
        )}

        {/* Return path */}
        {missionStatus === 'returning' && targetLocation && (
          <Polyline
            positions={[
              [targetLocation.lat, targetLocation.lng],
              [dronePos.lat, dronePos.lng],
            ]}
            pathOptions={{
              color: '#fb923c',
              weight: 3,
              opacity: 0.8,
            }}
          />
        )}

        {/* Home marker */}
        <Marker position={[homeLocation.lat, homeLocation.lng]} icon={homeIcon}>
          <Popup>
            <div className="text-slate-200 font-semibold text-sm">🏠 Home Base</div>
            <div className="text-slate-400 text-xs font-mono mt-1">
              {homeLocation.lat.toFixed(4)}°N, {homeLocation.lng.toFixed(4)}°E
            </div>
          </Popup>
          <Tooltip direction="top" permanent={false}>Home Base</Tooltip>
        </Marker>

        {/* Target marker */}
        {targetLocation && (
          <Marker
            position={[targetLocation.lat, targetLocation.lng]}
            icon={mission ? targetIcon : pendingTargetIcon}
          >
            <Popup>
              <div className="text-red-300 font-semibold text-sm">🎯 {mission?.targetLabel || 'Target Location'}</div>
              <div className="text-slate-400 text-xs font-mono mt-1">
                {targetLocation.lat.toFixed(4)}°N, {targetLocation.lng.toFixed(4)}°E
              </div>
              {mission && (
                <div className="text-slate-400 text-xs mt-1">
                  Distance: {mission.distanceKm} km
                </div>
              )}
            </Popup>
            <Tooltip direction="top" permanent={false}>
              {mission?.targetLabel || 'Target Zone'}
            </Tooltip>
          </Marker>
        )}

        {/* Drone marker */}
        {mission && (
          <>
            <Marker position={[dronePos.lat, dronePos.lng]} icon={droneIcon} zIndexOffset={1000}>
              <Popup>
                <div className="text-blue-300 font-semibold text-sm">🚁 AeroRescue Drone</div>
                <div className="text-slate-400 text-xs font-mono mt-1">
                  {dronePos.lat.toFixed(5)}°N, {dronePos.lng.toFixed(5)}°E
                </div>
                <div className="text-slate-400 text-xs mt-1 capitalize">
                  Status: {missionStatus.replace('_', ' ')}
                </div>
              </Popup>
              <Tooltip permanent direction="bottom" offset={[0, 10]} className="bg-slate-900/90 border-blue-500/50 text-blue-200">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-[10px]">DRONE-A1</span>
                  {missionStatus === 'returning_home_early' && (
                     <span className="text-red-400 font-bold text-[9px] uppercase mt-0.5">RTH Emergency</span>
                  )}
                </div>
              </Tooltip>
            </Marker>

            {/* Drone radius pulse */}
            {isFlying && (
              <CircleMarker
                center={[dronePos.lat, dronePos.lng]}
                radius={10}
                pathOptions={{
                  color: '#60a5fa',
                  fillColor: '#60a5fa',
                  fillOpacity: 0.1,
                  weight: 1,
                  opacity: 0.5,
                }}
              />
            )}
          </>
        )}

        {/* Delivery verified zone */}
        {(missionStatus === 'delivery_verified' || missionStatus === 'returning' || missionStatus === 'completed') && targetLocation && (
          <CircleMarker
            center={[targetLocation.lat, targetLocation.lng]}
            radius={20}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.08,
              weight: 2,
              dashArray: '5 4',
              opacity: 0.7,
            }}
          />
        )}

        {/* Obstacle marker */}
        {obstacleLocation && (
           <Marker position={[obstacleLocation.lat, obstacleLocation.lng]} icon={createSvgIcon(`
             <div style="filter: drop-shadow(0 0 8px rgba(245,158,11,0.8)); width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                 <line x1="12" y1="8" x2="12" y2="12"></line>
                 <line x1="12" y1="16" x2="12.01" y2="16"></line>
               </svg>
             </div>
           `, 36)}>
             <Tooltip permanent direction="top" className="bg-amber-950/90 border-amber-500/50 text-amber-200">
                <span className="font-bold text-[10px] uppercase">Obstacle Detected</span>
             </Tooltip>
           </Marker>
        )}
      </MapContainer>

      {/* Coordinate display */}
      <div className="absolute bottom-3 left-3 z-[999] flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#060b14]/80 backdrop-blur-sm border border-blue-950/60">
        <Info size={11} className="text-slate-500" />
        <span className="text-slate-500 text-[10px] font-mono">
          Drone: {dronePos.lat.toFixed(4)}°N {dronePos.lng.toFixed(4)}°E
        </span>
      </div>
    </div>
  );
};
