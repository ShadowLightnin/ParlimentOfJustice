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
        label: 'Utah Region',
        position: { top: '58%', left: '18%' },
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
        label: 'Philippines Region',
        position: { top: '62%', left: '72%' },
        targetLocationId: 'earth_philippines_region',
      },
    ],
  },

  // ===== EARTH – REGIONAL MAPS =====
  {
    id: 'earth_utah_region',
    planetId: 'earth',
    name: 'Utah Region',
    type: 'region',
    background: UtahTopDown,
    pins: [
      {
        id: 'zion_city_pin',
        label: 'Zion City',
        position: { top: '48%', left: '36%' },
        // 👉 goes straight to ZionCity screen, NOT another map
        targetScreen: 'ZionCity',
      },
      {
        id: 'aegis_compound_pin',
        label: 'The Aegis',
        position: { top: '60%', left: '40%' },
        targetScreen: 'AegisCompound',
      },
    ],
  },

  {
    id: 'earth_philippines_region',
    planetId: 'earth',
    name: 'Philippines Region',
    type: 'region',
    background: PhilippinesTopDown,
    pins: [
      {
        id: 'ophir_pin',
        label: 'Ophir City',
        position: { top: '58%', left: '65%' },
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
    name: 'Luna – Nearside',
    type: 'planet-side',
    background: LunaSide,
    isDefault: true,
    pins: [
      // Add pins later if you want e.g. "Parliament Luna Relay"
      // {
      //   id: 'luna_relay_pin',
      //   label: 'Luna Relay',
      //   position: { top: '50%', left: '50%' },
      //   targetScreen: 'LunaRelay', // dedicated screen
      // },
    ],
  },

  // ===== MARS =====
  {
    id: 'mars_orbit',
    planetId: 'mars',
    name: 'Mars – Polar Orbit',
    type: 'planet-side',
    background: MarsSide,
    isDefault: true,
    pins: [
      // Example future base:
      // {
      //   id: 'mars_base_pin',
      //   label: 'Parliament Mars Base',
      //   position: { top: '52%', left: '41%' },
      //   targetScreen: 'MarsBase', // dedicated screen
      // },
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
      // {
      //   id: 'jovian_dock_pin',
      //   label: 'Jovian Shipyards',
      //   position: { top: '45%', left: '60%' },
      //   targetScreen: 'JovianDock', // dedicated screen
      // },
    ],
  },

  // ===== MELCORNIA (PINNACLE) =====
  {
    id: 'melcornia_orbit',
    planetId: 'melcornia',
    name: 'Melcornia – Maw-Scarred Orbit',
    type: 'planet-side',
    background: MelcorniaSide,
    isDefault: true,
    pins: [
      {
        id: 'maw_rift_pin',
        label: 'The Maw Rift',
        position: { top: '48%', left: '28%' },
        // Example future detail:
        // targetScreen: 'MelcorniaMawRift',
      },
      {
        id: 'manor_pin',
        label: 'The Manor',
        position: { top: '55%', left: '40%' }, // tweak this as you like
        // 👉 goes straight to Manor screen, like Zion/Aegis/Ophir
        targetScreen: 'Manor',
      },
    ],
  },

  // ===== ZAXXON =====
  {
    id: 'zaxxon_orbit',
    planetId: 'zaxxon',
    name: 'Zaxxon – Fortress World',
    type: 'planet-side',
    background: ZaxxonSide,
    isDefault: true,
    pins: [
      // {
      //   id: 'zaxxon_ring_pin',
      //   label: 'Orbital Defense Rings',
      //   position: { top: '40%', left: '50%' },
      //   targetScreen: 'ZaxxonRings', // dedicated screen
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
