// Simulation utilities for AeroRescue-VTOL Mission Control

import type { LatLng } from './types';

/**
 * Calculate distance between two lat/lng points (Haversine formula)
 * Returns distance in kilometers
 */
export function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6371; // Earth radius in km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

/**
 * Linearly interpolate between two LatLng points
 * t is 0..1 where 0 = start, 1 = end
 */
export function interpolateLatLng(start: LatLng, end: LatLng, t: number): LatLng {
  return {
    lat: start.lat + (end.lat - start.lat) * t,
    lng: start.lng + (end.lng - start.lng) * t,
  };
}

/**
 * Compute bearing (heading) from point A to B in degrees (0-360)
 */
export function bearing(a: LatLng, b: LatLng): number {
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Generate a mission ID
 */
export function generateMissionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MSN-${timestamp}-${random}`;
}

/**
 * Format a duration in seconds to a human-readable string
 */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

/**
 * Format a date to a short string
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Get color class for battery level
 */
export function getBatteryColor(level: number): string {
  if (level > 60) return '#10b981'; // green
  if (level > 30) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

/**
 * Get mission status label and color
 */
export function getMissionStatusInfo(status: string): { label: string; color: string; bgColor: string } {
  const map: Record<string, { label: string; color: string; bgColor: string }> = {
    idle: { label: 'STANDBY', color: '#64748b', bgColor: 'rgba(100,116,139,0.15)' },
    launching: { label: 'LAUNCHING', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.15)' },
    en_route: { label: 'EN ROUTE', color: '#60a5fa', bgColor: 'rgba(96,165,250,0.15)' },
    delivering: { label: 'DELIVERING', color: '#a78bfa', bgColor: 'rgba(167,139,250,0.15)' },
    delivery_verified: { label: 'DELIVERY VERIFIED ✓', color: '#34d399', bgColor: 'rgba(52,211,153,0.15)' },
    returning: { label: 'RETURNING', color: '#fb923c', bgColor: 'rgba(251,146,60,0.15)' },
    completed: { label: 'COMPLETED', color: '#10b981', bgColor: 'rgba(16,185,129,0.15)' },
    paused: { label: 'PAUSED', color: '#eab308', bgColor: 'rgba(234,179,8,0.15)' },
    aborted: { label: 'ABORTED', color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)' },
    returning_home_early: { label: 'RTH (EMERGENCY)', color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)' },
  };
  return map[status] || map['idle'];
}

/**
 * Simulate GPS accuracy noise
 */
export function simulateGpsNoise(base: number): number {
  return +(base + (Math.random() - 0.5) * 0.4).toFixed(1);
}

/**
 * Simulate altitude variation
 */
export function simulateAltitude(base: number, phase: string): number {
  if (phase === 'launching') return Math.min(base + 2, 80);
  if (phase === 'returning') return Math.max(base - 1, 0);
  return +(base + (Math.random() - 0.5) * 2).toFixed(1);
}

// Default home location: IIT Bombay (example for SIH context)
export const DEFAULT_HOME: LatLng = {
  lat: 19.1334,
  lng: 72.9133,
};

export const AVAILABLE_HOMES = [
  { id: 'iit-b', name: 'IIT Bombay Base', lat: 19.1334, lng: 72.9133 },
  { id: 'mumbai-airport', name: 'Mumbai Airport', lat: 19.0896, lng: 72.8656 },
  { id: 'juhu-aero', name: 'Juhu Aerodrome', lat: 19.0974, lng: 72.8300 },
];
