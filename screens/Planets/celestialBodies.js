// screens/Planets/celestialBodies.js

/**
 * GLOBAL PLANETARY ORDER
 * Sol → Nemesis → Rogues → Ignis → Zaxxon → Older Brother → Twin Sister → Korrthuun
 */

export const PLANETS = [
  // ============================
  // SOL SYSTEM (Prime)
  // ============================
  {
    id: 'Helios',
    name: 'Helios',
    universe: 'prime',
    systemId: 'sol',
    order: 1,
    background: require('../../assets/Space/Sol.jpg'),
    thumbnail: require('../../assets/Space/Sol.jpg'),
    description:
      'The Sun — heart of the Sol System and birthplace of Earth, Zion City, and the Parliament.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    universe: 'prime',
    systemId: 'sol',
    order: 2,
    background: require('../../assets/Space/Mercury.jpg'),
    thumbnail: require('../../assets/Space/Mercury.jpg'),
    description: 'A scorched metal-rich world.',
  },
  {
    id: 'venus',
    name: 'Venus',
    universe: 'prime',
    systemId: 'sol',
    order: 3,
    background: require('../../assets/Space/Venus.jpg'),
    thumbnail: require('../../assets/Space/Venus.jpg'),
    description: 'A runaway greenhouse hell.',
  },
  {
    id: 'earth',
    name: 'Earth',
    universe: 'prime',
    systemId: 'sol',
    order: 4,
    background: require('../../assets/Space/Earth.jpg'),
    thumbnail: require('../../assets/Space/Earth.jpg'),
    hotspots: [
      {
        id: 'zion',
        name: 'Zion City',
        description: 'The Parliament’s heart in Utah.',
        image: require('../../assets/ParliamentTower.jpg'),
        position: { top: '55%', left: '18%' },
      },
      {
        id: 'aegis',
        name: 'The Aegis Compound',
        description: 'Desert fortress HQ for the Parliament.',
        image: require('../../assets/BackGround/ShipYard.jpg'),
        position: { top: '35%', left: '70%' },
      },
    ],
    description:
      'Homeworld of the Parliament of Justice and the site of The Incident.',
  },
  {
    id: 'Luna',
    name: 'Luna',
    universe: 'prime',
    systemId: 'sol',
    order: 5,
    background: require('../../assets/Space/Luna.jpg'),
    thumbnail: require('../../assets/Space/Luna.jpg'),
    description: 'Earth’s ancient moon.',
  },
  {
    id: 'mars',
    name: 'Mars',
    universe: 'prime',
    systemId: 'sol',
    order: 6,
    background: require('../../assets/Space/Mars.jpg'),
    thumbnail: require('../../assets/Space/Mars.jpg'),
    description: 'The red desert world.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    universe: 'prime',
    systemId: 'sol',
    order: 7,
    background: require('../../assets/Space/Jupiter.jpg'),
    thumbnail: require('../../assets/Space/Jupiter.jpg'),
    description: 'A titanic gas giant.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    universe: 'prime',
    systemId: 'sol',
    order: 8,
    background: require('../../assets/Space/Saturn.jpg'),
    thumbnail: require('../../assets/Space/Saturn.jpg'),
    description: 'The ringed giant.',
  },
  {
    id: 'titan',
    name: 'Titan',
    universe: 'prime',
    systemId: 'sol',
    order: 9,
    background: require('../../assets/Space/Titan.jpg'),
    thumbnail: require('../../assets/Space/Titan.jpg'),
    description: 'A hazy moon of Saturn.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    universe: 'prime',
    systemId: 'sol',
    order: 10,
    background: require('../../assets/Space/Uranus.jpg'),
    thumbnail: require('../../assets/Space/Uranus.jpg'),
    description: 'An ice giant tilted on its side.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    universe: 'prime',
    systemId: 'sol',
    order: 11,
    background: require('../../assets/Space/Neptune.jpg'),
    thumbnail: require('../../assets/Space/Neptune.jpg'),
    description: 'The far blue giant.',
  },
  {
    id: 'triton',
    name: 'Triton',
    universe: 'prime',
    systemId: 'sol',
    order: 12,
    background: require('../../assets/Space/Triton.jpg'),
    thumbnail: require('../../assets/Space/Triton.jpg'),
    description: 'Captured retrograde moon.',
  },
  {
    id: 'pluto',
    name: 'Pluto',
    universe: 'prime',
    systemId: 'sol',
    order: 13,
    background: require('../../assets/Space/Pluto.jpg'),
    thumbnail: require('../../assets/Space/Pluto.jpg'),
    description: 'Cold dwarf world.',
  },
  {
    id: 'quaoar',
    name: 'Quaoar',
    universe: 'prime',
    systemId: 'sol',
    order: 14,
    background: require('../../assets/Space/Quaoar.jpg'),
    thumbnail: require('../../assets/Space/Quaoar.jpg'),
    description: 'Kuiper Belt dwarf with unusual rings.',
  },
  {
    id: 'planet9',
    name: 'Planet 9',
    universe: 'prime',
    systemId: 'sol',
    order: 15,
    background: require('../../assets/Space/Planet9.jpg'),
    thumbnail: require('../../assets/Space/Planet9.jpg'),
    description: 'Hypothetical deep planet.',
  },
  {
    id: 'planet10',
    name: 'Planet 10',
    universe: 'prime',
    systemId: 'sol',
    order: 16,
    background: require('../../assets/Space/Planet10.jpg'),
    thumbnail: require('../../assets/Space/Planet10.jpg'),
    description: 'Another hypothetical outer giant.',
  },

  // ============================
  // NEMESIS (Prime)
  // ============================
  {
    id: 'nemesis',
    name: 'Nemesis',
    universe: 'prime',
    systemId: 'nemesis',
    order: 17,
    background: require('../../assets/Space/Nemesis.jpg'),
    thumbnail: require('../../assets/Space/Nemesis.jpg'),
    description: 'The hypothetical “dark twin” of the Sun.',
  },
  {
    id: 'goblin-planet',
    name: 'The Goblin Perturbing Planet',
    universe: 'prime',
    systemId: 'nemesis',
    order: 18,
    background: require('../../assets/Space/TheGoblinsPerturbingPlanet.jpg'),
    thumbnail: require('../../assets/Space/TheGoblinsPerturbingPlanet.jpg'),
    description: 'Massive unseen perturber.',
  },
  {
    id: 'nibiru',
    name: 'Nibiru',
    universe: 'prime',
    systemId: 'nemesis',
    order: 19,
    background: require('../../assets/Space/Nibiru.jpg'),
    thumbnail: require('../../assets/Space/Nibiru.jpg'),
    description: 'Mythical doomsday world.',
  },
  {
    id: 'planet-x',
    name: 'Planet X',
    universe: 'prime',
    systemId: 'nemesis',
    order: 20,
    background: require('../../assets/Space/PlanetX.jpg'),
    thumbnail: require('../../assets/Space/PlanetX.jpg'),
    description: 'Catch-all name for unknown massive objects.',
  },

  // ============================
  // ROGUE OBJECTS (Prime)
  // ============================
  {
    id: 'wise',
    name: 'Wise',
    universe: 'prime',
    systemId: 'rogues',
    order: 21,
    background: require('../../assets/Space/Wise.jpg'),
    thumbnail: require('../../assets/Space/Wise.jpg'),
    description: 'A cold rogue world.',
  },

  // ============================
  // IGNIS SYSTEM (Pinnacle)
  // ============================
  {
    id: 'noctheron',
    name: 'Noctheron',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 22,
    background: require('../../assets/Space/Noctheron.jpg'),
    thumbnail: require('../../assets/Space/Noctheron.jpg'),
    description: 'The hungry black hole.',
  },
  {
    id: 'ignis-prime',
    name: 'Ignis Prime',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 23,
    background: require('../../assets/Space/IgnisPrime.jpg'),
    thumbnail: require('../../assets/Space/IgnisPrime.jpg'),
    description: 'The star of the Ignis System.',
  },
  {
    id: 'vortanite-field',
    name: 'Vortanite Asteroid Field',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 24,
    background: require('../../assets/Space/Vortaniteasteroidfield.jpg'),
    thumbnail: require('../../assets/Space/Vortaniteasteroidfield.jpg'),
    description: 'Asteroids infused with vortanite.',
  },
  {
    id: 'melcornia',
    name: 'Melcornia',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 25,
    background: require('../../assets/Space/Melcornia.jpg'),
    thumbnail: require('../../assets/Space/Melcornia.jpg'),
    description:
      'Fragmented planet scarred by the Maw.',
  },

  // ============================
  // ZAXXON SYSTEM (Pinnacle)
  // ============================
  {
    id: 'zaxxon',
    name: 'Zaxxon',
    universe: 'pinnacle',
    systemId: 'zaxxon',
    order: 26,
    background: require('../../assets/Space/Zaxxon.jpg'),
    thumbnail: require('../../assets/Space/Zaxxon.jpg'),
    description: 'Fortress world wrapped in defensive rings.',
  },

  // ============================
  // OLDER BROTHER (Prime)
  // ============================
  {
    id: 'older-brother',
    name: 'Older Brother',
    universe: 'prime',
    systemId: 'older-brother',
    order: 27,
    background: require('../../assets/Space/OlderBrother.jpg'),
    thumbnail: require('../../assets/Space/OlderBrother.jpg'),
    description: 'The Sun’s solar sibling.',
  },

  // ============================
  // TWIN SISTER (Prime)
  // ============================
  {
    id: 'twin-sister',
    name: 'Twin Sister',
    universe: 'prime',
    systemId: 'twin-sister',
    order: 28,
    background: require('../../assets/Space/TwinSister.jpg'),
    thumbnail: require('../../assets/Space/TwinSister.jpg'),
    description: 'The Sun’s twin star.',
  },
  {
    id: 'planet-v',
    name: 'Planet V',
    universe: 'prime',
    systemId: 'twin-sister',
    order: 29,
    background: require('../../assets/Space/PlanetV.jpg'),
    thumbnail: require('../../assets/Space/PlanetV.jpg'),
    description: 'Echo of our lost early planet.',
  },
  {
    id: 'ice-giant',
    name: 'Ice Giant',
    universe: 'prime',
    systemId: 'twin-sister',
    order: 30,
    background: require('../../assets/Space/IceGiant.jpg'),
    thumbnail: require('../../assets/Space/IceGiant.jpg'),
    description: 'Distant ice giant.',
  },

  // ============================
  // KORRTHUUN (Prime Only)
  // ============================
  {
    id: 'korrthuun',
    name: 'Korrthuun',
    universe: 'prime',
    systemId: 'korrthuun',
    order: 31,
    background: require('../../assets/Space/Korrthuun.jpg'),
    thumbnail: require('../../assets/Space/Korrthuun.jpg'),
    description:
      'Torath’s war-scarred throne world.',
  },
];

