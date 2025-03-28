// 🎯 Base Members (if any specific ones are required)
const baseMembers = [
  // { name: 'TBA', codename: '???', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
];

// 🎯 Families grouped with corresponding codename and positions
const familyData = [
  {
    family: 'Parents',
    members: [
      'Angela', 'Todd',
    ],
  },
  {
    family: 'Jensen',
    members: [
      'Savannah', 'Lee', 'Emily', 'Samantha',
      'Ella',
    ],
  },
  {
    family: 'McNeil',
    members: [
      'Mary', 'Chance', 'Ava', 'Charlie',
    ],
  },
  {
    family: 'Briggs',
    members: [
      'Heather S', 'Bobby', 'Ammon', 'Piper',
    ],
  },
  {
    family: 'Bolander',
    members: [
      'Annie', 'Paul', 'McKinley', 'Whitney',
      'Vinson',
    ],
  },
  {
    family: 'Stillman',
    members: [
      'Wesley', 'Melissa', 'Jackson', 'Mason',
      'Rylie', 'Sammy',
    ],
  },
  {
    family: 'Stillman',
    members: [
      'David', 'Isaydy', 'Darron', 'Isabel',
    ],
  },
  {
    family: 'Stillman',
    members: [
      'Gary jr', 'Sarah', 'Josh', 'Garden',
      'Sophia', 'Paisley', 'Ellie',
    ],
  },
  {
    family: 'Cummings',
    members: [
      'Sean', 'Heather C', 'Brett small', 'Jake',
      'Ailey', 'Aubrey', 'James',
    ],
  },
  {
    family: 'Cummings',
    members: [
      'Ryan', 'Marin', 'Sasha', 'Ian',
      'Riker', 'Dakota',
    ],
  },
  {
    family: 'Cummings',
    members: [
      'Laura', 'Waine', 'Elizabeth', 'Christopher',
      'Tom',
    ],
  },
  {
    family: 'Cummings',
    members: [
      'Brett', 'Angie', 'Bryce', 'Lillie',
      'Addie',
    ],
  },
  {
    family: 'Cummings',
    members: [
      'Matt', 'Jessica', 'Kyle',
      'Daisy', 'Rose', 'Mikie', 'Prairie', 'Ryan kid',
    ],
  },
  {
    family: 'Cummings',
    members: [
      'Chad', 'Rachel', 'Annabeth', 'Levi',
      '', '',
    ],
  },
  {
    family: 'Cummings',
    members: [
      'Troy',
    ],
  },
  {
    family: 'Stillman Grandparents',
    members: [
      'Gary', 'Jennine',
    ],
  },
{
  family: 'Cummings Grandparents',
  members: [
    'Sheryl', 'Dorthy', 'Great Grandma Parker',
  ],
},
{
  family: 'Eduria',
  members: [
    'Marlyn', 'Robert', 'Arlene Hendricks', 'Nate Hendricks',
    'Kris', 'Carlo', 'Cham Cham Kaleigha',
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

// 🎯 Generate additional members with family names and auto-assign positions
const additionalMembers = familyData.flatMap((family, familyIndex) =>
  family.members.map((member, i) => ({
    name: member,
    codename: `${family.family}`,
    screen: `${family.family}Screen`,
    clickable: true,
    position: [Math.floor((i + (familyIndex * 10)) / 3), (i + (familyIndex * 10)) % 3],
    image: characterImages[member] || require('../../assets/Armor/PlaceHolder.jpg'),
  }))
);

// 🎯 Merge base members with auto-generated family members
const fullOlympiansList = [...baseMembers, ...additionalMembers];

export default fullOlympiansList;
