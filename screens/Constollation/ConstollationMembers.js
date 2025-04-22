import constollationImages from './ConstollationImages';

// 🎯 Constollation Member List with Categories and Superhero Codenames
export const memberCategories = [
  {
    category: "Doctors",
    members: [
      { name: 'Beckstead', codename: 'Doctor', screen: '' },
      { name: 'Huffaker', codename: 'Dentist', screen: '' },
      { name: 'Misty', codename: 'Counselor', screen: '' },
    ],
  },
  {
    category: "Software",
    members: [
      { name: 'George Ray', codename: 'Pillar', screen: '' },
      { name: 'Brent Guymon', codename: 'Foundation', screen: '' },
      { name: 'Claudine Simonsen', codename: 'Architect', screen: '' },
      { name: 'Braiden Pedersen', codename: 'Compiler', screen: '' },
    ],
  },
  {
    category: "IT",
    members: [
      { name: 'Carey Anson', codename: 'Core Node', screen: '' },
      { name: 'Sean Fears', codename: 'Pathwalker', screen: '' },
      { name: 'John Bitter', codename: 'Flamebearer', screen: '' },
      { name: 'Nathan Meyer', codename: 'Geniusus', screen: '' },
      { name: 'Sarina Sinatra', codename: 'Sparkmind', screen: '' },
    ],
  },
  {
    category: "High School 12th",
    members: [
      { name: 'David Pilkington', codename: 'Digital Design', screen: '' },
      { name: 'Sennet Fraughton', codename: 'Government', screen: '' },
      { name: 'Mr. Feller', codename: 'Digital Art', screen: '' },
      { name: 'Nate Hillyard', codename: 'Art', screen: '' },
      { name: 'Kori Schriver', codename: 'English', screen: '' },
      { name: 'Jack Hattaway', codename: 'Art', screen: '' },
    ],
  },
  {
    category: "OT Seminary 12th",
    members: [
      { name: 'Bro. Mason', codename: 'OT', screen: '' },
      { name: 'Bro. Combs', codename: '', screen: '' },
    ],
  },
  {
    category: "High School 11th",
    members: [
      { name: 'Marc Allen', codename: 'Chemistry', screen: '' },
      { name: 'Chad Lythgoe', codename: 'Drivers Ed', screen: '' },
      { name: 'Weston Kidder', codename: 'Wood Work/Welding', screen: '' },
      { name: 'Mrs. Short', codename: 'Finance', screen: '' },
      { name: 'Lisa McLaws', codename: 'English', screen: '' },
      { name: 'Sharee Paxton', codename: 'Math', screen: '' },
      { name: 'Todd Ballif', codename: 'History', screen: '' },
      { name: 'Zachary Hansen', codename: 'Track', screen: '' },
    ],
  },
  {
    category: "D&C Seminary 11th",
    members: [
      { name: 'Bro. DeYoung', codename: 'The Revelator’s Spark', screen: '' },
      { name: 'Bro. Jenks', codename: 'DC', screen: '' },
    ],
  },
  {
    category: "High School 10th",
    members: [
      { name: 'Zak Erickson', codename: 'History', screen: '' },
      { name: 'Tood Campbell', codename: 'Band', screen: '' },
      { name: 'Roxey Caternzaro', codename: 'English', screen: '' },
      { name: 'Tana Johnson', codename: 'Math', screen: '' },
      { name: 'Mrs Perry', codename: 'Advisor', screen: '' },
      { name: 'Coach Fresques', codename: 'Coach', screen: '' },
      { name: 'Mr. Lauscher', codename: 'Biology', screen: '' },
      { name: 'Coach Simon', codename: 'Coach', screen: '' },
      { name: 'Mrs. Morfin', codename: 'Welding', screen: '' },
    ],
  },
  {
    category: "BoM Seminary 10th",
    members: [
      { name: 'Bro. Brodrick', codename: 'The Witness', screen: '' },
      { name: 'Bro. Hedlund', codename: 'The Scriptorian Spark', screen: '' },
    ],
  },
  {
    category: "Jr. High 9th",
    members: [
      { name: 'Mrs. Elysia Butler', codename: 'English', screen: '' },
      { name: 'Mr. Jackson', codename: 'Principal', screen: '' },
    ],
  },
  {
    category: "NT Seminary 9th",
    members: [
      { name: 'Bro. Valor', codename: 'The Lightkeeper', screen: '' },
      { name: 'Bro. Perston', codename: 'The Covenant Champion', screen: '' },
    ],
  },
  {
    category: "Jr. High 7th",
    members: [
      { name: 'Chad King', codename: 'Band', screen: '' },
      { name: 'Jeff Wittik', codename: 'Band', screen: '' },
      { name: 'Mr. Chandler', codename: 'Wood Work', screen: '' },
      { name: 'Mr. Allred', codename: 'History', screen: '' },
      { name: 'Mrs. Cox', codename: 'Advisor', screen: '' },
      { name: 'Sally Smith', codename: 'English', screen: '' },
      { name: 'Mrs. Maughan', codename: 'Science', screen: '' },
      { name: 'Coach Brooks', codename: 'Gym', screen: '' },
      { name: 'Mr. Hammerschmidt', codename: 'Advisor', screen: '' },
    ],
  },
  {
    category: "Jr. High 8th",
    members: [
      { name: 'Mrs. Anderson', codename: 'Geography', screen: '' },
      { name: 'Mrs. Spinney', codename: 'Math', screen: '' },
      { name: 'Mrs. Thompson', codename: 'Math', screen: '' },
      { name: 'Mrs. Davis', codename: 'Science', screen: '' },
    ],
  },
  {
    category: "Elementary",
    members: [
      { name: 'Mrs. Gilbert', codename: '2nd Grade Teacher', screen: '' },
      { name: 'Ms. Clawson', codename: '3rd Grade Teacher', screen: '' },
      { name: 'Mrs. MarryWeither', codename: '4th Grade Teacher', screen: '' },
      { name: 'Mrs. Brown', codename: 'Music Teacher', screen: '' },
      { name: 'Mrs. Anderson', codename: '6th Grade Teacher', screen: '' },
      { name: 'Ms. ', codename: '6th Grade Teacher', screen: '' },
    ],
  },
  // {
  //   category: "Influencers",
  //   members: [
  //     { name: 'Chris Pratt', codename: 'Star Lord', screen: '' },
  //     { name: 'Robert Downey Jr', codename: 'Iron Man', screen: '' },
  //     { name: 'Chris Hemsworth', codename: 'Thunder God', screen: '' },
  //     { name: 'Chris Evens', codename: 'Captain Shield', screen: '' },
  //     { name: 'Tom Holland', codename: 'Web Slinger', screen: '' },
  //     { name: 'Benedict Cumberbatch', codename: 'Mystic Master', screen: '' },
  //     { name: 'Elizabeth Olsen', codename: 'Scarlet Witch', screen: '' },
  //     { name: 'Jennifer Lawrence', codename: 'Arrow Flame', screen: '' },
  //     { name: 'Tom Hiddleston', codename: 'Trickster', screen: '' },
  //     { name: 'Imagine Dragons', codename: '', screen: '' },
  //     { name: 'One Republic', codename: '', screen: '' },
  //     { name: 'Cold Play', codename: '', screen: '' },
  //     { name: 'Pewdiepie', codename: 'Pixel King', screen: '' },
  //     { name: 'Grain', codename: 'Build Sage', screen: '' },
  //     { name: 'Mumbo', codename: 'Redstone Wizard', screen: '' },
  //     { name: 'Geminitay', codename: 'Crystal Crafter', screen: '' },
  //     { name: 'Scar', codename: 'Terrain Shaper', screen: '' },
  //     { name: 'Bdubs', codename: 'Block Maestro', screen: '' },
  //     { name: 'Impulsesv', codename: 'Tech Pulse', screen: '' },
  //     { name: 'Docm77', codename: 'Mechanic Lord', screen: '' },
  //     { name: 'Rendog', codename: 'Wild Howl', screen: '' },
  //     { name: 'Smallishbeans', codename: 'Pixel Knight', screen: '' },
  //     { name: 'Solidarity', codename: 'Team Flash', screen: '' },
  //     { name: 'Comicstorian', codename: 'Tale Spinner', screen: '' },
  //     { name: 'Bombastic', codename: '', screen: '' },
  //     { name: 'Smii7y', codename: '', screen: '' },
  //     { name: 'PlayswithGray', codename: '', screen: '' },
  //     { name: 'Thor Skywalker', codename: '', screen: '' },
  //     { name: 'Muselk', codename: '', screen: '' },
  //     { name: 'Lazarbeam', codename: '', screen: '' },
  //   ],
  // },
];

// 🎯 Generate member list with superhero codenames
const fullConstollationList = memberCategories.flatMap((categoryData, categoryIndex) => {
  return categoryData.members.map((member, memberIndex) => {
    const memberData = constollationImages[member.name] || { image: require('../../assets/Armor/PlaceHolder.jpg'), clickable: true };
    return {
      name: member.name,
      codename: member.codename,
      category: categoryData.category,
      screen: member.screen || '', // Use defined screen or default to empty string
      position: [Math.floor(memberIndex / 3), memberIndex % 3],
      ...memberData,
    };
  });
});

export default fullConstollationList;