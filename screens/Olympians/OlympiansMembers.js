const baseMembers = [
  // { name: 'TBA', codename: '???', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
  // { name: '', codename: '', screen: '', clickable: false, position: [0, 2], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
  // { name: '', codename: '', screen: '', clickable: false, position: [1, 0], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
  // { name: '', codename: '', screen: '', clickable: false, position: [1, 1], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
  // { name: 'TBA', codename: '???', screen: '', clickable: false, position: [1, 2], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
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
      'Mary', 'Chance', 'Ava', 'SaCharlieantha',
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
      'Gary', 'Sara', 'Josh', 'Garden',
      'Sophia', 'Paisley', 'Ellie',
    ],
  },
  {
    family: 'Cummings',
    members: [
      'Sean', 'Heather', 'Brett', 'Jake',
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
      'Daisy', 'Rose', 'Mikie', 'Prairie', 'Ryan',
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
    'Sheryl', 'Dorthy', 'Great Grandma Parker', 'Samantha',
    'Daniel', 'Rachel', 'Ryan', 'Sophia',
  ],
},
{
  family: 'Eduria',
  members: [
    'Marlyn', 'Robert', 'Arlene', 'Kris',
    'Carlo', 'Rachel', 'Cham Cham',
  ],
},
];

// 🎯 Generate additional members with family names and auto-assign positions
const additionalMembers = familyData.flatMap((family, familyIndex) =>
  family.members.map((member, i) => ({
    name: member,
    codename: `${family.family}`,
    screen: `${family.family}Screen`,
    clickable: false,
    position: [Math.floor((i + (familyIndex * 10)) / 3), (i + (familyIndex * 10)) % 3],
    image: require('../../assets/Armor/DefaultPlaceholder.jpg'),
  }))
);

// 🎯 Merge base members with auto-generated family members
const fullOlympiansList = [...baseMembers, ...additionalMembers];

export default fullOlympiansList;