/** Earth sides */
export const EARTH_SIDE_IMAGES = {
  na: require('../../assets/Space/NorthAmericanSide.jpg'),
  ph: require('../../assets/Space/PhilippinesSide.jpg'),
};

/** SYSTEMS (Order matters) */
export const SYSTEMS = [
  { id: 'sol', name: 'Sol System', order: 1 },
  { id: 'nemesis', name: 'Nemesis System', order: 2 },
  { id: 'rogues', name: 'Rogue Objects', order: 3 },
  { id: 'ignis', name: 'Ignis System', order: 4 },
  { id: 'zaxxon', name: 'Zaxxon System', order: 5 },
  { id: 'older-brother', name: 'Older Brother Star', order: 6 },
  { id: 'twin-sister', name: 'Twin Sister System', order: 7 },
  { id: 'korrthuun', name: 'Korrthuun System', order: 8 },
];

/** Sorting */
export const sortPlanets = () =>
  [...PLANETS].sort((a, b) => (a.order || 0) - (b.order || 0));

/**
 * UNIVERSE VISIBILITY LOGIC (FIXED)
 * Prime Universe → sees EVERYTHING
 * Pinnacle Universe → sees ONLY planets where planet.universe === 'pinnacle'
 */
export const isVisibleInUniverse = (planetUniverse, viewUniverse) => {
  if (viewUniverse === 'prime') return true;
  if (viewUniverse === 'pinnacle') return planetUniverse === 'pinnacle';
  return true;
};

