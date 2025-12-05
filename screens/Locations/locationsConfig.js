// screens/Locations/locationsConfig.js
import EarthNASide from '../../assets/Space/NorthAmericanSide.jpg';
import EarthPHSide from '../../assets/Space/PhilippinesSide.jpg';
import UtahTopDown from '../../assets/Space/Utah.jpg';
import PhilippinesTopDown from '../../assets/Space/Philippines.jpg';

// NEW: simple orbit / side images for other worlds
import LunaSide from '../../assets/Space/Luna.jpg';
import MarsSide from '../../assets/Space/Mars.jpg';
import JupiterSide from '../../assets/Space/Jupiter.jpg';
import MelcorniaSide from '../../assets/Space/Melcornia.jpg';
import ZaxxonSide from '../../assets/Space/Zaxxon.jpg';

// type:
// - 'planet-side' → orbit / hemisphere view (with region / site pins)
// - 'region'      → planetary region map (with location pins)
// dedicated city/facility views are handled by targetScreen (NOT as extra maps)

const LOCATIONS = [
  // ===== EARTH – ORBIT / HEMISPHERE VIEWS =====
  {
    id: 'earth_orbit_na',
    planetId: 'earth',
    name: 'Earth – North America Side',
    type: 'planet-side',
    background: EarthNASide,
    isDefault: true, // default for planetId:'earth'
    toggle: {
      targetLocationId: 'earth_orbit_ph',
      label: 'Switch to Philippines Side',
    },
    pins: [
      {
        id: 'earth_utah_pin',
        label: 'Utah',
        // was top: '42%', left: '26%'
        position: { x: 0.27, y: 0.34 },
        targetLocationId: 'earth_utah_region',
      },
    ],
  },

  {
    id: 'earth_orbit_ph',
    planetId: 'earth',
    name: 'Earth – Philippines Side',
    type: 'planet-side',
    background: EarthPHSide,
    toggle: {
      targetLocationId: 'earth_orbit_na',
      label: 'Switch to North America Side',
    },
    pins: [
      {
        id: 'earth_philippines_pin_orbit',
        label: 'Philippines',
        // was top: '48%', left: '41%'
        position: { x: 0.42, y: 0.48 },
        targetLocationId: 'earth_philippines_region',
      },
    ],
  },

  // ===== EARTH – REGIONAL MAPS =====
  {
    id: 'earth_utah_region',
    planetId: 'earth',
    name: 'Utah',
    type: 'region',
    background: UtahTopDown,
    pins: [
      {
        id: 'zion_city_pin',
        label: 'Zion City',
        // was top: '44%', left: '35%'
        position: { x: 0.32, y: 0.36 },
        // 👉 goes straight to ZionCity screen, NOT another map
        targetScreen: 'ZionCity',
    },
    {
        id: 'aegis_compound_pin',
        label: 'The Aegis',
        // was top: '41%', left: '29%'
        position: { x: 0.35, y: 0.40 },
        targetScreen: 'AegisCompound',
      },
    ],
  },

  {
    id: 'earth_philippines_region',
    planetId: 'earth',
    name: 'Philippines',
    type: 'region',
    background: PhilippinesTopDown,
    pins: [
      {
        id: 'ophir_pin',
        label: 'Ophir',
        // was top: '31%', left: '22%'
        position: { x: 0.26, y: 0.23 },
        targetScreen: 'OphirCity',
      },
    ],
  },

  // ========================================================================
  // OTHER WORLDS
  // ========================================================================

  // ===== LUNA =====
  {
    id: 'luna_orbit',
    planetId: 'Luna', // note: matches PLANETS id "Luna"
    name: 'Luna',
    type: 'planet-side',
    background: LunaSide,
    isDefault: true,
    pins: [
      // Add pins later if you want e.g. "Parliament Luna Relay"
      {
        id: 'luna_relay_pin',
        label: 'Lunar Relay',
        position: { x: 0.50, y: 0.50 },
        targetScreen: 'LunaRelay', // dedicated screen
      },
    ],
  },

  // ===== MARS =====
  {
    id: 'mars_orbit',
    planetId: 'mars',
    name: 'Mars',
    type: 'planet-side',
    background: MarsSide,
    isDefault: true,
    pins: [
      {
        id: 'mars_base_pin',
        label: 'Mars Base',
        position: { x: 0.60, y: 0.45 },
        targetScreen: 'MarsBase',
    },
],
},

// ===== JUPITER =====
{
    id: 'jupiter_orbit',
    planetId: 'jupiter',
    name: 'Jupiter – High Orbit',
    type: 'planet-side',
    background: JupiterSide,
    isDefault: true,
    pins: [
    {
        id: 'jovian_dock_pin',
        label: 'Spartan Orbital Station',
        position: { x: 0.45, y: 0.58 },
        targetScreen: 'JovianDock',
      },
    ],
  },

  // ===== MELCORNIA (PINNACLE) =====
  {
    id: 'melcornia_orbit',
    planetId: 'melcornia',
    name: 'Melcornia',
    type: 'planet-side',
    background: MelcorniaSide,
    isDefault: true,
    pins: [
      {
        id: 'maw_rift_pin',
        label: 'The Maw Rift',
        // was top: '50%', left: '56%'
        position: { x: 0.56, y: 0.50 },
        // targetScreen: 'MelcorniaMawRift',
      },
      {
        id: 'manor_pin',
        label: 'Montrose Manor',
        // was top: '48%', left: '34%'
        position: { x: 0.34, y: 0.48 },
        targetScreen: 'Manor',
      },
    ],
  },

  // ===== ZAXXON =====
  {
    id: 'zaxxon_orbit',
    planetId: 'zaxxon',
    name: 'Zaxxon',
    type: 'planet-side',
    background: ZaxxonSide,
    isDefault: true,
    pins: [
      // {
      //   id: 'zaxxon_ring_pin',
      //   label: 'Orbital Defense Rings',
      //   position: { x: 0.50, y: 0.40 },
      //   targetScreen: 'ZaxxonRings',
      // },
    ],
  },
];

export const getLocationById = (id) =>
  LOCATIONS.find((loc) => loc.id === id) || null;

// Used by LocationMapScreen when you navigate with { planetId }
export const getDefaultLocationForPlanet = (planetId) => {
  if (!planetId) return null;

  // Prefer an explicitly-marked default
  const explicit = LOCATIONS.find(
    (loc) => loc.planetId === planetId && loc.isDefault
  );
  if (explicit) return explicit.id;

  // Fallback: first location that matches this planet
  const any = LOCATIONS.find((loc) => loc.planetId === planetId);
  return any ? any.id : null;
};

export const ALL_LOCATIONS = LOCATIONS;
