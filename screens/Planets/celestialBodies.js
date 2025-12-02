// screens/Planets/celestialBodies.js

/**
 * PLANETS / CELESTIAL BODIES – global route order
 * Sol → Nemesis system → Rogues → Ignis system → Zaxxon → Older Brother → Twin Sister system → Korrthuun System
 */
export const PLANETS = [

  {
    id: 'Helios',
    name: 'Helios',
    universe: 'prime',
    systemId: 'sol',
    order: 1,
    background: require('../../assets/Space/Sol.jpg'),
    thumbnail: require('../../assets/Space/Sol.jpg'),
    description:
      'The Sun of the Sol System — a stable G-type star whose light birthed Earth, Zion City, and the Parliament of Justice. In the Justiceverse, Helios is watched closely by cosmic factions, because every prophecy starts here.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    universe: 'prime',
    systemId: 'sol',
    order: 2,
    background: require('../../assets/Space/Mercury.jpg'),
    thumbnail: require('../../assets/Space/Mercury.jpg'),
    description:
      'A scorched, metal-rich world skimming close to Helios. In lore, Mercury is used as a proving ground for experimental heat-shielding and early prototype armor tests.',
  },
  {
    id: 'venus',
    name: 'Venus',
    universe: 'prime',
    systemId: 'sol',
    order: 3,
    background: require('../../assets/Space/Venus.jpg'),
    thumbnail: require('../../assets/Space/Venus.jpg'),
    description:
      'A runaway-greenhouse hell wrapped in sulfuric clouds. Rumors say Erevos once considered terraforming Venus into a fortress world, but even he deemed it too unstable.',
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
        description: 'The Parliament’s heart in Utah, a rising modern megacity.',
        image: require('../../assets/ParliamentTower.jpg'),
        position: { top: '55%', left: '18%' },
      },
      {
        id: 'aegis',
        name: 'The Aegis Compound',
        description: 'Desert fortress HQ for the Parliament’s true operations.',
        image: require('../../assets/BackGround/ShipYard.jpg'),
        position: { top: '35%', left: '70%' },
      },
    ],
    description:
      'Homeworld of the Parliament of Justice and the site of The Incident. Modern Earth looks ordinary from orbit, but Zion City and the Aegis Compound have turned it into the nexus of a coming cosmic war.',
  },
  {
    id: 'Luna',
    name: 'Luna',
    universe: 'prime',
    systemId: 'sol',
    order: 5,
    background: require('../../assets/Space/Luna.jpg'),
    thumbnail: require('../../assets/Space/Luna.jpg'),
    description:
      'Earth’s ancient moon, scarred by impacts and human footprints. Parliament listening posts and early-warning arrays are buried deep under its maria.',
  },
  {
    id: 'mars',
    name: 'Mars',
    universe: 'prime',
    systemId: 'sol',
    order: 6,
    background: require('../../assets/Space/Mars.jpg'),
    thumbnail: require('../../assets/Space/Mars.jpg'),
    description:
      'The red desert world. In the Justiceverse, Mars is the site of abandoned pre-Incident research stations and the first failed attempt at an off-world Parliament outpost.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    universe: 'prime',
    systemId: 'sol',
    order: 7,
    background: require('../../assets/Space/Jupiter.jpg'),
    thumbnail: require('../../assets/Space/Jupiter.jpg'),
    description:
      'A titanic gas giant and the system’s gravitational shield. Jupiter’s magnetosphere hides classified deep-space docks used by Parliament capital ships.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    universe: 'prime',
    systemId: 'sol',
    order: 8,
    background: require('../../assets/Space/Saturn.jpg'),
    thumbnail: require('../../assets/Space/Saturn.jpg'),
    description:
      'The ringed giant. Mining guilds operate in the rings under Parliament oversight, harvesting ice and rock for shipyards near Titan.',
  },
  {
    id: 'titan',
    name: 'Titan',
    universe: 'prime',
    systemId: 'sol',
    order: 9,
    background: require('../../assets/Space/Titan.jpg'),
    thumbnail: require('../../assets/Space/Titan.jpg'),
    description:
      'Saturn’s hazy, hydrocarbon-rich moon. Titan hosts secret black-ops labs where experimental Maw-countermeasure tech is tested in the cold, orange gloom.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    universe: 'prime',
    systemId: 'sol',
    order: 10,
    background: require('../../assets/Space/Uranus.jpg'),
    thumbnail: require('../../assets/Space/Uranus.jpg'),
    description:
      'An ice giant tilted on its side, wrapped in pale blue clouds. In lore, Uranus marks the edge of routine Parliament patrols in the Sol System.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    universe: 'prime',
    systemId: 'sol',
    order: 11,
    background: require('../../assets/Space/Neptune.jpg'),
    thumbnail: require('../../assets/Space/Neptune.jpg'),
    description:
      'The far blue giant, guardian of the deep Kuiper Belt. Its storms mask the movements of smugglers and fringe cults who worship the Maw.',
  },
  {
    id: 'triton',
    name: 'Triton',
    universe: 'prime',
    systemId: 'sol',
    order: 12,
    background: require('../../assets/Space/Triton.jpg'),
    thumbnail: require('../../assets/Space/Triton.jpg'),
    description:
      'Neptune’s captured, retrograde moon. Parliament surveyors suspect ancient alien artifacts buried beneath its cryovolcanic plains.',
  },
  {
    id: 'pluto',
    name: 'Pluto',
    universe: 'prime',
    systemId: 'sol',
    order: 13,
    background: require('../../assets/Space/Pluto.jpg'),
    thumbnail: require('../../assets/Space/Pluto.jpg'),
    description:
      'A lonely dwarf world on the system’s fringe. Pluto is a refueling and listening waypoint for ships vanishing into the dark beyond Sol.',
  },
  {
    id: 'quaoar',
    name: 'Quaoar',
    universe: 'prime',
    systemId: 'sol',
    order: 14,
    background: require('../../assets/Space/Quaoar.jpg'),
    thumbnail: require('../../assets/Space/Quaoar.jpg'),
    description:
      'A distant Kuiper Belt dwarf with fragile rings. In the Justiceverse, Quaoar’s unusual ring system is suspected to be the residue of a shattered Maw probe.',
  },
  {
    id: 'planet9',
    name: 'Planet 9',
    universe: 'prime',
    systemId: 'sol',
    order: 15,
    background: require('../../assets/Space/Planet9.jpg'),
    thumbnail: require('../../assets/Space/Planet9.jpg'),
    description:
      'A hypothesized super-Earth or mini-Neptune lurking in the deep dark, inferred from the orbits of distant objects. In-universe, Planet 9 is a ghost-mass the Parliament has not yet fully confirmed.',
  },
  {
    id: 'Planet 10',
    name: 'Planet 10',
    universe: 'prime',
    systemId: 'sol',
    order: 16,
    background: require('../../assets/Space/Planet10.jpg'),
    thumbnail: require('../../assets/Space/Planet10.jpg'),
    description:
      'A theoretical second hidden giant beyond Planet 9. Some Enlightened seers claim Planet 10 is a Maw seed, slowly waking on the edge of Sol.',
  },

  // ===== NEMESIS STAR SYSTEM =====
  {
    id: 'nemesis',
    name: 'Nemesis',
    universe: 'prime',
    systemId: 'nemesis',
    order: 16,
    background: require('../../assets/Space/Nemesis.jpg'),
    thumbnail: require('../../assets/Space/Nemesis.jpg'),
    description:
      'A hypothetical dark companion to Helios — a faint star or brown dwarf on a vast orbit. In the Justiceverse, Nemesis is whispered about in cult circles as the “shadow sun” that heralds cosmic reset events.',
  },
  {
    id: 'goblin-planet',
    name: 'The Goblin Perturbing Planet',
    universe: 'prime',
    systemId: 'nemesis',
    order: 17,
    background: require('../../assets/Space/TheGoblinsPerturbingPlanet.jpg'),
    thumbnail: require('../../assets/Space/TheGoblinsPerturbingPlanet.jpg'),
    description:
      'A massive unseen world invoked to explain the bizarre orbit of the distant object nicknamed “The Goblin.” In lore, it is a stealth-shrouded waystation used by deep-space raiders.',
  },
  {
    id: 'nibiru',
    name: 'Nibiru',
    universe: 'prime',
    systemId: 'nemesis',
    order: 18,
    background: require('../../assets/Space/Nibiru.jpg'),
    thumbnail: require('../../assets/Space/Nibiru.jpg'),
    description:
      'The mythical “doomsday planet” of conspiracy legends. In the Justiceverse, Nibiru is not a real world but a forged data-shadow planted by Erevos to misdirect paranoid civilizations.',
  },
  {
    id: 'planet-x',
    name: 'Planet X',
    universe: 'prime',
    systemId: 'nemesis',
    order: 19,
    background: require('../../assets/Space/PlanetX.jpg'),
    thumbnail: require('../../assets/Space/PlanetX.jpg'),
    description:
      'A catch-all name for any undiscovered massive body roaming beyond known planets. Parliament archives label several different candidate objects as “Planet X,” none yet confirmed.',
  },

  // ===== ROGUE OBJECTS =====
  {
    id: 'wise',
    name: 'Wise',
    universe: 'prime',
    systemId: 'rogues',
    order: 20,
    background: require('../../assets/Space/Wise.jpg'),
    thumbnail: require('../../assets/Space/Wise.jpg'),
    description:
      'A cold rogue object detected in deep survey data — a wandering body untethered from any star. Justiceverse rumor: Wise was thrown free of its system by an early encounter with the Maw.',
  },

  // ===== IGNIS SYSTEM (PINNACLE) – black hole + star + others =====
  {
    id: 'noctheron',
    name: 'Noctheron',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 21,
    background: require('../../assets/Space/Noctheron.jpg'),
    thumbnail: require('../../assets/Space/Noctheron.jpg'),
    description:
      'A hungry black hole at the heart of the Ignis System. Space here folds and screams; this is one of the gateways through which the Maw’s influence seeps into the Pinnacle Universe.',
  },
  {
    id: 'ignis-prime',
    name: 'Ignis Prime',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 22,
    background: require('../../assets/Space/IgnisPrime.jpg'),
    thumbnail: require('../../assets/Space/IgnisPrime.jpg'),
    description:
      'The central star of the Ignis System, burning hot and unstable. Its flares carve shifting safe-lanes through the warped gravity around Noctheron.',
  },
  {
    id: 'vortanite-field',
    name: 'Vortanite Asteroid Field',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 24,
    background: require('../../assets/Space/Vortaniteasteroidfield.jpg'),
    thumbnail: require('../../assets/Space/Vortaniteasteroidfield.jpg'),
    description:
      'A dense asteroid belt saturated with vortanite — an exotic ore that amplifies both starship drives and Maw corruption. Mining here is insanely profitable and insanely dangerous.',
  },
  {
    id: 'melcornia',
    name: 'Melcornia',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 25,
    background: require('../../assets/Space/Melcornia.jpg'),
    thumbnail: require('../../assets/Space/Melcornia.jpg'),
    hotspots: [
      {
        id: 'maw-rift',
        name: 'The Maw Rift',
        description: 'The scar where the Maw’s influence first shattered the planet.',
        image: require('../../assets/Space/Mirror.jpg'),
        position: { top: '48%', left: '28%' },
      },
    ],
    description:
      'Once a living world, now a fractured, haunted planet carved open by the Maw. This is where Velathar fell, and where Void Walker’s destiny took its darkest turn.',
  },

  // ===== ZAXXON SYSTEM =====
  {
    id: 'zaxxon',
    name: 'Zaxxon',
    universe: 'pinnacle',
    systemId: 'zaxxon',
    order: 26,
    background: require('../../assets/Space/Zaxxon.jpg'),
    thumbnail: require('../../assets/Space/Zaxxon.jpg'),
    description:
      'A fortress-world wrapped in defensive rings and shipyards. Zaxxon is a militarized hub contested by Parliament fleets, Thunder Born raiders, and Maw-touched warlords.',
  },

  // ===== OLDER BROTHER STAR =====
  {
    id: 'older-brother',
    name: 'Older Brother',
    universe: 'prime',
    systemId: 'older-brother',
    order: 27,
    background: require('../../assets/Space/OlderBrother.jpg'),
    thumbnail: require('../../assets/Space/OlderBrother.jpg'),
    description:
      'The star HD 162826 — a suspected solar sibling around 110 light-years away in Hercules, slightly warmer and more massive than the Sun. In the Justiceverse, “Older Brother” watches the Sol System from afar, its own worlds bearing echoes of humanity’s lost potential.',
  },

  // ===== TWIN SISTER SYSTEM =====
  {
    id: 'twin-sister',
    name: 'Twin Sister',
    universe: 'prime',
    systemId: 'twin-sister',
    order: 28,
    background: require('../../assets/Space/TwinSister.jpg'),
    thumbnail: require('../../assets/Space/TwinSister.jpg'),
    description:
      'The star HD 186302 — an almost perfect solar twin about 184 light-years away. Astronomers consider it one of the Sun’s closest analogues; in-universe it is literally the Sun’s “twin sister,” with a system that feels eerily familiar.',
  },
  {
    id: 'planet-v',
    name: 'Planet V',
    universe: 'prime',
    systemId: 'twin-sister',
    order: 29,
    background: require('../../assets/Space/PlanetV.jpg'),
    thumbnail: require('../../assets/Space/PlanetV.jpg'),
    description:
      'An echo of the theorized lost “Planet V” of the early solar system, here realized as a fully intact world orbiting Twin Sister. Parliament xenologists study it to understand what Sol’s own missing planet might have been.',
  },
  {
    id: 'ice-giant',
    name: 'Ice Giant',
    universe: 'prime',
    systemId: 'twin-sister',
    order: 30,
    background: require('../../assets/Space/IceGiant.jpg'),
    thumbnail: require('../../assets/Space/IceGiant.jpg'),
    description:
      'A distant ice giant in the Twin Sister system that mirrors our own Uranus/Neptune analogues. Its storm bands carry radio whispers that sound uncannily like human voices.',
  },

  // ===== KORRTHUUN SYSTEM (TORATH'S DOMAIN) =====
  {
    id: 'korrthuun',
    name: 'Korrthuun',
    universe: 'pinnacle',
    systemId: 'korrthuun',
    order: 31,
    background: require('../../assets/Space/Korrthuun.jpg'),
    thumbnail: require('../../assets/Space/Korrthuun.jpg'),
    description:
      'Torath’s throne world — once called Draegos, now reforged into an industrial, war-scarred dystopia. The Nihilborn march across its obsidian plains, and the Black Crucible rises here, housing the Omega Core that feeds Torath’s dominion.',
  },
];


