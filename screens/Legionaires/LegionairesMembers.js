import legionImages from './LegionairesImages';

// 🎯 Legionaires Member List with Categories and Superhero Codenames
export const memberCategories = [
  {
    category: "College",
    members: [
      { name: 'Mason Erickson', codename: 'Might', screen: '' },
      { name: 'Davis Clark', codename: 'Cyberman', screen: '' },
      { name: 'Mckain Bailey', codename: 'Vowline', screen: '' },
    ],
  },
  {
    category: "Aileen's Friends",
    members: [
      { name: 'Sheryl', codename: 'Sage', screen: '' },
      { name: 'Krystel', codename: 'Prism', screen: '' },
      { name: 'Deb', codename: 'Oracle', screen: '' },
      { name: 'Emma BYU', codename: 'Strive', screen: '' },
      { name: 'Jessica BYU', codename: 'Hopestead', screen: '' },
      { name: 'Victoria', codename: 'Sari Bloom', screen: '' },
    ],
  },
  {
    category: "Young Womens",
    members: [
      { name: 'Mika', codename: '', screen: '' },
      { name: 'Malia', codename: '', screen: '' },
      { name: 'Jami', codename: '', screen: '' },
      { name: 'Cami', codename: '', screen: '' },
      { name: 'Kanani', codename: '', screen: '' },
    ],
  },
  {
    category: "High School",
    members: [
      { name: 'Kenndedy Carman', codename: '', screen: '' },
      { name: 'Jack Clark', codename: 'Blaze', screen: '' },
      { name: 'Emma Bronson', codename: 'Synergy', screen: '' },
      { name: 'Ella Duce', codename: 'Big Sister', screen: '' },
      { name: 'Addison Morris', codename: 'Legend', screen: '' },
      { name: 'Cody Cline', codename: 'Golden Prime', screen: '' },
      { name: 'Alyssa', codename: '', screen: '' },
      { name: 'Justin Platt', codename: 'Echo Wood', screen: '' },
      { name: 'Zack Dustin', codename: 'Carved Echo', screen: '' },
      { name: 'Josh Clark', codename: '', screen: '' },
      { name: 'Jessica Fisher', codename: 'Aquanora', screen: '' },
      { name: 'Miles Robinson', codename: '', screen: '' },
      { name: 'Lizzy', codename: '', screen: '' },
      { name: 'Sam', codename: '', screen: '' },
      { name: 'Spencer', codename: '', screen: '' },
      { name: 'Dylan', codename: 'Guardinous Rex', screen: '' },
      { name: 'Kinnley Cline', codename: 'Harmony', screen: '' },
      { name: 'Sanford Duncan', codename: 'Thunderbolt', screen: '' },
      { name: 'Magic Matt', codename: 'Illusionist', screen: '' },
      { name: 'John', codename: '', screen: '' },
      //fallen members by Sams hand
      { name: 'Emery', codename: '', screen: '' },
      { name: 'Mason', codename: '', screen: '' },
      { name: 'Xavier', codename: '', screen: '' },
      { name: 'Josh Davis', codename: '', screen: '' },
    ],
  },
  {
    category: "Jr. High",
    members: [
      { name: 'Paxton', codename: '', screen: '' },
      { name: 'Spencer Hill', codename: '', screen: '' },
      { name: 'Cassidy Cline', codename: 'Protector', screen: '' },
      { name: 'Adam Leger', codename: '', screen: '' },
      { name: 'Sam Phillips', codename: '', screen: '' },
      { name: 'Will Knight', codename: 'Eagle Master', screen: '' },
      { name: 'Hayden Perks', codename: '', screen: '' },
      { name: 'Cienna', codename: '', screen: '' },
      { name: 'Clayton', codename: '', screen: '' },
      { name: 'Bridget', codename: '', screen: '' },
      { name: 'Ryan', codename: '', screen: '' },
      { name: 'Carson', codename: '', screen: '' },
      { name: 'Sydney', codename: '', screen: '' },
      { name: 'Natalia', codename: '', screen: '' },
      { name: 'Natalie', codename: '', screen: '' },
      { name: 'Kanyon', codename: '', screen: '' },
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
      { name: 'Josh Noble', codename: 'Golden Caster', screen: '' },
      { name: 'Matt Lihpia', codename: '', screen: '' },
      { name: 'Jose Rodriguez', codename: '', screen: '' },
      { name: 'Jorge', codename: '', screen: '' },
      { name: 'Tayton Baker', codename: '', screen: '' },
      { name: 'Michael', codename: '', screen: '' },
      { name: 'Thomas', codename: 'Mr. Dibs', screen: '' },
      { name: 'Veronica Teaford', codename: '', screen: '' },
      { name: 'Erica Teaford', codename: '', screen: '' },
      { name: 'Nate Greene', codename: '', screen: '' },
      { name: 'Ivan Aparicio', codename: '', screen: '' },
      { name: 'Abby', codename: 'The Ghost', screen: '' },
      { name: 'Lupa', codename: '', screen: '' },
      { name: 'Shanna', codename: '', screen: '' },
      { name: 'Elizabeth', codename: '', screen: '' },
      { name: 'Noah', codename: '', screen: '' },
      { name: 'Elise', codename: '', screen: '' },
      { name: 'Brigdan', codename: '', screen: '' },
      { name: 'Addie', codename: '', screen: '' },
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
      { name: 'Jack Smith', codename: 'Sentinel', screen: '' },
      { name: 'Dustin Edmonds', codename: 'Falcon', screen: '' },
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