import constollationImages from './ConstollationImages';

// 🎯 Constollation Member List with Categories and Superhero Codenames
export const memberCategories = [
  {
    category: "Doctors",
    members: [
      { name: 'Beckstead', codename: 'Doctor' },
      { name: 'Huffaker', codename: 'Dentist' },
      { name: 'Misty', codename: 'Counselor' },
    ],
  },
  {
    category: "Elementary",
    members: [
      { name: 'Mrs. Gilbert', codename: '2nd Grade Teacher' },
      { name: 'Ms. Clawson', codename: '3rd Grade Teacher' },
      { name: 'Mrs. MarryWeither', codename: '4th Grade Teacher' },
      { name: 'Mrs. Brown', codename: 'Music Teacher' },
      { name: 'Mrs. Anderson', codename: '6th Grade Teacher' },
      { name: 'Ms. ', codename: '6th Grade Teacher' },
    ],
  },
  {
    category: "Jr. High 7th",
    members: [
      { name: 'Chad King', codename: 'Band' },
      { name: 'Jeff Wittik', codename: 'Band' },
      { name: 'Mr. Chandler', codename: 'Wood Work' },
      { name: 'Mr. Allred', codename: 'History' },
      { name: 'Mrs. Cox', codename: 'Advisor' },
      { name: 'Sally Smith', codename: 'English' },
      { name: 'Mrs. Maughan', codename: 'Science' },
      { name: 'Coach Brooks', codename: 'Gym' },
      { name: 'Mr. Hammerschmidt', codename: 'Advisor' },
    ],
  },
  {
    category: "Jr. High 8th",
    members: [
      { name: 'Mrs. Anderson', codename: 'Geography' },
      { name: 'Mrs. Spinney', codename: 'Math' },
      { name: 'Mrs. Thompson', codename: 'Math' },
      { name: 'Mrs. Davis', codename: 'Science' },
    ],
  },
  {
    category: "Jr. High 9th",
    members: [
      { name: 'Mrs. Elysia Butler', codename: 'English' },
      { name: 'Mr. Jackson', codename: 'Principle' },
    ],
  },
  {
    category: "NT Seminary 9th",
    members: [
      { name: 'Bro. Valor', codename: '' },
      { name: 'Bro. Perston', codename: '' },
    ],
  },
  {
    category: "High School 10th",
    members: [
      { name: 'Tood Campbell', codename: 'Band' },
      { name: 'Roxey Caternzaro', codename: 'English' },
      { name: 'Zak Erickson', codename: 'History' },
      { name: 'Tana Johnson', codename: 'Math' },
      { name: 'Mrs Perry', codename: 'Advisor' },
      { name: 'Coach Fresques', codename: 'Couch' },
      { name: 'Mr. Lauscher', codename: 'Biology' },
      { name: 'Coach Simon', codename: 'Couch' },
      { name: 'Mrs. Morfin', codename: 'Welding' },
    ],
  },
  {
    category: "BoM Seminary 10th",
    members: [
      { name: 'Bro. Brodrick', codename: '' },
      { name: 'Bro. Hedlund', codename: '' },
    ],
  },
  {
    category: "High School 11th",
    members: [
      { name: 'Marc Allen', codename: 'Chemistry' },
      { name: 'Chad Lythgoe', codename: 'Drviers Ed' },
      { name: 'Mrs. Short', codename: '' },
      { name: 'Lisa McLaws', codename: 'English' },
      { name: 'Sharee Paxton', codename: 'Math' },
      { name: 'Todd Ballif', codename: 'History' },
      { name: 'Weston Kidder', codename: 'Wood Work/Welding' },
      { name: 'Zachary Hansen', codename: 'Track' },
    ],
  },
  {
    category: "D&C Seminary 11th",
    members: [
      { name: 'Bro. DeYoung', codename: '' },
      { name: 'Bro. Jenks', codename: '' },
    ],
  },
  {
    category: "High School 12th",
    members: [
      { name: 'David Pilkington', codename: 'Digital Design' },
      { name: 'Mr. Feller', codename: 'Digital Art' },
      { name: 'Nate Hillyard', codename: 'Art' },
      { name: 'Kori Schriver', codename: 'English' },
      { name: 'Jack Hattaway', codename: 'Art' },
      { name: 'Sennet Fraughton', codename: 'Government' },
    ],
  },
  {
    category: "OT Seminary 12th",
    members: [
      { name: 'Bro. Mason', codename: '' },
    ],
  },
  {
    category: "College",
    members: [
      { name: 'Carey Anson', codename: 'IT' },
      { name: 'Sean Fears', codename: 'IT' },
      { name: 'John Bitter', codename: 'IT' },
      { name: 'Nathan Meyer', codename: 'IT' },
      { name: 'Sarina Sinatra', codename: 'IT' },
      { name: 'George Ray', codename: 'Software' },
      { name: 'Brent', codename: 'Software' },
      { name: 'Claudine', codename: 'Software' },
      { name: 'Braiden', codename: 'Software' },
    ],
  },
  // {
  //   category: "Influencers",
  //   members: [
  //     { name: 'Chris Pratt', codename: 'Star Lord' },
  //     { name: 'Robert Downey Jr', codename: 'Iron Man' },
  //     { name: 'Chris Hemsworth', codename: 'Thunder God' },
  //     { name: 'Chris Evens', codename: 'Captain Shield' },
  //     { name: 'Tom Holland', codename: 'Web Slinger' },
  //     { name: 'Benedict Cumberbatch', codename: 'Mystic Master' },
  //     { name: 'Elizabeth Olsen', codename: 'Scarlet Witch' },
  //     { name: 'Jennifer Lawrence', codename: 'Arrow Flame' },
  //     { name: 'Tom Hiddleston', codename: 'Trickster' },
  //     { name: 'Imagine Dragons', codename: '' },
  //     { name: 'One Republic', codename: '' },
  //     { name: 'Cold Play', codename: '' },
  //     { name: 'Pewdiepie', codename: 'Pixel King' },
  //     { name: 'Grain', codename: 'Build Sage' },
  //     { name: 'Mumbo', codename: 'Redstone Wizard' },
  //     { name: 'Geminitay', codename: 'Crystal Crafter' },
  //     { name: 'Scar', codename: 'Terrain Shaper' },
  //     { name: 'Bdubs', codename: 'Block Maestro' },
  //     { name: 'Impulsesv', codename: 'Tech Pulse' },
  //     { name: 'Docm77', codename: 'Mechanic Lord' },
  //     { name: 'Rendog', codename: 'Wild Howl' },
  //     { name: 'Smallishbeans', codename: 'Pixel Knight' },
  //     { name: 'Solidarity', codename: 'Team Flash' },
  //     { name: 'Comicstorian', codename: 'Tale Spinner' },
  //     { name: 'Bombastic', codename: '' },
  //     { name: 'Smii7y', codename: '' },
  //     { name: 'PlayswithGray', codename: '' },
  //     { name: 'Thor Skywalker', codename: '' },
  //     { name: 'Muselk', codename: '' },
  //     { name: 'Lazarbeam', codename: '' },
  //   ],
  // },
];

// 🎯 Generate member list with superhero codenames
const fullConstollationList = memberCategories.flatMap((categoryData, categoryIndex) => {
  return categoryData.members.map((member, memberIndex) => {
    const memberData = constollationImages[member.name] || { image: require('../../assets/Armor/PlaceHolder.jpg'), clickable: false };
    return {
      name: member.name,
      codename: member.codename, // Use superhero codename
      category: categoryData.category, // Store category separately
      screen: `Member${categoryIndex * 100 + memberIndex + 1}`,
      position: [Math.floor(memberIndex / 3), memberIndex % 3],
      ...memberData,
    };
  });
});

export default fullConstollationList;