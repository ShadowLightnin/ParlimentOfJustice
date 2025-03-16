import legionImages from './LegionairesImages';

// 🎯 Base Legionaires Members
const baseLegionaires = [];

// 🎯 Legionaires Member List
const moreMembers = [
    'Mason Erickson','Davis Clark','Cody Cline','Kinnley Cline','Cassidy Cline','Jack Smith','Dylan',
    'Jessica Fisher','Dustin Edmonds','Justin','Zack','Josh Noble','Will Knight','Christian','John','Jose','Matt L','Anthony','Miles','Cieanna',
    'Natalie','Kanyon','Emily','Jarom','Avery','Emily','Kennedy Carman','Sydney','Hunter','Cami Webb','Spencer Hill',
    'Clayton','Spencer L','Malia Holley','Mika','Jason','Allysa','Josh','John 1','John 2','Abby','Tagun','Adam Ledger',
    'Sam','Kaden Hanson 1','Sam Philops','Carter Olsen','Issac Philops','Hayden','Hayden','Parker Gold','Gabe Parker',
    'Sanford Duncan ','Lizzy','Kyle','Ivan','Grace','Kaden Hansen 2','Kaia','Erica','Veronica','Elizabeth','Shanna','Lupa',
    'Kody','Nate Greene','Nick','Thomas','Kason','Bridger','Abby','Addie','Brigdon','Noah','Elsie','Mason','Emery Clark',
    'Xzavier','Quinton','Quinton C','Quincy',
  ];

// 🎯 Generate member list with images and positions
const generatedMembers = moreMembers.map((name, i) => ({
  name,
  codename: 'Legion Member',
  screen: `Member${i + 1}`,
  clickable: false,
  position: [Math.floor(i / 3), i % 3],
  image: legionImages[name] || require('../../assets/Armor/DefaultPlaceHolder.jpg'),
}));

// 🎯 Final list combining base members with generated members
const fullLegionairesList = [...baseLegionaires, ...generatedMembers];

export default fullLegionairesList;
