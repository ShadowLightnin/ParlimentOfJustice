// screens/Planets/galaxySystems.js

// Generic icon for Star Trek systems (tiny, shared)
const TREK_ICON = require('../../assets/Space/Earth.jpg');

const deltaY = -0.00045;

export const SYSTEMS = [
  // ===== YOUR JUSTICEVERSE SYSTEMS =====
  {
    id: 'sol',
    name: 'Sol',
    planetId: 'earth',
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
    id: 'rogues',
    name: 'Rogues',
    planetId: 'wise',
    image: require('../../assets/Space/Wise.jpg'),
    x: 0.45,
    y: 0.72 + deltaY,
    quadrant: 'alpha',
    faction: 'justiceverse',
    universe: 'prime', // Prime-only
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
