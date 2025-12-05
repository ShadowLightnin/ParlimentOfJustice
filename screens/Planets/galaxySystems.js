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
    universe: 'prime', // Shared (Prime + Pinnacle)
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
    universe: 'prime', // Shared (Prime + Pinnacle)
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

// UNSC core colony – Reach
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
// Sanghelios – Elite homeworld
{
  id: 'sanghelios',
  name: 'Sanghelios',
  planetId: null,
  // image: HALO_ICON,
  x: 0.68,
  y: 0.58 + deltaY,
  quadrant: 'beta',
  faction: 'covenant',
  universe: 'prime',
},

// Doisac – Jiralhanae (Brute) homeworld
{
  id: 'doisac',
  name: 'Doisac',
  planetId: null,
  // image: HALO_ICON,
  x: 0.73,
  y: 0.62 + deltaY,
  quadrant: 'beta',
  faction: 'covenant',
  universe: 'prime',
},

// Banished presence around Zeta Halo
{
  id: 'banished-zeta-front',
  name: 'Banished Zeta Front',
  planetId: null,
  // image: HALO_ICON,
  x: 0.92,
  y: 0.15 + deltaY,    // Near Installation 07
  quadrant: 'delta',
  faction: 'banished',
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
// ===== HALO – FORERUNNER INSTALLATIONS (RINGS)
// ==========================

// Installation 01
{
  id: 'installation-01',
  name: 'Installation 01',
  planetId: null,
  // image: HALO_ICON,
  x: 0.30,             // Gamma mid-rim
  y: 0.28 + deltaY,
  quadrant: 'gamma',
  faction: 'forerunner',
  universe: 'prime',
},

// Installation 02
{
  id: 'installation-02',
  name: 'Installation 02',
  planetId: null,
  // image: HALO_ICON,
  x: 0.22,             // Alpha outer arc
  y: 0.80 + deltaY,
  quadrant: 'alpha',
  faction: 'forerunner',
  universe: 'prime',
},

// Installation 03
{
  id: 'installation-03',
  name: 'Installation 03',
  planetId: null,
  // image: HALO_ICON,
  x: 0.27,
  y: 0.34 + deltaY,
  quadrant: 'gamma',
  faction: 'forerunner',
  universe: 'prime',
},

// Installation 04 (Alpha Halo)
  {
    id: 'installation-04',
    name: 'Installation 04 (Alpha Halo)',
    planetId: null,
    // image: HALO_ICON,
    x: 0.40,
    y: 0.55 + deltaY,
    quadrant: 'delta',       // out near the rim
    faction: 'forerunner',
    universe: 'prime',
  },

// Installation 05 (Delta Halo)
{
  id: 'installation-05',
  name: 'Installation 05 (Delta Halo)',
  planetId: null,
  // image: HALO_ICON,
  x: 0.85,
  y: 0.24 + deltaY,
  quadrant: 'delta',
  faction: 'forerunner',
  universe: 'prime',
},

// Installation 06
{
  id: 'installation-06',
  name: 'Installation 06',
  planetId: null,
  // image: HALO_ICON,
  x: 0.70,
  y: 0.40 + deltaY,
  quadrant: 'delta',
  faction: 'forerunner',
  universe: 'prime',
},

// Installation 07 (Zeta Halo)
{
  id: 'installation-07',
  name: 'Installation 07 (Zeta Halo)',
  planetId: null,
  // image: HALO_ICON,
  x: 0.90,
  y: 0.10 + deltaY,    // Drifting near galactic edge
  quadrant: 'delta',
  faction: 'forerunner',
  universe: 'prime',
},

// Installation 00 – The Ark (extra-galactic)
{
  id: 'ark',
  name: 'The Ark (Installation 00)',
  planetId: null,
  // image: HALO_ICON,
  x: 0.96,
  y: 0.50 + deltaY,    // Off the disk edge in your map
  quadrant: 'custom',
  faction: 'forerunner',
  universe: 'prime',
},

// ==========================
// ===== HALO – SHIELD WORLDS
// ==========================

{
  id: 'onyx',
  name: 'Onyx (Shield World)',
  planetId: null,
  // image: HALO_ICON,
  x: 0.35,
  y: 0.78 + deltaY,    // Outer Alpha, UNSC frontier feel
  quadrant: 'alpha',
  faction: 'unsc',
  universe: 'prime',
},

{
  id: 'requiem',
  name: 'Requiem (Shield World)',
  planetId: null,
  // image: HALO_ICON,
  x: 0.76,
  y: 0.32 + deltaY,    // Deep Forerunner territory
  quadrant: 'delta',
  faction: 'forerunner',
  universe: 'prime',
},

{
  id: 'shield-world-0459',
  name: 'Shield World 0459',
  planetId: null,
  // image: HALO_ICON,
  x: 0.20,
  y: 0.40 + deltaY,
  quadrant: 'gamma',
  faction: 'forerunner',
  universe: 'prime',
},

// ==========================
// ===== HALO – PRECURSOR / ANCIENT
// ==========================

{
  id: 'path-kethona',
  name: 'Path Kethona Expanse',
  planetId: null,
  // image: HALO_ICON,
  x: 0.04,
  y: 0.52 + deltaY,    // Extra-rim region
  quadrant: 'custom',
  faction: 'precursor',
  universe: 'prime',
},

{
  id: 'precursor-cradle',
  name: 'Precursor Cradle World',
  planetId: null,
  // image: HALO_ICON,
  x: 0.12,
  y: 0.20 + deltaY,
  quadrant: 'gamma',
  faction: 'precursor',
  universe: 'prime',
},

// ==========================
// ===== HALO – FLOOD ZONES
// ==========================

{
  id: 'high-charity',
  name: 'High Charity (Infested Ruin)',
  planetId: null,
  // image: HALO_ICON,
  x: 0.82,
  y: 0.20 + deltaY,
  quadrant: 'delta',
  faction: 'flood',
  universe: 'prime',
},

{
  id: 'threshold',
  name: 'Threshold System',
  planetId: null,
  // image: HALO_ICON,
  x: 0.42,
  y: 0.58 + deltaY,    // Near Installation 04
  quadrant: 'alpha',
  faction: 'flood',
  universe: 'prime',
},

{
  id: 'flood-quarantine-zone',
  name: 'Flood Quarantine Zone',
  planetId: null,
  // image: HALO_ICON,
  x: 0.18,
  y: 0.12 + deltaY,
  quadrant: 'gamma',
  faction: 'flood',
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