export const getPlanetsForUniverse = (viewUniverse) =>
  sortPlanets().filter((p) => isVisibleInUniverse(p.universe, viewUniverse));

export const getSystemsForUniverse = (viewUniverse) => {
  const visiblePlanets = getPlanetsForUniverse(viewUniverse);
  const visibleSystemIds = new Set(visiblePlanets.map((p) => p.systemId));

  return SYSTEMS.filter((sys) => visibleSystemIds.has(sys.id)).sort(
    (a, b) => a.order - b.order
  );
};

/** Orbit label rules */
const CENTRAL_BODY_IDS = [
  'Helios',
  'noctheron',
  'nemesis',
  'older-brother',
  'twin-sister',
];

const MOON_IDS = ['Luna', 'titan', 'triton'];

const isCentralBody = (p) => CENTRAL_BODY_IDS.includes(p.id);
const isMoon = (p) => MOON_IDS.includes(p.id);

export const getOrbitPositionLabel = (planet, all) => {
  if (!planet) return null;
  if (isCentralBody(planet)) return null;

  const same = all
    .filter(
      (p) =>
        p.systemId === planet.systemId &&
        !isCentralBody(p) &&
        !isMoon(p)
    )
    .sort((a, b) => a.order - b.order);

  const idx = same.findIndex((p) => p.id === planet.id);
  return idx === -1 ? null : idx + 1;
};
