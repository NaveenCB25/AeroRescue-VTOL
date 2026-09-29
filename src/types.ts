// Types for AeroRescue-VTOL Mission Control

export type MissionStatus =
  | 'idle'
  | 'launching'
  | 'en_route'
  | 'delivering'
  | 'delivery_verified'
  | 'returning'
  | 'completed'
  | 'paused'
  | 'aborted'
  | 'returning_home_early';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface DroneMetrics {
  battery: number;            // 0-100% (Main Battery alias)
  mainBattery: number;        // Main Battery % - powers the drone
  additionalBattery: number;  // Additional Battery % - receives simulated charging
  chargingStatus: string;     // Charging Status (e.g. 'Active Charging', 'Standby')
  energyGeneratedWh: number;  // Simulated Energy Generated (Wh)
  chargePowerWatts: number;   // Instantaneous charge rate (W)
  turbineStatus: string;      // Wind/Turbine Status (e.g. 'Active (2,450 RPM)')
  turbineRpm: number;         // Turbine RPM
  airFlowSpeedKmh: number;    // Airflow speed in km/h
  gpsAccuracy: number;        // meters
  gpsSatellites: number;      // count
  altitude: number;           // meters AGL
  speed: number;              // km/h
  heading: number;            // degrees 0-360
  signal: number;             // 0-100%
  isLowBatteryAlert?: boolean;// Flag when main battery is low
  radarStatus?: string;       // Radar Detection Status
  routeSafety?: string;       // Route Safety Status
  emergencyAlert?: string | null; // Emergency Alerts
}

export interface Mission {
  id: string;
  name: string;
  createdAt: Date;
  completedAt?: Date;
  status: MissionStatus;
  homeLocation: LatLng;
  targetLocation: LatLng;
  targetLabel: string;
  distanceKm: number;
  durationSeconds?: number;
  payloadDelivered: boolean;
}

export interface MissionLog {
  timestamp: Date;
  event: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Global Destination & Airspace Compliance Types
export type RegulatoryStatus = 'permitted' | 'restricted' | 'prohibited';

export interface EmergencyDestination {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: 'hospital' | 'disaster_zone' | 'coast_guard' | 'mountain_rescue' | 'refugee_camp' | 'fire_outpost';
  description: string;
  elevationMeters: number;
}

export interface GlobalCity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  destinations: EmergencyDestination[];
}

export interface GlobalRegion {
  id: string;
  name: string;
  code: string;
  cities: GlobalCity[];
}

export interface GlobalCountry {
  id: string;
  name: string;
  code: string;
  flag: string;
  continent: string;
  regulatoryStatus: RegulatoryStatus;
  authority: string;
  maxAltitudeAGL: number;
  airspaceNotes: string;
  legalDisclaimer: string;
  regions: GlobalRegion[];
}

export interface RouteWaypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  altitudeMeters: number;
  speedKmh: number;
  stage: 'takeoff' | 'climb' | 'cruise' | 'descent' | 'approach' | 'landing';
}

export interface GlobalRoutePlan {
  origin: LatLng;
  destination: LatLng;
  destinationName: string;
  country: GlobalCountry;
  region: GlobalRegion;
  city: GlobalCity;
  emergencySite: EmergencyDestination;
  distanceKm: number;
  distanceNauticalMiles: number;
  estimatedFlightMinutes: number;
  transitMode: 'Direct VTOL' | 'Relay Base Required' | 'Trans-Airspace Carrier Airlift';
  batteryFeasibility: 'Sufficient' | 'Relay Required' | 'Exceeds Range';
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical / Prohibited';
  waypoints: RouteWaypoint[];
  flightPathCoordinates: [number, number][];
}

