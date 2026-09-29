import React, { useState, useMemo } from 'react';
import {
  Globe,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  MapPin,
  Clock,
  Compass,
  Zap,
  CheckCircle2,
  Plane,
  FileText,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { GLOBAL_COUNTRIES, calculateGlobalRoute } from '../data/globalDestinations';
import type { LatLng, GlobalCountry, GlobalRegion, GlobalCity, EmergencyDestination, GlobalRoutePlan } from '../types';
import { DEFAULT_HOME } from '../simulation';

// Fix marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function createCustomMarkerIcon(color: string): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="filter: drop-shadow(0 0 8px ${color}); width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="13" fill="${color}33" stroke="${color}" stroke-width="2"/>
          <circle cx="15" cy="15" r="5" fill="${color}"/>
        </svg>
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

const homeIcon = createCustomMarkerIcon('#10b981');
const targetIcon = createCustomMarkerIcon('#ef4444');
const waypointIcon = createCustomMarkerIcon('#3b82f6');

interface GlobalDestinationSelectorProps {
  homeLocation?: LatLng;
  onSetAsActiveTarget?: (location: LatLng, name: string) => void;
}

export const GlobalDestinationSelector: React.FC<GlobalDestinationSelectorProps> = ({
  homeLocation = DEFAULT_HOME,
  onSetAsActiveTarget,
}) => {
  // Selection state
  const [selectedCountryId, setSelectedCountryId] = useState<string>('IN');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('MH');
  const [selectedCityId, setSelectedCityId] = useState<string>('BOM');
  const [selectedDestId, setSelectedDestId] = useState<string>('KEM-HOSP');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Current selected objects
  const currentCountry: GlobalCountry = useMemo(() => {
    return GLOBAL_COUNTRIES.find((c) => c.id === selectedCountryId) || GLOBAL_COUNTRIES[0];
  }, [selectedCountryId]);

  const availableRegions: GlobalRegion[] = useMemo(() => {
    return currentCountry.regions || [];
  }, [currentCountry]);

  const currentRegion: GlobalRegion = useMemo(() => {
    return availableRegions.find((r) => r.id === selectedRegionId) || availableRegions[0] || { id: '', name: '', code: '', cities: [] };
  }, [availableRegions, selectedRegionId]);

  const availableCities: GlobalCity[] = useMemo(() => {
    return currentRegion.cities || [];
  }, [currentRegion]);

  const currentCity: GlobalCity = useMemo(() => {
    return availableCities.find((c) => c.id === selectedCityId) || availableCities[0] || { id: '', name: '', lat: 0, lng: 0, destinations: [] };
  }, [availableCities, selectedCityId]);

  const availableDestinations: EmergencyDestination[] = useMemo(() => {
    return currentCity.destinations || [];
  }, [currentCity]);

  const currentDestination: EmergencyDestination = useMemo(() => {
    return (
      availableDestinations.find((d) => d.id === selectedDestId) ||
      availableDestinations[0] || {
        id: 'default',
        name: 'Target Site',
        lat: currentCity.lat,
        lng: currentCity.lng,
        category: 'disaster_zone',
        description: 'Selected Target',
        elevationMeters: 10,
      }
    );
  }, [availableDestinations, selectedDestId, currentCity]);

  // Handle cascade updates
  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    const c = GLOBAL_COUNTRIES.find((x) => x.id === countryId);
    if (c && c.regions.length > 0) {
      const firstReg = c.regions[0];
      setSelectedRegionId(firstReg.id);
      if (firstReg.cities.length > 0) {
        const firstCity = firstReg.cities[0];
        setSelectedCityId(firstCity.id);
        if (firstCity.destinations.length > 0) {
          setSelectedDestId(firstCity.destinations[0].id);
        }
      }
    }
  };

  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    const r = availableRegions.find((x) => x.id === regionId);
    if (r && r.cities.length > 0) {
      const firstCity = r.cities[0];
      setSelectedCityId(firstCity.id);
      if (firstCity.destinations.length > 0) {
        setSelectedDestId(firstCity.destinations[0].id);
      }
    }
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = availableCities.find((x) => x.id === cityId);
    if (city && city.destinations.length > 0) {
      setSelectedDestId(city.destinations[0].id);
    }
  };

  // Route Plan Calculation
  const routePlan: GlobalRoutePlan = useMemo(() => {
    return calculateGlobalRoute(homeLocation, currentCountry, currentRegion, currentCity, currentDestination);
  }, [homeLocation, currentCountry, currentRegion, currentCity, currentDestination]);

  // Handle Set Active Target
  const handleApplyToActiveMission = () => {
    if (onSetAsActiveTarget) {
      onSetAsActiveTarget(
        { lat: currentDestination.lat, lng: currentDestination.lng },
        `${currentDestination.name} (${currentCity.name})`
      );
      setAppliedNotification(`Destination "${currentDestination.name}" set as active mission target!`);
      setTimeout(() => setAppliedNotification(null), 4000);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto p-4 bg-[#060b14] text-slate-200">
      {/* Banner */}
      <div className="glass-card p-4 border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-blue-950/30 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-blue-400 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">Global Operations & Destination Selector</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                  Future Capability Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Select international territories, regional flight corridors, and emergency rescue sites. Evaluates airspace compliance & computes global mission routes.
              </p>
            </div>
          </div>

          {appliedNotification && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fade-in">
              <CheckCircle2 size={14} />
              {appliedNotification}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left Controls & Right Map + Route */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left Column: Dropdown Controls + Regulatory Compliance */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-1">
          {/* Cascading Selection Card */}
          <div className="glass-card p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              <Navigation size={14} className="text-blue-400" />
              <span>Select Destination Hierarchy</span>
            </div>

            {/* 1. Country */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Country / Airspace Territory</label>
              <select
                id="select-country"
                value={selectedCountryId}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {GLOBAL_COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name} ({c.continent}) — [{c.regulatoryStatus.toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Region / State */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Region / State / Province</label>
              <select
                id="select-region"
                value={selectedRegionId}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {availableRegions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. City */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">City / Metropolitan Hub</label>
              <select
                id="select-city"
                value={selectedCityId}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {availableCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Emergency Destination */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Emergency Landing Site / Target</label>
              <select
                id="select-destination"
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {availableDestinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.category.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Airspace Regulatory Compliance Card */}
          <div
            className={`glass-card p-4 flex flex-col gap-3 border ${
              currentCountry.regulatoryStatus === 'permitted'
                ? 'border-emerald-500/40 bg-emerald-950/10'
                : currentCountry.regulatoryStatus === 'restricted'
                ? 'border-amber-500/40 bg-amber-950/10'
                : 'border-red-500/40 bg-red-950/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentCountry.regulatoryStatus === 'permitted' ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                ) : currentCountry.regulatoryStatus === 'restricted' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                )}
                <span className="text-xs font-bold text-white uppercase tracking-wide">Airspace Legal Compliance</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  currentCountry.regulatoryStatus === 'permitted'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : currentCountry.regulatoryStatus === 'restricted'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {currentCountry.regulatoryStatus === 'permitted'
                  ? '🟢 Permitted Corridor'
                  : currentCountry.regulatoryStatus === 'restricted'
                  ? '🟡 Restricted / Permit Required'
                  : '🔴 Prohibited / No-Fly Zone'}
              </span>
            </div>

            <div className="text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Civil Aviation Authority:</span>
                <span className="font-medium text-slate-200">{currentCountry.authority}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Max Altitude AGL:</span>
                <span className="font-mono text-slate-200">{currentCountry.maxAltitudeAGL} m</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
              <span className="text-slate-400 font-semibold block mb-0.5">Airspace Status Note:</span>
              {currentCountry.airspaceNotes}
            </div>

            {/* Future Legal Disclaimer Notice */}
            <div className="text-[11px] text-amber-300/80 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 flex gap-2 items-start">
              <Zap size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-200">Legal Compliance Protocol:</strong> {currentCountry.legalDisclaimer}
              </span>
            </div>
          </div>

          {/* Selected Emergency Site Details */}
          <div className="glass-card p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              <MapPin size={14} className="text-red-400" />
              <span>Selected Target Site Metadata</span>
            </div>
            <div className="text-sm font-semibold text-white">{currentDestination.name}</div>
            <div className="text-xs text-slate-400">{currentDestination.description}</div>
            <div className="grid grid-cols-2 gap-2 mt-1 pt-2 border-t border-slate-800/60 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Coordinates</span>
                <span className="font-mono text-slate-300 text-[11px]">
                  {currentDestination.lat.toFixed(4)}°N, {currentDestination.lng.toFixed(4)}°E
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Elevation</span>
                <span className="font-mono text-slate-300 text-[11px]">{currentDestination.elevationMeters} m MSL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Global Leaflet Map & Calculated Route Analysis */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
          {/* Map Container */}
          <div className="relative flex-1 min-h-[320px] rounded-xl overflow-hidden border border-blue-950/60">
            <MapContainer
              key={`${currentDestination.lat}-${currentDestination.lng}`}
              center={[
                (homeLocation.lat + currentDestination.lat) / 2,
                (homeLocation.lng + currentDestination.lng) / 2,
              ]}
              zoom={routePlan.distanceKm > 2000 ? 3 : routePlan.distanceKm > 300 ? 5 : 9}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; OpenStreetMap'
                maxZoom={20}
              />

              {/* Home Base Marker */}
              <Marker position={[homeLocation.lat, homeLocation.lng]} icon={homeIcon}>
                <Popup>
                  <div className="text-xs font-semibold text-emerald-400">🏠 AeroRescue HQ (Mumbai)</div>
                </Popup>
                <Tooltip permanent direction="top">Home HQ</Tooltip>
              </Marker>

              {/* Target Marker */}
              <Marker position={[currentDestination.lat, currentDestination.lng]} icon={targetIcon}>
                <Popup>
                  <div className="text-xs font-semibold text-red-400">🎯 {currentDestination.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {currentDestination.lat.toFixed(4)}°N, {currentDestination.lng.toFixed(4)}°E
                  </div>
                </Popup>
                <Tooltip permanent direction="top">{currentDestination.name}</Tooltip>
              </Marker>

              {/* Intermediate Waypoint Markers */}
              {routePlan.waypoints.slice(1, -1).map((wp, idx) => (
                <Marker key={idx} position={[wp.lat, wp.lng]} icon={waypointIcon}>
                  <Popup>
                    <div className="text-xs font-semibold text-blue-300">📍 Waypoint {idx + 1}: {wp.name}</div>
                    <div className="text-[10px] text-slate-400">Alt: {wp.altitudeMeters}m | Speed: {wp.speedKmh} km/h</div>
                  </Popup>
                </Marker>
              ))}

              {/* Polyline Route */}
              <Polyline
                positions={routePlan.flightPathCoordinates}
                pathOptions={{
                  color: currentCountry.regulatoryStatus === 'prohibited' ? '#ef4444' : '#3b82f6',
                  weight: 3,
                  dashArray: '8 6',
                  opacity: 0.85,
                }}
              />
            </MapContainer>

            {/* Map Overlay Badge */}
            <div className="absolute top-3 right-3 z-[999] glass-card px-3 py-2 text-xs flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Global Air Distance</span>
              <span className="text-sm font-bold font-mono text-blue-300">
                {routePlan.distanceKm.toLocaleString()} km <span className="text-xs text-slate-400">({routePlan.distanceNauticalMiles} NM)</span>
              </span>
            </div>
          </div>

          {/* Route Calculation Summary & Action Buttons */}
          <div className="glass-card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
                <Compass size={14} className="text-blue-400" />
                <span>Calculated Global Mission Route & Feasibility</span>
              </div>
              <span className="text-xs font-mono text-slate-400">HQ ➔ {currentCity.name}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Total Flight Range</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{routePlan.distanceKm} km</div>
                <div className="text-[10px] text-slate-400">{routePlan.distanceNauticalMiles} NM</div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Est. Transit Time</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5 flex items-center gap-1">
                  <Clock size={12} className="text-blue-400" />
                  {routePlan.estimatedFlightMinutes} mins
                </div>
                <div className="text-[10px] text-slate-400">@ Cruise Cruise Speed</div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Transit Logistics Mode</div>
                <div className="text-xs font-bold text-blue-300 mt-0.5">{routePlan.transitMode}</div>
                <div className="text-[10px] text-slate-400">BVLOS Staging</div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Risk & Air Clearance</div>
                <div
                  className={`text-xs font-bold mt-0.5 ${
                    routePlan.riskScore === 'Low'
                      ? 'text-emerald-400'
                      : routePlan.riskScore === 'Medium'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {routePlan.riskScore} Risk
                </div>
                <div className="text-[10px] text-slate-400">{currentCountry.regulatoryStatus.toUpperCase()}</div>
              </div>
            </div>

            {/* Flight Plan Waypoints List */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Plane size={12} className="text-blue-400" />
                Flight Plan Waypoints ({routePlan.waypoints.length} Stages)
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                {routePlan.waypoints.map((wp, i) => (
                  <div
                    key={wp.id}
                    className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-slate-900/40 border border-slate-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center">
                        0{i + 1}
                      </span>
                      <span className="font-medium text-slate-200">{wp.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                      <span>Alt: {wp.altitudeMeters}m</span>
                      <span>Speed: {wp.speedKmh} km/h</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] uppercase text-blue-300">
                        {wp.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800">
              <button
                id="btn-apply-global-target"
                onClick={handleApplyToActiveMission}
                disabled={currentCountry.regulatoryStatus === 'prohibited'}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs transition-all shadow-lg ${
                  currentCountry.regulatoryStatus === 'prohibited'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-500/50 shadow-blue-900/30'
                }`}
              >
                <CheckCircle2 size={15} />
                <span>Set as Active Mission Target</span>
              </button>

              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(routePlan, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `global_route_${currentCountry.code}_${currentDestination.id}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all"
              >
                <FileText size={15} />
                <span>Export Route JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
