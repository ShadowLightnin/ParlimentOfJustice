// 🎯 Base Members (if any specific ones are required)
const baseMembers = [
  // { name: 'TBA', codename: '???', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
];

// 🎯 Families grouped with corresponding superhero codenames and positions
const familyData = [
  {
    family: 'Parents',
    members: [
      { name: 'Angela', codename: 'Storm Guardian' },
      { name: 'Todd', codename: 'Iron Patriarch' },
    ],
  },
  {
    family: 'Jensen',
    members: [
      { name: 'Savannah', codename: 'Solar Flare' },
      { name: 'Lee', codename: 'Thunderstrike' },
      { name: 'Emily', codename: 'Lunar Shadow' },
      { name: 'Samantha', codename: 'Cosmic Wave' },
      { name: 'Ella', codename: 'Starlight' },
    ],
  },
  {
    family: 'McNeil',
    members: [
      { name: 'Mary', codename: 'Earth Warden' },
      { name: 'Chance', codename: 'Wind Runner' },
      { name: 'Ava', codename: 'Fire Blossom' },
      { name: 'Charlie', codename: 'Aqua Knight' },
    ],
  },
  {
    family: 'Briggs',
    members: [
      { name: 'Heather S', codename: 'Blaze Queen' },
      { name: 'Bobby', codename: 'Steel Titan' },
      { name: 'Ammon', codename: 'Frost Giant' },
      { name: 'Piper', codename: 'Echo Siren' },
    ],
  },
  {
    family: 'Bolander',
    members: [
      { name: 'Annie', codename: 'Mystic Veil' },
      { name: 'Paul', codename: 'Shadow Blade' },
      { name: 'McKinley', codename: 'Golden Arrow' },
      { name: 'Whitney', codename: 'Crystal Pulse' },
      { name: 'Vinson', codename: 'Night Hawk' },
    ],
  },
  {
    family: 'Stillman',
    members: [
      { name: 'Wesley', codename: 'Thunder Lord' },
      { name: 'Melissa', codename: 'Ice Empress' },
      { name: 'Jackson', codename: 'Flame Rider' },
      { name: 'Mason', codename: 'Stone Sentinel' },
      { name: 'Rylie', codename: 'Wind Whisperer' },
      { name: 'Sammy', codename: 'Light Weaver' },
    ],
  },
  {
    family: 'Stillman',
    members: [
      { name: 'David', codename: 'Dark Vortex' },
      { name: 'Isaydy', codename: 'Radiant Star' },
      { name: 'Darron', codename: 'Iron Fang' },
      { name: 'Isabel', codename: 'Sky Dancer' },
    ],
  },
  {
    family: 'Stillman',
    members: [
      { name: 'Gary jr', codename: 'Stormbreaker' },
      { name: 'Sarah', codename: 'Frost Phoenix' },
      { name: 'Josh', codename: 'Blaze Striker' },
      { name: 'Garden', codename: 'Earth Shifter' },
      { name: 'Sophia', codename: 'Lunar Tide' },
      { name: 'Paisley', codename: 'Solar Wind' },
      { name: 'Ellie', codename: 'Starborn' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Sean', codename: 'Nova Burst' },
      { name: 'Heather C', codename: 'Ice Shard' },
      { name: 'Brett small', codename: 'Lightning Bolt' },
      { name: 'Jake', codename: 'Shadow Claw' },
      { name: 'Ailey', codename: 'Firestorm' },
      { name: 'Aubrey', codename: 'Aqua Surge' },
      { name: 'James', codename: 'Steel Phantom' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Ryan', codename: 'Thunder Hawk' },
      { name: 'Marin', codename: 'Frostbite' },
      { name: 'Sasha', codename: 'Blaze Fury' },
      { name: 'Ian', codename: 'Wind Stalker' },
      { name: 'Riker', codename: 'Earth Crusher' },
      { name: 'Dakota', codename: 'Sky Serpent' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Laura', codename: 'Starfire' },
      { name: 'Waine', codename: 'Iron Vortex' },
      { name: 'Elizabeth', codename: 'Lunar Blade' },
      { name: 'Christopher', codename: 'Solar Strike' },
      { name: 'Tom', codename: 'Shadow Storm' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Brett', codename: 'Thunder Titan' },
      { name: 'Angie', codename: 'Ice Queen' },
      { name: 'Bryce', codename: 'Flame Vortex' },
      { name: 'Lillie', codename: 'Wind Sprite' },
      { name: 'Addie', codename: 'Crystal Flame' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Matt', codename: 'Stone Fury' },
      { name: 'Jessica', codename: 'Light Phoenix' },
      { name: 'Kyle', codename: 'Dark Surge' },
      { name: 'Daisy', codename: 'Sky Blossom' },
      { name: 'Rose', codename: 'Fire Rose' },
      { name: 'Mikie', codename: 'Aqua Flash' },
      { name: 'Prairie', codename: 'Earth Whisper' },
      { name: 'Ryan kid', codename: 'Storm Spark' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Chad', codename: 'Nova Knight' },
      { name: 'Rachel', codename: 'Ice Storm' },
      { name: 'Annabeth', codename: 'Blaze Wing' },
      { name: 'Levi', codename: 'Wind Blade' },
      { name: '', codename: 'Phantom Shade' },
      { name: '', codename: 'Star Dust' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Troy', codename: 'Thunder King' },
    ],
  },
  {
    family: 'Stillman Grandparents',
    members: [
      { name: 'Gary', codename: 'Iron Sage' },
      { name: 'Jennine', codename: 'Frost Matriarch' },
    ],
  },
  {
    family: 'Cummings Grandparents',
    members: [
      { name: 'Sheryl', codename: 'Light Oracle' },
      { name: 'Dorthy', codename: 'Earth Mother' },
      { name: 'Great Grandma Parker', codename: 'Star Elder' },
    ],
  },
  {
    family: 'Eduria',
    members: [
      { name: 'Marlyn', codename: 'Sky Weaver' },
      { name: 'Robert', codename: 'Iron Sentinel' },
      { name: 'Arlene Hendricks', codename: 'Flame Guardian' },
      { name: 'Nate Hendricks', codename: 'Wind Striker' },
      { name: 'Kris', codename: 'Aqua Spirit' },
      { name: 'Carlo', codename: 'Shadow Flame' },
      { name: 'Cham Cham Kaleigha', codename: 'Star Vortex' },
    ],
  },
];

// 🎯 Static image mapping (React Native requires explicit imports)
const characterImages = {
  Angela: require('../../assets/Armor/AngelaPlaceHolder.jpg'),
  Todd: require('../../assets/Armor/ToddPlaceHolder.jpg'),
  Savannah: require('../../assets/Armor/SavannaPlaceHolder.jpg'),
  Lee: require('../../assets/Armor/LeePlaceHolder.jpg'),
  Emily: require('../../assets/Armor/EmilyPlaceHolder.jpg'),
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
  Marin: require('../../assets/Armor/MarinPlaceHolder.jpg'),
  Sasha: require('../../assets/Armor/SashaPlaceHolder.jpg'),
  Ian: require('../../assets/Armor/IanPlaceHolder.jpg'),
  Riker: require('../../assets/Armor/RikerPlaceHolder.jpg'),
  Dakota: require('../../assets/Armor/DakotaPlaceHolder_cleanup.jpg'),
  Laura: require('../../assets/Armor/LauraPlaceHolder_cleanup.jpg'),
  Waine: require('../../assets/Armor/WainePlaceHolder.jpg'),
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
  Rachel: require('../../assets/Armor/RachelPlaceHolder_cleanup.jpg'),
  Annabeth: require('../../assets/Armor/AnnabethPlaceHolder.jpg'),
  Levi: require('../../assets/Armor/LeviPlaceHolder.jpg'),
  Troy: require('../../assets/Armor/TroyPlaceHolder.jpg'),
  Gary: require('../../assets/Armor/GaryPlaceHolder_cleanup.jpg'),
  Jennine: require('../../assets/Armor/JenninePlaceHolder.jpg'),
  Sheryl: require('../../assets/Armor/SherylPlaceHolder.jpg'),
  Dorthy: require('../../assets/Armor/DorthyPlaceHolder.jpg'),
  'Great Grandma Parker': require('../../assets/Armor/ParkerPlaceHolder_cleanup.jpg'),
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
    codename: member.codename, // Use superhero codename
    family: family.family, // Store family separately
    screen: `${family.family}Screen`,
    clickable: true,
    position: [Math.floor((i + (familyIndex * 10)) / 3), (i + (familyIndex * 10)) % 3],
    image: characterImages[member.name] || require('../../assets/Armor/PlaceHolder.jpg'),
  }))
);

// 🎯 Merge base members with auto-generated family members
const fullOlympiansList = [...baseMembers, ...additionalMembers].filter(member => member.name); // Filter out empty names

export default fullOlympiansList;