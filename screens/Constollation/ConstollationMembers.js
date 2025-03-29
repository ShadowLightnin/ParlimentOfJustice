import constollationImages from './ConstollationImages';

// 🎯 Constollation Member List with Categories
export const memberCategories = [
  {
    category: "Doctors",
    members: ['Beckstead', 'Huffaker'],
  },
  {
    category: "Elementary",
    members: [
      'Mrs. Gilbert (2nd Grade)', 'Ms. Clawson (3rd Grade)', 'Mrs. MarryWeither(4th Grade)', 
      'Mrs. Brown(music)', 'Mrs. Anderson(6th Grade)', 'Ms. (6th Grade)',
    ],
  },
  {
    category: "Jr. High 7th",
    members: [
      'Chad King (Band)', 'Jeff Wittik (Band)', 'Mr. Chandler', 'Mr. Allred', 'Mrs. Cox', 
      'Sally Smith', 'Mrs. Maughan', 'Coach Brooks', 'Mr. Hammerschmidt',
    ],
  },
  {
    category: "Jr. High 8th",
    members: ['Mrs. Anderson', 'Mrs. Spinney', 'Mrs. Thompson', 'Mrs. Davis'],
  },
  {
    category: "Jr. High 9th",
    members: ['Mrs. Elysia Butler', 'Mr. Jackson'],
  },
  {
    category: "NT Seminary 9th",
    members: ['Bro. Valor', 'Bro. Perston'],
  },
  {
    category: "High School 10th",
    members: [
      'Tood Campbell', 'Roxey Caternzaro', 'Zak Erickson', 'Tana Johnson', 'Mrs Perry', 
      'Coach Fresques', 'Mr. Lauscher', 'Coach Simon', 'Mrs. Morfin',
    ],
  },
  {
    category: "BoM Seminary 10th",
    members: ['Bro. Brodrick', 'Bro. Hedlund'],
  },
  {
    category: "High School 11th",
    members: [
      'Marc Allen', 'Chad Lythgoe', 'Mrs. Short', 'Lisa McLaws', 'Sharee Paxton', 
      'Todd Ballif', 'Weston Kidder', 'Zachary Hansen',
    ],
  },
  {
    category: "D&C Seminary 11th",
    members: ['Bro. DeYoung', 'Bro. Jenks'],
  },
  {
    category: "High School 12th",
    members: [
      'David Pilkington', 'Mr. Feller', 'Nate Hillyard', 'Kori Schriver', 
      'Jack Hattaway', 'Sennet Fraughton',
    ],
  },
  {
    category: "OT Seminary 12th",
    members: ['Bro. Mason'],
  },
  {
    category: "College",
    members: [
      'Carey Anson', 'Sean Fears', 'John Bitter', 'Nathan Meyer', 'Sarina Sinatra', 
      'George Ray', 'Brent', 'Claudine', 'Braiden',
    ],
  },
  {
    category: "Influencers",
    members: [
      'Chris Pratt', 'Robert Downey Jr', 'Chris Hemsworth', 'Chris Evens', 'Tom Holland', 
      'Benedict Cumberbatch', 'Elizabeth Olsen', 'Jennifer Lawrence', 'Tom Hiddleston', 
      'Imagine Dragons', 'One Republic', 'Cold Play', 'Pewdiepie', 'Grain', 'Mumbo', 
      'Geminitay', 'Scar', 'Bdubs', 'Impulsesv', 'Docm77', 'Rendog', 'Smallishbeans', 
      'Solidarity', 'Comicstorian', 'Bombastic', 'Smii7y', 'PlayswithGray', 'Thor Skywalker', 
      'Muselk', 'Lazarbeam',
    ],
  },
  {
    category: "Acquaintances",
    members: ['Sheryl', 'Krystal', 'Deb'],
  },
];

// 🎯 Generate member list with category as codename
const fullConstollationList = memberCategories.flatMap((categoryData, categoryIndex) => {
  return categoryData.members.map((name, memberIndex) => {
    const memberData = constollationImages[name] || { image: require('../../assets/Armor/PlaceHolder.jpg'), clickable: false };
    return {
      name,
      codename: categoryData.category,
      screen: `Member${categoryIndex * 100 + memberIndex + 1}`,
      position: [Math.floor(memberIndex / 3), memberIndex % 3],
      ...memberData,
    };
  });
});

export default fullConstollationList;