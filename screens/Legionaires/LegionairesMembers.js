import legionImages from './LegionairesImages';

// 🎯 Legionaires Member List with Categories and Superhero Codenames
export const memberCategories = [
  {
    category: "College",
    members: [
      { name: 'Mason Erickson', codename: 'Quantum Leap' },
      { name: 'Davis Clark', codename: 'Spectra' },
    ],
  },
  {
    category: "High School",
    members: [
      { name: 'Sanfor Duncan', codename: 'Thunderbolt' },
      { name: 'Kenndedy Carman', codename: 'Shadowstrike' },
      { name: 'Jessica Fisher', codename: 'Aurora' },
      { name: 'Jack', codename: 'Blaze' },
      { name: 'Emily', codename: 'Frostbite' },
      { name: 'Sam', codename: 'Vortex' },
      { name: 'Spencer', codename: 'Nova' },
      { name: 'Cody Cline', codename: 'Riptide' },
      { name: 'Kinnley Cline', codename: 'Eclipse' },
      { name: 'Justin', codename: 'Inferno' },
      { name: 'Zack', codename: 'Gale Force' },
      { name: 'Magic Matt', codename: 'Illusionist' },
      { name: 'Emery', codename: 'Mirage' },
      { name: 'Mason', codename: 'Titan' },
      { name: 'Xavier', codename: 'Phantom' },
      { name: 'Dylan', codename: 'Stormchaser' },
    ],
  },
  {
    category: "Jr. High",
    members: [
      { name: 'Paxton', codename: 'Spark' },
      { name: 'Spencer Hill', codename: 'Lightning Bolt' },
      { name: 'Cassidy Cline', codename: 'Siren' },
      { name: 'Adam Leger', codename: 'Steel Wing' },
      { name: 'Carter Olsen', codename: 'Nightshade' },
      { name: 'Sam Philips', codename: 'Tempest' },
      { name: 'Will Knight', codename: 'Crusader' },
      { name: 'Natalie', codename: 'Luminara' },
      { name: 'Kanyon', codename: 'Cyclone' },
      { name: 'Steven', codename: 'Obsidian' },
      { name: 'Kaden Hansen', codename: 'Flare' },
    ],
  },
  {
    category: "Elementary",
    members: [
      { name: 'Josh Noble', codename: 'Mini Blitz' },
      { name: 'Matt Lehpi', codename: 'Glow' },
      { name: 'Jose Rodriguez', codename: 'Sonic' },
      { name: 'Tayton Baker', codename: 'Flashpoint' },
      { name: 'Veronica Teaford', codename: 'Crystal' },
      { name: 'Erica Teaford', codename: 'Mist' },
      { name: 'Nate Greene', codename: 'Bolt' },
      { name: 'Ivan Aparicio', codename: 'Shadow' },
      { name: 'Kaden Hansen', codename: 'Sparkle' },
      { name: 'Nicolous', codename: 'Whirlwind' },
      { name: 'Bridger', codename: 'Rune' },
      { name: 'Noah', codename: 'Torrent' },
      { name: 'Elise', codename: 'Glacier' },
      { name: 'Brigdan', codename: 'Ember' },
      { name: 'Addie', codename: 'Aurora' },
      { name: 'Dustin Kong', codename: 'Iron Spark' },
      { name: 'Kason', codename: 'Zephyr' },
      { name: 'Kody', codename: 'Blizzard' },
      { name: 'Lupi', codename: 'Vapor' },
      { name: 'Shania', codename: 'Radiance' },
      { name: 'Elizabeth', codename: 'Frost' },
    ],
  },
  {
    category: "Acquaintances",
    members: [
      { name: 'Sheryl', codename: 'Sage' },
      { name: 'Krystal', codename: 'Prism' },
      { name: 'Deb', codename: 'Oracle' },
      { name: 'Jack Smith', codename: 'Sentinel' },
      { name: 'Dustin Edmonds', codename: 'Falcon' },
    ],
  },
];

// 🎯 Generate member list with actual superhero codenames
const fullLegionairesList = memberCategories.flatMap((categoryData, categoryIndex) => {
  return categoryData.members.map((member, memberIndex) => {
    const memberData = legionImages[member.name] || { image: require('../../assets/Armor/PlaceHolder.jpg'), clickable: false };
    return {
      name: member.name,
      codename: member.codename, // Use the superhero codename here
      category: categoryData.category, // Store category separately
      screen: `Member${categoryIndex * 100 + memberIndex + 1}`,
      position: [Math.floor(memberIndex / 3), memberIndex % 3],
      ...memberData,
    };
  });
});

export default fullLegionairesList;