// 🎯 Base Members (if any specific ones are required)
const baseMembers = [
  // { name: 'TBA', codename: '???', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
];

// 🎯 Families grouped with corresponding superhero codenames and positions
const familyData = [
  {
    family: 'Parents',
    members: [
      { name: 'Angela', codename: '' },
      { name: 'Todd', codename: '' },
    ],
  },
  {
    family: 'Jensen',
    members: [
      { name: 'Savannah', codename: '' },
      { name: 'Lee', codename: '' },
      { name: 'Emilee', codename: '' },
      { name: 'Samantha', codename: '' },
      { name: 'Ella', codename: '' },
    ],
  },
  {
    family: 'McNeil',
    members: [
      { name: 'Mary', codename: '' },
      { name: 'Chance', codename: '' },
      { name: 'Ava', codename: '' },
      { name: 'Charlie', codename: '' },
    ],
  },
  {
    family: 'Briggs',
    members: [
      { name: 'Heather S', codename: '' },
      { name: 'Bobby', codename: '' },
      { name: 'Ammon', codename: '' },
      { name: 'Piper', codename: '' },
    ],
  },
  {
    family: 'Bolander',
    members: [
      { name: 'Annie', codename: '' },
      { name: 'Paul', codename: '' },
      { name: 'McKinley', codename: '' },
      { name: 'Whitney', codename: '' },
      { name: 'Vinson', codename: '' },
    ],
  },
  {
    family: 'Stillman',
    members: [
      { name: 'Wesley', codename: '' },
      { name: 'Melissa', codename: '' },
      { name: 'Jackson', codename: '' },
      { name: 'Mason', codename: '' },
      { name: 'Rylie', codename: '' },
      { name: 'Sammy', codename: '' },
    ],
  },
  {
    family: 'Stillman',
    members: [
      { name: 'David', codename: '' },
      { name: 'Isaydy', codename: '' },
      { name: 'Darron', codename: '' },
      { name: 'Isabel', codename: '' },
    ],
  },
  {
    family: 'Stillman',
    members: [
      { name: 'Gary jr', codename: '' },
      { name: 'Sarah', codename: '' },
      { name: 'Josh', codename: '' },
      { name: 'Garden', codename: '' },
      { name: 'Sophia', codename: '' },
      { name: 'Paisley', codename: '' },
      { name: 'Ellie', codename: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Sean', codename: '' },
      { name: 'Heather C', codename: '' },
      { name: 'Brett small', codename: '' },
      { name: 'Jake', codename: '' },
      { name: 'Ailey', codename: '' },
      { name: 'Aubrey', codename: '' },
      { name: 'James', codename: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Ryan', codename: '' },
      { name: 'Maren', codename: '' },
      { name: 'Sasha', codename: '' },
      { name: 'Ian', codename: '' },
      { name: 'Riker', codename: '' },
      { name: 'Dakota', codename: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Lora', codename: '' },
      { name: 'Wayne', codename: '' },
      { name: 'Elizabeth', codename: '' },
      { name: 'Christopher', codename: '' },
      { name: 'Tom', codename: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Brett', codename: '' },
      { name: 'Angie', codename: '' },
      { name: 'Bryce', codename: '' },
      { name: 'Lillie', codename: '' },
      { name: 'Addie', codename: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Matt', codename: '' },
      { name: 'Jessica', codename: '' },
      { name: 'Kyle', codename: '' },
      { name: 'Daisy', codename: '' },
      { name: 'Rose', codename: '' },
      { name: 'Mikie', codename: '' },
      { name: 'Prairie', codename: '' },
      { name: 'Ryan kid', codename: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Chad', codename: '' },
      { name: 'Rochelle', codename: '' },
      { name: 'Annabeth', codename: '' },
      { name: 'Levi', codename: '' },
      { name: '', codename: '' },
      { name: '', codename: '' },
      { name: '', codename: '' },
    ],
  },
  {
    family: 'Cummings',
    members: [
      { name: 'Troy', codename: '' },
    ],
  },
  {
    family: 'Stillman Grandparents',
    members: [
      { name: 'Gary', codename: '' },
      { name: 'Jeanine', codename: '' },
    ],
  },
  {
    family: 'Cummings Grandparents',
    members: [
      { name: 'Sharrel', codename: '' },
      { name: 'Dorthy', codename: '' },
      { name: 'GMA Parker', codename: 'Great Grand' },
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