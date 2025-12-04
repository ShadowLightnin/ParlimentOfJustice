// screens/Planets/galaxySystems.js

// Generic icon for Star Trek systems (tiny, shared)
const TREK_ICON = require('../../assets/Space/Earth.jpg');

const deltaY = -0.00045;

export const SYSTEMS = [
  // ===== YOUR JUSTICEVERSE SYSTEMS =====
  {
    id: 'sol',
    name: 'Sol',
    planetId: 'Earth',
    image: require('../../assets/Space/Earth.jpg'),
    x: 0.49955,   // more precise
    y: 0.70485935 + deltaY,   // more precise
    quadrant: 'alpha',
    faction: 'justiceverse',
    universe: 'pinnacle',
  },
  {
    id: 'nemesis',
    name: 'Nemesis',
    planetId: 'planet-x',
    image: require('../../assets/Space/PlanetX.jpg'),
    x: 0.49,
    y: 0.68 + deltaY,
    quadrant: 'alpha',
    faction: 'justiceverse',
    universe: 'prime', // Prime-only
  },
  {
    id: 'wise',
    name: 'Wise',
    planetId: 'wise',
    image: require('../../assets/Space/Wise.jpg'),
    x: 0.45,
    y: 0.72 + deltaY,
    quadrant: 'alpha',
    faction: 'justiceverse',
    universe: 'pinnacle', // Prime-only
  },
  {
    id: 'steppenwolf',
    name: 'Steppenwolf',
    planetId: 'steppenwolf',
    image: require('../../assets/Space/Steppenwolf.jpg'),
    x: 0.55,
    y: 0.62 + deltaY,
    quadrant: 'alpha',
    faction: 'justiceverse',
    universe: 'pinnacle', // Shared (Prime + Pinnacle)
  },
  {
    id: 'reject',
    name: 'Reject',
    planetId: 'reject',
    image: require('../../assets/Space/Reject.jpg'),
    x: 0.42,
    y: 0.65 + deltaY,
    quadrant: 'alpha',
    faction: 'justiceverse',
    universe: 'pinnacle', // Shared (Prime + Pinnacle)
  },
  {
    id: 'ignis',
    name: 'Ignis',
    planetId: 'melcornia',
    image: require('../../assets/Space/Melcornia.jpg'),
    x: 0.6,
    y: 0.6 + deltaY,
    quadrant: 'beta',
    faction: 'justiceverse',
    universe: 'pinnacle', // Shared (Prime + Pinnacle)
  },
  {
    id: 'zaxxon',
    name: 'Zaxxon',
    planetId: 'zaxxon',
    image: require('../../assets/Space/Zaxxon.jpg'),
    x: 0.78,
    y: 0.52 + deltaY,
    quadrant: 'beta',
    faction: 'justiceverse',
    universe: 'pinnacle', // Shared
  },
  {
    id: 'older-brother',
    name: 'Older Brother',
    planetId: 'older-brother',
    image: require('../../assets/Space/OlderBrother.jpg'),
    x: 0.51,
    y: 0.67 + deltaY,
    quadrant: 'alpha',
    faction: 'justiceverse',
    universe: 'prime', // Prime-only
  },
  {
    id: 'twin-sister',
    name: 'Twin Sister',
    planetId: 'twin-sister',
    image: require('../../assets/Space/TwinSister.jpg'),
    x: 0.47,
    y: 0.73 + deltaY,
    quadrant: 'alpha',
    faction: 'justiceverse',
    universe: 'prime', // Prime-only
  },
  {
    id: 'korrthuun',
    name: 'Korrthuun',
    planetId: 'korrthuun',
    image: require('../../assets/Space/Korrthuun.jpg'),
    x: 0.88,
    y: 0.68 + deltaY,
    quadrant: 'beta',
    faction: 'justiceverse',
    universe: 'prime', // 🔥 Prime-only like you said
  },
  {
    id: 'kolob',
    name: 'kolob',
    planetId: null,
    image: require('../../assets/Space/Kolob.jpg'),
    x: 0.52,
    y: 0.46 + deltaY,
    quadrant: 'custom',
    faction: 'justiceverse',
    universe: 'prime', // Prime-only
  },

  // ===== STAR TREK – ALPHA QUADRANT =====
  {
    id: 'vulcan',
    name: 'Vulcan',
    planetId: null,
    image: TREK_ICON,
    x: 0.45,
    y: 0.67 + deltaY,
    quadrant: 'alpha',
    faction: 'federation',
    universe: 'prime',
  },
  {
    id: 'andoria',
    name: 'Andoria',
    planetId: null,
    image: TREK_ICON,
    x: 0.46,
    y: 0.75 + deltaY,
    quadrant: 'alpha',
    faction: 'federation',
    universe: 'prime',
  },
  {
    id: 'tellar-prime',
    name: 'Tellar Prime',
    planetId: null,
    image: TREK_ICON,
    x: 0.43,
    y: 0.71 + deltaY,
    quadrant: 'alpha',
    faction: 'federation',
    universe: 'prime',
  },
  {
    id: 'ferenginar',
    name: 'Ferenginar',
    planetId: null,
    image: TREK_ICON,
    x: 0.38,
    y: 0.63 + deltaY,
    quadrant: 'alpha',
    faction: 'ferengi',
    universe: 'prime',
  },

  // ===== STAR TREK – BETA QUADRANT =====
  {
    id: 'qonos',
    name: "Qo'noS",
    planetId: null,
    image: TREK_ICON,
    x: 0.62,
    y: 0.67 + deltaY,
    quadrant: 'beta',
    faction: 'klingon',
    universe: 'prime',
  },
  {
    id: 'romulus',
    name: 'Romulus',
    planetId: null,
    image: TREK_ICON,
    x: 0.7,
    y: 0.63 + deltaY,
    quadrant: 'beta',
    faction: 'romulan',
    universe: 'prime',
  },
  {
    id: 'cardassia',
    name: 'Cardassia Prime',
    planetId: null,
    image: TREK_ICON,
    x: 0.54,
    y: 0.73 + deltaY,
    quadrant: 'beta',
    faction: 'cardassian',
    universe: 'prime',
  },

  // ===== STAR TREK – GAMMA QUADRANT =====
  {
    id: 'founders-homeworld',
    name: "Founders' Homeworld",
    planetId: null,
    image: TREK_ICON,
    x: 0.33,
    y: 0.3 + deltaY,
    quadrant: 'gamma',
    faction: 'dominion',
    universe: 'prime',
  },
  {
    id: 'vorta-prime',
    name: 'Vorta Prime',
    planetId: null,
    image: TREK_ICON,
    x: 0.28,
    y: 0.22 + deltaY,
    quadrant: 'gamma',
    faction: 'dominion',
    universe: 'prime',
  },
  {
    id: 'jemhadar-world',
    name: 'Jem’Hadar World',
    planetId: null,
    image: TREK_ICON,
    x: 0.36,
    y: 0.4 + deltaY,
    quadrant: 'gamma',
    faction: 'dominion',
    universe: 'prime',
  },

  // ===== STAR TREK – DELTA QUADRANT =====
  {
    id: 'unimatrix-01',
    name: 'Unimatrix 01',
    planetId: null,
    image: TREK_ICON,
    x: 0.78,
    y: 0.22 + deltaY,
    quadrant: 'delta',
    faction: 'borg',
    universe: 'prime',
  },
  {
    id: 'ocampa',
    name: 'Ocampa',
    planetId: null,
    image: TREK_ICON,
    x: 0.88,
    y: 0.18 + deltaY,
    quadrant: 'delta',
    faction: 'delta-world',
    universe: 'prime',
  },
  {
    id: 'talax',
    name: 'Talax',
    planetId: null,
    image: TREK_ICON,
    x: 0.82,
    y: 0.26 + deltaY,
    quadrant: 'delta',
    faction: 'delta-world',
    universe: 'prime',
  },

  // ===== CYBERTRON =====
  {
    id: 'cybertron',
    name: 'Cybertron',
    planetId: null,
    x: 0.8,
    y: 0.33 + deltaY,
    quadrant: 'delta',
    faction: 'cybertronian',
    universe: 'prime',
  },

  {
    id: 'reach',
    name: 'Reach (Epsilon Eridani II)',
    planetId: null,
    // image: HALO_ICON,
    x: 0.53,          // clustered just “above/right” of Sol
    y: 0.70 + deltaY,
    quadrant: 'alpha',
    faction: 'unsc',
    universe: 'prime',
  },
  {
    id: 'harvest',
    name: 'Harvest',
    planetId: null,
    // image: HALO_ICON,
    x: 0.56,
    y: 0.74 + deltaY,
    quadrant: 'alpha',
    faction: 'unsc',
    universe: 'prime',
  },
  {
    id: 'onyx',
    name: 'Onyx',
    planetId: null,
    // image: HALO_ICON,
    x: 0.55,
    y: 0.66 + deltaY,
    quadrant: 'alpha',
    faction: 'unsc',
    universe: 'prime',
  },

  // ==========================
  // ===== HALO – COVENANT / SANGHELIOS CLUSTER (FARTHER FROM SOL) =====
  // ==========================
  {
    id: 'sanghelios',
    name: 'Sanghelios',
    planetId: null,
    // image: HALO_ICON,
    x: 0.30,
    y: 0.33 + deltaY,
    quadrant: 'gamma',     // opposite side of Sol to feel “far”
    faction: 'covenant',
    universe: 'prime',
  },
  {
    id: 'high-charity',
    name: 'High Charity',
    planetId: null,
    // image: HALO_ICON,
    x: 0.35,
    y: 0.26 + deltaY,
    quadrant: 'gamma',
    faction: 'covenant',
    universe: 'prime',
  },
  {
    id: 'requiem',
    name: 'Requiem',
    planetId: null,
    // image: HALO_ICON,
    x: 0.27,
    y: 0.38 + deltaY,
    quadrant: 'gamma',
    faction: 'covenant',
    universe: 'prime',
  },

  // ==========================
  // ===== HALO – FORERUNNER INSTALLATIONS (HALO RINGS & ARK) =====
  // ==========================
  {
    id: 'installation-04',
    name: 'Installation 04 (Alpha Halo)',
    planetId: null,
    // image: HALO_ICON,
    x: 0.76,
    y: 0.14 + deltaY,
    quadrant: 'delta',       // out near the rim
    faction: 'forerunner',
    universe: 'prime',
  },
  {
    id: 'installation-05',
    name: 'Installation 05 (Delta Halo)',
    planetId: null,
    // image: HALO_ICON,
    x: 0.70,
    y: 0.10 + deltaY,
    quadrant: 'delta',
    faction: 'forerunner',
    universe: 'prime',
  },
  {
    id: 'installation-07',
    name: 'Installation 07 (Zeta Halo)',
    planetId: null,
    // image: HALO_ICON,
    x: 0.88,
    y: 0.12 + deltaY,
    quadrant: 'delta',
    faction: 'forerunner',
    universe: 'prime',
  },
  {
    id: 'ark',
    name: 'The Ark (Installation 00)',
    planetId: null,
    // image: HALO_ICON,
    x: 0.92,
    y: 0.45 + deltaY,
    quadrant: 'custom',      // technically extra-galactic
    faction: 'forerunner',
    universe: 'prime',
  },
];

