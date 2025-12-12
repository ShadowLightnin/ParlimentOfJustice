// OlympiansDescription.js
// Each entry supports:
// - about: string
// - color: hex string (accent color used in the UI)
// - points: [string, string, string] -> rendered as "word • word • word"

const descriptions = {
  default: {
    about: "A legend in the making. Their story is still being forged.",
    color: "#00b3ff",
    points: ["Loyal", "Resilient", "Rising"],
  },

  // === Parents ===
  Angela: {
    about: "Celestial Angel — steadfast light, guiding calm, and protective grace when the world turns dark.",
    color: "#ffd36b",
    points: ["Grace", "Courage", "Light"],
  },
  Todd: {
    about: "Stellar — disciplined strength with a steady hand, built to protect and endure.",
    color: "#7acbff",
    points: ["Steady", "Bold", "Guardian"],
  },
  Molly: {
    about: "Teddy Bear — warmth and comfort with surprising toughness when it matters most.",
    color: "#ff89c6",
    points: ["Warm", "Brave", "Kind"],
  },

  // === Cummings branch (Lora / Wayne / kids) ===
  Lora: {
    about: "Roseheart — compassionate and fierce, blooming hope where others see only ruin.",
    color: "#ff6bd9",
    points: ["Heart", "Bloom", "Hope"],
  },
  Wayne: {
    about: "Sovereign — commanding presence, protective instincts, and unwavering resolve.",
    color: "#d4b6ff",
    points: ["Command", "Honor", "Steel"],
  },
  Elizabeth: {
    about: "Harmony Warden — balances the team, stabilizes chaos, and keeps everyone aligned.",
    color: "#7cffc7",
    points: ["Harmony", "Order", "Care"],
  },
  Christopher: {
    about: "Steel — dependable, grounded, and built to hold the line when pressure hits.",
    color: "#b7c2cc",
    points: ["Solid", "Loyal", "Strong"],
  },
  Tom: {
    about: "Stormforge — forges through conflict like thunder through mountains.",
    color: "#5aa8ff",
    points: ["Storm", "Forge", "Force"],
  },

  // === Cummings branch (Ryan) ===
  Ryan: {
    about: "Managerial — strategic organizer, keeps the machine running and the team moving.",
    color: "#7aa6b8",
    points: ["Lead", "Plan", "Execute"],
  },
  Maren: {
    about: "Luminary Veil — radiant presence with subtle protection that turns fear into focus.",
    color: "#ffe08a",
    points: ["Radiant", "Shield", "Calm"],
  },
  Sasha: {
    about: "Codex — keeper of knowledge, patterns, and the hard truths that win wars.",
    color: "#9db7ff",
    points: ["Logic", "Lore", "Truth"],
  },
  Ian: {
    about: "Sparous — quick, sharp, and unpredictable, striking where it hurts most.",
    color: "#a6ffef",
    points: ["Swift", "Sharp", "Snap"],
  },
  Riker: {
    about: "Ironstrike — heavy impact with disciplined precision, built for decisive hits.",
    color: "#c7d0d9",
    points: ["Impact", "Armor", "Drive"],
  },
  Dakota: {
    about: "Shadow Cipher — silent operator, coded intent, and calculated execution.",
    color: "#8a7dff",
    points: ["Shadow", "Code", "Resolve"],
  },

  // === Cummings branch (Brett) ===
  Brett: {
    about: "Doctoral — calm intellect with decisive action, turns knowledge into advantage.",
    color: "#78d7ff",
    points: ["Mind", "Focus", "Edge"],
  },
  Angie: {
    about: "Ethereal Guardian — protective, serene, and relentless when defending her own.",
    color: "#caa8ff",
    points: ["Guard", "Grace", "Faith"],
  },
  Bryce: {
    about: "Moesek — bold energy and raw drive, built to push forward when others hesitate.",
    color: "#7cff8b",
    points: ["Drive", "Power", "Push"],
  },
  Lillie: {
    about: "Slick Blade — agile and precise, a clean strike and gone before you blink.",
    color: "#ff7aa6",
    points: ["Agile", "Clean", "Quick"],
  },
  Addie: {
    about: "Prism Voyager — bright adaptability, refracting pressure into momentum.",
    color: "#7cf0ff",
    points: ["Shift", "Shine", "Adapt"],
  },
  Purdy: {
    about: "Old Faithful — dependable to the core, always showing up when it matters.",
    color: "#ffcf7a",
    points: ["Loyal", "Steady", "True"],
  },

  // === Cummings branch (Matt) ===
  Jessica: {
    about: "CareTechnial — nurturing, tech-enhanced support with precision and calm.",
    color: "#7cf7ff",
    points: ["Care", "Tech", "Precision"],
  },
  Kyle: {
    about: "Shadowcore — fortified and quiet, controls the field with stealth and strength.",
    color: "#8b6bff",
    points: ["Stealth", "Core", "Control"],
  },
  Daisy: {
    about: "Floral — vibrant resilience, blooming hope and healing energy in the worst storms.",
    color: "#7cffc7",
    points: ["Bloom", "Heal", "Rise"],
  },
  Rose: {
    about: "Prism — dazzling defense, bends light into protection and pressure into power.",
    color: "#ff6bd9",
    points: ["Light", "Refraction", "Guard"],
  },
  Mikie: {
    about: "Steelth — covert strength, silent movement, and decisive impact.",
    color: "#a8b3bd",
    points: ["Silent", "Steel", "Strike"],
  },
  Prairie: {
    about: "Flowertwister — swirling nature-force, controls the space with wind and motion.",
    color: "#b7ff7a",
    points: ["Wind", "Flow", "Control"],
  },
  "Ryan kid": {
    about: "Ven-noir — youthful intensity with venomous precision and shadow confidence.",
    color: "#6b7aff",
    points: ["Venom", "Youth", "Edge"],
  },
  Liam: {
    about: "Veteran — battle-worn grit and calm leadership when everything’s falling apart.",
    color: "#c9b18a",
    points: ["Grit", "Experience", "Resolve"],
  },

  // === Cummings branch (Chad) ===
  Chad: {
    about: "Codester — fast-thinking disruption, turning code into combat advantage.",
    color: "#7acbff",
    points: ["Hack", "Speed", "Disrupt"],
  },
  Rochelle: {
    about: "White Veil — pure defense and mystic barriers, protecting the team with calm power.",
    color: "#e8f2ff",
    points: ["Pure", "Shield", "Calm"],
  },
  Annabeth: {
    about: "Novanna — radiant innovation, pioneers new paths when none exist.",
    color: "#ffe08a",
    points: ["New", "Bright", "Forward"],
  },
  Levi: {
    about: "StoneWreck — unstoppable force, earth-heavy presence, breaks what stands in the way.",
    color: "#b7c2cc",
    points: ["Heavy", "Earth", "Crush"],
  },
  Troy: {
    about: "Foreman — rugged leadership, industrial strength, and hard-earned discipline.",
    color: "#ffb86b",
    points: ["Build", "Lead", "Hold"],
  },

  // === Grandparents (Stillman / Cummings) ===
  Gary: {
    about: "Entrpatorial — bold leadership and momentum, pushes innovation into reality.",
    color: "#7acbff",
    points: ["Lead", "Create", "Drive"],
  },
  Jeanine: {
    about: "Hearth Matron — warmth and protection, keeps the family steady through any storm.",
    color: "#ff9a6b",
    points: ["Warmth", "Home", "Strength"],
  },
  Sharrel: {
    about: "Airrow — swift precision and control, strikes with windlike accuracy.",
    color: "#7cf0ff",
    points: ["Swift", "Aim", "Gust"],
  },
  Dorthy: {
    about: "Star Keeper — wise protector, guarding what matters with calm certainty.",
    color: "#ffd36b",
    points: ["Wisdom", "Guard", "Stars"],
  },
  "GMA Parker": {
    about: "Eternal Archon — timeless counsel, healing presence, and steady guidance.",
    color: "#caa8ff",
    points: ["Timeless", "Heal", "Guide"],
  },

  // === Eduria branch ===
  Marlyn: {
    about: "Sky Weaver — calm mastery of the air, uplifting allies and shaping the field.",
    color: "#7acbff",
    points: ["Sky", "Weave", "Guard"],
  },
  Robert: {
    about: "Iron Sentinel — unbreakable defense, vigilant and steady under pressure.",
    color: "#b7c2cc",
    points: ["Iron", "Watch", "Stand"],
  },
  "Arlene Hendricks": {
    about: "Flame Guardian — blazing protection, fierce strength with a protective heart.",
    color: "#ff6b6b",
    points: ["Flame", "Shield", "Fury"],
  },
  "Nate Hendricks": {
    about: "Wind Striker — fast, cutting movement, hits hard and vanishes like air.",
    color: "#7cffc7",
    points: ["Wind", "Speed", "Slice"],
  },
  Kris: {
    about: "Techno Spirit — futuristic support, boosting allies through tech and grit.",
    color: "#7cf0ff",
    points: ["Tech", "Boost", "Spirit"],
  },
  Carlo: {
    about: "Goldenmind — strategic clarity and insight, seeing the winning line before it appears.",
    color: "#ffd36b",
    points: ["Mind", "Gold", "Plan"],
  },
  "Cham Cham Kaleigha": {
    about: "Star Vortex — cosmic pressure and swirling force, overwhelming foes with stellar power.",
    color: "#8b6bff",
    points: ["Star", "Vortex", "Surge"],
  },
};

export default descriptions;
