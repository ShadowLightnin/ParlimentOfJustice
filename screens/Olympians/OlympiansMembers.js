// 🎯 Base Members (if any specific ones are required)
const baseMembers = [
  // { name: 'TBA', codename: '???', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
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
      'Heather', 'Bobby', 'Ammon', 'Piper',
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
  Angela: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Todd: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Savanna: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Lee: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Emily: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Samantha: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Ella: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Mary: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Chance: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Ava: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Charlie: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Heather: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Bobby: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Ammon: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Piper: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Annie: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Paul: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  McKinley: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Whitney: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Vinson: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Wesley: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Melisa: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Jackson: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Mason: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Rylie: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Sammy: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  David: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Isiade: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Darron: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Isabel: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  'Gary jr': require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Sara: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Josh: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Garden: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Sophia: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Paisley: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Ellie: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Sean: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  'Brett small': require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Jake: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Ailey: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Aubrey: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  James: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Ryan: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Marin: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Sasha: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Ian: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Riker: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Dakota: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Laura: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Waine: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Elizabeth: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Christopher: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Tom: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Brett: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Angie: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Bryce: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Lillie: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Addie: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Matt: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Jessica: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Kyle: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Daisy: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Rose: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Mikie: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Prairie: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  'Ryan kid': require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Chad: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Rachel: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Annabeth: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Levi: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Troy: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Gary: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Jennine: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Sheryl: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Dorthy: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  'Great Grandma Parker': require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Marlyn: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Robert: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  'Arlene Hendricks': require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  'Nate Hendricks': require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Kris: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  Carlo: require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  'Cham Cham Kaleigha': require('../../assets/Armor/DefaultPlaceHolder.jpg'),
};

// 🎯 Generate additional members with family names and auto-assign positions
const additionalMembers = familyData.flatMap((family, familyIndex) =>
  family.members.map((member, i) => ({
    name: member,
    codename: `${family.family}`,
    screen: `${family.family}Screen`,
    clickable: false,
    position: [Math.floor((i + (familyIndex * 10)) / 3), (i + (familyIndex * 10)) % 3],
    image: characterImages[member] || require('../../assets/Armor/DefaultPlaceHolder.jpg'),
  }))
);

// 🎯 Merge base members with auto-generated family members
const fullOlympiansList = [...baseMembers, ...additionalMembers];

export default fullOlympiansList;
