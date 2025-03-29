import legionImages from './LegionairesImages';

// 🎯 Legionaires Member List with Categories
export const memberCategories = [
  {
    category: "College",
    members: ['Mason Erickson', 'Davis Clark'],
  },
  {
    category: "High School",
    members: [
      'Sanfor Duncan', 'Kenndedy Carman', 'Jessica Fisher', 'Jack', 'Emily', 'Sam',
      'Spencer', 'Cody Cline', 'Kinnley Cline', 'Justin', 'Zack', 'Magic Matt',
      'Emery', 'Mason', 'Xavier', 'Dylan',
    ],
  },
  {
    category: "Jr. High",
    members: [
      'Paxton', 'Spencer Hill', 'Cassidy Cline', 'Adam Leger', 'Carter Olsen',
      'Sam Philips', 'Will Knight', 'Natalie', 'Kanyon', 'Steven', 'Kaden Hansen',
    ],
  },
  {
    category: "Elementary",
    members: [
      'Josh Noble', 'Matt Lehpi', 'Jose Rodriguez', 'Tayton Baker', 'Veronica Teaford',
      'Erica Teaford', 'Nate Greene', 'Ivan Aparicio', 'Kaden Hansen', 'Nicolous',
      'Bridger', 'Noah', 'Elise', 'Brigdan', 'Addie', 'Dustin Kong', 'Kason', 'Kody',
      'Lupi', 'Shania', 'Elizabeth',
    ],
  },
  {
    category: "Acquaintances",
    members: ['Sheryl', 'Krystal', 'Deb', 'Jack Smith', 'Dustin Edmonds'],
  },
];

// 🎯 Generate member list with category as codename
const fullLegionairesList = memberCategories.flatMap((categoryData, categoryIndex) => {
  return categoryData.members.map((name, memberIndex) => {
    const memberData = legionImages[name] || { image: require('../../assets/Armor/PlaceHolder.jpg'), clickable: false };
    return {
      name,
      codename: categoryData.category,
      screen: `Member${categoryIndex * 100 + memberIndex + 1}`,
      position: [Math.floor(memberIndex / 3), memberIndex % 3],
      ...memberData,
    };
  });
});

export default fullLegionairesList;