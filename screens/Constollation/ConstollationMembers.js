import constollationImages from './ConstollationImages';

// 🎯 Constollation Member List with Categories and Superhero Codenames
export const memberCategories = [
  {
    category: "Doctors",
    members: [
      { name: 'Beckstead', codename: 'Healing Pulse' },
      { name: 'Huffaker', codename: 'Vital Spark' },
      { name: 'Misty', codename: '' },
    ],
  },
  {
    category: "Elementary",
    members: [
      { name: 'Mrs. Gilbert (2nd Grade)', codename: 'Chalk Whisperer' },
      { name: 'Ms. Clawson (3rd Grade)', codename: 'Story Weaver' },
      { name: 'Mrs. MarryWeither(4th Grade)', codename: 'Knowledge Bloom' },
      { name: 'Mrs. Brown(music)', codename: 'Melody Muse' },
      { name: 'Mrs. Anderson(6th Grade)', codename: 'Grade Titan' },
      { name: 'Ms. (6th Grade)', codename: 'Silent Mentor' },
    ],
  },
  {
    category: "Jr. High 7th",
    members: [
      { name: 'Chad King (Band)', codename: 'Brass Thunder' },
      { name: 'Jeff Wittik (Band)', codename: 'Rhythm Storm' },
      { name: 'Mr. Chandler', codename: 'Math Vortex' },
      { name: 'Mr. Allred', codename: 'Science Blaze' },
      { name: 'Mrs. Cox', codename: 'Word Smith' },
      { name: 'Sally Smith', codename: 'History Shade' },
      { name: 'Mrs. Maughan', codename: 'Art Flame' },
      { name: 'Coach Brooks', codename: 'Field Titan' },
      { name: 'Mr. Hammerschmidt', codename: 'Tech Phantom' },
    ],
  },
  {
    category: "Jr. High 8th",
    members: [
      { name: 'Mrs. Anderson', codename: 'Grade Sentinel' },
      { name: 'Mrs. Spinney', codename: 'Ink Shadow' },
      { name: 'Mrs. Thompson', codename: 'Echo Guide' },
      { name: 'Mrs. Davis', codename: 'Logic Star' },
    ],
  },
  {
    category: "Jr. High 9th",
    members: [
      { name: 'Mrs. Elysia Butler', codename: 'Wisdom Light' },
      { name: 'Mr. Jackson', codename: 'Steel Mentor' },
    ],
  },
  {
    category: "NT Seminary 9th",
    members: [
      { name: 'Bro. Valor', codename: 'Faith Beacon' },
      { name: 'Bro. Perston', codename: 'Spirit Flame' },
    ],
  },
  {
    category: "High School 10th",
    members: [
      { name: 'Tood Campbell', codename: 'Grid Iron' },
      { name: 'Roxey Caternzaro', codename: 'Dance Storm' },
      { name: 'Zak Erickson', codename: 'Code Blitz' },
      { name: 'Tana Johnson', codename: 'Voice Echo' },
      { name: 'Mrs Perry', codename: 'Lit Muse' },
      { name: 'Coach Fresques', codename: 'Track Flash' },
      { name: 'Mr. Lauscher', codename: 'Chem Spark' },
      { name: 'Coach Simon', codename: 'Hoop Master' },
      { name: 'Mrs. Morfin', codename: 'Lang Weaver' },
    ],
  },
  {
    category: "BoM Seminary 10th",
    members: [
      { name: 'Bro. Brodrick', codename: 'Scripture Sage' },
      { name: 'Bro. Hedlund', codename: 'Gospel Flame' },
    ],
  },
  {
    category: "High School 11th",
    members: [
      { name: 'Marc Allen', codename: 'Steel Scholar' },
      { name: 'Chad Lythgoe', codename: 'Field Striker' },
      { name: 'Mrs. Short', codename: 'Math Queen' },
      { name: 'Lisa McLaws', codename: 'Art Pulse' },
      { name: 'Sharee Paxton', codename: 'Hist Vortex' },
      { name: 'Todd Ballif', codename: 'Sci Titan' },
      { name: 'Weston Kidder', codename: 'Tech Surge' },
      { name: 'Zachary Hansen', codename: 'Sound Wave' },
    ],
  },
  {
    category: "D&C Seminary 11th",
    members: [
      { name: 'Bro. DeYoung', codename: 'Doctrine Star' },
      { name: 'Bro. Jenks', codename: 'Covenant Light' },
    ],
  },
  {
    category: "High School 12th",
    members: [
      { name: 'David Pilkington', codename: 'Grad Blaze' },
      { name: 'Mr. Feller', codename: 'Phys Storm' },
      { name: 'Nate Hillyard', codename: 'Code Phantom' },
      { name: 'Kori Schriver', codename: 'Lit Shadow' },
      { name: 'Jack Hattaway', codename: 'Stage Flash' },
      { name: 'Sennet Fraughton', codename: 'Field Hawk' },
    ],
  },
  {
    category: "OT Seminary 12th",
    members: [
      { name: 'Bro. Mason', codename: 'Testament Guide' },
    ],
  },
  {
    category: "College",
    members: [
      { name: 'Carey Anson', codename: 'Mind Forge' },
      { name: 'Sean Fears', codename: 'Steel Mind' },
      { name: 'John Bitter', codename: 'Quantum Spark' },
      { name: 'Nathan Meyer', codename: 'Data Surge' },
      { name: 'Sarina Sinatra', codename: 'Voice Star' },
      { name: 'George Ray', codename: 'Light Scholar' },
      { name: 'Brent', codename: 'Iron Scribe' },
      { name: 'Claudine', codename: 'Art Flame' },
      { name: 'Braiden', codename: 'Tech Vortex' },
    ],
  },
  {
    category: "Influencers",
    members: [
      { name: 'Chris Pratt', codename: 'Star Lord' },
      { name: 'Robert Downey Jr', codename: 'Iron Man' },
      { name: 'Chris Hemsworth', codename: 'Thunder God' },
      { name: 'Chris Evens', codename: 'Captain Shield' },
      { name: 'Tom Holland', codename: 'Web Slinger' },
      { name: 'Benedict Cumberbatch', codename: 'Mystic Master' },
      { name: 'Elizabeth Olsen', codename: 'Scarlet Witch' },
      { name: 'Jennifer Lawrence', codename: 'Arrow Flame' },
      { name: 'Tom Hiddleston', codename: 'Trickster' },
      { name: 'Imagine Dragons', codename: 'Sonic Pulse' },
      { name: 'One Republic', codename: 'Rhythm Tide' },
      { name: 'Cold Play', codename: 'Melody Sky' },
      { name: 'Pewdiepie', codename: 'Pixel King' },
      { name: 'Grain', codename: 'Build Sage' },
      { name: 'Mumbo', codename: 'Redstone Wizard' },
      { name: 'Geminitay', codename: 'Crystal Crafter' },
      { name: 'Scar', codename: 'Terrain Shaper' },
      { name: 'Bdubs', codename: 'Block Maestro' },
      { name: 'Impulsesv', codename: 'Tech Pulse' },
      { name: 'Docm77', codename: 'Mechanic Lord' },
      { name: 'Rendog', codename: 'Wild Howl' },
      { name: 'Smallishbeans', codename: 'Pixel Knight' },
      { name: 'Solidarity', codename: 'Team Flash' },
      { name: 'Comicstorian', codename: 'Tale Spinner' },
      { name: 'Bombastic', codename: 'Saga Star' },
      { name: 'Smii7y', codename: 'Jest Storm' },
      { name: 'PlayswithGray', codename: 'Game Shade' },
      { name: 'Thor Skywalker', codename: 'Force Sage' },
      { name: 'Muselk', codename: 'Battle Blitz' },
      { name: 'Lazarbeam', codename: 'Chaos Beam' },
    ],
  },
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