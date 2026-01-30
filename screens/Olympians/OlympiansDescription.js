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

  // CUMMINGS / PARENTS
  Angela: {
    about: "Celestial Angel — steadfast light, guiding calm, and protective grace when the world turns dark.",
    color: "#FFD36B", // celestial gold
    points: ["Grace", "Courage", "Light"],
  },
  Todd: {
    about: "Stellar — disciplined strength with a steady hand, built to protect and endure.",
    color: "#7ACBFF", // starlight blue
    points: ["Steady", "Bold", "Guardian"],
  },
  Molly: {
    about: "Teddy Bear — warmth and comfort with surprising toughness when it matters most.",
    color: "#FF89C6", // soft plush pink
    points: ["Warm", "Brave", "Kind"],
  },

  // MCNEIL
  Mary: {
    about: "Auric — golden resolve and calm leadership, carrying warmth like armor and strength like steel.",
    color: "#D4AF37", // auric gold
    points: ["Strong", "Steadfast", "True"],
  },
  Chance: {
    about: "Crimson Crown — fearless heart with a royal edge, bold protector energy with main-character confidence.",
    color: "#C1121F", // crimson red
    points: ["Brave", "Bold", "Noble"],
  },
  Ava: {
    about: "Prismatic Pulse — radiant personality with a shifting spectrum, bringing energy, color, and spark to every room.",
    color: "#7C5CFF", // prism violet
    points: ["Vibrant", "Creative", "Electric"],
  },
  Charlie: {
    about: "Iron Olympian — relentless drive with champion grit, built for endurance and victory through effort.",
    color: "#6B7280", // iron steel
    points: ["Driven", "Resilient", "Competitive"],
  },
  Lumi: {
    about: "Fade Shade — quiet cool confidence, slipping between calm and chaos with smooth control.",
    color: "#2F3A4A", // deep shade
    points: ["Cool", "Clever", "Elusive"],
  },

  // BRIGGS
  "Heather S": {
    about: "Verdant — grounded growth energy, steady support, deep roots, and quiet strength that keeps everyone standing.",
    color: "#2E8B57", // verdant green
    points: ["Nurturing", "Stable", "Enduring"],
  },
  Bobby: {
    about: "Crown Medic — steady hands and loyal heart, keeping the team alive, patched up, and moving forward.",
    color: "#00B3C6", // clean medic teal
    points: ["Healer", "Reliable", "Selfless"],
  },
  Liberty: {
    about: "Serenity — calming presence with unshakable balance, peacekeeper energy that quiets storms.",
    color: "#86E7FF", // serene sky
    points: ["Calm", "Gentle", "Centered"],
  },
  Ammon: {
    about: "Valoron — brave-forward protector, built on honor, courage, and show-up-no-matter-what loyalty.",
    color: "#FFB020", // valor amber
    points: ["Valiant", "Honorable", "Protective"],
  },
  Piper: {
    about: "Jetstrike — fast, sharp, and fearless, hitting goals like a streak across the sky.",
    color: "#00A3FF", // jet blue
    points: ["Fast", "Bold", "Focused"],
  },
  Gemma: {
    about: "Slendowg — sleek and witty with a surprising bite, playful energy that can flip to fierce instantly.",
    color: "#FF4FA3", // playful punch
    points: ["Playful", "Sharp", "Fearless"],
  },

  // JENSEN
  Savannah: {
    about: "Vivid Spark — bright ignition energy, lighting up momentum and joy wherever she goes.",
    color: "#FF6A00", // spark orange
    points: ["Energetic", "Bright", "Fearless"],
  },
  Lee: {
    about: "Codeforge — builder mind and problem-solver spirit, turning ideas into tools and chaos into systems.",
    color: "#7CFFB2", // neon matrix
    points: ["Inventive", "Logical", "Builder"],
  },
  Emilee: {
    about: "Luminous Aria — expressive glow with heartfelt harmony, lifting people with warmth and voice-of-the-room energy.",
    color: "#FFE2B6", // luminous soft gold
    points: ["Warm", "Expressive", "Soulful"],
  },
  Samantha: {
    about: "Velocity Vibe — driven motion and sharp instinct, always pushing forward with confident momentum.",
    color: "#25C2FF", // velocity cyan
    points: ["Driven", "Quick", "Focused"],
  },
  Ella: {
    about: "Aerial Serenade — light-footed grace with a fearless lift, moving like wind and shining like song.",
    color: "#B7A6FF", // airy lavender
    points: ["Graceful", "Free", "Brave"],
  },

  // BOLANDER
  Annie: {
    about: "Sage Mentor — wisdom with a steady hand, guiding others with calm clarity and real-life strength.",
    color: "#A8C9A1", // sage green
    points: ["Wise", "Guiding", "Patient"],
  },
  Paul: {
    about: "Iron Law — firm standards, fair judgment, and unshakable backbone when the moment demands it.",
    color: "#4B5563", // law steel
    points: ["Just", "Firm", "Steady"],
  },
  McKinley: {
    about: "Rebuncious — chaos-with-a-heart, hilarious rebellion energy that still shows up when it matters.",
    color: "#FF3D3D", // rebellious red
    points: ["Bold", "Wildcard", "Loyal"],
  },
  Whitney: {
    about: "Veilweaver — subtle power and sharp perception, weaving calm control through any situation.",
    color: "#8B5CF6", // veil purple
    points: ["Clever", "Composed", "Perceptive"],
  },
  Vinson: {
    about: "Ironchad — tough, confident, dependable force, bringing strength and stability like a living shield.",
    color: "#9CA3AF", // iron silver
    points: ["Strong", "Confident", "Reliable"],
  },

  // STILLMAN (group 1)
  Wesley: {
    about: "Steelframe — dependable backbone energy: calm under pressure, built for hard days and steady wins.",
    color: "#7B8794", // steel frame
    points: ["Reliable", "Strong", "Grounded"],
  },
  Melissa: {
    about: "Auric Skyweaver — golden light with uplifting vision, weaving hope and strength into the people around her.",
    color: "#FFD36B", // auric gold
    points: ["Radiant", "Uplifting", "Wise"],
  },
  Jackson: {
    about: "Rhythmic Flux — creative motion and momentum, adapting fast and bringing the beat when the team needs it.",
    color: "#FF2D8D", // rhythmic magenta
    points: ["Dynamic", "Creative", "Bold"],
  },
  Mason: {
    about: "Fortress King — protective leader spirit, steady presence with loyal strength and big-heart resolve.",
    color: "#1F4FFF", // fortress blue
    points: ["Protector", "Leader", "Resilient"],
  },
  Rylie: {
    about: "Star Gleam — bright and magnetic joy, lighting up rooms with playful confidence and heart.",
    color: "#9B7BFF", // star violet
    points: ["Bright", "Brave", "Joyful"],
  },
  Sammy: {
    about: "Swift Pack — fast friend energy, loyal to the core, always ready to roll with the team.",
    color: "#18D6B5", // swift teal
    points: ["Loyal", "Energetic", "Fearless"],
  },

  // STILLMAN (group 2)
  David: {
    about: "Ironforge — steady builder mindset: practical, skilled, and quietly unstoppable when it counts.",
    color: "#3F4A56", // forged iron
    points: ["Crafted", "Tough", "Focused"],
  },
  Isaydy: {
    about: "Mist Haven — calm shelter energy, comforting presence with quiet strength like a safe harbor.",
    color: "#8FE9FF", // mist blue
    points: ["Calm", "Comforting", "Intuitive"],
  },
  Darron: {
    about: "Crag Rock — rugged strength and unshakable loyalty, the kind of solid you can always lean on.",
    color: "#6B4F3A", // crag brown
    points: ["Solid", "Loyal", "Enduring"],
  },
  Isabel: {
    about: "Breezestrom — light on her feet but fierce in spirit, bringing fresh air with a lightning edge.",
    color: "#7CFFF0", // breeze mint
    points: ["Free", "Brilliant", "Brave"],
  },

  // STILLMAN (group 3)
  "Gary jr": {
    about: "Legacy Shield — family-first defender, carrying tradition with courage and a steady protective heart.",
    color: "#1E66FF", // shield blue
    points: ["Guardian", "Honorable", "Steady"],
  },
  Sarah: {
    about: "Hope — bright resilience and gentle strength, turning hard moments into forward steps.",
    color: "#FFD1E8", // hopeful rose
    points: ["Kind", "Optimistic", "Strong"],
  },
  Josh: {
    about: "Defention — watchful and steadfast, always ready to step in and hold the line for his people.",
    color: "#34495E", // defense slate
    points: ["Alert", "Protective", "Committed"],
  },
  Garden: {
    about: "Pharoll — guiding light energy, creative and curious, always finding a way through the dark.",
    color: "#FFE66B", // lantern gold
    points: ["Guiding", "Inventive", "Radiant"],
  },
  Sophia: {
    about: "Chroma Sprint — vibrant burst of speed and color, fearless energy with a bright competitive spark.",
    color: "#FF5CF0", // chroma neon
    points: ["Vivid", "Quick", "Brave"],
  },
  Paisley: {
    about: "Prism Weaver — artistic heart with layered depth, connecting people through warmth and imagination.",
    color: "#9BFF7A", // prism green
    points: ["Creative", "Gentle", "Bright"],
  },
  Ellie: {
    about: "Ethereal Flutter — soft-glow magic energy: sweet, lively, and surprisingly strong in the clutch.",
    color: "#D8C7FF", // ethereal lavender
    points: ["Light", "Sweet", "Resilient"],
  },

  // STILLMAN (group 4)
  Jennifer: {
    about: "Eternal Guardian — constant protector spirit: nurturing, strong-willed, and always watching out for her people.",
    color: "#FFB86B", // guardian amber
    points: ["Protective", "Nurturing", "Steadfast"],
  },

  // SANTA
  "St. Nick": {
    about: "Santa Claus — timeless guardian of wonder and generosity, carrying joy like a power source.",
    color: "#D62828", // santa red
    points: ["Generous", "Joyful", "Everlasting"],
  },

  // === Cummings branch (Lora / Wayne / kids) ===
  Lora: {
    about: "Roseheart — compassionate and fierce, blooming hope where others see only ruin.",
    color: "#ff6bd9",
    points: ["Heart", "Bloom", "Hope"],
  },
  Wayne: {
    about: "//[Redacted]//",
    color: "",
    points: ["//[Redacted]//"],
  },
  Elizabeth: {
    about: "//[Redacted]//",
    color: "",
    points: [""],
  },
  Christopher: {
    about: "",
    color: "",
    points: ["//[Redacted]//"],
  },
  Tom: {
    about: "",
    color: "",
    points: [""],
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
    about: "//[Redacted]//",
    color: "#000000",
    points: ["//[Redacted]//"],
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
