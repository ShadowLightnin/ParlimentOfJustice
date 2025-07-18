// 🎯 Base Members (if any specific ones are required)
const baseMembers = [
  // { name: 'TBA', codename: '???', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
];

// 🎯 Families grouped with corresponding superhero codenames and positions
const familyData = [
  {
    family: 'Cummings/Parents',
    members: [
      { name: 'Angela', codename: 'Celestial Angel', screen: '' },
      { name: 'Todd', codename: 'Stellar', screen: '' },
      { name: 'Molly', codename: 'Teddy Bear', screen: '' },
    ],
  },
  {
    family: 'McNeil',
    members: [
      { name: 'Mary', codename: 'Auric', screen: '' },
      { name: 'Chance', codename: 'Crimson Crown', screen: '' },
      { name: 'Ava', codename: 'Prismatic Pulse', screen: '' },
      { name: 'Charlie', codename: 'Iron Olympian', screen: '' },
      { name: 'Lumi', codename: 'Fade Shade', screen: '' },
    ],
  },
  {
    family: 'Briggs',
    members: [
      { name: 'Heather S', codename: 'Verdant', screen: '' },
      { name: 'Bobby', codename: 'Crown Medic', screen: '' },
      { name: 'Ammon', codename: 'Valoron', screen: '' },
      { name: 'Piper', codename: 'Jetstrike', screen: '' },
      { name: 'Gemma', codename: 'Slendowg', screen: '' },
    ],
  },
  {
    family: 'Jensen',
    members: [
      { name: 'Savannah', codename: 'Vivid Spark', screen: '' },
      { name: 'Lee', codename: 'Codeforge', screen: '' },
      { name: 'Emilee', codename: 'Luminous Aria', screen: '' },
      { name: 'Samantha', codename: 'Velocity Vibe', screen: '' },
      { name: 'Ella', codename: 'Aerial Serenade', screen: '' },
    ],
  },
  {
    family: 'Bolander',
    members: [
      { name: 'Annie', codename: 'Sage Mentor', screen: '' },
      { name: 'Paul', codename: 'Iron Law', screen: '' },
      { name: 'McKinley', codename: 'Rebuncious', screen: '' },
      { name: 'Whitney', codename: 'Veilweaver', screen: '' },
      { name: 'Vinson', codename: 'Ironchad', screen: '' },
    ],
  },
  {
    family: 'Stillman',
    members: [
      { name: 'Wesley', codename: 'Steelframe', screen: '' },
      { name: 'Melissa', codename: 'Auric Skyweaver', screen: '' },
      { name: 'Jackson', codename: 'Rhythmic Flux', screen: '' },
      { name: 'Mason', codename: 'Fortress King', screen: '' },
      { name: 'Rylie', codename: 'Star Gleam', screen: '' },
      { name: 'Sammy', codename: 'Swift Pack', screen: '' },
    ],
  },
  {
    family: 'Stillman',
    members: [
      { name: 'David', codename: 'Ironforge', screen: '' },
      { name: 'Isaydy', codename: 'Mist Haven', screen: '' },
      { name: 'Darron', codename: 'Crag Rock', screen: '' },
      { name: 'Isabel', codename: 'Breezestrom', screen: '' },
    ],
  },
  {
    family: 'Stillman',
    members: [
      { name: 'Gary jr', codename: 'Legacy Shield', screen: '' },
      { name: 'Sarah', codename: 'Hope', screen: '' },
      { name: 'Josh', codename: 'Defention', screen: '' },
      { name: 'Garden', codename: 'Pharoll', screen: '' },
      { name: 'Sophia', codename: 'Chroma Sprint', screen: '' },
      { name: 'Paisley', codename: 'Prism Weaver', screen: '' },
      { name: 'Ellie', codename: 'Ethereal Flutter', screen: '' },
    ],
  },
  {
    family: 'Stillman',
    members: [
      { name: 'Jennifer', codename: 'Eternal Guardian', screen: '' }, // Special tribute with no codename initially
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Sean', codename: 'Vanguard', screen: '' },
      { name: 'Heather C', codename: 'Sylvara', screen: '' },
      { name: 'Brett small', codename: 'Aegis', screen: '' },
      { name: 'Jake', codename: 'Nova Sentinel', screen: '' },
      { name: 'Ailey', codename: 'Chromatic Blaze', screen: '' },
      { name: 'Aubrey', codename: 'Seraphine Dawn', screen: '' },
      { name: 'James', codename: 'Dreadforge', screen: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Ryan', codename: 'Managerial', screen: '' },
      { name: 'Maren', codename: 'Luminary Veil', screen: '' },
      { name: 'Sasha', codename: 'Codex', screen: '' },
      { name: 'Ian', codename: 'Sparous', screen: '' },
      { name: 'Riker', codename: 'Ironstrike', screen: '' },
      { name: 'Dakota', codename: 'Shadow Cipher', screen: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Lora', codename: 'Roseheart', screen: '' },
      { name: 'Wayne', codename: 'Sovereign', screen: '' },
      { name: 'Elizabeth', codename: 'Harmony Warden', screen: '' },
      { name: 'Christopher', codename: 'Steel', screen: '' },
      { name: 'Tom', codename: 'Stormforge', screen: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Brett', codename: 'Doctoral', screen: '' },
      { name: 'Angie', codename: 'Ethereal Guardian', screen: '' },
      { name: 'Bryce', codename: 'Moesek', screen: '' },
      { name: 'Lillie', codename: 'Slick Blade', screen: '' },
      { name: 'Addie', codename: 'Prism Voyager', screen: '' },
      { name: 'Purdy', codename: 'Old Faithful', screen: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Matt', codename: '[redacted]', screen: '' },
      { name: 'Jessica', codename: 'CareTechnial', screen: '' },
      { name: 'Kyle', codename: 'Shadowcore', screen: '' },
      { name: 'Daisy', codename: 'Floral', screen: '' },
      { name: 'Rose', codename: 'Prism', screen: '' },
      { name: 'Mikie', codename: 'Steelth', screen: '' },
      { name: 'Prairie', codename: 'Flowertwister', screen: '' },
      { name: 'Ryan kid', codename: 'Ven-noir', screen: '' },
      { name: 'Liam', codename: 'Veteran', screen: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Chad', codename: 'Codester', screen: '' },
      { name: 'Rochelle', codename: 'White Veil', screen: '' },
      { name: 'Annabeth', codename: 'Novanna', screen: '' },
      { name: 'Levi', codename: 'StoneWreck', screen: '' },
      { name: '', codename: '', screen: '' },
      { name: '', codename: '', screen: '' },
      { name: '', codename: '', screen: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Troy', codename: 'Foreman', screen: '' },
    ],
  },
  {
    family: 'Stillman Grandparents',
    members: [
      { name: 'Gary', codename: 'Entrpatorial', screen: '' },
      { name: 'Jeanine', codename: 'Hearth Matron', screen: '' },
    ],
  },
  {
    family: 'Cummings Grandparents',
    members: [
      { name: 'Sharrel', codename: 'Airrow', screen: '' },
      { name: 'Dorthy', codename: 'Star Keeper', screen: '' },
      { name: 'GMA Parker', codename: 'Eternal Archon', screen: '' },
    ],
  },
  {
    family: 'Eduria',
    members: [
      { name: 'Marlyn', codename: 'Sky Weaver', screen: '' },
      { name: 'Robert', codename: 'Iron Sentinel', screen: '' },
      { name: 'Arlene Hendricks', codename: 'Flame Guardian', screen: '' },
      { name: 'Nate Hendricks', codename: 'Wind Striker', screen: '' },
      { name: 'Kris', codename: 'Techno Spirit', screen: '' },
      { name: 'Carlo', codename: 'Goldenmind', screen: '' },
      { name: 'Cham Cham Kaleigha', codename: 'Star Vortex', screen: '' },
    ],
  },
];

// 🎯 Static image mapping (React Native requires explicit imports)
const characterImages = {
  Angela: require('../../assets/Armor/Angela.jpg'),
  Todd: require('../../assets/Armor/Todd.jpg'),
  Savannah: require('../../assets/Armor/Savanna.jpg'),
  Lee: require('../../assets/Armor/Lee.jpg'),
  Emilee: require('../../assets/Armor/Emily.jpg'),
  Samantha: require('../../assets/Armor/Samantha.jpg'),
  Ella: require('../../assets/Armor/Ella.jpg'),
  Jennifer: require('../../assets/Armor/AuntJennifer.jpg'),
  Mary: require('../../assets/Armor/Mary.jpg'),
  Chance: require('../../assets/Armor/Chance.jpg'),
  Ava: require('../../assets/Armor/Ava.jpg'),
  Charlie: require('../../assets/Armor/Charlie.jpg'),
  'Heather S': require('../../assets/Armor/HeatherB.jpg'),
  Bobby: require('../../assets/Armor/Bobby.jpg'),
  Ammon: require('../../assets/Armor/Ammon.jpg'),
  Piper: require('../../assets/Armor/Piper.jpg'),
  Annie: require('../../assets/Armor/Annie_cleanup.jpg'),
  Paul: require('../../assets/Armor/Paul_cleanup.jpg'),
  McKinley: require('../../assets/Armor/McKinley.jpg'),
  Whitney: require('../../assets/Armor/Whitney_cleanup.jpg'),
  Vinson: require('../../assets/Armor/Vinson.jpg'),
  Wesley: require('../../assets/Armor/WesleyS_cleanup.jpg'),
  Melissa: require('../../assets/Armor/Melisa.jpg'),
  Jackson: require('../../assets/Armor/Jackson.jpg'),
  Mason: require('../../assets/Armor/MasonS.jpg'),
  Rylie: require('../../assets/Armor/Rylie.jpg'),
  Sammy: require('../../assets/Armor/Sammy.jpg'),
  David: require('../../assets/Armor/David.jpg'),
  Isaydy: require('../../assets/Armor/Isiade.jpg'),
  Darron: require('../../assets/Armor/Darron.jpg'),
  Isabel: require('../../assets/Armor/Isabel.jpg'),
  'Gary jr': require('../../assets/Armor/Garyjr.jpg'),
  Sarah: require('../../assets/Armor/Sara.jpg'),
  Josh: require('../../assets/Armor/JoshS.jpg'),
  Garden: require('../../assets/Armor/Garden.jpg'),
  Sophia: require('../../assets/Armor/Sophia.jpg'),
  Paisley: require('../../assets/Armor/Paisley.jpg'),
  Ellie: require('../../assets/Armor/Ellie.jpg'),
  Sean: require('../../assets/Armor/Sean.jpg'),
  'Heather C': require('../../assets/Armor/HeatherC.jpg'),
  'Brett small': require('../../assets/Armor/BrettSmall.jpg'),
  Jake: require('../../assets/Armor/Jake.jpg'),
  Ailey: require('../../assets/Armor/Ailey.jpg'),
  Aubrey: require('../../assets/Armor/Aubrey.jpg'),
  James: require('../../assets/Armor/JamesC.jpg'),
  Ryan: require('../../assets/Armor/Ryan.jpg'),
  Maren: require('../../assets/Armor/Marin.jpg'),
  Sasha: require('../../assets/Armor/Sasha.jpg'),
  Ian: require('../../assets/Armor/Ian.jpg'),
  Riker: require('../../assets/Armor/Riker.jpg'),
  Dakota: require('../../assets/Armor/Dakota_cleanup.jpg'),
  Lora: require('../../assets/Armor/Laura_cleanup.jpg'),
  Wayne: require('../../assets/Armor/Waine.jpg'),
  Elizabeth: require('../../assets/Armor/Elizabeth_cleanup.jpg'),
  Christopher: require('../../assets/Armor/Christopher_cleanup.jpg'),
  Tom: require('../../assets/Armor/TomOC.jpg'),
  Brett: require('../../assets/Armor/Brett.jpg'),
  Angie: require('../../assets/Armor/Angie.jpg'),
  Bryce: require('../../assets/Armor/Bryce.jpg'),
  Lillie: require('../../assets/Armor/Lillie.jpg'),
  Addie: require('../../assets/Armor/Addie_cleanup.jpg'),
  Matt: require('../../assets/Armor/Matt.jpg'),
  Jessica: require('../../assets/Armor/JessicaC_cleanup.jpg'),
  Kyle: require('../../assets/Armor/Kyle.jpg'),
  Daisy: require('../../assets/Armor/Daisy.jpg'),
  Rose: require('../../assets/Armor/Rose.jpg'),
  Mikie: require('../../assets/Armor/Mikie_cleanup.jpg'),
  Prairie: require('../../assets/Armor/Prairie_cleanup.jpg'),
  'Ryan kid': require('../../assets/Armor/RyanKid.jpg'),
  Chad: require('../../assets/Armor/Chad.jpg'),
  Rochelle: require('../../assets/Armor/Rachel_cleanup.jpg'),
  Annabeth: require('../../assets/Armor/Annabeth.jpg'),
  Levi: require('../../assets/Armor/Levi.jpg'),
  Troy: require('../../assets/Armor/Troy.jpg'),
  Gary: require('../../assets/Armor/Gary_cleanup.jpg'),
  Jeanine: require('../../assets/Armor/Jennine.jpg'),
  Sharrel: require('../../assets/Armor/Sheryl.jpg'),
  Dorthy: require('../../assets/Armor/Dorthy.jpg'),
  'GMA Parker': require('../../assets/Armor/Parker_cleanup.jpg'),
  Marlyn: require('../../assets/Armor/Marlyn.jpg'),
  Robert: require('../../assets/Armor/Robert.jpg'),
  'Arlene Hendricks': require('../../assets/Armor/Arlene.jpg'),
  'Nate Hendricks': require('../../assets/Armor/NateH.jpg'),
  Kris: require('../../assets/Armor/Kris.jpg'),
  Carlo: require('../../assets/Armor/Carlo.jpg'),
  'Cham Cham Kaleigha': require('../../assets/Armor/Cham.jpg'),
  'Molly': require('../../assets/Armor/Molly.jpg'),
  'Lumi': require('../../assets/Armor/Lumi2.jpg'),
  'Gemma': require('../../assets/Armor/Gemma.jpg'),
  'Purdy': require('../../assets/Armor/Purdy.jpg'),
  'Liam': require('../../assets/Armor/Liam.jpg'),
};

// 🎯 Generate additional members with family names and superhero codenames
const additionalMembers = familyData.flatMap((family, familyIndex) =>
  family.members.map((member, i) => ({
    name: member.name,
    codename: member.codename,
    family: family.family,
    screen: member.screen || '', // Use defined screen or default to empty string
    clickable: member.clickable !== undefined ? member.clickable : true,
    position: [Math.floor((i + (familyIndex * 10)) / 3), (i + (familyIndex * 10)) % 3],
    image: characterImages[member.name] || require('../../assets/Armor/PlaceHolder.jpg'),
  }))
);

// 🎯 Merge base members with auto-generated family members
const OlympiansMembers = [...baseMembers, ...additionalMembers].filter(member => member.name);

export default OlympiansMembers;