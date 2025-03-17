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
      'Savanna', 'Lee', 'Emily', 'Samantha',
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
      'Wesley', 'Melisa', 'Jackson', 'Mason',
      'Rylie', 'Sammy',
    ],
  },
  {
    family: 'Stillman',
    members: [
      'David', 'Isiade', 'Darron', 'Isabel',
    ],
  },
  {
    family: 'Stillman',
    members: [
      'Gary jr', 'Sara', 'Josh', 'Garden',
      'Sophia', 'Paisley', 'Ellie',
    ],
  },
  {
    family: 'Cummings',
    members: [
      'Sean', 'Heather', 'Brett small', 'Jake',
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
      'Matt', 'Jessica', 'Kyle', 'Samantha',
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
  Savanna: require('../../assets/Armor/SavannaPlaceHolder.jpg'),
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
  Annie: require('../../assets/Armor/AnniePlaceHolder.jpg'),
  Paul: require('../../assets/Armor/PaulPlaceHolder.jpg'),
  McKinley: require('../../assets/Armor/McKinleyPlaceHolder.jpg'),
  Whitney: require('../../assets/Armor/WhitneyPlaceHolder.jpg'),
  Vinson: require('../../assets/Armor/VinsonPlaceHolder.jpg'),
  Wesley: require('../../assets/Armor/WesleySPlaceHolder.jpg'),
  Melisa: require('../../assets/Armor/MelisaPlaceHolder.jpg'),
  Jackson: require('../../assets/Armor/JacksonPlaceHolder.jpg'),
  Mason: require('../../assets/Armor/MasonSPlaceHolder.jpg'),
  Rylie: require('../../assets/Armor/RyliePlaceHolder.jpg'),
  Sammy: require('../../assets/Armor/SammyPlaceHolder.jpg'),
  David: require('../../assets/Armor/DavidPlaceHolder.jpg'),
  Isiade: require('../../assets/Armor/IsiadePlaceHolder.jpg'),
  Darron: require('../../assets/Armor/DarronPlaceHolder.jpg'),
  Isabel: require('../../assets/Armor/IsabelPlaceHolder.jpg'),
  'Gary jr': require('../../assets/Armor/PlaceHolder.jpg'),
  Sara: require('../../assets/Armor/PlaceHolder.jpg'),
  Josh: require('../../assets/Armor/PlaceHolder.jpg'),
  Garden: require('../../assets/Armor/PlaceHolder.jpg'),
  Sophia: require('../../assets/Armor/PlaceHolder.jpg'),
  Paisley: require('../../assets/Armor/PlaceHolder.jpg'),
  Ellie: require('../../assets/Armor/PlaceHolder.jpg'),
  Sean: require('../../assets/Armor/PlaceHolder.jpg'),
  'Brett small': require('../../assets/Armor/PlaceHolder.jpg'),
  Jake: require('../../assets/Armor/PlaceHolder.jpg'),
  Ailey: require('../../assets/Armor/PlaceHolder.jpg'),
  Aubrey: require('../../assets/Armor/PlaceHolder.jpg'),
  James: require('../../assets/Armor/PlaceHolder.jpg'),
  Ryan: require('../../assets/Armor/PlaceHolder.jpg'),
  Marin: require('../../assets/Armor/PlaceHolder.jpg'),
  Sasha: require('../../assets/Armor/PlaceHolder.jpg'),
  Ian: require('../../assets/Armor/PlaceHolder.jpg'),
  Riker: require('../../assets/Armor/PlaceHolder.jpg'),
  Dakota: require('../../assets/Armor/PlaceHolder.jpg'),
  Laura: require('../../assets/Armor/PlaceHolder.jpg'),
  Waine: require('../../assets/Armor/PlaceHolder.jpg'),
  Elizabeth: require('../../assets/Armor/PlaceHolder.jpg'),
  Christopher: require('../../assets/Armor/PlaceHolder.jpg'),
  Tom: require('../../assets/Armor/PlaceHolder.jpg'),
  Brett: require('../../assets/Armor/PlaceHolder.jpg'),
  Angie: require('../../assets/Armor/PlaceHolder.jpg'),
  Bryce: require('../../assets/Armor/PlaceHolder.jpg'),
  Lillie: require('../../assets/Armor/PlaceHolder.jpg'),
  Addie: require('../../assets/Armor/PlaceHolder.jpg'),
  Matt: require('../../assets/Armor/PlaceHolder.jpg'),
  Jessica: require('../../assets/Armor/PlaceHolder.jpg'),
  Kyle: require('../../assets/Armor/PlaceHolder.jpg'),
  Daisy: require('../../assets/Armor/PlaceHolder.jpg'),
  Rose: require('../../assets/Armor/PlaceHolder.jpg'),
  Mikie: require('../../assets/Armor/PlaceHolder.jpg'),
  Prairie: require('../../assets/Armor/PlaceHolder.jpg'),
  'Ryan kid': require('../../assets/Armor/PlaceHolder.jpg'),
  Chad: require('../../assets/Armor/PlaceHolder.jpg'),
  Rachel: require('../../assets/Armor/PlaceHolder.jpg'),
  Annabeth: require('../../assets/Armor/PlaceHolder.jpg'),
  Levi: require('../../assets/Armor/PlaceHolder.jpg'),
  Troy: require('../../assets/Armor/PlaceHolder.jpg'),
  Gary: require('../../assets/Armor/PlaceHolder.jpg'),
  Jennine: require('../../assets/Armor/PlaceHolder.jpg'),
  Sheryl: require('../../assets/Armor/PlaceHolder.jpg'),
  Dorthy: require('../../assets/Armor/PlaceHolder.jpg'),
  'Great Grandma Parker': require('../../assets/Armor/PlaceHolder.jpg'),
  Marlyn: require('../../assets/Armor/PlaceHolder.jpg'),
  Robert: require('../../assets/Armor/PlaceHolder.jpg'),
  'Arlene Hendricks': require('../../assets/Armor/PlaceHolder.jpg'),
  'Nate Hendricks': require('../../assets/Armor/PlaceHolder.jpg'),
  Kris: require('../../assets/Armor/PlaceHolder.jpg'),
  Carlo: require('../../assets/Armor/PlaceHolder.jpg'),
  'Cham Cham Kaleigha': require('../../assets/Armor/PlaceHolder.jpg'),
};

// 🎯 Generate additional members with family names and auto-assign positions
const additionalMembers = familyData.flatMap((family, familyIndex) =>
  family.members.map((member, i) => ({
    name: member,
    codename: `${family.family}`,
    screen: `${family.family}Screen`,
    clickable: false,
    position: [Math.floor((i + (familyIndex * 10)) / 3), (i + (familyIndex * 10)) % 3],
    image: characterImages[member] || require('../../assets/Armor/PlaceHolder.jpg'),
  }))
);

// 🎯 Merge base members with auto-generated family members
const fullOlympiansList = [...baseMembers, ...additionalMembers];

export default fullOlympiansList;