/**
 * Earth special sides (only Earth uses these inside the planet disk)
 */
export const EARTH_SIDE_IMAGES = {
  na: require('../../assets/Space/NorthAmericanSide.jpg'),
  ph: require('../../assets/Space/PhilippinesSide.jpg'),
};

/**
 * Star systems list for jump controls
 */
export const SYSTEMS = [
  { id: 'sol',           name: 'Sol System',          order: 1 },
  { id: 'nemesis',       name: 'Nemesis System',      order: 2 },
  { id: 'rogues',        name: 'Rogues',              order: 3 },
  { id: 'ignis',         name: 'Ignis System',        order: 4 },
  { id: 'zaxxon',        name: 'Zaxxon System',       order: 5 },
  { id: 'older-brother', name: 'Older Brother Star',  order: 6 },
  { id: 'twin-sister',   name: 'Twin Sister System',  order: 7 },
  { id: 'korrthuun',     name: 'Korrthuun System',    order: 8 },
];

export const sortPlanets = () => {
  return [...PLANETS].sort((a, b) => (a.order || 0) - (b.order || 0));
};

/** IDs that should be treated as central bodies (stars / black hole, no orbit index) */
const CENTRAL_BODY_IDS = ['Helios', 'ignis-black-hole', 'nemesis', 'older-brother', 'twin-sister'];

/** IDs that are moons (orbit planets, not the system’s central mass) */
const MOON_IDS = ['Luna', 'titan', 'triton'];

const isCentralBody = (body) => CENTRAL_BODY_IDS.includes(body.id);
const isMoon = (body) => MOON_IDS.includes(body.id);

/**
 * Compute "Orbit position" label per system.
 * - Central bodies (stars / black hole) return null.
 * - Moons are ignored when computing orbit index.
 * - For each system, non-central, non-moon bodies are sorted by `order` and numbered 1..N.
 */
export const getOrbitPositionLabel = (planet, allPlanets) => {
  if (!planet) return null;
  if (isCentralBody(planet)) return null;

  const sameSystemBodies = allPlanets
    .filter(p => p.systemId === planet.systemId && !isCentralBody(p) && !isMoon(p))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const idx = sameSystemBodies.findIndex(p => p.id === planet.id);
  if (idx === -1) return null;

  return idx + 1;
};
