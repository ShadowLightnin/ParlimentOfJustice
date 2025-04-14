// 🎯 Base Members (if any specific ones are required)
const baseMembers = [
  // { name: 'TBA', codename: '???', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
];

// 🎯 Families grouped with corresponding superhero codenames and positions
const familyData = [
  {
    family: 'Parents',
    members: [
      { name: 'Angela', codename: 'Celestial Angel', screen: '' },
      { name: 'Todd', codename: 'Stellar', screen: '' },
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
    family: 'McNeil',
    members: [
      { name: 'Mary', codename: 'Auric', screen: '' },
      { name: 'Chance', codename: 'Crimson Crown', screen: '' },
      { name: 'Ava', codename: 'Prismatic Pulse', screen: '' },
      { name: 'Charlie', codename: 'Iron Olympian', screen: '' },
    ],
  },
  {
    family: 'Briggs',
    members: [
      { name: 'Heather S', codename: 'Verdant', screen: '' },
      { name: 'Bobby', codename: 'Crown Medic', screen: '' },
      { name: 'Ammon', codename: 'Valoron', screen: '' },
      { name: 'Piper', codename: 'Jetstrike', screen: '' },
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
      { name: 'GMA Parker', codename: 'Great Grand', screen: '' },
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
  Angela: require('../../assets/Armor/AngelaPlaceHolder.jpg'),
  Todd: require('../../assets/Armor/ToddPlaceHolder.jpg'),
  Savannah: require('../../assets/Armor/SavannaPlaceHolder.jpg'),
  Lee: require('../../assets/Armor/LeePlaceHolder.jpg'),
  Emilee: require('../../assets/Armor/EmilyPlaceHolder.jpg'),
  Samantha: require('../../assets/Armor/SamanthaPlaceHolder.jpg'),
  Ella: require('../../assets/Armor/EllaPlaceHolder.jpg'),
  Mary: require('../../assets/Armor/MaryPlaceHolder.jpg'),
  Chance: require('../../assets/Armor/ChancePlaceHolder.jpg'),
  Ava: require('../../assets/Armor/AvaPlaceHolder.jpg'),
  Charlie: require('../../assets/Armor/CharliePlaceHolder.jpg'),
  'Heather S': require('../../assets/Armor/HeatherBPlaceHolder.jpg'),
  Bobby: require('../../assets/Armor/BobbyPlaceHolder.jpg'),
  Ammon: require('../../assets/Armor/AmmonPlaceHolder.jpg'),
  Piper: require('../../assets/Armor/PiperPlaceHolder.jpg'),
  Annie: require('../../assets/Armor/AnniePlaceHolder_cleanup.jpg'),
  Paul: require('../../assets/Armor/PaulPlaceHolder_cleanup.jpg'),
  McKinley: require('../../assets/Armor/McKinleyPlaceHolder.jpg'),
  Whitney: require('../../assets/Armor/WhitneyPlaceHolder_cleanup.jpg'),
  Vinson: require('../../assets/Armor/VinsonPlaceHolder.jpg'),
  Wesley: require('../../assets/Armor/WesleySPlaceHolder_cleanup.jpg'),
  Melissa: require('../../assets/Armor/MelisaPlaceHolder.jpg'),
  Jackson: require('../../assets/Armor/JacksonPlaceHolder.jpg'),
  Mason: require('../../assets/Armor/MasonSPlaceHolder.jpg'),
  Rylie: require('../../assets/Armor/RyliePlaceHolder.jpg'),
  Sammy: require('../../assets/Armor/SammyPlaceHolder.jpg'),
  David: require('../../assets/Armor/DavidPlaceHolder.jpg'),
  Isaydy: require('../../assets/Armor/IsiadePlaceHolder.jpg'),
  Darron: require('../../assets/Armor/DarronPlaceHolder.jpg'),
  Isabel: require('../../assets/Armor/IsabelPlaceHolder.jpg'),
  'Gary jr': require('../../assets/Armor/GaryjrPlaceHolder.jpg'),
  Sarah: require('../../assets/Armor/SaraPlaceHolder.jpg'),
  Josh: require('../../assets/Armor/JoshSPlaceHolder.jpg'),
  Garden: require('../../assets/Armor/GardenPlaceHolder.jpg'),
  Sophia: require('../../assets/Armor/SophiaPlaceHolder.jpg'),
  Paisley: require('../../assets/Armor/PaisleyPlaceHolder.jpg'),
  Ellie: require('../../assets/Armor/ElliePlaceHolder.jpg'),
  Sean: require('../../assets/Armor/SeanPlaceHolder.jpg'),
  'Heather C': require('../../assets/Armor/HeatherCPlaceHolder.jpg'),
  'Brett small': require('../../assets/Armor/BrettSmallPlaceHolder.jpg'),
  Jake: require('../../assets/Armor/JakePlaceHolder.jpg'),
  Ailey: require('../../assets/Armor/AileyPlaceHolder.jpg'),
  Aubrey: require('../../assets/Armor/AubreyPlaceHolder.jpg'),
  James: require('../../assets/Armor/JamesCPlaceHolder.jpg'),
  Ryan: require('../../assets/Armor/RyanPlaceHolder.jpg'),
  Maren: require('../../assets/Armor/MarinPlaceHolder.jpg'),
  Sasha: require('../../assets/Armor/SashaPlaceHolder.jpg'),
  Ian: require('../../assets/Armor/IanPlaceHolder.jpg'),
  Riker: require('../../assets/Armor/RikerPlaceHolder.jpg'),
  Dakota: require('../../assets/Armor/DakotaPlaceHolder_cleanup.jpg'),
  Lora: require('../../assets/Armor/LauraPlaceHolder_cleanup.jpg'),
  Wayne: require('../../assets/Armor/WainePlaceHolder.jpg'),
  Elizabeth: require('../../assets/Armor/ElizabethPlaceHolder_cleanup.jpg'),
  Christopher: require('../../assets/Armor/ChristopherPlaceHolder_cleanup.jpg'),
  Tom: require('../../assets/Armor/TomOCPlaceHolder.jpg'),
  Brett: require('../../assets/Armor/BrettPlaceHolder.jpg'),
  Angie: require('../../assets/Armor/AngiePlaceHolder.jpg'),
  Bryce: require('../../assets/Armor/BrycePlaceHolder.jpg'),
  Lillie: require('../../assets/Armor/LilliePlaceHolder.jpg'),
  Addie: require('../../assets/Armor/AddiePlaceHolder_cleanup.jpg'),
  Matt: require('../../assets/Armor/MattPlaceHolder.jpg'),
  Jessica: require('../../assets/Armor/JessicaCPlaceHolder_cleanup.jpg'),
  Kyle: require('../../assets/Armor/KylePlaceHolder.jpg'),
  Daisy: require('../../assets/Armor/DaisyPlaceHolder.jpg'),
  Rose: require('../../assets/Armor/RosePlaceHolder.jpg'),
  Mikie: require('../../assets/Armor/MikiePlaceHolder_cleanup.jpg'),
  Prairie: require('../../assets/Armor/PrairiePlaceHolder_cleanup.jpg'),
  'Ryan kid': require('../../assets/Armor/RyanKidPlaceHolder.jpg'),
  Chad: require('../../assets/Armor/ChadPlaceHolder.jpg'),
  Rochelle: require('../../assets/Armor/RachelPlaceHolder_cleanup.jpg'),
  Annabeth: require('../../assets/Armor/AnnabethPlaceHolder.jpg'),
  Levi: require('../../assets/Armor/LeviPlaceHolder.jpg'),
  Troy: require('../../assets/Armor/TroyPlaceHolder.jpg'),
  Gary: require('../../assets/Armor/GaryPlaceHolder_cleanup.jpg'),
  Jeanine: require('../../assets/Armor/JenninePlaceHolder.jpg'),
  Sharrel: require('../../assets/Armor/SherylPlaceHolder.jpg'),
  Dorthy: require('../../assets/Armor/DorthyPlaceHolder.jpg'),
  'GMA Parker': require('../../assets/Armor/ParkerPlaceHolder_cleanup.jpg'),
  Marlyn: require('../../assets/Armor/MarlynPlaceHolder.jpg'),
  Robert: require('../../assets/Armor/RobertPlaceHolder.jpg'),
  'Arlene Hendricks': require('../../assets/Armor/ArlenePlaceHolder.jpg'),
  'Nate Hendricks': require('../../assets/Armor/NateHPlaceHolder.jpg'),
  Kris: require('../../assets/Armor/KrisPlaceHolder.jpg'),
  Carlo: require('../../assets/Armor/CarloPlaceHolder.jpg'),
  'Cham Cham Kaleigha': require('../../assets/Armor/ChamPlaceHolder.jpg'),
};

// 🎯 Generate additional members with family names and superhero codenames
const additionalMembers = familyData.flatMap((family, familyIndex) =>
  family.members.map((member, i) => ({
    name: member.name,
    codename: member.codename,
    family: family.family,
    screen: member.screen || '', // Use defined screen or default to empty string
    clickable: true,
    position: [Math.floor((i + (familyIndex * 10)) / 3), (i + (familyIndex * 10)) % 3],
    image: characterImages[member.name] || require('../../assets/Armor/PlaceHolder.jpg'),
  }))
);

// 🎯 Merge base members with auto-generated family members
const fullOlympiansList = [...baseMembers, ...additionalMembers].filter(member => member.name);

export default fullOlympiansList;