import legionImages from './LegionairesImages';

// 🎯 Legionaires Member List with Categories and Superhero Codenames
export const memberCategories = [
  {
    category: "College",
    members: [
      { name: 'Mason Erickson', codename: 'Might', screen: '', hardcoded: true },
      { name: 'Davis Clark', codename: 'Cyberman', screen: '', hardcoded: true },
      { name: 'Mckain Bailey', codename: 'Vowline', screen: '', hardcoded: true },
    ],
  },
  {
    category: "Aileen's Friends",
    members: [
      { name: 'Sheryl', codename: 'Sage', screen: '', hardcoded: true },
      { name: 'Krystel', codename: 'Prism', screen: '', hardcoded: true },
      { name: 'Deb', codename: 'Oracle', screen: '', hardcoded: true },
      { name: 'Emma BYU', codename: 'Strive', screen: '', hardcoded: true },
      { name: 'Jessica BYU', codename: 'Hopestead', screen: '', hardcoded: true },
      { name: 'Victoria', codename: 'Sari Bloom', screen: '', hardcoded: true },
    ],
  },
  {
    category: "Young Womens",
    members: [
      { name: 'Mika', codename: '', screen: '', hardcoded: true },
      { name: 'Malia', codename: '', screen: '', hardcoded: true },
      { name: 'Jami', codename: '', screen: '', hardcoded: true },
      { name: 'Cami', codename: '', screen: '', hardcoded: true },
      { name: 'Kanani', codename: '', screen: '', hardcoded: true },
    ],
  },
  {
    category: "High School",
    members: [
      { name: 'Kenndedy Carman', codename: '', screen: '', hardcoded: true },
      { name: 'Jack Clark', codename: 'Blaze', screen: '', hardcoded: true },
      { name: 'Emma Bronson', codename: 'Synergy', screen: '', hardcoded: true },
      { name: 'Ella Duce', codename: 'Big Sister', screen: '', hardcoded: true },
      { name: 'Addison Morris', codename: 'Legend', screen: '', hardcoded: true },
      { name: 'Cody Cline', codename: 'Golden Prime', screen: '', hardcoded: true },
      { name: 'Alyssa', codename: '', screen: '', hardcoded: true },
      { name: 'Justin Platt', codename: 'Echo Wood', screen: '', hardcoded: true },
      { name: 'Zack Dustin', codename: 'Carved Echo', screen: '', hardcoded: true },
      { name: 'Josh Clark', codename: '', screen: '', hardcoded: true },
      { name: 'Jessica Fisher', codename: 'Aquanora', screen: '', hardcoded: true },
      { name: 'Miles Robinson', codename: '', screen: '', hardcoded: true },
      { name: 'Lizzy', codename: '', screen: '', hardcoded: true },
      { name: 'Sam', codename: '', screen: '', hardcoded: true },
      { name: 'Spencer', codename: '', screen: '', hardcoded: true },
      { name: 'Dylan', codename: 'Guardinous Rex', screen: '', hardcoded: true },
      { name: 'Kinnley Cline', codename: 'Harmony', screen: '', hardcoded: true },
      { name: 'Sanford Duncan', codename: 'Thunderbolt', screen: '', hardcoded: true },
      { name: 'Magic Matt', codename: 'Illusionist', screen: '', hardcoded: true },
      { name: 'Kanyon', codename: '', screen: '', hardcoded: true },
      { name: 'John', codename: '', screen: '', hardcoded: true },
      { name: 'Quinton', codename: '', screen: '', hardcoded: true },
      //fallen members by Sams hand
      { name: 'Emery', codename: '', screen: '', hardcoded: true },
      { name: 'Mason', codename: '', screen: '', hardcoded: true },
      { name: 'Xavier', codename: '', screen: '', hardcoded: true },
      { name: 'Josh Davis', codename: '', screen: '', hardcoded: true },
    ],
  },
  {
    category: "Jr. High",
    members: [
      { name: 'Paxton', codename: '', screen: '', hardcoded: true },
      { name: 'Spencer Hill', codename: '', screen: '', hardcoded: true },
      { name: 'Cassidy Cline', codename: 'Protector', screen: '', hardcoded: true },
      { name: 'Adam Leger', codename: '', screen: '', hardcoded: true },
      { name: 'Sam Phillips', codename: '', screen: '', hardcoded: true },
      { name: 'Will Knight', codename: 'Eagle Master', screen: '', hardcoded: true },
      { name: 'Hayden Perks', codename: '', screen: '', hardcoded: true },
      { name: 'Cienna', codename: '', screen: '', hardcoded: true },
      { name: 'Clayton', codename: '', screen: '', hardcoded: true },
      { name: 'Bridget', codename: '', screen: '', hardcoded: true },
      { name: 'Ryan', codename: '', screen: '', hardcoded: true },
      { name: 'Carson', codename: '', screen: '', hardcoded: true },
      { name: 'Sydney', codename: '', screen: '', hardcoded: true },
      { name: 'Natalie', codename: '', screen: '', hardcoded: true },
      //fallen members by Sams hand
      // { name: 'Carter Olsen', codename: '', screen: '' },
      // { name: 'Steven', codename: '', screen: '' },
      // { name: 'Kaden Hansen', codename: '', screen: '' },
      // { name: 'Olivia', codename: '', screen: '' },
      // { name: 'Quinton', codename: '', screen: '' },
      // { name: 'Quincy', codename: '', screen: '' },
      // { name: 'Hunter', codename: '', screen: '' },
      // { name: 'Niko', codename: '', screen: '' },
      // { name: 'Lincoln', codename: '', screen: '' },
      // { name: 'Anthony', codename: '', screen: '' },
      // { name: 'Starkey', codename: '', screen: '' },
      // { name: 'Issac', codename: '', screen: '' },
      // { name: 'Zach', codename: '', screen: '' },

      //Maybe add these
      // { name: 'Jackson', codename: '', screen: '' },
      // { name: 'Sami', codename: '', screen: '' },
      // { name: 'Samuel', codename: '', screen: '' },
      // { name: 'Jonathan', codename: '', screen: '' },
      // { name: 'Adam', codename: '', screen: '' },
      // { name: 'Kendra', codename: '', screen: '' },
      // { name: 'Charlotte', codename: '', screen: '' },
      // { name: 'Cheyenne', codename: '', screen: '' },
      // { name: 'Aaron', codename: '', screen: '' },
      // { name: 'Marshall', codename: '', screen: '' },
      // { name: 'Edger', codename: '', screen: '' },
      // { name: 'Bronwyn', codename: '', screen: '' },
      // { name: 'Jonas', codename: '', screen: '' },
      // { name: 'Jorge', codename: '', screen: '' },
      // { name: 'Jacob', codename: '', screen: '' },
      // { name: 'Marlane', codename: '', screen: '' },
    ],
  },
  {
    category: "Elementary",
    members: [
      { name: 'Josh Noble', codename: 'Golden Caster', screen: '', hardcoded: true },
      { name: 'Matt Lihpia', codename: '', screen: '', hardcoded: true },
      { name: 'Jose Rodriguez', codename: '', screen: '', hardcoded: true },
      { name: 'Jorge', codename: '', screen: '', hardcoded: true },
      { name: 'Tayton Baker', codename: '', screen: '', hardcoded: true },
      { name: 'Michael', codename: '', screen: '', hardcoded: true },
      { name: 'Thomas', codename: 'Mr. Dibs', screen: '', hardcoded: true },
      { name: 'Veronica Teaford', codename: '', screen: '', hardcoded: true },
      { name: 'Erica Teaford', codename: '', screen: '', hardcoded: true },
      { name: 'Nate Greene', codename: '', screen: '', hardcoded: true },
      { name: 'Ivan Aparicio', codename: '', screen: '', hardcoded: true },
      { name: 'Abby', codename: 'The Ghost', screen: '', hardcoded: true },
      { name: 'Lupa', codename: '', screen: '', hardcoded: true },
      { name: 'Shanna', codename: '', screen: '', hardcoded: true },
      { name: 'Elizabeth', codename: '', screen: '', hardcoded: true },
      { name: 'Noah', codename: '', screen: '', hardcoded: true },
      { name: 'Elise', codename: '', screen: '', hardcoded: true },
      { name: 'Brigdan', codename: '', screen: '', hardcoded: true },
      { name: 'Addie', codename: '', screen: '', hardcoded: true },
      //fallen members by Sams hand
      // { name: 'Kaden Hansen', codename: '', screen: '' },
      // { name: 'Nick', codename: '', screen: '' },
      // { name: 'Jose Chovez', codename: '', screen: '' },
      // { name: 'Bridger', codename: '', screen: '' },
      // { name: 'Dustin Khong', codename: '', screen: '' },
      // { name: 'Kason', codename: '', screen: '' },
      // { name: 'Kody', codename: '', screen: '' },
      // { name: 'Kason', codename: '', screen: '' },
      // { name: 'Kaia', codename: '', screen: '' },
      // { name: 'Gabe', codename: '', screen: '' },
      // { name: 'Raven', codename: '', screen: '' },
      // { name: 'Grace', codename: '', screen: '' },
      // { name: 'Kalie', codename: '', screen: '' },
      // { name: 'Mikeal', codename: '', screen: '' },
      // { name: 'Sierra', codename: '', screen: '' },
      // { name: 'Jocelyn', codename: '', screen: '' },
      // { name: 'Jocelyn', codename: '', screen: '' },
    ],
  },
  {
    category: "Acquaintances",
    members: [
      { name: 'Jack Smith', codename: 'Sentinel', screen: '', hardcoded: true },
      { name: 'Dustin Edmonds', codename: 'Falcon', screen: '', hardcoded: true },
    ],
  },
];

// 🎯 Generate member list with actual superhero codenames
const fullLegionairesList = memberCategories.flatMap((categoryData, categoryIndex) => {
  return categoryData.members.map((member, memberIndex) => {
    const memberData = legionImages[member.name] || { image: require('../../assets/Armor/PlaceHolder.jpg'), clickable: false };
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

export default fullLegionairesList;