// Simple connections placeholder (kept for future use)
export const CONNECTIONS = [];

/**
 * Universe visibility rules for systems
 *
 * Convention:
 * - system.universe === 'prime'    -> exists ONLY in Prime view
 * - system.universe === 'pinnacle' -> exists in BOTH Prime and Pinnacle views
 *
 * View logic:
 * - viewUniverse === 'prime'    -> see everything (Prime + Pinnacle-tagged)
 * - viewUniverse === 'pinnacle' -> only systems tagged 'pinnacle'
 */
export const isSystemVisibleInUniverse = (systemUniverse, viewUniverse) => {
  if (!viewUniverse) return true; // fallback – show all if not provided

  if (viewUniverse === 'prime') {
    return true; // Prime sees everything
  }

  if (viewUniverse === 'pinnacle') {
    return systemUniverse === 'pinnacle';
  }

  return true;
};

/**
 * Get systems filtered by universe mode.
 */
export const getSystemsForUniverse = (viewUniverse) => {
  return SYSTEMS.filter((sys) =>
    isSystemVisibleInUniverse(sys.universe, viewUniverse)
  );
};

/**
 * Lookup a system based on the planetId it links to (for currentPlanet highlighting + connections).
 */
export const getSystemByPlanetId = (planetId) =>
  SYSTEMS.find((s) => s.planetId === planetId) || null;
