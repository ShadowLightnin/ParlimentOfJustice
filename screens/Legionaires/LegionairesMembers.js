const LegionairesMembers = [
  // { name: 'Leader Name', codename: 'Legion Alpha', screen: 'Leader', clickable: false, position: [0, 0], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
  // { name: 'Member 1', codename: 'Legion Beta', screen: 'Member1', clickable: false, position: [0, 2], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
  // { name: 'Member 2', codename: 'Legion Gamma', screen: 'Member2', clickable: false, position: [1, 0], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
  // { name: 'Member 3', codename: 'Legion Delta', screen: 'Member3', clickable: false, position: [1, 1], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
  // { name: 'Member 4', codename: 'Legion Epsilon', screen: 'Member4', clickable: false, position: [1, 2], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
];

// Automatically generate additional members up to 78
const moreMembers = Array.from({ length: 100 }, (_, i) => ({
  name: `Member ${i + 1}`,
  codename: ` ${[
'Mason Erickson','Davis Clark','Cody Cline','Kinnley Cline','Cassidy Cline','Jack Smith','Dylan',
'Jessica Fisher','Dustin Edmonds','Justin','Zack','Josh Noble','Will Knight','Christian','John','Jose','Matt L','Anthony','Miles','Cieanna',
'Natalie','Kanyon','Emily','Jarom','Avery','Emily','Kennedy Carman','Sydney','Hunter','Cami Webb','Spencer Hill',
'Clayton','Spencer L','Malia Holley','Mika','Jason','Allysa','Josh','John 1','John 2','Abby','Tagun','Adam Ledger',
'Sam','Kaden Hanson 1','Sam Philops','Carter Olsen','Issac Philops','Hayden','Hayden','Parker Gold','Gabe Parker',
'Sanford Duncan ','Lizzy','Kyle','Ivan','Grace','Kaden Hansen 2','Kaia','Erica','Veronica','Elizabeth','Shanna','Lupa',
'Kody','Nate Greene','Nick','Thomas','Kason','Bridger','Abby','Addie','Brigdon','Noah','Elsie','Mason','Emery Clark',
'Xzavier','Quinton','Quinton C','Quincy',
  ][i]}`,
  screen: `Member${i + 5}`,
  clickable: false,
  position: [Math.floor((i + 5) / 3), (i + 5) % 3],
  image: require('../../assets/Armor/DefaultPlaceholder.jpg'),
}));

// Merge initial members with generated ones
const fullLegionairesList = [...LegionairesMembers, ...moreMembers];

export default fullLegionairesList;
