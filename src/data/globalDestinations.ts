import type { GlobalCountry, LatLng, GlobalRoutePlan, RouteWaypoint, GlobalRegion, GlobalCity, EmergencyDestination } from '../types';

export const GLOBAL_COUNTRIES: GlobalCountry[] = [
  {
    id: 'IN',
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    continent: 'Asia',
    regulatoryStatus: 'permitted',
    authority: 'DGCA India (Directorate General of Civil Aviation)',
    maxAltitudeAGL: 120,
    airspaceNotes: 'Primary AeroRescue operational hub. Full BVLOS emergency drone corridor authorization active under DigitalSky platform.',
    legalDisclaimer: 'Autonomous operations cleared under India Emergency Airspace Framework 2026.',
    regions: [
      {
        id: 'MH',
        name: 'Maharashtra',
        code: 'MH',
        cities: [
          {
            id: 'BOM',
            name: 'Mumbai',
            lat: 18.9220,
            lng: 72.8347,
            destinations: [
              {
                id: 'KEM-HOSP',
                name: 'KEM Hospital Emergency Heliport',
                lat: 19.0024,
                lng: 72.8423,
                category: 'hospital',
                description: 'Level 1 Trauma & Emergency Medical Supply Drop Center.',
                elevationMeters: 14,
              },
              {
                id: 'BANDRA-FLOOD',
                name: 'Bandra Coastal Flood Relief Outpost',
                lat: 19.0596,
                lng: 72.8295,
                category: 'disaster_zone',
                description: 'Emergency rescue kit drop site for coastal monsoon flooding.',
                elevationMeters: 5,
              },
              {
                id: 'NAV-MUMBAI-SAR',
                name: 'Navi Mumbai Search & Rescue Base',
                lat: 19.0330,
                lng: 73.0297,
                category: 'coast_guard',
                description: 'Regional VTOL drone staging and maritime rescue coordination center.',
                elevationMeters: 22,
              },
            ],
          },
          {
            id: 'PNE',
            name: 'Pune',
            lat: 18.5204,
            lng: 73.8567,
            destinations: [
              {
                id: 'PUNE-MED',
                name: 'Sassoon General Hospital Helipad',
                lat: 18.5273,
                lng: 73.8732,
                category: 'hospital',
                description: 'Regional blood bank and antivenom distribution node.',
                elevationMeters: 560,
              },
            ],
          },
        ],
      },
      {
        id: 'UT',
        name: 'Uttarakhand',
        code: 'UT',
        cities: [
          {
            id: 'KEDAR',
            name: 'Kedarnath Valley',
            lat: 30.7346,
            lng: 79.0669,
            destinations: [
              {
                id: 'KEDAR-RESCUE',
                name: 'Kedarnath High-Altitude Emergency Post',
                lat: 30.7352,
                lng: 79.0675,
                category: 'mountain_rescue',
                description: 'High-altitude mountain rescue and thermal hypothermia kit delivery site.',
                elevationMeters: 3583,
              },
            ],
          },
          {
            id: 'DDN',
            name: 'Dehradun',
            lat: 30.3165,
            lng: 78.0322,
            destinations: [
              {
                id: 'DDN-DISASTER',
                name: 'State Disaster Response Force HQ',
                lat: 30.3250,
                lng: 78.0410,
                category: 'disaster_zone',
                description: 'Disaster management drone dispatch and emergency communications relay.',
                elevationMeters: 640,
              },
            ],
          },
        ],
      },
      {
        id: 'KA',
        name: 'Karnataka',
        code: 'KA',
        cities: [
          {
            id: 'BLR',
            name: 'Bengaluru',
            lat: 12.9716,
            lng: 77.5946,
            destinations: [
              {
                id: 'BLR-NIMHANS',
                name: 'NIMHANS Organ Transport Corridor',
                lat: 12.9432,
                lng: 77.5968,
                category: 'hospital',
                description: 'Critical organ transport emergency drone corridor drop site.',
                elevationMeters: 920,
              },
            ],
          },
        ],
      },
      {
        id: 'KL',
        name: 'Kerala',
        code: 'KL',
        cities: [
          {
            id: 'WAYANAD',
            name: 'Wayanad Hill Region',
            lat: 11.6854,
            lng: 76.1320,
            destinations: [
              {
                id: 'WAYANAD-LANDSLIDE',
                name: 'Chooralmala Landslide Emergency Zone',
                lat: 11.5321,
                lng: 76.1432,
                category: 'disaster_zone',
                description: 'Immediate aerial drop zone for medical kits and satellite beacons.',
                elevationMeters: 780,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'KE',
    name: 'Kenya',
    code: 'KE',
    flag: '🇰🇪',
    continent: 'Africa',
    regulatoryStatus: 'permitted',
    authority: 'KCAA (Kenya Civil Aviation Authority)',
    maxAltitudeAGL: 150,
    airspaceNotes: 'Pre-approved Humanitarian Drone Corridor for emergency medical & disaster relief.',
    legalDisclaimer: 'Operator must notify KCAA air traffic control prior to long-range BVLOS launches.',
    regions: [
      {
        id: 'NBO',
        name: 'Nairobi County',
        code: 'NBO',
        cities: [
          {
            id: 'NAIROBI',
            name: 'Nairobi',
            lat: -1.2921,
            lng: 36.8219,
            destinations: [
              {
                id: 'KNY-HOSP',
                name: 'Kenyatta National Trauma Airpad',
                lat: -1.3005,
                lng: 36.8071,
                category: 'hospital',
                description: 'East Africa central medical drone distribution hub.',
                elevationMeters: 1795,
              },
            ],
          },
        ],
      },
      {
        id: 'TURKANA',
        name: 'Turkana Region',
        code: 'TURK',
        cities: [
          {
            id: 'LODWAR',
            name: 'Lodwar',
            lat: 3.1191,
            lng: 35.5973,
            destinations: [
              {
                id: 'TURKANA-DEPOT',
                name: 'Turkana Drought Relief Emergency Depot',
                lat: 3.1250,
                lng: 35.6020,
                category: 'refugee_camp',
                description: 'Remote water purification tablet and medical vaccine drop zone.',
                elevationMeters: 477,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'US',
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    continent: 'North America',
    regulatoryStatus: 'restricted',
    authority: 'FAA (Federal Aviation Administration)',
    maxAltitudeAGL: 122,
    airspaceNotes: 'Requires FAA Part 107 Waiver & LAANC Airspace Authorization for emergency BVLOS missions.',
    legalDisclaimer: 'FUTURE FEATURE — Physical drone flight in US airspace requires bilateral FAA certification and local Remote ID compliance.',
    regions: [
      {
        id: 'CA',
        name: 'California',
        code: 'CA',
        cities: [
          {
            id: 'LAX',
            name: 'Los Angeles',
            lat: 34.0522,
            lng: -118.2437,
            destinations: [
              {
                id: 'LA-TRAUMA',
                name: 'LA General Medical Center Helipad',
                lat: 34.0581,
                lng: -118.2062,
                category: 'hospital',
                description: 'Urban emergency trauma supply heliport.',
                elevationMeters: 140,
              },
              {
                id: 'MALIBU-FIRE',
                name: 'Malibu Wildfire Response Base 4',
                lat: 34.0259,
                lng: -118.7798,
                category: 'fire_outpost',
                description: 'Wildfire monitoring and emergency responder supply drop zone.',
                elevationMeters: 45,
              },
            ],
          },
        ],
      },
      {
        id: 'FL',
        name: 'Florida',
        code: 'FL',
        cities: [
          {
            id: 'MIA',
            name: 'Miami',
            lat: 25.7617,
            lng: -80.1918,
            destinations: [
              {
                id: 'MIAMI-HURRICANE',
                name: 'Miami Hurricane Relief Station Alpha',
                lat: 25.7743,
                lng: -80.1304,
                category: 'disaster_zone',
                description: 'Coastal storm relief drone deployment hub.',
                elevationMeters: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'JP',
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    continent: 'Asia',
    regulatoryStatus: 'restricted',
    authority: 'JCAB (Civil Aviation Bureau of Japan)',
    maxAltitudeAGL: 150,
    airspaceNotes: 'Category Level 4 flight authorization required for unpopulated and populated emergency corridors.',
    legalDisclaimer: 'FUTURE FEATURE — Operator must obtain JCAB special flight permit and coordinate with JSDF coastal radar.',
    regions: [
      {
        id: 'TYO',
        name: 'Tokyo Metropolis',
        code: 'TYO',
        cities: [
          {
            id: 'TOKYO',
            name: 'Tokyo Bay Area',
            lat: 35.6762,
            lng: 139.6503,
            destinations: [
              {
                id: 'TOKYO-TSUNAMI',
                name: 'Tokyo Disaster Prevention Center',
                lat: 35.6310,
                lng: 139.7890,
                category: 'disaster_zone',
                description: 'Earthquake and tsunami emergency response air hub.',
                elevationMeters: 10,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'DE',
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    continent: 'Europe',
    regulatoryStatus: 'restricted',
    authority: 'EASA / LBA (Luftfahrt-Bundesamt)',
    maxAltitudeAGL: 120,
    airspaceNotes: 'EU Drone Regulation Specific Category operational risk assessment (SORA) required.',
    legalDisclaimer: 'FUTURE FEATURE — Cross-border European flight requires EASA LUC (Light UAS Operator Certificate).',
    regions: [
      {
        id: 'BY',
        name: 'Bavaria',
        code: 'BY',
        cities: [
          {
            id: 'MUC',
            name: 'Munich',
            lat: 48.1351,
            lng: 11.5820,
            destinations: [
              {
                id: 'ALPINE-RESCUE',
                name: 'Alpine Mountain Rescue Hub Garmisch',
                lat: 47.4917,
                lng: 11.0955,
                category: 'mountain_rescue',
                description: 'Bavarian Alps emergency medical drop and beacon relay.',
                elevationMeters: 720,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'BR',
    name: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    continent: 'South America',
    regulatoryStatus: 'restricted',
    authority: 'ANAC (National Civil Aviation Agency of Brazil)',
    maxAltitudeAGL: 120,
    airspaceNotes: 'BVLOS operations require ANAC RBAC 94 certification and DECEA airspace clearance.',
    legalDisclaimer: 'FUTURE FEATURE — Requires local Brazilian defense ministry clearance for Amazonian emergency corridors.',
    regions: [
      {
        id: 'AM',
        name: 'Amazonas',
        code: 'AM',
        cities: [
          {
            id: 'MAO',
            name: 'Manaus',
            lat: -3.1190,
            lng: -60.0217,
            destinations: [
              {
                id: 'AMAZON-RESCUE',
                name: 'Amazon River Emergency Station',
                lat: -3.1400,
                lng: -60.0500,
                category: 'refugee_camp',
                description: 'Rainforest medical supply & snakebite antivenom drop zone.',
                elevationMeters: 40,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'AU',
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    continent: 'Oceania',
    regulatoryStatus: 'restricted',
    authority: 'CASA (Civil Aviation Safety Authority)',
    maxAltitudeAGL: 120,
    airspaceNotes: 'BVLOS endorsement under ReOC (Remote Operator Certificate) mandatory.',
    legalDisclaimer: 'FUTURE FEATURE — Operator must maintain active CASA approval and ADS-B Out transceiver.',
    regions: [
      {
        id: 'NSW',
        name: 'New South Wales',
        code: 'NSW',
        cities: [
          {
            id: 'SYD',
            name: 'Sydney',
            lat: -33.8688,
            lng: 151.2093,
            destinations: [
              {
                id: 'SYD-SAR',
                name: 'Sydney Harbor Maritime Search & Rescue Base',
                lat: -33.8568,
                lng: 151.2153,
                category: 'coast_guard',
                description: 'Maritime emergency life-raft deployment drone station.',
                elevationMeters: 5,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'UA',
    name: 'Restricted Airspace Zone',
    code: 'UA',
    flag: '🚫',
    continent: 'Global',
    regulatoryStatus: 'prohibited',
    authority: 'International Civil Aviation Organization (ICAO) / UN No-Fly',
    maxAltitudeAGL: 0,
    airspaceNotes: 'NO-FLY ZONE: Airspace strictly closed to commercial & civilian unmanned aerial systems.',
    legalDisclaimer: 'PROHIBITED — Drone flights strictly prohibited under international military & civil aviation treaties.',
    regions: [
      {
        id: 'CONFLICT-ZONE',
        name: 'Active Conflict & Protected Zone',
        code: 'CZ',
        cities: [
          {
            id: 'RESTRICTED-CITY',
            name: 'No-Fly Sector 01',
            lat: 48.3794,
            lng: 31.1656,
            destinations: [
              {
                id: 'NO-FLY-DEST',
                name: 'Unauthorized Landing Grid (PROHIBITED)',
                lat: 48.3800,
                lng: 31.1700,
                category: 'disaster_zone',
                description: 'Flight unauthorized — Air defense systems active in grid.',
                elevationMeters: 150,
              },
            ],
          },
        ],
      },
    ],
  },
];

// Haversine formula to compute distance in km
export function calculateDistanceKm(from: LatLng, to: LatLng): number {
  const R = 6371; // Earth radius in km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Calculate Global Route Plan
export function calculateGlobalRoute(
  origin: LatLng,
  country: GlobalCountry,
  region: GlobalRegion,
  city: GlobalCity,
  emergencySite: EmergencyDestination
): GlobalRoutePlan {
  const destination = { lat: emergencySite.lat, lng: emergencySite.lng };
  const distanceKm = calculateDistanceKm(origin, destination);
  const distanceNauticalMiles = Math.round(distanceKm * 0.539957 * 10) / 10;

  // Transit Mode & Feasibility based on distance
  let transitMode: GlobalRoutePlan['transitMode'] = 'Direct VTOL';
  let batteryFeasibility: GlobalRoutePlan['batteryFeasibility'] = 'Sufficient';
  let estimatedFlightMinutes = Math.round((distanceKm / 85) * 60); // 85 km/h cruise speed

  if (distanceKm > 40 && distanceKm <= 350) {
    transitMode = 'Relay Base Required';
    batteryFeasibility = 'Relay Required';
  } else if (distanceKm > 350) {
    transitMode = 'Trans-Airspace Carrier Airlift';
    batteryFeasibility = 'Exceeds Range';
    estimatedFlightMinutes = Math.round((distanceKm / 450) * 60); // Hypersonic carrier transport
  }

  // Risk Score based on legal status & distance
  let riskScore: GlobalRoutePlan['riskScore'] = 'Low';
  if (country.regulatoryStatus === 'prohibited') {
    riskScore = 'Critical / Prohibited';
  } else if (country.regulatoryStatus === 'restricted' || distanceKm > 100) {
    riskScore = 'Medium';
  }
  if (distanceKm > 1000 && country.regulatoryStatus !== 'prohibited') {
    riskScore = 'High';
  }

  // Generate intermediate flight waypoints (5 stages)
  const waypoints: RouteWaypoint[] = [
    {
      id: 'WP-01',
      name: 'Launch Pad (AeroRescue HQ)',
      lat: origin.lat,
      lng: origin.lng,
      altitudeMeters: 0,
      speedKmh: 0,
      stage: 'takeoff',
    },
    {
      id: 'WP-02',
      name: 'Initial Climb & Airspace Exit',
      lat: origin.lat + (destination.lat - origin.lat) * 0.1,
      lng: origin.lng + (destination.lng - origin.lng) * 0.1,
      altitudeMeters: country.maxAltitudeAGL,
      speedKmh: 60,
      stage: 'climb',
    },
    {
      id: 'WP-03',
      name: 'Mid-Way Air Corridor Relay Point',
      lat: origin.lat + (destination.lat - origin.lat) * 0.5,
      lng: origin.lng + (destination.lng - origin.lng) * 0.5,
      altitudeMeters: Math.min(country.maxAltitudeAGL, 120),
      speedKmh: 85,
      stage: 'cruise',
    },
    {
      id: 'WP-04',
      name: 'Target Sector Airspace Entry',
      lat: origin.lat + (destination.lat - origin.lat) * 0.85,
      lng: origin.lng + (destination.lng - origin.lng) * 0.85,
      altitudeMeters: 80,
      speedKmh: 45,
      stage: 'approach',
    },
    {
      id: 'WP-05',
      name: `${emergencySite.name} (Drop Site)`,
      lat: destination.lat,
      lng: destination.lng,
      altitudeMeters: emergencySite.elevationMeters,
      speedKmh: 0,
      stage: 'landing',
    },
  ];

  // Flight path line coordinates (including curve for long distance visual)
  const numSteps = 20;
  const flightPathCoordinates: [number, number][] = [];
  for (let i = 0; i <= numSteps; i++) {
    const t = i / numSteps;
    const lat = origin.lat + (destination.lat - origin.lat) * t;
    const lng = origin.lng + (destination.lng - origin.lng) * t;
    // Add slight geodesic arc for visual elegance
    const arcOffset = Math.sin(t * Math.PI) * (distanceKm > 200 ? 1.5 : 0.05);
    flightPathCoordinates.push([lat + arcOffset, lng]);
  }

  return {
    origin,
    destination,
    destinationName: `${emergencySite.name}, ${city.name}, ${country.name}`,
    country,
    region,
    city,
    emergencySite,
    distanceKm,
    distanceNauticalMiles,
    estimatedFlightMinutes,
    transitMode,
    batteryFeasibility,
    riskScore,
    waypoints,
    flightPathCoordinates,
  };
}
